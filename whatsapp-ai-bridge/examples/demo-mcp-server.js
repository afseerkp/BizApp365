// A small example MCP server with fake BizApp365 data, so the bridge can be tested end to end.
// Replace it with your real MCP module by changing MCP_SERVER_COMMAND / MCP_SERVER_URL in .env.
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const PRODUCTS = [
  { sku: 'LAP-001', name: 'Business Laptop 14"', price: 3299, stock: 12 },
  { sku: 'MON-024', name: '24" Monitor', price: 649, stock: 0 },
  { sku: 'PRN-310', name: 'Thermal Receipt Printer', price: 499, stock: 31 },
];

const ORDERS = {
  'SO-1001': { status: 'Delivered', date: '2026-11-18', total: 3948 },
  'SO-1002': { status: 'Out for delivery', date: '2026-11-23', total: 499 },
};

const server = new McpServer({ name: 'bizapp365-demo', version: '1.1.0' });

// Roles, as the real ERP does it: who is messaging decides which tools they get.
// Demo numbers (last 9 digits): manager 501111111, salesman 502222222, customer 501234567.
const PEOPLE = {
  501111111: { role: 'manager', name: 'Owner' },
  502222222: { role: 'salesman', name: 'Sajeer' },
  501234567: { role: 'customer', name: 'Al Noor Trading' },
};
const who = (phone) => PEOPLE[String(phone ?? '').replace(/\D/g, '').slice(-9)] ?? { role: 'unknown', name: null };
const roles = (...r) => ({ 'bizapp365/roles': r });

const text = (value) => ({ content: [{ type: 'text', text: typeof value === 'string' ? value : JSON.stringify(value) }] });

server.registerTool(
  'get_business_info',
  { description: 'Company contact details and opening hours.', inputSchema: {} },
  async () =>
    text({
      company: 'BizApp365',
      email: 'sales@bizapp365.com',
      phone: '+971 58 288 5633',
      hours: 'Mon-Fri 9:00-18:00 (UAE time)',
    }),
);

server.registerTool(
  'search_products',
  {
    description: 'Search products by name or SKU. Returns price (AED) and stock quantity.',
    inputSchema: { query: z.string().describe('Product name or SKU, e.g. "laptop"') },
  },
  async ({ query }) => {
    const q = query.toLowerCase();
    const hits = PRODUCTS.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    return text(hits.length ? hits : `No products found for "${query}".`);
  },
);

server.registerTool(
  'get_order_status',
  {
    description: 'Look up a sales order by its number, e.g. SO-1001.',
    inputSchema: { order_number: z.string() },
  },
  async ({ order_number }) => {
    const order = ORDERS[order_number.toUpperCase()];
    return order ? text({ order_number, ...order }) : { ...text(`Order ${order_number} not found.`), isError: true };
  },
);

// Customer tools take `customer_phone`; the bridge hides it from the AI and fills in the real sender.
const BALANCES = { '501234567': { customer: 'Al Noor Trading', balance: 1250, currency: 'AED' } };

server.registerTool(
  'identify_sender',
  { description: 'Role of the sender, from their WhatsApp number.', inputSchema: { customer_phone: z.string() } },
  async ({ customer_phone }) => text(who(customer_phone)),
);

server.registerTool(
  'get_my_balance',
  {
    description: "The calling customer's account balance.",
    inputSchema: { customer_phone: z.string() },
    _meta: roles('customer'),
  },
  async ({ customer_phone }) => {
    const account = BALANCES[customer_phone.replace(/\D/g, '').slice(-9)];
    return text(account ?? 'No customer account is registered with this WhatsApp number.');
  },
);

server.registerTool(
  'send_statement_pdf',
  {
    description: 'The account statement as a PDF, sent to the sender on WhatsApp.',
    inputSchema: { customer_phone: z.string(), customer: z.string().optional() },
    _meta: roles('customer', 'salesman', 'manager'),
  },
  async ({ customer_phone, customer }) => {
    const sender = who(customer_phone);
    if (sender.role === 'unknown') return text('This WhatsApp number is not registered with the company.');
    const name = sender.role === 'customer' ? sender.name : (customer ?? 'Customer');
    const pdf = Buffer.from(`%PDF-1.4\n% Demo statement for ${name}\n%%EOF\n`);
    return {
      content: [
        { type: 'text', text: JSON.stringify({ customer: name, file: 'PDF statement attached' }) },
        {
          type: 'resource',
          resource: {
            uri: `demo://files/Statement-${encodeURIComponent(name)}.pdf`,
            mimeType: 'application/pdf',
            blob: pdf.toString('base64'),
          },
        },
      ],
    };
  },
);

server.registerTool(
  'get_sales_report',
  {
    description: "Sales for this month: a salesman's own customers, or the whole company for a manager.",
    inputSchema: { customer_phone: z.string() },
    _meta: roles('salesman', 'manager'),
  },
  async ({ customer_phone }) => {
    const sender = who(customer_phone);
    if (sender.role === 'manager') return text({ scope: 'Whole company', salesTotal: 182400, currency: 'AED' });
    if (sender.role === 'salesman') return text({ scope: `Customers of ${sender.name}`, salesTotal: 23150, currency: 'AED' });
    return text('This information is not available for this WhatsApp number.');
  },
);

await server.connect(new StdioServerTransport());

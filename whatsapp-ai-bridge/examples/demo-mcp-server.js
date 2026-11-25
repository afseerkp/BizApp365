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

const server = new McpServer({ name: 'bizapp365-demo', version: '1.0.0' });

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
  'get_my_balance',
  {
    description: "The calling customer's account balance.",
    inputSchema: { customer_phone: z.string() },
  },
  async ({ customer_phone }) => {
    const account = BALANCES[customer_phone.replace(/\D/g, '').slice(-9)];
    return text(account ?? 'No customer account is registered with this WhatsApp number.');
  },
);

await server.connect(new StdioServerTransport());

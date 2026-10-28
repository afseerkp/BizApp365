import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const docsDir = path.join(root, 'docs')

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function formatInline(value) {
  const escaped = escapeHtml(value)
  const withEmails = escaped.replace(
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    (email) => `<!--email_off--><a href="mailto:${email}">${email}</a><!--/email_off-->`,
  )
  return withEmails.replace(/https?:\/\/[^\s<]+/g, (url) => {
    const trailing = url.match(/[).,;:]+$/)?.[0] ?? ''
    const core = trailing ? url.slice(0, -trailing.length) : url
    return `<a href="${core}">${core}</a>${trailing}`
  })
}

function renderParagraphs(paragraphs) {
  return (paragraphs ?? []).map((paragraph) => `<p>${formatInline(paragraph)}</p>`).join('')
}

function renderBullets(items) {
  if (!items?.length) return ''
  return `<ul>${items.map((item) => `<li>${formatInline(item)}</li>`).join('')}</ul>`
}

function renderTable(table) {
  if (!table) return ''
  const caption = table.caption ? `<caption>${escapeHtml(table.caption)}</caption>` : ''
  const headers = `<tr>${table.headers.map((header) => `<th scope="col">${escapeHtml(header)}</th>`).join('')}</tr>`
  const rows = table.rows
    .map(
      (row) =>
        `<tr>${row
          .map((cell, index) =>
            index === 0 ? `<th scope="row">${escapeHtml(cell)}</th>` : `<td>${formatInline(cell)}</td>`,
          )
          .join('')}</tr>`,
    )
    .join('')
  return `<div class="table-wrap"><table>${caption}<thead>${headers}</thead><tbody>${rows}</tbody></table></div>`
}

function renderLinks(links) {
  if (!links?.length) return ''
  return `<ul>${links
    .map((link) => `<li><a href="${escapeHtml(link.href)}" rel="noopener noreferrer">${escapeHtml(link.label)}</a></li>`)
    .join('')}</ul>`
}

function renderSections(sections) {
  return sections
    .map((section) => {
      return `<section id="${escapeHtml(section.id)}"><h2>${escapeHtml(section.title)}</h2>${renderParagraphs(section.paragraphs)}${renderLinks(section.links)}${renderBullets(section.bullets)}${renderTable(section.table)}${renderParagraphs(section.paragraphsAfter)}${renderBullets(section.bulletsAfter)}</section>`
    })
    .join('\n')
}

function legalPageStyles() {
  return `
    :root { color-scheme: light; }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: "Plus Jakarta Sans", system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height: 1.65; color: #0f172a; background: #f8fafc; }
    a { color: #1976d2; }
    a:hover { text-decoration: underline; }
    header, footer { background: #020617; color: #cbd5e1; }
    header a, footer a { color: #e2e8f0; text-decoration: none; }
    header a:hover, footer a:hover { color: #fff; }
    .bar { max-width: 56rem; margin: 0 auto; padding: 1rem 1.25rem; display: flex; flex-wrap: wrap; gap: 0.75rem 1.25rem; align-items: center; justify-content: space-between; }
    .brand { display: flex; align-items: center; gap: 0.6rem; font-weight: 700; color: #fff; font-size: 1.125rem; }
    .logo { width: 2rem; height: 2rem; border-radius: 0.5rem; background: linear-gradient(135deg, #1976d2, #9c27b0); color: #fff; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; }
    nav { display: flex; flex-wrap: wrap; gap: 0.85rem; font-size: 0.9rem; }
    main { max-width: 56rem; margin: 0 auto; padding: 2.5rem 1.25rem 4rem; }
    .hero { text-align: center; margin-bottom: 2rem; }
    h1 { font-size: clamp(1.75rem, 4vw, 2.75rem); margin: 0 0 0.5rem; letter-spacing: -0.03em; }
    h1 span { color: #9c27b0; }
    .app-name { font-weight: 700; margin: 0; }
    .meta { color: #64748b; font-size: 0.9rem; margin: 0.25rem 0; }
    .toc { background: #fff; border: 1px solid #e2e8f0; border-radius: 1rem; padding: 1.25rem 1.5rem; margin-bottom: 1.5rem; }
    .toc h2 { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em; color: #64748b; margin: 0 0 0.75rem; border: 0; padding: 0; }
    .toc ul { display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem 1rem; list-style: none; padding: 0; margin: 0; font-size: 0.9rem; }
    article { background: #fff; border: 1px solid #e2e8f0; border-radius: 1.25rem; padding: 2rem 1.5rem; box-shadow: 0 20px 40px rgba(15, 23, 42, 0.06); }
    h2 { font-size: 1.25rem; margin: 2rem 0 0.75rem; padding-top: 1.25rem; border-top: 1px solid #e2e8f0; }
    section:first-of-type h2 { border-top: 0; padding-top: 0; margin-top: 1.25rem; }
    p, ul { margin: 0.75rem 0; }
    ul { padding-left: 1.25rem; }
    .table-wrap { overflow-x: auto; margin: 1rem 0; border: 1px solid #e2e8f0; border-radius: 0.75rem; }
    table { width: 100%; border-collapse: collapse; min-width: 40rem; font-size: 0.875rem; }
    caption { text-align: left; padding: 0.75rem 0.85rem; color: #64748b; }
    th, td { text-align: left; vertical-align: top; padding: 0.65rem 0.85rem; border-bottom: 1px solid #e2e8f0; }
    thead th { background: #f8fafc; font-weight: 700; white-space: nowrap; }
    tbody th { font-weight: 700; }
    tbody tr:nth-child(even) { background: #f8fafc; }
    .contact-box { margin-top: 1.5rem; padding: 1rem 1.1rem; background: #f8fafc; border-radius: 0.75rem; }
    footer .bar { justify-content: center; text-align: center; font-size: 0.875rem; }
    @media (max-width: 640px) {
      .toc ul { grid-template-columns: 1fr; }
      article { padding: 1.25rem 1rem; }
    }
  `
}

function renderLegalHtml({
  title,
  application,
  description,
  canonical,
  effectiveDate,
  lastUpdated,
  serviceProvider,
  intro,
  sections,
  contactEmail,
  extraHtml = '',
}) {
  const toc = `<nav class="toc" aria-label="On this page"><h2>On this page</h2><ul>${sections
    .map((section) => `<li><a href="#${escapeHtml(section.id)}">${escapeHtml(section.title)}</a></li>`)
    .join('')}</ul></nav>`

  const effective = effectiveDate ? `<p class="meta">Effective Date: ${escapeHtml(effectiveDate)}</p>` : ''
  const updated = lastUpdated ? `<p class="meta">Last Updated: ${escapeHtml(lastUpdated)}</p>` : ''

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title.includes(application) ? title : `${application} ${title}`)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${escapeHtml(canonical)}" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400..800;1,400..800&display=swap" rel="stylesheet" />
  <style>${legalPageStyles()}</style>
</head>
<body>
  <header>
    <div class="bar">
      <a class="brand" href="/"><span class="logo">B</span> BizApp365</a>
      <nav>
        <a href="/">Home</a>
        <a href="/privacy/">Privacy Policy</a>
        <a href="/terms/">Terms &amp; Conditions</a>
        <a href="/delete-account/">Delete Account</a>
        <a href="/support/">Support</a>
      </nav>
    </div>
  </header>
  <main>
    <div class="hero">
      <h1>${title === 'Privacy Policy' ? 'Privacy <span>Policy</span>' : escapeHtml(title)}</h1>
      <p class="app-name">${escapeHtml(application)}</p>
      <p class="meta">Service Provider: ${escapeHtml(serviceProvider)}</p>
      ${effective}
      ${updated}
    </div>
    ${toc}
    <article>
      ${renderParagraphs(intro)}
      ${renderSections(sections)}
      ${extraHtml}
      <p class="contact-box">Contact: <!--email_off--><a href="mailto:${escapeHtml(contactEmail)}">${escapeHtml(contactEmail)}</a><!--/email_off--></p>
    </article>
  </main>
  <footer>
    <div class="bar">
      <nav>
        <a href="/privacy/">Privacy Policy</a>
        <a href="/terms/">Terms &amp; Conditions</a>
        <a href="/delete-account/">Delete Account</a>
        <a href="/support/">Support</a>
      </nav>
    </div>
  </footer>
</body>
</html>`
}

function writeStaticDir(route, html) {
  const dir = path.join(docsDir, route)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8')
}

function writeRobotsAndSitemap() {
  const robots = `User-agent: *
Allow: /

Allow: /privacy/
Allow: /terms/
Allow: /delete-account/
Allow: /support/

Sitemap: https://bizapp365.com/sitemap.xml
`

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://bizapp365.com/</loc></url>
  <url><loc>https://bizapp365.com/privacy/</loc></url>
  <url><loc>https://bizapp365.com/terms/</loc></url>
  <url><loc>https://bizapp365.com/delete-account/</loc></url>
  <url><loc>https://bizapp365.com/support/</loc></url>
  <url><loc>https://bizapp365.com/features/</loc></url>
  <url><loc>https://bizapp365.com/pricing/</loc></url>
  <url><loc>https://bizapp365.com/integrations/</loc></url>
  <url><loc>https://bizapp365.com/tech/</loc></url>
  <url><loc>https://bizapp365.com/contact/</loc></url>
  <url><loc>https://bizapp365.com/demo/</loc></url>
</urlset>
`

  fs.writeFileSync(path.join(docsDir, 'robots.txt'), robots, 'utf8')
  fs.writeFileSync(path.join(docsDir, 'sitemap.xml'), sitemap, 'utf8')
}

export function generateLegalStaticPages() {
  const policy = JSON.parse(fs.readFileSync(path.join(root, 'src/content/privacyPolicy.en.json'), 'utf8'))
  const deletion = JSON.parse(fs.readFileSync(path.join(root, 'src/content/deleteAccount.en.json'), 'utf8'))
  const support = JSON.parse(fs.readFileSync(path.join(root, 'src/content/support.en.json'), 'utf8'))

  const privacyHtml = renderLegalHtml({
    title: policy.title,
    application: policy.application,
    description: policy.metaDescription,
    canonical: 'https://bizapp365.com/privacy/',
    effectiveDate: policy.effectiveDate,
    lastUpdated: policy.lastUpdated,
    serviceProvider: policy.serviceProvider,
    intro: policy.intro,
    sections: policy.sections,
    contactEmail: policy.contactEmail,
  })

  const deletionExtra = `<section id="request-form"><h2>${escapeHtml(deletion.form.heading)}</h2><p>${formatInline(deletion.form.note)}</p><p><!--email_off--><a href="mailto:${escapeHtml(deletion.contactEmail)}?subject=${encodeURIComponent(deletion.form.mailtoSubject)}">${escapeHtml(deletion.form.submit)}</a><!--/email_off--></p></section>`

  const deletionHtml = renderLegalHtml({
    title: deletion.title,
    application: deletion.application,
    description: deletion.metaDescription,
    canonical: 'https://bizapp365.com/delete-account/',
    lastUpdated: deletion.lastUpdated,
    serviceProvider: deletion.serviceProvider,
    intro: deletion.intro,
    sections: deletion.sections,
    contactEmail: deletion.contactEmail,
    extraHtml: deletionExtra,
  })

  writeStaticDir('privacy', privacyHtml)
  fs.writeFileSync(path.join(docsDir, 'privacy.html'), privacyHtml, 'utf8')
  writeStaticDir('delete-account', deletionHtml)

  const supportHtml = renderLegalHtml({
    title: support.title,
    application: support.application,
    description: support.metaDescription,
    canonical: 'https://bizapp365.com/support/',
    lastUpdated: support.lastUpdated,
    serviceProvider: support.serviceProvider,
    intro: support.intro,
    sections: support.sections,
    contactEmail: support.supportEmail,
  })
  writeStaticDir('support', supportHtml)

  const spaRoutes = ['terms', 'features', 'tech', 'pricing', 'contact', 'integrations', 'demo']
  const spaShell = fs.readFileSync(path.join(docsDir, 'index.html'), 'utf8')
  for (const route of spaRoutes) {
    writeStaticDir(route, spaShell)
  }

  writeRobotsAndSitemap()
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateLegalStaticPages()
}

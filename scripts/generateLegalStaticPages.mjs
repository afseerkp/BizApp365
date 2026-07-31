import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const docsDir = path.join(root, 'docs')
const policyPath = path.join(root, 'src/content/privacyPolicy.json')
const appAccessPath = path.join(root, 'src/content/appAccess.json')

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function renderPolicyHtml(policy) {
  const sections = policy.sections
    .map((section) => {
      const bullets = section.bullets?.length
        ? `<ul>${section.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
        : ''
      const paragraphs = (section.paragraphs ?? [])
        .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
        .join('')
      return `<section id="${escapeHtml(section.id)}"><h2>${escapeHtml(section.title)}</h2>${paragraphs}${bullets}</section>`
    })
    .join('\n')

  const intro = policy.intro.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(policy.title)} | ${escapeHtml(policy.application)}</title>
  <meta name="description" content="Privacy Policy for the ${escapeHtml(policy.application)} application operated by ${escapeHtml(policy.serviceProvider)}." />
  <style>
    body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 48rem; margin: 0 auto; padding: 2rem 1.25rem 4rem; }
    h1 { font-size: 2rem; margin-bottom: 0.25rem; }
    h2 { font-size: 1.25rem; margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; }
    section:first-of-type h2 { border-top: 0; padding-top: 0; }
    p, ul { margin: 0.75rem 0; }
    ul { padding-left: 1.25rem; }
    a { color: #1976d2; }
    .meta { color: #64748b; font-size: 0.875rem; margin-bottom: 1.5rem; }
    .nav { margin-bottom: 2rem; font-size: 0.875rem; }
  </style>
</head>
<body>
  <p class="nav"><a href="/">BizApp365</a> · <a href="/terms">Terms &amp; Conditions</a></p>
  <h1>${escapeHtml(policy.title)}</h1>
  <p class="meta">Effective as of ${escapeHtml(policy.effectiveDate)}</p>
  ${intro}
  ${sections}
  <p class="meta">Contact: <a href="mailto:${escapeHtml(policy.contactEmail)}">${escapeHtml(policy.contactEmail)}</a></p>
</body>
</html>`
}

function renderAppAccessHtml(access) {
  const intro = access.intro.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')
  const androidSteps = access.androidSteps
    .map((step) => `<li>${escapeHtml(step)}</li>`)
    .join('')
  const webSteps = access.webSteps
    .map((step) => `<li>${escapeHtml(step)}</li>`)
    .join('')
  const playConsole = access.playConsoleInstructions.map((line) => escapeHtml(line)).join('\n')

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(access.title)} | ${escapeHtml(access.application)}</title>
  <meta name="description" content="Reviewer login credentials and instructions for ${escapeHtml(access.application)}." />
  <style>
    body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 48rem; margin: 0 auto; padding: 2rem 1.25rem 4rem; }
    h1 { font-size: 2rem; margin-bottom: 0.25rem; }
    h2 { font-size: 1.25rem; margin-top: 2rem; }
    p, ul, ol, pre { margin: 0.75rem 0; }
    ul, ol { padding-left: 1.25rem; }
    a { color: #1976d2; }
    .meta { color: #64748b; font-size: 0.875rem; margin-bottom: 1.5rem; }
    .nav { margin-bottom: 2rem; font-size: 0.875rem; }
    .credentials { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.75rem; padding: 1rem; }
    .credentials dt { font-weight: 600; color: #64748b; font-size: 0.875rem; }
    .credentials dd { margin: 0.25rem 0 0.75rem; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
    pre { background: #0f172a; color: #f8fafc; padding: 1rem; border-radius: 0.75rem; white-space: pre-wrap; font-size: 0.875rem; }
  </style>
</head>
<body>
  <p class="nav"><a href="/">BizApp365</a> · <a href="/privacy.html">Privacy Policy</a></p>
  <h1>${escapeHtml(access.title)}</h1>
  <p class="meta">Last updated ${escapeHtml(access.lastUpdated)}</p>
  ${intro}
  <h2>Reviewer login credentials</h2>
  <dl class="credentials">
    <dt>Username</dt><dd>${escapeHtml(access.credentials.username)}</dd>
    <dt>Password</dt><dd>${escapeHtml(access.credentials.password)}</dd>
    <dt>Company code</dt><dd>${escapeHtml(access.credentials.companyCode)}</dd>
    <dt>Company name</dt><dd>${escapeHtml(access.credentials.companyName)}</dd>
  </dl>
  <h2>Server connection (Android)</h2>
  <ul>
    <li>Host: ${escapeHtml(access.server.host)}</li>
    <li>Port: ${escapeHtml(access.server.port)}</li>
    <li>Protocol: ${escapeHtml(access.server.protocol)}</li>
  </ul>
  <h2>Android sign-in steps</h2>
  <ol>${androidSteps}</ol>
  <h2>Web sign-in steps</h2>
  <ol>${webSteps}</ol>
  <h2>Google Play Console declaration</h2>
  <pre>${playConsole}</pre>
  <p class="meta">Support: <a href="mailto:${escapeHtml(access.supportEmail)}">${escapeHtml(access.supportEmail)}</a></p>
</body>
</html>`
}

export function generateLegalStaticPages() {
  const policy = JSON.parse(fs.readFileSync(policyPath, 'utf8'))
  const access = JSON.parse(fs.readFileSync(appAccessPath, 'utf8'))
  const privacyHtml = renderPolicyHtml(policy)
  const appAccessHtml = renderAppAccessHtml(access)

  fs.mkdirSync(path.join(docsDir, 'privacy'), { recursive: true })
  fs.writeFileSync(path.join(docsDir, 'privacy.html'), privacyHtml, 'utf8')
  fs.writeFileSync(path.join(docsDir, 'privacy/index.html'), privacyHtml, 'utf8')

  fs.mkdirSync(path.join(docsDir, 'app-access'), { recursive: true })
  fs.writeFileSync(path.join(docsDir, 'app-access.html'), appAccessHtml, 'utf8')
  fs.writeFileSync(path.join(docsDir, 'app-access/index.html'), appAccessHtml, 'utf8')

  const spaRoutes = ['terms', 'features', 'tech', 'pricing', 'contact', 'integrations', 'demo']
  const spaShell = fs.readFileSync(path.join(docsDir, 'index.html'), 'utf8')

  for (const route of spaRoutes) {
    const routeDir = path.join(docsDir, route)
    fs.mkdirSync(routeDir, { recursive: true })
    fs.writeFileSync(path.join(routeDir, 'index.html'), spaShell, 'utf8')
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateLegalStaticPages()
}

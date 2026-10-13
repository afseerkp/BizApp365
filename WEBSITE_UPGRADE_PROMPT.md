# Prompt: Upgrade bizapp365.com to an Award-Level Marketing Website

> Copy everything below the line into Claude Code (or another AI coding agent) from the root of this repo.

---

## Role

You are a senior product designer and front-end engineer who has shipped Awwwards "Site of the Day" and CSS Design Awards winners for B2B SaaS companies such as Linear, Stripe, Vercel, Ramp, and Attio. Redesign and rebuild the **BizApp365** marketing website in this repository so it would credibly win **Awwwards SOTD, CSSDA WOTD, and FWA**. It must also convert visitors into demo requests and logins, score 95+ on Lighthouse, and stay fully bilingual (English and Arabic, RTL).

## About the product

**BizApp365** is a multi-tenant cloud ERP for SMEs in the UAE, Oman, and the wider GCC. Modules:

- Accounting (VAT/GST modes, UAE/Oman VAT filing, UAE e-invoicing via Peppol)
- Inventory and wholesale godowns (FIFO, LIFO, weighted average, last purchase valuation)
- Sales, purchase, and transactions
- CRM
- Service center
- HR and payroll
- Production / manufacturing
- Barcode and label printing
- Reports and a customizable dashboard
- Masters and configuration, with edition-gated modules

Platforms:

1. **Web ERP**: the full platform, multi-company, with schema-per-company isolation.
2. **Android VAN Sales app**: route sales, collections, van stock load and unload, GPS customer creation, QR server setup.
3. **Direct Print browser extension** for Windows: silent invoice and label printing on Zebra, TSC, and thermal printers.

Positioning: *"The complete ERP for growing SMEs: real-time, compliant, bilingual, and built for the field as well as the back office."*

Primary audience: owners, finance managers, and operations heads at trading, wholesale, distribution, service, and light-manufacturing SMEs in the GCC.

Primary conversions:
1. **Book a demo** (`/demo`, `/contact`)
2. **Login** (`https://login.bizapp365.com`)
3. **WhatsApp chat** (the existing floating button)

## Current codebase (respect these constraints)

- React 19, TypeScript, Vite 7, Tailwind CSS v4 (`@theme` in `src/index.css`), Framer Motion 12, lucide-react, React Router 7.
- Routes live in `src/App.tsx`: `/`, `/features`, `/tech`, `/pricing`, `/contact`, `/integrations`, `/demo`, `/terms`, `/privacy`, `/delete-account`. Pages are lazy-loaded.
- i18n is handled by `src/i18n/LanguageContext.tsx`, with `src/i18n/en.json` and `src/i18n/ar.json` (`t()` for strings, `tm` for structured arrays). **Every new string must exist in both files.** Arabic must be natural, professional Gulf-market Arabic, not a literal translation.
- RTL uses `html[dir="rtl"]` and Tailwind `rtl:` and logical properties (`start`/`end`, `ps`/`pe`). Never use left/right in new code.
- Fonts: Plus Jakarta Sans (Latin) and Noto Sans Arabic.
- SEO uses the `src/components/seo/Seo.tsx` component, plus `public/sitemap.xml` and `public/robots.txt`.
- Deployment: `npm run build` outputs to `docs/` for GitHub Pages, with a custom domain from `public/CNAME`. The `githubPages()` Vite plugin creates `404.html` and static legal pages through `scripts/generateLegalStaticPages.mjs`. **Do not break this pipeline**, and keep `/privacy`, `/terms`, and `/delete-account` reachable as static HTML (Play Store compliance).
- Module screenshots live in `public/features/*.png`. The hero image is `src/assets/hero-dashboard.png`.
- Do not add a backend. Any form must work on static hosting: mailto, WhatsApp deep link, or a configurable endpoint behind an env var.

## Design direction

### Concept: "The Operating System for Your Business"
The site should feel like one live, connected system. A sale in one place ripples through inventory, accounts, VAT, and reports in real time. Every major section should **show** that connectedness through motion and interface instead of describing it.

### Visual language
- **Palette**: keep brand blue `#1976d2` as the anchor. Refine it into a full token scale from 50 to 950. Add one sophisticated accent, either evolving the existing purple `#9c27b0` toward a premium violet or adding a Gulf-inspired warm sand/gold for highlights. Use deep ink neutrals (`#0B1020`-style) for dark sections. Define every color as a CSS variable in `@theme` and `:root`, with a complete **dark mode** driven by `prefers-color-scheme` plus a manual toggle saved to localStorage.
- **Typography**: build an expressive display scale with fluid `clamp()` sizes. Headlines run 56–96px on desktop with tight tracking and balanced wrapping. Consider a premium display face (for example Inter Display, Geist, General Sans, or Satoshi) for Latin headlines, paired with **IBM Plex Sans Arabic** or **Readex Pro** for Arabic headlines. Arabic typography must look just as intentional as the English: it needs its own line-height and letter-spacing rules, and never inherits Latin tracking.
- **Layout**: a 12-column grid, generous whitespace, and a bento-grid module showcase. Use asymmetric editorial compositions with deliberate rhythm, not identical stacked card rows.
- **Texture and depth**: subtle grain or noise overlay, soft mesh or aurora gradients, glassmorphism used sparingly on overlays only, a 1px hairline-border system, and layered shadows.
- **Iconography**: lucide at a consistent stroke, plus 6–10 bespoke animated SVG illustrations for the key concepts (real-time sync, VAT compliance, van route, silent print, multi-company).
- **Imagery**: replace flat screenshots with framed product UI in custom browser and Android device frames, with interactive hotspots and callouts. Where possible, rebuild key dashboard widgets as **live HTML/SVG components** (animated KPI counters, charts drawing in) so they are crisp and translatable.

### Motion system (signature quality)
- Build one motion token set (durations, easings, stagger) and reuse it everywhere. Start from the existing ease `[0.22, 1, 0.36, 1]`.
- Add **Lenis** smooth scrolling, integrated with Framer Motion `useScroll`/`useTransform`.
- Signature moments:
  1. **Hero**: a kinetic headline reveal (word or character split, with correct Arabic shaping, so never split Arabic by character). The product dashboard assembles itself: cards fly in, numbers count up, and a chart draws. Add subtle cursor-reactive parallax and tilt on desktop.
  2. **"One sale, everywhere" scrollytelling**: a pinned section. As the user scrolls, one invoice is created, then stock decrements, the ledger posts, VAT updates, the dashboard KPI ticks, and a receipt prints silently. This is the centerpiece that wins awards.
  3. **Module bento grid**: hovering a tile reveals a micro-demo loop for that module (CRM pipeline drag, barcode scan, payroll run, production BOM).
  4. **VAN Sales field section**: an animated route map of the UAE/Oman with a van moving between pins, next to an Android device mockup showing the sale flow.
  5. **Compliance section**: a VAT return or e-invoice document that assembles line by line, with a "Peppol ✓" seal stamp animation.
  6. **Magnetic CTA buttons**, smooth page transitions between routes (AnimatePresence plus a shared layout or a View Transitions API fallback), and a refined custom cursor on desktop only.
- Respect `prefers-reduced-motion` everywhere: give each animation a static, fully informative fallback.
- Animate only `transform` and `opacity`. No layout thrash and no animation jank on mid-range Android phones.

## Information architecture and page specs

### Global
- **Navbar**: sticky and condensing on scroll, with a translucent blur. Add a **mega-menu** for Product (modules grouped as Finance, Operations, People, Field and Print) with icon, one-liner, and a mini preview. Include the EN/عربي toggle, theme toggle, a Login text link, and a primary "Book a demo" button. Build a full-screen animated mobile menu.
- **Footer**: an oversized wordmark, sitemap columns, offices and regions (UAE, Oman), WhatsApp/email/phone, social links, the language switch, legal links, and a newsletter or "get product updates" field.
- **Command palette** (⌘K / Ctrl+K): search pages and modules. This echoes the product's own global search and keyboard shortcuts.
- **Announcement bar** (dismissible), for example "UAE e-invoicing (Peppol) ready".

### Home (`/`)
1. Hero: headline, subhead, two CTAs, a trust line ("Trusted by X+ businesses across the UAE & Oman"), and the live dashboard composition.
2. Logo marquee of customers or partners, with placeholders clearly marked `TODO`.
3. Problem → solution: "Spreadsheets, disconnected tools, manual VAT" versus "One real-time system".
4. Scrollytelling "One sale, everywhere".
5. Module bento grid, linking to `/features#module`.
6. Platforms trio: Web, Android VAN, Print Extension, with device mockups.
7. Compliance and localization: VAT/GST, Peppol, Arabic/English RTL, multi-currency.
8. Industries: trading, wholesale/distribution, retail, service centers, manufacturing. Use tabs that swap the UI preview.
9. Metrics band with animated counters (placeholders marked `TODO` for real numbers).
10. Testimonials: a carousel with photos, role, company, and outcome metric (placeholders marked `TODO`).
11. Security and architecture: schema-per-company isolation, RBAC, HTTPS, backups.
12. FAQ accordion, with JSON-LD `FAQPage`.
13. Final CTA: a large immersive gradient section with the demo form or button and WhatsApp.

### Features (`/features`)
- A sticky side nav (in-page table of contents) plus one rich section per module: headline, three key capabilities, a framed screenshot or live widget, and a "works with" chip list. Every module gets a deep-link anchor.

### Pricing (`/pricing`)
- A monthly/annual toggle with an animated price morph and savings badge, plus a currency switch (AED / OMR / USD).
- Plan cards with a highlighted "Most popular" plan, and a **full feature comparison table** with sticky header, grouped rows, and tooltips.
- An add-ons section (VAN app, Print extension, extra companies or users), a pricing FAQ, and an "Enterprise / talk to sales" band.
- The plan CTA buttons are currently non-functional `<button>`s. Wire them to `/demo?plan=…` or to login.

### Integrations (`/integrations`)
- A filterable grid by category, with an animated hub-and-spoke diagram of BizApp365 at the center.

### Tech / Security (`/tech`)
- Architecture diagram, security practices, uptime and deployment (Docker, HTTPS), data residency notes.

### Demo (`/demo`) and Contact (`/contact`)
- A two-step demo request form (company info, then modules of interest and a preferred time) with inline validation, accessible errors, and a success animation. Add WhatsApp and phone alternatives, office cards, and a map.
- Pre-fill the form from query params (`?plan=`, `?module=`).

### Legal pages
- Keep the content and the static-HTML generation exactly as they are. Only restyle the pages for readable long-form typography with a sticky TOC.

### New pages (optional, if time allows)
- `/industries/:slug`, `/customers` (case studies), `/about`, `/changelog`. Add each one to the sitemap and to static generation.

## Copywriting rules
- Lead with outcomes, not features: "Close your books in days, not weeks", "File UAE VAT in minutes", "Know your van stock at every stop".
- Keep sentences short and confident. No jargon walls, no unsupported superlatives.
- Each section needs one headline (≤ 8 words), one supporting line (≤ 25 words), and one proof point.
- Write Arabic copy natively for Gulf business readers, and review numerals, currency formatting (`Intl.NumberFormat` with `ar-AE`), and directional icons (`rtl:rotate-180` on arrows).
- Mark every invented number, logo, or testimonial with `{/* TODO: replace with real data */}`. Never present fabricated data as real.

## Accessibility (WCAG 2.2 AA, non-negotiable)
- Semantic landmarks, one `h1` per page, and logical heading order.
- Color contrast ≥ 4.5:1 for body text and ≥ 3:1 for large text and UI, in both themes.
- Full keyboard navigation, visible focus rings, focus-trapped mega-menu, mobile menu and command palette, and Escape closes overlays.
- `alt` text through i18n, `aria-live` for form status, and labels on all inputs.
- A skip-to-content link, and `lang` and `dir` set on `<html>` when the language switches.
- Reduced-motion fallbacks for all animation and scrollytelling.

## Performance budget
- Lighthouse mobile: **Performance ≥ 95, Accessibility 100, Best Practices 100, SEO 100**.
- LCP < 2.0s, CLS < 0.05, INP < 150ms on a mid-range Android over 4G.
- Initial JS < 170KB gzipped on the home route. Code-split heavy sections and load scrollytelling assets on intersection.
- Convert all PNG screenshots to **AVIF/WebP** with `<picture>` fallbacks and responsive `srcset`/`sizes`, with explicit width/height and `loading="lazy"` / `fetchpriority="high"` where appropriate. A build-time step such as `vite-imagetools` is fine.
- Self-host fonts with `font-display: swap`, subset them, and preload the critical weights.
- No heavy WebGL unless it is lazy-loaded with a static poster fallback. Prefer CSS/SVG/Canvas.

## SEO and metadata
- Extend `Seo.tsx`: per-page title and description in both languages, canonical, `hreflang` en/ar, Open Graph and Twitter cards with designed 1200×630 OG images per page, and theme-color.
- JSON-LD: `Organization`, `SoftwareApplication` (with offers from pricing), `FAQPage`, `BreadcrumbList`.
- Consider prerendering or static generation of the marketing routes at build time (for example `vite-react-ssg` or a custom prerender script that extends the existing `githubPages()` plugin) so crawlers get full HTML. Keep output in `docs/`.
- Update `sitemap.xml` with all routes and both languages.

## Engineering standards
- Create a `src/design-system/` (or `src/components/ui/`) layer: `Button`, `Badge`, `Card`, `Section`, `Container`, `Eyebrow`, `Heading`, `Tabs`, `Accordion`, `Tooltip`, `Dialog`, `DeviceFrame`, `BrowserFrame`, `Marquee`, `Counter`, `MagneticButton`, `Reveal`. Each must be typed, theme-aware, and RTL-safe.
- Put motion tokens in `src/design-system/motion.ts`. Put design tokens only in `src/index.css` `@theme`, with no hard-coded hex in components. Replace the existing `#1976d2` literals with tokens.
- Keep TypeScript strict, with `npm run lint` and `npm run build` passing with zero errors.
- Add new dependencies only when they earn their weight. Suggested: `lenis`, `clsx`, optionally `@radix-ui/*` primitives for accessible dialogs, tabs, and tooltips.
- No layout regression on the existing WhatsApp float, the legal static pages, or the 404 SPA fallback.

## Delivery plan (work in this order and commit after each phase)
1. **Audit**: review the current site (run `npm run dev`, screenshot every page at 375 / 768 / 1440, in EN and AR, light and dark). Produce a short gap list against this brief.
2. **Foundations**: tokens, typography, dark mode, motion tokens, design-system primitives, Lenis, page transitions.
3. **Global chrome**: navbar with mega-menu, mobile menu, footer, command palette, announcement bar.
4. **Home**: build every section, ending with the scrollytelling centerpiece.
5. **Inner pages**: Features, Pricing, Integrations, Tech, Demo/Contact, legal restyle.
6. **i18n pass**: every string in `en.json` and `ar.json`, plus full RTL QA on every page.
7. **Performance, SEO, accessibility pass**: images, prerender, JSON-LD, Lighthouse runs, axe checks, keyboard-only walkthrough, reduced-motion walkthrough.
8. **Polish**: micro-interactions, empty and hover states, loading skeletons, a 404 page with personality, a favicon set and web manifest.

## Acceptance checklist
- [ ] Every page looks deliberate and premium at 375, 768, 1280, and 1920 widths, in EN and AR, light and dark.
- [ ] The scrollytelling "One sale, everywhere" section works smoothly on desktop and mobile and has a reduced-motion version.
- [ ] No hard-coded colors or left/right properties in new components.
- [ ] Every user-facing string comes from `en.json` and `ar.json`.
- [ ] Lighthouse mobile targets are met on `/`, `/features`, and `/pricing` (attach scores).
- [ ] `npm run lint` and `npm run build` pass. `docs/` contains `404.html`, `.nojekyll`, `CNAME`, and the static legal pages.
- [ ] All placeholder data is marked `TODO` and listed in a final summary for the team to replace.
- [ ] A final report lists what changed, new dependencies, and the remaining TODOs (real logos, testimonials, metrics, OG images).

Start with Phase 1 (Audit). Show me the gap list and proposed visual direction (palette swatches, type scale, and one hero mockup) before building Phase 2.

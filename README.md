# BizApp365

Marketing site for BizApp365 — a multi-tenant ERP platform for accounting, inventory, production, and HR.

## Stack

React 19, TypeScript, Vite, Tailwind CSS, Framer Motion

## Commands

```bash
npm install
npm run dev       # local dev server
npm run build     # production build
npm run preview   # preview production build
npm run deploy    # build into docs/ for GitHub Pages
```

## Deploy

GitHub Pages serves the **`/docs` folder on `main`**. Run `npm run deploy`, commit the `docs/` output, and push to `main`. Custom domain config lives in `public/CNAME` (copied into `docs/` on build).

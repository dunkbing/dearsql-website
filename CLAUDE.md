# DearSQL Website — Agent Guide

Marketing website for DearSQL, built with [Astro](https://astro.build/) and deployed via Cloudflare Workers (`wrangler`).

## Stack

- **Framework**: Astro (static site + a few API routes)
- **Styling**: Tailwind via `src/styles/global.css`
- **Package manager**: Bun (`bun.lock`)
- **Deployment**: Cloudflare Workers (`wrangler.jsonc`, `.wrangler/`)
- **Config**: `astro.config.ts`

## Structure

```
src/
  pages/          - routes (file-based routing)
    index.astro      - landing page
    about.astro      - about page
    privacy.astro    - privacy policy
    terms.astro      - terms of service
    changelog.astro  - changelog
    redis.astro      - redis-specific landing
    appcast.xml.ts   - Sparkle appcast feed
    api/             - API route handlers
  layouts/
    Layout.astro     - shared HTML shell (head, meta, footer)
  components/
    Footer.astro     - shared footer
  data/             - static content data
  styles/
    global.css       - Tailwind entry + custom styles
public/             - static assets (icons, screenshots)
scripts/            - build/deploy helpers
```

## Conventions

- **Pages** use `Layout.astro` and pass `title`, `description`, and `breadcrumbs` props.
- **Styling** uses Tailwind utility classes with a Catppuccin-inspired palette:
  - `text-text`, `text-subtext0`, `border-surface1`, etc.
  - Page content is typically wrapped in `<main class="max-w-2xl mx-auto px-4 py-6 text-sm">`.
- **Section headers** use literal markdown-style prefixes (`##`, `###`) inside `<h1>`/`<h2>` tags for the terminal-ish aesthetic — match this style when adding new pages.
- **Links** to external sites use `target="_blank"`. Internal links are plain.
- **New footer links**: update `src/components/Footer.astro`.

## Common tasks

- **Add a page**: create `src/pages/<name>.astro`, copy the frontmatter shape from `privacy.astro` or `about.astro`, add `breadcrumbs`, wrap body in `<Layout>`.
- **Add a footer link**: edit `src/components/Footer.astro`.
- **Update meta/OG defaults**: edit `src/layouts/Layout.astro`.

## Build & dev

```bash
bun install
bun run dev       # local dev server
bun run build     # production build into dist/
bun run preview   # preview the built site
```

Deployment is handled via `wrangler` against Cloudflare Workers — check `wrangler.jsonc` for bindings and routes before deploying.

## Notes for AI agents

- Do not introduce JavaScript frameworks (React/Vue/Svelte) unless asked — the site is intentionally static-first.
- Do not add analytics or tracking scripts. The privacy policy promises none.
- Keep new pages consistent with the existing terminal/markdown aesthetic (`##` / `###` in headings, `[link]` brackets in the footer, monospace-friendly spacing).
- `public/` assets are served at the site root; reference them with absolute paths (`/icon-hero.webp`).

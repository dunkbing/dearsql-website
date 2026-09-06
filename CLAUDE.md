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
    docs/            - user documentation (see below)
      index.astro       - docs landing
      _nav.ts           - builds the sidebar nav from page frontmatter
      *.md              - one page per feature area
    api/             - API route handlers
  layouts/
    Layout.astro     - shared HTML shell (head, meta, footer)
    DocsLayout.astro - docs shell: sidebar nav + prose styles
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

## Docs section (`/docs`)

User-facing documentation for the app — one markdown page per feature area
(connections, browsing data, SQL editor, AI assistant, context and commands,
database tools, import/export). Every page carries frontmatter:

```yaml
layout: ../../layouts/DocsLayout.astro
title: "SQL editor"
description: "Run queries, read multi-statement results, and keep scripts around."
section: "Getting started"   # nav group
sectionOrder: 1              # group position
order: 3                     # position within the group
```

`_nav.ts` collects those with `import.meta.glob(..., { eager: true })` at build
time, so **adding a page is just adding a `.md` file** — there is no page list to
update.

Screenshots live in `public/docs/` and are referenced with a plain `<img>` and an
explicit `width` (`440` for sidebar crops, `800` for full-window shots).
They are **generated, not hand-taken**: `dearsql/tests/ui/docs_shots.cpp` drives
the real app into a state and holds it for capture — see `docs/TESTING.md` in the
parent repo. Re-shoot rather than editing a PNG when the UI moves.

## Common tasks

- **Add a page**: create `src/pages/<name>.astro`, copy the frontmatter shape from `privacy.astro` or `about.astro`, add `breadcrumbs`, wrap body in `<Layout>`.
- **Add a footer link**: edit `src/components/Footer.astro`.
- **Add a docs page**: drop a `.md` into `src/pages/docs/` with the frontmatter above; the nav picks it up.
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

# DearSQL Website

Landing page for [DearSQL](https://dearsql.dev) — a minimal database manager built with native C++.

## Tech Stack

- [Astro](https://astro.build)
- [Tailwind CSS](https://tailwindcss.com) v4
- Deployed on [Cloudflare Pages](https://pages.cloudflare.com)

## Development

```sh
bun install
bun dev
```

## Commands

| Command       | Action                                      |
| :------------ | :------------------------------------------ |
| `bun install` | Install dependencies                        |
| `bun dev`     | Start local dev server at `localhost:4321`   |
| `bun build`   | Build production site to `./dist/`           |
| `bun preview` | Preview build locally before deploying       |

## Project Structure

```
├── public/
│   ├── icons/          # SVG icons (databases, social)
│   ├── icon.webp       # App icon
│   ├── sc.webp         # macOS screenshot
│   └── sc_gtk.webp     # Linux screenshot
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
├── astro.config.mjs
└── package.json
```

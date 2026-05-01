import { defineConfig, svgoOptimizer } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://dearsql.dev",
  trailingSlash: "never",
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/checkout/"),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  adapter: cloudflare({
    imageService: "cloudflare",
  }),
  experimental: {
    svgOptimizer: svgoOptimizer({
      plugins: ["preset-default", { name: "removeViewBox" }],
    }),
  },
});

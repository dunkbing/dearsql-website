// Docs navigation, derived from the pages themselves. Each page declares its
// own `section`, `sectionOrder` and `order` in frontmatter, so adding a page is
// one file and nothing else needs updating.
// The leading underscore keeps Astro from treating this as a route.

export interface DocPage {
  title: string;
  description: string;
  url: string;
}

export interface DocSection {
  name: string;
  order: number;
  pages: DocPage[];
}

interface DocFrontmatter {
  title: string;
  description?: string;
  section?: string;
  sectionOrder?: number;
  order?: number;
}

interface DocModule {
  frontmatter: DocFrontmatter;
  url?: string;
}

export function getDocSections(): DocSection[] {
  const modules = import.meta.glob<DocModule>("./*.md", { eager: true });
  const sections = new Map<string, DocSection>();

  for (const mod of Object.values(modules)) {
    if (typeof mod.url !== "string") {
      continue;
    }
    const { title, description = "", section = "Docs", sectionOrder = 99 } =
      mod.frontmatter;

    let entry = sections.get(section);
    if (!entry) {
      entry = { name: section, order: sectionOrder, pages: [] };
      sections.set(section, entry);
    }
    entry.order = Math.min(entry.order, sectionOrder);
    entry.pages.push({ title, description, url: mod.url });
  }

  const ordered = [...sections.values()].sort((a, b) => a.order - b.order);
  for (const section of ordered) {
    section.pages.sort((a, b) => {
      const pageOrder = (url: string) =>
        (Object.values(modules).find((m) => m.url === url)?.frontmatter.order ??
          99) as number;
      return pageOrder(a.url) - pageOrder(b.url) || a.title.localeCompare(b.title);
    });
  }
  return ordered;
}

export interface DocSource extends DocPage {
  section: string;
  markdown: string; // body without frontmatter, links made absolute
}

const SITE = "https://dearsql.dev";

// every docs page as plain markdown, in nav order: served as /docs/<page>.md
// and concatenated into /llms-full.txt for agents
export function getDocSources(): DocSource[] {
  const raw = import.meta.glob<string>("./*.md", {
    query: "?raw",
    import: "default",
    eager: true,
  });
  const byUrl = new Map(
    Object.entries(raw).map(([path, text]) => [
      "/docs/" + path.slice(2, -3),
      text
        .replace(/^---\n[\s\S]*?\n---\n+/, "")
        .replace(/\]\(\//g, `](${SITE}/`)
        .replace(/src="\//g, `src="${SITE}/`),
    ]),
  );
  return getDocSections().flatMap((section) =>
    section.pages.map((page) => ({
      ...page,
      section: section.name,
      markdown: byUrl.get(page.url) ?? "",
    })),
  );
}

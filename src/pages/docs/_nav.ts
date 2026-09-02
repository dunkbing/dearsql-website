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

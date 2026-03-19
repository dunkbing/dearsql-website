import type { APIRoute } from "astro";
import { releases, dmgUrl, msiUrl, toRfc822 } from "../data/releases";

export const GET: APIRoute = () => {
  const items = releases
    .filter((r) => r.sparkle || r.windows)
    .map((r) => {
      const minOS = r.sparkle?.minimumSystemVersion ?? "14.0";
      const changesHtml = r.changes
        .map((c) => `                    <li>${c}</li>`)
        .join("\n");

      const enclosures: string[] = [];

      if (r.sparkle) {
        enclosures.push(`            <enclosure
        url="${dmgUrl(r.version)}"
        sparkle:edSignature="${r.sparkle.edSignature}"
        length="${r.sparkle.length}"
        type="application/octet-stream"
        sparkle:os="macos"
      />`);
      }

      if (r.windows) {
        enclosures.push(`            <enclosure
        url="${msiUrl(r.version)}"
        sparkle:edSignature="${r.windows.edSignature}"
        length="${r.windows.length}"
        type="application/octet-stream"
        sparkle:os="windows"
      />`);
      }

      return `        <item>
            <title>Version ${r.version}</title>
            <pubDate>${toRfc822(r.date)}</pubDate>
            <sparkle:version>${r.version}</sparkle:version>
            <sparkle:shortVersionString>${r.version}</sparkle:shortVersionString>
            <sparkle:minimumSystemVersion>${minOS}</sparkle:minimumSystemVersion>
            <description
      ><![CDATA[
                <h2>What's New in ${r.version}</h2>
                <ul>
${changesHtml}
                </ul>
            ]]></description>
${enclosures.join("\n")}
        </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="utf-8" ?>
<rss
  version="2.0"
  xmlns:sparkle="http://www.andymatuschak.org/xml-namespaces/sparkle"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
>
    <channel>
        <title>DearSQL Updates</title>
        <link>https://dearsql.dev/appcast.xml</link>
        <description>Most recent changes with links to updates.</description>
        <language>en</language>
${items}
    </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
};

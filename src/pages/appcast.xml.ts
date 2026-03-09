import type { APIRoute } from "astro";
import { releases, dmgUrl, toRfc822 } from "../data/releases";

export const GET: APIRoute = () => {
  const items = releases
    .filter((r) => r.sparkle)
    .map((r) => {
      const minOS = r.sparkle!.minimumSystemVersion ?? "14.0";
      const changesHtml = r.changes
        .map((c) => `                    <li>${c}</li>`)
        .join("\n");
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
            <enclosure
        url="${dmgUrl(r.version)}"
        sparkle:edSignature="${r.sparkle!.edSignature}"
        length="${r.sparkle!.length}"
        type="application/octet-stream"
      />
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

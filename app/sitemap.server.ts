import { CONTENT_REGISTRY } from "../data/content-registry";

export const SITEMAP_ORIGIN = "https://pseoengine.com";

interface SitemapEntry {
  path: string;
  priority: string;
  changefreq: string;
}

interface SitemapSegment {
  slug: string;
  name: string;
  entries: SitemapEntry[];
}

function getSegments(): SitemapSegment[] {
  const segments: Record<string, SitemapEntry[]> = {
    migrations: [],
    "migration-problems": [],
    "shopify-store-migration": [],
    comparisons: [],
    tools: [],
    learn: [],
    pages: [],
  };

  for (const entry of CONTENT_REGISTRY) {
    if (entry.page.status !== "published") continue;

    let priority = "0.5";
    if (entry.page.priority >= 95) priority = "1.0";
    else if (entry.page.priority >= 85) priority = "0.9";
    else if (entry.page.priority >= 75) priority = "0.8";
    else if (entry.page.priority >= 65) priority = "0.7";
    else if (entry.page.priority >= 55) priority = "0.6";

    let changefreq = "monthly";
    if (entry.page.type === "hub") changefreq = "weekly";
    if (entry.page.type === "tool") changefreq = "weekly";

    const item: SitemapEntry = { path: entry.page.path, priority, changefreq };

    if (entry.page.type === "migration" || (entry.page.type === "hub" && entry.page.path.startsWith("/migrate/"))) {
      segments["migrations"]!.push(item);
    } else if (entry.page.type === "problem") {
      segments["migration-problems"]!.push(item);
    } else if (entry.page.path.startsWith("/shopify-store-migration/")) {
      segments["shopify-store-migration"]!.push(item);
    } else if (entry.page.type === "comparison") {
      segments["comparisons"]!.push(item);
    } else if (entry.page.type === "tool") {
      segments["tools"]!.push(item);
    } else if (entry.page.type === "learn") {
      segments["learn"]!.push(item);
    } else {
      segments["pages"]!.push(item);
    }
  }

  return [
    { slug: "migrations", name: "Platform Migration Guides", entries: segments["migrations"] ?? [] },
    { slug: "migration-problems", name: "Migration Problem Pages", entries: segments["migration-problems"] ?? [] },
    { slug: "shopify-store-migration", name: "Shopify Store Migration Guides", entries: segments["shopify-store-migration"] ?? [] },
    { slug: "comparisons", name: "Tool Comparisons", entries: segments["comparisons"] ?? [] },
    { slug: "tools", name: "Tools", entries: segments["tools"] ?? [] },
    { slug: "learn", name: "Knowledge Base", entries: segments["learn"] ?? [] },
    { slug: "pages", name: "Site Pages", entries: segments["pages"] ?? [] },
  ].filter((s) => s.entries.length > 0);
}

/**
 * Generate the sitemap index (sitemap.xml)
 */
export function generateSitemapIndex(): string {
  const segments = getSegments();
  const today = new Date().toISOString().slice(0, 10);

  const sitemaps = segments.map(
    (seg) =>
      `  <sitemap>` +
      `<loc>${SITEMAP_ORIGIN}/sitemaps/${seg.slug}.xml</loc>` +
      `<lastmod>${today}</lastmod>` +
      `</sitemap>`
  ).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps}
</sitemapindex>`;
}

/**
 * Generate a segment sitemap
 */
export function generateSegmentSitemap(segment: SitemapSegment): string {
  const today = new Date().toISOString().slice(0, 10);

  const urls = segment.entries.map(
    (entry) =>
      `  <url>` +
      `<loc>${SITEMAP_ORIGIN}${entry.path}</loc>` +
      `<lastmod>${today}</lastmod>` +
      `<changefreq>${entry.changefreq}</changefreq>` +
      `<priority>${entry.priority}</priority>` +
      `</url>`
  ).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export function getSegmentsMap(): SitemapSegment[] {
  return getSegments();
}

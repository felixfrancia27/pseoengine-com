import { generateSitemapIndex } from "../sitemap.server";

export const loader = () => {
  const xml = generateSitemapIndex();

  return new Response(xml, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
};

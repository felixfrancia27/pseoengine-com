import { SITEMAP_ORIGIN } from "../sitemap.server";

export const loader = () => {
  const body = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /api/",
    "Disallow: /health",
    "",
    `Sitemap: ${SITEMAP_ORIGIN}/sitemap.xml`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=86400",
    },
  });
};

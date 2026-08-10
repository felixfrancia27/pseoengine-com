import type { LoaderFunctionArgs } from "@remix-run/node";
import { getSegmentsMap, generateSegmentSitemap } from "../sitemap.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const slug = params.slug!;
  const segments = getSegmentsMap();
  const segment = segments.find((s) => s.slug === slug);

  if (!segment) throw new Response("Not Found", { status: 404 });

  const xml = generateSegmentSitemap(segment);

  return new Response(xml, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
};

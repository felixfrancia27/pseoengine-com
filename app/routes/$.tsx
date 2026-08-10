/**
 * Catch-all route for unmatched paths.
 *
 * Returns a silent 404 for bot/scanner traffic hitting
 * non-existent paths like /tracking.php, /setup/, /.amper/...
 * without logging errors to the console.
 */
import type { LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Return a minimal 404 for all unmatched routes
  return new Response("Not Found", {
    status: 404,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=86400",
    },
  });
};

import { json } from "@remix-run/node";

export const loader = () => {
  return json({
    commit: process.env.RAILWAY_GIT_COMMIT_SHA || process.env.GIT_COMMIT || "unknown",
    builtAt: new Date().toISOString(),
    environment: process.env.NODE_ENV || "production",
    node: process.version,
  });
};

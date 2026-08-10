import { CONTENT_REGISTRY } from "../../data/content-registry";

/**
 * Content registry report.
 *
 * Run with: npx tsx src/cli/content-report.ts
 *
 * Shows the state of all pages in the registry:
 * Candidate, Draft, Needs review, Publishable, Published, Noindex
 */

function main() {
  const args = process.argv.slice(2);
  const showAll = args.includes("--all");

  console.log("Content Registry Report");
  console.log("=======================\n");

  const byStatus: Record<string, typeof CONTENT_REGISTRY> = {
    published: [],
    draft: [],
    review: [],
    noindex: [],
  };

  for (const entry of CONTENT_REGISTRY) {
    byStatus[entry.page.status]?.push(entry);
  }

  const total = CONTENT_REGISTRY.length;

  console.log(`Total pages in registry: ${total}`);
  console.log();
  console.log("Status breakdown:");
  for (const [status, entries] of Object.entries(byStatus)) {
    const pct = total > 0 ? Math.round((entries.length / total) * 100) : 0;
    console.log(`  ${status}: ${entries.length} (${pct}%)`);
  }
  console.log();

  // By type
  const byType: Record<string, typeof CONTENT_REGISTRY> = {};
  for (const entry of CONTENT_REGISTRY) {
    const t = entry.page.type;
    if (!byType[t]) byType[t] = [];
    byType[t]!.push(entry);
  }
  console.log("By content type:");
  for (const [type, entries] of Object.entries(byType)) {
    console.log(`  ${type}: ${entries.length}`);
  }
  console.log();

  // By platform
  const platformCounts: Record<string, number> = {};
  for (const entry of CONTENT_REGISTRY) {
    if (entry.page.platform) {
      platformCounts[entry.page.platform] = (platformCounts[entry.page.platform] || 0) + 1;
    }
  }
  console.log("Pages per platform:");
  for (const [slug, count] of Object.entries(platformCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${slug}: ${count}`);
  }
  console.log();

  // List all pages if requested
  if (showAll) {
    console.log("All pages:");
    console.log("----------");
    const sorted = [...CONTENT_REGISTRY].sort((a, b) => a.page.path.localeCompare(b.page.path));
    for (const entry of sorted) {
      const statusFlag = entry.page.status === "published" ? "✓" :
        entry.page.status === "draft" ? "○" :
          entry.page.status === "review" ? "◎" : "✗";
      console.log(`  ${statusFlag} ${entry.page.path} [${entry.page.type}] prio=${entry.page.priority}`);
    }
  }
}

main();

/**
 * AI content generation pipeline.
 *
 * Run with: npx tsx src/cli/generate.ts [--platform=slug] [--topic=slug]
 *
 * Architecture:
 * 1. Read topic specification from the content registry
 * 2. Read structured platform facts
 * 3. Read related existing content
 * 4. Read internal reference data
 * 5. Generate a draft (requires AI provider configured)
 * 6. Save generated article
 * 7. Run quality validation
 * 8. Mark as draft/review/published
 *
 * AI provider is abstracted. Set CONTENT_AI_PROVIDER and API key
 * in environment variables.
 */

import { PLATFORMS } from "../../data/platforms/index";
import { MIGRATION_ISSUES } from "../../data/migration-issues/index";
import { CONTENT_REGISTRY } from "../../data/content-registry";

interface GenerateOptions {
  platform?: string;
  topic?: string;
  model?: string;
  dryRun?: boolean;
}

function parseArgs(): GenerateOptions {
  const args = process.argv.slice(2);
  const opts: GenerateOptions = {};

  for (const arg of args) {
    if (arg.startsWith("--platform=")) {
      opts.platform = arg.slice(11);
    } else if (arg.startsWith("--topic=")) {
      opts.topic = arg.slice(8);
    } else if (arg.startsWith("--model=")) {
      opts.model = arg.slice(8);
    } else if (arg === "--dry-run") {
      opts.dryRun = true;
    }
  }

  return opts;
}

function getProviderConfig() {
  const provider = process.env.CONTENT_AI_PROVIDER || "openai";

  if (provider === "openai") {
    return {
      provider: "openai" as const,
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || "gpt-4o",
    };
  }

  if (provider === "anthropic") {
    return {
      provider: "anthropic" as const,
      apiKey: process.env.ANTHROPIC_API_KEY,
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514",
    };
  }

  return { provider: "none" as const, apiKey: null, model: null };
}

async function main() {
  const opts = parseArgs();
  const config = getProviderConfig();

  console.log("pseoengine — Content Generation Pipeline");
  console.log("==========================================\n");

  if (config.provider === "none" || !config.apiKey) {
    console.log("No AI provider configured. Set up one of:");
    console.log("  CONTENT_AI_PROVIDER=openai OPENAI_API_KEY=...");
    console.log("  CONTENT_AI_PROVIDER=anthropic ANTHROPIC_API_KEY=...");
    console.log();
  } else {
    console.log(`AI Provider: ${config.provider} (${config.model})`);
  }

  // Determine what to generate
  let targets: Array<{
    path: string;
    title: string;
    platform?: string;
    problem?: string;
    type: string;
  }> = [];

  if (opts.platform && opts.topic) {
    const entry = CONTENT_REGISTRY.find(
      (e) => e.page.platform === opts.platform && e.page.problem === opts.topic
    );
    if (entry) {
      targets.push({
        path: entry.page.path,
        title: entry.page.title,
        platform: entry.page.platform,
        problem: entry.page.problem,
        type: entry.page.type,
      });
    }
  } else if (opts.platform) {
    // Generate all pages for a platform
    const entries = CONTENT_REGISTRY.filter(
      (e) => e.page.platform === opts.platform && e.page.status !== "published"
    );
    targets = entries.map((e) => ({
      path: e.page.path,
      title: e.page.title,
      platform: e.page.platform,
      problem: e.page.problem,
      type: e.page.type,
    }));
  } else if (opts.topic) {
    // Generate all pages for a problem
    const entries = CONTENT_REGISTRY.filter(
      (e) => e.page.problem === opts.topic && e.page.status !== "published"
    );
    targets = entries.map((e) => ({
      path: e.page.path,
      title: e.page.title,
      platform: e.page.platform,
      problem: e.page.problem,
      type: e.page.type,
    }));
  } else {
    // Show available targets
    const draftPages = CONTENT_REGISTRY.filter((e) => e.page.status !== "published");

    console.log(`\n${draftPages.length} pages not yet published.`);
    console.log("\nUsage:");
    console.log("  npx tsx src/cli/generate.ts --platform=woocommerce");
    console.log("  npx tsx src/cli/generate.ts --topic=order-history");
    console.log("  npx tsx src/cli/generate.ts --platform=woocommerce --topic=order-history");
    console.log("  npx tsx src/cli/generate.ts --dry-run\n");

    if (draftPages.length > 0) {
      console.log("Available targets:");
      for (const entry of draftPages.slice(0, 20)) {
        console.log(`  [${entry.page.type}] ${entry.page.path}`);
      }
      if (draftPages.length > 20) {
        console.log(`  ... and ${draftPages.length - 20} more`);
      }
    }
    return;
  }

  console.log(`\nTargets to generate: ${targets.length}`);
  if (opts.dryRun) {
    console.log("DRY RUN — would generate:");
    for (const t of targets) {
      console.log(`  ${t.path}`);
      console.log(`    Platform: ${t.platform || "N/A"}, Problem: ${t.problem || "N/A"}`);
    }
    return;
  }

  // Generate each target
  for (const target of targets) {
    console.log(`\n--- Generating: ${target.path} ---`);

    if (config.provider === "none" || !config.apiKey) {
      console.log("  Skipped: No AI provider configured");
      continue;
    }

    // Build the prompt from structured data
    let platformFacts = "";
    if (target.platform) {
      const platform = PLATFORMS.find((p) => p.slug === target.platform);
      if (platform) {
        platformFacts = JSON.stringify({
          name: platform.name,
          description: platform.description,
          longDescription: platform.longDescription,
          dataModel: platform.dataModel,
          shopifyNativeMigrates: platform.shopifyNativeMigrates,
          shopifyNativeDoesNotMigrate: platform.shopifyNativeDoesNotMigrate,
          migrationComplexity: platform.migrationComplexity,
          exportMethods: platform.exportMethods,
          knownProblems: platform.knownProblems,
          seoConsiderations: platform.seoConsiderations,
          sources: platform.sources.map((s) => `${s.title} — ${s.publisher} (${s.url})`),
        }, null, 2);
      }
    }

    let problemFacts = "";
    if (target.problem) {
      const issue = MIGRATION_ISSUES.find((i) => i.slug === target.problem);
      if (issue) {
        problemFacts = JSON.stringify({
          title: issue.title,
          description: issue.description,
          whatMigrates: issue.whatMigrates,
          whatDoesNotMigrate: issue.whatDoesNotMigrate,
          risks: issue.risks,
          recommendedApproach: issue.recommendedApproach,
          technicalNotes: issue.technicalNotes,
          relatedIssues: issue.relatedIssues,
          sources: issue.sources.map((s) => `${s.title} — ${s.publisher} (${s.url})`),
        }, null, 2);
      }
    }

    const prompt = `You are writing technical content for a Shopify migration intelligence website (pseoengine.com).

TARGET PAGE: ${target.title}
PATH: ${target.path}
TYPE: ${target.type}

WRITING GUIDELINES:
- Write concise technical content
- Do NOT use generic AI introductions ("In today's digital landscape...")
- Do NOT invent facts, statistics, or platform capabilities
- Only reference what's in the structured data below
- Use short paragraphs and clear headings
- Answer the specific search intent
- Include practical, actionable information
- Max 1500 words

STRUCTURED PLATFORM FACTS:
${platformFacts || "No platform facts available."}

STRUCTURED PROBLEM FACTS:
${problemFacts || "No problem facts available."}

OUTPUT FORMAT:
Return the article as markdown with:
1. A concise intro paragraph (2-3 sentences, no filler)
2. A migration status summary (what transfers, what doesn't)
3. Platform-specific considerations
4. Risks and pitfalls
5. Recommended approach
6. Technical notes (if applicable)
7. Related migration issues to consider

Do not include the title as a heading. Start directly with content.`;

    console.log(`  Prompt length: ${prompt.length} characters`);
    console.log(`  Provider: ${config.provider} (${config.model})`);

    // TODO: Call AI provider API
    console.log(`  Note: AI generation requires API integration. See src/cli/generate.ts`);
  }

  console.log("\nDone. Run 'npx tsx src/cli/validate.ts' to check quality.");
  console.log("Run 'npx tsx src/cli/content-report.ts' to see registry status.");
}

main().catch(console.error);

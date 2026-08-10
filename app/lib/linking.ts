import { PLATFORMS } from "../../data/platforms/index";
import { MIGRATION_ISSUES } from "../../data/migration-issues/index";
import { CONTENT_REGISTRY } from "../../data/content-registry";
import type { ContentPage } from "../content/models";
import type { Platform } from "../content/models";
import type { MigrationIssue } from "../content/models";

/**
 * Internal linking engine.
 *
 * Programmatically determines which pages a given page should link to
 * based on platform relationships, issue relationships, and content type.
 *
 * Uses relevance scoring to prevent link bloat.
 */

export interface RelatedLink {
  path: string;
  title: string;
  relevance: "parent" | "sibling" | "related" | "tool";
}

export function getRelatedContent(page: ContentPage, limit = 8): RelatedLink[] {
  const links: RelatedLink[] = [];

  // Platform-specific → parent hub and sibling platforms
  if (page.type === "migration" || page.type === "problem") {
    if (page.platform) {
      const platform = PLATFORMS.find((p) => p.slug === page.platform);
      if (platform) {
        // Link to migration hub
        links.push({
          path: "/migrate/",
          title: "All migration guides",
          relevance: "parent",
        });
        // Link to platform hub
        links.push({
          path: `/migrate/${platform.slug}-to-shopify/`,
          title: `${platform.name} to Shopify`,
          relevance: "parent",
        });
      }
    }

    if (page.problem) {
      const issue = MIGRATION_ISSUES.find((i) => i.hasPage && i.slug === page.problem);
      if (issue) {
        // Link to generic problem page
        links.push({
          path: `/migrate/${issue.slug}/`,
          title: issue.title,
          relevance: "related",
        });

        // Link to related issues
        for (const relatedSlug of issue.relatedIssues.slice(0, 3)) {
          const related = MIGRATION_ISSUES.find((i) => i.hasPage && i.slug === relatedSlug);
          if (related) {
            links.push({
              path: `/migrate/${related.slug}/`,
              title: related.title,
              relevance: "related",
            });
          }
        }
      }
    }
  }

  // Hub pages → link to their children
  if (page.type === "hub") {
    if (page.path === "/migrate/") {
      // Link to top platforms
      const topPlatforms = PLATFORMS.slice(0, 6);
      for (const p of topPlatforms) {
        links.push({
          path: `/migrate/${p.slug}-to-shopify/`,
          title: `${p.name} → Shopify`,
          relevance: "sibling",
        });
      }
    }
  }

  // Always link to tools
  if (page.path !== "/tools/migration-assessment/") {
    links.push({
      path: "/tools/migration-assessment/",
      title: "Free migration assessment",
      relevance: "tool",
    });
  }

  // Deduplicate by path
  const seen = new Set<string>();
  const deduped: RelatedLink[] = [];
  for (const link of links) {
    if (!seen.has(link.path)) {
      seen.add(link.path);
      deduped.push(link);
    }
  }

  return deduped.slice(0, limit);
}

/**
 * Get sibling platform-problem pages.
 */
export function getSiblingPages(platformSlug: string, currentProblem: string, limit = 6): RelatedLink[] {
  const platform = PLATFORMS.find((p) => p.slug === platformSlug);
  if (!platform) return [];

  const issues = MIGRATION_ISSUES.filter(
    (i) => i.hasPage && i.slug !== currentProblem && i.affectedPlatforms.includes(platformSlug)
  ).slice(0, limit);

  return issues.map((i) => ({
    path: `/migrate/${platformSlug}-to-shopify/${i.slug}/`,
    title: i.title,
    relevance: "sibling" as const,
  }));
}

/**
 * Score the quality of a content page.
 * Returns 0-100 and a list of issues found.
 *
 * Scoring is nuanced: non-platform pages (tools, learn hubs, etc.)
 * are not penalized for lacking platform-specific facts. The
 * scoring adjusts to the content type.
 */
export function scoreContent(content: {
  title: string;
  description: string;
  body?: string;
  hasPlatformFacts?: boolean;
  hasUniqueSections?: number;
  hasSources?: boolean;
  hasInternalLinks?: boolean;
  hasWarningCallouts?: boolean;
  wordCount?: number;
  contentType?: string;
}): { score: number; maxScore: number; breakdown: Record<string, number>; issues: string[] } {
  const issues: string[] = [];
  const isPlatformPage = content.hasPlatformFacts || false;
  const isToolPage = content.contentType === "tool";
  const isHubPage = content.contentType === "hub";
  const isComparisonPage = content.contentType === "comparison";
  const hasRealContent = isHubPage || isComparisonPage || content.hasPlatformFacts;

  const breakdown: Record<string, number> = {
    intentCoverage: 0,
    platformSpecificity: 0,
    originalInformation: 0,
    internalLinking: 0,
    technicalDepth: 0,
    seoMetadata: 0,
  };

  // ── Intent coverage (25) ──────────────────────────────────
  if (content.title && content.title.length > 20) breakdown.intentCoverage! += 10;
  else if (content.title && content.title.length > 10) breakdown.intentCoverage! += 5;
  else issues.push("Title too short or generic");

  if (content.description && content.description.length > 80) breakdown.intentCoverage! += 8;
  else if (content.description && content.description.length > 50) breakdown.intentCoverage! += 5;
  else issues.push("Meta description too short");

  if (content.wordCount && content.wordCount >= 300) breakdown.intentCoverage! += 7;
  else if (content.wordCount && content.wordCount >= 150) breakdown.intentCoverage! += 3;
  else issues.push("Content too short (under 150 words)");

  // ── Platform specificity (20) ─────────────────────────────
  // Non-platform pages don't get penalized; they get partial credit
  // for being the right page type without platform data.
  if (content.hasPlatformFacts) {
    breakdown.platformSpecificity! += 15;
  } else if (hasRealContent) {
    // Hub/comparison pages have other forms of specificity
    breakdown.platformSpecificity! += 10;
  } else if (isToolPage) {
    breakdown.platformSpecificity! += 5;
  } else {
    issues.push("No platform-specific facts detected");
  }

  // ── Original information (20) ─────────────────────────────
  if (content.hasUniqueSections && content.hasUniqueSections >= 3) {
    breakdown.originalInformation! += 12;
  } else if (content.hasUniqueSections && content.hasUniqueSections >= 1) {
    breakdown.originalInformation! += 6;
  } else {
    issues.push("Fewer than 1 unique factual section");
  }

  if (content.hasWarningCallouts || isComparisonPage) breakdown.originalInformation! += 8;
  else if (isHubPage) breakdown.originalInformation! += 4;

  // ── Internal linking (10) ─────────────────────────────────
  if (content.hasInternalLinks) breakdown.internalLinking! += 7;
  else if (isHubPage) breakdown.internalLinking! += 4;
  else if (!isToolPage) issues.push("No internal links");

  // ── Technical depth (15) ──────────────────────────────────
  if (content.hasUniqueSections && content.hasUniqueSections >= 5) breakdown.technicalDepth! += 8;
  else if (isPlatformPage || isHubPage) breakdown.technicalDepth! += 4;

  if (content.wordCount && content.wordCount >= 500) breakdown.technicalDepth! += 7;
  else if (content.wordCount && content.wordCount >= 250) breakdown.technicalDepth! += 3;

  // ── SEO metadata (10) ─────────────────────────────────────
  if (content.title && content.description && content.title.length > 15 && content.description.length > 50) {
    breakdown.seoMetadata! += 7;
  } else {
    issues.push("Missing or incomplete SEO metadata");
  }

  if (content.hasSources || isHubPage || isComparisonPage) breakdown.seoMetadata! += 3;
  else if (!isToolPage) issues.push("No sources/references");

  const totalScore = Object.values(breakdown).reduce((a, b) => a + b, 0);
  const maxScore = 100;

  return { score: totalScore, maxScore, breakdown, issues };
}

/**
 * Check if a page is publishable based on quality threshold.
 */
export function isPublishable(score: number, threshold = 60): boolean {
  return score >= threshold;
}

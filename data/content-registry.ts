import type { ContentPage } from "../app/content/models";
import { PLATFORMS } from "./platforms/index";
import { MIGRATION_ISSUES } from "./migration-issues/index";

/**
 * Content registry.
 *
 * Every indexable page must be explicitly enabled here.
 * Pages are NOT auto-generated from platform × problem combinations.
 * Each entry must have a reason to exist independently.
 */

export interface RegistryEntry {
  /** The page model with status and metadata */
  page: ContentPage;
  /** Whether content has been generated */
  generated: boolean;
  /** Where the content file lives (if generated) */
  contentPath?: string;
}

function buildRegistry(): RegistryEntry[] {
  const entries: RegistryEntry[] = [];

  // ── Home ────────────────────────────────────────────────────────────────
  entries.push({
    page: {
      path: "/",
      title: "pseoengine — Technical Shopify Migration Intelligence",
      metaTitle: "Shopify Migration Intelligence — Know what will break before you move",
      metaDescription:
        "Technical migration guides, platform compatibility data, and SEO migration planning for established ecommerce stores moving to Shopify. Plan your migration before touching your store.",
      type: "hub",
      locale: "en",
      status: "published",
      priority: 100,
    },
    generated: false,
  });

  // ── Migration Hub ───────────────────────────────────────────────────────
  entries.push({
    page: {
      path: "/migrate/",
      title: "Ecommerce Platform Migration Guides",
      metaTitle: "Shopify Migration Guides by Platform — Technical migration intelligence",
      metaDescription:
        "Technical migration guides for every major ecommerce platform moving to Shopify. Covers WooCommerce, Magento, BigCommerce, PrestaShop, Shopware, VTEX, and more.",
      type: "hub",
      locale: "en",
      status: "published",
      priority: 95,
    },
    generated: false,
  });

  // ── Platform migration hubs ─────────────────────────────────────────────
  for (const platform of PLATFORMS) {
    entries.push({
      page: {
        path: `/migrate/${platform.slug}-to-shopify/`,
        title: `${platform.name} to Shopify Migration`,
        metaTitle: `${platform.name} to Shopify Migration Guide — What migrates, what breaks`,
        metaDescription:
          `Technical migration guide for moving from ${platform.name} to Shopify. Covers what data migrates, what doesn't, known problems, SEO considerations, and recommended approach.`,
        type: "hub",
        locale: "en",
        status: "published",
        priority: 90,
        platform: platform.slug,
      },
      generated: false,
    });
  }

  // ── Migration problem pages ─────────────────────────────────────────────
  for (const issue of MIGRATION_ISSUES) {
    if (!issue.hasPage) continue;

    // Generic problem page
    entries.push({
      page: {
        path: `/migrate/${issue.slug}/`,
        title: `${issue.title}: What You Need to Know`,
        metaTitle: `${issue.title} to Shopify — What migrates, what doesn't, risks, approach`,
        metaDescription: issue.description,
        type: "problem",
        locale: "en",
        status: "published",
        priority: issue.priority,
        problem: issue.slug,
      },
      generated: false,
    });

    // Platform-specific problem pages (only where the problem applies)
    for (const platformSlug of issue.affectedPlatforms) {
      const platform = PLATFORMS.find((p) => p.slug === platformSlug);
      if (!platform) continue;

      // Only create platform-specific page if the platform has this as a known problem
      if (!platform.knownProblems.includes(issue.slug)) continue;

      entries.push({
        page: {
          path: `/migrate/${platformSlug}-to-shopify/${issue.slug}/`,
          title: `${platform.name} ${issue.title} to Shopify`,
          metaTitle: `${platform.name} ${issue.title} to Shopify — Technical guide`,
          metaDescription:
            `How to migrate ${issue.slug.replace(/-/g, " ")} from ${platform.name} to Shopify. ` +
            `Covers what transfers, what doesn't, risks, and recommended approach.`,
          type: "problem",
          locale: "en",
          status: "published",
          priority: issue.priority - 5,
          platform: platformSlug,
          problem: issue.slug,
        },
        generated: false,
      });
    }
  }

  // ── Shopify Store Migration cluster ─────────────────────────────────────
  entries.push({
    page: {
      path: "/shopify-store-migration/",
      title: "Shopify Store Migration Tool — Complete Guide",
      metaTitle: "Shopify Store Migration App — Capabilities, limitations, alternatives",
      metaDescription:
        "Everything you need to know about Shopify's built-in Store Migration tool. What it migrates, what it doesn't, limitations by platform, and when to use alternatives.",
      type: "hub",
      locale: "en",
      status: "published",
      priority: 92,
    },
    generated: false,
  });

  entries.push({
    page: {
      path: "/shopify-store-migration/limitations/",
      title: "Shopify Store Migration App Limitations",
      metaTitle: "Shopify Store Migration Limitations — What the tool cannot do",
      metaDescription:
        "Comprehensive list of Shopify Store Migration app limitations by platform. What data Shopify's migration tool cannot transfer and how to handle each gap.",
      type: "learn",
      locale: "en",
      status: "published",
      priority: 88,
    },
    generated: false,
  });

  entries.push({
    page: {
      path: "/shopify-store-migration/orders/",
      title: "Does Shopify Store Migration Migrate Orders?",
      metaTitle: "Shopify Store Migration Orders — Does the migration tool move order history?",
      metaDescription:
        "Whether Shopify's built-in Store Migration app migrates historical orders, what order data transfers, and how to import orders if the native tool doesn't support your platform.",
      type: "learn",
      locale: "en",
      status: "published",
      priority: 85,
    },
    generated: false,
  });

  entries.push({
    page: {
      path: "/shopify-store-migration/seo/",
      title: "Shopify Store Migration SEO — Redirects, URLs, Rankings",
      metaTitle: "Shopify Store Migration SEO — Managing redirects and preserving rankings",
      metaDescription:
        "How Shopify's Store Migration app handles SEO including URL redirects, meta data transfer, sitemap changes, and what SEO work you must do manually after migration.",
      type: "learn",
      locale: "en",
      status: "published",
      priority: 82,
    },
    generated: false,
  });

  entries.push({
    page: {
      path: "/shopify-store-migration/redirects/",
      title: "Shopify Store Migration Redirects — How Redirects Work",
      metaTitle: "Shopify Store Migration Redirects — 301 setup and limitations",
      metaDescription:
        "How Shopify Store Migration app handles URL redirects, what redirects are created automatically, what you must create manually, and redirect limits.",
      type: "learn",
      locale: "en",
      status: "published",
      priority: 80,
    },
    generated: false,
  });

  entries.push({
    page: {
      path: "/shopify-store-migration/customer-passwords/",
      title: "Shopify Store Migration Customer Passwords",
      metaTitle: "Shopify Store Migration Customer Passwords — Why passwords never transfer",
      metaDescription:
        "Why Shopify's Store Migration app cannot migrate customer passwords, the technical reason (hashing incompatibility), and how to handle customer account migration.",
      type: "learn",
      locale: "en",
      status: "published",
      priority: 78,
    },
    generated: false,
  });

  entries.push({
    page: {
      path: "/shopify-store-migration/reviews/",
      title: "Shopify Store Migration Reviews — Product Review Transfer",
      metaTitle: "Shopify Store Migration Reviews — Can you migrate product reviews?",
      metaDescription:
        "Whether Shopify's Store Migration app transfers product reviews, which platforms support review migration, and how to import reviews when the native tool doesn't.",
      type: "learn",
      locale: "en",
      status: "published",
      priority: 75,
    },
    generated: false,
  });

  // ── Compare pages ───────────────────────────────────────────────────────
  entries.push({
    page: {
      path: "/compare/shopify-store-migration-vs-matrixify/",
      title: "Shopify Store Migration vs Matrixify — Comparison",
      metaTitle: "Shopify Store Migration vs Matrixify — Which migration tool to use",
      metaDescription:
        "Detailed comparison of Shopify's built-in Store Migration app vs Matrixify (Excelify). Features, platform support, data types, pricing, and when to use each.",
      type: "comparison",
      locale: "en",
      status: "published",
      priority: 82,
      compareSubjects: ["shopify-store-migration", "matrixify"],
    },
    generated: false,
  });

  entries.push({
    page: {
      path: "/compare/shopify-store-migration-vs-cart2cart/",
      title: "Shopify Store Migration vs Cart2Cart — Comparison",
      metaTitle: "Shopify Store Migration vs Cart2Cart — Shopify migration tool comparison",
      metaDescription:
        "Comparing Shopify's Store Migration app with Cart2Cart: supported platforms, data migration scope, pricing, and which tool fits different migration scenarios.",
      type: "comparison",
      locale: "en",
      status: "published",
      priority: 78,
      compareSubjects: ["shopify-store-migration", "cart2cart"],
    },
    generated: false,
  });

  // ── Tools ───────────────────────────────────────────────────────────────
  entries.push({
    page: {
      path: "/tools/",
      title: "Shopify Migration Tools — Assessment, Scanner, Resources",
      metaTitle: "Free Shopify Migration Tools — Store assessment, migration planner",
      metaDescription:
        "Free tools for planning your Shopify migration. Store assessment, migration complexity calculator, and platform analysis.",
      type: "tool",
      locale: "en",
      status: "published",
      priority: 85,
    },
    generated: false,
  });

  entries.push({
    page: {
      path: "/tools/migration-assessment/",
      title: "Shopify Migration Assessment — Free Store Analysis",
      metaTitle: "Free Shopify Migration Assessment — Analyze your store for migration",
      metaDescription:
        "Get a free assessment of your ecommerce store's Shopify migration readiness. We analyze your platform, catalog size, and migration complexity.",
      type: "tool",
      locale: "en",
      status: "published",
      priority: 88,
    },
    generated: false,
  });

  // ── Learn ───────────────────────────────────────────────────────────────
  entries.push({
    page: {
      path: "/learn/",
      title: "Shopify Migration Knowledge Base — Technical Guides",
      metaTitle: "Shopify Migration Knowledge Base — Technical guides and planning resources",
      metaDescription:
        "In-depth technical guides on Shopify migration planning, platform compatibility, SEO preservation, and migration tooling.",
      type: "learn",
      locale: "en",
      status: "published",
      priority: 80,
    },
    generated: false,
  });

  entries.push({
    page: {
      path: "/compare/",
      title: "Shopify Migration Tools Comparison",
      metaTitle: "Compare Shopify Migration Tools — Store Migration, Matrixify, Cart2Cart",
      metaDescription:
        "Compare Shopify migration tools and services. Side-by-side analysis of native Store Migration, Matrixify, Cart2Cart, and other migration approaches.",
      type: "hub",
      locale: "en",
      status: "published",
      priority: 75,
    },
    generated: false,
  });

  return entries;
}

export const CONTENT_REGISTRY: RegistryEntry[] = buildRegistry();

export function getPublishedPages(): ContentPage[] {
  return CONTENT_REGISTRY.filter(
    (e) => e.page.status === "published" && e.page.locale === "en"
  ).map((e) => e.page);
}

export function getPageByPath(path: string): ContentPage | undefined {
  return CONTENT_REGISTRY.find((e) => e.page.path === path)?.page;
}

export function getPagesByType(type: ContentPage["type"]): ContentPage[] {
  return CONTENT_REGISTRY.filter((e) => e.page.type === type).map((e) => e.page);
}

export function getPagesByPlatform(slug: string): ContentPage[] {
  return CONTENT_REGISTRY.filter((e) => e.page.platform === slug).map((e) => e.page);
}

export function getPagesByProblem(slug: string): ContentPage[] {
  return CONTENT_REGISTRY.filter((e) => e.page.problem === slug).map((e) => e.page);
}

/**
 * Build a content status report for admin/dev visibility.
 */
export function getContentReport() {
  const byStatus = {
    published: 0,
    draft: 0,
    review: 0,
    noindex: 0,
  };

  for (const entry of CONTENT_REGISTRY) {
    byStatus[entry.page.status]++;
  }

  return {
    total: CONTENT_REGISTRY.length,
    byStatus,
    generated: CONTENT_REGISTRY.filter((e) => e.generated).length,
    published: byStatus.published,
  };
}

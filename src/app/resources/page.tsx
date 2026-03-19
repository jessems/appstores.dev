import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Developer Resources — App Store Guides & Insights",
  description:
    "Guides, strategies, and insights for app developers navigating app store distribution. Learn about fees, review processes, ASO, and multi-store publishing.",
  keywords: [
    "app store guide",
    "app publishing tips",
    "developer resources",
    "app store optimization",
    "app distribution strategy",
  ],
  alternates: {
    canonical: "/resources",
  },
};

interface Article {
  slug: string;
  title: string;
  description: string;
  readTime: string;
  tags: string[];
}

const articles: Article[] = [
  {
    slug: "true-cost-of-app-stores",
    title: "The True Cost of App Stores: Beyond the Commission Rate",
    description:
      "Commission rates get all the attention, but registration fees, payment processing, reduced rate programs, and hidden costs paint a very different picture. We break down the real cost of 12 major app stores.",
    readTime: "8 min",
    tags: ["fees", "strategy"],
  },
  {
    slug: "multi-store-publishing-strategy",
    title: "Multi-Store Publishing: Why You Shouldn't Put All Your Apps in One Basket",
    description:
      "Publishing on multiple app stores can dramatically increase your reach and reduce platform risk. Here's a practical guide to multi-store distribution in 2026.",
    readTime: "10 min",
    tags: ["strategy", "distribution"],
  },
  {
    slug: "app-review-survival-guide",
    title: "The App Review Survival Guide: What Every Developer Should Know",
    description:
      "From Apple's notoriously strict review to Steam's hands-off approach, every store handles review differently. Learn how to avoid rejection and speed up approval.",
    readTime: "7 min",
    tags: ["review", "tips"],
  },
  {
    slug: "rise-of-ai-app-stores",
    title: "The Rise of AI App Stores: A New Frontier for Developers",
    description:
      "GPT Store, Claude, Poe, Coze — AI assistant marketplaces are creating a new category of app distribution. Here's what developers need to know about this emerging ecosystem.",
    readTime: "6 min",
    tags: ["ai", "trends"],
  },
];

export default function ResourcesPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold font-mono mb-3">
          <span className="text-dracula-cyan">$</span> cat resources/
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Guides and insights for developers navigating the app store landscape.
        </p>
      </div>

      <div className="space-y-6">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/resources/${article.slug}`}
            className="block border border-border rounded-lg p-6 hover:border-dracula-comment transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-dracula-purple" />
                  <span className="text-xs text-muted-foreground font-mono">
                    {article.readTime} read
                  </span>
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono text-dracula-comment"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-lg font-bold group-hover:text-dracula-cyan transition-colors mb-2">
                  {article.title}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {article.description}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-dracula-cyan transition-colors mt-1 shrink-0" />
            </div>
          </Link>
        ))}
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Developer Resources",
            description:
              "Guides and insights for developers navigating app store distribution.",
            url: "https://appstores.dev/resources",
            mainEntity: {
              "@type": "ItemList",
              itemListElement: articles.map((a, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `https://appstores.dev/resources/${a.slug}`,
                name: a.title,
              })),
            },
          }),
        }}
      />
    </main>
  );
}

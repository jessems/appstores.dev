import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { StoreGrid } from "@/components/store";
import { getTopRatedStores } from "@/lib/stores";
import { ratingDimensions, RatingDimension } from "@/data/ratings";

interface BestOfPageProps {
  params: Promise<{ dimension: string }>;
}

const dimensionSlugs: Record<RatingDimension, string> = {
  commission: "commission-rates",
  reviewProcess: "review-process",
  stability: "stability",
  developerSupport: "developer-support",
  discoverability: "discoverability",
  competitiveness: "market-reach",
  entryBarriers: "low-barriers",
  technicalFreedom: "technical-freedom",
  analytics: "analytics",
};

const slugToDimension: Record<string, RatingDimension> = Object.entries(
  dimensionSlugs
).reduce(
  (acc, [key, value]) => {
    acc[value] = key as RatingDimension;
    return acc;
  },
  {} as Record<string, RatingDimension>
);

const dimensionContent: Record<
  RatingDimension,
  { title: string; description: string; seoContent: string }
> = {
  commission: {
    title: "Best App Stores for Commission Rates",
    description:
      "App stores with the most favorable commission structures, letting you keep more of your revenue.",
    seoContent:
      "Commission rates directly impact your bottom line. These stores score highest for their developer-friendly revenue sharing, including reduced commission tiers, indie developer programs, and competitive base rates. Lower commission means more revenue stays with you.",
  },
  reviewProcess: {
    title: "Best App Stores for Review Process",
    description:
      "App stores with the clearest, fastest, and most transparent review processes.",
    seoContent:
      "A smooth review process means faster time to market and fewer frustrations. These stores excel at clear guidelines, predictable timelines, transparent rejection reasons, and efficient appeals processes. Less friction in publishing means more time building your app.",
  },
  stability: {
    title: "Most Stable App Stores",
    description:
      "App stores known for platform stability, consistent policies, and reliable operation.",
    seoContent:
      "Platform stability matters for long-term planning. These stores have proven track records of reliable infrastructure, consistent policy enforcement, and stable business operations. Building on a stable platform protects your investment.",
  },
  developerSupport: {
    title: "Best App Stores for Developer Support",
    description:
      "App stores offering excellent developer relations, documentation, and support channels.",
    seoContent:
      "Good developer support can save hours of debugging and frustration. These stores provide responsive support teams, comprehensive documentation, active developer communities, and helpful resources for common issues.",
  },
  discoverability: {
    title: "Best App Stores for Discoverability",
    description:
      "App stores where your app has the best chance of being discovered by users.",
    seoContent:
      "Discoverability determines how easily users find your app. These stores offer effective search algorithms, fair featured placement, category organization, and anti-spam measures that help quality apps stand out.",
  },
  competitiveness: {
    title: "Best App Stores for Market Reach",
    description:
      "App stores with the largest user bases and best market penetration.",
    seoContent:
      "Market reach determines your potential audience. These stores have significant user bases, strong market positions, and the potential to connect your app with large numbers of potential users.",
  },
  entryBarriers: {
    title: "Easiest App Stores to Get Started",
    description:
      "App stores with the lowest barriers to entry for new developers.",
    seoContent:
      "Low entry barriers let you start publishing quickly. These stores minimize upfront costs, simplify registration, offer straightforward requirements, and make it easy for new developers to get their first app published.",
  },
  technicalFreedom: {
    title: "Best App Stores for Technical Freedom",
    description:
      "App stores that give developers the most flexibility in implementation.",
    seoContent:
      "Technical freedom enables innovation. These stores allow flexible payment processing, broad API usage, varied monetization strategies, and minimal technical restrictions on what you can build.",
  },
  analytics: {
    title: "Best App Stores for Analytics",
    description:
      "App stores providing the best data, insights, and analytics tools.",
    seoContent:
      "Good analytics drive informed decisions. These stores offer comprehensive dashboards, detailed metrics, export capabilities, and actionable insights about your app's performance and user behavior.",
  },
};

export async function generateStaticParams() {
  return Object.values(dimensionSlugs).map((slug) => ({
    dimension: slug,
  }));
}

export async function generateMetadata({
  params,
}: BestOfPageProps): Promise<Metadata> {
  const { dimension: slug } = await params;
  const dimensionId = slugToDimension[slug];

  if (!dimensionId) {
    return { title: "Not Found" };
  }

  const content = dimensionContent[dimensionId];
  const title = `${content.title} - App Store Directory`;

  return {
    title,
    description: content.description,
    keywords: [
      `best ${slug.replace("-", " ")} app stores`,
      "app store comparison",
      "app store ratings",
      "developer platforms",
      "app distribution",
      slug.replace("-", " "),
    ],
    alternates: {
      canonical: `/stores/best/${slug}`,
    },
    openGraph: {
      title,
      description: content.description,
      type: "website",
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(content.title)}&description=${encodeURIComponent(content.description)}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

export default async function BestOfPage({ params }: BestOfPageProps) {
  const { dimension: slug } = await params;
  const dimensionId = slugToDimension[slug];

  if (!dimensionId) {
    notFound();
  }

  const content = dimensionContent[dimensionId];
  const dimensionInfo = ratingDimensions.find((d) => d.id === dimensionId);
  const stores = await getTopRatedStores(dimensionId, 20);

  return (
    <div className="py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href="/stores"
            className="hover:text-foreground transition-colors"
          >
            Stores
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Best for {dimensionInfo?.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3">{content.title}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            {content.description} Showing top {stores.length} rated stores.
          </p>
        </div>

        {/* Store count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            Top {stores.length} stores by {dimensionInfo?.name.toLowerCase()}
          </p>
          <Link
            href="/stores"
            className="text-sm text-primary hover:underline"
          >
            View all stores
          </Link>
        </div>

        {/* Stores Grid */}
        {stores.length > 0 ? (
          <StoreGrid stores={stores} />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No stores have been rated for this dimension yet.
            </p>
            <Link
              href="/stores"
              className="text-primary hover:underline mt-2 inline-block"
            >
              Browse all stores
            </Link>
          </div>
        )}

        {/* SEO Content */}
        <div className="mt-16 prose prose-gray dark:prose-invert max-w-none">
          <h2>About This Ranking</h2>
          <p>{content.seoContent}</p>

          <h2>How We Rate {dimensionInfo?.name}</h2>
          <p>
            {dimensionInfo?.description}. Each store is rated on a scale of 1-5
            based on our research and analysis. Stores are ranked by their score
            in this dimension to help you find the best fit for your priorities.
          </p>
        </div>

        {/* Other Rankings */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Explore Other Rankings</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(dimensionSlugs)
              .filter(([, s]) => s !== slug)
              .map(([dim, s]) => {
                const info = ratingDimensions.find((d) => d.id === dim);
                return (
                  <Link
                    key={s}
                    href={`/stores/best/${s}`}
                    className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-sm"
                  >
                    Best {info?.shortName}
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

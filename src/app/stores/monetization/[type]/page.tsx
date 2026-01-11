import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { StoreGrid } from "@/components/store";
import {
  getFreeToPublishStores,
  getLowCommissionStores,
  getNoCommissionStores,
} from "@/lib/stores";
import { StoreCardData } from "@/types/store";

interface MonetizationTypeInfo {
  id: string;
  name: string;
  shortName: string;
  description: string;
  seoContent: string;
  getStores: () => Promise<StoreCardData[]>;
}

const monetizationTypes: MonetizationTypeInfo[] = [
  {
    id: "free-to-publish",
    name: "Free to Publish App Stores",
    shortName: "Free to Publish",
    description:
      "App stores with no registration fee or upfront cost to publish your apps.",
    seoContent:
      "Free to publish app stores remove the financial barrier to entry for developers. Without registration fees, you can test the market, reach new audiences, and validate your app idea without upfront investment. These stores typically monetize through commissions on sales instead of developer fees.",
    getStores: getFreeToPublishStores,
  },
  {
    id: "low-commission",
    name: "Low Commission App Stores",
    shortName: "Low Commission",
    description:
      "App stores with commission rates of 15% or less, maximizing your revenue share.",
    seoContent:
      "Low commission app stores let you keep more of your earnings. While major platforms typically charge 30%, these stores offer 15% or less, significantly improving your margins. This is especially important for apps with high volume or tight profit margins.",
    getStores: () => getLowCommissionStores(15),
  },
  {
    id: "no-commission",
    name: "Zero Commission App Stores",
    shortName: "Zero Commission",
    description:
      "App stores that take no cut of your revenue - keep 100% of your earnings.",
    seoContent:
      "Zero commission app stores allow developers to retain 100% of their app revenue. These platforms typically monetize through other means such as premium listings, advertising, or enterprise subscriptions. They're ideal for maximizing profitability, especially for established apps with predictable revenue.",
    getStores: getNoCommissionStores,
  },
];

// Force static generation for Cloudflare Workers
export const dynamic = "force-static";

interface MonetizationPageProps {
  params: Promise<{ type: string }>;
}

export async function generateStaticParams() {
  return monetizationTypes.map((type) => ({
    type: type.id,
  }));
}

function getMonetizationTypeById(id: string): MonetizationTypeInfo | undefined {
  return monetizationTypes.find((t) => t.id === id);
}

export async function generateMetadata({
  params,
}: MonetizationPageProps): Promise<Metadata> {
  const { type: typeId } = await params;
  const monetizationType = getMonetizationTypeById(typeId);

  if (!monetizationType) {
    return { title: "Not Found" };
  }

  const title = `${monetizationType.name} - App Store Directory`;
  const description = monetizationType.description;

  return {
    title,
    description,
    keywords: [
      monetizationType.shortName.toLowerCase(),
      `${monetizationType.shortName.toLowerCase()} app stores`,
      "app store fees",
      "app store commission",
      "app distribution",
      "developer revenue",
      "app marketplace",
    ],
    alternates: {
      canonical: `/stores/monetization/${typeId}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(monetizationType.name)}&description=${encodeURIComponent(description)}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

export default async function MonetizationPage({
  params,
}: MonetizationPageProps) {
  const { type: typeId } = await params;
  const monetizationType = getMonetizationTypeById(typeId);

  if (!monetizationType) {
    notFound();
  }

  const stores = await monetizationType.getStores();

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
          <span className="text-foreground">{monetizationType.shortName}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3">{monetizationType.name}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            {monetizationType.description} Browse {stores.length}{" "}
            {stores.length === 1 ? "store" : "stores"} with favorable pricing.
          </p>
        </div>

        {/* Store count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {stores.length} {stores.length === 1 ? "store" : "stores"}
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
              No stores found with {monetizationType.shortName.toLowerCase()}{" "}
              pricing.
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
          <h2>Why Choose {monetizationType.shortName} Stores?</h2>
          <p>{monetizationType.seoContent}</p>

          <h2>Considerations Beyond Fees</h2>
          <p>
            While {monetizationType.shortName.toLowerCase()} pricing is
            attractive, remember to consider other factors when choosing an app
            store: audience reach, review process quality, feature support, and
            platform stability. The best store for your app balances cost with
            opportunity.
          </p>
        </div>

        {/* Related Monetization Options */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Explore Other Pricing Options</h2>
          <div className="flex flex-wrap gap-2">
            {monetizationTypes
              .filter((t) => t.id !== typeId)
              .map((t) => (
                <Link
                  key={t.id}
                  href={`/stores/monetization/${t.id}`}
                  className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-sm"
                >
                  {t.shortName}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

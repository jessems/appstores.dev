import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { StoreGrid } from "@/components/store";
import {
  getStoresWithApi,
  getStoresWithSdk,
  getStoresWithSubscriptions,
  getStoresWithInAppPurchases,
  getStoresWithBetaTesting,
  getStoresWithAnalytics,
} from "@/lib/stores";
import { StoreCardData } from "@/types/store";

interface FeatureInfo {
  id: string;
  name: string;
  shortName: string;
  description: string;
  seoContent: string;
  getStores: () => Promise<StoreCardData[]>;
}

const features: FeatureInfo[] = [
  {
    id: "api",
    name: "App Stores with API Support",
    shortName: "API Support",
    description:
      "App stores that provide APIs for automated publishing, analytics, and app management.",
    seoContent:
      "API support enables developers to automate their app publishing workflow, integrate with CI/CD pipelines, and programmatically manage their listings. Stores with APIs allow for faster updates, automated metadata management, and integration with development tools.",
    getStores: getStoresWithApi,
  },
  {
    id: "sdk",
    name: "App Stores with SDK Support",
    shortName: "SDK Support",
    description:
      "App stores offering SDKs for deep integration with your applications.",
    seoContent:
      "SDK support means the app store provides software development kits that you can integrate directly into your app. This enables features like in-app updates, analytics tracking, crash reporting, and native payment processing without building everything from scratch.",
    getStores: getStoresWithSdk,
  },
  {
    id: "subscriptions",
    name: "App Stores Supporting Subscriptions",
    shortName: "Subscriptions",
    description:
      "App stores that support subscription-based monetization for recurring revenue.",
    seoContent:
      "Subscription support is crucial for SaaS apps, streaming services, and any app with a recurring revenue model. These stores handle subscription billing, renewal management, and often provide tools for subscription analytics and churn reduction.",
    getStores: getStoresWithSubscriptions,
  },
  {
    id: "in-app-purchases",
    name: "App Stores with In-App Purchases",
    shortName: "In-App Purchases",
    description:
      "App stores enabling in-app purchase functionality for digital goods and consumables.",
    seoContent:
      "In-app purchase support allows you to sell digital content, premium features, virtual goods, and consumables directly within your app. The store handles payment processing, receipt validation, and often provides purchase restoration for users across devices.",
    getStores: getStoresWithInAppPurchases,
  },
  {
    id: "beta-testing",
    name: "App Stores with Beta Testing",
    shortName: "Beta Testing",
    description:
      "App stores offering beta testing programs for pre-release app distribution.",
    seoContent:
      "Beta testing features allow you to distribute pre-release versions of your app to testers before public launch. This helps identify bugs, gather feedback, and validate new features with real users in a controlled environment.",
    getStores: getStoresWithBetaTesting,
  },
  {
    id: "analytics",
    name: "App Stores with Analytics Dashboard",
    shortName: "Analytics",
    description:
      "App stores providing built-in analytics dashboards for tracking app performance.",
    seoContent:
      "Built-in analytics dashboards give you insights into downloads, user engagement, revenue, and app performance without integrating third-party tools. These insights help you make data-driven decisions about your app strategy and marketing.",
    getStores: getStoresWithAnalytics,
  },
];

// Force static generation for Cloudflare Workers
export const dynamic = "force-static";
export const dynamicParams = false;

interface FeaturePageProps {
  params: Promise<{ feature: string }>;
}

export async function generateStaticParams() {
  return features.map((feature) => ({
    feature: feature.id,
  }));
}

function getFeatureById(id: string): FeatureInfo | undefined {
  return features.find((f) => f.id === id);
}

export async function generateMetadata({
  params,
}: FeaturePageProps): Promise<Metadata> {
  const { feature: featureId } = await params;
  const feature = getFeatureById(featureId);

  if (!feature) {
    return { title: "Feature Not Found" };
  }

  const title = `${feature.name} - App Store Directory`;
  const description = feature.description;

  return {
    title,
    description,
    keywords: [
      feature.shortName.toLowerCase(),
      `app stores with ${feature.shortName.toLowerCase()}`,
      "app distribution",
      "developer platforms",
      "app marketplace",
      feature.id,
    ],
    alternates: {
      canonical: `/stores/features/${featureId}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(feature.name)}&description=${encodeURIComponent(description)}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

export default async function FeaturePage({ params }: FeaturePageProps) {
  const { feature: featureId } = await params;
  const feature = getFeatureById(featureId);

  if (!feature) {
    notFound();
  }

  const stores = await feature.getStores();

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
          <span className="text-foreground">{feature.shortName}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3">{feature.name}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            {feature.description} Browse {stores.length}{" "}
            {stores.length === 1 ? "store" : "stores"} with this capability.
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
              No stores found with {feature.shortName.toLowerCase()}.
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
          <h2>Why {feature.shortName} Matters</h2>
          <p>{feature.seoContent}</p>

          <h2>Finding the Right Store</h2>
          <p>
            When choosing an app store with {feature.shortName.toLowerCase()},
            consider factors like commission rates, audience reach, review
            process, and how well the feature integrates with your development
            workflow. Each store listed above provides{" "}
            {feature.shortName.toLowerCase()} functionality, but implementation
            details and capabilities may vary.
          </p>
        </div>

        {/* Related Features */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Explore Other Features</h2>
          <div className="flex flex-wrap gap-2">
            {features
              .filter((f) => f.id !== featureId)
              .map((f) => (
                <Link
                  key={f.id}
                  href={`/stores/features/${f.id}`}
                  className="px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-sm"
                >
                  {f.shortName}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

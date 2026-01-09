import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Check, X, Minus, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getStoreBySlug, getAllStores } from "@/lib/stores";
import { getCategoryById } from "@/data/categories";
import { AppStore } from "@/types/store";

interface ComparePageProps {
  params: Promise<{ slug: string }>;
}

// Generate static params for popular comparisons
const popularComparisons = [
  "google-play-vs-apple-app-store",
  "google-play-vs-amazon-appstore",
  "apple-app-store-vs-samsung-galaxy-store",
  "steam-vs-epic-games-store",
  "f-droid-vs-google-play",
  "huawei-appgallery-vs-google-play",
];

export async function generateStaticParams() {
  return popularComparisons.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ComparePageProps): Promise<Metadata> {
  const { slug } = await params;
  const [slug1, slug2] = parseComparisonSlug(slug);

  if (!slug1 || !slug2) {
    return { title: "Comparison Not Found" };
  }

  const [store1, store2] = await Promise.all([
    getStoreBySlug(slug1),
    getStoreBySlug(slug2),
  ]);

  if (!store1 || !store2) {
    return { title: "Comparison Not Found" };
  }

  const title = `${store1.name} vs ${store2.name} - App Store Comparison`;
  const description = `Compare ${store1.name} and ${store2.name}. See differences in fees, commission rates, features, and requirements side by side.`;

  return {
    title,
    description,
    keywords: [
      `${store1.name} vs ${store2.name}`,
      `${store2.name} vs ${store1.name}`,
      "app store comparison",
      "compare app stores",
    ],
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

function parseComparisonSlug(slug: string): [string | null, string | null] {
  const parts = slug.split("-vs-");
  if (parts.length !== 2) return [null, null];
  return [parts[0], parts[1]];
}

export default async function ComparisonPage({ params }: ComparePageProps) {
  const { slug } = await params;
  const [slug1, slug2] = parseComparisonSlug(slug);

  if (!slug1 || !slug2) {
    notFound();
  }

  const [store1, store2] = await Promise.all([
    getStoreBySlug(slug1),
    getStoreBySlug(slug2),
  ]);

  if (!store1 || !store2) {
    notFound();
  }

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
            href="/compare"
            className="hover:text-foreground transition-colors"
          >
            Compare
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">
            {store1.name} vs {store2.name}
          </span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-3">
            {store1.name} vs {store2.name}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A detailed comparison to help you choose the right app store for
            your needs.
          </p>
        </div>

        {/* Store Headers */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <StoreHeader store={store1} />
          <StoreHeader store={store2} />
        </div>

        {/* Comparison Table */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Feature Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-0 divide-y">
              <ComparisonRow
                label="Commission"
                value1={`${store1.fees.commissionTiers[0]?.percentage ?? "N/A"}%`}
                value2={`${store2.fees.commissionTiers[0]?.percentage ?? "N/A"}%`}
                highlight={
                  (store1.fees.commissionTiers[0]?.percentage ?? 100) <
                  (store2.fees.commissionTiers[0]?.percentage ?? 100)
                    ? "left"
                    : (store2.fees.commissionTiers[0]?.percentage ?? 100) <
                        (store1.fees.commissionTiers[0]?.percentage ?? 100)
                      ? "right"
                      : null
                }
              />
              <ComparisonRow
                label="Registration Fee"
                value1={formatFee(store1)}
                value2={formatFee(store2)}
              />
              <ComparisonRow
                label="Review Time"
                value1={store1.submission.typicalReviewTime || "Not specified"}
                value2={store2.submission.typicalReviewTime || "Not specified"}
              />
              <ComparisonRow
                label="App Count"
                value1={formatNumber(store1.metrics.appCount)}
                value2={formatNumber(store2.metrics.appCount)}
              />
              <ComparisonRowBoolean
                label="Has API"
                value1={store1.technical.hasApi}
                value2={store2.technical.hasApi}
              />
              <ComparisonRowBoolean
                label="Has SDK"
                value1={store1.technical.hasSdk}
                value2={store2.technical.hasSdk}
              />
              <ComparisonRowBoolean
                label="In-App Purchases"
                value1={store1.technical.supportsInAppPurchases}
                value2={store2.technical.supportsInAppPurchases}
              />
              <ComparisonRowBoolean
                label="Subscriptions"
                value1={store1.technical.supportsSubscriptions}
                value2={store2.technical.supportsSubscriptions}
              />
              <ComparisonRowBoolean
                label="Human Review"
                value1={store1.submission.hasHumanReview}
                value2={store2.submission.hasHumanReview}
              />
              <ComparisonRowBoolean
                label="Analytics Dashboard"
                value1={store1.features.hasAnalyticsDashboard}
                value2={store2.features.hasAnalyticsDashboard}
              />
              <ComparisonRowBoolean
                label="Beta Testing"
                value1={store1.features.hasBetaTesting}
                value2={store2.features.hasBetaTesting}
              />
            </div>
          </CardContent>
        </Card>

        {/* Platforms */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {store1.name} Platforms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {store1.platforms.map((p) => (
                  <Badge key={p} variant="secondary">
                    {p}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {store2.name} Platforms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {store2.platforms.map((p) => (
                  <Badge key={p} variant="secondary">
                    {p}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTAs */}
        <div className="grid md:grid-cols-2 gap-6">
          <Link href={`/stores/${store1.slug}`}>
            <Button variant="outline" className="w-full">
              View {store1.name} Details
            </Button>
          </Link>
          <Link href={`/stores/${store2.slug}`}>
            <Button variant="outline" className="w-full">
              View {store2.name} Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function StoreHeader({ store }: { store: AppStore }) {
  const category = getCategoryById(store.category);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-muted shrink-0">
            {store.logo ? (
              <Image
                src={store.logo}
                alt={`${store.name} logo`}
                fill
                className="object-contain p-2"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-muted-foreground">
                {store.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-xl truncate">{store.name}</h2>
            {category && (
              <p className="text-sm text-muted-foreground">{category.name}</p>
            )}
          </div>
          <a href={store.url} target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="ghost">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

function ComparisonRow({
  label,
  value1,
  value2,
  highlight,
}: {
  label: string;
  value1: string;
  value2: string;
  highlight?: "left" | "right" | null;
}) {
  return (
    <div className="grid grid-cols-3 py-3 text-sm">
      <div className="font-medium">{label}</div>
      <div
        className={`text-center ${highlight === "left" ? "text-green-600 font-medium" : ""}`}
      >
        {value1}
      </div>
      <div
        className={`text-center ${highlight === "right" ? "text-green-600 font-medium" : ""}`}
      >
        {value2}
      </div>
    </div>
  );
}

function ComparisonRowBoolean({
  label,
  value1,
  value2,
}: {
  label: string;
  value1: boolean;
  value2: boolean;
}) {
  return (
    <div className="grid grid-cols-3 py-3 text-sm">
      <div className="font-medium">{label}</div>
      <div className="text-center">
        {value1 ? (
          <Check className="h-5 w-5 text-green-600 mx-auto" />
        ) : (
          <X className="h-5 w-5 text-muted-foreground mx-auto" />
        )}
      </div>
      <div className="text-center">
        {value2 ? (
          <Check className="h-5 w-5 text-green-600 mx-auto" />
        ) : (
          <X className="h-5 w-5 text-muted-foreground mx-auto" />
        )}
      </div>
    </div>
  );
}

function formatFee(store: AppStore): string {
  if (!store.fees.registrationFee || store.fees.registrationFee.amount === 0) {
    return "Free";
  }
  const fee = store.fees.registrationFee;
  return `${fee.currency}${fee.amount} ${fee.type === "annual" ? "/year" : "one-time"}`;
}

function formatNumber(num?: number): string {
  if (!num) return "N/A";
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(0)}K`;
  }
  return num.toString();
}

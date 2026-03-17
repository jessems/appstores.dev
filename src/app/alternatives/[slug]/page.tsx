import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  ExternalLink,
  DollarSign,
  Users,
  Smartphone,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StoreGrid } from "@/components/store";
import {
  getAllStores,
  getAllSlugs,
  getStoreBySlug,
  storeToCardData,
  calculateOverallRating,
} from "@/lib/stores";
import { getCategoryById } from "@/data/categories";
import { getPlatformsByIds } from "@/data/platforms";
import { AppStore, StoreCardData } from "@/types/store";

// Force static generation
export const dynamic = "force-static";

interface AlternativesPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: AlternativesPageProps): Promise<Metadata> {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);

  if (!store) {
    return { title: "Not Found" };
  }

  const title = `${store.name} Alternatives — Best Similar App Stores (2026)`;
  const description = `Looking for alternatives to ${store.name}? Compare ${store.name} with similar app stores by fees, features, platform support, and more. Find the best fit for your app.`;

  return {
    title,
    description,
    keywords: [
      `${store.name} alternatives`,
      `apps like ${store.name}`,
      `${store.name} competitors`,
      `best ${store.name} alternative`,
      "app store comparison",
      "app distribution platforms",
    ],
    alternates: {
      canonical: `/alternatives/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(`${store.name} Alternatives`)}&description=${encodeURIComponent(description)}`,
          width: 1200,
          height: 630,
          alt: `${store.name} Alternatives`,
        },
      ],
    },
  };
}

function getAlternatives(store: AppStore, allStores: AppStore[]): AppStore[] {
  const others = allStores.filter((s) => s.slug !== store.slug);

  // Score each store by similarity
  const scored = others.map((s) => {
    let score = 0;

    // Same category = strong signal
    if (s.category === store.category) score += 10;

    // Overlapping platforms
    const platformOverlap = s.platforms.filter((p) =>
      store.platforms.includes(p)
    ).length;
    score += platformOverlap * 3;

    // Similar features
    if (s.technical.hasApi === store.technical.hasApi) score += 1;
    if (s.technical.hasSdk === store.technical.hasSdk) score += 1;
    if (
      s.technical.supportsSubscriptions === store.technical.supportsSubscriptions
    )
      score += 1;
    if (
      s.technical.supportsInAppPurchases ===
      store.technical.supportsInAppPurchases
    )
      score += 1;

    // Similar monetization models
    const modelOverlap = s.monetization.models.filter((m) =>
      store.monetization.models.includes(m)
    ).length;
    score += modelOverlap * 2;

    // Featured stores get a slight boost
    if (s.metadata.featured) score += 2;

    return { store: s, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .map((s) => s.store);
}

function formatFee(store: AppStore): string {
  const fee = store.fees.registrationFee;
  if (!fee || fee.amount === 0) return "Free";
  return `${fee.currency} ${fee.amount}${fee.type === "annual" ? "/yr" : ""}`;
}

function getCommission(store: AppStore): string {
  const tier = store.fees.commissionTiers[0];
  if (!tier) return "N/A";
  if (tier.percentage === 0) return "0%";
  return `${tier.percentage}%`;
}

export default async function AlternativesPage({
  params,
}: AlternativesPageProps) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);

  if (!store) {
    notFound();
  }

  const allStores = await getAllStores();
  const alternatives = getAlternatives(store, allStores);
  const category = getCategoryById(store.category);
  const storePlatforms = getPlatformsByIds(store.platforms);

  // Separate into same-category and cross-category
  const sameCategoryAlts = alternatives.filter(
    (s) => s.category === store.category
  );
  const crossCategoryAlts = alternatives.filter(
    (s) => s.category !== store.category
  );

  // JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${store.name} Alternatives`,
    description: `Compare alternatives to ${store.name} for app distribution.`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://appstores.dev",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Alternatives",
          item: "https://appstores.dev/alternatives",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: `${store.name} Alternatives`,
          item: `https://appstores.dev/alternatives/${slug}`,
        },
      ],
    },
    mainEntity: {
      "@type": "ItemList",
      name: `Alternatives to ${store.name}`,
      numberOfItems: alternatives.length,
      itemListElement: alternatives.slice(0, 10).map((alt, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: alt.name,
        url: `https://appstores.dev/stores/${alt.slug}`,
      })),
    },
  };

  return (
    <div className="py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href="/alternatives"
            className="hover:text-foreground transition-colors"
          >
            Alternatives
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{store.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-start gap-4 mb-4">
            {store.logo && (
              <div className="relative w-16 h-16 rounded-xl overflow-hidden border bg-white flex-shrink-0">
                <Image
                  src={store.logo}
                  alt={store.name}
                  fill
                  className="object-contain p-2"
                />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold">
                Best {store.name} Alternatives
              </h1>
              <p className="text-lg text-muted-foreground mt-1">
                {alternatives.length} similar app stores and distribution
                platforms to consider
              </p>
            </div>
          </div>

          {/* Quick stats about the original store */}
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-6 text-sm">
                <div>
                  <span className="text-muted-foreground">Category:</span>{" "}
                  <Link
                    href={`/stores/category/${category?.slug}`}
                    className="text-primary hover:underline"
                  >
                    {category?.name ?? store.category}
                  </Link>
                </div>
                <div>
                  <span className="text-muted-foreground">Platforms:</span>{" "}
                  {storePlatforms.map((p) => p.name).join(", ")}
                </div>
                <div>
                  <span className="text-muted-foreground">Commission:</span>{" "}
                  {getCommission(store)}
                </div>
                <div>
                  <span className="text-muted-foreground">
                    Registration Fee:
                  </span>{" "}
                  {formatFee(store)}
                </div>
                {store.metrics.appCount && (
                  <div>
                    <span className="text-muted-foreground">Apps:</span>{" "}
                    {store.metrics.appCount.toLocaleString()}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comparison Table */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">
            Quick Comparison: {store.name} vs Alternatives
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Store</th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Category
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Commission
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Reg. Fee
                  </th>
                  <th className="text-left py-3 px-4 font-semibold">
                    Platforms
                  </th>
                  <th className="text-center py-3 px-4 font-semibold">API</th>
                  <th className="text-center py-3 px-4 font-semibold">
                    Subscriptions
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Original store row */}
                <tr className="border-b bg-primary/5">
                  <td className="py-3 px-4 font-medium">
                    <Link
                      href={`/stores/${store.slug}`}
                      className="text-primary hover:underline"
                    >
                      {store.name}
                    </Link>
                    <Badge variant="outline" className="ml-2 text-xs">
                      Current
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    {category?.name ?? store.category}
                  </td>
                  <td className="py-3 px-4">{getCommission(store)}</td>
                  <td className="py-3 px-4">{formatFee(store)}</td>
                  <td className="py-3 px-4">
                    {storePlatforms.map((p) => p.name).join(", ")}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {store.technical.hasApi ? (
                      <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {store.technical.supportsSubscriptions ? (
                      <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                    ) : (
                      <XCircle className="h-4 w-4 text-muted-foreground mx-auto" />
                    )}
                  </td>
                </tr>
                {/* Alternative store rows */}
                {alternatives.slice(0, 10).map((alt) => {
                  const altCategory = getCategoryById(alt.category);
                  const altPlatforms = getPlatformsByIds(alt.platforms);
                  return (
                    <tr
                      key={alt.slug}
                      className="border-b hover:bg-muted/50 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium">
                        <Link
                          href={`/stores/${alt.slug}`}
                          className="text-primary hover:underline"
                        >
                          {alt.name}
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        {altCategory?.name ?? alt.category}
                      </td>
                      <td className="py-3 px-4">{getCommission(alt)}</td>
                      <td className="py-3 px-4">{formatFee(alt)}</td>
                      <td className="py-3 px-4">
                        {altPlatforms.map((p) => p.name).join(", ")}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {alt.technical.hasApi ? (
                          <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                        ) : (
                          <XCircle className="h-4 w-4 text-muted-foreground mx-auto" />
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {alt.technical.supportsSubscriptions ? (
                          <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                        ) : (
                          <XCircle className="h-4 w-4 text-muted-foreground mx-auto" />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Same category alternatives */}
        {sameCategoryAlts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-2">
              {category?.name ?? store.category} Alternatives
            </h2>
            <p className="text-muted-foreground mb-6">
              Other {(category?.name ?? store.category).toLowerCase()} that
              serve a similar audience.
            </p>
            <StoreGrid stores={sameCategoryAlts.map(storeToCardData)} />
          </section>
        )}

        {/* Cross-category alternatives */}
        {crossCategoryAlts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-2">
              Other App Stores to Consider
            </h2>
            <p className="text-muted-foreground mb-6">
              Stores from different categories that support similar platforms or
              features.
            </p>
            <StoreGrid stores={crossCategoryAlts.map(storeToCardData)} />
          </section>
        )}

        {/* Why look for alternatives */}
        <section className="mt-16 prose prose-gray dark:prose-invert max-w-none">
          <h2>Why Consider {store.name} Alternatives?</h2>
          <p>
            While {store.name} is a solid choice for app distribution, exploring
            alternatives can help you find a platform that better fits your
            specific needs. Here are common reasons developers look for
            alternatives:
          </p>
          <ul>
            <li>
              <strong>Lower fees:</strong> Some platforms offer lower commission
              rates or no registration fee, which can significantly impact your
              revenue.
            </li>
            <li>
              <strong>Broader reach:</strong> Distributing on multiple platforms
              helps you reach different user segments and geographic markets.
            </li>
            <li>
              <strong>Better tools:</strong> Different stores offer different
              developer tools, SDKs, and analytics that may better suit your
              workflow.
            </li>
            <li>
              <strong>Less competition:</strong> Smaller or niche stores may
              offer better discoverability for your app compared to crowded
              marketplaces.
            </li>
            <li>
              <strong>Policy differences:</strong> If {store.name}&apos;s
              content policies or review process don&apos;t work for your app,
              alternative stores may be more accommodating.
            </li>
          </ul>

          <h2>How to Choose the Right Alternative</h2>
          <p>
            When evaluating {store.name} alternatives, consider these factors:
          </p>
          <ol>
            <li>
              <strong>Platform support:</strong> Make sure the store supports
              your target platforms (
              {storePlatforms.map((p) => p.name).join(", ")}).
            </li>
            <li>
              <strong>Revenue model:</strong> Compare commission rates,
              subscription support, and payment processing.
            </li>
            <li>
              <strong>Audience size:</strong> Consider the store&apos;s user
              base and whether it aligns with your target market.
            </li>
            <li>
              <strong>Developer support:</strong> Look at documentation quality,
              API availability, and community resources.
            </li>
            <li>
              <strong>Review process:</strong> Understand the approval timeline
              and common rejection reasons.
            </li>
          </ol>

          <p>
            For detailed comparisons, visit any store&apos;s page on{" "}
            <Link href="/stores">our directory</Link> or use our{" "}
            <Link href="/compare">comparison tool</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}

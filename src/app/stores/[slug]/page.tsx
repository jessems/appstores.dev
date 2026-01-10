import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ExternalLink,
  CheckCircle,
  Globe,
  DollarSign,
  Code,
  FileText,
  Clock,
  Users,
  Smartphone,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
  Github,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { StoreGrid } from "@/components/store";
import { getStoreBySlug, getAllSlugs, getRelatedStores } from "@/lib/stores";
import { getCategoryById } from "@/data/categories";
import { getPlatformsByIds } from "@/data/platforms";
import { AppStore } from "@/types/store";

interface StorePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: StorePageProps): Promise<Metadata> {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);

  if (!store) {
    return { title: "Store Not Found" };
  }

  return {
    title: store.seo?.metaTitle || store.name,
    description: store.seo?.metaDescription || store.description,
    keywords: store.seo?.keywords,
    alternates: {
      canonical: `/stores/${slug}`,
    },
    openGraph: {
      title: store.name,
      description: store.tagline,
      type: "website",
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(store.name)}&description=${encodeURIComponent(store.tagline)}`,
          width: 1200,
          height: 630,
          alt: store.name,
        },
      ],
    },
  };
}

export default async function StorePage({ params }: StorePageProps) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);

  if (!store) {
    notFound();
  }

  const category = getCategoryById(store.category);
  const platformInfos = getPlatformsByIds(store.platforms);
  const relatedStores = await getRelatedStores(store);

  const jsonLd = generateJsonLd(store);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(store, category?.name);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Suggest edit - top right */}
          <div className="relative">
            <a
              href={`https://github.com/jessems/appstores.dev/edit/main/content/stores/${store.slug}.mdx`}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-0 right-0 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
              <span className="hidden sm:inline">Suggest edit</span>
            </a>
          </div>

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 pr-24">
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
              {category && (
                <>
                  <Link
                    href={`/stores/category/${category.slug}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {category.name}
                  </Link>
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
              <span className="text-foreground">{store.name}</span>
            </nav>

          {/* Header */}
          <div className="flex flex-col sm:flex-row gap-6 mb-8">
          <div className="relative h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-2xl bg-muted shrink-0">
            {store.logo ? (
              <Image
                src={store.logo}
                alt={`${store.name} logo`}
                fill
                className="object-contain p-2"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-muted-foreground">
                {store.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-1">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold">{store.name}</h1>
                {store.metadata.verified && (
                  <CheckCircle className="h-6 w-6 text-dracula-cyan" />
                )}
              </div>
              <p className="mt-1 text-lg text-muted-foreground">
                {store.tagline}
              </p>
              {category && (
                <Link
                  href={`/stores/category/${category.slug}`}
                  className="mt-2 inline-block"
                >
                  <Badge variant="secondary">{category.name}</Badge>
                </Link>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {platformInfos.map((platform) => (
                <Badge key={platform.id} variant="outline">
                  {platform.name}
                </Badge>
              ))}
            </div>

            <div className="mt-6">
              <a href={store.url} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="gap-2">
                  Visit Store
                  <ExternalLink className="h-5 w-5" />
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {store.metrics.appCount && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Smartphone className="h-4 w-4" />
                  <span className="text-sm">Apps</span>
                </div>
                <p className="text-2xl font-bold font-mono">
                  {formatNumber(store.metrics.appCount)}
                </p>
              </CardContent>
            </Card>
          )}

          {store.fees.commissionTiers[0] && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <DollarSign className="h-4 w-4" />
                  <span className="text-sm">Commission</span>
                </div>
                <p className="text-2xl font-bold font-mono">
                  {store.fees.commissionTiers[0].percentage}%
                </p>
              </CardContent>
            </Card>
          )}

          {store.submission.typicalReviewTime && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Review Time</span>
                </div>
                <p className="text-2xl font-bold font-mono">
                  {store.submission.typicalReviewTime}
                </p>
              </CardContent>
            </Card>
          )}

          {store.metrics.developerCount && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">Developers</span>
                </div>
                <p className="text-2xl font-bold font-mono">
                  {formatNumber(store.metrics.developerCount)}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="fees">Fees & Commission</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
            <TabsTrigger value="submission">Submission</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About {store.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{store.description}</p>

                {store.company && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-semibold mb-3">Company Information</h4>
                    <dl className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <dt className="text-muted-foreground">Company</dt>
                        <dd className="font-medium">{store.company.name}</dd>
                      </div>
                      {store.company.headquarters && (
                        <div>
                          <dt className="text-muted-foreground">Headquarters</dt>
                          <dd className="font-medium">
                            {store.company.headquarters}
                          </dd>
                        </div>
                      )}
                      {store.company.foundedYear && (
                        <div>
                          <dt className="text-muted-foreground">Founded</dt>
                          <dd className="font-medium">
                            {store.company.foundedYear}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pros & Cons */}
            {(store.pros?.length || store.cons?.length) && (
              <div className="grid sm:grid-cols-2 gap-6">
                {store.pros && store.pros.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-dracula-green">
                        <ThumbsUp className="h-5 w-5" />
                        Pros
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {store.pros.map((pro, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-dracula-green">+</span>
                            <span className="text-sm">{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {store.cons && store.cons.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-dracula-red">
                        <ThumbsDown className="h-5 w-5" />
                        Cons
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {store.cons.map((con, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-dracula-red">-</span>
                            <span className="text-sm">{con}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="fees" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Registration Fee
                </CardTitle>
              </CardHeader>
              <CardContent>
                {store.fees.registrationFee ? (
                  <div>
                    <p className="text-3xl font-bold font-mono">
                      {store.fees.registrationFee.currency}{" "}
                      {store.fees.registrationFee.amount}
                    </p>
                    <p className="text-muted-foreground">
                      {store.fees.registrationFee.type === "one-time"
                        ? "One-time fee"
                        : "Annual fee"}
                    </p>
                  </div>
                ) : (
                  <p className="text-2xl font-bold font-mono text-dracula-green">Free</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Commission Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {store.fees.commissionTiers.map((tier, i) => (
                    <div key={i} className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{tier.description}</p>
                        {tier.conditions && (
                          <p className="text-sm text-muted-foreground">
                            {tier.conditions}
                          </p>
                        )}
                      </div>
                      <p className="text-xl font-bold font-mono">{tier.percentage}%</p>
                    </div>
                  ))}
                </div>

                {store.fees.reducedCommissionDetails && (
                  <div className="mt-6 pt-6 border-t">
                    <p className="text-sm text-muted-foreground">
                      {store.fees.reducedCommissionDetails}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {store.monetization && (
              <Card>
                <CardHeader>
                  <CardTitle>Monetization Options</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {store.monetization.models.map((model) => (
                      <Badge key={model} variant="secondary">
                        {model.charAt(0).toUpperCase() + model.slice(1)}
                      </Badge>
                    ))}
                  </div>

                  {store.monetization.payoutFrequency && (
                    <p className="mt-4 text-sm text-muted-foreground">
                      Payouts: {store.monetization.payoutFrequency}
                      {store.monetization.minimumPayout &&
                        ` (minimum ${store.monetization.payoutCurrency || "$"}${store.monetization.minimumPayout})`}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="technical" className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    API & SDK
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>API Available</span>
                    <Badge variant={store.technical.hasApi ? "default" : "secondary"}>
                      {store.technical.hasApi ? "Yes" : "No"}
                    </Badge>
                  </div>
                  {store.technical.apiDocumentationUrl && (
                    <a
                      href={store.technical.apiDocumentationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      API Documentation
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}

                  <Separator />

                  <div className="flex items-center justify-between">
                    <span>SDK Available</span>
                    <Badge variant={store.technical.hasSdk ? "default" : "secondary"}>
                      {store.technical.hasSdk ? "Yes" : "No"}
                    </Badge>
                  </div>
                  {store.technical.sdkPlatforms &&
                    store.technical.sdkPlatforms.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {store.technical.sdkPlatforms.map((p) => (
                          <Badge key={p} variant="outline" className="text-xs">
                            {p}
                          </Badge>
                        ))}
                      </div>
                    )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>In-App Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>In-App Purchases</span>
                    <Badge
                      variant={
                        store.technical.supportsInAppPurchases
                          ? "default"
                          : "secondary"
                      }
                    >
                      {store.technical.supportsInAppPurchases ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Subscriptions</span>
                    <Badge
                      variant={
                        store.technical.supportsSubscriptions
                          ? "default"
                          : "secondary"
                      }
                    >
                      {store.technical.supportsSubscriptions ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Ads Support</span>
                    <Badge
                      variant={
                        store.technical.supportsAds ? "default" : "secondary"
                      }
                    >
                      {store.technical.supportsAds ? "Yes" : "No"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Availability
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Regions</h4>
                    <div className="flex flex-wrap gap-1">
                      {store.geographic.availableRegions.map((region) => (
                        <Badge key={region} variant="outline" className="text-xs">
                          {region}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {store.geographic.supportedLanguages &&
                    store.geographic.supportedLanguages.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Languages</h4>
                        <p className="text-sm text-muted-foreground">
                          {store.geographic.supportedLanguages.join(", ")}
                        </p>
                      </div>
                    )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="submission" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Submission Process
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <span>Requires Approval</span>
                    <Badge
                      variant={
                        store.submission.requiresApproval ? "default" : "secondary"
                      }
                    >
                      {store.submission.requiresApproval ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Automated Review</span>
                    <Badge
                      variant={
                        store.submission.hasAutomatedReview
                          ? "default"
                          : "secondary"
                      }
                    >
                      {store.submission.hasAutomatedReview ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Human Review</span>
                    <Badge
                      variant={
                        store.submission.hasHumanReview ? "default" : "secondary"
                      }
                    >
                      {store.submission.hasHumanReview ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Typical Review Time</span>
                    <span className="font-medium">
                      {store.submission.typicalReviewTime || "Varies"}
                    </span>
                  </div>
                </div>

                {store.submission.guidelinesUrl && (
                  <a
                    href={store.submission.guidelinesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    View Submission Guidelines
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}

                {store.submission.guidelinesSummary && (
                  <p className="text-sm text-muted-foreground">
                    {store.submission.guidelinesSummary}
                  </p>
                )}
              </CardContent>
            </Card>

            {store.submission.commonRejectionReasons &&
              store.submission.commonRejectionReasons.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Common Rejection Reasons</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {store.submission.commonRejectionReasons.map((reason, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="text-destructive">•</span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

            {store.submission.appealsProcess && (
              <Card>
                <CardHeader>
                  <CardTitle>Appeals Process</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {store.submission.appealsProcess}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

          {/* Related Stores */}
          {relatedStores.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Related Stores</h2>
              <StoreGrid stores={relatedStores} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(0)}K`;
  }
  return num.toString();
}

function generateJsonLd(store: AppStore) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: store.name,
    description: store.description,
    url: store.url,
    applicationCategory: "DeveloperApplication",
    operatingSystem: store.platforms.join(", "),
    ...(store.logo && { image: store.logo }),
    ...(store.company && {
      author: {
        "@type": "Organization",
        name: store.company.name,
        ...(store.company.website && { url: store.company.website }),
      },
    }),
    offers: {
      "@type": "Offer",
      price: store.fees.registrationFee?.amount ?? 0,
      priceCurrency: store.fees.registrationFee?.currency ?? "USD",
    },
  };
}

function generateBreadcrumbJsonLd(store: AppStore, categoryName?: string) {
  return {
    "@context": "https://schema.org",
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
        name: "Stores",
        item: "https://appstores.dev/stores",
      },
      ...(categoryName
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: categoryName,
              item: `https://appstores.dev/stores/category/${store.category}`,
            },
            {
              "@type": "ListItem",
              position: 4,
              name: store.name,
              item: `https://appstores.dev/stores/${store.slug}`,
            },
          ]
        : [
            {
              "@type": "ListItem",
              position: 3,
              name: store.name,
              item: `https://appstores.dev/stores/${store.slug}`,
            },
          ]),
    ],
  };
}

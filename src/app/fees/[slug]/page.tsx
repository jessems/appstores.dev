import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  DollarSign,
  Percent,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { getStoreBySlug, getAllSlugs, getAllStores } from "@/lib/stores";
import { AppStore } from "@/types/store";

export const dynamic = "force-static";

interface FeePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: FeePageProps): Promise<Metadata> {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);

  if (!store) {
    return { title: "Store Not Found" };
  }

  const year = new Date().getFullYear();
  const title = `${store.name} Fees & Commission Rates (${year}) | appstores.dev`;
  const description = `Complete breakdown of ${store.name} fees, commission rates, and costs for developers in ${year}. Registration fees, revenue share tiers, and reduced commission programs.`;

  return {
    title,
    description,
    keywords: [
      `${store.name} fees`,
      `${store.name} commission`,
      `${store.name} developer fee`,
      `${store.name} commission rate`,
      `${store.name} revenue share`,
      `app store fees ${year}`,
    ],
    openGraph: {
      title,
      description,
      type: "article",
    },
  };
}

function formatCurrency(amount: number, currency: string): string {
  if (amount === 0) return "Free";
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

function getCommissionColor(percentage: number): string {
  if (percentage === 0) return "text-green-600 dark:text-green-400";
  if (percentage <= 10) return "text-green-600 dark:text-green-400";
  if (percentage <= 20) return "text-yellow-600 dark:text-yellow-400";
  return "text-red-600 dark:text-red-400";
}

function CommissionBar({ percentage }: { percentage: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full transition-all"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <span className={`font-bold text-lg tabular-nums ${getCommissionColor(percentage)}`}>
        {percentage}%
      </span>
    </div>
  );
}

async function getAlternatives(store: AppStore): Promise<AppStore[]> {
  const allStores = await getAllStores();
  return allStores
    .filter(
      (s) =>
        s.slug !== store.slug &&
        s.category === store.category &&
        s.fees?.commissionTiers?.length > 0
    )
    .sort((a, b) => {
      const aMin = Math.min(...(a.fees?.commissionTiers?.map((t) => t.percentage) || [100]));
      const bMin = Math.min(...(b.fees?.commissionTiers?.map((t) => t.percentage) || [100]));
      return aMin - bMin;
    })
    .slice(0, 5);
}

export default async function FeePage({ params }: FeePageProps) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);

  if (!store) {
    notFound();
  }

  const alternatives = await getAlternatives(store);
  const year = new Date().getFullYear();
  const { fees, monetization } = store;

  const regFee = fees?.registrationFee;
  const tiers = fees?.commissionTiers || [];
  const hasReducedCommission = fees?.hasReducedCommission;
  const minCommission = tiers.length > 0 ? Math.min(...tiers.map((t) => t.percentage)) : null;
  const maxCommission = tiers.length > 0 ? Math.max(...tiers.map((t) => t.percentage)) : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${store.name} Fees & Commission Rates (${year})`,
    description: `Complete breakdown of ${store.name} fees and commission structure for developers.`,
    author: { "@type": "Organization", name: "appstores.dev" },
    publisher: { "@type": "Organization", name: "appstores.dev" },
    dateModified: new Date().toISOString(),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://appstores.dev" },
      { "@type": "ListItem", position: 2, name: "Stores", item: "https://appstores.dev/stores" },
      { "@type": "ListItem", position: 3, name: store.name, item: `https://appstores.dev/stores/${store.slug}` },
      { "@type": "ListItem", position: 4, name: "Fees", item: `https://appstores.dev/fees/${store.slug}` },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is the ${store.name} commission rate?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: tiers.length > 0
            ? tiers.map((t) => `${t.percentage}% — ${t.description}`).join(". ")
            : `${store.name} commission details vary. Check their developer portal for current rates.`,
        },
      },
      {
        "@type": "Question",
        name: `How much does it cost to publish on ${store.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: regFee
            ? regFee.amount === 0
              ? `Publishing on ${store.name} is free — there is no registration fee.`
              : `${store.name} charges a ${regFee.type} registration fee of ${formatCurrency(regFee.amount, regFee.currency)}.`
            : `Check ${store.name}'s developer portal for current registration fees.`,
        },
      },
      ...(hasReducedCommission
        ? [
            {
              "@type": "Question",
              name: `Does ${store.name} offer reduced commission rates?`,
              acceptedAnswer: {
                "@type": "Answer",
                text: fees?.reducedCommissionDetails || `Yes, ${store.name} offers reduced commission programs for eligible developers.`,
              },
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="py-8 sm:py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/stores" className="hover:text-foreground transition-colors">Stores</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href={`/stores/${store.slug}`} className="hover:text-foreground transition-colors">{store.name}</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground font-medium">Fees</span>
          </nav>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              {store.logo && (
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                  <img src={store.logo} alt={store.name} className="w-10 h-10 object-contain" />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  {store.name} Fees & Commission
                </h1>
                <p className="text-muted-foreground mt-1">
                  Complete cost breakdown for developers — updated {year}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <CreditCard className="h-4 w-4" />
                  <span className="text-sm font-medium">Registration Fee</span>
                </div>
                <p className="text-2xl font-bold">
                  {regFee ? formatCurrency(regFee.amount, regFee.currency) : "N/A"}
                </p>
                {regFee && regFee.amount > 0 && (
                  <p className="text-xs text-muted-foreground mt-1 capitalize">{regFee.type}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Percent className="h-4 w-4" />
                  <span className="text-sm font-medium">Commission</span>
                </div>
                <p className="text-2xl font-bold">
                  {minCommission !== null
                    ? minCommission === maxCommission
                      ? `${minCommission}%`
                      : `${minCommission}–${maxCommission}%`
                    : "N/A"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Revenue share</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  {hasReducedCommission ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="text-sm font-medium">Reduced Rates</span>
                </div>
                <p className="text-2xl font-bold">
                  {hasReducedCommission ? "Yes" : "No"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {hasReducedCommission ? "Special programs available" : "Standard rates only"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Commission Tiers */}
          {tiers.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Commission Tiers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {tiers.map((tier, i) => (
                    <div key={i}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-medium">{tier.description}</p>
                          {tier.conditions && (
                            <p className="text-sm text-muted-foreground mt-0.5">{tier.conditions}</p>
                          )}
                        </div>
                      </div>
                      <CommissionBar percentage={tier.percentage} />
                      {i < tiers.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reduced Commission Details */}
          {hasReducedCommission && fees?.reducedCommissionDetails && (
            <Card className="mb-8 border-green-200 dark:border-green-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <CheckCircle className="h-5 w-5" />
                  Reduced Commission Programs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{fees.reducedCommissionDetails}</p>
              </CardContent>
            </Card>
          )}

          {/* Monetization Support */}
          {monetization && monetization.models && monetization.models.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Pricing Models</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {["free", "paid", "freemium", "subscription", "one-time"].map((model) => {
                    const supported = monetization.models.includes(model as any);
                    return (
                      <div key={model} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                        {supported ? (
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        )}
                        <span className="text-sm capitalize">{model === "one-time" ? "One-Time Purchase" : model}</span>
                      </div>
                    );
                  })}
                </div>
                {monetization.paymentMethods && monetization.paymentMethods.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-muted-foreground mb-2">Payment Methods:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {monetization.paymentMethods.map((m) => (
                        <Badge key={m} variant="outline" className="text-xs">{m}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {monetization.payoutFrequency && (
                  <p className="text-xs text-muted-foreground mt-3">
                    Payout frequency: {monetization.payoutFrequency}
                    {monetization.minimumPayout ? ` (minimum: ${formatCurrency(monetization.minimumPayout, monetization.payoutCurrency || "USD")})` : ""}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Fee Comparison */}
          {alternatives.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Compare with Alternatives</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 pr-4 font-medium">Store</th>
                        <th className="text-right py-2 px-4 font-medium">Registration</th>
                        <th className="text-right py-2 px-4 font-medium">Min Commission</th>
                        <th className="text-right py-2 pl-4 font-medium">Max Commission</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[store, ...alternatives].map((s, i) => {
                        const sMin = s.fees?.commissionTiers?.length
                          ? Math.min(...s.fees.commissionTiers.map((t) => t.percentage))
                          : null;
                        const sMax = s.fees?.commissionTiers?.length
                          ? Math.max(...s.fees.commissionTiers.map((t) => t.percentage))
                          : null;
                        return (
                          <tr
                            key={s.slug}
                            className={`border-b last:border-0 ${i === 0 ? "bg-muted/50 font-medium" : ""}`}
                          >
                            <td className="py-2.5 pr-4">
                              {i === 0 ? (
                                <span className="flex items-center gap-1">
                                  {s.name} <Badge variant="outline" className="text-xs">current</Badge>
                                </span>
                              ) : (
                                <Link href={`/fees/${s.slug}`} className="hover:underline text-primary">
                                  {s.name}
                                </Link>
                              )}
                            </td>
                            <td className="text-right py-2.5 px-4">
                              {s.fees?.registrationFee
                                ? formatCurrency(s.fees.registrationFee.amount, s.fees.registrationFee.currency)
                                : "N/A"}
                            </td>
                            <td className={`text-right py-2.5 px-4 ${sMin !== null ? getCommissionColor(sMin) : ""}`}>
                              {sMin !== null ? `${sMin}%` : "N/A"}
                            </td>
                            <td className={`text-right py-2.5 pl-4 ${sMax !== null ? getCommissionColor(sMax) : ""}`}>
                              {sMax !== null ? `${sMax}%` : "N/A"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* FAQ Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">What is the {store.name} commission rate?</h3>
                <p className="text-sm text-muted-foreground">
                  {tiers.length > 0
                    ? tiers.map((t) => `${t.percentage}% — ${t.description}`).join(". ") + "."
                    : `Check the ${store.name} developer portal for current commission rates.`}
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-medium mb-1">How much does it cost to publish on {store.name}?</h3>
                <p className="text-sm text-muted-foreground">
                  {regFee
                    ? regFee.amount === 0
                      ? `Publishing on ${store.name} is completely free — there is no registration fee.`
                      : `${store.name} charges a ${regFee.type} registration fee of ${formatCurrency(regFee.amount, regFee.currency)}.`
                    : `Check the ${store.name} developer portal for current registration fees.`}
                </p>
              </div>
              {hasReducedCommission && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-medium mb-1">Does {store.name} offer reduced commission rates?</h3>
                    <p className="text-sm text-muted-foreground">
                      {fees?.reducedCommissionDetails ||
                        `Yes, ${store.name} offers reduced commission programs for eligible developers.`}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href={`/stores/${store.slug}`}>
                View Full Profile <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
            {store.url && (
              <Button variant="outline" asChild>
                <a href={store.url} target="_blank" rel="noopener noreferrer">
                  Visit {store.name} <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href={`/guides/publish-on-${store.slug}`}>
                Publishing Guide <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

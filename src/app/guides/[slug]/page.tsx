import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  Clock,
  DollarSign,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ExternalLink,
  ArrowRight,
  Smartphone,
  Shield,
  Bot,
  UserCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { getStoreBySlug, getAllSlugs } from "@/lib/stores";
import { getPlatformsByIds } from "@/data/platforms";
import { AppStore } from "@/types/store";

export const dynamic = "force-static";

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug: `publish-on-${slug}` }));
}

function extractStoreSlug(slug: string): string {
  return slug.replace(/^publish-on-/, "");
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const store = await getStoreBySlug(extractStoreSlug(slug));

  if (!store) {
    return { title: "Store Not Found" };
  }

  const year = new Date().getFullYear();
  const title = `How to Publish on ${store.name} (${year} Guide) | appstores.dev`;
  const description = `Step-by-step guide to publishing your app on ${store.name}. Registration, submission process, review timeline, fees, and tips for approval.`;

  return {
    title,
    description,
    keywords: [
      `publish on ${store.name}`,
      `submit app to ${store.name}`,
      `${store.name} developer guide`,
      `${store.name} app submission`,
      `${store.name} review process`,
      `how to publish app ${year}`,
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

function StepCard({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
        {step}
      </div>
      <div className="flex-1 pb-8">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const store = await getStoreBySlug(extractStoreSlug(slug));

  if (!store) {
    notFound();
  }

  const year = new Date().getFullYear();
  const { submission, fees, technical, platforms: storePlatforms } = store;
  const platformInfos = storePlatforms ? getPlatformsByIds(storePlatforms) : [];
  const regFee = fees?.registrationFee;

  // Build HowTo steps for JSON-LD
  const steps = [
    {
      name: "Create a developer account",
      text: regFee
        ? regFee.amount === 0
          ? `Sign up for a ${store.name} developer account. Registration is free.`
          : `Sign up for a ${store.name} developer account. The ${regFee.type} fee is ${formatCurrency(regFee.amount, regFee.currency)}.`
        : `Sign up for a ${store.name} developer account.`,
    },
    {
      name: "Prepare your app",
      text: `Ensure your app meets ${store.name}'s guidelines and quality standards. Test thoroughly on all target platforms.`,
    },
    {
      name: "Submit for review",
      text: submission?.guidelinesSummary || `Submit your app through the ${store.name} developer portal.`,
    },
    {
      name: "Wait for review",
      text: submission?.typicalReviewTime
        ? `The typical review time is ${submission.typicalReviewTime}. ${submission.hasHumanReview ? "Your app will be reviewed by a human reviewer." : ""} ${submission.hasAutomatedReview ? "Automated checks will also be performed." : ""}`
        : `Wait for ${store.name} to review your submission.`,
    },
    {
      name: "Launch your app",
      text: `Once approved, your app will be live on ${store.name} and available to users.`,
    },
  ];

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to Publish on ${store.name}`,
    description: `Step-by-step guide to publishing your app on ${store.name}.`,
    totalTime: submission?.typicalReviewTime ? `P${submission.typicalReviewTime.replace(/[^0-9]/g, "") || "7"}D` : undefined,
    estimatedCost: regFee
      ? {
          "@type": "MonetaryAmount",
          currency: regFee.currency,
          value: regFee.amount,
        }
      : undefined,
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://appstores.dev" },
      { "@type": "ListItem", position: 2, name: "Stores", item: "https://appstores.dev/stores" },
      { "@type": "ListItem", position: 3, name: store.name, item: `https://appstores.dev/stores/${store.slug}` },
      { "@type": "ListItem", position: 4, name: "Publishing Guide", item: `https://appstores.dev/guides/publish-on-${store.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

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
            <span className="text-foreground font-medium">Publishing Guide</span>
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
                  How to Publish on {store.name}
                </h1>
                <p className="text-muted-foreground mt-1">
                  Complete developer guide — updated {year}
                </p>
              </div>
            </div>

            {/* Platform badges */}
            {platformInfos.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {platformInfos.map((p) => (
                  <Badge key={p.id} variant="secondary">{p.name}</Badge>
                ))}
              </div>
            )}
          </div>

          {/* Quick Facts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                  <DollarSign className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Registration</span>
                </div>
                <p className="font-bold">
                  {regFee ? formatCurrency(regFee.amount, regFee.currency) : "N/A"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Review Time</span>
                </div>
                <p className="font-bold">{submission?.typicalReviewTime || "Varies"}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                  <Bot className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Auto Review</span>
                </div>
                <p className="font-bold">{submission?.hasAutomatedReview ? "Yes" : "No"}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-4 pb-3">
                <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                  <UserCheck className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Human Review</span>
                </div>
                <p className="font-bold">{submission?.hasHumanReview ? "Yes" : "No"}</p>
              </CardContent>
            </Card>
          </div>

          {/* Guidelines Summary */}
          {submission?.guidelinesSummary && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Submission Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{submission.guidelinesSummary}</p>
                {submission.guidelinesUrl && (
                  <a
                    href={submission.guidelinesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-3"
                  >
                    Read full guidelines <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step-by-step */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Publishing Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-l-2 border-muted ml-5 pl-4">
                <StepCard step={1} title="Create a Developer Account">
                  <p>
                    Head to the{" "}
                    {store.url ? (
                      <a href={store.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {store.name} developer portal
                      </a>
                    ) : (
                      `${store.name} developer portal`
                    )}{" "}
                    and sign up.
                    {regFee && (
                      regFee.amount === 0
                        ? " Registration is free."
                        : ` You'll need to pay a ${regFee.type} fee of ${formatCurrency(regFee.amount, regFee.currency)}.`
                    )}
                  </p>
                </StepCard>

                <StepCard step={2} title="Prepare Your App">
                  <p>
                    Make sure your app meets the quality and content standards.
                    {platformInfos.length > 0 && (
                      <> Test on {platformInfos.map((p) => p.name).join(", ")}.</>
                    )}
                  </p>
                  {technical && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {technical.hasSdk && (
                        <Badge variant="outline" className="text-xs">SDK available</Badge>
                      )}
                      {technical.hasApi && (
                        <Badge variant="outline" className="text-xs">API available</Badge>
                      )}
                    </div>
                  )}
                </StepCard>

                <StepCard step={3} title="Submit for Review">
                  <p>
                    Upload your build, screenshots, descriptions, and metadata through the developer console.
                    {submission?.requiresApproval === false
                      ? " This store does not require pre-approval — your app may go live immediately."
                      : " Your app will need to pass review before going live."}
                  </p>
                </StepCard>

                <StepCard step={4} title="Review Process">
                  <p>
                    {submission?.typicalReviewTime
                      ? `Expect a typical review time of ${submission.typicalReviewTime}.`
                      : "Review times vary."}{" "}
                    {submission?.hasAutomatedReview && submission?.hasHumanReview
                      ? "Your app goes through both automated checks and human review."
                      : submission?.hasAutomatedReview
                        ? "Reviews are primarily automated."
                        : submission?.hasHumanReview
                          ? "A human reviewer will evaluate your app."
                          : ""}
                  </p>
                </StepCard>

                <StepCard step={5} title="Go Live">
                  <p>
                    Once approved, your app is live! Monitor performance and respond to user feedback.
                    {technical?.supportsInAppPurchases && " You can set up in-app purchases and subscriptions."}
                  </p>
                </StepCard>
              </div>
            </CardContent>
          </Card>

          {/* Common Rejection Reasons */}
          {submission?.commonRejectionReasons && submission.commonRejectionReasons.length > 0 && (
            <Card className="mb-8 border-amber-200 dark:border-amber-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="h-5 w-5" />
                  Common Rejection Reasons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {submission.commonRejectionReasons.map((reason, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <XCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Appeals Process */}
          {submission?.appealsProcess && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Appeals Process
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{submission.appealsProcess}</p>
              </CardContent>
            </Card>
          )}

          {/* Technical Features */}
          {technical && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Developer Tools & Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: "Developer API", supported: technical.hasApi, url: technical.apiDocumentationUrl },
                    { label: "SDK", supported: technical.hasSdk, url: technical.sdkDocumentationUrl },
                    { label: "In-App Purchases", supported: technical.supportsInAppPurchases },
                    { label: "Subscriptions", supported: technical.supportsSubscriptions },
                    { label: "Ads", supported: technical.supportsAds },
                  ].map(({ label, supported, url }) => (
                    <div key={label} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                      {supported ? (
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      )}
                      {supported && url ? (
                        <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                          {label}
                        </a>
                      ) : (
                        <span className="text-sm">{label}</span>
                      )}
                    </div>
                  ))}
                </div>
                {technical.hasSdk && technical.sdkPlatforms && technical.sdkPlatforms.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-muted-foreground mb-2">SDK Platforms:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {technical.sdkPlatforms.map((p) => (
                        <Badge key={p} variant="outline" className="text-xs">{p}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href={`/stores/${store.slug}`}>
                View Full Profile <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/fees/${store.slug}`}>
                Fee Breakdown <DollarSign className="h-4 w-4 ml-1" />
              </Link>
            </Button>
            {store.url && (
              <Button variant="outline" asChild>
                <a href={store.url} target="_blank" rel="noopener noreferrer">
                  Visit {store.name} <ExternalLink className="h-4 w-4 ml-1" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

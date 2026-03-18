import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  HelpCircle,
  DollarSign,
  Clock,
  Shield,
  Globe,
  Code,
  Smartphone,
  Star,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { getStoreBySlug, getAllSlugs, getAllStores } from "@/lib/stores";
import { AppStore } from "@/types/store";
import { getCategoryById } from "@/data/categories";

export const dynamic = "force-static";

interface FAQPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: FAQPageProps): Promise<Metadata> {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);

  if (!store) {
    return { title: "Store Not Found" };
  }

  const title = `${store.name} FAQ - Common Questions Answered`;
  const description = `Frequently asked questions about ${store.name}: fees, submission process, review times, supported platforms, and more. Everything developers need to know.`;

  return {
    title,
    description,
    alternates: { canonical: `/faq/${slug}` },
    openGraph: {
      title,
      description,
      url: `https://appstores.dev/faq/${slug}`,
      type: "website",
    },
  };
}

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

function generateFAQs(store: AppStore): FAQ[] {
  const faqs: FAQ[] = [];
  const name = store.name;

  // --- Fees & Pricing ---
  if (store.fees?.registrationFee) {
    const fee = store.fees.registrationFee;
    if (fee.amount === 0) {
      faqs.push({
        question: `Is it free to register as a developer on ${name}?`,
        answer: `Yes, registering as a developer on ${name} is completely free. There is no upfront registration fee to start publishing.`,
        category: "Fees & Pricing",
      });
    } else {
      faqs.push({
        question: `How much does it cost to register on ${name}?`,
        answer: `The registration fee for ${name} is ${fee.currency} ${fee.amount} (${fee.type}). This is required before you can start publishing.`,
        category: "Fees & Pricing",
      });
    }
  }

  if (store.fees?.commissionTiers && store.fees.commissionTiers.length > 0) {
    const tiers = store.fees.commissionTiers;
    const mainTier = tiers[0];
    const tierDetails = tiers
      .map(
        (t) =>
          `${t.percentage}% — ${t.description}${t.conditions ? ` (${t.conditions})` : ""}`
      )
      .join("; ");

    faqs.push({
      question: `What commission does ${name} take?`,
      answer: `${name} charges ${mainTier.percentage}% commission. ${tiers.length > 1 ? `There are ${tiers.length} commission tiers: ${tierDetails}.` : `Details: ${tierDetails}.`}`,
      category: "Fees & Pricing",
    });

    if (store.fees.hasReducedCommission) {
      faqs.push({
        question: `Does ${name} offer reduced commission rates?`,
        answer: `Yes. ${store.fees.reducedCommissionDetails || `${name} offers reduced commission rates for qualifying developers.`}`,
        category: "Fees & Pricing",
      });
    }
  }

  // --- Submission & Review ---
  if (store.submission) {
    if (store.submission.typicalReviewTime) {
      faqs.push({
        question: `How long does the review process take on ${name}?`,
        answer: `The typical review time on ${name} is ${store.submission.typicalReviewTime}. ${store.submission.hasAutomatedReview && store.submission.hasHumanReview ? "The review process includes both automated and human review." : store.submission.hasAutomatedReview ? "The review is primarily automated." : store.submission.hasHumanReview ? "The review is conducted by human reviewers." : ""}`,
        category: "Submission & Review",
      });
    }

    if (
      store.submission.commonRejectionReasons &&
      store.submission.commonRejectionReasons.length > 0
    ) {
      faqs.push({
        question: `What are common reasons for rejection on ${name}?`,
        answer: `Common rejection reasons on ${name} include: ${store.submission.commonRejectionReasons.join(", ")}. Review the submission guidelines carefully before submitting.`,
        category: "Submission & Review",
      });
    }

    if (store.submission.appealsProcess) {
      faqs.push({
        question: `Can I appeal a rejection on ${name}?`,
        answer: `Yes. The appeals process for ${name}: ${store.submission.appealsProcess}.`,
        category: "Submission & Review",
      });
    }

    if (store.submission.requiresApproval !== undefined) {
      faqs.push({
        question: `Does ${name} require approval before publishing?`,
        answer: store.submission.requiresApproval
          ? `Yes, ${name} requires approval before your app or content goes live. Make sure to follow their guidelines to avoid delays.`
          : `No, ${name} does not require pre-approval. You can publish directly, though your content may be reviewed afterwards.`,
        category: "Submission & Review",
      });
    }
  }

  // --- Platforms & Technical ---
  if (store.platforms && store.platforms.length > 0) {
    faqs.push({
      question: `What platforms does ${name} support?`,
      answer: `${name} supports the following platforms: ${store.platforms.join(", ")}. ${store.platforms.length > 3 ? "This makes it one of the more versatile distribution options available." : ""}`,
      category: "Platforms & Technical",
    });
  }

  if (store.technical) {
    if (store.technical.hasApi) {
      faqs.push({
        question: `Does ${name} provide an API for developers?`,
        answer: `Yes, ${name} provides an API for developers.${store.technical.apiDocumentationUrl ? ` Documentation is available at their developer portal.` : ""} ${store.technical.hasSdk ? `They also offer SDKs for: ${store.technical.sdkPlatforms?.join(", ") || "multiple platforms"}.` : ""}`,
        category: "Platforms & Technical",
      });
    }

    const monetizationFeatures = [];
    if (store.technical.supportsInAppPurchases)
      monetizationFeatures.push("in-app purchases");
    if (store.technical.supportsSubscriptions)
      monetizationFeatures.push("subscriptions");
    if (store.technical.supportsAds) monetizationFeatures.push("ads");

    if (monetizationFeatures.length > 0) {
      faqs.push({
        question: `What monetization options does ${name} support?`,
        answer: `${name} supports the following monetization methods: ${monetizationFeatures.join(", ")}. ${store.monetization?.models ? `Distribution models include: ${store.monetization.models.join(", ")}.` : ""}`,
        category: "Platforms & Technical",
      });
    }
  }

  // --- Geographic & Availability ---
  if (store.geographic) {
    if (
      store.geographic.availableRegions &&
      store.geographic.availableRegions.length > 0
    ) {
      const regions = store.geographic.availableRegions;
      faqs.push({
        question: `Where is ${name} available?`,
        answer: `${name} is available in: ${regions.length > 5 ? `${regions.length} regions worldwide, including ${regions.slice(0, 5).join(", ")}, and more` : regions.join(", ")}. ${store.geographic.localizedStores ? "They offer localized store versions for different regions." : ""}`,
        category: "Geographic & Availability",
      });
    }

    if (
      store.geographic.supportedLanguages &&
      store.geographic.supportedLanguages.length > 0
    ) {
      const langs = store.geographic.supportedLanguages;
      faqs.push({
        question: `What languages does ${name} support?`,
        answer: `${name} supports ${langs.length} language${langs.length > 1 ? "s" : ""}: ${langs.length > 8 ? `${langs.slice(0, 8).join(", ")}, and ${langs.length - 8} more` : langs.join(", ")}.`,
        category: "Geographic & Availability",
      });
    }
  }

  // --- Ratings & Quality ---
  if (store.ratings) {
    const avgRating =
      Object.values(store.ratings).reduce((a, b) => a + b, 0) /
      Object.values(store.ratings).length;
    const best = Object.entries(store.ratings).sort(
      ([, a], [, b]) => b - a
    )[0];
    const worst = Object.entries(store.ratings).sort(
      ([, a], [, b]) => a - b
    )[0];

    faqs.push({
      question: `How does ${name} rate overall for developers?`,
      answer: `${name} has an average developer rating of ${avgRating.toFixed(1)}/5 across 9 dimensions. Its strongest area is ${formatRatingKey(best[0])} (${best[1]}/5), while ${formatRatingKey(worst[0])} (${worst[1]}/5) has the most room for improvement.`,
      category: "Ratings & Quality",
    });
  }

  // --- Features ---
  if (store.features) {
    const featureList = [];
    if (store.features.hasEditorialContent)
      featureList.push("editorial content");
    if (store.features.hasBetaTesting) featureList.push("beta testing");
    if (store.features.hasAnalyticsDashboard)
      featureList.push("analytics dashboard");
    if (store.features.hasABTesting) featureList.push("A/B testing");
    if (store.features.hasUserReviews) featureList.push("user reviews");

    if (featureList.length > 0) {
      faqs.push({
        question: `What developer features does ${name} offer?`,
        answer: `${name} provides the following developer features: ${featureList.join(", ")}. ${store.features.hasAnalyticsDashboard ? "The analytics dashboard helps you track performance and user engagement." : ""}`,
        category: "Features",
      });
    }
  }

  // --- General ---
  faqs.push({
    question: `What is ${name}?`,
    answer: store.description,
    category: "General",
  });

  if (store.company) {
    faqs.push({
      question: `Who operates ${name}?`,
      answer: `${name} is operated by ${store.company.name}${store.company.headquarters ? `, headquartered in ${store.company.headquarters}` : ""}${store.company.foundedYear ? `. The company was founded in ${store.company.foundedYear}` : ""}.`,
      category: "General",
    });
  }

  if (store.metrics?.appCount) {
    faqs.push({
      question: `How many apps are available on ${name}?`,
      answer: `${name} has approximately ${store.metrics.appCount.toLocaleString()} apps${store.metrics.appCountSource ? ` (source: ${store.metrics.appCountSource})` : ""}. ${store.metrics.appCountLastUpdated ? `This was last verified in ${store.metrics.appCountLastUpdated}.` : ""}`,
      category: "General",
    });
  }

  return faqs;
}

function formatRatingKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

const categoryIcons: Record<string, React.ReactNode> = {
  "Fees & Pricing": <DollarSign className="h-5 w-5" />,
  "Submission & Review": <Clock className="h-5 w-5" />,
  "Platforms & Technical": <Code className="h-5 w-5" />,
  "Geographic & Availability": <Globe className="h-5 w-5" />,
  "Ratings & Quality": <Star className="h-5 w-5" />,
  Features: <Shield className="h-5 w-5" />,
  General: <HelpCircle className="h-5 w-5" />,
};

export default async function FAQPage({ params }: FAQPageProps) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);

  if (!store) notFound();

  const faqs = generateFAQs(store);
  const categoryInfo = getCategoryById(store.category);

  // Group FAQs by category
  const grouped = faqs.reduce(
    (acc, faq) => {
      if (!acc[faq.category]) acc[faq.category] = [];
      acc[faq.category].push(faq);
      return acc;
    },
    {} as Record<string, FAQ[]>
  );

  // Preferred category order
  const categoryOrder = [
    "General",
    "Fees & Pricing",
    "Submission & Review",
    "Platforms & Technical",
    "Features",
    "Geographic & Availability",
    "Ratings & Quality",
  ];
  const sortedCategories = categoryOrder.filter((c) => grouped[c]);

  // JSON-LD FAQPage schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const breadcrumbSchema = {
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
      {
        "@type": "ListItem",
        position: 3,
        name: store.name,
        item: `https://appstores.dev/stores/${slug}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "FAQ",
        item: `https://appstores.dev/faq/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
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
          <Link
            href={`/stores/${slug}`}
            className="hover:text-foreground transition-colors"
          >
            {store.name}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">FAQ</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">
              {store.name} FAQ
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Frequently asked questions about publishing on {store.name}.
            Everything you need to know about fees, submission, platforms, and
            more.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {categoryInfo && (
              <Badge variant="secondary">{categoryInfo.name}</Badge>
            )}
            <Badge variant="outline">{faqs.length} questions answered</Badge>
            {store.platforms?.map((p) => (
              <Badge key={p} variant="outline" className="capitalize">
                {p}
              </Badge>
            ))}
          </div>
        </div>

        {/* Quick Jump */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Jump to Section</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {sortedCategories.map((cat) => (
                <a
                  key={cat}
                  href={`#${cat.toLowerCase().replace(/\s+&\s+/g, "-").replace(/\s+/g, "-")}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-muted hover:bg-muted/80 text-sm transition-colors"
                >
                  {categoryIcons[cat]}
                  {cat}
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {grouped[cat].length}
                  </Badge>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {sortedCategories.map((cat) => (
            <section
              key={cat}
              id={cat
                .toLowerCase()
                .replace(/\s+&\s+/g, "-")
                .replace(/\s+/g, "-")}
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  {categoryIcons[cat]}
                </div>
                <h2 className="text-xl font-semibold">{cat}</h2>
              </div>
              <div className="space-y-4">
                {grouped[cat].map((faq, i) => (
                  <Card key={i} className="border-l-4 border-l-primary/20">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold text-base mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>

        <Separator className="my-10" />

        {/* Related Links */}
        <div className="grid sm:grid-cols-3 gap-4">
          <Link href={`/stores/${slug}`}>
            <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="pt-6 flex items-center gap-3">
                <Smartphone className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Store Profile</p>
                  <p className="text-xs text-muted-foreground">
                    Full details & ratings
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
          <Link href={`/fees/${slug}`}>
            <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="pt-6 flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Fee Breakdown</p>
                  <p className="text-xs text-muted-foreground">
                    Detailed pricing
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
          <Link href={`/guides/${slug}`}>
            <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="pt-6 flex items-center gap-3">
                <Globe className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-sm">Publishing Guide</p>
                  <p className="text-xs text-muted-foreground">
                    Step-by-step process
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        </div>

        {store.url && (
          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <a
                href={store.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                Visit {store.name}
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        )}
      </main>
    </>
  );
}

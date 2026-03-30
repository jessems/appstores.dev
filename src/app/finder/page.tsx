import { Metadata } from "next";
import { StoreFinderWizard } from "@/components/finder/StoreFinderWizard";
import { getAllStores } from "@/lib/stores";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "App Store Finder — Which App Store Should You Publish On?",
  description:
    "Answer a few questions and get personalized app store recommendations. Find the best platform for your app based on your platform, audience, budget, and goals.",
  keywords: [
    "which app store",
    "best app store for developers",
    "app store finder",
    "where to publish app",
    "app distribution platform",
    "app store comparison tool",
    "app store recommendation",
  ],
  openGraph: {
    title: "App Store Finder — Which App Store Should You Publish On?",
    description:
      "Answer a few questions and get personalized app store recommendations.",
    url: "https://appstores.dev/finder",
  },
};

function generateFinderSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "App Store Finder",
    url: "https://appstores.dev/finder",
    description:
      "Interactive tool to find the best app store for your application based on platform, category, budget, and feature requirements.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

function generateFAQSchema() {
  const faqs = [
    {
      q: "How do I choose the right app store?",
      a: "Consider your target platform (iOS, Android, web), audience (consumers, gamers, enterprises), budget for developer fees, and which features matter most (analytics, in-app purchases, beta testing). Our finder tool helps you weigh all these factors.",
    },
    {
      q: "Can I publish on multiple app stores?",
      a: "Yes! Many developers publish on multiple stores to maximize reach. Official stores (Google Play, Apple App Store) are essential, but third-party and specialty stores can provide additional distribution channels with different audiences.",
    },
    {
      q: "What are the typical developer fees?",
      a: "Fees vary widely. Google Play charges a one-time $25 fee, Apple charges $99/year, while many third-party stores are free. Commission rates typically range from 12% to 30% of sales.",
    },
    {
      q: "Are third-party app stores safe to use?",
      a: "Reputable third-party stores like F-Droid (open source), Amazon Appstore, and Samsung Galaxy Store are safe and well-established. Always research a store's reputation and security practices before publishing.",
    },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

export default async function FinderPage() {
  const stores = await getAllStores();

  // Serialize minimal store data for client component
  const storeData = stores.map((s) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    tagline: s.tagline,
    logo: s.logo,
    category: s.category,
    platforms: s.platforms,
    appCount: s.metrics.appCount,
    commissionTiers: s.fees.commissionTiers,
    registrationFee: s.fees.registrationFee,
    hasApi: s.technical.hasApi,
    hasSdk: s.technical.hasSdk,
    supportsInAppPurchases: s.technical.supportsInAppPurchases,
    supportsSubscriptions: s.technical.supportsSubscriptions,
    hasAnalyticsDashboard: s.features.hasAnalyticsDashboard,
    hasBetaTesting: s.features.hasBetaTesting,
    hasUserReviews: s.features.hasUserReviews,
    models: s.monetization.models,
    verified: s.metadata.verified,
    status: s.metadata.status,
    ratings: s.ratings,
    pros: s.pros,
  }));

  const finderSchema = generateFinderSchema();
  const faqSchema = generateFAQSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(finderSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            App Store Finder
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Answer a few questions and we&apos;ll recommend the best app stores
            for your project. Takes less than a minute.
          </p>
        </div>

        <StoreFinderWizard stores={storeData} />

        <section className="mt-16 border-t pt-12">
          <h2 className="text-2xl font-bold mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg">
                How do I choose the right app store?
              </h3>
              <p className="mt-1 text-muted-foreground">
                Consider your target platform (iOS, Android, web), audience
                (consumers, gamers, enterprises), budget for developer fees, and
                which features matter most (analytics, in-app purchases, beta
                testing). Our finder tool helps you weigh all these factors.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">
                Can I publish on multiple app stores?
              </h3>
              <p className="mt-1 text-muted-foreground">
                Yes! Many developers publish on multiple stores to maximize
                reach. Official stores (Google Play, Apple App Store) are
                essential, but third-party and specialty stores can provide
                additional distribution channels.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">
                What are the typical developer fees?
              </h3>
              <p className="mt-1 text-muted-foreground">
                Fees vary widely. Google Play charges a one-time $25 fee, Apple
                charges $99/year, while many third-party stores are free.
                Commission rates typically range from 12% to 30% of sales.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">
                Are third-party app stores safe?
              </h3>
              <p className="mt-1 text-muted-foreground">
                Reputable third-party stores like F-Droid, Amazon Appstore, and
                Samsung Galaxy Store are safe and well-established. Always
                research a store&apos;s reputation before publishing.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

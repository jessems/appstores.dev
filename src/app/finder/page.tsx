import { Metadata } from "next";
import { StoreFinderWizard } from "@/components/finder/StoreFinderWizard";

export const metadata: Metadata = {
  title: "Store Finder — Find the Right App Store for Your Project",
  description:
    "Answer a few questions about your app and we'll recommend the best app stores to publish on. Compare fees, platforms, features, and review processes.",
  keywords: [
    "app store finder",
    "where to publish app",
    "best app store for developers",
    "app distribution platform",
    "app marketplace comparison",
  ],
  alternates: {
    canonical: "/finder",
  },
  openGraph: {
    title: "Store Finder — Find the Right App Store",
    description:
      "Answer a few questions and get personalized app store recommendations.",
    url: "/finder",
  },
};

export default function FinderPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold font-mono mb-3">
          <span className="text-dracula-cyan">$</span> find-store
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Answer a few questions about your project and we&apos;ll recommend the
          best app stores for you. Takes about 30 seconds.
        </p>
      </div>
      <StoreFinderWizard />
    </main>
  );
}

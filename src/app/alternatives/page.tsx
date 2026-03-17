import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllStores } from "@/lib/stores";
import { getCategoryById, categories } from "@/data/categories";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "App Store Alternatives — Find the Best Platform for Your App",
  description:
    "Browse alternatives to every major app store. Compare fees, features, and platform support to find the best distribution channel for your app.",
  keywords: [
    "app store alternatives",
    "Google Play alternatives",
    "App Store alternatives",
    "Steam alternatives",
    "app distribution platforms",
  ],
  alternates: {
    canonical: "/alternatives",
  },
};

export default async function AlternativesIndexPage() {
  const allStores = await getAllStores();

  // Group stores by category
  const storesByCategory = categories
    .map((cat) => ({
      category: cat,
      stores: allStores
        .filter((s) => s.category === cat.id)
        .sort((a, b) => {
          // Featured first, then by app count
          if (a.metadata.featured && !b.metadata.featured) return -1;
          if (!a.metadata.featured && b.metadata.featured) return 1;
          return (b.metrics.appCount ?? 0) - (a.metrics.appCount ?? 0);
        }),
    }))
    .filter((group) => group.stores.length > 0);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "App Store Alternatives",
    description:
      "Find alternatives to every major app store and distribution platform.",
    url: "https://appstores.dev/alternatives",
    numberOfItems: allStores.length,
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
          <span className="text-foreground">Alternatives</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-3">App Store Alternatives</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Find the best alternative to any app store. Browse {allStores.length}{" "}
            platforms organized by category, compare features and fees, and
            choose the right distribution channel for your app.
          </p>
        </div>

        {/* Categories */}
        {storesByCategory.map(({ category, stores }) => (
          <section key={category.id} className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">{category.name}</h2>
              <Link
                href={`/stores/category/${category.slug}`}
                className="text-sm text-primary hover:underline"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {stores.map((store) => (
                <Link
                  key={store.slug}
                  href={`/alternatives/${store.slug}`}
                  className="group"
                >
                  <Card className="h-full hover:border-primary/50 transition-colors">
                    <CardContent className="pt-4 pb-4 px-4">
                      <div className="flex items-center gap-3">
                        {store.logo && (
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden border bg-white flex-shrink-0">
                            <Image
                              src={store.logo}
                              alt={store.name}
                              fill
                              className="object-contain p-1"
                            />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                            {store.name} Alternatives
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {store.tagline}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {/* SEO content */}
        <section className="mt-16 prose prose-gray dark:prose-invert max-w-none">
          <h2>Why Look for App Store Alternatives?</h2>
          <p>
            The app distribution landscape is more diverse than ever. While
            giants like Apple&apos;s App Store and Google Play dominate mobile,
            there are over 100 viable alternatives for distributing software.
            Whether you&apos;re looking for lower fees, better discoverability,
            niche audiences, or more developer freedom, the right alternative
            store can make a significant difference to your app&apos;s success.
          </p>
          <p>
            Each store page on this site includes a detailed comparison with
            alternatives, covering commission rates, registration fees, platform
            support, developer tools, and more. Use our{" "}
            <Link href="/compare">comparison tool</Link> for side-by-side
            analysis of any two stores.
          </p>
        </section>
      </div>
    </div>
  );
}

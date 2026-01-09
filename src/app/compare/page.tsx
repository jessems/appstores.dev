import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getAllStores } from "@/lib/stores";
import { getCategoryById } from "@/data/categories";

export const metadata: Metadata = {
  title: "Compare App Stores",
  description:
    "Compare app stores side by side. Evaluate fees, features, review processes, and more to find the best platform for your app.",
  keywords: [
    "compare app stores",
    "app store comparison",
    "Google Play vs App Store",
    "app distribution comparison",
  ],
};

// Popular comparison pairs
const popularComparisons = [
  { store1: "google-play", store2: "apple-app-store" },
  { store1: "google-play", store2: "amazon-appstore" },
  { store1: "apple-app-store", store2: "samsung-galaxy-store" },
  { store1: "steam", store2: "epic-games-store" },
  { store1: "f-droid", store2: "google-play" },
  { store1: "huawei-appgallery", store2: "google-play" },
];

export default async function ComparePage() {
  const allStores = await getAllStores();
  const storeMap = new Map(allStores.map((s) => [s.slug, s]));

  // Get popular comparison data
  const comparisons = popularComparisons
    .map(({ store1, store2 }) => ({
      store1: storeMap.get(store1),
      store2: storeMap.get(store2),
    }))
    .filter((c) => c.store1 && c.store2);

  // Group stores by category for selection
  const storesByCategory = allStores.reduce(
    (acc, store) => {
      const category = store.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push(store);
      return acc;
    },
    {} as Record<string, typeof allStores>
  );

  return (
    <div className="py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Compare</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-3">Compare App Stores</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Compare app stores side by side to find the best platform for your
            app. Evaluate fees, commission rates, review processes, and
            features.
          </p>
        </div>

        {/* Popular Comparisons */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold mb-6">Popular Comparisons</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {comparisons.map(({ store1, store2 }) => (
              <Link
                key={`${store1!.slug}-${store2!.slug}`}
                href={`/compare/${store1!.slug}-vs-${store2!.slug}`}
              >
                <Card className="h-full transition-all hover:shadow-md hover:border-primary/50">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 text-center">
                        <p className="font-medium truncate">{store1!.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {store1!.fees.commissionTiers[0]?.percentage ?? "N/A"}%
                        </p>
                      </div>
                      <span className="text-muted-foreground font-medium">
                        vs
                      </span>
                      <div className="flex-1 text-center">
                        <p className="font-medium truncate">{store2!.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {store2!.fees.commissionTiers[0]?.percentage ?? "N/A"}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Browse by Category */}
        <section>
          <h2 className="text-xl font-semibold mb-6">Browse Stores to Compare</h2>
          <div className="space-y-8">
            {Object.entries(storesByCategory).map(([categoryId, stores]) => {
              const category = getCategoryById(categoryId as any);
              return (
                <div key={categoryId}>
                  <h3 className="font-medium mb-3 text-muted-foreground">
                    {category?.name || categoryId}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {stores.slice(0, 12).map((store) => (
                      <Link
                        key={store.slug}
                        href={`/stores/${store.slug}`}
                        className="px-3 py-1.5 text-sm bg-muted rounded-md hover:bg-muted/80 transition-colors"
                      >
                        {store.name}
                      </Link>
                    ))}
                    {stores.length > 12 && (
                      <Link
                        href={`/stores/category/${categoryId}`}
                        className="px-3 py-1.5 text-sm text-primary hover:underline"
                      >
                        +{stores.length - 12} more
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

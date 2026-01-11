import { Suspense } from "react";
import { Metadata } from "next";
import { SearchBar, SearchFilters } from "@/components/search";
import { StoreGrid, SponsoredSlot } from "@/components/store";
import { getAllStores, filterStores, sortStores, storeToCardData } from "@/lib/stores";
import { searchStores } from "@/lib/search";
import { Category, Platform, StoreSortOption } from "@/types/store";
import { RatingDimension } from "@/data/ratings";

export const metadata: Metadata = {
  title: "Browse App Stores",
  description:
    "Explore our comprehensive directory of app stores. Filter by category, platform, and more to find the perfect distribution platform for your apps.",
  alternates: {
    canonical: "/stores",
  },
};

interface StoresPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    platform?: string;
    sort?: string;
    minRating?: string;
  }>;
}

async function StoreResults({
  searchParams,
}: {
  searchParams: {
    q?: string;
    category?: string;
    platform?: string;
    sort?: string;
    minRating?: string;
  };
}) {
  const query = searchParams.q;
  const category = searchParams.category as Category | undefined;
  const platform = searchParams.platform as Platform | undefined;
  const sort = (searchParams.sort as StoreSortOption) || "featured";
  const minRating = searchParams.minRating as RatingDimension | undefined;

  let stores;

  if (query) {
    // Search mode
    const searchResults = await searchStores(query);
    stores = searchResults;

    // Apply additional filters to search results
    if (category) {
      stores = stores.filter((s) => s.category === category);
    }
    if (platform) {
      stores = stores.filter((s) => s.platforms.includes(platform));
    }
    if (minRating) {
      stores = stores.filter((s) => (s.ratings?.[minRating] ?? 0) >= 4);
    }
  } else {
    // Browse mode
    const allStores = await getAllStores();
    stores = allStores.map(storeToCardData);

    // Apply filters
    if (category) {
      stores = stores.filter((s) => s.category === category);
    }
    if (platform) {
      stores = stores.filter((s) => s.platforms.includes(platform));
    }
    if (minRating) {
      stores = stores.filter((s) => (s.ratings?.[minRating] ?? 0) >= 4);
    }

    // Sort
    stores = await sortStores(stores, sort);
  }

  return (
    <>
      <p className="text-sm text-muted-foreground mb-6">
        {stores.length} {stores.length === 1 ? "store" : "stores"} found
        {query && ` for "${query}"`}
      </p>
      <StoreGrid
        stores={stores}
        emptyMessage={
          query
            ? `No stores found for "${query}". Try a different search term.`
            : "No stores match your filters. Try adjusting your criteria."
        }
      />
    </>
  );
}

export default async function StoresPage({ searchParams }: StoresPageProps) {
  const params = await searchParams;

  return (
    <div className="py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Browse App Stores</h1>
          <p className="text-muted-foreground">
            Discover and compare app distribution platforms
          </p>
        </div>

        <div className="space-y-6">
          <Suspense fallback={null}>
            <SearchBar className="max-w-md" />
          </Suspense>

          <Suspense fallback={null}>
            <SearchFilters />
          </Suspense>

          <SponsoredSlot />

          <Suspense
            fallback={
              <div className="flex flex-col gap-4">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-24 rounded-lg bg-muted animate-pulse"
                  />
                ))}
              </div>
            }
          >
            <StoreResults searchParams={params} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

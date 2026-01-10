import {
  AppStore,
  StoreCardData,
  StoreFilters,
  StoreSortOption,
  Category,
  Platform,
} from "@/types/store";
import generatedStores from "@/data/generated-stores.json";

// Pre-generated store data (generated at build time from MDX files)
const allStoresData: AppStore[] = generatedStores as AppStore[];

export async function getAllStores(): Promise<AppStore[]> {
  return allStoresData;
}

export async function getStoreBySlug(slug: string): Promise<AppStore | null> {
  return allStoresData.find((store) => store.slug === slug) || null;
}

export async function getFeaturedStores(): Promise<StoreCardData[]> {
  const stores = await getAllStores();

  return stores
    .filter((store) => store.metadata.featured)
    .sort(
      (a, b) =>
        (a.metadata.featuredOrder ?? 99) - (b.metadata.featuredOrder ?? 99)
    )
    .slice(0, 6)
    .map(storeToCardData);
}

export async function getStoresByCategory(
  category: Category
): Promise<StoreCardData[]> {
  const stores = await getAllStores();

  return stores
    .filter((store) => store.category === category)
    .map(storeToCardData);
}

export async function getAIStores(): Promise<StoreCardData[]> {
  const stores = await getAllStores();
  const aiCategories: Category[] = [
    "ai-assistants",
    "ai-copilots",
    "ai-agents",
    "ai-developer",
  ];

  return stores
    .filter((store) => aiCategories.includes(store.category))
    .sort(
      (a, b) =>
        (a.metadata.featuredOrder ?? 99) - (b.metadata.featuredOrder ?? 99)
    )
    .map(storeToCardData);
}

export async function getStoresByPlatform(
  platform: Platform
): Promise<StoreCardData[]> {
  const stores = await getAllStores();

  return stores
    .filter((store) => store.platforms.includes(platform))
    .map(storeToCardData);
}

export async function filterStores(
  filters: StoreFilters
): Promise<StoreCardData[]> {
  let stores = await getAllStores();

  if (filters.category && filters.category.length > 0) {
    stores = stores.filter((store) =>
      filters.category!.includes(store.category)
    );
  }

  if (filters.platform && filters.platform.length > 0) {
    stores = stores.filter((store) =>
      store.platforms.some((p) => filters.platform!.includes(p))
    );
  }

  if (filters.hasApi !== undefined) {
    stores = stores.filter((store) => store.technical.hasApi === filters.hasApi);
  }

  if (filters.hasSdk !== undefined) {
    stores = stores.filter((store) => store.technical.hasSdk === filters.hasSdk);
  }

  if (filters.freeToPublish !== undefined) {
    stores = stores.filter((store) => {
      const hasFee =
        store.fees.registrationFee && store.fees.registrationFee.amount > 0;
      return filters.freeToPublish ? !hasFee : hasFee;
    });
  }

  return stores.map(storeToCardData);
}

export async function sortStores(
  stores: StoreCardData[],
  sortOption: StoreSortOption
): Promise<StoreCardData[]> {
  const sorted = [...stores];

  switch (sortOption) {
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case "app-count-desc":
      return sorted.sort(
        (a, b) => (b.metrics.appCount ?? 0) - (a.metrics.appCount ?? 0)
      );
    case "commission-asc":
      return sorted.sort((a, b) => {
        const aCommission = a.fees.commissionTiers[0]?.percentage ?? 100;
        const bCommission = b.fees.commissionTiers[0]?.percentage ?? 100;
        return aCommission - bCommission;
      });
    case "featured":
      return sorted.sort((a, b) => {
        if (a.metadata.featured && !b.metadata.featured) return -1;
        if (!a.metadata.featured && b.metadata.featured) return 1;
        return a.name.localeCompare(b.name);
      });
    case "rating-overall-desc":
      return sorted.sort(
        (a, b) =>
          calculateOverallRating(b.ratings) - calculateOverallRating(a.ratings)
      );
    case "rating-commission-desc":
      return sorted.sort(
        (a, b) => (b.ratings?.commission ?? 0) - (a.ratings?.commission ?? 0)
      );
    case "rating-reviewProcess-desc":
      return sorted.sort(
        (a, b) =>
          (b.ratings?.reviewProcess ?? 0) - (a.ratings?.reviewProcess ?? 0)
      );
    case "rating-stability-desc":
      return sorted.sort(
        (a, b) => (b.ratings?.stability ?? 0) - (a.ratings?.stability ?? 0)
      );
    case "rating-developerSupport-desc":
      return sorted.sort(
        (a, b) =>
          (b.ratings?.developerSupport ?? 0) - (a.ratings?.developerSupport ?? 0)
      );
    case "rating-discoverability-desc":
      return sorted.sort(
        (a, b) =>
          (b.ratings?.discoverability ?? 0) - (a.ratings?.discoverability ?? 0)
      );
    case "rating-competitiveness-desc":
      return sorted.sort(
        (a, b) =>
          (b.ratings?.competitiveness ?? 0) - (a.ratings?.competitiveness ?? 0)
      );
    case "rating-entryBarriers-desc":
      return sorted.sort(
        (a, b) =>
          (b.ratings?.entryBarriers ?? 0) - (a.ratings?.entryBarriers ?? 0)
      );
    case "rating-technicalFreedom-desc":
      return sorted.sort(
        (a, b) =>
          (b.ratings?.technicalFreedom ?? 0) - (a.ratings?.technicalFreedom ?? 0)
      );
    case "rating-analytics-desc":
      return sorted.sort(
        (a, b) => (b.ratings?.analytics ?? 0) - (a.ratings?.analytics ?? 0)
      );
    default:
      return sorted;
  }
}

export async function getAllSlugs(): Promise<string[]> {
  return allStoresData.map((store) => store.slug);
}

export async function getStoreCount(): Promise<number> {
  const stores = await getAllStores();
  return stores.length;
}

export async function getTotalAppCount(): Promise<number> {
  const stores = await getAllStores();
  return stores.reduce(
    (total, store) => total + (store.metrics.appCount ?? 0),
    0
  );
}

export async function getRelatedStores(
  store: AppStore
): Promise<StoreCardData[]> {
  const allStores = await getAllStores();

  // If store has explicit related stores, use those
  if (store.relatedStores && store.relatedStores.length > 0) {
    return allStores
      .filter((s) => store.relatedStores!.includes(s.slug))
      .map(storeToCardData);
  }

  // Otherwise, find stores in the same category or with overlapping platforms
  return allStores
    .filter((s) => s.slug !== store.slug)
    .filter(
      (s) =>
        s.category === store.category ||
        s.platforms.some((p) => store.platforms.includes(p))
    )
    .slice(0, 4)
    .map(storeToCardData);
}

// Convert full store to card data (lighter version for listings)
export function storeToCardData(store: AppStore): StoreCardData {
  return {
    id: store.id,
    name: store.name,
    slug: store.slug,
    tagline: store.tagline,
    logo: store.logo,
    category: store.category,
    platforms: store.platforms,
    metrics: {
      appCount: store.metrics.appCount,
    },
    fees: {
      commissionTiers: store.fees.commissionTiers,
    },
    metadata: {
      featured: store.metadata.featured,
      verified: store.metadata.verified,
    },
    ratings: store.ratings,
  };
}

// Calculate overall rating as average of all dimensions
export function calculateOverallRating(
  ratings: StoreCardData["ratings"]
): number {
  if (!ratings) return 0;
  const values = Object.values(ratings).filter(
    (v): v is number => typeof v === "number"
  );
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

// SEO Filter Functions

export async function getStoresByCategoryAndPlatform(
  category: Category,
  platform: Platform
): Promise<StoreCardData[]> {
  const stores = await getAllStores();
  return stores
    .filter(
      (store) =>
        store.category === category && store.platforms.includes(platform)
    )
    .map(storeToCardData);
}

export async function getStoresWithApi(): Promise<StoreCardData[]> {
  const stores = await getAllStores();
  return stores.filter((store) => store.technical.hasApi).map(storeToCardData);
}

export async function getStoresWithSdk(): Promise<StoreCardData[]> {
  const stores = await getAllStores();
  return stores.filter((store) => store.technical.hasSdk).map(storeToCardData);
}

export async function getStoresWithSubscriptions(): Promise<StoreCardData[]> {
  const stores = await getAllStores();
  return stores
    .filter((store) => store.technical.supportsSubscriptions)
    .map(storeToCardData);
}

export async function getStoresWithInAppPurchases(): Promise<StoreCardData[]> {
  const stores = await getAllStores();
  return stores
    .filter((store) => store.technical.supportsInAppPurchases)
    .map(storeToCardData);
}

export async function getStoresWithBetaTesting(): Promise<StoreCardData[]> {
  const stores = await getAllStores();
  return stores
    .filter((store) => store.features.hasBetaTesting)
    .map(storeToCardData);
}

export async function getStoresWithAnalytics(): Promise<StoreCardData[]> {
  const stores = await getAllStores();
  return stores
    .filter((store) => store.features.hasAnalyticsDashboard)
    .map(storeToCardData);
}

export async function getFreeToPublishStores(): Promise<StoreCardData[]> {
  const stores = await getAllStores();
  return stores
    .filter(
      (store) =>
        !store.fees.registrationFee || store.fees.registrationFee.amount === 0
    )
    .map(storeToCardData);
}

export async function getLowCommissionStores(
  maxCommission: number = 15
): Promise<StoreCardData[]> {
  const stores = await getAllStores();
  return stores
    .filter((store) => {
      const firstTier = store.fees.commissionTiers[0];
      return firstTier && firstTier.percentage <= maxCommission;
    })
    .map(storeToCardData);
}

export async function getNoCommissionStores(): Promise<StoreCardData[]> {
  const stores = await getAllStores();
  return stores
    .filter((store) => {
      const firstTier = store.fees.commissionTiers[0];
      return firstTier && firstTier.percentage === 0;
    })
    .map(storeToCardData);
}

export async function getStoresByRating(
  dimension: string,
  minRating: number = 4
): Promise<StoreCardData[]> {
  const stores = await getAllStores();
  return stores
    .filter((store) => {
      const ratings = store.ratings as Record<string, number> | undefined;
      return (ratings?.[dimension] ?? 0) >= minRating;
    })
    .sort((a, b) => {
      const ratingsA = a.ratings as Record<string, number> | undefined;
      const ratingsB = b.ratings as Record<string, number> | undefined;
      return (ratingsB?.[dimension] ?? 0) - (ratingsA?.[dimension] ?? 0);
    })
    .map(storeToCardData);
}

export async function getTopRatedStores(
  dimension: string,
  limit: number = 20
): Promise<StoreCardData[]> {
  const stores = await getAllStores();
  return stores
    .filter((store) => {
      const ratings = store.ratings as Record<string, number> | undefined;
      return ratings?.[dimension] !== undefined;
    })
    .sort((a, b) => {
      const ratingsA = a.ratings as Record<string, number> | undefined;
      const ratingsB = b.ratings as Record<string, number> | undefined;
      return (ratingsB?.[dimension] ?? 0) - (ratingsA?.[dimension] ?? 0);
    })
    .slice(0, limit)
    .map(storeToCardData);
}

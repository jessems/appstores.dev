import Fuse, { IFuseOptions } from "fuse.js";
import { AppStore, StoreSearchResult } from "@/types/store";
import { getAllStores, storeToCardData } from "./stores";

const fuseOptions: IFuseOptions<AppStore> = {
  keys: [
    { name: "name", weight: 2 },
    { name: "tagline", weight: 1.5 },
    { name: "description", weight: 1 },
    { name: "company.name", weight: 1 },
    { name: "category", weight: 0.5 },
    { name: "platforms", weight: 0.5 },
  ],
  threshold: 0.3,
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
};

let fuseInstance: Fuse<AppStore> | null = null;
let storesCache: AppStore[] | null = null;

async function getFuseInstance(): Promise<Fuse<AppStore>> {
  if (!fuseInstance || !storesCache) {
    storesCache = await getAllStores();
    fuseInstance = new Fuse(storesCache, fuseOptions);
  }
  return fuseInstance;
}

export async function searchStores(query: string): Promise<StoreSearchResult[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const fuse = await getFuseInstance();
  const results = fuse.search(query.trim());

  return results.map((result) => ({
    ...storeToCardData(result.item),
    score: result.score,
    matches: result.matches?.map((match) => ({
      key: match.key ?? "",
      value: match.value ?? "",
      indices: match.indices as [number, number][],
    })),
  }));
}

export async function getSearchSuggestions(
  query: string,
  limit: number = 5
): Promise<string[]> {
  const results = await searchStores(query);
  return results.slice(0, limit).map((r) => r.name);
}

// Reset cache (useful for development/testing)
export function resetSearchCache(): void {
  fuseInstance = null;
  storesCache = null;
}

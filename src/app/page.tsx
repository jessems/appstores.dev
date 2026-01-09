import { Hero, FeaturedStores, CategoryHighlights, PlatformHighlights } from "@/components/home";
import { getFeaturedStores, getStoreCount, getTotalAppCount } from "@/lib/stores";

export default async function HomePage() {
  const [featuredStores, storeCount, totalAppCount] = await Promise.all([
    getFeaturedStores(),
    getStoreCount(),
    getTotalAppCount(),
  ]);

  return (
    <>
      <Hero storeCount={storeCount} totalAppCount={totalAppCount} />
      <FeaturedStores stores={featuredStores} />
      <CategoryHighlights />
      <PlatformHighlights />
    </>
  );
}

import { Hero, FeaturedStores, NewAIStores, CategoryHighlights, PlatformHighlights } from "@/components/home";
import { getFeaturedStores, getAIStores, getStoreCount, getTotalAppCount } from "@/lib/stores";

function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "appstores.dev",
    url: "https://appstores.dev",
    logo: "https://appstores.dev/icon.png",
    description:
      "The comprehensive directory for app stores and app distribution platforms.",
    sameAs: ["https://github.com/jessems/appstores.dev"],
  };
}

function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "appstores.dev",
    url: "https://appstores.dev",
    description:
      "Discover and compare app stores. Find the best platform to publish your apps.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://appstores.dev/stores?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export default async function HomePage() {
  const [featuredStores, aiStores, storeCount, totalAppCount] = await Promise.all([
    getFeaturedStores(),
    getAIStores(),
    getStoreCount(),
    getTotalAppCount(),
  ]);

  const organizationSchema = generateOrganizationSchema();
  const webSiteSchema = generateWebSiteSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <Hero storeCount={storeCount} totalAppCount={totalAppCount} />
      <NewAIStores stores={aiStores} />
      <FeaturedStores stores={featuredStores} />
      <CategoryHighlights />
      <PlatformHighlights />
    </>
  );
}

import { Metadata } from "next";
import Link from "next/link";
import { HelpCircle, ChevronRight, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllStores } from "@/lib/stores";
import { categories } from "@/data/categories";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "App Store FAQ Directory - Common Developer Questions Answered",
  description:
    "Browse FAQs for 149+ app stores. Find answers about fees, submission processes, review times, supported platforms, and more for every major app distribution platform.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "App Store FAQ Directory",
    description:
      "Frequently asked questions for every app store. Fees, reviews, platforms, and more.",
    url: "https://appstores.dev/faq",
    type: "website",
  },
};

export default async function FAQIndexPage() {
  const stores = await getAllStores();

  // Group stores by category
  const grouped = stores.reduce(
    (acc, store) => {
      if (!acc[store.category]) acc[store.category] = [];
      acc[store.category].push(store);
      return acc;
    },
    {} as Record<string, typeof stores>
  );

  // Sort groups by category order
  const categoryOrder = categories.map((c) => c.id);
  const sortedGroups = categoryOrder
    .filter((id) => grouped[id] && grouped[id].length > 0)
    .map((id) => ({
      category: categories.find((c) => c.id === id)!,
      stores: grouped[id].sort((a, b) => a.name.localeCompare(b.name)),
    }));

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "App Store FAQ Directory",
    description: "FAQs for 149+ app stores",
    url: "https://appstores.dev/faq",
    numberOfItems: stores.length,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">FAQ</span>
        </nav>

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">
              App Store FAQ Directory
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Find answers to common developer questions for {stores.length}+ app
            stores. Select a store to view its FAQ.
          </p>
        </div>

        <div className="space-y-10">
          {sortedGroups.map(({ category, stores: catStores }) => (
            <section key={category.id}>
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-semibold">{category.name}</h2>
                <Badge variant="secondary">{catStores.length}</Badge>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {catStores.map((store) => (
                  <Link key={store.slug} href={`/faq/${store.slug}`}>
                    <Card className="h-full hover:border-primary/50 transition-colors cursor-pointer">
                      <CardContent className="pt-4 pb-4 flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {store.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {store.tagline}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}

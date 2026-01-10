import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { StoreGrid } from "@/components/store";
import { getStoresByCategoryAndPlatform } from "@/lib/stores";
import { categories, getCategoryBySlug } from "@/data/categories";
import { platforms, getPlatformById } from "@/data/platforms";
import { Category, Platform } from "@/types/store";

interface CategoryPlatformPageProps {
  params: Promise<{ slug: string; platform: string }>;
}

export async function generateStaticParams() {
  const params: { slug: string; platform: string }[] = [];

  for (const category of categories) {
    for (const platform of platforms) {
      params.push({
        slug: category.slug,
        platform: platform.id,
      });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: CategoryPlatformPageProps): Promise<Metadata> {
  const { slug: categorySlug, platform: platformSlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  const platform = getPlatformById(platformSlug as Platform);

  if (!category || !platform) {
    return { title: "Not Found" };
  }

  const title = `${category.name} for ${platform.name} - App Store Directory`;
  const description = `Find ${category.name.toLowerCase()} that support ${platform.name} app distribution. Compare features, fees, and submission requirements for ${platform.name} developers.`;

  return {
    title,
    description,
    keywords: [
      `${category.name.toLowerCase()} ${platform.name.toLowerCase()}`,
      `${platform.name.toLowerCase()} ${category.name.toLowerCase()}`,
      `${platform.name.toLowerCase()} app stores`,
      `${category.name.toLowerCase()} app distribution`,
      "app marketplace",
      "developer platforms",
    ],
    alternates: {
      canonical: `/stores/category/${categorySlug}/platform/${platformSlug}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(`${category.name} for ${platform.name}`)}&description=${encodeURIComponent(description)}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

export default async function CategoryPlatformPage({
  params,
}: CategoryPlatformPageProps) {
  const { slug: categorySlug, platform: platformSlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  const platform = getPlatformById(platformSlug as Platform);

  if (!category || !platform) {
    notFound();
  }

  const stores = await getStoresByCategoryAndPlatform(
    category.id as Category,
    platform.id
  );

  return (
    <div className="py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href="/stores"
            className="hover:text-foreground transition-colors"
          >
            Stores
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href={`/stores/category/${category.slug}`}
            className="hover:text-foreground transition-colors"
          >
            {category.name}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{platform.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3">
            {category.name} for {platform.name}
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Discover {category.name.toLowerCase()} that support {platform.name}{" "}
            app distribution. {stores.length > 0
              ? `Browse ${stores.length} ${stores.length === 1 ? "store" : "stores"} matching your criteria.`
              : "No stores currently match this combination."}
          </p>
        </div>

        {/* Store count & navigation */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <p className="text-sm text-muted-foreground">
            Showing {stores.length} {stores.length === 1 ? "store" : "stores"}
          </p>
          <div className="flex gap-4">
            <Link
              href={`/stores/category/${category.slug}`}
              className="text-sm text-primary hover:underline"
            >
              All {category.name}
            </Link>
            <Link
              href={`/stores/platform/${platform.id}`}
              className="text-sm text-primary hover:underline"
            >
              All {platform.name} stores
            </Link>
          </div>
        </div>

        {/* Stores Grid */}
        {stores.length > 0 ? (
          <StoreGrid stores={stores} />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No stores found matching {category.name} for {platform.name}.
            </p>
            <div className="mt-4 flex justify-center gap-4">
              <Link
                href={`/stores/category/${category.slug}`}
                className="text-primary hover:underline"
              >
                Browse all {category.name}
              </Link>
              <Link
                href={`/stores/platform/${platform.id}`}
                className="text-primary hover:underline"
              >
                Browse all {platform.name} stores
              </Link>
            </div>
          </div>
        )}

        {/* SEO Content */}
        <div className="mt-16 prose prose-gray dark:prose-invert max-w-none">
          <h2>
            {category.name} for {platform.name} Developers
          </h2>
          <p>
            Looking to distribute your {platform.name} app through{" "}
            {category.name.toLowerCase()}? This page lists all app stores in the{" "}
            {category.name.toLowerCase()} category that support {platform.name}{" "}
            applications. Each store offers different features, commission
            structures, and submission requirements. Compare your options to
            find the best fit for your {platform.name} app.
          </p>
          <h3>Why Consider {category.name}?</h3>
          <p>{category.description}</p>
          <h3>Publishing for {platform.name}</h3>
          <p>
            {platform.name} developers have various distribution options
            available. By filtering for {category.name.toLowerCase()} that
            support {platform.name}, you can find stores that match both your
            business model and technical requirements.
          </p>
        </div>
      </div>
    </div>
  );
}

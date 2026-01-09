import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { StoreGrid } from "@/components/store";
import { getStoresByCategory } from "@/lib/stores";
import { categories, getCategoryBySlug } from "@/data/categories";
import { Category } from "@/types/store";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return { title: "Category Not Found" };
  }

  const title = `${category.name} - App Store Directory`;
  const description = `Discover ${category.name.toLowerCase()} for app distribution. ${category.description}. Compare features, fees, and requirements.`;

  return {
    title,
    description,
    keywords: [
      category.name.toLowerCase(),
      "app stores",
      "app distribution",
      `${category.name.toLowerCase()} app stores`,
      "developer platforms",
      "app marketplace",
    ],
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const stores = await getStoresByCategory(category.id as Category);

  return (
    <div className="py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
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
          <span className="text-foreground">{category.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3">{category.name}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            {category.description}. Browse {stores.length} app{" "}
            {stores.length === 1 ? "store" : "stores"} in this category.
          </p>
        </div>

        {/* Store count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {stores.length} {stores.length === 1 ? "store" : "stores"}
          </p>
          <Link
            href="/stores"
            className="text-sm text-primary hover:underline"
          >
            View all stores
          </Link>
        </div>

        {/* Stores Grid */}
        {stores.length > 0 ? (
          <StoreGrid stores={stores} />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No stores found in this category.
            </p>
            <Link
              href="/stores"
              className="text-primary hover:underline mt-2 inline-block"
            >
              Browse all stores
            </Link>
          </div>
        )}

        {/* SEO Content */}
        <div className="mt-16 prose prose-gray dark:prose-invert max-w-none">
          <h2>About {category.name}</h2>
          <p>
            {getCategoryContent(category.id as Category)}
          </p>
        </div>
      </div>
    </div>
  );
}

function getCategoryContent(categoryId: Category): string {
  const content: Record<Category, string> = {
    official:
      "Official app stores are platform-native marketplaces operated by the companies behind major operating systems. These include Apple's App Store for iOS and Google Play Store for Android. They offer the largest user bases and most stringent review processes, ensuring high-quality apps reach consumers.",
    manufacturer:
      "Manufacturer app stores are operated by device makers like Samsung, Huawei, and Xiaomi. These stores often come pre-installed on devices and offer additional reach in markets where these manufacturers have significant market share. They typically have lower competition than official stores.",
    "third-party":
      "Third-party app stores provide alternative distribution channels outside the official platform stores. They often offer more flexible policies, lower fees, and different audience segments. Popular options include Amazon Appstore, APKPure, and various regional alternatives.",
    gaming:
      "Gaming-focused app stores specialize in game distribution and often provide features tailored to game developers, such as integrated payment systems, community features, and specialized marketing tools. Examples include Steam, Epic Games Store, and itch.io.",
    enterprise:
      "Enterprise app stores cater to businesses distributing internal applications or B2B software. They offer features like private app distribution, device management integration, and compliance tools essential for corporate deployments.",
    "open-source":
      "Open-source app stores focus on free and open-source software (FOSS) distribution. Platforms like F-Droid ensure transparency and privacy by only hosting apps with available source code. They appeal to privacy-conscious users and developers.",
    regional:
      "Regional app stores serve specific geographic markets and often dominate in areas where global platforms have limited presence. Examples include stores popular in China, Russia, and other markets with unique distribution requirements.",
    specialty:
      "Specialty app stores focus on specific verticals or use cases, such as education, healthcare, or specific industries. They provide curated experiences and often have specialized review processes tailored to their niche.",
  };

  return content[categoryId];
}

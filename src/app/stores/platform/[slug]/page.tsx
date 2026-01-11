import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { StoreGrid } from "@/components/store";
import { getStoresByPlatform } from "@/lib/stores";
import { platforms, getPlatformById } from "@/data/platforms";
import { Platform } from "@/types/store";

// Force static generation for Cloudflare Workers
export const dynamic = "force-static";
export const dynamicParams = false;

interface PlatformPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return platforms.map((platform) => ({
    slug: platform.id,
  }));
}

export async function generateMetadata({
  params,
}: PlatformPageProps): Promise<Metadata> {
  const { slug } = await params;
  const platform = getPlatformById(slug as Platform);

  if (!platform) {
    return { title: "Platform Not Found" };
  }

  const title = `${platform.name} App Stores - Distribution Platforms`;
  const description = `Find the best app stores for ${platform.name} app distribution. Compare ${platform.name} app marketplaces, fees, features, and submission requirements.`;

  return {
    title,
    description,
    keywords: [
      `${platform.name.toLowerCase()} app stores`,
      `${platform.name.toLowerCase()} app distribution`,
      `${platform.name.toLowerCase()} app marketplace`,
      `publish ${platform.name.toLowerCase()} apps`,
      "app distribution platforms",
      "developer platforms",
    ],
    alternates: {
      canonical: `/stores/platform/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(`${platform.name} App Stores`)}&description=${encodeURIComponent(description)}`,
          width: 1200,
          height: 630,
          alt: `${platform.name} App Stores`,
        },
      ],
    },
  };
}

export default async function PlatformPage({ params }: PlatformPageProps) {
  const { slug } = await params;
  const platform = getPlatformById(slug as Platform);

  if (!platform) {
    notFound();
  }

  const stores = await getStoresByPlatform(platform.id);

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
          <span className="text-foreground">{platform.name}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3">
            {platform.name} App Stores
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Discover app stores and distribution platforms that support{" "}
            {platform.name}. Browse {stores.length}{" "}
            {stores.length === 1 ? "platform" : "platforms"} to publish your{" "}
            {platform.name} apps.
          </p>
        </div>

        {/* Store count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {stores.length} {stores.length === 1 ? "store" : "stores"}
          </p>
          <Link href="/stores" className="text-sm text-primary hover:underline">
            View all stores
          </Link>
        </div>

        {/* Stores Grid */}
        {stores.length > 0 ? (
          <StoreGrid stores={stores} />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No stores found for this platform.
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
          <h2>Distributing {platform.name} Apps</h2>
          <p>{getPlatformContent(platform.id)}</p>
        </div>
      </div>
    </div>
  );
}

function getPlatformContent(platformId: Platform): string {
  const content: Record<Platform, string> = {
    ios: "iOS app distribution is primarily handled through Apple's App Store, which requires a $99/year developer membership. However, with recent regulatory changes in some regions, alternative app stores are becoming available. iOS apps must follow Apple's strict guidelines and undergo a review process before publication.",
    android:
      "Android offers the most diverse app distribution ecosystem. Beyond Google Play Store, developers can distribute apps through manufacturer stores (Samsung Galaxy Store, Huawei AppGallery), third-party stores (Amazon Appstore, APKPure), or even direct APK downloads. Each store has different requirements, fee structures, and audience reach.",
    windows:
      "Windows app distribution includes the Microsoft Store for UWP and traditional desktop apps, as well as third-party platforms like Steam for games, and direct distribution through websites. Windows offers flexibility in distribution methods, allowing developers to choose the approach that best fits their needs.",
    macos:
      "macOS apps can be distributed through the Mac App Store or directly to users as DMG files or PKG installers. The Mac App Store provides discovery and automatic updates but requires adherence to Apple's guidelines. Direct distribution offers more freedom but requires handling updates and notarization yourself.",
    linux:
      "Linux app distribution varies by distribution but includes package managers, Snap Store, Flathub, and AppImage. The open-source nature of Linux means there are many ways to reach users, each with different packaging requirements and audience characteristics.",
    web: "Web app distribution platforms enable developers to reach users through browsers without traditional app store requirements. These platforms range from PWA directories to SaaS marketplaces, offering flexible distribution options and often lower fees than traditional app stores.",
    "cross-platform":
      "Cross-platform distribution allows developers to reach users across multiple operating systems from a single codebase. Many modern frameworks support building for iOS, Android, Windows, macOS, Linux, and web from shared code, simplifying multi-platform release strategies.",
  };

  return content[platformId];
}

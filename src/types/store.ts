import { RatingDimension } from "@/data/ratings";

export type Platform =
  | "ios"
  | "android"
  | "windows"
  | "macos"
  | "linux"
  | "web"
  | "cross-platform";

export type StoreRatings = {
  [K in RatingDimension]?: number; // 1-5 scale
};

export type Category =
  | "official"
  | "manufacturer"
  | "third-party"
  | "gaming"
  | "enterprise"
  | "open-source"
  | "regional"
  | "specialty";

export type PricingModel =
  | "free"
  | "paid"
  | "freemium"
  | "subscription"
  | "one-time";

export interface CommissionTier {
  percentage: number;
  description: string;
  conditions?: string;
}

export interface AppStore {
  // Basic Information
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  url: string;
  logo: string;
  screenshots?: string[];
  category: Category;
  platforms: Platform[];

  // Company Information
  company: {
    name: string;
    headquarters?: string;
    foundedYear?: number;
    website?: string;
  };

  // Metrics
  metrics: {
    appCount?: number;
    appCountSource?: string;
    appCountLastUpdated?: string;
    monthlyActiveUsers?: number;
    monthlyDownloads?: number;
    developerCount?: number;
  };

  // Developer Fees & Commission
  fees: {
    registrationFee?: {
      amount: number;
      currency: string;
      type: "one-time" | "annual";
    };
    commissionTiers: CommissionTier[];
    hasReducedCommission?: boolean;
    reducedCommissionDetails?: string;
  };

  // Technical Capabilities
  technical: {
    hasApi: boolean;
    apiDocumentationUrl?: string;
    hasSdk: boolean;
    sdkPlatforms?: string[];
    sdkDocumentationUrl?: string;
    supportsInAppPurchases: boolean;
    supportsSubscriptions: boolean;
    supportsAds: boolean;
    supportedAdNetworks?: string[];
  };

  // Monetization Options
  monetization: {
    models: PricingModel[];
    paymentMethods?: string[];
    payoutMethods?: string[];
    minimumPayout?: number;
    payoutCurrency?: string;
    payoutFrequency?: string;
  };

  // Submission & Review Process
  submission: {
    guidelinesUrl?: string;
    guidelinesSummary?: string;
    typicalReviewTime?: string;
    hasAutomatedReview: boolean;
    hasHumanReview: boolean;
    commonRejectionReasons?: string[];
    appealsProcess?: string;
    requiresApproval: boolean;
  };

  // Geographic Information
  geographic: {
    availableRegions: string[];
    restrictedRegions?: string[];
    supportedLanguages?: string[];
    localizedStores?: boolean;
  };

  // Additional Features
  features: {
    hasEditorialContent: boolean;
    hasAppBundles: boolean;
    hasPreRegistration: boolean;
    hasBetaTesting: boolean;
    hasAnalyticsDashboard: boolean;
    hasABTesting: boolean;
    hasUserReviews: boolean;
    hasRatings: boolean;
  };

  // Metadata
  metadata: {
    featured: boolean;
    featuredOrder?: number;
    verified: boolean;
    lastUpdated: string;
    dateAdded: string;
    status: "active" | "deprecated" | "beta";
  };

  // SEO
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };

  // Ratings (1-5 scale)
  ratings?: StoreRatings;

  // Related & Comparison
  relatedStores?: string[];
  pros?: string[];
  cons?: string[];

  // MDX Content (populated at runtime)
  content?: string;
}

// Lighter version for listing cards
export interface StoreCardData {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  logo: string;
  category: Category;
  platforms: Platform[];
  metrics: {
    appCount?: number;
  };
  fees: {
    commissionTiers: CommissionTier[];
  };
  metadata: {
    featured: boolean;
    verified: boolean;
  };
  ratings?: StoreRatings;
}

// Search result type
export interface StoreSearchResult extends StoreCardData {
  score?: number;
  matches?: {
    key: string;
    value: string;
    indices: [number, number][];
  }[];
}

// Filter options
export interface StoreFilters {
  category?: Category[];
  platform?: Platform[];
  hasApi?: boolean;
  hasSdk?: boolean;
  freeToPublish?: boolean;
  minRating?: {
    dimension: RatingDimension;
    value: number;
  };
}

// Sort options
export type StoreSortOption =
  | "name-asc"
  | "name-desc"
  | "app-count-desc"
  | "commission-asc"
  | "featured"
  | "rating-commission-desc"
  | "rating-reviewProcess-desc"
  | "rating-stability-desc"
  | "rating-developerSupport-desc"
  | "rating-discoverability-desc"
  | "rating-competitiveness-desc"
  | "rating-entryBarriers-desc"
  | "rating-technicalFreedom-desc"
  | "rating-analytics-desc"
  | "rating-overall-desc";

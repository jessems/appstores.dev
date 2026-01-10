// SEO landing pages for footer - programmatic SEO keywords

export interface SeoLandingPage {
  name: string;
  href: string;
}

export interface SeoCategory {
  title: string;
  links: SeoLandingPage[];
}

export const seoLandingPages: SeoCategory[] = [
  {
    title: "AI & ML",
    links: [
      { name: "AI App Stores", href: "/stores/ai" },
      { name: "GPT Store", href: "/stores/category/ai-assistants" },
      { name: "AI Agent Marketplaces", href: "/stores/category/ai-agents" },
      { name: "AI Copilot Plugins", href: "/stores/category/ai-copilots" },
      { name: "MCP Servers", href: "/stores/category/ai-developer" },
      { name: "AI Developer Tools", href: "/stores/category/ai-developer" },
      { name: "Custom GPTs", href: "/stores/category/ai-assistants" },
      { name: "ChatGPT Plugins", href: "/stores/category/ai-copilots" },
      { name: "LLM Marketplaces", href: "/stores/category/ai-developer" },
      { name: "AI Workflow Automation", href: "/stores/category/ai-agents" },
    ],
  },
  {
    title: "By Platform",
    links: [
      { name: "iOS App Stores", href: "/stores/platform/ios" },
      { name: "Android App Stores", href: "/stores/platform/android" },
      { name: "Windows App Stores", href: "/stores/platform/windows" },
      { name: "Mac App Stores", href: "/stores/platform/macos" },
      { name: "Linux App Stores", href: "/stores/platform/linux" },
      { name: "Web App Stores", href: "/stores/platform/web" },
      { name: "Cross-Platform Stores", href: "/stores/platform/cross-platform" },
      { name: "Android Alternatives", href: "/stores/platform/android" },
      { name: "iPhone App Distribution", href: "/stores/platform/ios" },
      { name: "Desktop App Stores", href: "/stores/platform/windows" },
    ],
  },
  {
    title: "By Category",
    links: [
      { name: "Official App Stores", href: "/stores/category/official" },
      { name: "Gaming Stores", href: "/stores/category/gaming" },
      { name: "Enterprise App Stores", href: "/stores/category/enterprise" },
      { name: "Open Source Stores", href: "/stores/category/open-source" },
      { name: "Third Party Stores", href: "/stores/category/third-party" },
      { name: "Manufacturer Stores", href: "/stores/category/manufacturer" },
      { name: "Regional App Stores", href: "/stores/category/regional" },
      { name: "Specialty Stores", href: "/stores/category/specialty" },
      { name: "Indie Game Stores", href: "/stores/category/gaming" },
      { name: "B2B App Stores", href: "/stores/category/enterprise" },
    ],
  },
  {
    title: "By Features",
    links: [
      { name: "Stores with API", href: "/stores/features/api" },
      { name: "Stores with SDK", href: "/stores/features/sdk" },
      { name: "Subscription Support", href: "/stores/features/subscriptions" },
      { name: "In-App Purchases", href: "/stores/features/in-app-purchases" },
      { name: "Beta Testing", href: "/stores/features/beta-testing" },
      { name: "Analytics Dashboard", href: "/stores/features/analytics" },
      { name: "CI/CD Integration", href: "/stores/features/api" },
      { name: "Developer Console", href: "/stores/features/analytics" },
      { name: "A/B Testing", href: "/stores/features/beta-testing" },
      { name: "Crash Reporting", href: "/stores/features/sdk" },
    ],
  },
  {
    title: "By Cost",
    links: [
      { name: "Free to Publish", href: "/stores/monetization/free-to-publish" },
      { name: "Low Commission", href: "/stores/monetization/low-commission" },
      { name: "Zero Commission", href: "/stores/monetization/no-commission" },
      { name: "No Developer Fee", href: "/stores/monetization/free-to-publish" },
      { name: "Lowest App Store Fees", href: "/stores/best/commission-rates" },
      { name: "15% Commission Stores", href: "/stores/monetization/low-commission" },
      { name: "Revenue Friendly Stores", href: "/stores/best/commission-rates" },
      { name: "Cheap App Distribution", href: "/stores/monetization/free-to-publish" },
      { name: "100% Revenue Share", href: "/stores/monetization/no-commission" },
      { name: "Developer First Stores", href: "/stores/best/commission-rates" },
    ],
  },
  {
    title: "Best For",
    links: [
      { name: "Best Commission Rates", href: "/stores/best/commission-rates" },
      { name: "Best Review Process", href: "/stores/best/review-process" },
      { name: "Most Stable Platforms", href: "/stores/best/stability" },
      { name: "Best Developer Support", href: "/stores/best/developer-support" },
      { name: "Best Discoverability", href: "/stores/best/discoverability" },
      { name: "Best Market Reach", href: "/stores/best/market-reach" },
      { name: "Easiest to Start", href: "/stores/best/low-barriers" },
      { name: "Best Technical Freedom", href: "/stores/best/technical-freedom" },
      { name: "Best Analytics", href: "/stores/best/analytics" },
      { name: "Fastest Approval", href: "/stores/best/review-process" },
    ],
  },
  {
    title: "For Developers",
    links: [
      { name: "Indie Developer Stores", href: "/stores/monetization/free-to-publish" },
      { name: "Startup App Stores", href: "/stores/best/low-barriers" },
      { name: "Solo Developer Friendly", href: "/stores/best/low-barriers" },
      { name: "Side Project Publishing", href: "/stores/monetization/free-to-publish" },
      { name: "Hobby Developer Stores", href: "/stores/monetization/free-to-publish" },
      { name: "First App Publishing", href: "/stores/best/low-barriers" },
      { name: "Enterprise Publishing", href: "/stores/category/enterprise" },
      { name: "Agency App Stores", href: "/stores/category/enterprise" },
      { name: "Game Developer Stores", href: "/stores/category/gaming" },
      { name: "SaaS App Stores", href: "/stores/features/subscriptions" },
    ],
  },
  {
    title: "App Types",
    links: [
      { name: "Game Distribution", href: "/stores/category/gaming" },
      { name: "Productivity Apps", href: "/stores/category/official" },
      { name: "Open Source Apps", href: "/stores/category/open-source" },
      { name: "Enterprise Software", href: "/stores/category/enterprise" },
      { name: "Mobile Games", href: "/stores/category/gaming" },
      { name: "Utility Apps", href: "/stores/platform/cross-platform" },
      { name: "Privacy Apps", href: "/stores/category/open-source" },
      { name: "Developer Tools", href: "/stores/category/ai-developer" },
      { name: "Business Apps", href: "/stores/category/enterprise" },
      { name: "FOSS Distribution", href: "/stores/category/open-source" },
    ],
  },
  {
    title: "Alternatives",
    links: [
      { name: "Google Play Alternatives", href: "/stores/platform/android" },
      { name: "App Store Alternatives", href: "/stores/platform/ios" },
      { name: "Steam Alternatives", href: "/stores/category/gaming" },
      { name: "Microsoft Store Alternatives", href: "/stores/platform/windows" },
      { name: "Mac App Store Alternatives", href: "/stores/platform/macos" },
      { name: "Samsung Galaxy Store", href: "/stores/category/manufacturer" },
      { name: "Huawei AppGallery", href: "/stores/category/manufacturer" },
      { name: "Amazon Appstore", href: "/stores/category/third-party" },
      { name: "F-Droid Apps", href: "/stores/category/open-source" },
      { name: "Epic Games Store", href: "/stores/category/gaming" },
    ],
  },
  {
    title: "Regions",
    links: [
      { name: "China App Stores", href: "/stores/category/regional" },
      { name: "Asia App Markets", href: "/stores/category/regional" },
      { name: "Global App Stores", href: "/stores/category/official" },
      { name: "European App Stores", href: "/stores/category/official" },
      { name: "Emerging Markets", href: "/stores/category/regional" },
      { name: "US App Stores", href: "/stores/category/official" },
      { name: "India App Stores", href: "/stores/category/regional" },
      { name: "Russia App Stores", href: "/stores/category/regional" },
      { name: "Japan App Stores", href: "/stores/category/regional" },
      { name: "Korea App Stores", href: "/stores/category/regional" },
    ],
  },
];

// Flattened list for total count
export const allSeoLinks = seoLandingPages.flatMap((cat) => cat.links);

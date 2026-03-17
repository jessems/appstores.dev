export interface GlossaryTerm {
  slug: string;
  term: string;
  definition: string;
  longDescription: string;
  relatedTerms: string[];
  seeAlso?: { label: string; href: string }[];
}

export const glossaryTerms: GlossaryTerm[] = [
  {
    slug: "commission-rate",
    term: "Commission Rate",
    definition:
      "The percentage of each sale that an app store takes as a fee for hosting and distributing your app.",
    longDescription: `Commission rates are the primary way app stores monetize their platforms. When a user purchases your app or makes an in-app purchase, the store takes a percentage (typically 15-30%) and passes the remainder to you.

Most major stores charge 30% as their standard rate, though many have introduced reduced commission programs. Apple and Google both offer 15% rates for developers earning under $1M/year. Some stores like F-Droid and itch.io charge 0%, relying on donations or optional revenue sharing instead.

Commission rates apply to all transactions processed through the store's payment system, including one-time purchases, subscriptions, and in-app purchases. Some stores allow external payment links, which can bypass their commission entirely.`,
    relatedTerms: [
      "reduced-commission-program",
      "in-app-purchase",
      "subscription-billing",
      "revenue-share",
    ],
    seeAlso: [
      { label: "Best stores for commission rates", href: "/stores/best/commission-rates" },
      { label: "Low commission stores", href: "/stores/monetization/low-commission" },
      { label: "No commission stores", href: "/stores/monetization/no-commission" },
    ],
  },
  {
    slug: "reduced-commission-program",
    term: "Reduced Commission Program",
    definition:
      "A program offered by app stores that lowers the standard commission rate for qualifying developers, typically small businesses or those earning below a revenue threshold.",
    longDescription: `Reduced commission programs were introduced by major app stores starting in 2020, primarily in response to developer complaints about the standard 30% commission rate.

Apple's App Store Small Business Program (launched Nov 2020) reduces the commission from 30% to 15% for developers earning less than $1M per calendar year. Google Play followed with a similar program in 2021. Both programs reset annually — if you exceed the threshold one year, you revert to 30%.

Some stores take this further. Epic Games Store charges only 12% for all developers regardless of revenue. The Microsoft Store charges 12% for games and 15% for non-game apps. These flat lower rates have become a competitive differentiator in attracting developers.`,
    relatedTerms: ["commission-rate", "revenue-share", "app-store-fees"],
    seeAlso: [
      { label: "Low commission stores", href: "/stores/monetization/low-commission" },
    ],
  },
  {
    slug: "app-review-process",
    term: "App Review Process",
    definition:
      "The evaluation procedure an app store uses to check submitted apps for quality, security, and policy compliance before making them available to users.",
    longDescription: `The app review process varies significantly between stores. Apple's App Store is known for having one of the most rigorous review processes, with human reviewers checking every submission against detailed guidelines. Reviews typically take 1-3 days but can be longer for new apps or significant updates.

Google Play uses a combination of automated scanning and human review. Initial automated checks happen quickly, while more detailed human reviews may take 1-7 days. Some updates to existing apps can go live in hours.

Some stores like F-Droid take a different approach — they build apps from source code, which can take days or weeks but ensures users get exactly what the source code describes. Enterprise and specialty stores may have domain-specific review criteria (e.g., HIPAA compliance for healthcare apps).

Common rejection reasons include crashes, broken links, placeholder content, misleading descriptions, privacy policy issues, and guideline violations.`,
    relatedTerms: [
      "app-rejection",
      "app-guidelines",
      "automated-review",
      "human-review",
    ],
    seeAlso: [
      { label: "Best stores for review process", href: "/stores/best/review-process" },
    ],
  },
  {
    slug: "in-app-purchase",
    term: "In-App Purchase (IAP)",
    definition:
      "A transaction made within an app to buy digital content, features, or subscriptions, typically processed through the app store's payment system.",
    longDescription: `In-app purchases (IAPs) are the dominant monetization method for mobile apps. They include consumables (gems, coins), non-consumables (premium features, ad removal), and auto-renewable subscriptions.

Most app stores require IAPs for digital goods to go through their payment system, which means the store's commission applies. Physical goods and services (like Uber rides or Amazon products) are generally exempt and can use third-party payment processors.

The EU's Digital Markets Act (2024) and US court rulings have begun requiring some stores to allow alternative payment methods for digital goods, potentially reducing the commission developers pay. South Korea was the first country to mandate this with its Telecommunications Business Act amendment in 2021.

IAPs typically account for 60-70% of all app store revenue globally, making them far more significant than paid app downloads.`,
    relatedTerms: [
      "commission-rate",
      "subscription-billing",
      "consumable-purchase",
      "digital-goods",
    ],
    seeAlso: [
      { label: "Stores with IAP support", href: "/stores/features/in-app-purchases" },
    ],
  },
  {
    slug: "subscription-billing",
    term: "Subscription Billing",
    definition:
      "A recurring payment model where users pay periodically (weekly, monthly, or annually) for continued access to an app or its features.",
    longDescription: `Subscription billing has become the preferred monetization model for many apps. It provides predictable recurring revenue and encourages ongoing engagement. Most major app stores support auto-renewable subscriptions with built-in billing management.

Key considerations for subscription billing through app stores:
- **Commission reduction over time:** Apple reduces commission to 15% after a subscriber's first year. Google offers 15% from day one for subscriptions.
- **Grace periods:** Most stores offer grace periods for failed payments before canceling a subscription.
- **Upgrade/downgrade flows:** Stores handle proration when users change subscription tiers.
- **Family sharing:** Some stores allow subscriptions to be shared within a family group.

The subscription model works best for apps that provide ongoing value — content apps (news, streaming), productivity tools, fitness apps, and SaaS products. One-time purchases may be better for utility apps or games.`,
    relatedTerms: [
      "in-app-purchase",
      "commission-rate",
      "auto-renewable-subscription",
      "revenue-share",
    ],
    seeAlso: [
      { label: "Stores with subscription support", href: "/stores/features/subscriptions" },
    ],
  },
  {
    slug: "app-store-optimization",
    term: "App Store Optimization (ASO)",
    definition:
      "The process of improving an app's visibility and conversion rate within an app store's search results and browse sections.",
    longDescription: `App Store Optimization (ASO) is the app equivalent of SEO for websites. It involves optimizing your app's listing to rank higher in store search results and convert more visitors into downloads.

Key ASO factors:
- **Title and subtitle:** Include relevant keywords naturally. Most stores weigh the title heavily in search ranking.
- **Keywords:** Apple allows a dedicated keyword field (100 characters). Google Play indexes your full description.
- **Description:** Write for both humans (conversion) and algorithms (keywords). The first 2-3 lines are visible without expansion.
- **Screenshots and video:** High-quality visuals dramatically impact conversion rates. Show your app's value proposition in the first screenshot.
- **Ratings and reviews:** Higher ratings improve both search ranking and conversion. Responding to reviews signals active development.
- **Download velocity:** Recent download trends influence ranking. Launch promotions and external marketing help initial momentum.
- **Update frequency:** Regular updates signal active maintenance, which some stores factor into ranking.

Different stores weigh these factors differently. Google Play is more keyword-driven (similar to web SEO), while Apple's App Store puts more weight on the dedicated keyword field and engagement metrics.`,
    relatedTerms: [
      "keyword-optimization",
      "conversion-rate",
      "app-listing",
      "featured-placement",
    ],
    seeAlso: [
      { label: "Best stores for discoverability", href: "/stores/best/discoverability" },
    ],
  },
  {
    slug: "sideloading",
    term: "Sideloading",
    definition:
      "Installing an app on a device from a source other than the device's official app store, typically by downloading an APK (Android) or IPA (iOS) file directly.",
    longDescription: `Sideloading allows users to install apps without going through an official app store. On Android, this has always been possible by enabling "Install from unknown sources" in settings. On iOS, sideloading has historically been restricted to developer accounts and enterprise certificates, though the EU's Digital Markets Act is forcing Apple to allow it in the EU starting 2024.

For developers, sideloading is relevant because:
- **Alternative distribution:** You can distribute your app directly from your website, avoiding store commissions entirely.
- **Beta testing:** Many developers distribute beta builds via sideloading before submitting to stores.
- **Regional access:** In markets where certain stores are unavailable, sideloading may be the primary installation method.
- **Open source:** Projects like F-Droid encourage sideloading as a privacy-respecting alternative to Google Play.

Risks include reduced security (no store review), harder update distribution, and potential user trust issues.`,
    relatedTerms: [
      "apk",
      "alternative-app-store",
      "direct-distribution",
      "digital-markets-act",
    ],
    seeAlso: [
      { label: "Open source stores", href: "/stores/category/open-source" },
      { label: "Third-party stores", href: "/stores/category/third-party" },
    ],
  },
  {
    slug: "app-store-fees",
    term: "App Store Fees",
    definition:
      "The various costs associated with publishing and selling apps on an app store, including registration fees, commission rates, and transaction charges.",
    longDescription: `App store fees typically consist of several components:

**Registration/Developer Account Fee:**
- Apple: $99/year (individual) or $299/year (organization)
- Google Play: $25 one-time
- Many stores: Free

**Commission on Sales:**
- Standard: 30% (Apple, Google, Steam)
- Reduced programs: 15% (small developers)
- Competitive: 12% (Epic Games Store)
- Zero: F-Droid, itch.io (optional)

**Transaction Fees:**
Some stores charge additional payment processing fees on top of commission. Others include payment processing in their commission rate.

**Additional Costs:**
- Extended validation certificates (some enterprise stores)
- Premium placement/advertising within the store
- Testing device requirements

When calculating the true cost of an app store, consider both the direct fees and indirect costs like review time, compliance requirements, and the opportunity cost of store-specific development work.`,
    relatedTerms: [
      "commission-rate",
      "registration-fee",
      "reduced-commission-program",
      "revenue-share",
    ],
    seeAlso: [
      { label: "Free to publish stores", href: "/stores/monetization/free-to-publish" },
      { label: "Fee breakdown by store", href: "/stores" },
    ],
  },
  {
    slug: "developer-sdk",
    term: "Developer SDK",
    definition:
      "A Software Development Kit provided by an app store that includes tools, libraries, and documentation for building, testing, and integrating apps with the store's platform.",
    longDescription: `Developer SDKs are toolkits provided by app stores to help developers build apps that integrate with the store's services. These typically include:

- **Payment SDK:** Handle in-app purchases, subscriptions, and refunds
- **Analytics SDK:** Track installs, engagement, crashes, and revenue
- **Push notifications:** Send targeted messages to users
- **Authentication:** Handle user sign-in via the store's account system
- **Review prompts:** Request app ratings at appropriate times
- **Cloud services:** Storage, databases, and serverless functions

The quality and capabilities of an SDK can significantly impact development time and app quality. Well-documented SDKs with good sample code reduce integration effort. Poorly maintained SDKs with breaking changes create ongoing maintenance burden.

Some stores provide minimal SDKs (just payment processing) while others offer comprehensive development platforms (like Apple's ecosystem with Xcode, SwiftUI, CloudKit, etc.).`,
    relatedTerms: [
      "developer-api",
      "development-tools",
      "app-integration",
      "payment-processing",
    ],
    seeAlso: [
      { label: "Stores with SDK support", href: "/stores/features/sdk" },
      { label: "Stores with API support", href: "/stores/features/api" },
    ],
  },
  {
    slug: "app-rejection",
    term: "App Rejection",
    definition:
      "When an app store declines to publish or update an app because it doesn't meet the store's guidelines, policies, or technical requirements.",
    longDescription: `App rejection is a common part of the app distribution process. Understanding common rejection reasons helps you avoid delays:

**Most Common Reasons:**
1. **Bugs and crashes:** Apps must be stable and functional.
2. **Incomplete information:** Missing privacy policy, placeholder content, or broken links.
3. **Guideline violations:** Content restrictions, age rating issues, or prohibited business models.
4. **Privacy issues:** Collecting data without disclosure, missing consent flows.
5. **Metadata problems:** Misleading descriptions, keyword stuffing, inappropriate screenshots.
6. **Performance:** Excessive battery drain, large download size without justification.

**What to Do After Rejection:**
- Read the rejection reason carefully — stores usually cite specific guideline sections.
- Fix the issue and resubmit. Don't argue unless you genuinely believe the reviewer made an error.
- Use the appeals process for genuine disputes.
- Some stores offer pre-submission review or developer support calls.

**Prevention:**
- Read the store's guidelines thoroughly before submitting.
- Test on multiple devices and OS versions.
- Use the store's pre-submission validation tools.
- Keep a rejection log to avoid repeating mistakes.`,
    relatedTerms: [
      "app-review-process",
      "app-guidelines",
      "appeals-process",
      "resubmission",
    ],
    seeAlso: [
      { label: "Best stores for review process", href: "/stores/best/review-process" },
      { label: "Low-barrier stores", href: "/stores/best/low-barriers" },
    ],
  },
  {
    slug: "revenue-share",
    term: "Revenue Share",
    definition:
      "The split of revenue between the app developer and the app store, typically expressed as a percentage kept by each party.",
    longDescription: `Revenue share is the fundamental business model of most app stores. The standard split has been 70/30 (developer/store) since Apple established it in 2008, but this is changing:

**Current Revenue Shares (Developer/Store):**
- Apple App Store: 70/30 (85/15 for small business + year 2+ subscriptions)
- Google Play: 70/30 (85/15 for small business + all subscriptions)
- Epic Games Store: 88/12
- Steam: 70/30 (75/25 after $10M, 80/20 after $50M)
- itch.io: Up to 100/0 (developer chooses)
- F-Droid: 100/0

**Trends:**
The industry is moving toward more developer-friendly splits. The Epic Games Store's 88/12 split, combined with its aggressive game exclusivity deals, pressured other stores to reconsider. Government regulation (EU DMA, South Korea) is further reshaping the landscape.

**Beyond Commission:**
When evaluating revenue share, also consider:
- Payment processing fees (sometimes separate from commission)
- Currency conversion costs
- Tax withholding and reporting
- Refund policies (who absorbs the cost?)
- Promotional pricing requirements`,
    relatedTerms: [
      "commission-rate",
      "reduced-commission-program",
      "app-store-fees",
      "payment-processing",
    ],
    seeAlso: [
      { label: "Commission rate rankings", href: "/stores/best/commission-rates" },
    ],
  },
  {
    slug: "beta-testing",
    term: "Beta Testing",
    definition:
      "A pre-release testing phase where a limited group of users can try an app before its public launch, helping developers identify bugs and gather feedback.",
    longDescription: `Beta testing through app stores allows developers to distribute pre-release versions to a controlled group of testers. Major platforms offer different beta testing capabilities:

**Apple TestFlight:**
- Up to 10,000 external testers
- Internal testing for team members
- Automatic crash reporting
- 90-day build expiration
- Requires Apple Developer account

**Google Play Internal/Closed/Open Testing:**
- Internal testing: Up to 100 testers, instant rollout
- Closed testing: Invite-only, requires review
- Open testing: Anyone can join, appears in Play Store
- Staged rollouts for production releases

**Other Stores:**
- Steam has built-in beta branch support
- itch.io allows restricted access keys
- Some stores have no beta testing infrastructure

**Best Practices:**
- Start with internal testing (team/friends)
- Expand to closed beta with target users
- Use open beta for load testing and wider feedback
- Collect structured feedback (surveys, in-app forms)
- Monitor crash rates and performance metrics
- Set clear beta timelines and feedback channels`,
    relatedTerms: [
      "testflight",
      "staged-rollout",
      "quality-assurance",
      "crash-reporting",
    ],
    seeAlso: [
      { label: "Stores with beta testing", href: "/stores/features/beta-testing" },
    ],
  },
  {
    slug: "digital-markets-act",
    term: "Digital Markets Act (DMA)",
    definition:
      "EU legislation that regulates large digital platforms (gatekeepers), requiring them to allow alternative app stores, sideloading, and third-party payment systems.",
    longDescription: `The Digital Markets Act (DMA) is a landmark EU regulation that took effect in March 2024. It designates certain large platforms as "gatekeepers" and imposes obligations to ensure fair competition:

**Key Requirements for App Stores:**
- Allow sideloading (installing apps from outside the store)
- Allow alternative app stores on their platforms
- Allow developers to use third-party payment processors
- Allow developers to link to external offers
- Provide equal access to platform features for third-party apps
- Allow users to easily change default apps

**Impact on Developers:**
- More distribution options (alternative stores, direct distribution)
- Potentially lower fees through third-party payment processors
- Greater freedom in communicating with users about pricing
- But: fragmented distribution may complicate support and updates

**Designated Gatekeepers (2024):**
Apple (App Store, Safari, iOS), Google (Play Store, Chrome, Android, Maps, Shopping), Meta (Facebook, Instagram, WhatsApp, Messenger), Amazon (Marketplace), Microsoft (Windows, LinkedIn), ByteDance (TikTok)

The DMA represents the most significant regulatory change to app distribution since the App Store launched in 2008.`,
    relatedTerms: [
      "sideloading",
      "gatekeeper",
      "alternative-payment",
      "antitrust",
    ],
  },
  {
    slug: "featured-placement",
    term: "Featured Placement",
    definition:
      "When an app store prominently displays an app in curated collections, editorial features, or high-visibility sections, significantly boosting its visibility and downloads.",
    longDescription: `Being featured by an app store is one of the most impactful things that can happen to your app. A feature on Apple's App Store or Google Play can increase downloads by 5-10x or more during the featured period.

**How to Get Featured:**
1. **Build a great app:** Quality, design, and user experience are the baseline requirements.
2. **Use latest platform features:** Stores love showcasing apps that use their newest APIs and capabilities.
3. **Optimize your listing:** High-quality screenshots, compelling description, and proper localization.
4. **Time your updates:** Align releases with new OS versions or seasonal events.
5. **Apply directly:** Both Apple and Google have nomination forms for app features.
6. **Be responsive:** Address user feedback and maintain high ratings.

**Types of Features:**
- **App of the Day/Week:** Highest visibility, editorial pick
- **Collection features:** Themed groups (e.g., "Best Productivity Apps")
- **Search features:** Promoted in relevant search results
- **Seasonal features:** Holiday, back-to-school, etc.
- **New and noteworthy:** For recently launched apps

Not all stores have curation programs. Smaller stores may offer more accessible featuring opportunities.`,
    relatedTerms: [
      "app-store-optimization",
      "editorial-curation",
      "discoverability",
      "download-velocity",
    ],
    seeAlso: [
      { label: "Best stores for discoverability", href: "/stores/best/discoverability" },
    ],
  },
  {
    slug: "apk",
    term: "APK (Android Package Kit)",
    definition:
      "The file format used to distribute and install apps on Android devices. APK files contain the compiled code, resources, and metadata needed to run an app.",
    longDescription: `APK (Android Package Kit) is the traditional file format for Android app distribution. While Google is transitioning to the AAB (Android App Bundle) format for Play Store submissions, APKs remain widely used for:

- Sideloading apps directly
- Distribution through third-party stores (F-Droid, APKPure, etc.)
- Enterprise app distribution
- Development testing

**APK vs AAB:**
- **APK:** Single file containing all code and resources. Universal compatibility. Larger file size.
- **AAB:** Google's newer format. Generates optimized APKs for each device configuration. Smaller downloads. Required for Google Play since 2021.

**APK Structure:**
- \`AndroidManifest.xml\`: App metadata, permissions, components
- \`classes.dex\`: Compiled Java/Kotlin code
- \`res/\`: Resources (layouts, images, strings)
- \`lib/\`: Native libraries (if any)
- \`META-INF/\`: Signing certificates

Third-party stores that accept APKs (rather than AABs) give developers more control over distribution but may result in larger download sizes for users.`,
    relatedTerms: [
      "aab",
      "sideloading",
      "android-app-bundle",
      "app-signing",
    ],
    seeAlso: [
      { label: "Android app stores", href: "/stores/platform/android" },
    ],
  },
  {
    slug: "app-analytics",
    term: "App Analytics",
    definition:
      "Data and metrics provided by app stores about your app's performance, including downloads, revenue, user engagement, and retention.",
    longDescription: `App analytics help developers understand how their app is performing and make data-driven decisions. Most app stores provide some level of built-in analytics:

**Common Metrics:**
- **Downloads/Installs:** New installs over time, by country and source
- **Active users:** DAU (daily), WAU (weekly), MAU (monthly)
- **Revenue:** Gross revenue, net revenue (after commission), by product
- **Retention:** Day 1, 7, 30 retention rates
- **Crashes:** Crash-free rate, top crash reports
- **Ratings and reviews:** Average rating trends, new reviews
- **Conversion:** Store listing views to install conversion rate

**Platform-Specific Tools:**
- **App Store Connect Analytics:** Detailed acquisition, engagement, and financial data
- **Google Play Console:** Vitals, acquisition reports, revenue analytics
- **Steam:** Wishlists, traffic sources, concurrent users
- **Third-party:** Firebase, Amplitude, Mixpanel for deeper analysis

**Key Insights to Track:**
1. Where your installs come from (search, browse, referral)
2. Which keywords drive the most installs
3. How store listing changes affect conversion rates
4. Correlation between ratings and download trends
5. Revenue per user by acquisition source`,
    relatedTerms: [
      "app-store-optimization",
      "conversion-rate",
      "retention-rate",
      "crash-reporting",
    ],
    seeAlso: [
      { label: "Best stores for analytics", href: "/stores/best/analytics" },
      { label: "Stores with analytics", href: "/stores/features/analytics" },
    ],
  },
];

export function getGlossaryTermBySlug(
  slug: string
): GlossaryTerm | undefined {
  return glossaryTerms.find((t) => t.slug === slug);
}

export function getAllGlossarySlugs(): string[] {
  return glossaryTerms.map((t) => t.slug);
}

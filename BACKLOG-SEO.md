# Programmatic SEO Backlog

This document outlines programmatic SEO opportunities for appstores.dev, prioritized by impact and implementation effort.

---

## Overview

**Current State**: ~13 pages (home, /stores, 11 store detail pages)
**Potential State**: ~150+ pages programmatically generated from existing data

**Data Assets Available**:
- 11 app stores with comprehensive structured data
- 8 categories
- 7 platforms
- 9 rating dimensions per store
- Rich fee/commission data
- Submission process details
- Geographic availability data

---

## Priority 1: High Impact, Low Effort

### 1.1 Comparison Pages
**Route**: `/compare/[store1]-vs-[store2]`
**Example URLs**:
- `/compare/google-play-vs-apple-app-store`
- `/compare/steam-vs-epic-games-store`
- `/compare/f-droid-vs-aptoide`

**Page Count**: 55 (all unique store pairs)

**Template Sections**:
- [ ] Side-by-side overview table
- [ ] Commission comparison
- [ ] Fee structure comparison
- [ ] Review process comparison
- [ ] Platform support comparison
- [ ] Rating comparison (spider/radar chart)
- [ ] Pros/cons for each
- [ ] "Which should you choose?" recommendation logic

**Data Sources**: All fields from both `AppStore` objects

**Target Keywords**: "{store1} vs {store2}", "{store1} or {store2}", "compare {store1} {store2}"

**Implementation**:
- [ ] Create `/app/compare/[slug]/page.tsx`
- [ ] Create `generateStaticParams()` for all pairs
- [ ] Create comparison utility functions in `src/lib/compare.ts`
- [ ] Design comparison table component
- [ ] Add `generateMetadata()` with dynamic titles/descriptions
- [ ] Add JSON-LD `Product` comparison schema

---

### 1.2 Category Landing Pages
**Route**: `/category/[slug]`
**Example URLs**:
- `/category/official` → "Official Platform App Stores"
- `/category/gaming` → "Gaming App Stores & Marketplaces"
- `/category/open-source` → "Open Source App Stores"
- `/category/third-party` → "Third-Party App Stores"
- `/category/manufacturer` → "Device Manufacturer App Stores"
- `/category/enterprise` → "Enterprise App Distribution"
- `/category/regional` → "Regional App Stores"
- `/category/specialty` → "Specialty App Stores"

**Page Count**: 8

**Template Sections**:
- [ ] Category hero with description
- [ ] Store grid (filtered by category)
- [ ] Category-specific insights (avg commission, etc.)
- [ ] Comparison table of stores in category
- [ ] FAQ section (category-specific)
- [ ] Related categories

**Data Sources**: `src/data/categories.ts`, filtered stores

**Target Keywords**: "{category} app stores", "best {category} app stores"

**Implementation**:
- [ ] Create `/app/category/[slug]/page.tsx`
- [ ] Extend category data with SEO fields (metaTitle, metaDescription, longDescription)
- [ ] Create `getStoresByCategory()` if not exists
- [ ] Add `generateStaticParams()` from categories
- [ ] Add JSON-LD `ItemList` schema

---

### 1.3 Platform Landing Pages
**Route**: `/platform/[platform]`
**Example URLs**:
- `/platform/android` → "Android App Stores for Developers"
- `/platform/ios` → "iOS App Distribution Platforms"
- `/platform/windows` → "Windows App Stores"
- `/platform/macos` → "macOS App Distribution"
- `/platform/linux` → "Linux App Stores"
- `/platform/web` → "Web App Stores & PWA Distribution"

**Page Count**: 7

**Template Sections**:
- [ ] Platform hero with icon and description
- [ ] Store grid (filtered by platform)
- [ ] Platform market insights
- [ ] Commission comparison for platform
- [ ] Platform-specific publishing tips
- [ ] Cross-platform alternatives

**Data Sources**: `src/data/platforms.ts`, filtered stores

**Target Keywords**: "{platform} app stores", "publish app on {platform}", "best {platform} app stores"

**Implementation**:
- [ ] Create `/app/platform/[platform]/page.tsx`
- [ ] Extend platform data with SEO fields
- [ ] Add `generateStaticParams()` from platforms
- [ ] Add JSON-LD `ItemList` schema

---

### 1.4 Structured Data (JSON-LD)
**No new routes** — enhance existing pages

**Store Detail Pages**:
- [ ] `SoftwareApplication` schema
- [ ] `AggregateRating` from ratings data
- [ ] `Offer` for fee information
- [ ] `Organization` for company data
- [ ] `BreadcrumbList` navigation

**Listing Pages**:
- [ ] `ItemList` schema
- [ ] `WebSite` with `SearchAction` for site search

**Implementation**:
- [ ] Create `src/components/seo/JsonLd.tsx` component
- [ ] Create schema generator utilities in `src/lib/schema.ts`
- [ ] Add to store detail pages
- [ ] Add to listing pages
- [ ] Validate with Google Rich Results Test

---

### 1.5 Dynamic Sitemap
**Route**: `/sitemap.xml`

**Include**:
- [ ] All store detail pages
- [ ] All category pages
- [ ] All platform pages
- [ ] All comparison pages
- [ ] Homepage and /stores
- [ ] Priority and changefreq attributes
- [ ] lastmod from store metadata

**Implementation**:
- [ ] Create `/app/sitemap.ts` (Next.js metadata API)
- [ ] Generate entries from all data sources
- [ ] Add image sitemap for logos
- [ ] Submit to Google Search Console

---

## Priority 2: High Impact, Medium Effort

### 2.1 Feature/Attribute Pages ("Best of" Pages)
**Route**: `/best/[feature]`
**Example URLs**:
- `/best/lowest-commission` → "App Stores with Lowest Commission Rates"
- `/best/fastest-review` → "App Stores with Fastest Review Times"
- `/best/free-to-publish` → "Free App Stores (No Registration Fee)"
- `/best/api-support` → "App Stores with Developer APIs"
- `/best/beta-testing` → "App Stores with Beta Testing Features"
- `/best/subscription-support` → "App Stores Supporting Subscriptions"
- `/best/indie-friendly` → "Best App Stores for Indie Developers"
- `/best/analytics` → "App Stores with Best Analytics"

**Page Count**: ~15

**Template Sections**:
- [ ] Feature explanation
- [ ] Ranked/sorted store list
- [ ] Comparison table for this feature
- [ ] Why this feature matters
- [ ] Related features

**Sorting/Filtering Logic**:
```typescript
// Examples
lowestCommission: sort by min(commissionTiers[].percentage)
fastestReview: sort by typicalReviewTime (parse to days)
freeToPublish: filter where registrationFee.amount === 0
apiSupport: filter where hasApi === true
indiFriendly: composite score (low fees + good ratings)
```

**Target Keywords**: "app stores with lowest commission", "free app publishing", "app stores with API"

**Implementation**:
- [ ] Define feature configurations in `src/data/features.ts`
- [ ] Create sorting/filtering functions in `src/lib/stores.ts`
- [ ] Create `/app/best/[feature]/page.tsx`
- [ ] Add `generateStaticParams()` from feature configs
- [ ] Design ranked list component

---

### 2.2 Publishing Guide Pages
**Route**: `/guides/publish-on-[store]`
**Example URLs**:
- `/guides/publish-on-google-play`
- `/guides/publish-on-apple-app-store`
- `/guides/publish-on-steam`

**Page Count**: 11

**Template Sections**:
- [ ] Overview and requirements
- [ ] Registration process and fees
- [ ] App submission steps
- [ ] Review process and timeline
- [ ] Common rejection reasons
- [ ] Appeals process
- [ ] Tips for approval
- [ ] Related guides

**Data Sources**: `submission.*`, `fees.*`, `technical.*`

**Target Keywords**: "how to publish on {store}", "submit app to {store}", "{store} developer guide"

**Implementation**:
- [ ] Create `/app/guides/publish-on-[slug]/page.tsx`
- [ ] Design guide template component
- [ ] Add `HowTo` JSON-LD schema
- [ ] Add step-by-step structured content
- [ ] Link from store detail pages

---

### 2.3 Fee Breakdown Pages
**Route**: `/fees/[store]`
**Example URLs**:
- `/fees/google-play` → "Google Play Store Fees & Commission (2025)"
- `/fees/apple-app-store` → "Apple App Store Fees & Commission (2025)"

**Page Count**: 11

**Template Sections**:
- [ ] Fee overview summary
- [ ] Registration fee details
- [ ] Commission tier breakdown (visual)
- [ ] Reduced commission programs
- [ ] Payment/payout information
- [ ] Fee comparison with alternatives
- [ ] Calculator tool (optional)
- [ ] Historical fee changes (optional)

**Data Sources**: `fees.*`, `monetization.*`

**Target Keywords**: "{store} commission", "{store} fees", "{store} developer fee"

**Implementation**:
- [ ] Create `/app/fees/[slug]/page.tsx`
- [ ] Design commission tier visualization
- [ ] Add `Offer` JSON-LD schema
- [ ] Link from store detail pages

---

### 2.4 Category × Platform Matrix Pages
**Route**: `/stores/[category]/[platform]`
**Example URLs**:
- `/stores/gaming/windows` → Steam, Epic, Microsoft Store
- `/stores/official/android` → Google Play
- `/stores/third-party/android` → Amazon, Aptoide, F-Droid

**Page Count**: ~25 (only create for combinations with 2+ stores)

**Template Sections**:
- [ ] Combined category + platform description
- [ ] Filtered store grid
- [ ] Comparison of stores in this niche
- [ ] Recommendations by use case

**Implementation**:
- [ ] Create `/app/stores/[category]/[platform]/page.tsx`
- [ ] Generate valid combinations programmatically
- [ ] Skip combinations with 0-1 stores
- [ ] Add cross-links between related pages

---

## Priority 3: Medium Impact, Medium Effort

### 3.1 Regional/Geographic Pages
**Route**: `/region/[region]`
**Example URLs**:
- `/region/global` → "Globally Available App Stores"
- `/region/china-alternatives` → "App Stores for China Market"
- `/region/europe` → "App Stores Available in Europe"

**Page Count**: ~5-10

**Data Sources**: `geographic.availableRegions[]`, `geographic.restrictedRegions[]`

**Implementation**:
- [ ] Define region configurations
- [ ] Create filtering logic for geographic data
- [ ] Create `/app/region/[region]/page.tsx`

---

### 3.2 FAQ Pages (Per Store)
**Route**: `/faq/[store]`
**Example URLs**:
- `/faq/google-play`
- `/faq/apple-app-store`

**Page Count**: 11

**Content Generation**:
Generate FAQs from structured data:
- "What is the {store} commission rate?" → from `fees.commissionTiers`
- "How long does {store} review take?" → from `submission.typicalReviewTime`
- "Does {store} support subscriptions?" → from `technical.supportsSubscriptions`
- "What are common {store} rejection reasons?" → from `submission.commonRejectionReasons`

**Implementation**:
- [ ] Create FAQ generation utility
- [ ] Create `/app/faq/[slug]/page.tsx`
- [ ] Add `FAQPage` JSON-LD schema
- [ ] Link from store detail pages

---

### 3.3 Glossary Pages
**Route**: `/glossary/[term]`
**Example URLs**:
- `/glossary/commission-rate`
- `/glossary/app-review-process`
- `/glossary/in-app-purchases`
- `/glossary/reduced-commission-program`

**Page Count**: ~20

**Implementation**:
- [ ] Create glossary term definitions in `src/data/glossary.ts`
- [ ] Create `/app/glossary/[term]/page.tsx`
- [ ] Add `DefinedTerm` JSON-LD schema
- [ ] Create glossary index page
- [ ] Auto-link terms from other content

---

### 3.4 Annual/Dated Content
**Route**: `/[year]/[topic]`
**Example URLs**:
- `/2025/best-app-stores`
- `/2025/app-store-commission-rates`
- `/2025/app-store-comparison`

**Page Count**: ~5 per year

**Implementation**:
- [ ] Create year-based routing
- [ ] Add "last updated" prominently
- [ ] Redirect old years to current (or keep for history)
- [ ] Update annually via content refresh

---

## Priority 4: Nice to Have

### 4.1 Store Alternatives Pages
**Route**: `/alternatives/[store]`
**Example**: `/alternatives/google-play` → "Google Play Store Alternatives"

**Page Count**: 11

---

### 4.2 Use Case Pages
**Route**: `/for/[use-case]`
**Examples**:
- `/for/indie-developers`
- `/for/game-developers`
- `/for/enterprise`

**Page Count**: ~10

---

### 4.3 Versus Hub Page
**Route**: `/compare`
**Description**: Landing page listing all comparisons, organized by category

---

### 4.4 Statistics/Data Pages
**Route**: `/stats`
**Examples**:
- `/stats/total-apps` → Combined app counts across all stores
- `/stats/commission-trends` → Commission rate analysis

---

## Technical Debt & Infrastructure

### T1. Robots.txt
- [ ] Create `/app/robots.ts`
- [ ] Allow all crawlers
- [ ] Reference sitemap

### T2. Canonical URLs
- [ ] Add canonical tags to all pages
- [ ] Handle query parameter variations

### T3. Internal Linking Improvements
- [ ] Auto-link between related content
- [ ] Add "Related Guides" sections
- [ ] Add "See Also" sidebars
- [ ] Breadcrumb navigation on all pages

### T4. Meta Tags Audit
- [ ] Ensure unique titles for all pages
- [ ] Ensure unique descriptions for all pages
- [ ] Add Open Graph images per page type
- [ ] Add Twitter card images

### T5. Performance
- [ ] Ensure all new pages are statically generated
- [ ] Optimize images (logos, screenshots)
- [ ] Add loading states for client components

---

## Implementation Order Recommendation

**Phase 1 (Foundation)**:
1. Sitemap.xml
2. Robots.txt
3. JSON-LD structured data on existing pages
4. Category landing pages
5. Platform landing pages

**Phase 2 (High-Value Pages)**:
6. Comparison pages (start with top 10 pairs)
7. Fee breakdown pages
8. Publishing guide pages

**Phase 3 (Expansion)**:
9. "Best of" feature pages
10. Category × Platform matrix
11. FAQ pages
12. Remaining comparison pages

**Phase 4 (Long-Tail)**:
13. Regional pages
14. Glossary
15. Annual content
16. Alternatives pages

---

## Metrics to Track

- Indexed pages in Google Search Console
- Organic impressions and clicks per page type
- Average position for target keywords
- Click-through rate by page template
- Pages with zero clicks (identify and improve)

---

## Notes

- All pages should be statically generated at build time
- Use `generateStaticParams()` for all dynamic routes
- Use `generateMetadata()` for dynamic meta tags
- Maintain consistent internal linking structure
- Update sitemap when adding new page types

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

appstores.dev is a Clutch-like searchable directory for app stores (Google Play, Apple App Store, etc.). Built with Next.js 14+ App Router, TypeScript, and Tailwind CSS.

## Commands

```bash
npm run dev          # Development server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run build:worker # Build for Cloudflare Workers (OpenNext)
npm run preview      # Build and run Cloudflare preview
npm run deploy       # Deploy to Cloudflare Workers
```

## Architecture

### Content System
- **Store data**: MDX files in `content/stores/` with YAML frontmatter
- **Parsing**: `gray-matter` extracts frontmatter, content is MDX
- **Data access**: `src/lib/stores.ts` provides all store data functions (`getAllStores`, `getStoreBySlug`, `getFeaturedStores`, etc.)

### Data Flow
1. MDX files define store data with comprehensive frontmatter schema (see `src/types/store.ts` for `AppStore` interface)
2. `src/lib/stores.ts` reads and parses MDX files at build/request time
3. `src/lib/search.ts` uses Fuse.js for client-side full-text search
4. Pages consume data via async functions (Server Components)

### Key Types
- `AppStore`: Full store data with all fields (basic info, company, metrics, fees, technical, submission, geographic, features, metadata)
- `StoreCardData`: Lightweight version for listing cards
- `Category`/`Platform`: Enums for filtering

### UI Components
- **shadcn/ui**: Base components in `src/components/ui/` (Button, Card, Badge, Input, Select, Dialog, Tabs, Separator)
- **Layout**: Header/Footer in `src/components/layout/`
- **Store-specific**: StoreCard, StoreGrid in `src/components/store/`
- **Search**: SearchBar, SearchFilters in `src/components/search/`
- **Home**: Hero, FeaturedStores, CategoryHighlights in `src/components/home/`

### Static Data
- `src/data/categories.ts`: Category definitions with icons
- `src/data/platforms.ts`: Platform definitions

### Routing
- `/` - Homepage with featured stores and categories
- `/stores` - Filterable/searchable listings (supports `?q=`, `?category=`, `?platform=`, `?sort=` params)
- `/stores/[slug]` - Store detail pages (statically generated via `generateStaticParams`)

## Adding New Stores

Create an MDX file in `content/stores/{slug}.mdx` following the frontmatter schema. Required fields: id, name, slug, tagline, description, url, logo, category, platforms, company, metrics, fees, technical, monetization, submission, geographic, features, metadata.

## Deployment

Uses OpenNext adapter for Cloudflare Workers. Configuration in `wrangler.jsonc` and `open-next.config.ts`.

import { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  BarChart3,
  TrendingUp,
  DollarSign,
  Globe,
  Layers,
  Clock,
  Star,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getAllStores } from "@/lib/stores";
import { categories } from "@/data/categories";
import { platforms } from "@/data/platforms";
import { AppStore } from "@/types/store";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "App Store Statistics & Data - Industry Overview 2026",
  description:
    "Comprehensive app store industry statistics: commission rates, registration fees, review times, platform distribution, and more across 149+ app stores.",
  alternates: { canonical: "/statistics" },
  openGraph: {
    title: "App Store Industry Statistics 2026",
    description:
      "Data-driven insights across 149+ app stores. Commission rates, fees, platforms, and trends.",
    url: "https://appstores.dev/statistics",
    type: "website",
  },
};

function median(arr: number[]): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

function computeStats(stores: AppStore[]) {
  // Commission stats
  const commissions = stores
    .filter((s) => s.fees?.commissionTiers?.[0]?.percentage != null)
    .map((s) => s.fees!.commissionTiers![0].percentage);

  const avgCommission =
    commissions.length > 0
      ? commissions.reduce((a, b) => a + b, 0) / commissions.length
      : 0;
  const medianCommission = commissions.length > 0 ? median(commissions) : 0;
  const minCommission = commissions.length > 0 ? Math.min(...commissions) : 0;
  const maxCommission = commissions.length > 0 ? Math.max(...commissions) : 0;

  // Registration fees
  const regFees = stores.filter(
    (s) => s.fees?.registrationFee?.amount != null
  );
  const freeRegistration = regFees.filter(
    (s) => s.fees!.registrationFee!.amount === 0
  ).length;
  const paidRegistration = regFees.filter(
    (s) => s.fees!.registrationFee!.amount > 0
  ).length;
  const paidFees = regFees
    .filter((s) => s.fees!.registrationFee!.amount > 0)
    .map((s) => s.fees!.registrationFee!.amount);
  const avgRegFee =
    paidFees.length > 0
      ? paidFees.reduce((a, b) => a + b, 0) / paidFees.length
      : 0;

  // Platform distribution
  const platformCounts: Record<string, number> = {};
  stores.forEach((s) => {
    s.platforms?.forEach((p) => {
      platformCounts[p] = (platformCounts[p] || 0) + 1;
    });
  });

  // Category distribution
  const categoryCounts: Record<string, number> = {};
  stores.forEach((s) => {
    categoryCounts[s.category] = (categoryCounts[s.category] || 0) + 1;
  });

  // Review types
  const withReview = stores.filter((s) => s.submission);
  const automatedOnly = withReview.filter(
    (s) => s.submission!.hasAutomatedReview && !s.submission!.hasHumanReview
  ).length;
  const humanOnly = withReview.filter(
    (s) => !s.submission!.hasAutomatedReview && s.submission!.hasHumanReview
  ).length;
  const bothReview = withReview.filter(
    (s) => s.submission!.hasAutomatedReview && s.submission!.hasHumanReview
  ).length;

  // Features
  const withApi = stores.filter((s) => s.technical?.hasApi).length;
  const withBeta = stores.filter((s) => s.features?.hasBetaTesting).length;
  const withAnalytics = stores.filter(
    (s) => s.features?.hasAnalyticsDashboard
  ).length;
  const withABTesting = stores.filter((s) => s.features?.hasABTesting).length;

  // Total apps
  const totalApps = stores
    .filter((s) => s.metrics?.appCount)
    .reduce((sum, s) => sum + s.metrics!.appCount!, 0);

  // Ratings averages
  const ratingKeys = [
    "commission",
    "reviewProcess",
    "stability",
    "developerSupport",
    "discoverability",
    "competitiveness",
    "entryBarriers",
    "technicalFreedom",
    "analytics",
  ] as const;

  const avgRatings: Record<string, number> = {};
  ratingKeys.forEach((key) => {
    const vals = stores
      .filter((s) => s.ratings?.[key] != null)
      .map((s) => s.ratings![key]!);
    avgRatings[key] = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  });

  // Reduced commission
  const withReduced = stores.filter((s) => s.fees?.hasReducedCommission).length;

  return {
    total: stores.length,
    avgCommission,
    medianCommission,
    minCommission,
    maxCommission,
    freeRegistration,
    paidRegistration,
    avgRegFee,
    platformCounts,
    categoryCounts,
    automatedOnly,
    humanOnly,
    bothReview,
    withApi,
    withBeta,
    withAnalytics,
    withABTesting,
    totalApps,
    avgRatings,
    withReduced,
    commissionCount: commissions.length,
  };
}

function StatCard({
  label,
  value,
  detail,
  icon,
}: {
  label: string;
  value: string;
  detail?: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</div>
          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm font-medium">{label}</p>
            {detail && (
              <p className="text-xs text-muted-foreground mt-1">{detail}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function BarRow({
  label,
  count,
  max,
  href,
}: {
  label: string;
  count: number;
  max: number;
  href?: string;
}) {
  const pct = max > 0 ? (count / max) * 100 : 0;
  const inner = (
    <div className="flex items-center gap-3">
      <span className="text-sm w-32 truncate">{label}</span>
      <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary/70 rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-medium w-10 text-right">{count}</span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block hover:opacity-80 transition-opacity">
        {inner}
      </Link>
    );
  }
  return inner;
}

export default async function StatisticsPage() {
  const stores = await getAllStores();
  const stats = computeStats(stores);

  const platformMax = Math.max(...Object.values(stats.platformCounts));
  const categoryMax = Math.max(...Object.values(stats.categoryCounts));

  // Top stores by app count
  const topByApps = stores
    .filter((s) => s.metrics?.appCount)
    .sort((a, b) => b.metrics!.appCount! - a.metrics!.appCount!)
    .slice(0, 10);

  // Commission distribution buckets
  const commBuckets = { "0%": 0, "1-15%": 0, "16-25%": 0, "26-30%": 0, "31%+": 0 };
  stores.forEach((s) => {
    const c = s.fees?.commissionTiers?.[0]?.percentage;
    if (c == null) return;
    if (c === 0) commBuckets["0%"]++;
    else if (c <= 15) commBuckets["1-15%"]++;
    else if (c <= 25) commBuckets["16-25%"]++;
    else if (c <= 30) commBuckets["26-30%"]++;
    else commBuckets["31%+"]++;
  });
  const commMax = Math.max(...Object.values(commBuckets));

  const schema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "App Store Industry Statistics 2026",
    description: `Data covering ${stats.total} app stores, including commission rates, fees, platforms, and developer features.`,
    url: "https://appstores.dev/statistics",
    creator: {
      "@type": "Organization",
      name: "appstores.dev",
    },
    dateModified: new Date().toISOString().split("T")[0],
    variableMeasured: [
      "Commission Rate",
      "Registration Fee",
      "App Count",
      "Platform Support",
    ],
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
          <span className="text-foreground font-medium">Statistics</span>
        </nav>

        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">
              App Store Industry Statistics
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Data-driven insights from {stats.total} app stores. Updated
            continuously as new stores are added.
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard
            icon={<Layers className="h-5 w-5" />}
            label="App Stores Tracked"
            value={stats.total.toString()}
            detail={`Across ${Object.keys(stats.categoryCounts).length} categories`}
          />
          <StatCard
            icon={<DollarSign className="h-5 w-5" />}
            label="Avg Commission"
            value={`${stats.avgCommission.toFixed(1)}%`}
            detail={`Median: ${stats.medianCommission}% (${stats.commissionCount} stores with data)`}
          />
          <StatCard
            icon={<TrendingUp className="h-5 w-5" />}
            label="Total Apps Listed"
            value={stats.totalApps > 1e6 ? `${(stats.totalApps / 1e6).toFixed(1)}M` : stats.totalApps.toLocaleString()}
            detail="Combined across all stores"
          />
          <StatCard
            icon={<Globe className="h-5 w-5" />}
            label="Free Registration"
            value={`${stats.freeRegistration}`}
            detail={`${stats.paidRegistration} require payment (avg $${stats.avgRegFee.toFixed(0)})`}
          />
        </div>

        {/* Commission Distribution */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Commission Rate Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(commBuckets).map(([range, count]) => (
                <BarRow key={range} label={range} count={count} max={commMax} />
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>
                Min: <strong>{stats.minCommission}%</strong>
              </span>
              <span>
                Max: <strong>{stats.maxCommission}%</strong>
              </span>
              <span>
                Reduced rates available:{" "}
                <strong>{stats.withReduced} stores</strong>
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Platform Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Platform Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(stats.platformCounts)
                  .sort(([, a], [, b]) => b - a)
                  .map(([plat, count]) => {
                    const info = platforms.find((p) => p.id === plat);
                    return (
                      <BarRow
                        key={plat}
                        label={info?.name || plat}
                        count={count}
                        max={platformMax}
                        href={`/stores/platform/${plat}`}
                      />
                    );
                  })}
              </div>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Category Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(stats.categoryCounts)
                  .sort(([, a], [, b]) => b - a)
                  .map(([cat, count]) => {
                    const info = categories.find((c) => c.id === cat);
                    return (
                      <BarRow
                        key={cat}
                        label={info?.name || cat}
                        count={count}
                        max={categoryMax}
                        href={`/stores/category/${info?.slug || cat}`}
                      />
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Review Process */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Review Process Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{stats.automatedOnly}</p>
                <p className="text-sm text-muted-foreground">Automated Only</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">{stats.humanOnly}</p>
                <p className="text-sm text-muted-foreground">Human Only</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">{stats.bothReview}</p>
                <p className="text-sm text-muted-foreground">
                  Automated + Human
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Developer Features */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Developer Feature Availability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "API Available", count: stats.withApi },
                { label: "Beta Testing", count: stats.withBeta },
                { label: "Analytics Dashboard", count: stats.withAnalytics },
                { label: "A/B Testing", count: stats.withABTesting },
              ].map(({ label, count }) => (
                <div
                  key={label}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted"
                >
                  <span className="text-sm">{label}</span>
                  <Badge variant="secondary">
                    {count}/{stats.total}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Stores by App Count */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Largest Stores by App Count
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topByApps.map((store, i) => (
                <Link
                  key={store.slug}
                  href={`/stores/${store.slug}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <span className="text-sm font-medium w-6 text-muted-foreground">
                    {i + 1}.
                  </span>
                  <span className="text-sm flex-1">{store.name}</span>
                  <span className="text-sm font-medium">
                    {store.metrics!.appCount!.toLocaleString()} apps
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Average Ratings */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Industry Average Developer Ratings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.avgRatings)
                .sort(([, a], [, b]) => b - a)
                .map(([key, val]) => (
                  <div key={key} className="flex items-center gap-3">
                    <span className="text-sm w-40 truncate capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary/70 rounded-full"
                        style={{ width: `${(val / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-12 text-right">
                      {val.toFixed(2)}/5
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Separator className="my-10" />

        <div className="text-center text-sm text-muted-foreground">
          <p>
            Data sourced from {stats.total} app stores tracked on{" "}
            <Link href="/" className="underline hover:text-foreground">
              appstores.dev
            </Link>
            . Statistics are computed from structured store data and updated as
            new stores are added.
          </p>
        </div>
      </main>
    </>
  );
}

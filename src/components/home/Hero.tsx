import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroProps {
  storeCount: number;
  totalAppCount: number;
}

export function Hero({ storeCount, totalAppCount }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            The App Store{" "}
            <span className="text-primary">Directory</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
            Discover and compare {storeCount}+ app stores. Find the best platform
            to publish your apps with detailed information on fees, features, and
            submission processes.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/stores">
              <Button size="lg" className="gap-2">
                <Search className="h-4 w-4" />
                Browse All Stores
              </Button>
            </Link>
            <Link href="/compare">
              <Button size="lg" variant="outline" className="gap-2">
                Compare Stores
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-3 max-w-xl mx-auto">
            <div>
              <p className="text-3xl font-bold">{storeCount}+</p>
              <p className="text-sm text-muted-foreground">App Stores</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{formatNumber(totalAppCount)}+</p>
              <p className="text-sm text-muted-foreground">Total Apps</p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-3xl font-bold">8+</p>
              <p className="text-sm text-muted-foreground">Categories</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function formatNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1)}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(0)}K`;
  }
  return num.toString();
}

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StoreGrid } from "@/components/store";
import { StoreCardData } from "@/types/store";

interface FeaturedStoresProps {
  stores: StoreCardData[];
}

export function FeaturedStores({ stores }: FeaturedStoresProps) {
  if (stores.length === 0) {
    return null;
  }

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Featured Stores</h2>
            <p className="mt-2 text-muted-foreground">
              Popular app stores trusted by millions of developers
            </p>
          </div>
          <Link href="/stores" className="hidden sm:block">
            <Button variant="ghost" className="gap-2">
              View all
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <StoreGrid stores={stores} />

        <div className="mt-8 text-center sm:hidden">
          <Link href="/stores">
            <Button variant="outline" className="gap-2">
              View all stores
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

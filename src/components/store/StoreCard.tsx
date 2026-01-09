import Link from "next/link";
import Image from "next/image";
import { ExternalLink, CheckCircle, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StoreCardData } from "@/types/store";
import { getCategoryById } from "@/data/categories";
import { getPlatformsByIds } from "@/data/platforms";

interface StoreCardProps {
  store: StoreCardData;
}

export function StoreCard({ store }: StoreCardProps) {
  const category = getCategoryById(store.category);
  const platformInfos = getPlatformsByIds(store.platforms);
  const primaryCommission = store.fees.commissionTiers[0];

  return (
    <Link href={`/stores/${store.slug}`}>
      <Card className="group transition-all hover:shadow-lg hover:border-primary/50">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Logo and Name */}
            <div className="flex items-center gap-4 sm:min-w-[240px]">
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                {store.logo ? (
                  <Image
                    src={store.logo}
                    alt={`${store.name} logo`}
                    fill
                    className="object-contain p-1"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xl font-bold text-muted-foreground">
                    {store.name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors truncate">
                    {store.name}
                  </h3>
                  {store.metadata.verified && (
                    <CheckCircle className="h-4 w-4 flex-shrink-0 text-blue-500" />
                  )}
                </div>
                {category && (
                  <p className="text-sm text-muted-foreground">{category.name}</p>
                )}
              </div>
            </div>

            {/* Tagline */}
            <p className="text-sm text-muted-foreground line-clamp-2 flex-1 min-w-0">
              {store.tagline}
            </p>

            {/* Platforms and Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 sm:flex-shrink-0">
              <div className="flex flex-wrap gap-1.5">
                {platformInfos.map((platform) => (
                  <Badge key={platform.id} variant="secondary" className="text-xs">
                    {platform.name}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-4 text-sm sm:min-w-[180px] sm:justify-end">
                <span className="flex items-center gap-1 text-muted-foreground whitespace-nowrap">
                  <Star className="h-3.5 w-3.5" />
                  <span className="text-xs">No rating yet</span>
                </span>
                {store.metrics.appCount && (
                  <span className="text-muted-foreground whitespace-nowrap">
                    {formatNumber(store.metrics.appCount)} apps
                  </span>
                )}
                {primaryCommission && (
                  <span className="font-medium whitespace-nowrap">
                    {primaryCommission.percentage}%
                  </span>
                )}
              </div>

              <ExternalLink className="hidden sm:block h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(0)}K`;
  }
  return num.toString();
}

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "@/data/categories";
import { platforms } from "@/data/platforms";
import { ratingDimensions, RatingDimension } from "@/data/ratings";
import { Category, Platform, StoreSortOption } from "@/types/store";

const sortOptions: { value: StoreSortOption; label: string; group?: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "app-count-desc", label: "Most Apps" },
  { value: "commission-asc", label: "Lowest Commission" },
  { value: "rating-overall-desc", label: "Best Overall Rating", group: "ratings" },
  { value: "rating-commission-desc", label: "Best Commission", group: "ratings" },
  { value: "rating-reviewProcess-desc", label: "Best Review Process", group: "ratings" },
  { value: "rating-stability-desc", label: "Most Stable", group: "ratings" },
  { value: "rating-developerSupport-desc", label: "Best Support", group: "ratings" },
  { value: "rating-discoverability-desc", label: "Best Discoverability", group: "ratings" },
  { value: "rating-competitiveness-desc", label: "Most Competitive", group: "ratings" },
  { value: "rating-entryBarriers-desc", label: "Easiest Entry", group: "ratings" },
  { value: "rating-technicalFreedom-desc", label: "Most Freedom", group: "ratings" },
  { value: "rating-analytics-desc", label: "Best Analytics", group: "ratings" },
];

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedCategory = searchParams.get("category") as Category | null;
  const selectedPlatform = searchParams.get("platform") as Platform | null;
  const selectedSort = (searchParams.get("sort") as StoreSortOption) || "featured";
  const selectedMinRating = searchParams.get("minRating") as RatingDimension | null;

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/stores?${params.toString()}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    const query = searchParams.get("q");
    if (query) params.set("q", query);
    router.push(`/stores?${params.toString()}`);
  };

  const hasFilters = selectedCategory || selectedPlatform || selectedMinRating;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Category Filter */}
        <Select
          value={selectedCategory || "all"}
          onValueChange={(value) =>
            updateFilter("category", value === "all" ? null : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Platform Filter */}
        <Select
          value={selectedPlatform || "all"}
          onValueChange={(value) =>
            updateFilter("platform", value === "all" ? null : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            {platforms.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Min Rating Filter */}
        <Select
          value={selectedMinRating || "all"}
          onValueChange={(value) =>
            updateFilter("minRating", value === "all" ? null : value)
          }
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Min Rating (4+)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            {ratingDimensions.map((dim) => (
              <SelectItem key={dim.id} value={dim.id}>
                {dim.shortName} 4+
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={selectedSort}
          onValueChange={(value) => updateFilter("sort", value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear Filters */}
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear filters
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2">
          {selectedCategory && (
            <Badge variant="secondary" className="gap-1">
              {categories.find((c) => c.slug === selectedCategory)?.name}
              <button
                onClick={() => updateFilter("category", null)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedPlatform && (
            <Badge variant="secondary" className="gap-1">
              {platforms.find((p) => p.id === selectedPlatform)?.name}
              <button
                onClick={() => updateFilter("platform", null)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedMinRating && (
            <Badge variant="secondary" className="gap-1">
              {ratingDimensions.find((d) => d.id === selectedMinRating)?.shortName} 4+
              <button
                onClick={() => updateFilter("minRating", null)}
                className="ml-1 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}

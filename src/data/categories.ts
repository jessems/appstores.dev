import { Category } from "@/types/store";

export interface CategoryInfo {
  id: Category;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export const categories: CategoryInfo[] = [
  {
    id: "official",
    name: "Official Stores",
    slug: "official",
    description: "Platform-native app stores from OS makers like Apple and Google",
    icon: "shield-check",
  },
  {
    id: "manufacturer",
    name: "Manufacturer Stores",
    slug: "manufacturer",
    description: "Device manufacturer app marketplaces like Samsung and Huawei",
    icon: "smartphone",
  },
  {
    id: "third-party",
    name: "Third-Party Stores",
    slug: "third-party",
    description: "Independent app distribution platforms",
    icon: "store",
  },
  {
    id: "gaming",
    name: "Gaming Stores",
    slug: "gaming",
    description: "Platforms focused on game distribution",
    icon: "gamepad-2",
  },
  {
    id: "enterprise",
    name: "Enterprise Stores",
    slug: "enterprise",
    description: "Business-focused app distribution solutions",
    icon: "building-2",
  },
  {
    id: "open-source",
    name: "Open Source Stores",
    slug: "open-source",
    description: "Platforms for free and open-source software",
    icon: "code",
  },
  {
    id: "regional",
    name: "Regional Stores",
    slug: "regional",
    description: "Region-specific app marketplaces",
    icon: "globe",
  },
  {
    id: "specialty",
    name: "Specialty Stores",
    slug: "specialty",
    description: "Niche or vertical-specific app platforms",
    icon: "sparkles",
  },
];

export function getCategoryById(id: Category): CategoryInfo | undefined {
  return categories.find((cat) => cat.id === id);
}

export function getCategoryBySlug(slug: string): CategoryInfo | undefined {
  return categories.find((cat) => cat.slug === slug);
}

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
  {
    id: "ai-assistants",
    name: "AI Assistant Stores",
    slug: "ai-assistants",
    description: "Marketplaces for custom GPTs, AI bots, and conversational AI characters",
    icon: "bot",
  },
  {
    id: "ai-copilots",
    name: "AI Copilot Stores",
    slug: "ai-copilots",
    description: "Plugin and extension marketplaces for productivity AI copilots",
    icon: "sparkles",
  },
  {
    id: "ai-agents",
    name: "AI Agent Stores",
    slug: "ai-agents",
    description: "Marketplaces for autonomous AI agents that execute workflows",
    icon: "workflow",
  },
  {
    id: "ai-developer",
    name: "AI Developer Stores",
    slug: "ai-developer",
    description: "Developer-focused platforms for AI tools, MCP servers, and model hosting",
    icon: "code",
  },
];

export function getCategoryById(id: Category): CategoryInfo | undefined {
  return categories.find((cat) => cat.id === id);
}

export function getCategoryBySlug(slug: string): CategoryInfo | undefined {
  return categories.find((cat) => cat.slug === slug);
}

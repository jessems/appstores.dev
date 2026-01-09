export type RatingDimension =
  | "commission"
  | "reviewProcess"
  | "stability"
  | "developerSupport"
  | "discoverability"
  | "competitiveness"
  | "entryBarriers"
  | "technicalFreedom"
  | "analytics";

export interface RatingDimensionInfo {
  id: RatingDimension;
  name: string;
  shortName: string;
  description: string;
  icon: string;
}

export const ratingDimensions: RatingDimensionInfo[] = [
  {
    id: "commission",
    name: "Commission",
    shortName: "Commission",
    description: "Revenue share and fee structure favorability",
    icon: "percent",
  },
  {
    id: "reviewProcess",
    name: "Review Process Clarity & Efficiency",
    shortName: "Review",
    description: "Transparency and speed of the app review process",
    icon: "clipboard-check",
  },
  {
    id: "stability",
    name: "Stability & Reliability",
    shortName: "Stability",
    description: "Technical and political stability of the platform",
    icon: "shield",
  },
  {
    id: "developerSupport",
    name: "Developer Support & Account Management",
    shortName: "Support",
    description: "Quality of developer relations and support",
    icon: "headphones",
  },
  {
    id: "discoverability",
    name: "Discoverability & Anti-Scam Protection",
    shortName: "Discovery",
    description: "App visibility and protection against spam/scams",
    icon: "search",
  },
  {
    id: "competitiveness",
    name: "Competitiveness",
    shortName: "Compete",
    description: "Market reach and audience size potential",
    icon: "trending-up",
  },
  {
    id: "entryBarriers",
    name: "Entry Barriers & Costs",
    shortName: "Entry",
    description: "Ease of getting started and ongoing costs",
    icon: "door-open",
  },
  {
    id: "technicalFreedom",
    name: "Technical Freedom",
    shortName: "Freedom",
    description: "Flexibility in implementation and monetization",
    icon: "code",
  },
  {
    id: "analytics",
    name: "Data & Analytics",
    shortName: "Analytics",
    description: "Quality of insights and reporting tools",
    icon: "bar-chart",
  },
];

export function getRatingDimensionById(
  id: RatingDimension
): RatingDimensionInfo | undefined {
  return ratingDimensions.find((d) => d.id === id);
}

export function getRatingDimensionByIds(
  ids: RatingDimension[]
): RatingDimensionInfo[] {
  return ids
    .map((id) => getRatingDimensionById(id))
    .filter((d): d is RatingDimensionInfo => d !== undefined);
}

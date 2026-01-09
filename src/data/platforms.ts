import { Platform } from "@/types/store";

export interface PlatformInfo {
  id: Platform;
  name: string;
  icon: string;
}

export const platforms: PlatformInfo[] = [
  {
    id: "ios",
    name: "iOS",
    icon: "apple",
  },
  {
    id: "android",
    name: "Android",
    icon: "smartphone",
  },
  {
    id: "windows",
    name: "Windows",
    icon: "monitor",
  },
  {
    id: "macos",
    name: "macOS",
    icon: "laptop",
  },
  {
    id: "linux",
    name: "Linux",
    icon: "terminal",
  },
  {
    id: "web",
    name: "Web",
    icon: "globe",
  },
  {
    id: "cross-platform",
    name: "Cross-Platform",
    icon: "layers",
  },
];

export function getPlatformById(id: Platform): PlatformInfo | undefined {
  return platforms.find((p) => p.id === id);
}

export function getPlatformsByIds(ids: Platform[]): PlatformInfo[] {
  return ids
    .map((id) => getPlatformById(id))
    .filter((p): p is PlatformInfo => p !== undefined);
}

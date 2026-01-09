import Link from "next/link";
import {
  Apple,
  Smartphone,
  Monitor,
  Laptop,
  Terminal,
  Globe,
  Layers,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { platforms, PlatformInfo } from "@/data/platforms";

const iconMap: Record<string, React.ElementType> = {
  apple: Apple,
  smartphone: Smartphone,
  monitor: Monitor,
  laptop: Laptop,
  terminal: Terminal,
  globe: Globe,
  layers: Layers,
};

export function PlatformHighlights() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold sm:text-3xl">Browse by Platform</h2>
          <p className="mt-2 text-muted-foreground">
            Find app stores for your target platform
          </p>
        </div>

        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-7">
          {platforms.map((platform) => (
            <PlatformCard key={platform.id} platform={platform} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PlatformCard({ platform }: { platform: PlatformInfo }) {
  const Icon = iconMap[platform.icon] || Globe;

  return (
    <Link href={`/stores/platform/${platform.id}`}>
      <Card className="group h-full transition-all hover:shadow-md hover:border-primary/50">
        <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
          <div className="rounded-lg bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors mb-3">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold group-hover:text-primary transition-colors">
            {platform.name}
          </h3>
        </CardContent>
      </Card>
    </Link>
  );
}

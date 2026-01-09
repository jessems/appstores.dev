import Link from "next/link";
import {
  ShieldCheck,
  Smartphone,
  Store,
  Gamepad2,
  Building2,
  Code,
  Globe,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { categories, CategoryInfo } from "@/data/categories";

const iconMap: Record<string, React.ElementType> = {
  "shield-check": ShieldCheck,
  smartphone: Smartphone,
  store: Store,
  "gamepad-2": Gamepad2,
  "building-2": Building2,
  code: Code,
  globe: Globe,
  sparkles: Sparkles,
};

export function CategoryHighlights() {
  return (
    <section className="py-16 sm:py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold sm:text-3xl">Browse by Category</h2>
          <p className="mt-2 text-muted-foreground">
            Find app stores that match your needs
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ category }: { category: CategoryInfo }) {
  const Icon = iconMap[category.icon] || Store;

  return (
    <Link href={`/stores/category/${category.slug}`}>
      <Card className="group h-full transition-all hover:shadow-md hover:border-primary/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-primary/10 p-2.5 group-hover:bg-primary/20 transition-colors">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {category.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

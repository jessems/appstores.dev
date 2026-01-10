import Link from "next/link";
import { ArrowRight, Sparkles, Bot, Cpu, Code, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StoreGrid } from "@/components/store";
import { StoreCardData, Category } from "@/types/store";

interface NewAIStoresProps {
  stores: StoreCardData[];
}

const categoryInfo: Record<
  string,
  { label: string; icon: React.ReactNode; color: string }
> = {
  "ai-assistants": {
    label: "AI Assistants",
    icon: <Bot className="h-3.5 w-3.5" />,
    color: "bg-purple-500/10 text-purple-600 hover:bg-purple-500/20",
  },
  "ai-copilots": {
    label: "AI Copilots",
    icon: <Sparkles className="h-3.5 w-3.5" />,
    color: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20",
  },
  "ai-agents": {
    label: "AI Agents",
    icon: <Workflow className="h-3.5 w-3.5" />,
    color: "bg-green-500/10 text-green-600 hover:bg-green-500/20",
  },
  "ai-developer": {
    label: "AI Developer",
    icon: <Code className="h-3.5 w-3.5" />,
    color: "bg-orange-500/10 text-orange-600 hover:bg-orange-500/20",
  },
};

export function NewAIStores({ stores }: NewAIStoresProps) {
  if (stores.length === 0) {
    return null;
  }

  // Get unique categories from the stores
  const categories = Array.from(new Set(stores.map((s) => s.category))).filter(
    (cat) => cat in categoryInfo
  );

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-purple-50/50 to-transparent dark:from-purple-950/20 dark:to-transparent">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge
                variant="secondary"
                className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5" />
                New
              </Badge>
            </div>
            <h2 className="text-2xl font-bold sm:text-3xl">
              AI Marketplaces
            </h2>
            <p className="mt-2 text-muted-foreground max-w-2xl">
              Discover the new wave of AI-powered app stores. From custom GPTs and AI agents to copilot plugins and MCP servers.
            </p>
          </div>
          <Link href="/stores?category=ai-assistants,ai-copilots,ai-agents,ai-developer" className="hidden sm:block">
            <Button variant="ghost" className="gap-2">
              View all AI stores
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Category badges */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => {
            const info = categoryInfo[cat];
            if (!info) return null;
            return (
              <Link
                key={cat}
                href={`/stores?category=${cat}`}
              >
                <Badge
                  variant="secondary"
                  className={`${info.color} gap-1.5 cursor-pointer transition-colors`}
                >
                  {info.icon}
                  {info.label}
                </Badge>
              </Link>
            );
          })}
        </div>

        <StoreGrid stores={stores.slice(0, 6)} />

        {stores.length > 6 && (
          <div className="mt-8 text-center">
            <Link href="/stores?category=ai-assistants,ai-copilots,ai-agents,ai-developer">
              <Button variant="outline" className="gap-2">
                View all {stores.length} AI stores
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Link href="/stores?category=ai-assistants,ai-copilots,ai-agents,ai-developer">
            <Button variant="outline" className="gap-2">
              View all AI stores
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

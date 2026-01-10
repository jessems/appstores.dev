"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Bot, Code, Workflow, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StoreGrid } from "@/components/store";
import { StoreCardData } from "@/types/store";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (stores.length === 0) {
    return null;
  }

  // Get unique categories from the stores
  const categories = Array.from(new Set(stores.map((s) => s.category))).filter(
    (cat) => cat in categoryInfo
  );

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Get the Top Spot</DialogTitle>
            <DialogDescription className="pt-4 text-base">
              Want your AI marketplace featured at the top? Reach out to discuss sponsorship options.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-6">
            <a
              href="https://x.com/jessems"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold text-primary hover:underline"
            >
              DM @jessems on X
            </a>
          </div>
        </DialogContent>
      </Dialog>
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

        {/* Promotional slot */}
        <Card
          className="group cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 mb-4 border-dashed border-2 border-purple-300 dark:border-purple-700 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/30 dark:to-pink-950/30"
          onClick={() => setIsDialogOpen(true)}
        >
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              {/* Icon and Title */}
              <div className="flex items-center gap-4 sm:min-w-[240px]">
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Megaphone className="h-7 w-7 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      Your Store Here
                    </h3>
                    <Badge variant="secondary" className="bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs">
                      Sponsored
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Get featured</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground line-clamp-2 flex-1 min-w-0">
                Want to showcase your AI marketplace to thousands of developers? Get the top spot.
              </p>

              {/* CTA */}
              <div className="flex items-center gap-4 text-sm sm:flex-shrink-0">
                <span className="text-primary font-medium group-hover:underline whitespace-nowrap">
                  Learn more
                </span>
                <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </CardContent>
        </Card>

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
    </>
  );
}

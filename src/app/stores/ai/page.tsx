import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Bot, Sparkles, Workflow, Code } from "lucide-react";
import { StoreGrid } from "@/components/store";
import { getAIStores } from "@/lib/stores";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "AI App Stores & Marketplaces - App Store Directory",
  description:
    "Discover AI app stores and marketplaces for GPTs, AI agents, copilots, and developer tools. Compare platforms for publishing AI-powered applications.",
  keywords: [
    "ai app stores",
    "gpt store",
    "ai marketplace",
    "ai agents",
    "ai copilots",
    "mcp servers",
    "ai developer tools",
    "publish ai apps",
    "ai distribution",
  ],
  alternates: {
    canonical: "/stores/ai",
  },
  openGraph: {
    title: "AI App Stores & Marketplaces",
    description:
      "Discover AI app stores and marketplaces for GPTs, AI agents, copilots, and developer tools.",
    type: "website",
    images: [
      {
        url: "/api/og?title=AI%20App%20Stores&description=Discover%20marketplaces%20for%20GPTs%2C%20AI%20agents%2C%20and%20developer%20tools",
        width: 1200,
        height: 630,
        alt: "AI App Stores & Marketplaces",
      },
    ],
  },
};

const aiCategories = [
  {
    id: "ai-assistants",
    name: "AI Assistants",
    slug: "ai-assistants",
    description: "Custom GPTs, AI bots, and conversational AI characters",
    icon: Bot,
  },
  {
    id: "ai-copilots",
    name: "AI Copilots",
    slug: "ai-copilots",
    description: "Plugins and extensions for productivity AI copilots",
    icon: Sparkles,
  },
  {
    id: "ai-agents",
    name: "AI Agents",
    slug: "ai-agents",
    description: "Autonomous AI agents that execute workflows",
    icon: Workflow,
  },
  {
    id: "ai-developer",
    name: "AI Developer Tools",
    slug: "ai-developer",
    description: "MCP servers, model hosting, and AI development platforms",
    icon: Code,
  },
];

export default async function AIStoresPage() {
  const stores = await getAIStores();

  return (
    <div className="py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href="/stores"
            className="hover:text-foreground transition-colors"
          >
            Stores
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">AI Stores</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3">
            AI App Stores & Marketplaces
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            The emerging ecosystem of AI marketplaces for publishing GPTs, AI
            agents, copilot plugins, and developer tools. Browse {stores.length}{" "}
            AI-focused platforms.
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {aiCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Link key={category.id} href={`/stores/category/${category.slug}`}>
                <Card className="h-full hover:border-primary transition-colors cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Store count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {stores.length} AI {stores.length === 1 ? "store" : "stores"}
          </p>
          <Link
            href="/stores"
            className="text-sm text-primary hover:underline"
          >
            View all stores
          </Link>
        </div>

        {/* Stores Grid */}
        <StoreGrid stores={stores} />

        {/* SEO Content */}
        <div className="mt-16 prose prose-gray dark:prose-invert max-w-none">
          <h2>The Rise of AI App Stores</h2>
          <p>
            As AI capabilities expand, a new ecosystem of marketplaces has
            emerged for distributing AI-powered applications. These platforms
            enable creators to build and share custom GPTs, AI agents, copilot
            plugins, and developer tools without traditional app store
            constraints.
          </p>

          <h3>Types of AI Marketplaces</h3>
          <p>
            <strong>AI Assistant Stores</strong> like OpenAI&apos;s GPT Store
            and Google&apos;s Gemini Gems allow creators to build custom
            conversational AI characters and specialized assistants. These
            platforms enable prompt engineering and knowledge customization
            without coding.
          </p>
          <p>
            <strong>AI Copilot Stores</strong> provide plugins for productivity
            AI assistants. Microsoft&apos;s Copilot ecosystem, GitHub Copilot
            extensions, and Slack AI apps integrate AI capabilities into
            everyday workflows.
          </p>
          <p>
            <strong>AI Agent Marketplaces</strong> like Salesforce AgentExchange
            offer autonomous AI agents that can execute complex business
            workflows. These agents go beyond chat to take real actions.
          </p>
          <p>
            <strong>AI Developer Platforms</strong> serve builders creating AI
            applications. MCP server directories, Hugging Face Spaces, and tools
            like Dify provide infrastructure for AI app development and
            distribution.
          </p>

          <h3>Opportunities for AI Creators</h3>
          <p>
            The AI app store ecosystem is still nascent, offering early
            opportunities for creators. Unlike traditional app stores with
            established competition, many AI platforms are looking for quality
            content and may feature promising applications prominently.
          </p>
        </div>
      </div>
    </div>
  );
}

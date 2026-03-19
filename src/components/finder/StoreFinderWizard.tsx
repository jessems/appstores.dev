"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import generatedStores from "@/data/generated-stores.json";
import type { AppStore, Platform, Category } from "@/types/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  ExternalLink,
  Check,
  Sparkles,
} from "lucide-react";

const allStores = generatedStores as AppStore[];

// ── Question definitions ──────────────────────────────────────────────

interface Question {
  id: string;
  title: string;
  subtitle: string;
  options: { value: string; label: string; icon?: string }[];
  multiple?: boolean;
}

const questions: Question[] = [
  {
    id: "type",
    title: "What are you building?",
    subtitle: "Select the type of project",
    options: [
      { value: "mobile-app", label: "Mobile App", icon: "📱" },
      { value: "game", label: "Game", icon: "🎮" },
      { value: "desktop-app", label: "Desktop App", icon: "🖥️" },
      { value: "web-app", label: "Web App / PWA", icon: "🌐" },
      { value: "ai-tool", label: "AI Tool / Bot / Agent", icon: "🤖" },
      { value: "enterprise", label: "Enterprise / B2B", icon: "🏢" },
    ],
  },
  {
    id: "platforms",
    title: "Which platforms?",
    subtitle: "Select all that apply",
    multiple: true,
    options: [
      { value: "android", label: "Android", icon: "🤖" },
      { value: "ios", label: "iOS", icon: "🍎" },
      { value: "windows", label: "Windows", icon: "🪟" },
      { value: "macos", label: "macOS", icon: "💻" },
      { value: "linux", label: "Linux", icon: "🐧" },
      { value: "web", label: "Web", icon: "🌍" },
    ],
  },
  {
    id: "monetization",
    title: "How will you monetize?",
    subtitle: "Select your primary model",
    options: [
      { value: "free", label: "Completely Free", icon: "🆓" },
      { value: "paid", label: "Paid Upfront", icon: "💰" },
      { value: "freemium", label: "Freemium / IAP", icon: "💎" },
      { value: "subscription", label: "Subscription", icon: "🔄" },
      { value: "ads", label: "Ad-Supported", icon: "📺" },
      { value: "unsure", label: "Not Sure Yet", icon: "🤷" },
    ],
  },
  {
    id: "priority",
    title: "What matters most to you?",
    subtitle: "Pick your top priority",
    options: [
      { value: "reach", label: "Maximum Reach", icon: "📈" },
      { value: "low-fees", label: "Lowest Fees", icon: "💸" },
      { value: "fast-review", label: "Fast Review / No Review", icon: "⚡" },
      { value: "developer-tools", label: "Great Dev Tools", icon: "🛠️" },
      { value: "privacy", label: "Privacy / Open Source", icon: "🔒" },
      { value: "niche", label: "Niche / Targeted Audience", icon: "🎯" },
    ],
  },
  {
    id: "budget",
    title: "Registration budget?",
    subtitle: "One-time or annual developer fee",
    options: [
      { value: "free", label: "Free Only ($0)", icon: "🆓" },
      { value: "low", label: "Low (< $25)", icon: "💵" },
      { value: "medium", label: "Medium ($25–$100)", icon: "💰" },
      { value: "any", label: "No Limit", icon: "💎" },
    ],
  },
];

// ── Scoring engine ─────────────────────────────────────────────────

interface Answers {
  [key: string]: string | string[];
}

function scoreStore(store: AppStore, answers: Answers): number {
  let score = 0;
  const type = answers.type as string;
  const platforms = (answers.platforms as string[]) || [];
  const monetization = answers.monetization as string;
  const priority = answers.priority as string;
  const budget = answers.budget as string;

  // Platform match (major weight)
  if (platforms.length > 0) {
    const matches = platforms.filter((p) =>
      store.platforms.includes(p as Platform)
    ).length;
    score += (matches / platforms.length) * 40;
    if (matches === 0) return 0; // Hard filter: no platform match → skip
  }

  // Type match
  const aiCategories: Category[] = [
    "ai-assistants",
    "ai-copilots",
    "ai-agents",
    "ai-developer",
  ];
  if (type === "game" && store.category === "gaming") score += 25;
  else if (type === "game" && store.category === "official") score += 15;
  else if (type === "ai-tool" && aiCategories.includes(store.category))
    score += 25;
  else if (type === "enterprise" && store.category === "enterprise")
    score += 25;
  else if (
    type === "mobile-app" &&
    ["official", "manufacturer", "third-party"].includes(store.category)
  )
    score += 20;
  else if (
    type === "desktop-app" &&
    ["official", "gaming"].includes(store.category)
  )
    score += 15;
  else if (type === "web-app" && store.platforms.includes("web")) score += 15;
  else score += 5; // baseline

  // Monetization match
  if (monetization !== "unsure") {
    if (monetization === "free" || monetization === "freemium") {
      if (store.technical.supportsInAppPurchases) score += 10;
    }
    if (monetization === "subscription") {
      if (store.technical.supportsSubscriptions) score += 15;
    }
    if (monetization === "ads") {
      if (store.technical.supportsAds) score += 15;
    }
    if (monetization === "paid") {
      if (store.monetization.models.includes("paid")) score += 10;
    }
  }

  // Priority match
  if (priority === "reach") {
    const appCount = store.metrics.appCount || 0;
    if (appCount > 1000000) score += 20;
    else if (appCount > 100000) score += 15;
    else if (appCount > 10000) score += 10;
    else score += 3;
  }
  if (priority === "low-fees") {
    const fee = store.fees.registrationFee?.amount ?? 0;
    if (fee === 0) score += 20;
    else if (fee <= 25) score += 15;
    else if (fee <= 99) score += 8;
    const minCommission = Math.min(
      ...store.fees.commissionTiers.map((t) => t.percentage),
      100
    );
    if (minCommission === 0) score += 10;
    else if (minCommission <= 15) score += 7;
    else if (minCommission <= 30) score += 3;
  }
  if (priority === "fast-review") {
    if (!store.submission.requiresApproval) score += 20;
    else if (store.submission.hasAutomatedReview && !store.submission.hasHumanReview)
      score += 15;
    const reviewTime = store.submission.typicalReviewTime?.toLowerCase() || "";
    if (reviewTime.includes("instant") || reviewTime.includes("hour"))
      score += 10;
    else if (reviewTime.includes("1-2 day") || reviewTime.includes("24"))
      score += 7;
  }
  if (priority === "developer-tools") {
    if (store.technical.hasApi) score += 8;
    if (store.technical.hasSdk) score += 7;
    if (store.features.hasAnalyticsDashboard) score += 5;
    if (store.features.hasABTesting) score += 5;
    if (store.features.hasBetaTesting) score += 5;
  }
  if (priority === "privacy") {
    if (store.category === "open-source") score += 25;
    else if (store.name.toLowerCase().includes("f-droid")) score += 20;
  }
  if (priority === "niche") {
    if (
      ["specialty", "regional", ...aiCategories].includes(store.category)
    )
      score += 15;
  }

  // Budget filter
  if (budget !== "any") {
    const fee = store.fees.registrationFee?.amount ?? 0;
    if (budget === "free" && fee > 0) score -= 30;
    if (budget === "low" && fee > 25) score -= 20;
    if (budget === "medium" && fee > 100) score -= 10;
  }

  // Bonus for verified/active stores
  if (store.metadata.verified) score += 3;
  if (store.metadata.featured) score += 5;

  return Math.max(0, score);
}

// ── Components ────────────────────────────────────────────────────

function OptionButton({
  option,
  selected,
  onClick,
}: {
  option: { value: string; label: string; icon?: string };
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        relative flex items-center gap-3 px-5 py-4 rounded-lg border-2 transition-all
        font-mono text-sm cursor-pointer text-left w-full
        ${
          selected
            ? "border-dracula-purple bg-dracula-purple/10 text-dracula-foreground"
            : "border-border hover:border-dracula-comment hover:bg-card/50 text-muted-foreground"
        }
      `}
    >
      {selected && (
        <Check className="absolute top-2 right-2 w-4 h-4 text-dracula-green" />
      )}
      <span className="text-xl">{option.icon}</span>
      <span>{option.label}</span>
    </button>
  );
}

function ProgressBar({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  return (
    <div className="flex gap-1.5 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-all ${
            i <= current
              ? "bg-dracula-purple"
              : "bg-border"
          }`}
        />
      ))}
    </div>
  );
}

function ResultCard({
  store,
  score,
  rank,
}: {
  store: AppStore;
  score: number;
  rank: number;
}) {
  const fee = store.fees.registrationFee;
  const minCommission = Math.min(
    ...store.fees.commissionTiers.map((t) => t.percentage),
    100
  );

  return (
    <div className="border border-border rounded-lg p-5 hover:border-dracula-comment transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-dracula-comment font-mono text-sm">
            #{rank}
          </span>
          <div>
            <Link
              href={`/stores/${store.slug}`}
              className="font-bold text-dracula-foreground hover:text-dracula-cyan transition-colors"
            >
              {store.name}
            </Link>
            <p className="text-xs text-muted-foreground mt-0.5">
              {store.tagline}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-dracula-yellow" />
          <span className="font-mono text-sm text-dracula-yellow">
            {score}%
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {store.platforms.slice(0, 4).map((p) => (
          <Badge key={p} variant="secondary" className="text-xs font-mono">
            {p}
          </Badge>
        ))}
        <Badge variant="outline" className="text-xs font-mono">
          {store.category}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-3 text-xs font-mono">
        <div>
          <span className="text-muted-foreground">Fee:</span>{" "}
          <span className="text-dracula-green">
            {fee ? `$${fee.amount}` : "Free"}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">Commission:</span>{" "}
          <span className="text-dracula-orange">
            {minCommission < 100 ? `${minCommission}%` : "N/A"}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">Review:</span>{" "}
          <span className="text-dracula-cyan">
            {store.submission.typicalReviewTime || "Varies"}
          </span>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <Link href={`/stores/${store.slug}`}>
          <Button variant="outline" size="sm" className="text-xs font-mono">
            Details <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        </Link>
        {store.url && (
          <a href={store.url} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="sm" className="text-xs font-mono">
              Visit <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </a>
        )}
      </div>
    </div>
  );
}

// ── Main wizard ────────────────────────────────────────────────────

export function StoreFinderWizard() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [showResults, setShowResults] = useState(false);

  const currentQ = questions[step];

  function handleSelect(value: string) {
    if (currentQ.multiple) {
      const current = (answers[currentQ.id] as string[]) || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      setAnswers({ ...answers, [currentQ.id]: updated });
    } else {
      setAnswers({ ...answers, [currentQ.id]: value });
      // Auto-advance for single-select
      if (step < questions.length - 1) {
        setTimeout(() => setStep(step + 1), 200);
      } else {
        setTimeout(() => setShowResults(true), 200);
      }
    }
  }

  function handleNext() {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      setShowResults(true);
    }
  }

  function handleBack() {
    if (showResults) {
      setShowResults(false);
    } else if (step > 0) {
      setStep(step - 1);
    }
  }

  function handleReset() {
    setStep(0);
    setAnswers({});
    setShowResults(false);
  }

  // Compute results
  const results = useMemo(() => {
    if (!showResults) return [];
    const scored = allStores
      .map((store) => ({
        store,
        score: scoreStore(store, answers),
      }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score);

    // Normalize scores to percentages
    const maxScore = scored[0]?.score || 1;
    return scored.slice(0, 15).map((r) => ({
      ...r,
      score: Math.round((r.score / maxScore) * 100),
    }));
  }, [showResults, answers]);

  if (showResults) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold font-mono">
            <span className="text-dracula-green">&gt;</span> Results
            <span className="text-muted-foreground ml-2 text-sm font-normal">
              ({results.length} stores matched)
            </span>
          </h2>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="font-mono text-xs"
            >
              <ChevronLeft className="w-3 h-3 mr-1" /> Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="font-mono text-xs"
            >
              <RotateCcw className="w-3 h-3 mr-1" /> Start Over
            </Button>
          </div>
        </div>

        {/* Summary of choices */}
        <div className="border border-border rounded-lg p-4 mb-6 font-mono text-xs">
          <span className="text-dracula-comment">// Your criteria</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {Object.entries(answers).map(([key, val]) => (
              <Badge key={key} variant="secondary">
                {key}: {Array.isArray(val) ? val.join(", ") : val}
              </Badge>
            ))}
          </div>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="font-mono text-lg mb-2">No stores match your criteria</p>
            <p className="text-sm">Try broadening your platform or budget requirements.</p>
            <Button onClick={handleReset} className="mt-4 font-mono">
              <RotateCcw className="w-4 h-4 mr-2" /> Try Again
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((r, i) => (
              <ResultCard
                key={r.store.id}
                store={r.store}
                score={r.score}
                rank={i + 1}
              />
            ))}
          </div>
        )}

        {/* JSON-LD for the results page */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "App Store Finder",
              url: "https://appstores.dev/finder",
              applicationCategory: "DeveloperApplication",
              description:
                "Interactive tool to find the best app store for your project",
            }),
          }}
        />
      </div>
    );
  }

  const isMultipleWithSelection =
    currentQ.multiple &&
    ((answers[currentQ.id] as string[]) || []).length > 0;

  return (
    <div>
      <ProgressBar current={step} total={questions.length} />

      <div className="mb-8">
        <h2 className="text-xl font-bold font-mono mb-1">
          <span className="text-dracula-purple">{step + 1}.</span>{" "}
          {currentQ.title}
        </h2>
        <p className="text-sm text-muted-foreground">{currentQ.subtitle}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {currentQ.options.map((opt) => {
          const val = answers[currentQ.id];
          const selected = currentQ.multiple
            ? ((val as string[]) || []).includes(opt.value)
            : val === opt.value;
          return (
            <OptionButton
              key={opt.value}
              option={opt}
              selected={selected}
              onClick={() => handleSelect(opt.value)}
            />
          );
        })}
      </div>

      <div className="flex justify-between">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={step === 0}
          className="font-mono text-xs"
        >
          <ChevronLeft className="w-3 h-3 mr-1" /> Back
        </Button>

        {(currentQ.multiple || isMultipleWithSelection) && (
          <Button
            onClick={handleNext}
            className="font-mono text-xs"
            disabled={
              currentQ.multiple &&
              ((answers[currentQ.id] as string[]) || []).length === 0
            }
          >
            {step === questions.length - 1 ? "Show Results" : "Next"}{" "}
            <ChevronRight className="w-3 h-3 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
}

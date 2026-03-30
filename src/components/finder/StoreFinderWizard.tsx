"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  ExternalLink,
  Sparkles,
  Monitor,
  Gamepad2,
  Building2,
  Globe,
  Code,
  DollarSign,
  Zap,
} from "lucide-react";

interface StoreData {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  logo: string;
  category: string;
  platforms: string[];
  appCount?: number;
  commissionTiers: { percentage: number; description: string }[];
  registrationFee?: { amount: number; currency: string; type: string };
  hasApi: boolean;
  hasSdk: boolean;
  supportsInAppPurchases: boolean;
  supportsSubscriptions: boolean;
  hasAnalyticsDashboard: boolean;
  hasBetaTesting: boolean;
  hasUserReviews: boolean;
  models: string[];
  verified: boolean;
  status: string;
  ratings?: Record<string, number>;
  pros?: string[];
}

interface Answers {
  platforms: string[];
  audience: string;
  budget: string;
  features: string[];
  monetization: string;
}

const STEPS = [
  { key: "platforms", title: "Target Platforms", icon: Monitor },
  { key: "audience", title: "Target Audience", icon: Globe },
  { key: "budget", title: "Budget", icon: DollarSign },
  { key: "features", title: "Must-Have Features", icon: Zap },
  { key: "monetization", title: "Monetization", icon: Sparkles },
] as const;

const PLATFORM_OPTIONS = [
  { value: "ios", label: "iOS / iPhone", icon: "📱" },
  { value: "android", label: "Android", icon: "🤖" },
  { value: "windows", label: "Windows", icon: "🪟" },
  { value: "macos", label: "macOS", icon: "🍎" },
  { value: "linux", label: "Linux", icon: "🐧" },
  { value: "web", label: "Web App", icon: "🌐" },
  { value: "cross-platform", label: "Cross-Platform", icon: "🔄" },
];

const AUDIENCE_OPTIONS = [
  {
    value: "consumer",
    label: "General Consumers",
    desc: "Everyday users",
    icon: Globe,
  },
  {
    value: "gaming",
    label: "Gamers",
    desc: "Gaming audience",
    icon: Gamepad2,
  },
  {
    value: "enterprise",
    label: "Enterprise / B2B",
    desc: "Business users",
    icon: Building2,
  },
  {
    value: "developer",
    label: "Developers",
    desc: "Technical users",
    icon: Code,
  },
  {
    value: "ai",
    label: "AI / ML Users",
    desc: "AI enthusiasts & builders",
    icon: Sparkles,
  },
];

const BUDGET_OPTIONS = [
  { value: "free", label: "Free only", desc: "No upfront costs" },
  { value: "low", label: "Under $50", desc: "One-time or annual" },
  { value: "medium", label: "Under $200", desc: "Willing to invest" },
  { value: "any", label: "Any budget", desc: "Cost isn't a concern" },
];

const FEATURE_OPTIONS = [
  { value: "iap", label: "In-App Purchases" },
  { value: "subscriptions", label: "Subscriptions" },
  { value: "analytics", label: "Analytics Dashboard" },
  { value: "beta", label: "Beta Testing" },
  { value: "api", label: "Store API" },
  { value: "sdk", label: "SDK Available" },
  { value: "reviews", label: "User Reviews" },
];

const MONETIZATION_OPTIONS = [
  { value: "free", label: "Free app", desc: "No charges to users" },
  { value: "paid", label: "Paid download", desc: "Users pay upfront" },
  { value: "freemium", label: "Freemium", desc: "Free with premium features" },
  {
    value: "subscription",
    label: "Subscription",
    desc: "Recurring payments",
  },
  { value: "ads", label: "Ad-supported", desc: "Revenue from ads" },
];

function OptionButton({
  selected,
  onClick,
  children,
  className = "",
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative rounded-xl border-2 p-4 text-left transition-all hover:border-primary/50 hover:shadow-md ${
        selected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border bg-card"
      } ${className}`}
    >
      {children}
      {selected && (
        <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
          <svg className="h-3 w-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </button>
  );
}

function scoreStore(store: StoreData, answers: Answers): number {
  let score = 0;
  let maxScore = 0;

  // Platform match (weight: 30)
  maxScore += 30;
  if (answers.platforms.length > 0) {
    const matches = answers.platforms.filter((p) =>
      store.platforms.includes(p)
    ).length;
    score += (matches / answers.platforms.length) * 30;
  }

  // Audience match (weight: 25)
  maxScore += 25;
  const audienceCategoryMap: Record<string, string[]> = {
    consumer: ["official", "manufacturer", "third-party", "regional"],
    gaming: ["gaming"],
    enterprise: ["enterprise"],
    developer: ["open-source", "ai-developer"],
    ai: ["ai-assistants", "ai-copilots", "ai-agents", "ai-developer"],
  };
  if (
    answers.audience &&
    audienceCategoryMap[answers.audience]?.includes(store.category)
  ) {
    score += 25;
  }

  // Budget match (weight: 15)
  maxScore += 15;
  const fee = store.registrationFee?.amount ?? 0;
  if (answers.budget === "free" && fee === 0) score += 15;
  else if (answers.budget === "low" && fee <= 50) score += 15;
  else if (answers.budget === "medium" && fee <= 200) score += 15;
  else if (answers.budget === "any") score += 15;

  // Feature match (weight: 20)
  maxScore += 20;
  if (answers.features.length > 0) {
    let featureMatches = 0;
    for (const f of answers.features) {
      if (f === "iap" && store.supportsInAppPurchases) featureMatches++;
      if (f === "subscriptions" && store.supportsSubscriptions) featureMatches++;
      if (f === "analytics" && store.hasAnalyticsDashboard) featureMatches++;
      if (f === "beta" && store.hasBetaTesting) featureMatches++;
      if (f === "api" && store.hasApi) featureMatches++;
      if (f === "sdk" && store.hasSdk) featureMatches++;
      if (f === "reviews" && store.hasUserReviews) featureMatches++;
    }
    score += (featureMatches / answers.features.length) * 20;
  } else {
    score += 20;
  }

  // Monetization match (weight: 10)
  maxScore += 10;
  if (answers.monetization) {
    if (store.models.includes(answers.monetization)) score += 10;
    // ads is a special case - check supportsAds indirectly
    if (answers.monetization === "ads" && store.models.includes("free")) score += 5;
  } else {
    score += 10;
  }

  return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
}

function ResultCard({
  store,
  score,
  rank,
}: {
  store: StoreData;
  score: number;
  rank: number;
}) {
  const maxCommission = store.commissionTiers.length > 0
    ? Math.max(...store.commissionTiers.map((t) => t.percentage))
    : null;
  const fee = store.registrationFee;

  return (
    <Card className="p-5 hover:shadow-lg transition-shadow">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-lg bg-muted text-2xl">
          {store.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={store.logo}
              alt={store.name}
              className="h-10 w-10 rounded object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <span className="text-lg font-bold text-muted-foreground">
              {store.name[0]}
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {rank <= 3 && (
              <span className="text-sm font-bold text-primary">
                #{rank}
              </span>
            )}
            <Link
              href={`/stores/${store.slug}`}
              className="font-semibold text-lg hover:underline truncate"
            >
              {store.name}
            </Link>
            {store.verified && (
              <Badge variant="secondary" className="text-xs">
                Verified
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
            {store.tagline}
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
            {store.platforms.length > 0 && (
              <span>
                📱 {store.platforms.slice(0, 3).join(", ")}
                {store.platforms.length > 3 && ` +${store.platforms.length - 3}`}
              </span>
            )}
            {store.appCount && (
              <span>📦 {store.appCount.toLocaleString()} apps</span>
            )}
            {maxCommission !== null && (
              <span>💰 {maxCommission}% commission</span>
            )}
            {fee && (
              <span>
                🏷️ {fee.currency === "USD" ? "$" : fee.currency}
                {fee.amount} {fee.type}
              </span>
            )}
          </div>

          {store.pros && store.pros.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {store.pros.slice(0, 3).map((pro) => (
                <Badge key={pro} variant="outline" className="text-xs">
                  {pro}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex-shrink-0 text-right">
          <div
            className={`text-2xl font-bold ${
              score >= 80
                ? "text-green-600"
                : score >= 60
                ? "text-amber-600"
                : "text-muted-foreground"
            }`}
          >
            {score}%
          </div>
          <div className="text-xs text-muted-foreground">match</div>
        </div>
      </div>

      <div className="mt-3 flex gap-2">
        <Link href={`/stores/${store.slug}`}>
          <Button size="sm" variant="outline" className="gap-1">
            Details <ExternalLink className="h-3 w-3" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}

export function StoreFinderWizard({ stores }: { stores: StoreData[] }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    platforms: [],
    audience: "",
    budget: "",
    features: [],
    monetization: "",
  });
  const [showResults, setShowResults] = useState(false);

  const activeStores = stores.filter((s) => s.status === "active");

  const results = useMemo(() => {
    if (!showResults) return [];
    return activeStores
      .map((store) => ({ store, score: scoreStore(store, answers) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 15);
  }, [showResults, answers, activeStores]);

  function togglePlatform(p: string) {
    setAnswers((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(p)
        ? prev.platforms.filter((x) => x !== p)
        : [...prev.platforms, p],
    }));
  }

  function toggleFeature(f: string) {
    setAnswers((prev) => ({
      ...prev,
      features: prev.features.includes(f)
        ? prev.features.filter((x) => x !== f)
        : [...prev.features, f],
    }));
  }

  function handleNext() {
    if (step < STEPS.length - 1) {
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

  function reset() {
    setStep(0);
    setShowResults(false);
    setAnswers({
      platforms: [],
      audience: "",
      budget: "",
      features: [],
      monetization: "",
    });
  }

  if (showResults) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Your Recommendations</h2>
            <p className="text-muted-foreground">
              {results.length} stores matched from {activeStores.length} total
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleBack}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Adjust
            </Button>
            <Button variant="outline" size="sm" onClick={reset}>
              <RotateCcw className="h-4 w-4 mr-1" /> Start Over
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {results.map((r, i) => (
            <ResultCard
              key={r.store.id}
              store={r.store}
              score={r.score}
              rank={i + 1}
            />
          ))}
        </div>

        {results.length === 0 && (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              No stores matched your criteria. Try adjusting your preferences.
            </p>
            <Button className="mt-4" onClick={reset}>
              Start Over
            </Button>
          </Card>
        )}
      </div>
    );
  }

  const currentStep = STEPS[step];
  const StepIcon = currentStep.icon;

  return (
    <div>
      {/* Progress bar */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s.key} className="flex items-center flex-1">
            <div
              className={`h-2 rounded-full flex-1 transition-colors ${
                i <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          </div>
        ))}
      </div>

      <Card className="p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <StepIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Step {step + 1} of {STEPS.length}
            </p>
            <h2 className="text-xl font-semibold">{currentStep.title}</h2>
          </div>
        </div>

        {/* Step: Platforms */}
        {step === 0 && (
          <div>
            <p className="text-muted-foreground mb-4">
              Which platforms does your app target? Select all that apply.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PLATFORM_OPTIONS.map((opt) => (
                <OptionButton
                  key={opt.value}
                  selected={answers.platforms.includes(opt.value)}
                  onClick={() => togglePlatform(opt.value)}
                >
                  <span className="text-2xl">{opt.icon}</span>
                  <p className="font-medium mt-1">{opt.label}</p>
                </OptionButton>
              ))}
            </div>
          </div>
        )}

        {/* Step: Audience */}
        {step === 1 && (
          <div>
            <p className="text-muted-foreground mb-4">
              Who is your primary audience?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AUDIENCE_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                return (
                  <OptionButton
                    key={opt.value}
                    selected={answers.audience === opt.value}
                    onClick={() =>
                      setAnswers((prev) => ({ ...prev, audience: opt.value }))
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{opt.label}</p>
                        <p className="text-xs text-muted-foreground">
                          {opt.desc}
                        </p>
                      </div>
                    </div>
                  </OptionButton>
                );
              })}
            </div>
          </div>
        )}

        {/* Step: Budget */}
        {step === 2 && (
          <div>
            <p className="text-muted-foreground mb-4">
              What&apos;s your budget for developer registration fees?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BUDGET_OPTIONS.map((opt) => (
                <OptionButton
                  key={opt.value}
                  selected={answers.budget === opt.value}
                  onClick={() =>
                    setAnswers((prev) => ({ ...prev, budget: opt.value }))
                  }
                >
                  <p className="font-medium">{opt.label}</p>
                  <p className="text-xs text-muted-foreground">{opt.desc}</p>
                </OptionButton>
              ))}
            </div>
          </div>
        )}

        {/* Step: Features */}
        {step === 3 && (
          <div>
            <p className="text-muted-foreground mb-4">
              Which features are important? Select all that apply (or skip).
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {FEATURE_OPTIONS.map((opt) => (
                <OptionButton
                  key={opt.value}
                  selected={answers.features.includes(opt.value)}
                  onClick={() => toggleFeature(opt.value)}
                >
                  <p className="font-medium text-sm">{opt.label}</p>
                </OptionButton>
              ))}
            </div>
          </div>
        )}

        {/* Step: Monetization */}
        {step === 4 && (
          <div>
            <p className="text-muted-foreground mb-4">
              How do you plan to monetize your app?
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MONETIZATION_OPTIONS.map((opt) => (
                <OptionButton
                  key={opt.value}
                  selected={answers.monetization === opt.value}
                  onClick={() =>
                    setAnswers((prev) => ({
                      ...prev,
                      monetization: opt.value,
                    }))
                  }
                >
                  <p className="font-medium">{opt.label}</p>
                  <p className="text-xs text-muted-foreground">{opt.desc}</p>
                </OptionButton>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-4 border-t">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={step === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <Button onClick={handleNext}>
            {step === STEPS.length - 1 ? (
              <>
                See Results <Sparkles className="h-4 w-4 ml-1" />
              </>
            ) : (
              <>
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}

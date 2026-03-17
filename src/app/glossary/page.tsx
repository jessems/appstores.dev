import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { glossaryTerms } from "@/data/glossary";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "App Store Glossary — Key Terms for Developers",
  description:
    "Understand app store terminology. Definitions of commission rates, ASO, sideloading, IAP, beta testing, and more — explained for developers.",
  keywords: [
    "app store glossary",
    "app store terms",
    "app distribution terminology",
    "developer glossary",
    "ASO glossary",
    "app store commission explained",
  ],
  alternates: {
    canonical: "/glossary",
  },
};

export default function GlossaryIndexPage() {
  const sortedTerms = [...glossaryTerms].sort((a, b) =>
    a.term.localeCompare(b.term)
  );

  // Group by first letter
  const grouped = sortedTerms.reduce(
    (acc, term) => {
      const letter = term.term[0].toUpperCase();
      if (!acc[letter]) acc[letter] = [];
      acc[letter].push(term);
      return acc;
    },
    {} as Record<string, typeof glossaryTerms>
  );

  const letters = Object.keys(grouped).sort();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "App Store Glossary",
    description:
      "Key terms and definitions for app store distribution and development.",
    url: "https://appstores.dev/glossary",
    hasDefinedTerm: sortedTerms.map((t) => ({
      "@type": "DefinedTerm",
      name: t.term,
      description: t.definition,
      url: `https://appstores.dev/glossary/${t.slug}`,
    })),
  };

  return (
    <div className="py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">Glossary</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <BookOpen className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">App Store Glossary</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl">
            {glossaryTerms.length} essential terms for navigating the app store
            ecosystem. From commission rates to sideloading — everything you need
            to know as a developer.
          </p>
        </div>

        {/* Letter navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {letters.map((letter) => (
            <a
              key={letter}
              href={`#${letter}`}
              className="w-9 h-9 flex items-center justify-center rounded-md border text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {letter}
            </a>
          ))}
        </div>

        {/* Terms */}
        {letters.map((letter) => (
          <section key={letter} id={letter} className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">{letter}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {grouped[letter].map((term) => (
                <Link key={term.slug} href={`/glossary/${term.slug}`}>
                  <Card className="h-full hover:border-primary/50 transition-colors">
                    <CardContent className="pt-4 pb-4">
                      <h3 className="font-semibold text-primary mb-1">
                        {term.term}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {term.definition}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

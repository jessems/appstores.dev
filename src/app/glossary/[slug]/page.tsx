import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ArrowRight, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  glossaryTerms,
  getGlossaryTermBySlug,
  getAllGlossarySlugs,
} from "@/data/glossary";

export const dynamic = "force-static";

interface GlossaryTermPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllGlossarySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: GlossaryTermPageProps): Promise<Metadata> {
  const { slug } = await params;
  const term = getGlossaryTermBySlug(slug);

  if (!term) {
    return { title: "Not Found" };
  }

  const title = `${term.term} — App Store Glossary | appstores.dev`;
  const description = term.definition;

  return {
    title,
    description,
    keywords: [
      term.term.toLowerCase(),
      `what is ${term.term.toLowerCase()}`,
      `${term.term.toLowerCase()} definition`,
      "app store",
      "developer",
    ],
    alternates: {
      canonical: `/glossary/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(term.term)}&description=${encodeURIComponent(term.definition.slice(0, 100))}`,
          width: 1200,
          height: 630,
          alt: term.term,
        },
      ],
    },
  };
}

export default async function GlossaryTermPage({
  params,
}: GlossaryTermPageProps) {
  const { slug } = await params;
  const term = getGlossaryTermBySlug(slug);

  if (!term) {
    notFound();
  }

  // Get related terms that exist in the glossary
  const relatedTerms = term.relatedTerms
    .map((slug) => getGlossaryTermBySlug(slug))
    .filter((t): t is NonNullable<typeof t> => t !== undefined);

  // Get all other terms for navigation
  const allTerms = glossaryTerms
    .filter((t) => t.slug !== slug)
    .sort((a, b) => a.term.localeCompare(b.term));

  const currentIndex = glossaryTerms
    .sort((a, b) => a.term.localeCompare(b.term))
    .findIndex((t) => t.slug === slug);
  const sortedAll = [...glossaryTerms].sort((a, b) =>
    a.term.localeCompare(b.term)
  );
  const prevTerm = currentIndex > 0 ? sortedAll[currentIndex - 1] : null;
  const nextTerm =
    currentIndex < sortedAll.length - 1 ? sortedAll[currentIndex + 1] : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: term.term,
    description: term.definition,
    url: `https://appstores.dev/glossary/${slug}`,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "App Store Glossary",
      url: "https://appstores.dev/glossary",
    },
  };

  // Split long description into paragraphs
  const paragraphs = term.longDescription
    .split("\n\n")
    .filter((p) => p.trim());

  return (
    <div className="py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href="/glossary"
            className="hover:text-foreground transition-colors"
          >
            Glossary
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{term.term}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <Badge variant="outline">Definition</Badge>
          </div>
          <h1 className="text-3xl font-bold mb-4">{term.term}</h1>
          <div className="bg-muted/50 rounded-lg p-4 border">
            <p className="text-lg">{term.definition}</p>
          </div>
        </div>

        {/* Long description */}
        <article className="prose prose-gray dark:prose-invert max-w-none mb-12">
          {paragraphs.map((paragraph, i) => {
            // Check if it's a list or heading
            if (paragraph.startsWith("**") && paragraph.includes(":**")) {
              // It's a section with bold header — render as-is with markdown-style formatting
              const lines = paragraph.split("\n");
              return (
                <div key={i}>
                  {lines.map((line, j) => {
                    if (line.startsWith("- **")) {
                      const match = line.match(
                        /^- \*\*(.+?)\*\*[: ](.+)$/
                      );
                      if (match) {
                        return (
                          <li key={j}>
                            <strong>{match[1]}</strong>
                            {match[2].startsWith(":") ? match[2] : `: ${match[2]}`}
                          </li>
                        );
                      }
                    }
                    if (line.startsWith("**") && line.endsWith("**")) {
                      return (
                        <h3 key={j}>
                          {line.replace(/\*\*/g, "")}
                        </h3>
                      );
                    }
                    if (line.startsWith("- ")) {
                      return <li key={j}>{line.slice(2)}</li>;
                    }
                    if (line.match(/^\d+\. /)) {
                      return <li key={j}>{line.replace(/^\d+\. /, "")}</li>;
                    }
                    return <p key={j}>{line}</p>;
                  })}
                </div>
              );
            }
            return <p key={i}>{paragraph}</p>;
          })}
        </article>

        {/* See Also */}
        {term.seeAlso && term.seeAlso.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4">See Also</h2>
            <div className="flex flex-wrap gap-3">
              {term.seeAlso.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border hover:border-primary/50 hover:bg-muted/50 transition-colors text-sm"
                >
                  {link.label}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related Terms */}
        {relatedTerms.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold mb-4">Related Terms</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {relatedTerms.map((rt) => (
                <Link key={rt.slug} href={`/glossary/${rt.slug}`}>
                  <Card className="h-full hover:border-primary/50 transition-colors">
                    <CardContent className="pt-4 pb-4">
                      <h3 className="font-semibold text-primary mb-1">
                        {rt.term}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {rt.definition}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Prev/Next Navigation */}
        <nav className="flex justify-between items-center pt-6 border-t">
          {prevTerm ? (
            <Link
              href={`/glossary/${prevTerm.slug}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← {prevTerm.term}
            </Link>
          ) : (
            <span />
          )}
          <Link
            href="/glossary"
            className="text-sm text-primary hover:underline"
          >
            All terms
          </Link>
          {nextTerm ? (
            <Link
              href={`/glossary/${nextTerm.slug}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {nextTerm.term} →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </div>
    </div>
  );
}

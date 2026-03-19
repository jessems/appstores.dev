import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { articles, getArticleBySlug, type ArticleData } from "@/data/articles";

export const dynamic = "force-static";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Not Found" };

  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords,
    alternates: { canonical: `/resources/${slug}` },
    openGraph: {
      title: article.title,
      description: article.description,
      url: `/resources/${slug}`,
      type: "article",
      publishedTime: article.publishedDate,
    },
  };
}

function TableOfContents({ sections }: { sections: { id: string; title: string }[] }) {
  return (
    <nav className="border border-border rounded-lg p-4 mb-8">
      <h2 className="font-mono text-sm text-dracula-comment mb-3">
        // Table of Contents
      </h2>
      <ul className="space-y-1.5">
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className="text-sm text-muted-foreground hover:text-dracula-cyan transition-colors"
            >
              {s.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function ArticleSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-10 scroll-mt-20">
      <h2 className="text-xl font-bold font-mono mb-4">
        <span className="text-dracula-purple">#</span> {title}
      </h2>
      <div className="prose-sm text-muted-foreground leading-relaxed space-y-4">
        {children}
      </div>
    </section>
  );
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const currentIndex = articles.findIndex((a) => a.slug === slug);
  const prev = currentIndex > 0 ? articles[currentIndex - 1] : null;
  const next =
    currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-6">
        <Link href="/" className="hover:text-dracula-cyan">
          Home
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link href="/resources" className="hover:text-dracula-cyan">
          Resources
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-dracula-foreground">{article.title}</span>
      </div>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-3 text-xs font-mono text-muted-foreground">
          <span>{article.readTime} read</span>
          <span>·</span>
          <span>{article.publishedDate}</span>
          {article.tags.map((tag) => (
            <span key={tag} className="text-dracula-comment">
              #{tag}
            </span>
          ))}
        </div>
        <h1 className="text-3xl font-bold mb-3">{article.title}</h1>
        <p className="text-lg text-muted-foreground">{article.description}</p>
      </header>

      <TableOfContents sections={article.sections} />

      {/* Article content rendered from data */}
      {article.content}

      {/* Navigation */}
      <div className="flex justify-between mt-12 pt-6 border-t border-border">
        {prev ? (
          <Link
            href={`/resources/${prev.slug}`}
            className="flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-dracula-cyan"
          >
            <ChevronLeft className="w-4 h-4" /> {prev.title}
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/resources/${next.slug}`}
            className="flex items-center gap-2 text-sm font-mono text-muted-foreground hover:text-dracula-cyan"
          >
            {next.title} <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <div />
        )}
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.description,
            url: `https://appstores.dev/resources/${slug}`,
            datePublished: article.publishedDate,
            publisher: {
              "@type": "Organization",
              name: "appstores.dev",
              url: "https://appstores.dev",
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://appstores.dev/resources/${slug}`,
            },
          }),
        }}
      />
    </main>
  );
}

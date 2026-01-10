import Link from "next/link";
import { categories } from "@/data/categories";
import { platforms } from "@/data/platforms";
import { seoLandingPages } from "@/data/seo-landing-pages";

const footerLinks = {
  browse: [
    { name: "All Stores", href: "/stores" },
    { name: "Compare Stores", href: "/compare" },
  ],
  categories: categories.slice(0, 6).map((cat) => ({
    name: cat.name,
    href: `/stores/category/${cat.slug}`,
  })),
  platforms: platforms.slice(0, 6).map((platform) => ({
    name: platform.name,
    href: `/stores/platform/${platform.id}`,
  })),
};

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-lg font-bold text-primary-foreground">A</span>
              </div>
              <span className="text-xl font-semibold">appstores.dev</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              The comprehensive directory of app stores. Compare platforms, fees,
              and features to find the best place to publish your apps.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Browse</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.browse.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Categories</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.categories.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Platforms</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.platforms.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* SEO Landing Pages Section */}
        <div className="mt-12 border-t pt-8">
          <h3 className="text-sm font-semibold mb-6">Explore App Stores</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-6">
            {seoLandingPages.map((category) => (
              <div key={category.title}>
                <h4 className="text-xs font-medium text-muted-foreground mb-2">
                  {category.title}
                </h4>
                <ul className="space-y-1">
                  {category.links.map((link) => (
                    <li key={`${category.title}-${link.name}`}>
                      <Link
                        href={link.href}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} appstores.dev. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

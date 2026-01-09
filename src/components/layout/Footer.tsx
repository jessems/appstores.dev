import Link from "next/link";
import { categories } from "@/data/categories";
import { platforms } from "@/data/platforms";

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

        <div className="mt-12 border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} appstores.dev. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { useState } from "react";
import { Megaphone, Sparkles } from "lucide-react";

export function PromotedStores() {
  const [clicked, setClicked] = useState(false);

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold sm:text-3xl">Promoted</h2>
          <p className="mt-2 text-muted-foreground">
            Sponsored app stores
          </p>
        </div>

        <div
          onClick={() => setClicked(true)}
          className="group relative cursor-pointer overflow-hidden rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/30 p-8 transition-all hover:border-primary/50 hover:bg-muted/50"
        >
          {!clicked ? (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Megaphone className="h-8 w-8 text-primary" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold">
                  Want your app store featured here?
                </h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-md">
                  Get your app store in front of thousands of developers looking for the right platform to publish their apps.
                </p>
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm font-medium text-primary group-hover:underline">
                <Sparkles className="h-4 w-4" />
                Click to learn more
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 py-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <svg
                  className="h-8 w-8 text-primary"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold">
                  DM @jessems on X
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Reach out to discuss promotional opportunities
                </p>
              </div>
              <a
                href="https://x.com/jessems"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                onClick={(e) => e.stopPropagation()}
              >
                Open X Profile
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

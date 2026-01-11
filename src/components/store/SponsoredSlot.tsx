"use client";

import { useState } from "react";
import { Megaphone, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function SponsoredSlot() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Get the Top Spot</DialogTitle>
            <DialogDescription className="pt-4 text-base">
              Want your app store featured at the top? Reach out to discuss sponsorship options.
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

      <Card
        className="group cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 border-dashed border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10"
        onClick={() => setIsDialogOpen(true)}
      >
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Icon and Title */}
            <div className="flex items-center gap-4 sm:min-w-[240px]">
              <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                <Megaphone className="h-7 w-7 text-primary-foreground" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                    Your Store Here
                  </h3>
                  <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                    Sponsored
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Get featured</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2 flex-1 min-w-0">
              Want to showcase your app store to thousands of developers? Get the top spot.
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
    </>
  );
}

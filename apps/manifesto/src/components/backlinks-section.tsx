"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { BacklinkInfo } from "@/lib/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface BacklinksSectionProps {
  backlinks: BacklinkInfo[];
  onBacklinkClick: (slug: string) => void;
}

function ExcerptWithBold({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={part} className="font-semibold text-foreground">
            {part.slice(2, -2)}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  );
}

export function BacklinksSection({
  backlinks,
  onBacklinkClick,
}: BacklinksSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  if (backlinks.length === 0) {
    return null;
  }

  return (
    <section>
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
        {backlinks.length}{" "}
        {backlinks.length === 1 ? "note links" : "notes link"} to this
      </h3>
      <ul className="flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {backlinks.map((backlink, index) => (
            <motion.li
              key={backlink.slug}
              layout
              initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, y: -10 }}
              transition={
                shouldReduceMotion ? { duration: 0 } : { delay: index * 0.05 }
              }
            >
              <Card
                render={
                  <button
                    type="button"
                    onClick={() => onBacklinkClick(backlink.slug)}
                  />
                }
                className="w-full text-left cursor-pointer transition-colors hover:bg-accent"
              >
                <CardHeader>
                  <CardTitle className="text-base">{backlink.title}</CardTitle>
                  {backlink.excerpt && (
                    <CardDescription className="line-clamp-2">
                      <ExcerptWithBold text={backlink.excerpt} />
                    </CardDescription>
                  )}
                </CardHeader>
              </Card>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </section>
  );
}

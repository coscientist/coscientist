"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "next-intl";
import type { Note } from "@/lib/types";
import { cn } from "@/lib/utils";
import { buildNoteHref } from "@/lib/note-links";
import {
  paneVariants,
  paneContentVariants,
  spineVariants,
  springSubtle,
  springQuick,
} from "@/lib/animations";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PreviewLink } from "./preview-link";
import { usePaneCollapse } from "./pane-container";
import { PaneSpine } from "./pane-spine";

interface AllNotesListProps {
  notes: Note[];
  currentStack: string[];
  index: number;
  onNoteClick: (slug: string) => void;
  onExpand?: () => void;
}

export function AllNotesList({
  notes,
  currentStack,
  index,
  onNoteClick,
  onExpand,
}: AllNotesListProps) {
  const { collapsedIndices } = usePaneCollapse();
  const isCollapsed = collapsedIndices.has(index);
  const prefersReducedMotion = useReducedMotion();
  const t = useTranslations("allNotes");
  const tPane = useTranslations("notePane");

  const sortedNotes = useMemo(
    () => [...notes].sort((a, b) => a.title.localeCompare(b.title)),
    [notes],
  );

  const stackIndexBySlug = useMemo(() => {
    const map = new Map<string, number>();
    for (let i = 0; i < currentStack.length; i += 1) {
      const slug = currentStack[i];
      if (!map.has(slug)) {
        map.set(slug, i);
      }
    }
    return map;
  }, [currentStack]);

  const transition = prefersReducedMotion ? { duration: 0 } : springSubtle;
  const quickTransition = prefersReducedMotion ? { duration: 0 } : springQuick;

  return (
    <motion.aside
      data-pane
      data-index={index}
      layout
      initial={prefersReducedMotion ? false : "initial"}
      animate="animate"
      exit="exit"
      variants={paneVariants}
      transition={transition}
      className={cn(
        "flex-shrink-0 w-full md:w-1/3 md:min-w-pane-min h-full overflow-hidden",
        "bg-background border-x border-border relative",
        "sticky left-0",
      )}
      style={{
        left: `calc(${index} * var(--pane-spine-width))`,
        zIndex: `calc(var(--z-pane) + ${index})`,
      }}
    >
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div
          className="absolute -top-[300px] -right-[100px] w-[800px] h-[800px] opacity-0 dark:opacity-100 transition-opacity duration-1000"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute -bottom-[300px] -left-[100px] w-[800px] h-[800px] opacity-0 dark:opacity-100 transition-opacity duration-1000"
          style={{
            background:
              "radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      </div>

      <AnimatePresence>
        {isCollapsed && (
          <motion.div
            key="spine"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={spineVariants}
            transition={quickTransition}
            className="absolute inset-0 z-10"
          >
            <PaneSpine index={index} title={t("title")} showIndex={false} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="absolute top-0 left-0 bottom-0 w-full h-full"
        animate={isCollapsed ? "collapsed" : "expanded"}
        variants={paneContentVariants}
        transition={transition}
      >
        {isCollapsed && (
          <button
            type="button"
            onClick={onExpand}
            className="absolute inset-0 z-overlay cursor-pointer"
            aria-label={`${tPane("expand")} ${t("title")}`}
          >
            <span className="sr-only">{tPane("expand")}</span>
          </button>
        )}
        {isCollapsed && (
          <div className="absolute left-0 top-0 bottom-0 w-px bg-border z-sticky" />
        )}

        <ScrollArea className="h-full relative z-0">
          <div className="sticky top-0 z-sticky bg-background/80 backdrop-blur-md px-8 pt-8 pb-4 border-b border-border/50">
            <h2 className="text-2xl font-normal tracking-tight text-foreground/90 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-br dark:from-white dark:via-white dark:to-neutral-500">
              {t("title")}
            </h2>
            <p className="text-sm text-muted-foreground/60 mt-1 font-mono">
              {t("noteCount", { count: notes.length })}
            </p>
          </div>
          <div className="px-8 py-6">
            <ul className="space-y-1">
              {sortedNotes.map((note) => {
                const stackPosition = stackIndexBySlug.get(note.slug);
                const isInStack = stackPosition !== undefined;
                return (
                  <li key={note.slug}>
                    <PreviewLink
                      href={buildNoteHref(note.slug)}
                      onClick={(e) => {
                        e.preventDefault();
                        onNoteClick(note.slug);
                      }}
                    >
                      <span
                        className={cn(
                          "flex items-center gap-3 py-2 px-3 rounded-md text-sm transition-all duration-150",
                          "hover:bg-muted/50 dark:hover:bg-white/5",
                          isInStack
                            ? "bg-primary/5 dark:bg-white/5 text-foreground"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <span
                          className={cn(
                            "flex-shrink-0 w-6 text-[10px] font-mono tabular-nums",
                            isInStack
                              ? "text-primary dark:text-white/70"
                              : "text-muted-foreground/30",
                          )}
                        >
                          {isInStack
                            ? String(stackPosition + 1).padStart(2, "0")
                            : "—"}
                        </span>
                        <span className="truncate">{note.title}</span>
                      </span>
                    </PreviewLink>
                  </li>
                );
              })}
            </ul>
          </div>
        </ScrollArea>
      </motion.div>
    </motion.aside>
  );
}

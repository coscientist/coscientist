"use client";

import { useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import type { Note, BacklinkInfo } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  paneVariants,
  paneContentVariants,
  spineVariants,
  springSubtle,
  springQuick,
} from "@/lib/animations";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Frame,
  FrameHeader,
  FrameTitle,
  FrameDescription,
  FramePanel,
  FrameFooter,
} from "@/components/ui/frame";
import { NoteContent } from "./note-content";
import { BacklinksSection } from "./backlinks-section";
import { usePaneCollapse } from "./pane-container";
import { PaneSpine } from "./pane-spine";

interface NotePaneProps {
  note: Note;
  index: number;
  isFocused?: boolean;
  isClosable?: boolean;
  backlinks: BacklinkInfo[];
  onLinkClick: (slug: string, fromIndex: number) => void;
  onExpand?: () => void;
  onClose?: () => void;
}

export function NotePane({
  note,
  index,
  isFocused = false,
  isClosable = false,
  backlinks,
  onLinkClick,
  onExpand,
  onClose,
}: NotePaneProps) {
  const { collapsedIndices } = usePaneCollapse();
  const isCollapsed = collapsedIndices.has(index);
  const prefersReducedMotion = useReducedMotion();
  const t = useTranslations("notePane");

  const handleLinkClick = useCallback(
    (slug: string) => {
      onLinkClick(slug, index);
    },
    [onLinkClick, index],
  );

  const transition = prefersReducedMotion ? { duration: 0 } : springSubtle;
  const quickTransition = prefersReducedMotion ? { duration: 0 } : springQuick;

  return (
    <motion.article
      data-pane
      data-index={index}
      tabIndex={-1}
      aria-label={note.title}
      layout
      initial={prefersReducedMotion ? false : "initial"}
      animate="animate"
      exit="exit"
      variants={paneVariants}
      transition={transition}
      className={cn(
        "flex-shrink-0 w-full md:w-1/3 md:min-w-pane-min h-full overflow-hidden",
        "bg-background border-l border-border",
        "sticky left-0",
        "snap-start md:snap-align-none",
        isFocused && "ring-2 ring-primary ring-inset",
      )}
      style={{
        left: `calc(${index} * var(--pane-spine-width))`,
        zIndex: `calc(var(--z-pane) + ${index})`,
      }}
    >
      <AnimatePresence>
        {isCollapsed && (
          <motion.div
            key="spine"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={spineVariants}
            transition={quickTransition}
          >
            <PaneSpine
              index={index}
              title={note.title}
              description={note.description}
              showIndex={index > 0}
              isClosable={isClosable}
              onClose={onClose}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="absolute top-0 left-0 bottom-0 w-full bg-background group"
        animate={isCollapsed ? "collapsed" : "expanded"}
        variants={paneContentVariants}
        transition={transition}
      >
        {isCollapsed && (
          <button
            type="button"
            onClick={onExpand}
            className="absolute inset-0 z-overlay cursor-pointer"
            aria-label={t("expandNote", { title: note.title })}
          >
            <span className="sr-only">{t("expand")}</span>
          </button>
        )}
        {isCollapsed && (
          <div className="absolute left-0 top-0 bottom-0 w-px bg-border z-sticky" />
        )}

        <ScrollArea className="h-full">
          <Frame className="min-h-[calc(100%-1rem)] rounded-none">
            <FrameHeader>
              <FrameTitle className="text-xl font-semibold">
                {note.title}
              </FrameTitle>
              {note.description && (
                <FrameDescription className="mt-1">
                  {note.description}
                </FrameDescription>
              )}
            </FrameHeader>

            <FramePanel className="p-0">
              <NoteContent note={note} onLinkClick={handleLinkClick} />
            </FramePanel>

            {backlinks.length > 0 && (
              <FrameFooter className="px-5 py-4">
                <BacklinksSection
                  backlinks={backlinks}
                  onBacklinkClick={handleLinkClick}
                />
              </FrameFooter>
            )}
          </Frame>
        </ScrollArea>

        <AnimatePresence>
          {!isCollapsed && isClosable && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={quickTransition}
              onClick={(e) => {
                e.stopPropagation();
                onClose?.();
              }}
              className={cn(
                "absolute top-2 left-2.5 z-overlay",
                "size-5 rounded-full flex items-center justify-center",
                "bg-primary/10 text-primary text-xs font-semibold tabular-nums font-mono",
                "group-hover:bg-red-500 group-hover:text-white",
                "transition-colors cursor-pointer",
              )}
              aria-label={t("closeNote", { title: note.title })}
            >
              <span className="group-hover:hidden">{index}</span>
              <XMarkIcon className="size-3 hidden group-hover:block" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.article>
  );
}

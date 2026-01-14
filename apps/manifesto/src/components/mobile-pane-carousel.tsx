"use client";

import * as React from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  animate,
  type MotionValue,
  type PanInfo,
} from "motion/react";
import { IconXmarkOutline18 } from "nucleo-ui-outline-18";
import type { Note, BacklinkInfo } from "@/lib/types";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { springSubtle } from "@/lib/animations";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NoteContent } from "./note-content";
import { BacklinksSection } from "./backlinks-section";
import { cn } from "@/lib/utils";

interface MobilePaneCarouselProps {
  notes: Note[];
  backlinksMap: Map<string, BacklinkInfo[]>;
  onLinkClick: (slug: string, fromIndex: number) => void;
  onClose: (index: number) => void;
  focusIndex: number;
}

const paneVariants = {
  initial: { opacity: 0, scale: 0.92, x: 40 },
  animate: { opacity: 1, scale: 1, x: 0 },
  exit: { opacity: 0, scale: 0.92, x: -40 },
};

function SliderNotch({
  index,
  activeIndex,
  onTap,
}: {
  index: number;
  activeIndex: MotionValue<number>;
  onTap: () => void;
}) {
  const [isActive, setIsActive] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = activeIndex.on("change", (v) => {
      setIsActive(Math.round(v) === index);
    });
    setIsActive(Math.round(activeIndex.get()) === index);
    return unsubscribe;
  }, [activeIndex, index]);

  return (
    <button
      type="button"
      onClick={onTap}
      className="px-1.5 flex items-end justify-center h-10 touch-none"
    >
      <motion.div
        className="w-0.5 rounded-full bg-foreground"
        initial={false}
        animate={{
          height: isActive ? 28 : 12,
          opacity: isActive ? 1 : 0.3,
        }}
        transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
      />
    </button>
  );
}

function CoverflowPane({
  note,
  index,
  backlinks,
  onLinkClick,
  onClose,
  isClosable,
  progress,
}: {
  note: Note;
  index: number;
  backlinks: BacklinkInfo[];
  onLinkClick: (slug: string) => void;
  onClose: () => void;
  isClosable: boolean;
  progress: MotionValue<number>;
}) {
  const prefersReducedMotion = useReducedMotion();

  const offset = useTransform(progress, (p) => (index - p) * 200);

  const rotateY = useTransform(
    offset,
    [-200, 0, 200],
    prefersReducedMotion ? [0, 0, 0] : [-20, 0, 20],
  );

  const coverflowScale = useTransform(
    offset,
    [-200, 0, 200],
    prefersReducedMotion ? [1, 1, 1] : [0.8, 1, 0.8],
  );

  const coverflowX = useTransform(offset, (value) => value * 1.3);

  const coverflowOpacity = useTransform(
    offset,
    [-400, -200, 0, 200, 400],
    [0.3, 0.7, 1, 0.7, 0.3],
  );

  const zIndex = useTransform(offset, (value) =>
    Math.max(0, Math.round(100 - Math.abs(value))),
  );

  const transition = prefersReducedMotion ? { duration: 0 } : springSubtle;

  return (
    <motion.li
      layout
      initial={prefersReducedMotion ? false : "initial"}
      animate="animate"
      exit="exit"
      variants={paneVariants}
      transition={transition}
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ zIndex }}
    >
      <motion.article
        className={cn(
          "w-[92dvw] h-full",
          "bg-background border border-border rounded-2xl overflow-hidden",
          "shadow-lg pointer-events-auto",
        )}
        style={{
          x: coverflowX,
          rotateY,
          scale: coverflowScale,
          opacity: coverflowOpacity,
          transformStyle: "preserve-3d",
          transformPerspective: 1000,
        }}
      >
        <ScrollArea className="h-full">
          <div className="p-5 pb-10">
            <header className="mb-4 pr-8">
              <h1 className="text-xl font-semibold text-foreground leading-snug">
                {note.title}
              </h1>
              {note.description && (
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {note.description}
                </p>
              )}
            </header>
            <NoteContent note={note} onLinkClick={onLinkClick} />
            {backlinks.length > 0 && (
              <footer className="mt-6 pt-4 border-t border-border/40">
                <BacklinksSection
                  backlinks={backlinks}
                  onBacklinkClick={onLinkClick}
                />
              </footer>
            )}
          </div>
        </ScrollArea>

        {isClosable && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="absolute top-3 right-3 size-7 rounded-full bg-muted/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors z-50"
            aria-label={`Close ${note.title}`}
          >
            <IconXmarkOutline18 className="size-4" />
          </button>
        )}
      </motion.article>
    </motion.li>
  );
}

export function MobilePaneCarousel({
  notes,
  backlinksMap,
  onLinkClick,
  onClose,
  focusIndex,
}: MobilePaneCarouselProps) {
  const prefersReducedMotion = useReducedMotion();
  const currentIndex = useMotionValue(focusIndex);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const prevNotesLengthRef = React.useRef(notes.length);
  const prevFocusIndexRef = React.useRef(focusIndex);
  const dragStartIndex = React.useRef(focusIndex);
  const isInitialMount = React.useRef(true);
  const isDragging = React.useRef(false);

  const animateToIndex = React.useCallback(
    (index: number, instant = false) => {
      const clampedIndex = Math.max(0, Math.min(index, notes.length - 1));
      if (prefersReducedMotion || instant) {
        currentIndex.set(clampedIndex);
      } else {
        animate(currentIndex, clampedIndex, {
          type: "spring",
          duration: 0.5,
          bounce: 0.12,
        });
      }
    },
    [notes.length, currentIndex, prefersReducedMotion],
  );

  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      currentIndex.set(focusIndex);
      dragStartIndex.current = focusIndex;
      prevFocusIndexRef.current = focusIndex;
      return;
    }

    const notesAdded = notes.length > prevNotesLengthRef.current;
    prevNotesLengthRef.current = notes.length;

    if (focusIndex !== prevFocusIndexRef.current) {
      prevFocusIndexRef.current = focusIndex;
      if (!isDragging.current) {
        dragStartIndex.current = focusIndex;
      }
      if (notesAdded) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            animateToIndex(focusIndex);
          });
        });
      } else {
        animateToIndex(focusIndex);
      }
    }
  }, [focusIndex, notes.length, animateToIndex, currentIndex]);

  const handleDragStart = React.useCallback(() => {
    isDragging.current = true;
    dragStartIndex.current = currentIndex.get();
  }, [currentIndex]);

  const handleDrag = React.useCallback(
    (_: unknown, info: PanInfo) => {
      const cardWidth = containerRef.current?.offsetWidth ?? 350;
      const dragProgress = -info.offset.x / cardWidth;
      const newIndex = dragStartIndex.current + dragProgress;
      const clampedIndex = Math.max(
        -0.15,
        Math.min(newIndex, notes.length - 1 + 0.15),
      );
      currentIndex.set(clampedIndex);
    },
    [currentIndex, notes.length],
  );

  const handleDragEnd = React.useCallback(
    (_: unknown, info: PanInfo) => {
      isDragging.current = false;
      const velocity = info.velocity.x;
      const currentIdx = currentIndex.get();
      const cardWidth = containerRef.current?.offsetWidth ?? 350;

      let targetIndex: number;

      if (Math.abs(velocity) > 400) {
        targetIndex =
          velocity < 0 ? Math.ceil(currentIdx) : Math.floor(currentIdx);
      } else if (Math.abs(info.offset.x) > cardWidth * 0.15) {
        targetIndex =
          info.offset.x < 0 ? Math.ceil(currentIdx) : Math.floor(currentIdx);
      } else {
        targetIndex = Math.round(currentIdx);
      }

      const clampedTarget = Math.max(
        0,
        Math.min(targetIndex, notes.length - 1),
      );
      dragStartIndex.current = clampedTarget;
      animateToIndex(clampedTarget);
    },
    [currentIndex, animateToIndex, notes.length],
  );

  return (
    <div className="flex-1 flex flex-col items-center justify-center overflow-hidden w-full h-full bg-background">
      <div className="w-full h-12 flex items-center justify-center px-4">
        <div className="flex items-end justify-center h-10">
          {notes.map((note, index) => (
            <SliderNotch
              key={note.slug}
              index={index}
              activeIndex={currentIndex}
              onTap={() => animateToIndex(index)}
            />
          ))}
        </div>
      </div>

      <motion.div
        ref={containerRef}
        className="flex-1 w-full flex items-center justify-center overflow-hidden relative cursor-grab active:cursor-grabbing"
        style={{ perspective: 1000 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.08}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
      >
        <ul className="relative w-full h-full">
          <AnimatePresence initial={false} mode="popLayout">
            {notes.map((note, index) => (
              <CoverflowPane
                key={`${note.slug}-${index}`}
                note={note}
                index={index}
                backlinks={backlinksMap.get(note.slug) || []}
                onLinkClick={(slug) => onLinkClick(slug, index)}
                onClose={() => onClose(index)}
                isClosable={index > 0}
                progress={currentIndex}
              />
            ))}
          </AnimatePresence>
        </ul>
      </motion.div>
    </div>
  );
}

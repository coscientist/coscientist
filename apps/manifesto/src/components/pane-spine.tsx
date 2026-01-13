"use client";

import { motion, type Transition } from "motion/react";
import { cn } from "@/lib/utils";

interface PaneSpineProps {
  index: number;
  title: string;
  showIndex?: boolean;
  className?: string;
}

export function PaneSpine({
  index,
  title,
  showIndex = true,
  className,
}: PaneSpineProps) {
  return (
    <div
      className={cn(
        "absolute left-0 top-0 bottom-0 w-pane-spine flex flex-col items-center pt-2 bg-card z-sticky gap-2",
        className,
      )}
      aria-hidden="true"
    >
      {showIndex && (
        <span className="size-5 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center tabular-nums flex-shrink-0">
          {index + 1}
        </span>
      )}
      <span
        className="text-sm font-medium text-muted-foreground whitespace-nowrap"
        style={{
          writingMode: "vertical-lr",
          transform: "rotate(180deg)",
        }}
      >
        {title}
      </span>
    </div>
  );
}

interface AnimatedPaneSpineProps extends PaneSpineProps {
  isVisible: boolean;
  fadeTransition: Transition;
}

export function AnimatedPaneSpine({
  isVisible,
  fadeTransition,
  ...props
}: AnimatedPaneSpineProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={fadeTransition}
    >
      <PaneSpine {...props} />
    </motion.div>
  );
}

"use client";

import { cn } from "@/lib/utils";

interface PaneSpineProps {
  index: number;
  title: string;
  description?: string;
  showIndex?: boolean;
  className?: string;
}

export function PaneSpine({
  index,
  title,
  description,
  showIndex = true,
  className,
}: PaneSpineProps) {
  return (
    <div
      className={cn(
        "absolute left-0 top-0 bottom-0 w-pane-spine flex flex-col items-center py-4 bg-card/80 backdrop-blur-md border-r border-border/50 z-sticky gap-6 group/spine",
        className,
      )}
    >
      <div className="flex flex-col gap-1 items-center opacity-50 grayscale group-hover/spine:grayscale-0 group-hover/spine:opacity-100 transition-all duration-300">
        <div className="w-1.5 h-6 bg-foreground/90 rounded-sm" />
        <div className="w-1.5 h-6 bg-foreground/50 rounded-sm" />
        <div className="w-1.5 h-6 bg-foreground/20 rounded-sm" />
      </div>

      {showIndex && (
        <span className="text-[10px] font-mono text-muted-foreground/50 font-medium">
          {index < 10 ? `0${index}` : index}
        </span>
      )}

      <div className="flex-1 w-full relative flex items-start justify-center overflow-hidden pt-2">
        <div
          className="flex items-center gap-2 absolute"
          style={{
            writingMode: "vertical-rl",
            textOrientation: "sideways",
          }}
        >
          <span className="text-sm font-medium text-foreground whitespace-nowrap tracking-wide">
            {title}
          </span>
          {description && (
            <span className="text-xs text-muted-foreground/50 whitespace-nowrap">
              {description}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

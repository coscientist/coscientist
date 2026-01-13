"use client";

import { useCallback } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslations } from "next-intl";
import type { Note, BacklinkInfo } from "@/lib/types";
import { cn } from "@/lib/utils";
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
  const t = useTranslations("notePane");

  const handleLinkClick = useCallback(
    (slug: string) => {
      onLinkClick(slug, index);
    },
    [onLinkClick, index],
  );

  return (
    <article
      data-pane
      data-index={index}
      tabIndex={-1}
      aria-label={note.title}
      className={cn(
        "flex-shrink-0 w-full md:w-1/3 md:min-w-pane-min h-full overflow-hidden",
        "bg-background",
        "sticky left-0",
        "snap-start md:snap-align-none",
        isFocused && "ring-2 ring-primary ring-inset",
      )}
      style={{
        left: `calc(${index} * var(--pane-spine-width))`,
        zIndex: `calc(var(--z-pane) + ${index})`,
      }}
    >
      {isCollapsed && (
        <PaneSpine
          index={index}
          title={note.title}
          description={note.description}
          showIndex={index > 0}
          isClosable={isClosable}
          onClose={onClose}
        />
      )}

      <div
        className="absolute top-0 left-0 bottom-0 w-full bg-background group"
        style={{
          transform: isCollapsed
            ? "translateX(var(--pane-spine-width))"
            : undefined,
        }}
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

        {!isCollapsed && isClosable && (
          <button
            type="button"
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
          </button>
        )}
      </div>
    </article>
  );
}

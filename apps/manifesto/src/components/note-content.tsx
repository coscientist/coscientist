"use client";

import { useCallback, useMemo } from "react";
import parse, {
  domToReact,
  type HTMLReactParserOptions,
  type DOMNode,
  Element,
} from "html-react-parser";
import { IconArrowUpRightOutline18 } from "nucleo-ui-outline-18";
import type { Note } from "@/lib/types";
import {
  buildNoteHref,
  isExternalHref,
  normalizeNoteSlug,
} from "@/lib/note-links";
import { PreviewLink } from "./preview-link";

interface NoteContentProps {
  note: Note;
  onLinkClick: (slug: string) => void;
}

export function NoteContent({ note, onLinkClick }: NoteContentProps) {
  const handleInternalLink = useCallback(
    (slug: string, e: React.MouseEvent) => {
      e.preventDefault();
      onLinkClick(slug);
    },
    [onLinkClick],
  );

  const parserOptions = useMemo<HTMLReactParserOptions>(() => {
    const options: HTMLReactParserOptions = {
      replace: (domNode: DOMNode) => {
        if (domNode instanceof Element && domNode.name === "a") {
          const href = domNode.attribs?.href;
          if (!href) return;

          if (isExternalHref(href)) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={domNode.attribs?.class}
              >
                {domToReact(domNode.children as DOMNode[], options)}
                <IconArrowUpRightOutline18 className="inline-block size-[0.85em] ml-0.5 align-baseline" />
              </a>
            );
          }

          const slug = normalizeNoteSlug(href);
          if (!slug) return;

          return (
            <PreviewLink
              href={buildNoteHref(slug)}
              onClick={(e) => handleInternalLink(slug, e)}
            >
              {domToReact(domNode.children as DOMNode[], options)}
            </PreviewLink>
          );
        }
      },
    };

    return options;
  }, [handleInternalLink]);

  const parsedContent = useMemo(
    () => parse(note.contentHtml, parserOptions),
    [note.contentHtml, parserOptions],
  );

  return <div className="prose-note md:px-4 md:py-3">{parsedContent}</div>;
}

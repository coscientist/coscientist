"use client"

import { useCallback, useEffect, useRef } from "react"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { springQuick, springSubtle } from "@/lib/animations"
import type { BacklinkInfo } from "@/lib/types"
import { PaneBackground } from "./pane-background"
import { PaneBody } from "./pane-body"
import { usePaneCollapse } from "./pane-collapse-context"
import { PaneCollapsedSpine } from "./pane-collapsed-spine"
import { PaneContentWrapper } from "./pane-content-wrapper"
import { PaneWrapper } from "./pane-wrapper"

interface NotePaneProps {
  slug: string
  title: string
  description?: string
  contentHtml: string
  index: number
  isFocused?: boolean
  isClosable?: boolean
  backlinks: BacklinkInfo[]
  onLinkClick: (slug: string, fromIndex: number) => void
  onExpand?: () => void
  onClose?: () => void
}

export function NotePane({
  slug,
  title,
  description,
  contentHtml,
  index,
  isClosable = false,
  backlinks,
  onLinkClick,
  onExpand,
  onClose,
}: NotePaneProps) {
  const { collapsedIndices, registerPaneRef } = usePaneCollapse()
  const isCollapsed = collapsedIndices.has(index)
  const prefersReducedMotion = useReducedMotion()
  const paneRef = useRef<HTMLElement>(null)

  useEffect(() => {
    registerPaneRef(index, paneRef.current)
    return () => registerPaneRef(index, null)
  }, [index, registerPaneRef])

  const handleLinkClick = useCallback(
    (slug: string) => {
      onLinkClick(slug, index)
    },
    [onLinkClick, index]
  )

  const transition = prefersReducedMotion ? { duration: 0 } : springSubtle
  const quickTransition = prefersReducedMotion ? { duration: 0 } : springQuick

  return (
    <PaneWrapper
      index={index}
      paneRef={paneRef}
      prefersReducedMotion={prefersReducedMotion}
      title={title}
      transition={transition}
    >
      <PaneBackground />

      <PaneCollapsedSpine
        description={description}
        index={index}
        isCollapsed={isCollapsed}
        quickTransition={quickTransition}
        title={title}
      />

      <PaneContentWrapper
        isClosable={isClosable}
        isCollapsed={isCollapsed}
        onClose={onClose}
        onExpand={onExpand}
        quickTransition={quickTransition}
        title={title}
        transition={transition}
      >
        <PaneBody
          backlinks={backlinks}
          contentHtml={contentHtml}
          description={description}
          onLinkClick={handleLinkClick}
          slug={slug}
          title={title}
        />
      </PaneContentWrapper>
    </PaneWrapper>
  )
}

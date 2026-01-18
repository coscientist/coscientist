"use client"

import { motion } from "motion/react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { paneVariants } from "./pane-animations"

interface PaneWrapperProps {
  children: ReactNode
  title: string
  index: number
  prefersReducedMotion: boolean
  transition: object
  paneRef: React.RefObject<HTMLElement | null>
}

export function PaneWrapper({
  children,
  title,
  index,
  prefersReducedMotion,
  transition,
  paneRef,
}: PaneWrapperProps) {
  return (
    <motion.article
      animate="animate"
      aria-label={title}
      className={cn(
        "h-full w-full flex-shrink-0 overflow-hidden md:w-1/3 md:min-w-pane-min",
        "group/pane relative border-border border-l bg-background",
        "left-0 md:sticky md:left-[var(--pane-left-offset)]",
        "snap-start md:snap-align-none"
      )}
      data-index={index}
      data-pane
      exit="exit"
      initial={prefersReducedMotion ? false : "initial"}
      layout
      ref={paneRef}
      style={
        {
          "--pane-left-offset": `calc(${index} * var(--pane-spine-width))`,
          zIndex: `calc(var(--z-pane) + ${index})`,
        } as React.CSSProperties
      }
      tabIndex={-1}
      transition={transition}
      variants={paneVariants}
    >
      {children}
    </motion.article>
  )
}

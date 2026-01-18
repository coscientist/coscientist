"use client"

import { motion } from "motion/react"
import type { ReactNode } from "react"

import { useSectionAnimation } from "@/lib/landing-animations"

export interface PrimitiveGridProps {
  children: ReactNode
  className?: string
}

export function PrimitiveGrid({ children, className }: PrimitiveGridProps) {
  const { ref, isInView, transition, staggerContainerVariants } =
    useSectionAnimation({ amount: 0.2 })

  return (
    <section
      className="relative overflow-hidden py-16"
      ref={ref as React.RefObject<HTMLElement>}
    >
      <motion.div
        animate={isInView ? "visible" : "hidden"}
        className={className}
        initial="hidden"
        transition={transition}
        variants={staggerContainerVariants}
      >
        {children}
      </motion.div>
    </section>
  )
}

"use client"

import { motion } from "motion/react"
import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

export interface PrimitiveCardProps {
  title: string
  description: string
  className?: string
  variants: import("motion/react").Variants
}

export function PrimitiveCard({
  title,
  description,
  className,
  variants,
}: PrimitiveCardProps) {
  return (
    <motion.div
      className={cn(
        "flex flex-col gap-2 overflow-hidden border border-black/[0.06] bg-white p-6 shadow-black/[0.04] shadow-lg [border-radius:32px] dark:border-white/[0.06] dark:bg-black dark:shadow-black/[0.08]",
        className
      )}
      variants={variants}
    >
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="text-muted-foreground text-sm/7">{description}</p>
    </motion.div>
  )
}

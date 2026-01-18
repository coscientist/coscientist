"use client"

import { motion } from "motion/react"
import { IconChevronRightOutline18 } from "nucleo-ui-outline-18"

export interface PipelineStepProps {
  step: string
  isLast: boolean
  variants: import("motion/react").Variants
}

export function PipelineStep({ step, isLast, variants }: PipelineStepProps) {
  return (
    <motion.div className="flex items-center" variants={variants}>
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-12 w-24 items-center justify-center rounded-lg border border-border bg-muted/50">
          <span className="font-medium font-mono text-foreground text-sm">
            {step}
          </span>
        </div>
      </div>
      {!isLast && (
        <div className="hidden items-center px-2 text-muted-foreground sm:flex">
          <IconChevronRightOutline18 className="size-4" />
        </div>
      )}
    </motion.div>
  )
}

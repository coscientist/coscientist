"use client"

import { animate, type MotionValue, motion, useSpring } from "motion/react"
import { useEffect } from "react"

interface SliderNotchProps {
  index: number
  activeIndex: MotionValue<number>
  onTap: () => void
  ariaLabel: string
}

export function SliderNotch({
  index,
  activeIndex,
  onTap,
  ariaLabel,
}: SliderNotchProps) {
  const isActive = Math.round(activeIndex.get()) === index
  const height = useSpring(isActive ? 24 : 12, { duration: 0.2, bounce: 0 })
  const opacity = useSpring(isActive ? 1 : 0.3, { duration: 0.2, bounce: 0 })

  useEffect(() => {
    return activeIndex.on("change", (v) => {
      const active = Math.round(v) === index
      animate(height, active ? 24 : 12, { duration: 0.2, bounce: 0 })
      animate(opacity, active ? 1 : 0.3, { duration: 0.2, bounce: 0 })
    })
  }, [activeIndex, index, height, opacity])

  return (
    <button
      aria-label={ariaLabel}
      className="flex h-10 touch-none items-center justify-center px-1"
      onClick={onTap}
      type="button"
    >
      <motion.div className="w-1.5 bg-foreground" style={{ height, opacity }} />
    </button>
  )
}

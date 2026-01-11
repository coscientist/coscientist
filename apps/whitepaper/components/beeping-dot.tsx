'use client'

import type { FC } from 'react'

interface BeepingDotProps {
  visible?: boolean
  position?: string
  color?: string
  size?: string
}

export const BeepingDot: FC<BeepingDotProps> = ({
  visible = true,
  position = '-top-1 -right-1',
  color = 'bg-red-500',
  size = 'h-2 w-2',
}) => {
  if (!visible) return null

  return (
    <span
      className={`absolute ${position} ${size} ${color} rounded-full animate-pulse`}
    />
  )
}

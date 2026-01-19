"use client"

import { Loading03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "@/lib/utils"

const sizeClasses = {
  sm: "size-4",
  default: "size-5",
  lg: "size-6",
  xl: "size-8",
} as const

function Spinner({
  className,
  size = "default",
  ...props
}: Omit<React.ComponentProps<typeof HugeiconsIcon>, "icon" | "size"> & {
  size?: keyof typeof sizeClasses
}) {
  const resolvedSize =
    size === "sm" ? 16 : size === "lg" ? 24 : size === "xl" ? 32 : 20

  return (
    <HugeiconsIcon
      aria-label="Loading"
      className={cn("animate-spin", sizeClasses[size], className)}
      icon={Loading03Icon}
      role="status"
      size={resolvedSize}
      strokeWidth={1.5}
      {...props}
    />
  )
}

export { Spinner }

"use client"

import { LaptopIcon, Moon01Icon, Sun01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useTranslations } from "next-intl"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

const themes = [
  { value: "light", icon: Sun01Icon },
  { value: "dark", icon: Moon01Icon },
  { value: "system", icon: LaptopIcon },
] as const

export function ThemeToggle({
  className,
  variant = "icon",
}: {
  className?: string
  variant?: "icon" | "select"
}) {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const t = useTranslations("theme")

  useEffect(() => {
    setMounted(true)
  }, [])

  const resolvedTheme = mounted ? (theme ?? "system") : "system"
  const currentTheme =
    themes.find((t) => t.value === resolvedTheme) ?? themes[2]
  const CurrentIcon = currentTheme.icon

  return (
    <Select
      onValueChange={(value) => value && setTheme(value)}
      value={resolvedTheme}
    >
      {variant === "icon" ? (
        <SelectTrigger
          aria-label={t("toggle")}
          className={cn(
            "w-9 min-w-0 justify-center px-0 sm:w-8 [&>[data-slot=select-icon]]:hidden",
            className
          )}
          size="sm"
        >
          <SelectValue className="flex-none" placeholder={t("toggle")}>
            <HugeiconsIcon icon={CurrentIcon} size={18} strokeWidth={1.5} />
          </SelectValue>
        </SelectTrigger>
      ) : (
        <SelectTrigger
          aria-label={t("toggle")}
          className={cn("w-full justify-between", className)}
        >
          <SelectValue />
        </SelectTrigger>
      )}
      <SelectPopup alignItemWithTrigger={variant !== "icon"}>
        {themes.map(({ value, icon: Icon }) => (
          <SelectItem key={value} value={value}>
            <span className="flex items-center gap-2">
              <HugeiconsIcon icon={Icon} size={16} strokeWidth={1.5} />
              {t(value)}
            </span>
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  )
}

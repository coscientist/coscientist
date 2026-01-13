"use client";

import * as React from "react";
import { IconMoonOutline18, IconSunOutline18 } from "nucleo-ui-outline-18";
import { useTranslations } from "next-intl";
import { useTheme } from "./theme-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const t = useTranslations("theme");

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={cn("relative", className)}
      aria-label={t("toggle")}
    >
      <IconSunOutline18 className="size-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <IconMoonOutline18 className="absolute size-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">{t("toggle")}</span>
    </Button>
  );
}

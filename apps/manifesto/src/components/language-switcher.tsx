"use client";

import { useLocale, useTranslations } from "next-intl";
import { IconLanguageOutline18 } from "nucleo-ui-outline-18";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import {
  Select,
  SelectPopup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const localeNames: Record<Locale, string> = {
  en: "English",
  "zh-CN": "简体中文",
  "zh-TW": "繁體中文",
  hi: "हिन्दी",
  es: "Español",
  fr: "Français",
  ar: "العربية",
  bn: "বাংলা",
  pt: "Português",
  ru: "Русский",
  id: "Bahasa Indonesia",
  ja: "日本語",
  fa: "فارسی",
  de: "Deutsch",
  vi: "Tiếng Việt",
  ta: "தமிழ்",
  te: "తెలుగు",
  tr: "Türkçe",
  ko: "한국어",
  ur: "اردو",
  it: "Italiano",
  th: "ไทย",
  pl: "Polski",
  uk: "Українська",
  nl: "Nederlands",
};

export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("languageSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (value: string | null) => {
    if (value) {
      router.replace(pathname, { locale: value as Locale });
    }
  };

  return (
    <Select value={locale} onValueChange={handleChange}>
      <SelectTrigger
        className={cn(
          "size-9 min-w-0 min-h-0 justify-center sm:size-8 [&_[data-slot=select-icon]]:hidden",
          className,
        )}
        aria-label={t("selectLanguage")}
      >
        <IconLanguageOutline18 className="size-[1.2rem]" />
      </SelectTrigger>
      <SelectPopup className="max-h-[300px]">
        {routing.locales.map((loc) => (
          <SelectItem key={loc} value={loc}>
            {localeNames[loc]}
          </SelectItem>
        ))}
      </SelectPopup>
    </Select>
  );
}

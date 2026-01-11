"use client";

import { LanguageSkillIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

import { Button } from "@/components/ui/button";
import { Menu, MenuItem, MenuPopup, MenuTrigger } from "@/components/ui/menu";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: "en" | "ko") => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <Menu>
      <MenuTrigger
        render={
          <Button variant="ghost" size="icon" className="rounded-full">
            <HugeiconsIcon
              icon={LanguageSkillIcon}
              className="h-[1.2rem] w-[1.2rem]"
            />
            <span className="sr-only">Switch language</span>
          </Button>
        }
      />
      <MenuPopup align="end">
        <MenuItem
          onClick={() => switchLocale("en")}
          className={locale === "en" ? "font-semibold" : ""}
        >
          English
        </MenuItem>
        <MenuItem
          onClick={() => switchLocale("ko")}
          className={locale === "ko" ? "font-semibold" : ""}
        >
          한국어
        </MenuItem>
      </MenuPopup>
    </Menu>
  );
}

"use client"

import Link from "next/link"
import { useTranslations } from "next-intl"

import { Container } from "./primitives"

export function Footer() {
  const t = useTranslations("landing.footer")
  const currentYear = new Date().getFullYear()

  const links = [
    { label: t("manifesto"), href: "/manifesto" },
    {
      label: t("github"),
      href: "https://github.com/coscientist/coscientist",
      external: true,
    },
  ]

  return (
    <footer className="pt-16">
      <div className="bg-neutral-950/[0.025] py-16 text-neutral-950 dark:bg-white/5 dark:text-white">
        <Container className="flex flex-col gap-16">
          <nav>
            <ul className="flex flex-wrap gap-x-8 gap-y-2">
              {links.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      className="text-neutral-700 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
                      href={link.href}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      className="text-neutral-700 transition-colors hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center justify-between gap-10 text-sm/7">
            <div className="text-neutral-600 dark:text-neutral-500">
              {t("copyright", { year: currentYear })}
            </div>
          </div>
        </Container>
      </div>
    </footer>
  )
}

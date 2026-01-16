"use client"

import { motion, useReducedMotion } from "motion/react"
import Image from "next/image"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { IconChevronRightOutline18 } from "nucleo-ui-outline-18"
import { Button } from "@/components/ui/button"
import { Group } from "@/components/ui/group"
import { springSubtle } from "@/lib/animations"
import { AmbientGradient } from "./ambient-gradient"
import { Container } from "./primitives"

export function Hero() {
  const prefersReducedMotion = useReducedMotion()
  const t = useTranslations("landing.hero")
  return (
    <section className="pb-16">
      <Container>
        <div className="relative mx-auto w-full max-w-[1400px] overflow-hidden border border-black/10 border-t-0 bg-white [border-bottom-left-radius:32px] [border-bottom-right-radius:32px] dark:border-white/10 dark:bg-black max-md:[border-bottom-left-radius:24px] max-md:[border-bottom-right-radius:24px]">
          <AmbientGradient color="white" position="top-right" />
          <AmbientGradient color="blue" position="bottom-left" />
          {/* Background Image */}
          <div className="pointer-events-none absolute inset-0 top-[-20px] select-none">
            <Image
              alt=""
              className="hidden h-full w-full object-cover blur-[4px] dark:block"
              draggable={false}
              height={743 * 2}
              priority
              src="/images/hero/hero-background@dark.png"
              width={1400 * 2}
            />
            <Image
              alt=""
              className="block h-full w-full object-cover blur-[2px] dark:hidden"
              draggable={false}
              height={743 * 2}
              priority
              src="/images/hero/hero-background@light.png"
              width={1400 * 2}
            />
          </div>

          {/* Content Container */}
          <div className="relative z-10 flex flex-col items-center gap-[29px] px-8 pt-[48px] pb-12 text-center sm:px-16 lg:px-24">
            <motion.div
              animate={prefersReducedMotion ? {} : { y: [0, -12, 0] }}
              className="pointer-events-none select-none"
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : {
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }
              }
            >
              <Image
                alt=""
                className="h-[198px] w-[272px] object-contain"
                draggable={false}
                height={248 * 3}
                quality={100}
                src="/images/hero/hero-book.png"
                width={340 * 3}
              />
            </motion.div>

            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-8"
              initial={{ opacity: 0, y: 20 }}
              transition={springSubtle}
            >
              <h1 className="font-normal text-4xl text-foreground leading-[1.02] tracking-[-0.06em] sm:text-5xl lg:text-6xl dark:bg-gradient-to-br dark:from-white dark:via-white dark:to-neutral-400 dark:bg-clip-text dark:text-transparent">
                {t("title")
                  .split("\n")
                  .map((line, index) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: Static translated text with stable order
                    <span key={index}>
                      {line}
                      {index === 0 && <br />}
                    </span>
                  ))}
              </h1>
              <p className="text-base text-foreground/80 leading-[1.3] sm:text-lg">
                <span className="inline-block">{t("subtitle")}</span>
                <br />
                <span className="inline-block">{t("description")}</span>
              </p>
            </motion.div>

            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ ...springSubtle, delay: 0.1 }}
            >
              <Group className="flex flex-col items-center gap-2 sm:flex-row">
                <Button render={<Link href="/manifesto" />} size="lg">
                  {t("enterManifesto")}{" "}
                  <IconChevronRightOutline18 className="ml-1 size-4" />
                </Button>
                <Button
                  render={
                    // biome-ignore lint/a11y/useAnchorContent: Content provided via Button children
                    <a
                      href="https://github.com/coscientist/coscientist"
                      rel="noopener noreferrer"
                      target="_blank"
                    />
                  }
                  size="lg"
                  variant="outline"
                >
                  {t("github")}{" "}
                  <IconChevronRightOutline18 className="ml-1 size-4" />
                </Button>
              </Group>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  )
}

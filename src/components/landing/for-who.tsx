"use client"

import { motion } from "motion/react"
import { useTranslations } from "next-intl"

import { springSubtle } from "@/lib/animations"
import { Container, Subheading } from "./primitives"

function AudienceItem({ text, index }: { text: string; index: number }) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-3"
      initial={{ opacity: 0, y: 20 }}
      transition={{ ...springSubtle, delay: 0.1 + index * 0.08 }}
    >
      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground/40" />
      <span className="text-base/7 text-muted-foreground">{text}</span>
    </motion.div>
  )
}

export function ForWho() {
  const t = useTranslations("landing.forWho")

  const audiences = [
    t("audiences.scientists"),
    t("audiences.engineers"),
    t("audiences.analysts"),
    t("audiences.teams"),
  ]

  return (
    <section className="py-16">
      <Container className="flex flex-col gap-10 sm:gap-16">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          transition={springSubtle}
        >
          <Subheading>{t("heading")}</Subheading>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {audiences.map((audience, index) => (
            <AudienceItem index={index} key={audience} text={audience} />
          ))}
        </div>
      </Container>
    </section>
  )
}

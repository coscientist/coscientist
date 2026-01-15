"use client"

import { motion } from "motion/react"
import { useTranslations } from "next-intl"

import { springSubtle } from "@/lib/animations"
import { Container, Eyebrow, Subheading } from "./primitives"

interface FeatureProps {
  title: string
  description: string
  index: number
}

function Feature({ title, description, index }: FeatureProps) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-2"
      initial={{ opacity: 0, y: 20 }}
      transition={{ ...springSubtle, delay: 0.1 + index * 0.1 }}
    >
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="text-muted-foreground text-sm/7">{description}</p>
    </motion.div>
  )
}

export function Features() {
  const t = useTranslations("landing.features")

  const features = [
    {
      title: t("dialecticalGraph.title"),
      description: t("dialecticalGraph.description"),
    },
    {
      title: t("rebuttalFirst.title"),
      description: t("rebuttalFirst.description"),
    },
    {
      title: t("multilingual.title"),
      description: t("multilingual.description"),
    },
  ]

  return (
    <section className="py-16">
      <Container className="flex flex-col gap-10 sm:gap-16">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex max-w-2xl flex-col gap-2"
          initial={{ opacity: 0, y: 20 }}
          transition={springSubtle}
        >
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <Subheading>{t("heading")}</Subheading>
        </motion.div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Feature key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </Container>
    </section>
  )
}

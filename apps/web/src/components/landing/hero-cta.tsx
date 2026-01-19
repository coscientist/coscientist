"use client"

import { ClerkLoaded, ClerkLoading, Waitlist } from "@clerk/nextjs"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { motion, useReducedMotion } from "motion/react"
import Link from "next/link"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { reducedMotionTransition, springSubtle } from "@/lib/animations"

function WaitlistSkeleton() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4 rounded-xl border bg-card p-6">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

export function HeroCTA() {
  const t = useTranslations("landing.hero")
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-6"
      id="waitlist"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      transition={
        prefersReducedMotion
          ? reducedMotionTransition
          : { ...springSubtle, delay: 0.1 }
      }
    >
      <Button render={<Link href="/manifesto" />} size="lg">
        {t("readManifesto")}{" "}
        <HugeiconsIcon
          className="ml-1"
          icon={ArrowRight01Icon}
          size={16}
          strokeWidth={1.5}
        />
      </Button>
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="text-muted-foreground text-sm">or</span>
        <div className="min-h-45">
          <ClerkLoading>
            <WaitlistSkeleton />
          </ClerkLoading>
          <ClerkLoaded>
            <Waitlist />
          </ClerkLoaded>
        </div>
      </div>
    </motion.div>
  )
}

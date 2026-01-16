"use client"

import { motion } from "motion/react"
import type { ComponentProps, ReactNode } from "react"

import { itemVariants, useSectionAnimation } from "@/lib/landing-animations"
import { cn } from "@/lib/utils"
import { AmbientGradient } from "./ambient-gradient"

export function Container({
  children,
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-2xl px-6 md:max-w-3xl lg:max-w-7xl lg:px-10",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function Heading({
  children,
  className,
  ...props
}: ComponentProps<"h1">) {
  return (
    <h1
      className={cn(
        "text-balance font-display text-5xl/12 tracking-tight sm:text-[5rem]/20",
        "text-neutral-950",
        "dark:bg-gradient-to-br dark:from-white dark:via-white dark:to-neutral-400 dark:bg-clip-text dark:text-transparent",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  )
}

export function Subheading({
  children,
  className,
  ...props
}: ComponentProps<"h2">) {
  return (
    <h2
      className={cn(
        "text-pretty text-[2rem]/10 tracking-tight sm:text-5xl/14",
        "text-neutral-950",
        "dark:bg-gradient-to-br dark:from-white dark:via-white dark:to-neutral-400 dark:bg-clip-text dark:text-transparent",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  )
}

export function Eyebrow({
  children,
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "font-semibold text-sm/7",
        "text-neutral-700 dark:text-neutral-400",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function Text({
  children,
  className,
  size = "md",
  ...props
}: ComponentProps<"div"> & { size?: "md" | "lg" }) {
  return (
    <div
      className={cn(
        size === "md" && "text-base/7",
        size === "lg" && "text-lg/8",
        "text-neutral-700 dark:text-neutral-400",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface SectionProps extends Omit<ComponentProps<"section">, "ref"> {
  eyebrow?: ReactNode
  headline?: ReactNode
  subheadline?: ReactNode
  cta?: ReactNode
  animated?: boolean
  gradient?: {
    position?: "top-right" | "bottom-left" | "center"
    color?: "white" | "blue"
  }
}

export function Section({
  eyebrow,
  headline,
  subheadline,
  cta,
  className,
  children,
  animated = false,
  gradient,
  ...props
}: SectionProps) {
  const { ref, isInView, transition } = useSectionAnimation({ amount: 0.2 })

  const content = (
    <>
      {gradient && (
        <AmbientGradient color={gradient.color} position={gradient.position} />
      )}
      <Container className="flex flex-col gap-10 sm:gap-16">
        {headline && (
          <div className="flex max-w-2xl flex-col gap-6">
            <div className="flex flex-col gap-2">
              {eyebrow &&
                (animated ? (
                  <motion.div
                    animate={isInView ? "visible" : "hidden"}
                    initial="hidden"
                    transition={transition}
                    variants={itemVariants}
                  >
                    <Eyebrow>{eyebrow}</Eyebrow>
                  </motion.div>
                ) : (
                  <Eyebrow>{eyebrow}</Eyebrow>
                ))}
              {animated ? (
                <motion.div
                  animate={isInView ? "visible" : "hidden"}
                  initial="hidden"
                  transition={{ ...transition, delay: eyebrow ? 0.1 : 0 }}
                  variants={itemVariants}
                >
                  <Subheading>{headline}</Subheading>
                </motion.div>
              ) : (
                <Subheading>{headline}</Subheading>
              )}
            </div>
            {subheadline &&
              (animated ? (
                <motion.div
                  animate={isInView ? "visible" : "hidden"}
                  initial="hidden"
                  transition={{ ...transition, delay: eyebrow ? 0.2 : 0.1 }}
                  variants={itemVariants}
                >
                  <Text className="text-pretty">{subheadline}</Text>
                </motion.div>
              ) : (
                <Text className="text-pretty">{subheadline}</Text>
              ))}
            {cta}
          </div>
        )}
        {children && <div>{children}</div>}
      </Container>
    </>
  )

  return (
    <section
      className={cn("relative overflow-hidden py-16", className)}
      ref={animated ? (ref as React.RefObject<HTMLElement>) : undefined}
      {...props}
    >
      {content}
    </section>
  )
}

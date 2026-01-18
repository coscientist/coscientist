"use client"

import { motion } from "motion/react"
import type { ComponentProps, ReactNode } from "react"
import { itemVariants, useSectionAnimation } from "@/lib/landing-animations"
import { cn } from "@/lib/utils"
import { AmbientGradient } from "../ambient-gradient"
import { Container } from "./layout"
import { Eyebrow, Subheading, Text } from "./typography"

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

"use client"

import { motion } from "motion/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { springSubtle } from "@/lib/animations"
import { Container, Heading, Text } from "./primitives"

export function Hero() {
  return (
    <section className="py-24 sm:py-32">
      <Container className="flex flex-col items-center gap-8">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          transition={springSubtle}
        >
          <Heading className="max-w-5xl text-center">
            Research at the Speed of Thought
          </Heading>
          <Text className="max-w-xl text-center" size="lg">
            Versioned experiments. Reproducible knowledge. The cognitive
            infrastructure for research.
          </Text>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          transition={{ ...springSubtle, delay: 0.1 }}
        >
          <Button render={<Link href="/manifesto" />} size="lg">
            Enter Manifesto →
          </Button>
          <a
            className="no-underline"
            href="https://github.com/junhoyeo/coscientist"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Button size="lg" variant="outline">
              GitHub →
            </Button>
          </a>
        </motion.div>
      </Container>
    </section>
  )
}

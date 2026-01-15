"use client"

import { motion } from "motion/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { springSubtle } from "@/lib/animations"
import { Container, Subheading } from "./primitives"

export function CTA() {
  return (
    <section className="py-24">
      <Container className="flex flex-col items-center gap-8">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex max-w-3xl flex-col items-center gap-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={springSubtle}
        >
          <Subheading className="text-center">
            The Encyclopedia Galactica was fiction.
            <br />
            We're building the infrastructure.
          </Subheading>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          transition={{ ...springSubtle, delay: 0.1 }}
        >
          <Button render={<Link href="/manifesto" />} size="lg">
            Read the Manifesto →
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

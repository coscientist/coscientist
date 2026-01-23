"use client"

import * as Sentry from "@sentry/nextjs"
import type { Metadata } from "next"
import NextError from "next/error"
import { useEffect } from "react"

export const metadata: Metadata = {
  title: "Error",
}

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string }
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <NextError statusCode={undefined as never} />
      </body>
    </html>
  )
}

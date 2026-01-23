"use client"

import * as Sentry from "@sentry/nextjs"
import type { ErrorComponent } from "next/dist/client/components/error-boundary"
import { useEffect } from "react"

const GlobalError: ErrorComponent = ({ error }) => {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
            Something went wrong
          </h1>
          <p style={{ marginBottom: "1rem", color: "#666" }}>
            We've been notified about this error and are working to fix it.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#000",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            type="button"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}

export default GlobalError

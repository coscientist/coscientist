import * as Sentry from "@sentry/nextjs"

const CHUNK_LOAD_ERROR_REGEX = /ChunkLoadError/i

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  enabled: process.env.NODE_ENV !== "development",

  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  debug: false,

  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
    Sentry.feedbackIntegration({
      colorScheme: "system",
      isNameRequired: true,
      isEmailRequired: true,
    }),
  ],

  tunnel: "/monitoring",

  ignoreErrors: [
    "Non-Error promise rejection captured",
    "ResizeObserver loop limit exceeded",
    "ResizeObserver loop completed with undelivered notifications",
  ],

  beforeSend(event, hint) {
    if (
      event.exception &&
      hint.originalException instanceof Error &&
      hint.originalException.message.match(CHUNK_LOAD_ERROR_REGEX)
    ) {
      return null
    }
    return event
  },
})

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart

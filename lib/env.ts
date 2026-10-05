import { z } from 'zod'

const optional = <T extends z.ZodType>(schema: T) =>
  z.preprocess((value) => (value === '' ? undefined : value), schema.optional())

const envSchema = z
  .object({
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url(),
    DATABASE_URL: z.string().min(1),
    EMAIL_FROM: optional(z.string()),
    RESEND_API_KEY: optional(z.string()),
    VERCEL_ENV: optional(z.enum(['development', 'preview', 'production'])),
  })
  .refine(
    ({ EMAIL_FROM, RESEND_API_KEY, VERCEL_ENV }) =>
      VERCEL_ENV === undefined ||
      VERCEL_ENV === 'development' ||
      Boolean(EMAIL_FROM && RESEND_API_KEY),
    { message: 'preview and production require RESEND_API_KEY and EMAIL_FROM' },
  )

export const env = envSchema.parse(process.env)

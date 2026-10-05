import { passkey } from '@better-auth/passkey'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { APIError, createAuthMiddleware } from 'better-auth/api'
import { emailOTP } from 'better-auth/plugins'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { disposableEmailBlocklistSet } from 'disposable-email-domains-js'
import { createTranslator } from 'use-intl/core'

import { authDb } from '@/lib/auth/db'
import { env } from '@/lib/env'
import { sendEmail } from '@/lib/mail'
import messages from '@/messages/en.json'

const t = createTranslator({ locale: 'en', messages, namespace: 'SignInEmail' })

const disposableDomains = disposableEmailBlocklistSet()

const failedSignInSends = new WeakSet<object>()

const isDisposable = (email: string) => {
  const labels = email.toLowerCase().split('@').at(-1)?.split('.') ?? []
  return labels.some((_, index) => disposableDomains.has(labels.slice(index).join('.')))
}

export const auth = betterAuth({
  advanced: {
    ipAddress: {
      ipAddressHeaders: ['x-vercel-forwarded-for', 'x-forwarded-for'],
    },
  },
  appName: 'coscientist',
  baseURL: env.BETTER_AUTH_URL,
  database: drizzleAdapter(authDb, { provider: 'pg' }),
  disabledPaths: [
    '/email-otp/check-verification-otp',
    '/email-otp/verify-email',
    '/email-otp/request-password-reset',
    '/forget-password/email-otp',
    '/email-otp/reset-password',
    '/email-otp/request-email-change',
    '/email-otp/change-email',
  ],
  hooks: {
    after: createAuthMiddleware((ctx) =>
      failedSignInSends.has(ctx.context)
        ? Promise.reject(
            APIError.from('SERVICE_UNAVAILABLE', {
              code: 'OTP_DELIVERY_FAILED',
              message: 'The sign-in code could not be sent.',
            }),
          )
        : Promise.resolve(),
    ),
    before: createAuthMiddleware(async (ctx) => {
      const email: unknown = ctx.body?.email
      if (
        typeof email === 'string' &&
        isDisposable(email) &&
        !(await ctx.context.internalAdapter.findUserByEmail(email))
      ) {
        throw APIError.from('BAD_REQUEST', {
          code: 'DISPOSABLE_EMAIL',
          message: 'Disposable email addresses are not accepted.',
        })
      }
    }),
  },
  plugins: [
    emailOTP({
      allowedAttempts: 5,
      expiresIn: 300,
      otpLength: 6,
      sendVerificationOTP: async ({ email, otp, type }, ctx) => {
        if (type !== 'sign-in') {
          throw new Error(`auth: coscientist sends only sign-in codes, not ${type} codes`)
        }
        try {
          await sendEmail({ subject: t('subject', { otp }), text: t('text', { otp }), to: email })
        } catch (error) {
          if (ctx) {
            failedSignInSends.add(ctx.context)
          }
          throw error
        }
      },
      storeOTP: 'hashed',
    }),
    passkey({ rpID: new URL(env.BETTER_AUTH_URL).hostname, rpName: 'coscientist' }),
    tanstackStartCookies(),
  ],
  rateLimit: { enabled: true, storage: 'database' },
})

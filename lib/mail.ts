import { Resend } from 'resend'

import { env } from '@/lib/env'

const TEST_MAIL_LINE = 'This email comes from a TEST setup.'

const isTestMail = env.VERCEL_ENV !== 'production'

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : undefined

export const sendEmail = async ({
  subject,
  text,
  to,
}: {
  subject: string
  text: string
  to: string
}) => {
  const message = isTestMail
    ? { subject: `[TEST] ${subject}`, text: `${TEST_MAIL_LINE}\n\n${text}` }
    : { subject, text }
  if (!(resend && env.EMAIL_FROM)) {
    console.info(`[mail] to ${to}: ${message.subject}\n${message.text}`)
    return
  }
  const { error } = await resend.emails.send(
    { from: env.EMAIL_FROM, ...message, to: [to] },
    { signal: AbortSignal.timeout(30_000) },
  )
  if (error) {
    throw new Error(`mail: Resend refused the message (${error.name}: ${error.message})`)
  }
}

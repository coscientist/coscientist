import { createFileRoute, redirect } from '@tanstack/react-router'
import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import { useTranslations } from 'use-intl'

import { emailOtp, signIn } from '@/lib/auth-client'
import { otpLength, otpMinutes } from '@/lib/auth/otp'
import { fetchViewer } from '@/lib/auth/session'
import { translate } from '@/lib/i18n'

const finish = () => {
  globalThis.location.assign('/')
}

interface SentCode {
  address: string
  expiresAt: number
}

const SignInPage = () => {
  const t = useTranslations('SignIn')
  const sentId = useId()
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [sent, setSent] = useState<SentCode | null>(null)
  const [pending, setPending] = useState(false)
  const [alert, setAlert] = useState<string | null>(null)

  const run = async (action: () => Promise<string | null>) => {
    setPending(true)
    setAlert(null)
    try {
      setAlert(await action())
    } catch (error) {
      console.error(error)
      setAlert(t('unexpected'))
    }
    setPending(false)
  }

  const describe = (failure: { code?: string; status: number }, fallback: string) => {
    if (failure.status === 429) {
      return t('tooManyRequests')
    }
    switch (failure.code) {
      case 'DISPOSABLE_EMAIL': {
        return t('disposableEmail')
      }
      case 'INVALID_EMAIL': {
        return t('invalidEmail')
      }
      default: {
        return fallback
      }
    }
  }

  const sendCode = (event: FormEvent) => {
    event.preventDefault()
    void run(async () => {
      const expiresAt = Date.now() + otpMinutes * 60_000
      const result = await emailOtp.sendVerificationOtp({ email, type: 'sign-in' })
      if (result.error) {
        return describe(result.error, t('sendFailed'))
      }
      setCode('')
      setSent({ address: email, expiresAt })
      return null
    })
  }

  const verify = (current: SentCode) => (event: FormEvent) => {
    event.preventDefault()
    void run(async () => {
      if (code.length < otpLength) {
        return t('codeIncomplete', { length: otpLength })
      }
      const result = await signIn.emailOtp({ email: current.address, otp: code })
      if (
        result.error &&
        (Date.now() >= current.expiresAt ||
          result.error.code === 'OTP_EXPIRED' ||
          result.error.code === 'TOO_MANY_ATTEMPTS')
      ) {
        setSent(null)
        return t('codeExpired')
      }
      if (result.error) {
        return describe(result.error, t('failed'))
      }
      finish()
      return null
    })
  }

  const passkeySignIn = () => {
    void run(async () => {
      const result = await signIn.passkey()
      if (result?.error) {
        return t('passkeyFailed')
      }
      finish()
      return null
    })
  }

  return (
    <main className="mx-auto flex max-w-sm flex-col gap-6 p-6">
      <h1 className="text-xl font-semibold">{t('title')}</h1>
      {sent === null ? (
        <form className="flex flex-col gap-3" method="post" onSubmit={sendCode}>
          <label className="flex flex-col gap-1">
            <span>{t('email')}</span>
            <input
              autoComplete="email"
              className="rounded border px-2 py-1"
              name="email"
              onChange={(event) => {
                setEmail(event.target.value)
                setAlert(null)
              }}
              readOnly={pending}
              required
              type="email"
              value={email}
            />
          </label>
          <button
            className="rounded bg-neutral-900 px-3 py-1 text-white disabled:opacity-50"
            disabled={pending}
            type="submit"
          >
            {t('sendCode')}
          </button>
        </form>
      ) : (
        <form className="flex flex-col gap-3" onSubmit={verify(sent)}>
          <p id={sentId}>{t('codeSent', { email: sent.address, length: otpLength })}</p>
          <label className="flex flex-col gap-1">
            <span>{t('code')}</span>
            <input
              aria-describedby={sentId}
              autoComplete="one-time-code"
              autoFocus
              className="rounded border px-2 py-1 tracking-widest"
              inputMode="numeric"
              name="code"
              onChange={(event) => {
                const next = [...event.target.value]
                  .filter((character) => '0123456789'.includes(character))
                  .join('')
                  .slice(0, otpLength)
                if (next !== code) {
                  setCode(next)
                  setAlert(null)
                }
              }}
              readOnly={pending}
              required
              value={code}
            />
          </label>
          <button
            className="rounded bg-neutral-900 px-3 py-1 text-white disabled:opacity-50"
            disabled={pending}
            type="submit"
          >
            {t('verify')}
          </button>
          <button
            className="self-start underline disabled:opacity-50"
            disabled={pending}
            onClick={() => {
              setSent(null)
              setAlert(null)
            }}
            type="button"
          >
            {t('differentEmail')}
          </button>
        </form>
      )}
      {alert ? (
        <p className="text-red-700" role="alert">
          {alert}
        </p>
      ) : null}
      <button
        className="rounded border px-3 py-1 disabled:opacity-50"
        disabled={pending}
        onClick={passkeySignIn}
        type="button"
      >
        {t('passkey')}
      </button>
    </main>
  )
}

export const Route = createFileRoute('/sign-in')({
  beforeLoad: async () => {
    if (await fetchViewer()) {
      throw redirect({ to: '/' })
    }
  },
  component: SignInPage,
  head: () => ({ meta: [{ title: translate('SignIn.title') }] }),
})

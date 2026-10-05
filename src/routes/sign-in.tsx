import { createFileRoute, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useTranslations } from 'use-intl'

import { emailOtp, signIn } from '@/lib/auth-client'
import { otpLength } from '@/lib/auth/otp'
import { fetchViewer } from '@/lib/auth/session'
import { translate } from '@/lib/i18n'

const finish = () => {
  globalThis.location.assign('/')
}

const SignInPage = () => {
  const t = useTranslations('SignIn')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'code' | 'email'>('email')
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
      case 'OTP_EXPIRED':
      case 'TOO_MANY_ATTEMPTS': {
        return t('codeExpired')
      }
      default: {
        return fallback
      }
    }
  }

  const sendCode = (event: FormEvent) => {
    event.preventDefault()
    void run(async () => {
      const result = await emailOtp.sendVerificationOtp({ email, type: 'sign-in' })
      if (result.error) {
        return describe(result.error, t('sendFailed'))
      }
      setCode('')
      setStep('code')
      return null
    })
  }

  const verify = (event: FormEvent) => {
    event.preventDefault()
    void run(async () => {
      if (code.length < otpLength) {
        return t('codeIncomplete', { length: otpLength })
      }
      const result = await signIn.emailOtp({ email, otp: code })
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
      {step === 'email' ? (
        <form className="flex flex-col gap-3" onSubmit={sendCode}>
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
        <form className="flex flex-col gap-3" onSubmit={verify}>
          <p>{t('codeSent', { email, length: otpLength })}</p>
          <label className="flex flex-col gap-1">
            <span>{t('code')}</span>
            <input
              autoComplete="one-time-code"
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
              setStep('email')
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

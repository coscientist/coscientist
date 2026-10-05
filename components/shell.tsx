import { Link, useRouter } from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useTranslations } from 'use-intl'

export const ErrorPage = ({ error, reset }: ErrorComponentProps) => {
  const t = useTranslations('Error')
  const router = useRouter()

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="mx-auto flex max-w-xl flex-col gap-4 p-6">
      <h1 className="text-xl font-semibold">{t('title')}</h1>
      <button
        className="self-start rounded border px-3 py-1"
        onClick={() => {
          reset()
          void router.invalidate()
        }}
        type="button"
      >
        {t('retry')}
      </button>
    </main>
  )
}

export const NotFoundPage = () => {
  const t = useTranslations('NotFound')

  return (
    <main className="mx-auto flex max-w-xl flex-col gap-4 p-6">
      <h1 className="text-xl font-semibold">{t('title')}</h1>
      <Link className="underline" to="/">
        {t('home')}
      </Link>
    </main>
  )
}

import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslations } from 'use-intl'

import { passkey, signOut } from '@/lib/auth-client'
import { createNoteFn, listNotesFn } from '@/lib/notes/functions'

const leave = async () => {
  await signOut()
  globalThis.location.assign('/sign-in')
}

const NotesPage = () => {
  const t = useTranslations('Notes')
  const { dangling, notes } = Route.useLoaderData()
  const navigate = useNavigate()
  const [pending, setPending] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  const newNote = async () => {
    setPending(true)
    setStatus(null)
    try {
      const note = await createNoteFn()
      await navigate({ params: { noteId: note.id }, to: '/notes/$noteId' })
    } catch (error) {
      console.error(error)
      setStatus(t('createFailed'))
    }
    setPending(false)
  }

  const addPasskey = async () => {
    const result = await passkey.addPasskey()
    setStatus(result?.error ? t('passkeyFailed') : t('passkeyAdded'))
  }

  const danglingNotes = new Map(dangling.map((link) => [link.sourceNoteId, link.sourceTitle]))

  return (
    <main className="mx-auto flex max-w-xl flex-col gap-6 p-6">
      <header className="flex flex-wrap items-center gap-3">
        <h1 className="mr-auto text-xl font-semibold">{t('title')}</h1>
        <button
          className="rounded bg-neutral-900 px-3 py-1 text-white disabled:opacity-50"
          disabled={pending}
          onClick={newNote}
          type="button"
        >
          {t('newNote')}
        </button>
        <button className="rounded border px-3 py-1" onClick={addPasskey} type="button">
          {t('addPasskey')}
        </button>
        <button className="rounded border px-3 py-1" onClick={leave} type="button">
          {t('signOut')}
        </button>
      </header>
      {status ? <output className="text-sm">{status}</output> : null}
      {notes.length === 0 ? (
        <p className="text-neutral-600">{t('empty')}</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {notes.map((note) => (
            <li key={note.id}>
              <Link className="underline" params={{ noteId: note.id }} to="/notes/$noteId">
                {note.title || t('untitled')}
              </Link>
            </li>
          ))}
        </ul>
      )}
      {danglingNotes.size > 0 ? (
        <section className="flex flex-col gap-2 border-t pt-4">
          <h2 className="font-semibold">{t('dangling')}</h2>
          <ul className="flex flex-col gap-1">
            {[...danglingNotes].map(([noteId, title]) => (
              <li key={noteId}>
                <Link className="underline" params={{ noteId }} to="/notes/$noteId">
                  {title || t('untitled')}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  )
}

export const Route = createFileRoute('/')({
  loader: () => listNotesFn(),
  component: NotesPage,
})

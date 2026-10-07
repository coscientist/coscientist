import type { JSONContent } from '@tiptap/core'
import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { Effect } from 'effect'
import { z } from 'zod'

import { viewerMiddleware } from '@/lib/auth/session'
import { hasNul } from '@/lib/notes/document'
import { createNote, getNotePage, listNotes, saveNote } from '@/lib/notes/store'

const noteInput = z.object({ noteId: z.uuid() })

const documentInput = z.custom<JSONContent>(
  (value) => typeof value === 'object' && value !== null && !Array.isArray(value),
)

export const listNotesFn = createServerFn({ method: 'GET' })
  .middleware([viewerMiddleware])
  .handler(({ context }) => Effect.runPromise(listNotes(context.viewer.id)))

export const createNoteFn = createServerFn({ method: 'POST' })
  .middleware([viewerMiddleware])
  .handler(({ context }) => Effect.runPromise(createNote(context.viewer.id)))

export const getNotePageFn = createServerFn({ method: 'GET' })
  .middleware([viewerMiddleware])
  .validator((input: { noteId: string }) => {
    const parsed = noteInput.safeParse(input)
    if (!parsed.success) {
      throw notFound()
    }
    return parsed.data
  })
  .handler(async ({ context, data }) => {
    const page = await Effect.runPromise(getNotePage(context.viewer.id, data.noteId))
    if (!page) {
      throw notFound()
    }
    return page
  })

export const saveNoteFn = createServerFn({ method: 'POST' })
  .middleware([viewerMiddleware])
  .validator(
    noteInput.extend({
      baseRevision: z.int32().positive(),
      doc: documentInput,
      title: z
        .string()
        .max(500)
        .refine((title) => !hasNul(title), 'The title holds U+0000'),
    }),
  )
  .handler(({ context, data }) => Effect.runPromise(saveNote(context.viewer.id, data)))

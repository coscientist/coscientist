import type { JSONContent } from '@tiptap/core'
import { betterAuth } from 'better-auth'
import { testUtils } from 'better-auth/plugins'
import { Effect } from 'effect'

import { auth } from '@/lib/auth'
import { createNote, saveNote } from '@/lib/notes/store'
import { sql } from '@/lib/pg'

const block = (type: string, content: JSONContent[], attrs: Record<string, unknown> = {}) => ({
  attrs: { ...attrs, id: crypto.randomUUID() },
  content,
  type,
})

const text = (value: string, href?: string): JSONContent =>
  href
    ? { marks: [{ attrs: { href }, type: 'link' }], text: value, type: 'text' }
    : { text: value, type: 'text' }

const pageLink = (noteId: string, label: string): JSONContent => ({
  attrs: { label, noteId },
  type: 'pageLink',
})

const transclusion = (noteId: string) => ({
  attrs: { id: crypto.randomUUID(), noteId },
  type: 'transclusion',
})

const doc = (...content: JSONContent[]): JSONContent => ({ content, type: 'doc' })

const { test } = await betterAuth({ ...auth.options, plugins: [testUtils()] }).$context

const seedAccount = async (email: string, name: string) => {
  const user = await test.saveUser(test.createUser({ email, emailVerified: true, name }))
  return { cookies: await test.getCookies({ userId: user.id }), email, id: user.id, name }
}

const alice = await seedAccount('alice@example.test', 'QA Alice')
const bob = await seedAccount('bob@example.test', 'QA Bob')

const create = async (ownerId: string) => {
  const note = await Effect.runPromise(createNote(ownerId))
  return note.id
}

const save = async (ownerId: string, noteId: string, title: string, content: JSONContent) => {
  const result = await Effect.runPromise(
    saveNote(ownerId, { baseRevision: 1, doc: content, noteId, title }),
  )
  if (result.status !== 'saved') {
    throw new Error(`seed: saving ${title} returned ${result.status}`)
  }
  return { path: `/notes/${noteId}`, title }
}

const [questions, reading, summary, untitled] = await Promise.all([
  create(alice.id),
  create(alice.id),
  create(alice.id),
  create(alice.id),
])
const [bobIndex, bobDraft] = await Promise.all([create(bob.id), create(bob.id)])
const deletedNote = crypto.randomUUID()

const aliceNotes = [
  await save(
    alice.id,
    questions,
    'Research questions',
    doc(
      block('heading', [text('Open questions')], { level: 2 }),
      block('paragraph', [
        text('Start with the '),
        pageLink(reading, 'Reading list'),
        text(', then check the note on '),
        pageLink(deletedNote, 'Deleted note'),
        text(', which no longer exists.'),
      ]),
      transclusion(summary),
      block('codeBlock', [text('const hypothesis = "notes link to notes"')], {
        language: 'ts',
      }),
    ),
  ),
  await save(
    alice.id,
    reading,
    'Reading list',
    doc(
      block('paragraph', [
        text('Read '),
        text('the example page', 'https://example.com'),
        text(' and go back to '),
        pageLink(questions, 'Research questions'),
        text('.'),
      ]),
    ),
  ),
  await save(
    alice.id,
    summary,
    'Weekly summary',
    doc(
      block('paragraph', [text('This week covered three papers and one failed experiment.')]),
      block('paragraph', [text('The summary also points to '), pageLink(reading, 'Reading list')]),
    ),
  ),
  await save(alice.id, untitled, '', doc(block('paragraph', [text('A note without a title.')]))),
]

const bobNotes = [
  await save(
    bob.id,
    bobIndex,
    'Bob index',
    doc(
      block('paragraph', [
        text('A link to a note of another account: '),
        pageLink(questions, 'Research questions'),
      ]),
      transclusion(summary),
      block('paragraph', [text('My own draft: '), pageLink(bobDraft, 'Bob draft')]),
    ),
  ),
  await save(bob.id, bobDraft, 'Bob draft', doc(block('paragraph', [text('Draft text.')]))),
]

await sql.end()

console.log(
  JSON.stringify({
    accounts: [
      { ...alice, notes: aliceNotes },
      { ...bob, notes: bobNotes },
    ],
  }),
)

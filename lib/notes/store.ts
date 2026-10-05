import type { JSONContent } from '@tiptap/core'
import { and, asc, desc, eq, inArray, isNull, ne, sql } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'
import { Array, Effect } from 'effect'

import { emptyDocument, InvalidDocument, readDocument } from '@/lib/notes/document'
import type { DocumentContent } from '@/lib/notes/document'
import { noteBlocks, noteLinks, noteRevisions, notes } from '@/lib/notes/schema'
import { withTenant } from '@/lib/tenant'
import type { TenantTx } from '@/lib/tenant'

export type SaveResult =
  | { revision: number; status: 'saved' }
  | { revision: number; status: 'conflict' }
  | { status: 'not-found' }

interface Revision {
  actorId: string
  content: DocumentContent
  noteId: string
  ownerId: string
  revision: number
  title: string
}

const insertBatchRows = 1000

const insertInSequence = async <Row>(
  [batch, ...rest]: Row[][],
  insert: (rows: Row[]) => Promise<unknown>,
): Promise<void> => {
  if (batch) {
    await insert(batch)
    await insertInSequence(rest, insert)
  }
}

const writeContent = async (
  tx: TenantTx,
  { actorId, content, noteId, ownerId, revision, title }: Revision,
) => {
  await tx.delete(noteBlocks).where(eq(noteBlocks.noteId, noteId))
  await insertInSequence(Array.chunksOf(content.blocks, insertBatchRows), (blocks) =>
    tx.insert(noteBlocks).values(blocks.map((block) => ({ ...block, noteId, ownerId }))),
  )
  await insertInSequence(Array.chunksOf(content.links, insertBatchRows), (links) =>
    tx.insert(noteLinks).values(links.map((link) => ({ ...link, ownerId, sourceNoteId: noteId }))),
  )
  await tx
    .insert(noteRevisions)
    .values({ actorId, doc: content.doc, noteId, ownerId, revision, title })
}

export const backlinksQuery = (tx: TenantTx, noteId: string) =>
  tx
    .selectDistinct({ id: notes.id, title: notes.title })
    .from(noteLinks)
    .innerJoin(notes, eq(notes.id, noteLinks.sourceNoteId))
    .where(and(eq(noteLinks.targetNoteId, noteId), ne(noteLinks.sourceNoteId, noteId)))
    .orderBy(asc(notes.title), asc(notes.id))

export const danglingLinksQuery = (tx: TenantTx) => {
  const source = alias(notes, 'source')
  const target = alias(notes, 'target')
  return tx
    .selectDistinct({
      sourceNoteId: noteLinks.sourceNoteId,
      sourceTitle: source.title,
      targetNoteId: noteLinks.targetNoteId,
    })
    .from(noteLinks)
    .innerJoin(source, eq(source.id, noteLinks.sourceNoteId))
    .leftJoin(target, eq(target.id, noteLinks.targetNoteId))
    .where(isNull(target.id))
    .orderBy(asc(source.title), asc(noteLinks.sourceNoteId), asc(noteLinks.targetNoteId))
}

const linkTargets = (tx: TenantTx, sourceNoteIds: string[], kind?: 'transclusion') =>
  tx
    .select({ id: noteLinks.targetNoteId })
    .from(noteLinks)
    .where(
      and(
        inArray(noteLinks.sourceNoteId, sourceNoteIds),
        kind ? eq(noteLinks.kind, kind) : undefined,
      ),
    )

export const listNotes = (viewerId: string) =>
  withTenant(viewerId, async (tx) => ({
    dangling: await danglingLinksQuery(tx),
    notes: await tx
      .select({ id: notes.id, title: notes.title, updatedAt: notes.updatedAt })
      .from(notes)
      .orderBy(desc(notes.updatedAt), desc(notes.id)),
  }))

export const createNote = (viewerId: string) =>
  withTenant(viewerId, async (tx) => {
    const content = readDocument(emptyDocument())
    const [note] = await tx
      .insert(notes)
      .values({ doc: content.doc, ownerId: viewerId, revision: 1, title: '' })
      .returning({ id: notes.id })
    if (!note) {
      throw new Error('notes: the insert returned no row')
    }
    await writeContent(tx, {
      actorId: viewerId,
      content,
      noteId: note.id,
      ownerId: viewerId,
      revision: 1,
      title: '',
    })
    return note
  })

export const saveNote = (
  viewerId: string,
  input: { baseRevision: number; doc: JSONContent; noteId: string; title: string },
) =>
  Effect.gen(function* save() {
    const content = yield* Effect.try({
      catch: (cause) => new InvalidDocument({ cause }),
      try: () => readDocument(input.doc),
    })
    return yield* withTenant(viewerId, async (tx): Promise<SaveResult> => {
      const [saved] = await tx
        .update(notes)
        .set({
          doc: content.doc,
          revision: sql`${notes.revision} + 1`,
          title: input.title,
          updatedAt: sql`now()`,
        })
        .where(and(eq(notes.id, input.noteId), eq(notes.revision, input.baseRevision)))
        .returning({ ownerId: notes.ownerId, revision: notes.revision })
      if (!saved) {
        const [current] = await tx
          .select({ revision: notes.revision })
          .from(notes)
          .where(eq(notes.id, input.noteId))
        return current
          ? { revision: current.revision, status: 'conflict' }
          : { status: 'not-found' }
      }
      await writeContent(tx, {
        actorId: viewerId,
        content,
        noteId: input.noteId,
        ownerId: saved.ownerId,
        revision: saved.revision,
        title: input.title,
      })
      return { revision: saved.revision, status: 'saved' }
    })
  })

export const getNotePage = (viewerId: string, noteId: string) =>
  withTenant(viewerId, async (tx) => {
    const [note] = await tx
      .select({ doc: notes.doc, id: notes.id, revision: notes.revision, title: notes.title })
      .from(notes)
      .where(eq(notes.id, noteId))
    if (!note) {
      return
    }
    const transcluded = await tx
      .select({ doc: notes.doc, id: notes.id, title: notes.title })
      .from(notes)
      .where(inArray(notes.id, linkTargets(tx, [noteId], 'transclusion')))
    const linked = await tx
      .select({ id: notes.id, title: notes.title })
      .from(notes)
      .where(
        inArray(notes.id, linkTargets(tx, [noteId, ...transcluded.map((target) => target.id)])),
      )
    return { backlinks: await backlinksQuery(tx, noteId), linked, note, transcluded }
  })

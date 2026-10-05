import type { JSONContent } from '@tiptap/core'
import { sql } from 'drizzle-orm'
import {
  foreignKey,
  index,
  integer,
  jsonb,
  pgEnum,
  pgPolicy,
  pgTable,
  primaryKey,
  text,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core'
import type { AnyPgColumn } from 'drizzle-orm/pg-core'

import { user } from '@/lib/auth/schema'

const viewerId = sql`(select current_setting('app.viewer_id', true))`

const ownerOnly = (name: string, ownerId: AnyPgColumn) =>
  pgPolicy(`${name}_owner_only`, {
    for: 'all',
    using: sql`${ownerId} = ${viewerId}`,
    withCheck: sql`${ownerId} = ${viewerId}`,
  })

export const notes = pgTable(
  'notes',
  {
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    doc: jsonb('doc').$type<JSONContent>().notNull(),
    id: uuid('id')
      .default(sql`uuidv7()`)
      .primaryKey(),
    ownerId: text('owner_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    revision: integer('revision').notNull(),
    title: text('title').notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    unique('notes_id_owner_id_unique').on(table.id, table.ownerId),
    index('notes_owner_id_updated_at_idx').on(table.ownerId, table.updatedAt.desc()),
    ownerOnly('notes', table.ownerId),
  ],
)

export const noteBlocks = pgTable(
  'note_blocks',
  {
    blockId: uuid('block_id').notNull(),
    noteId: uuid('note_id').notNull(),
    ownerId: text('owner_id').notNull(),
    position: integer('position').notNull(),
    text: text('text').notNull(),
    type: text('type').notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.noteId, table.blockId] }),
    foreignKey({
      columns: [table.noteId, table.ownerId],
      foreignColumns: [notes.id, notes.ownerId],
      name: 'note_blocks_note_fk',
    }).onDelete('cascade'),
    ownerOnly('note_blocks', table.ownerId),
  ],
)

export const noteLinkKind = pgEnum('note_link_kind', ['link', 'transclusion'])

export const noteLinks = pgTable(
  'note_links',
  {
    kind: noteLinkKind('kind').notNull(),
    ownerId: text('owner_id').notNull(),
    sourceBlockId: uuid('source_block_id').notNull(),
    sourceNoteId: uuid('source_note_id').notNull(),
    targetNoteId: uuid('target_note_id').notNull(),
  },
  (table) => [
    primaryKey({
      columns: [table.sourceNoteId, table.sourceBlockId, table.targetNoteId, table.kind],
      name: 'note_links_pk',
    }),
    foreignKey({
      columns: [table.sourceNoteId, table.ownerId],
      foreignColumns: [notes.id, notes.ownerId],
      name: 'note_links_note_fk',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.sourceNoteId, table.sourceBlockId],
      foreignColumns: [noteBlocks.noteId, noteBlocks.blockId],
      name: 'note_links_block_fk',
    }).onDelete('cascade'),
    index('note_links_owner_id_target_note_id_idx').on(table.ownerId, table.targetNoteId),
    ownerOnly('note_links', table.ownerId),
  ],
)

export const noteRevisions = pgTable(
  'note_revisions',
  {
    actorId: text('actor_id')
      .notNull()
      .references(() => user.id),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    doc: jsonb('doc').$type<JSONContent>().notNull(),
    noteId: uuid('note_id').notNull(),
    ownerId: text('owner_id').notNull(),
    revision: integer('revision').notNull(),
    title: text('title').notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.noteId, table.revision] }),
    foreignKey({
      columns: [table.noteId, table.ownerId],
      foreignColumns: [notes.id, notes.ownerId],
      name: 'note_revisions_note_fk',
    }).onDelete('cascade'),
    ownerOnly('note_revisions', table.ownerId),
  ],
)

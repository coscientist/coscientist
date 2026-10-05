import { getText, getTextSerializersFromSchema } from '@tiptap/core'
import type { JSONContent } from '@tiptap/core'
import { Data } from 'effect'
import { z } from 'zod'

import { blockTypes, schema } from '@/lib/editor/schema'

export class InvalidDocument extends Data.TaggedError('InvalidDocument')<{
  readonly cause: unknown
}> {}

const blockId = z.uuid()

const textSerializers = getTextSerializersFromSchema(schema)

interface Block {
  blockId: string
  position: number
  text: string
  type: string
}

interface Link {
  kind: 'link' | 'transclusion'
  sourceBlockId: string
  targetNoteId: string
}

export interface DocumentContent {
  blocks: Block[]
  doc: JSONContent
  links: Link[]
}

export const emptyDocument = (): JSONContent => ({
  content: [{ attrs: { id: crypto.randomUUID() }, type: 'paragraph' }],
  type: 'doc',
})

export const readDocument = (json: JSONContent): DocumentContent => {
  const doc = schema.nodeFromJSON(json)
  doc.check()
  const blocks: Block[] = []
  const blockIds = new Set<string>()
  const links = new Map<string, Link>()
  const addLink = (link: Link) => {
    links.set(`${link.kind} ${link.sourceBlockId} ${link.targetNoteId}`, link)
  }
  doc.descendants((node, _position, parent) => {
    if (blockTypes.has(node.type.name)) {
      const id = blockId.parse(node.attrs.id)
      if (blockIds.has(id)) {
        throw new Error(`document: the block id ${id} appears more than once`)
      }
      blockIds.add(id)
      blocks.push({
        blockId: id,
        position: blocks.length,
        text: getText(node, { blockSeparator: '\n', textSerializers }),
        type: node.type.name,
      })
    }
    if (node.type.name === 'pageLink') {
      addLink({ kind: 'link', sourceBlockId: parent?.attrs.id, targetNoteId: node.attrs.noteId })
    }
    if (node.type.name === 'transclusion') {
      addLink({
        kind: 'transclusion',
        sourceBlockId: node.attrs.id,
        targetNoteId: node.attrs.noteId,
      })
    }
  })
  return { blocks, doc: doc.toJSON(), links: [...links.values()] }
}

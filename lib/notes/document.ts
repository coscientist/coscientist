import { getText, getTextSerializersFromSchema } from '@tiptap/core'
import type { JSONContent } from '@tiptap/core'
import type { Node as ProseMirrorNode } from '@tiptap/pm/model'
import { Data } from 'effect'

import { blockTypes, schema, uuid } from '@/lib/editor/schema'

export class InvalidDocument extends Data.TaggedError('InvalidDocument')<{
  readonly cause: unknown
}> {}

const attributeTypes: ReadonlySet<string> = new Set(['boolean', 'number', 'string'])

const maxDepth = 100

const checkAttributes = (kind: string, name: string, attrs: Readonly<Record<string, unknown>>) => {
  for (const [attribute, value] of Object.entries(attrs)) {
    if (value !== null && !attributeTypes.has(typeof value)) {
      throw new Error(
        `document: the attribute ${attribute} of the ${kind} ${name} is not a string, a number, a boolean, or null`,
      )
    }
  }
}

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
  if (doc.type !== schema.topNodeType) {
    throw new Error(`document: the root node is ${doc.type.name}, not ${schema.topNodeType.name}`)
  }
  if (doc.marks.length > 0) {
    throw new Error('document: the root node has marks')
  }
  doc.check()
  const blocks: Block[] = []
  const blockIds = new Set<string>()
  const links = new Map<string, Link>()
  const addLink = (link: Link) => {
    links.set(`${link.kind} ${link.sourceBlockId} ${link.targetNoteId}`, link)
  }
  const visit = (node: ProseMirrorNode, parent: ProseMirrorNode, depth: number) => {
    if (depth >= maxDepth) {
      throw new Error(`document: a node is nested more than ${maxDepth} levels deep`)
    }
    checkAttributes('node', node.type.name, node.attrs)
    for (const mark of node.marks) {
      checkAttributes('mark', mark.type.name, mark.attrs)
    }
    if (blockTypes.has(node.type.name)) {
      const id = uuid.parse(node.attrs.id)
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
      addLink({ kind: 'link', sourceBlockId: parent.attrs.id, targetNoteId: node.attrs.noteId })
    }
    if (node.type.name === 'transclusion') {
      addLink({
        kind: 'transclusion',
        sourceBlockId: node.attrs.id,
        targetNoteId: node.attrs.noteId,
      })
    }
    for (const child of node.children) {
      visit(child, node, depth + 1)
    }
  }
  for (const child of doc.children) {
    visit(child, doc, 0)
  }
  return { blocks, doc: doc.toJSON(), links: [...links.values()] }
}

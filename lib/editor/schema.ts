import { getSchema, mergeAttributes, Node } from '@tiptap/core'
import { isAllowedUri, Link } from '@tiptap/extension-link'
import { UniqueID } from '@tiptap/extension-unique-id'
import { StarterKit } from '@tiptap/starter-kit'
import { z } from 'zod'

export const uuid = z.uuid().lowercase('the UUID is not lowercase')

const validateNoteId = (value: unknown) => {
  uuid.parse(value)
}

const validateHref = (value: unknown) => {
  if (value !== null && (typeof value !== 'string' || !isAllowedUri(value))) {
    throw new Error('link: the href uses a protocol that is not allowed')
  }
}

export const blockTypes: ReadonlySet<string> = new Set([
  'codeBlock',
  'heading',
  'horizontalRule',
  'paragraph',
  'transclusion',
])

const SafeLink = Link.extend({
  addAttributes() {
    const attributes = this.parent?.() ?? {}
    return { ...attributes, href: { ...attributes.href, validate: validateHref } }
  },
})

export const PageLink = Node.create({
  addAttributes() {
    return {
      label: { default: null, rendered: false, validate: 'string|null' },
      noteId: { isRequired: true, rendered: false, validate: validateNoteId },
    }
  },
  atom: true,
  group: 'inline',
  inline: true,
  name: 'pageLink',
  parseHTML() {
    return [
      {
        getAttrs: (element) => ({
          label: element.textContent,
          noteId: element.dataset.noteId,
        }),
        tag: 'span[data-page-link]',
      },
    ]
  },
  renderHTML({ HTMLAttributes, node }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes, { 'data-note-id': node.attrs.noteId, 'data-page-link': '' }),
      node.attrs.label ?? node.attrs.noteId,
    ]
  },
  renderText({ node }) {
    return `[[${node.attrs.label ?? node.attrs.noteId}]]`
  },
})

export const Transclusion = Node.create({
  addAttributes() {
    return { noteId: { isRequired: true, rendered: false, validate: validateNoteId } }
  },
  atom: true,
  group: 'block',
  name: 'transclusion',
  parseHTML() {
    return [
      {
        getAttrs: (element) => ({ noteId: element.dataset.noteId }),
        tag: 'div[data-transclusion]',
      },
    ]
  },
  renderHTML({ HTMLAttributes, node }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, {
        'data-note-id': node.attrs.noteId,
        'data-transclusion': '',
      }),
    ]
  },
})

export const extensions = [
  StarterKit.configure({ link: false }),
  SafeLink,
  PageLink,
  Transclusion,
  UniqueID.configure({ types: [...blockTypes] }),
]

export const schema = getSchema(extensions)

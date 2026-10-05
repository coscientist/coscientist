import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import type { JSONContent } from '@tiptap/core'
import type { Node as ProseMirrorNode } from '@tiptap/pm/model'
import { renderToReactElement } from '@tiptap/static-renderer/pm/react'
import { createContext, use, useMemo } from 'react'
import type { ReactNode } from 'react'
import { useTranslations } from 'use-intl'

import { extensions } from '@/lib/editor/schema'
import { getNotePageFn, noteInput } from '@/lib/notes/functions'

interface Targets {
  embeds: ReadonlyMap<string, { doc: JSONContent; id: string; title: string }>
  titles: ReadonlyMap<string, string>
}

const TargetsContext = createContext<Targets>({ embeds: new Map(), titles: new Map() })

interface NodeViewProps {
  node: ProseMirrorNode
}

type NodeMapping = Record<string, (props: NodeViewProps) => ReactNode>

const NoteLink = ({ noteId }: { noteId: string }) => {
  const t = useTranslations('Note')
  const title = use(TargetsContext).titles.get(noteId)
  if (title === undefined) {
    return <span className="text-neutral-500">{t('missingNote')}</span>
  }
  return (
    <Link className="underline" params={{ noteId }} to="/notes/$noteId">
      {title || t('untitled')}
    </Link>
  )
}

const PageLinkView = ({ node }: NodeViewProps) => <NoteLink noteId={node.attrs.noteId} />

const NestedTransclusionView = ({ node }: NodeViewProps) => (
  <p>
    <NoteLink noteId={node.attrs.noteId} />
  </p>
)

const renderDocument = (content: JSONContent, nodeMapping: NodeMapping) =>
  renderToReactElement({ content, extensions, options: { nodeMapping } })

const nestedMapping: NodeMapping = {
  pageLink: PageLinkView,
  transclusion: NestedTransclusionView,
}

const TransclusionView = ({ node }: NodeViewProps) => {
  const t = useTranslations('Note')
  const embed = use(TargetsContext).embeds.get(node.attrs.noteId)
  if (!embed) {
    return <p className="text-neutral-500">{t('missingNote')}</p>
  }
  return (
    <section className="my-3 flex flex-col gap-2 border-l-2 border-neutral-300 pl-3">
      <NoteLink noteId={embed.id} />
      {renderDocument(embed.doc, nestedMapping)}
    </section>
  )
}

const mapping: NodeMapping = { pageLink: PageLinkView, transclusion: TransclusionView }

const NotePage = () => {
  const t = useTranslations('Note')
  const { backlinks, linked, note, transcluded } = Route.useLoaderData()
  const targets = useMemo(
    () => ({
      embeds: new Map(transcluded.map((embed) => [embed.id, embed])),
      titles: new Map(linked.map((target) => [target.id, target.title])),
    }),
    [linked, transcluded],
  )

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-6 p-6">
      <Link className="self-start underline" to="/">
        {t('back')}
      </Link>
      <h1 className="text-2xl font-semibold">{note.title || t('untitled')}</h1>
      <article className="flex flex-col gap-3 [&_blockquote]:border-l-2 [&_blockquote]:pl-3 [&_h1]:text-2xl [&_h1]:font-semibold [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:text-lg [&_h3]:font-semibold [&_ol]:list-decimal [&_ol]:pl-6 [&_pre]:overflow-x-auto [&_pre]:rounded [&_pre]:bg-neutral-100 [&_pre]:p-3 [&_ul]:list-disc [&_ul]:pl-6">
        <TargetsContext value={targets}>{renderDocument(note.doc, mapping)}</TargetsContext>
      </article>
      <section className="flex flex-col gap-2 border-t pt-4">
        <h2 className="font-semibold">{t('backlinks')}</h2>
        {backlinks.length === 0 ? (
          <p className="text-neutral-600">{t('noBacklinks')}</p>
        ) : (
          <ul className="flex flex-col gap-1">
            {backlinks.map((backlink) => (
              <li key={backlink.id}>
                <Link className="underline" params={{ noteId: backlink.id }} to="/notes/$noteId">
                  {backlink.title || t('untitled')}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

export const Route = createFileRoute('/notes/$noteId')({
  component: NotePage,
  loader: ({ params }) => {
    const input = noteInput.safeParse(params)
    if (!input.success) {
      throw notFound()
    }
    return getNotePageFn({ data: input.data })
  },
})

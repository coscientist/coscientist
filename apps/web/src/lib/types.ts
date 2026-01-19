interface NoteMeta {
  slug: string
  title: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

interface NoteBase extends NoteMeta {
  content: string
}

export interface NoteGraphNode extends NoteBase {
  outboundLinks: string[]
}

export interface Note extends NoteBase {
  contentHtml: string
  excerpt: string
}

export interface BacklinkInfo {
  slug: string
  title: string
  excerpt?: string
}

export interface NoteSummary {
  slug: string
  title: string
  description?: string
}

export interface NotePaneData {
  slug: string
  title: string
  description?: string
  contentHtml: string
  backlinks: BacklinkInfo[]
}

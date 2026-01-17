import { loader } from "fumadocs-core/source"
import { toFumadocsSource } from "fumadocs-mdx/runtime/server"
import { docs } from "@/.source/server"

const fumadocsSource = toFumadocsSource(docs, [])

export const source = loader({
  baseUrl: "/docs",
  source: fumadocsSource,
})

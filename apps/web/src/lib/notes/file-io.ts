import "server-only"

import fs from "node:fs/promises"
import path from "node:path"
import { cache } from "react"

const MD_EXTENSION_REGEX = /\.md$/

function getNotesDirectory(locale = "en") {
  return path.join(process.cwd(), `src/content/manifesto/${locale}`)
}

function getLegacyNotesDirectory() {
  return path.join(process.cwd(), "src/content/manifesto")
}

function isMissingFile(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "ENOENT"
  )
}

async function directoryExists(dirPath: string): Promise<boolean> {
  try {
    const stat = await fs.stat(dirPath)
    return stat.isDirectory()
  } catch {
    return false
  }
}

export const getNotesDirectoryForLocale = cache(async (locale = "en") => {
  const notesDir = getNotesDirectory(locale)
  const legacyDir = getLegacyNotesDirectory()
  return (await directoryExists(notesDir)) ? notesDir : legacyDir
})

export const getAllNoteSlugs = cache(
  async (locale = "en"): Promise<string[]> => {
    const dirToUse = await getNotesDirectoryForLocale(locale)

    try {
      const fileNames = await fs.readdir(dirToUse)
      return fileNames
        .filter((name) => name.endsWith(".md"))
        .map((name) => name.replace(MD_EXTENSION_REGEX, ""))
    } catch (error) {
      if (isMissingFile(error)) {
        return []
      }
      throw error
    }
  }
)

export async function readNoteFile(
  slug: string,
  locale = "en"
): Promise<string | null> {
  const dirToUse = await getNotesDirectoryForLocale(locale)
  const fullPath = path.join(dirToUse, `${slug}.md`)

  try {
    return await fs.readFile(fullPath, "utf8")
  } catch (error) {
    if (isMissingFile(error)) {
      return null
    }
    throw error
  }
}

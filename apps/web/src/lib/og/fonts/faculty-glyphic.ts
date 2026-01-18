import { getCachedFont } from "./google-fonts-fetcher"

export function getFacultyGlyphic(): Promise<ArrayBuffer> {
  return getCachedFont({ family: "Faculty Glyphic", weight: 400 })
}

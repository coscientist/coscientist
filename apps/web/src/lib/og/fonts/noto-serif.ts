import { type FontConfig, getCachedFont } from "./google-fonts-fetcher"

type Script =
  | "korean"
  | "japanese"
  | "chinese-simplified"
  | "chinese-traditional"
  | "arabic"
  | "devanagari"
  | "bengali"
  | "tamil"
  | "telugu"
  | "thai"
  | "cyrillic"

const SCRIPT_FONT_MAP: Record<Script, FontConfig> = {
  korean: { family: "Noto Sans KR", weight: 400 },
  japanese: { family: "Noto Sans JP", weight: 400 },
  "chinese-simplified": { family: "Noto Sans SC", weight: 400 },
  "chinese-traditional": { family: "Noto Sans TC", weight: 400 },
  arabic: { family: "Noto Sans Arabic", weight: 400 },
  devanagari: { family: "Noto Sans Devanagari", weight: 400 },
  bengali: { family: "Noto Sans Bengali", weight: 400 },
  tamil: { family: "Noto Sans Tamil", weight: 400 },
  telugu: { family: "Noto Sans Telugu", weight: 400 },
  thai: { family: "Noto Sans Thai", weight: 400 },
  cyrillic: { family: "Noto Sans", weight: 400 },
}

export function getNotoSerifForScript(
  script: Script,
  text?: string
): Promise<ArrayBuffer> {
  const fontConfig = SCRIPT_FONT_MAP[script]
  return getCachedFont({ ...fontConfig, text })
}

export function getScriptFontName(script: Script): string {
  return SCRIPT_FONT_MAP[script].family
}

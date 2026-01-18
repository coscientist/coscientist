const GOOGLE_FONTS_CSS_API = "https://fonts.googleapis.com/css2"

const TTF_USER_AGENT =
  "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1"

const FONT_URL_REGEX =
  /src: url\(([^)]+)\) format\(['"](?:truetype|opentype)['"]\)/

export interface FontConfig {
  family: string
  weight: number
  style?: "normal" | "italic"
  text?: string
}

async function fetchGoogleFont(config: FontConfig): Promise<ArrayBuffer> {
  const { family, weight, text } = config

  const familyParam = family.replace(/ /g, "+")
  let cssUrl = `${GOOGLE_FONTS_CSS_API}?family=${familyParam}:wght@${weight}`

  if (text) {
    cssUrl += `&text=${encodeURIComponent(text)}`
  }

  const cssResponse = await fetch(cssUrl, {
    headers: { "User-Agent": TTF_USER_AGENT },
    cache: text ? "no-store" : "force-cache",
  })

  if (!cssResponse.ok) {
    throw new Error(
      `Failed to fetch font CSS: ${cssResponse.status} ${cssResponse.statusText}`
    )
  }

  const css = await cssResponse.text()
  const fontUrlMatch = css.match(FONT_URL_REGEX)

  if (!fontUrlMatch?.[1]) {
    throw new Error(`Could not extract font URL from CSS for ${family}`)
  }

  const fontResponse = await fetch(fontUrlMatch[1], { cache: "force-cache" })

  if (!fontResponse.ok) {
    throw new Error(
      `Failed to fetch font file: ${fontResponse.status} ${fontResponse.statusText}`
    )
  }

  return fontResponse.arrayBuffer()
}

const fontCache = new Map<string, Promise<ArrayBuffer>>()

export function getCachedFont(config: FontConfig): Promise<ArrayBuffer> {
  if (config.text) {
    return fetchGoogleFont(config)
  }

  const cacheKey = `${config.family}-${config.weight}-${config.style || "normal"}`

  const cached = fontCache.get(cacheKey)
  if (cached) {
    return cached
  }

  const promise = fetchGoogleFont(config)
  fontCache.set(cacheKey, promise)

  return promise
}

const GOOGLE_FONTS_CSS_API = "https://fonts.googleapis.com/css2";

// Safari UA makes Google Fonts return TTF instead of WOFF2 (Satori needs TTF/OTF)
const TTF_USER_AGENT =
  "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1";

interface FontConfig {
  family: string;
  weight: number;
  style?: "normal" | "italic";
}

export async function fetchGoogleFont(
  config: FontConfig,
): Promise<ArrayBuffer> {
  const { family, weight } = config;

  const familyParam = family.replace(/ /g, "+");
  const cssUrl = `${GOOGLE_FONTS_CSS_API}?family=${familyParam}:wght@${weight}`;

  const cssResponse = await fetch(cssUrl, {
    headers: { "User-Agent": TTF_USER_AGENT },
  });

  if (!cssResponse.ok) {
    throw new Error(
      `Failed to fetch font CSS: ${cssResponse.status} ${cssResponse.statusText}`,
    );
  }

  const css = await cssResponse.text();

  // Regex pattern: src: url(https://fonts.gstatic.com/...) format('truetype')
  const fontUrlMatch = css.match(
    /src: url\(([^)]+)\) format\(['"](?:truetype|opentype)['"]\)/,
  );

  if (!fontUrlMatch?.[1]) {
    throw new Error(`Could not extract font URL from CSS for ${family}`);
  }

  const fontResponse = await fetch(fontUrlMatch[1]);

  if (!fontResponse.ok) {
    throw new Error(
      `Failed to fetch font file: ${fontResponse.status} ${fontResponse.statusText}`,
    );
  }

  return fontResponse.arrayBuffer();
}

const fontCache = new Map<string, Promise<ArrayBuffer>>();

export function getCachedFont(config: FontConfig): Promise<ArrayBuffer> {
  const cacheKey = `${config.family}-${config.weight}-${config.style || "normal"}`;

  const cached = fontCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const promise = fetchGoogleFont(config);
  fontCache.set(cacheKey, promise);

  return promise;
}

export function getFacultyGlyphic(): Promise<ArrayBuffer> {
  return getCachedFont({
    family: "Faculty Glyphic",
    weight: 400,
  });
}

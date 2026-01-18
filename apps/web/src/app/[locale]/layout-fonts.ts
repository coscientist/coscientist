import { Faculty_Glyphic } from "next/font/google"
import "@fontsource/iosevka/400.css"
import "@fontsource/iosevka/500.css"
import "@fontsource/iosevka/600.css"
import "@fontsource-variable/noto-serif-jp"
import "@fontsource-variable/noto-serif-kr"
import "@fontsource-variable/noto-serif-sc"
import "@fontsource-variable/noto-serif-tc"

export const facultyGlyphic = Faculty_Glyphic({
  variable: "--font-faculty-glyphic",
  subsets: ["latin"],
  weight: "400",
})

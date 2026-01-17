import { createMDX } from "fumadocs-mdx/next"
import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const config: NextConfig = {
  reactStrictMode: true,
}

const withMDX = createMDX()
const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

export default withNextIntl(withMDX(config))

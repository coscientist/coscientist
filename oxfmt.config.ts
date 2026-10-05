import { defineConfig } from 'oxfmt'

export default defineConfig({
  ignorePatterns: ['AGENTS.md', 'CLAUDE.md', 'docs/**', 'drizzle/meta/**'],
  semi: false,
  singleQuote: true,
})

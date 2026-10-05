import { defineConfig } from 'drizzle-kit'

const url = process.env.MIGRATION_DATABASE_URL

if (!url) {
  throw new Error('MIGRATION_DATABASE_URL is required')
}

export default defineConfig({
  dbCredentials: { url },
  dialect: 'postgresql',
  schema: ['./lib/auth/schema.ts', './lib/notes/schema.ts'],
})

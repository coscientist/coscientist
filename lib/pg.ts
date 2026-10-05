import postgres from 'postgres'

import { env } from '@/lib/env'

export const sql = postgres(env.DATABASE_URL, {
  connect_timeout: 10,
  idle_timeout: 20,
  max: 3,
  prepare: false,
})

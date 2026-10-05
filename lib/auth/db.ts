import { drizzle } from 'drizzle-orm/postgres-js'
import { sql } from '@/lib/pg'
import * as schema from './schema'

export const authDb = drizzle(sql, { schema })

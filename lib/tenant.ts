import { sql as query } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import { Data, Effect } from 'effect'

import { sql } from '@/lib/pg'

export class DatabaseError extends Data.TaggedError('DatabaseError')<{ readonly cause: unknown }> {}

const db = drizzle(sql)

export type TenantTx = Parameters<Parameters<typeof db.transaction>[0]>[0]

const enterTenant = async (tx: TenantTx, viewerId: string) => {
  const [role] = await tx.execute<{ rolbypassrls: boolean; rolsuper: boolean }>(
    query`select set_config('app.viewer_id', ${viewerId}, true), rolsuper, rolbypassrls from pg_roles where rolname = current_user`,
  )
  if (!role || role.rolsuper || role.rolbypassrls) {
    throw new Error('DATABASE_URL must connect as a role without SUPERUSER and BYPASSRLS')
  }
}

export const withTenant = <A>(viewerId: string, run: (tx: TenantTx) => Promise<A>) =>
  Effect.tryPromise({
    catch: (cause) => new DatabaseError({ cause }),
    try: () =>
      db.transaction(async (tx) => {
        await enterTenant(tx, viewerId)
        return await run(tx)
      }),
  })

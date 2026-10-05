import { redirect } from '@tanstack/react-router'
import { createMiddleware, createServerFn, createServerOnlyFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'

import { auth } from '@/lib/auth'

const getViewer = createServerOnlyFn(async () => {
  const session = await auth.api.getSession({ headers: getRequestHeaders() })
  return session?.user.emailVerified ? { email: session.user.email, id: session.user.id } : null
})

export const fetchViewer = createServerFn({ method: 'GET' }).handler(getViewer)

export const viewerMiddleware = createMiddleware({ type: 'function' }).server(async ({ next }) => {
  const viewer = await getViewer()
  if (!viewer) {
    throw redirect({ to: '/sign-in' })
  }
  return await next({ context: { viewer } })
})

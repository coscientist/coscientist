import { createRouter } from '@tanstack/react-router'

import { ErrorPage, NotFoundPage } from '@/components/shell'
import { routeTree } from './routeTree.gen'

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}

export const getRouter = () =>
  createRouter({
    caseSensitive: true,
    defaultErrorComponent: ErrorPage,
    defaultNotFoundComponent: NotFoundPage,
    defaultPreload: 'intent',
    routeTree,
    scrollRestoration: true,
  })

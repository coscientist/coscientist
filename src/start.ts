import { createCsrfMiddleware, createMiddleware, createStart } from '@tanstack/react-start'

const csrfMiddleware = createCsrfMiddleware({
  filter: ({ handlerType }) => handlerType === 'serverFn',
})

const withNoStore = <T extends { response: Response }>(result: T) => {
  result.response.headers.set('cache-control', 'no-store')
  return result
}

const noStoreMiddleware = createMiddleware().server(async ({ next }) => withNoStore(await next()))

export const startInstance = createStart(() => ({
  requestMiddleware: [noStoreMiddleware, csrfMiddleware],
}))

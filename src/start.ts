import { createCsrfMiddleware, createMiddleware, createStart } from '@tanstack/react-start'
import { setResponseHeader } from '@tanstack/react-start/server'

const csrfMiddleware = createCsrfMiddleware({
  filter: ({ handlerType }) => handlerType === 'serverFn',
})

const noStoreMiddleware = createMiddleware().server(({ next }) => {
  setResponseHeader('cache-control', 'no-store')
  return next()
})

export const startInstance = createStart(() => ({
  requestMiddleware: [csrfMiddleware, noStoreMiddleware],
}))

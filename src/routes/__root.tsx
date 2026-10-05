import { createRootRoute, HeadContent, Scripts } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { IntlProvider } from 'use-intl'

import { translate } from '@/lib/i18n'
import messages from '@/messages/en.json'
import appCss from '@/src/styles.css?url'

const RootShell = ({ children }: { children: ReactNode }) => (
  <html lang="en">
    <head>
      <HeadContent />
    </head>
    <body className="bg-white text-neutral-900 antialiased wrap-anywhere">
      <IntlProvider locale="en" messages={messages} timeZone="UTC">
        {children}
      </IntlProvider>
      <Scripts />
    </body>
  </html>
)

export const Route = createRootRoute({
  head: () => ({
    links: [{ href: appCss, rel: 'stylesheet' }],
    meta: [
      { charSet: 'utf-8' },
      { content: 'width=device-width, initial-scale=1', name: 'viewport' },
      { title: translate('Layout.title') },
      { content: translate('Layout.description'), name: 'description' },
    ],
  }),
  shellComponent: RootShell,
})

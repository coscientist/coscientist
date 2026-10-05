import { createTranslator } from 'use-intl/core'

import messages from '@/messages/en.json'

export const translate = createTranslator({ locale: 'en', messages })

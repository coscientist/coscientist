import { definePlugin } from 'nitro'

import { env } from '@/lib/env'

export default definePlugin(() => {
  void env
})

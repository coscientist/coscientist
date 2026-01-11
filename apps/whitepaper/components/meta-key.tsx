'use client'

import { ArrowUp01Icon, CommandIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useEffect, useState } from 'react'

export const MetaKeyIcon = ({ className }: { className?: string }) => {
  const [isMac, setIsMac] = useState(false)

  useEffect(() => {
    setIsMac(navigator.userAgent.toLowerCase().includes('mac'))
  }, [])

  return (
    <span className={className}>
      {isMac ? (
        <HugeiconsIcon icon={CommandIcon} className={className} />
      ) : (
        <HugeiconsIcon icon={ArrowUp01Icon} className={className} />
      )}
    </span>
  )
}

export const useMetaKeyString = () => {
  const [isMac, setIsMac] = useState(false)

  useEffect(() => {
    setIsMac(navigator.userAgent.toLowerCase().includes('mac'))
  }, [])

  return isMac ? '⌘' : '⌃'
}

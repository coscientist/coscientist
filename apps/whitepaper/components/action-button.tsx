'use client'

import { MetaKeyIcon } from '@/components/meta-key'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  ArrowTurnBackwardIcon,
  Loading03Icon,
  Tick01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useState } from 'react'
import { toast } from 'sonner'

export const ActionButton = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showCheckmark, setShowCheckmark] = useState(false)

  const triggerAction = () => {
    if (!isSubmitting) {
      setIsSubmitting(true)
      setIsLoading(true)
      setShowCheckmark(false)

      // Show loading for 3 seconds
      setTimeout(() => {
        setIsLoading(false)
        setShowCheckmark(true)

        // Show checkmark for 3 seconds
        setTimeout(() => {
          setShowCheckmark(false)
          setIsSubmitting(false)
          toast.success('Action completed successfully!')
        }, 2000)
      }, 1000)
    }
  }

  // Simplified keyboard shortcut handling
  const handleKeyDown = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault()
      triggerAction()
    }
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyDown)
  }

  return (
    <Button
      autoFocus={false}
      variant='outline'
      className={cn(
        'relative transition-colors duration-300 cursor-pointer overflow-hidden',
        showCheckmark
          ? 'bg-green-100 hover:bg-green-200 dark:bg-green-950 dark:hover:bg-green-900 border-green-400 dark:border-green-300'
          : '',
      )}
      disabled={isLoading}
      onClick={triggerAction}
    >
      {/* Invisible placeholder to maintain width */}
      <div className='flex items-center justify-between gap-2 opacity-0'>
        Action
        <kbd className='flex items-center justify-center gap-0.5'>
          <MetaKeyIcon className='my-auto' />
          <HugeiconsIcon icon={ArrowTurnBackwardIcon} className='my-auto' />
        </kbd>
      </div>

      {/* Animated content */}
      <div className='absolute inset-0 flex items-center justify-center'>
        <div
          className={cn(
            'flex items-center justify-between gap-2 transition-all duration-300 ease-in-out',
            isSubmitting
              ? 'opacity-0 -translate-y-2'
              : 'opacity-100 translate-y-0',
          )}
        >
          Action
          <kbd className='flex items-center justify-center gap-0.5'>
            <MetaKeyIcon className='my-auto' />
            <HugeiconsIcon icon={ArrowTurnBackwardIcon} className='my-auto' />
          </kbd>
        </div>
      </div>

      {/* Loading spinner */}
      <div className='absolute inset-0 flex items-center justify-center'>
        <div
          className={cn(
            'transition-all duration-300 ease-in-out',
            !isSubmitting && 'opacity-0 translate-y-3',
            isSubmitting && !showCheckmark && 'opacity-100 translate-y-0',
            showCheckmark && 'opacity-0 -translate-y-3',
          )}
        >
          <HugeiconsIcon icon={Loading03Icon} className='size-4 animate-spin' />
        </div>
      </div>

      {/* Checkmark */}
      <div className='absolute inset-0 flex items-center justify-center'>
        <div
          className={cn(
            'transition-all duration-300 ease-in-out',
            !showCheckmark && 'opacity-0 translate-y-3',
            showCheckmark && 'opacity-100 translate-y-0 scale-125',
          )}
        >
          <HugeiconsIcon icon={Tick01Icon} className='size-4 text-green-500' />
        </div>
      </div>
    </Button>
  )
}

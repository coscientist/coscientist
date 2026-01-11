'use client'

import { BeepingDot } from '@/components/beeping-dot'
import { Card } from '@/components/ui/card'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'

interface QuoteTranslatorProps {
  quotes: {
    text: string
    author: string
    language: string
  }[]
}

export function TranslatingQuote({ quotes }: QuoteTranslatorProps) {
  const [currentLanguage, setCurrentLanguage] = useState(0)
  const [hasBeenViewed, setHasBeenViewed] = useState(false)
  const languages = quotes.map((quote) => quote.language)

  const toggleLanguage = () => {
    const nextIndex = (currentLanguage + 1) % languages.length
    setCurrentLanguage(nextIndex)
    if (!hasBeenViewed) {
      setHasBeenViewed(true)
    }
  }

  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.03,
        staggerDirection: -1,
      },
    },
  }

  const lineVariants = {
    hidden: { y: '3rem', opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'tween' as const,
        duration: 0.25,
        ease: 'easeOut' as const,
      },
    },
    exit: {
      y: '-3rem',
      opacity: 0,
      transition: {
        type: 'tween' as const,
        duration: 0.25,
        ease: 'easeIn' as const,
      },
    },
  }

  const currentQuote = quotes[currentLanguage]
  const nextQuote = quotes[(currentLanguage + 1) % languages.length]

  return (
    <motion.div
      className='w-full'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        className='relative w-full cursor-pointer p-8'
        onClick={toggleLanguage}
      >
        <BeepingDot visible={!hasBeenViewed} />
        <motion.div>
          <AnimatePresence mode='wait'>
            {currentQuote && (
              <motion.div
                key={currentLanguage}
                variants={containerVariants}
                initial='hidden'
                animate='visible'
                exit='exit'
              >
                <motion.div
                  key={currentLanguage}
                  variants={lineVariants}
                  className='text-lg font-serif leading-relaxed'
                >
                  {currentQuote.text}
                </motion.div>
                <motion.div
                  variants={lineVariants}
                  className='text-muted-foreground font-medium'
                >
                  {currentQuote.author}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Card>
    </motion.div>
  )
}

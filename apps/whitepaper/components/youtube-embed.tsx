'use client'

import dynamic from 'next/dynamic'
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'

const LiteYouTubeEmbed = dynamic(() => import('react-lite-youtube-embed'), {
  ssr: false,
})

interface YouTubeEmbedProps {
  id: string
  title: string
  aspectHeight?: number
  aspectWidth?: number
}

export function YouTubeEmbed({
  id,
  title,
  aspectHeight = 9,
  aspectWidth = 16,
}: YouTubeEmbedProps) {
  return (
    <LiteYouTubeEmbed
      id={id}
      title={title}
      aspectHeight={aspectHeight}
      aspectWidth={aspectWidth}
    />
  )
}

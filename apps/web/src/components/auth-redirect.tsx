"use client"

import { useAuth } from "@clerk/nextjs"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"

export function AuthRedirect() {
  const { isSignedIn, isLoaded } = useAuth()
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace(`/${locale}/select-lab`)
    }
  }, [isLoaded, isSignedIn, locale, router])

  return null
}

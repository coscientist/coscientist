"use client"

import { usePathname } from "next/navigation"
import { Logo } from "@/components/logo"
import { Link } from "@/i18n/navigation"

interface HeaderLogoProps {
  title: string
}

export function HeaderLogo({ title }: HeaderLogoProps) {
  const pathname = usePathname()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <Link
      className="flex items-center gap-3 transition-opacity hover:opacity-80"
      href="/"
      onClick={handleClick}
    >
      <Logo className="text-foreground" size={20} />
      <span className="font-semibold text-foreground text-lg">{title}</span>
    </Link>
  )
}

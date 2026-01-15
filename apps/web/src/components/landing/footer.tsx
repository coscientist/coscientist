import Link from "next/link"

import { Container } from "./primitives"

const links = [
  { label: "Manifesto", href: "/manifesto" },
  {
    label: "GitHub",
    href: "https://github.com/junhoyeo/coscientist",
    external: true,
  },
  { label: "X", href: "https://x.com/junhoyeo", external: true },
]

export function Footer() {
  return (
    <footer className="border-border border-t">
      <div className="bg-muted/30 py-12">
        <Container className="flex flex-col items-center gap-6 text-center text-sm">
          <nav>
            <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
              {links.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <a
                      className="text-muted-foreground transition-colors hover:text-foreground"
                      href={link.href}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      className="text-muted-foreground transition-colors hover:text-foreground"
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <p className="text-muted-foreground/70">© 2026 Coscientist</p>
        </Container>
      </div>
    </footer>
  )
}

import Link from "next/link"

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-2xl text-center">
        <h1 className="mb-4 font-bold text-4xl">Coscientist HQ</h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Internal documentation and Architecture Decision Records
        </p>
        <Link
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground text-sm hover:bg-primary/90"
          href="/docs"
        >
          View Documentation
        </Link>
      </div>
    </main>
  )
}

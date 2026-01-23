import { auth, clerkClient } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { userId, orgId } = await auth()

  if (!(userId && orgId)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { apiKey } = await request.json()

  if (!apiKey || typeof apiKey !== "string") {
    return NextResponse.json({ error: "Invalid API key" }, { status: 400 })
  }

  const client = await clerkClient()

  await client.organizations.updateOrganization(orgId, {
    privateMetadata: { openaiApiKey: apiKey },
    publicMetadata: { hasOpenAIKey: true },
  })

  return NextResponse.json({ success: true })
}

export async function DELETE() {
  const { userId, orgId } = await auth()

  if (!(userId && orgId)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const client = await clerkClient()

  await client.organizations.updateOrganization(orgId, {
    privateMetadata: { openaiApiKey: null },
    publicMetadata: { hasOpenAIKey: false },
  })

  return NextResponse.json({ success: true })
}

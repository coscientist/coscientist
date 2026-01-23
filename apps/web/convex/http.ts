import { httpRouter } from "convex/server"
import { Webhook } from "svix"
import { internal } from "./_generated/api"
import { httpAction } from "./_generated/server"

const http = httpRouter()

const handleClerkWebhook = httpAction(async (ctx, request) => {
  const svixId = request.headers.get("svix-id")
  const svixTimestamp = request.headers.get("svix-timestamp")
  const svixSignature = request.headers.get("svix-signature")

  if (!(svixId && svixTimestamp && svixSignature)) {
    return new Response("Missing svix headers", { status: 400 })
  }

  const payload = await request.text()
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error("CLERK_WEBHOOK_SECRET not configured")
    return new Response("Webhook secret not configured", { status: 500 })
  }

  const wh = new Webhook(webhookSecret)

  let event: {
    type: string
    data: Record<string, unknown>
  }

  try {
    event = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as typeof event
  } catch (err) {
    console.error("Webhook verification failed:", err)
    return new Response("Webhook verification failed", { status: 400 })
  }

  switch (event.type) {
    case "organization.created":
    case "organization.updated": {
      await ctx.runMutation(internal.labs.upsertLab, {
        clerkOrg: event.data,
      })
      break
    }

    case "organization.deleted": {
      const orgId = event.data.id as string
      await ctx.runMutation(internal.labs.deleteLab, { clerkOrgId: orgId })
      break
    }

    case "organizationMembership.created":
    case "organizationMembership.updated": {
      await ctx.runMutation(internal.labs.upsertLabMembership, {
        clerkMembership: event.data,
      })
      break
    }

    case "organizationMembership.deleted": {
      const membershipId = event.data.id as string
      await ctx.runMutation(internal.labs.deleteLabMembership, {
        clerkMembershipId: membershipId,
      })
      break
    }

    default:
      console.log("Unhandled Clerk webhook event:", event.type)
  }

  return new Response(null, { status: 200 })
})

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: handleClerkWebhook,
})

export default http

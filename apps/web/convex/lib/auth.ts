import type { MutationCtx, QueryCtx } from "../_generated/server"

type AuthContext = QueryCtx | MutationCtx

interface LabContext {
  labId: string
  labSlug: string
  userId: string
  role: string
}

export async function getLabContext(ctx: AuthContext): Promise<LabContext> {
  const identity = await ctx.auth.getUserIdentity()

  if (!identity) {
    throw new Error("Not authenticated")
  }

  const orgId = (identity as Record<string, unknown>).org_id as
    | string
    | undefined
  const orgSlug = (identity as Record<string, unknown>).org_slug as
    | string
    | undefined
  const orgRole = (identity as Record<string, unknown>).org_role as
    | string
    | undefined

  if (!orgId) {
    throw new Error("No active lab selected")
  }

  return {
    labId: orgId,
    labSlug: orgSlug ?? "",
    userId: identity.subject,
    role: orgRole ?? "org:member",
  }
}

export async function getOptionalLabContext(
  ctx: AuthContext
): Promise<LabContext | null> {
  const identity = await ctx.auth.getUserIdentity()

  if (!identity) {
    return null
  }

  const orgId = (identity as Record<string, unknown>).org_id as
    | string
    | undefined

  if (!orgId) {
    return null
  }

  const orgSlug = (identity as Record<string, unknown>).org_slug as
    | string
    | undefined
  const orgRole = (identity as Record<string, unknown>).org_role as
    | string
    | undefined

  return {
    labId: orgId,
    labSlug: orgSlug ?? "",
    userId: identity.subject,
    role: orgRole ?? "org:member",
  }
}

export async function requireLabMembership(
  ctx: AuthContext,
  clerkOrgId: string
): Promise<{ labId: string; userId: string; role: string }> {
  const identity = await ctx.auth.getUserIdentity()

  if (!identity) {
    throw new Error("Not authenticated")
  }

  const lab = await ctx.db
    .query("labs")
    .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkOrgId))
    .unique()

  if (!lab) {
    throw new Error("Lab not found")
  }

  const membership = await ctx.db
    .query("labMemberships")
    .withIndex("by_labId_userId", (q) =>
      q.eq("labId", lab._id).eq("userId", identity.subject)
    )
    .unique()

  if (!membership) {
    throw new Error("Not a member of this lab")
  }

  return {
    labId: lab._id,
    userId: identity.subject,
    role: membership.role,
  }
}

export function isAdmin(role: string): boolean {
  return role === "org:admin"
}

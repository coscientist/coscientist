import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  userSettings: defineTable({
    userId: v.string(),
    openaiApiKey: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),
})

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    projects: defineTable({
        name: v.string(),
        description: v.string(),
        createdAt: v.number(),
        updatedAt: v.number(),
        apiKeys: v.array(v.id("apiKeys")),
        userId: v.optional(v.string()),
        organizationId: v.optional(v.string()),
        userProfile: v.optional(v.string()),
        userName: v.optional(v.string()),
    }),
    apiKeys: defineTable({
        projectId: v.id("projects"),
        name: v.optional(v.string()),
        apiKey: v.string(),
        isServer: v.optional(v.boolean()),
        createdAt: v.number(),
        updatedAt: v.number(),
    }),
    secrets: defineTable({
        userId: v.string(),
        name: v.string(),
        email: v.string(),
        secret: v.string(),
        createdAt: v.number(),
        updatedAt: v.number(),
    })
});


import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    projects: defineTable({
        name: v.string(),
        description: v.string(),
        createdAt: v.number(),
        updatedAt: v.number(),
        allowedUsers: v.optional(v.array(v.string())),
        apiKeys: v.array(v.id("apiKeys")),
        userId: v.optional(v.string()),
        organizationId: v.optional(v.string()),
        userProfile: v.optional(v.string()),
        userName: v.optional(v.string()),
        howManyTimes: v.optional(v.number()),
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
    }),
    analytics: defineTable({
        projectId: v.id("projects"),
        userId: v.string(),
        createdAt: v.number(),
        updatedAt: v.number(),
        userName: v.optional(v.string()),
        projectName: v.optional(v.string()),
        howManyTimes: v.optional(v.number()),
    })
});


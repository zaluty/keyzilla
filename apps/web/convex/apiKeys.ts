import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const getApiKeys = query({
    args: { projectId: v.id("projects") },
    handler: async (ctx, args) => {
        if (!args.projectId) return [];
        return await ctx.db
            .query("apiKeys")
            .filter((q) => q.eq(q.field("projectId"), args.projectId))
            .collect();
    }
});

export const createApiKey = mutation({
    args: {
        projectId: v.id("projects"), value: v.string(),
        isServer: v.optional(v.boolean()),
        name: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const now = Date.now();
        return await ctx.db.insert("apiKeys", {
            projectId: args.projectId,
            name: args.name,
            apiKey: args.value,
            createdAt: now,
            updatedAt: now,
            isServer: args.isServer
        });
    }
});



export const deleteApiKey = mutation({
    args: { apiKeyId: v.id("apiKeys") },
    handler: async (ctx, args) => {
        return await ctx.db.delete(args.apiKeyId);
    }
});

export const updateApiKey = mutation({
    args: {
        apiKeyId: v.id("apiKeys"),
        value: v.string(),
        isServer: v.optional(v.boolean()),

    },
    handler: async (ctx, args) => {
        const now = Date.now();
        return await ctx.db.patch(args.apiKeyId, {
            apiKey: args.value,
            updatedAt: now,
            isServer: args.isServer
        });
    }
});
import { v } from "convex/values";
import { query } from "./_generated/server";

export const getProjects = query({
    args: { organizationId: v.optional(v.string()), enabled: v.optional(v.boolean()) },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (identity === null) {
            throw new Error("Not authenticated");
        } 

        const userId = identity.subject;

        return ctx.db
            .query("projects")
            .filter((q) => {
                if (args.organizationId) {
                    return q.eq(q.field("organizationId"), args.organizationId);
                } else {
                    return q.or( 
                        q.eq(q.field("organizationId"), undefined),
                        q.eq(q.field("organizationId"), null)
                    );
                }
            })
            .collect()
            .then(async (projects) => {
                return projects.filter(project => project.allowedUsers?.includes(userId));
            });
    },
})


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
export const getCliProjects = query({
    args: { organizationId: v.optional(v.string()), enabled: v.optional(v.boolean()) },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (identity === null) {
            throw new Error("Not authenticated");
        } 

        const userId = identity.subject;

        return ctx.db
            .query("projects")
            .filter((q) => {
                if (args.organizationId) {
                    return q.eq(q.field("organizationId"), args.organizationId);
                } else {
                    return q.or( 
                        q.eq(q.field("organizationId"), undefined),
                        q.eq(q.field("organizationId"), null)
                    );
                }
            })
            .collect()
            .then(async (projects) => {
                return projects.filter(project => project.allowedUsers?.includes(userId));
            });
    },
})

export const verify = query({
    args: { secretKey: v.string(), userId: v.string() },
    handler: async (ctx, args) => {
        if (!args.secretKey || !args.userId) {
            throw new Error("Secret key and userId are required");
        }

        // Query the user from the database
        const user = await ctx.db
            .query("secrets")
            .filter((q) => q.eq(q.field("userId"), args.userId))
            .first();

        if (!user) {
            return false; // User not found
        }

        // Check if the provided secret key matches the user's stored secret key
        const isSecretKeyValid = user.secret === args.secretKey;
    console.log(isSecretKeyValid);
        return isSecretKeyValid;
    }
});

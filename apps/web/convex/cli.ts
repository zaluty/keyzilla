import { v } from "convex/values";
import { query } from "./_generated/server";

export const getProjects = query({
    args: { organizationId: v.string(),
         userId: v.string(),
         email: v.string() 
     },
    handler: async (ctx, args) => {
       if(!args.userId && !args.email){
        throw new Error("UserId or Email is required");
        }
        const userId = args.userId; 
        return ctx.db
            .query("projects")
            .filter((q) => {
                if (args.organizationId) {
                    return q.eq(q.field("organizationId"), args.organizationId);
                } else {
                    return q.and(
                        q.eq(q.field("userId"), userId),
                        q.or(
                            q.eq(q.field("organizationId"), undefined),
                            q.eq(q.field("organizationId"), null)
                        )
                    );
                }
            }).order("desc")
            .collect();
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
    args: { userId: v.string(), organizationId: v.optional(v.string()) },
    handler: async (ctx, args) => {
        if (!args.userId) {
            return [];
        }
        const projects = await ctx.db
            .query("projects")
            .filter((q) => {
                if (args.organizationId) {
                    return q.eq(q.field("organizationId"), args.organizationId);
                } else {
                    return q.and(
                        q.eq(q.field("userId"), args.userId),
                        q.or(
                            q.eq(q.field("organizationId"), args.organizationId),
                            q.eq(q.field("organizationId"), null)
                        )
                    );
                }
            }).order("desc")
            .collect();

        // Fetch API keys for each project
        const projectsWithApiKeys = await Promise.all(projects.map(async (project) => {
            const apiKeys = await ctx.db
                .query("apiKeys")
                .filter((q) => q.eq(q.field("projectId"), project._id))
                .collect();
            return { ...project, apiKeys };
        }));

        return projectsWithApiKeys;
    },
});

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

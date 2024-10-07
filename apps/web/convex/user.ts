import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
export const insertUser = mutation({
    args: {
        secret: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        const user = await ctx.db.insert("secrets", {
            userId: identity?.subject as string,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            name: identity?.name as string,
            email: identity?.email as string,
            secret: args.secret as string,
        });
        return user;
    }
})

export const getSecret = query({
    args: {
        userId: v.string(),
    },
    
    handler: async (ctx, args) => {
        const users = await ctx.db
            .query("secrets")
            .filter((q) => q.eq(q.field("userId"), args.userId))
            .collect();

        if (users.length === 0) {
            return []; // Return an empty array if no user found
        }

        return users.map(user => ({
            encryptedSecret: user.secret || ''
        }));
    }
});

export const deleteSecret = mutation({
    args: {
        // Remove secretId and add userId and secretValue
        userId: v.string(),
        secretValue: v.string(),
    },
    handler: async (ctx, args) => {
        // Query for the secret based on userId and secretValue
        const secretToDelete = await ctx.db
            .query("secrets")
            .filter((q) => 
                q.and(
                    q.eq(q.field("userId"), args.userId),
                    q.eq(q.field("secret"), args.secretValue)
                )
            )
            .first();

        // If the secret is found, delete it
        if (secretToDelete) {
            await ctx.db.delete(secretToDelete._id);
        }

        // Return the result of the operation
        return !!secretToDelete;
    }
});

export const insertSecret = mutation({
    args: {
        secret: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authenticated");
        }

        const existingUser = await ctx.db
            .query("secrets")
            .filter((q) => q.eq(q.field("userId"), identity.subject))
            .first();

        if (!existingUser) {
            // If user doesn't exist, create a new entry with all user details
            return await ctx.db.insert("secrets", {
                userId: identity.subject,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                name: identity.name ?? "",
                email: identity.email ?? "",
                secret: args.secret,
            });
        } else {
            // If user exists, insert a new secret entry with all required fields
            return await ctx.db.insert("secrets", {
                userId: identity.subject,
                createdAt: Date.now(),
                updatedAt: Date.now(),
                name: existingUser.name,
                email: existingUser.email,
                secret: args.secret,
            });
        }
    },
});

export const deleteUserData = mutation({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const { userId } = args;

        // Delete all projects associated with the user
        const userProjects = await ctx.db
            .query("projects")
            .filter((q) => q.eq(q.field("userId"), userId))
            .collect();

        for (const project of userProjects) {
            // Delete all API keys associated with each project
            const apiKeys = await ctx.db.query("apiKeys").collect();

            for (const apiKey of apiKeys) {
                await ctx.db.delete(apiKey._id);
            }

            // Delete the project
            await ctx.db.delete(project._id);
        }

        // Delete all secrets associated with the user
        const secrets = await ctx.db.query("secrets").collect();
        for (const secret of secrets) {
            await ctx.db.delete(secret._id);
        }

        return { success: true };
    },
});
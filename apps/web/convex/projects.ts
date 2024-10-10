import { auth } from "@clerk/nextjs/server";
import { mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { QueryCtx } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { number } from "zod";
import { getManyFrom } from "convex-helpers/server/relationships";

/**
 * Create a new project
 * 
 * If organizationId is provided, it will create a project in the specified organization.
 * If organizationId is not provided, it will create a personal project.
 * ------------------------------------------------------
 * If the project is created, it will return the projectId.
 * If the project is not created, it will return an error.
 */
export const createProject = mutation({
    args: {
        name: v.string(),
        description: v.string(),
        organizationId: v.optional(v.string()),
        allowedUsers: v.optional(v.array(v.string())),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (identity === null) {
            throw new ConvexError("Not authenticated");
        }
        const NoAllowedUsers = args.allowedUsers === undefined || args.allowedUsers.length === 0;
        const userId = identity.subject;

        // Check if a project with the same name already exists
        const existingProject = await ctx.db
            .query("projects")
            .filter((q) =>
                q.and(
                    q.eq(q.field("name"), args.name),
                    q.eq(q.field("userId"), userId),
                    args.organizationId
                        ? q.eq(q.field("organizationId"), args.organizationId)
                        : q.or(
                            q.eq(q.field("organizationId"), undefined),
                            q.eq(q.field("organizationId"), null)
                        )
                )
            )
            .first();

        if (existingProject) {
            throw new ConvexError("A project with this name already exists");
        }

        const projectId = await ctx.db.insert("projects", {
            name: args.name,
            description: args.description,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            apiKeys: [],
            userId: userId,
            userProfile: identity.pictureUrl as string,
            userName: identity.name as string,
            organizationId: args.organizationId || undefined,
            allowedUsers: NoAllowedUsers ? [userId] : [...(args.allowedUsers || []), userId],
        });

        return projectId;
    }
})


/**
 * Get all projects
 * 
 * If organizationId is provided, it will search for all projects in the specified organization.
 * If organizationId is not provided, it will search for all personal projects.
 * ------------------------------------------------------
 * If the projects are found, it will return the projects.
 * If the projects are not found, it will return an empty array.
 */
export const getProjects = query({
    args: { organizationId: v.optional(v.string()), enabled: v.optional(v.boolean()) },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (identity === null) {
            throw new Error("Not authenticated");
        } 

        const userId: string[] = [identity.subject];
        const userid = Array.from(userId) 
        console.log(userid)
        return ctx.db
            .query("projects")
            .filter((q) => {
                if (args.organizationId) {
                    return q.eq(q.field("organizationId"), args.organizationId), q.eq(q.field('allowedUsers'), userId)
                } else {
                    return q.and(
                        q.eq(q.field("allowedUsers"), userId),
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



/**
 * Get a project by name and organizationId (optional)
 * 
 * If organizationId is provided, it will search for a project in the specified organization.
 * If organizationId is not provided, it will search for a personal project.
 * ------------------------------------------------------
 * If the project is found, it will return the project.
 * If the project is not found, it will return null.
 */
export const getProjectByName = query({
    args: {
        name: v.string(),
        organizationId: v.optional(v.string())
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authenticated");
        }
        const userId = identity.subject;

        let project;
        if (args.organizationId) {
            project = await ctx.db
                .query("projects")
                .filter((q) =>
                    q.and(
                        q.eq(q.field("name"), args.name),
                        q.eq(q.field("organizationId"), args.organizationId)
                    )
                )
                .first();
        } else {
            project = await ctx.db
                .query("projects")
                .filter((q) =>
                    q.and(
                        q.eq(q.field("name"), args.name),
                        q.eq(q.field("userId"), userId)
                    )
                )
                .first();
        }
        return project;
    }
})

export const updateProject = mutation({
    args: {
        id: v.id("projects"),
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        isPublic: v.optional(v.boolean())
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authenticated");
        }

        const existingProject = await ctx.db.get(args.id);
        if (!existingProject) {
            throw new Error("Project not found");
        }

        // Check if the user has permission to update this project
        if (existingProject.userId !== identity.subject && existingProject.organizationId !== identity.orgId) {
            throw new Error("Not authorized to update this project");
        }

        const updatedFields: Partial<typeof existingProject> = {
            updatedAt: Date.now()
        };

        if (args.name !== undefined) updatedFields.name = args.name;
        if (args.description !== undefined) updatedFields.description = args.description;

        const updatedProject = await ctx.db.patch(args.id, updatedFields);

        return updatedProject;
    }
})

/**
 * Delete a project by id   
 * 
 */
export const deleteProjectById = mutation({
    args: { id: v.id("projects") },
    handler: async (ctx, args) => {
        // First, delete all associated API keys
        const apiKeys = await ctx.db
            .query("apiKeys")
            .filter((q) => q.eq(q.field("projectId"), args.id))
            .collect();

        for (const apiKey of apiKeys) {
            await ctx.db.delete(apiKey._id);
        }

        // Then, delete the project
        await ctx.db.delete(args.id);
    }
})

/**
 * Get projects with pagination
 * 
 * If organizationId is provided, it will search for all projects in the specified organization.
 * If organizationId is not provided, it will search for all personal projects.
 */
export const getPaginatedProjects = query({
    args: {
        organizationId: v.optional(v.string()),
        paginationOpts: paginationOptsValidator
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (identity === null) {
            throw new ConvexError("Not authenticated");
        }

        const userId: string[] = [identity.subject];

        return ctx.db
            .query("projects")
            .filter((q) => {
                if (args.organizationId) {
                    return q.and(
                        q.eq(q.field("organizationId"), args.organizationId),
                        q.eq(q.field("allowedUsers"), userId)
                    );
                } else {
                    return q.and(   
                        q.eq(q.field("allowedUsers"), userId),
                        q.or(
                            q.eq(q.field("organizationId"), undefined),
                            q.eq(q.field("organizationId"), null)
                        )
                    );
                }
            })
            .order("desc")
            .paginate(args.paginationOpts);
    },
})

 

export const updateProjectAllowedUsers = mutation({
    args: {
        projectId: v.id("projects"),
        allowedUsers: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError("Not authenticated");
        }

        const project = await ctx.db.get(args.projectId);
        if (!project) {
            throw new ConvexError("Project not found");
        }

        
        if (project.userId !== identity.subject) {
            throw new ConvexError("Not authorized to update this project");
        }

        const updatedProject = await ctx.db.patch(args.projectId, {
            allowedUsers: args.allowedUsers,
            updatedAt: Date.now(),
        });

        return updatedProject;
    },
});
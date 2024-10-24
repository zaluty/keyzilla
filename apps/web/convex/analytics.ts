import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api } from "./_generated/api";

/**
 * this function is used to record analytics data whenever the getCliPorjects function is called
 * it takes the project id, the user id, the user name and the project name as arguments
 * does not return anything
 */

export const recordAnalytics = mutation({
    args: { projectId: v.id("projects"), userId: v.string(), userName: v.optional(v.string()), projectName: v.optional(v.string()) },
    handler: async (ctx, args) => {
        const result = await ctx.runQuery(api.projects.getProjectAnalytics, {projectId: args.projectId, projectName: args.projectName});
        const howManyTimes = result[0]?.howManyTimes || 0; // Access the first element and handle undefined
        await ctx.db.insert("analytics", { ...args, createdAt: Date.now(), updatedAt: Date.now(), projectName: args.projectName || "", howManyTimes: howManyTimes + 1 });
    }
});


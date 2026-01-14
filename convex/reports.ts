import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createErrorReport = mutation({
  args: {
    gymId: v.id("gyms"),
    name: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("errorReports", {
      gymId: args.gymId,
      name: args.name,
      message: args.message,
      done: false,
      createdAt: Date.now(),
    });
  },
});

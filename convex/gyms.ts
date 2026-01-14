import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("gyms").collect();
  },
});

export const createGymRequest = mutation({
  args: {
    name: v.string(),
    address: v.optional(v.string()),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("gymRequests", {
      name: args.name,
      address: args.address,
      message: args.note,
      done: false,
      createdAt: Date.now(),
    });
  },
});

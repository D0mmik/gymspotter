import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createEquipmentRequest = mutation({
  args: {
    gymId: v.id("gyms"),
    gymName: v.string(),
    rackCount: v.optional(v.number()),
    dumbbellMaxKg: v.optional(v.number()),
    hasDeadliftPlatform: v.optional(v.boolean()),
    hasMagnesium: v.optional(v.boolean()),
    hasAirCon: v.optional(v.boolean()),
    hasParking: v.optional(v.boolean()),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("equipmentRequests", {
      gymId: args.gymId,
      name: args.gymName,
      rackCount: args.rackCount,
      dumbbellMaxKg: args.dumbbellMaxKg,
      hasDeadliftPlatform: args.hasDeadliftPlatform,
      hasMagnesium: args.hasMagnesium,
      hasAirCon: args.hasAirCon,
      hasParking: args.hasParking,
      message: args.note,
      done: false,
      createdAt: Date.now(),
    });
  },
});

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new gym request
export const createGymRequest = mutation({
  args: {
    name: v.string(),
    address: v.string(),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const requestId = await ctx.db.insert("gymRequests", {
      name: args.name,
      address: args.address,
      note: args.note,
      status: "pending",
      createdAt: Date.now(),
    });
    return requestId;
  },
});

// Create a new photo request
export const createPhotoRequest = mutation({
  args: {
    gymId: v.id("gyms"),
    gymName: v.string(),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const requestId = await ctx.db.insert("photoRequests", {
      gymId: args.gymId,
      gymName: args.gymName,
      storageId: args.storageId,
      status: "pending",
      createdAt: Date.now(),
    });
    return requestId;
  },
});

// Generate upload URL for photos
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

// Get all pending gym requests (for admin)
export const getPendingGymRequests = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("gymRequests")
      .filter((q) => q.eq(q.field("status"), "pending"))
      .order("desc")
      .collect();
  },
});

// Get all pending photo requests (for admin)
export const getPendingPhotoRequests = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("photoRequests")
      .filter((q) => q.eq(q.field("status"), "pending"))
      .order("desc")
      .collect();
  },
});

// Get photo URL from storage
export const getPhotoUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

// Create a new error report
export const createErrorReport = mutation({
  args: {
    gymId: v.id("gyms"),
    gymName: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const reportId = await ctx.db.insert("errorReports", {
      gymId: args.gymId,
      gymName: args.gymName,
      message: args.message,
      status: "pending",
      createdAt: Date.now(),
    });
    return reportId;
  },
});

// Create a new equipment request
export const createEquipmentRequest = mutation({
  args: {
    gymId: v.id("gyms"),
    gymName: v.string(),
    rackCount: v.optional(v.number()),
    dumbbellMaxKg: v.optional(v.number()),
    hasDeadliftPlatform: v.optional(v.boolean()),
    hasMagnesium: v.optional(v.boolean()),
    hasAirCon: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const requestId = await ctx.db.insert("equipmentRequests", {
      gymId: args.gymId,
      gymName: args.gymName,
      rackCount: args.rackCount,
      dumbbellMaxKg: args.dumbbellMaxKg,
      hasDeadliftPlatform: args.hasDeadliftPlatform,
      hasMagnesium: args.hasMagnesium,
      hasAirCon: args.hasAirCon,
      status: "pending",
      createdAt: Date.now(),
    });
    return requestId;
  },
});

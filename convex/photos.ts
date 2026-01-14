import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createPhotoRequest = mutation({
  args: {
    gymId: v.id("gyms"),
    gymName: v.string(),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("photoRequests", {
      gymId: args.gymId,
      name: args.gymName,
      storageId: args.storageId,
      done: false,
      createdAt: Date.now(),
    });
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("gyms").collect();
  },
});

export const getById = query({
  args: { id: v.id("gyms") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    address: v.string(),
    phone: v.string(),
    website: v.optional(v.string()),
    longitude: v.number(),
    latitude: v.number(),
    photos: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("gyms", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("gyms"),
    name: v.optional(v.string()),
    address: v.optional(v.string()),
    phone: v.optional(v.string()),
    website: v.optional(v.string()),
    longitude: v.optional(v.number()),
    latitude: v.optional(v.number()),
    photos: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const updateData: any = {};

    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.address !== undefined) updateData.address = updates.address;
    if (updates.phone !== undefined) updateData.phone = updates.phone;
    if (updates.website !== undefined) updateData.website = updates.website;
    if (updates.longitude !== undefined) updateData.longitude = updates.longitude;
    if (updates.latitude !== undefined) updateData.latitude = updates.latitude;
    if (updates.photos !== undefined) updateData.photos = updates.photos;
    
    await ctx.db.patch(id, updateData);
    return await ctx.db.get(id);
  },
});

export const remove = mutation({
  args: { id: v.id("gyms") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});


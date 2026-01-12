import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  gyms: defineTable({
    name: v.string(),
    address: v.string(),
    description: v.string(),
    hours: v.string(),
    phone: v.string(),
    rating: v.number(),
    longitude: v.number(),
    latitude: v.number(),
    photos: v.array(v.string()),
  }),
});

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Opening hours for a single day
const dayHours = v.object({
  open: v.string(),  // e.g. "06:00"
  close: v.string(), // e.g. "22:00"
  closed: v.optional(v.boolean()), // true if closed that day
});

export default defineSchema({
  gyms: defineTable({
    name: v.string(),
    address: v.string(),
    description: v.string(),
    hours: v.string(), // Legacy simple hours string
    openingHours: v.optional(v.object({
      monday: dayHours,
      tuesday: dayHours,
      wednesday: dayHours,
      thursday: dayHours,
      friday: dayHours,
      saturday: dayHours,
      sunday: dayHours,
    })),
    phone: v.string(),
    website: v.optional(v.string()), // Website URL
    rating: v.number(),
    longitude: v.number(),
    latitude: v.number(),
    photos: v.array(v.string()),
    multisport: v.optional(v.boolean()), // Whether the gym accepts Multisport card
  }),

  // User-submitted gym requests
  gymRequests: defineTable({
    name: v.string(),
    address: v.string(),
    note: v.optional(v.string()),
    status: v.string(), // "pending", "approved", "rejected"
    createdAt: v.number(),
  }),

  // User-submitted photo requests
  photoRequests: defineTable({
    gymId: v.id("gyms"),
    gymName: v.string(),
    storageId: v.id("_storage"),
    status: v.string(), // "pending", "approved", "rejected"
    createdAt: v.number(),
  }),
});

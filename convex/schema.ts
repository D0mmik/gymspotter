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
    longitude: v.number(),
    latitude: v.number(),
    photos: v.array(v.string()),
    multisport: v.optional(v.boolean()), // Whether the gym accepts Multisport card
    singleEntryPrice: v.optional(v.number()), // Single entry price in CZK
    // Equipment fields
    rackCount: v.optional(v.number()), // Number of squat/power racks
    dumbbellMaxKg: v.optional(v.number()), // Maximum dumbbell weight in kg
    hasDeadliftPlatform: v.optional(v.boolean()), // Has deadlift platform
    hasMagnesium: v.optional(v.boolean()), // Has chalk/magnesium available
    hasAirCon: v.optional(v.boolean()), // Has air conditioning
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

  // User-submitted error reports
  errorReports: defineTable({
    gymId: v.id("gyms"),
    gymName: v.string(),
    message: v.string(),
    status: v.string(), // "pending", "resolved", "dismissed"
    createdAt: v.number(),
  }),

  // User-submitted equipment info
  equipmentRequests: defineTable({
    gymId: v.id("gyms"),
    gymName: v.string(),
    rackCount: v.optional(v.number()),
    dumbbellMaxKg: v.optional(v.number()),
    hasDeadliftPlatform: v.optional(v.boolean()),
    hasMagnesium: v.optional(v.boolean()),
    hasAirCon: v.optional(v.boolean()),
    status: v.string(), // "pending", "approved", "rejected"
    createdAt: v.number(),
  }),
});

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(), 
    name: v.string(),
    email: v.string(),
    imageUrl: v.string(),
    // تم التغيير إلى v.number() ليتوافق مع عمليات الجمع والطرح البسيطة
    credits: v.number(), 
    isSubscribed: v.boolean(),
    settings: v.optional(v.any()), 
  })
  .index("by_token", ["tokenIdentifier"])
  .index("by_email", ["email"]),

  adAccounts: defineTable({
    userId: v.id("users"), 
    platform: v.string(), // "facebook", "tiktok", etc.
    platformName: v.string(),
    accessToken: v.optional(v.string()),
    refreshToken: v.optional(v.string()),
    externalId: v.optional(v.string()), 
    status: v.string(),
  }).index("by_userId", ["userId"]),

  stores: defineTable({
    userId: v.id("users"),
    storeName: v.string(),
    storeUrl: v.string(),
    platform: v.string(),
    status: v.string(),
  }).index("by_userId", ["userId"]),

  campaigns: defineTable({
    userId: v.id("users"),
    productUrl: v.string(),
    videoUrl: v.string(),    
    platform: v.string(),    
    status: v.string(),      
    externalCampaignId: v.optional(v.string()), 
  }).index("by_userId", ["userId"]),
});
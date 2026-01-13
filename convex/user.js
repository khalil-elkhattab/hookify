import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * 1. دالة جلب المستخدم (تدعم currentUser و getUser)
 */
export const currentUser = query({
  args: { 
    email: v.optional(v.string()), 
    userId: v.optional(v.string()) 
  },
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
  },
});

export const getUser = currentUser; // مرادف للدالة

/**
 * 2. دالة الإنشاء (تدعم createOrUpdateUser و storeUser)
 */
export const createOrUpdateUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (existingUser) {
      await ctx.db.patch(existingUser._id, {
        name: args.name,
        imageUrl: args.imageUrl,
      });
      return existingUser._id;
    }

    return await ctx.db.insert("users", {
      tokenIdentifier: identity.tokenIdentifier,
      name: args.name,
      email: args.email,
      imageUrl: args.imageUrl,
      credits: 10.0,
      isSubscribed: false,
    });
  },
});

export const storeUser = createOrUpdateUser; // مرادف للدالة

/**
 * 3. دالة تسجيل الحملات (logCampaign)
 */
export const logCampaign = mutation({
  args: { 
    productUrl: v.string(), 
    videoUrl: v.string(), 
    platform: v.string() 
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (!user) return null;

    return await ctx.db.insert("campaigns", {
      userId: user._id,
      productUrl: args.productUrl,
      videoUrl: args.videoUrl,
      platform: args.platform,
      status: "published",
    });
  },
});
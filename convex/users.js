import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * 1. جلب بيانات المستخدم الحالي
 * تُستخدم لعرض الرصيد المتبقي (Credits) في لوحة التحكم
 */
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();
  },
});

export const getUser = currentUser;

/**
 * 2. تخزين أو تحديث المستخدم
 * تمنح 10 أرصدة مجانية للمستخدم الجديد
 */
export const storeUser = mutation({
  args: {}, 
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized - Please log in");
    }

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (existingUser !== null) {
      await ctx.db.patch(existingUser._id, {
        name: identity.name ?? existingUser.name,
        imageUrl: identity.pictureUrl ?? identity.imageUrl ?? existingUser.imageUrl,
      });
      return existingUser._id;
    }

    return await ctx.db.insert("users", {
      tokenIdentifier: identity.tokenIdentifier,
      name: identity.name ?? "User",
      email: identity.email ?? "no-email",
      imageUrl: identity.pictureUrl ?? identity.imageUrl ?? "",
      credits: 10.0,
      isSubscribed: false,
    });
  },
});

export const createOrUpdateUser = storeUser;

/**
 * 3. نظام خصم الرصيد
 * استدعِ هذه الدالة عند الضغط على زر "Generate Ads"
 */
export const deductCredits = mutation({
  args: { amount: v.number() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (!user) throw new Error("User not found");

    if (user.credits < args.amount) {
      throw new Error("Insufficient credits");
    }

    const newCredits = user.credits - args.amount;

    await ctx.db.patch(user._id, {
      credits: newCredits,
    });

    return newCredits;
  },
});

/**
 * 4. تسجيل الحملات الإعلانية
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
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * 1. جلب بيانات المستخدم الحالي
 * تعرض الرصيد (Credits) والبيانات الثقافية المكتشفة
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
 * 2. تخزين أو تحديث المستخدم (المحسّن ثقافياً)
 * تلتقط هذه الدالة الآن الدولة واللغة والمدينة لدمجها في الـ AI لاحقاً
 */
export const storeUser = mutation({
  args: {
    country: v.optional(v.string()),
    language: v.optional(v.string()),
    city: v.optional(v.string()),
  }, 
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized - Please log in");
    }

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (existingUser !== null) {
      // تحديث البيانات الموجودة مع إضافة البيانات الثقافية المكتشفة من الرادار
      await ctx.db.patch(existingUser._id, {
        name: identity.name ?? existingUser.name,
        imageUrl: identity.pictureUrl ?? identity.imageUrl ?? existingUser.imageUrl,
        country: args.country ?? existingUser.country,
        language: args.language ?? existingUser.language,
        city: args.city ?? existingUser.city,
      });
      return existingUser._id;
    }

    // إنشاء مستخدم جديد ببياناته الثقافية ورصيد مجاني
    return await ctx.db.insert("users", {
      tokenIdentifier: identity.tokenIdentifier,
      name: identity.name ?? "User",
      email: identity.email ?? "no-email",
      imageUrl: identity.pictureUrl ?? identity.imageUrl ?? "",
      credits: 10.0,
      isSubscribed: false,
      // الحقول الثقافية الجديدة (المخ)
      country: args.country ?? "US",
      language: args.language ?? "en",
      city: args.city ?? "Unknown",
    });
  },
});

export const createOrUpdateUser = storeUser;

/**
 * 3. نظام خصم الرصيد
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
    if (user.credits < args.amount) throw new Error("Insufficient credits");

    const newCredits = user.credits - args.amount;
    await ctx.db.patch(user._id, { credits: newCredits });

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
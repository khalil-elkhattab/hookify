// convex/platforms.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// 1. استعلام لجلب الحسابات المرتبطة للمستخدم الحالي
export const getConnectedAccounts = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("adAccounts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

// 2. وظيفة لإضافة أو تحديث حساب إعلاني (بعد نجاح الربط مع الـ API)
export const connectPlatform = mutation({
  args: {
    userId: v.string(),
    platform: v.string(),
    platformName: v.string(),
    accessToken: v.string(),
    externalId: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    // التحقق إذا كان الحساب موجوداً مسبقاً لتحديثه بدلاً من تكراره
    const existing = await ctx.db
      .query("adAccounts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("platform"), args.platform))
      .unique();

    if (existing) {
      return await ctx.db.patch(existing._id, {
        accessToken: args.accessToken,
        status: "connected",
        platformName: args.platformName,
      });
    }

    return await ctx.db.insert("adAccounts", {
      userId: args.userId,
      platform: args.platform,
      platformName: args.platformName,
      accessToken: args.accessToken,
      externalId: args.externalId,
      status: "connected",
    });
  },
});
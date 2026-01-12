import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// وظيفة حفظ بيانات جوجل بعد الحصول على التوكن
export const saveGoogleAccount = mutation({
  args: {
    userId: v.string(),
    accessToken: v.string(),
    refreshToken: v.string(),
  },
  handler: async (ctx, args) => {
    // البحث عن حساب جوجل موجود مسبقاً لهذا المستخدم
    const existing = await ctx.db
      .query("adAccounts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("platform"), "google"))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        accessToken: args.accessToken,
        refreshToken: args.refreshToken,
        status: "connected",
      });
      return "updated";
    } else {
      await ctx.db.insert("adAccounts", {
        userId: args.userId,
        platform: "google",
        platformName: "Google / YouTube Ads",
        accessToken: args.accessToken,
        refreshToken: args.refreshToken,
        status: "connected",
      });
      return "inserted";
    }
  },
});

// وظيفة جلب الحسابات لعرضها في لوحة التحكم
export const getConnectedAccounts = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("adAccounts")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
  },
});
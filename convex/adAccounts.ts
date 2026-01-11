// convex/adAccounts.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * جلب الحسابات الإعلانية المرتبطة
 * هذا يحل خطأ [CONVEX Q(adAccounts:get)]
 */
export const get = query({
  args: {},
  handler: async (ctx) => {
    // في المرحلة الحالية، سنقوم بجلب كافة الحسابات الموجودة في الجدول
    return await ctx.db.query("adAccounts").collect();
  },
});

/**
 * دالة لربط حساب جديد (تستخدمها في مكون AdConnector)
 */
export const link = mutation({
  args: { 
    platform: v.string(), 
    platformName: v.string() 
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("adAccounts", {
      userId: "test_user", // يمكنك ربطها بـ identity لاحقاً
      platform: args.platform,
      platformName: args.platformName,
      status: "active",
    });
  },
});
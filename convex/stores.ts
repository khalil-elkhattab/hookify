// convex/stores.ts
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// جلب جميع المتاجر الخاصة بالمستخدم
export const get = query({
  args: {},
  handler: async (ctx) => {
    // ملحوظة: هنا نفترض جلب المتاجر بشكل عام، 
    // لاحقاً سنضيف فلترة باستخدام identity (clerk) لجلب متاجر المستخدم الحالي فقط
    return await ctx.db.query("stores").collect();
  },
});

// إضافة متجر جديد
export const add = mutation({
  args: {
    storeName: v.string(),
    storeUrl: v.string(),
    platform: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const storeId = await ctx.db.insert("stores", {
      storeName: args.storeName,
      storeUrl: args.storeUrl,
      platform: args.platform,
      userId: args.userId,
      status: "connected",
    });
    return storeId;
  },
});
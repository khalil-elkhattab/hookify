import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/**
 * دالة جلب سجل التصدير الكامل (لصفحة History)
 */
export const getUserExports = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (!user) return [];

    // جلب البيانات من جدول الـ exports الجديد
    return await ctx.db
      .query("exports")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

/**
 * دالة جلب مختصرة للـ Sidebar
 */
export const getUserHistory = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("exports")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(15);
  },
});

/**
 * دالة تتبع التصدير (Tracking & Archiving)
 * تقوم بحفظ الفيديو في جدول الـ exports وتحديث إحصائيات المستخدم
 */
export const trackExport = mutation({
  args: {
    hookId: v.optional(v.id("hooks")),
    videoUrl: v.string(),
    style: v.string(),
    text: v.optional(v.string()), // النص الذي استُخدم في الفيديو
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
      .unique();

    if (!user) throw new Error("User not found");

    // 1. إضافة السجل لجدول الـ exports ليعرض في صفحة التاريخ
    await ctx.db.insert("exports", {
      userId: user._id,
      hookId: args.hookId,
      videoUrl: args.videoUrl,
      style: args.style,
      text: args.text,
    });

    // 2. إذا كان هناك Hook مرتبط، نقوم بتحديث بياناته
    if (args.hookId) {
      const existingHook = await ctx.db.get(args.hookId);
      if (existingHook) {
        await ctx.db.patch(args.hookId, {
          usageCount: (existingHook.usageCount || 0) + 1,
          lastExportedVideo: args.videoUrl,
          selectedStyle: args.style,
        });
      }
    }
    const currentSettings = user.settings || {};
    await ctx.db.patch(user._id, {
      settings: {
        ...currentSettings,
        totalExports: (currentSettings.totalExports || 0) + 1,
        favoriteStyle: args.style,
      }
    });

    return { success: true };
  },
});
export const saveGeneratedHook = mutation({
  args: {
    userId: v.id("users"),
    text: v.string(),
    score: v.number(),
    verdict: v.string(),
    strategy: v.string(),
    productName: v.string(),
    productUrl: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("hooks", {
      ...args,
      usageCount: 0,
      isSaved: false,
    });
  },
});
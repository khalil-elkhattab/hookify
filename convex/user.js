import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// 1. جلب بيانات المستخدم بناءً على الإيميل
export const getUser = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    if (!args.email) return null;
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
  },
});

// 2. إنشاء أو تحديث المستخدم (المستخدمة عند تسجيل الدخول الأول)
export const createOrUpdateUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (!user) {
      // إعدادات البداية لجميع الميزات
      return await ctx.db.insert("users", {
        name: args.name,
        email: args.email,
        imageUrl: args.imageUrl,
        credits: 5, // هدايا التسجيل
        isSubscribed: false,
        settings: {
          defaultLanguage: "Arabic",
          autoRemoveBg: true,
          musicVolume: 0.1,
          videoStyle: "Viral Hormozi",
          autoScrapeMetadata: true,
          showWatermark: true,
        }
      });
    }
    return user;
  },
});

// 3. تحديث الإعدادات (المستخدمة في صفحة Settings للتحكم في الميزات)
export const updateUserSettings = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    settings: v.any(), // يقبل الآن musicVolume أو defaultMusicVolume وكل شيء آخر
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    if (!user) throw new Error("User not found in Convex");

    await ctx.db.patch(user._id, {
      name: args.name,
      settings: args.settings,
    });
    
    return { success: true };
  },
});
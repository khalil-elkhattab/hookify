// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // 1. جدول المستخدمين
  users: defineTable({
    name: v.string(),
    email: v.string(),
    imageUrl: v.string(),
    credits: v.number(),
    isSubscribed: v.boolean(),
    settings: v.optional(v.any()), 
  }).index("by_email", ["email"]),

  // 2. جدول حسابات الإعلانات (تم تحديثه ليدعم الـ APIs)
  adAccounts: defineTable({
    userId: v.string(),
    platform: v.string(),      // "tiktok", "meta", "google"
    platformName: v.string(),  // اسم الحساب لدى المنصة (مثل: "My TikTok Ads")
    accessToken: v.optional(v.string()),  // ضروري جداً لإرسال الفيديو
    refreshToken: v.optional(v.string()), // ضروري لتجديد الدخول تلقائياً
    externalId: v.optional(v.string()),   // ID الحساب داخل المنصة (مثل TikTok Ad ID)
    status: v.string(),        // "connected", "expired", "pending"
  }).index("by_userId", ["userId"]),

  // 3. جدول المتاجر
  stores: defineTable({
    userId: v.string(),
    storeName: v.string(),
    storeUrl: v.string(),
    platform: v.string(),
    status: v.string(),
  }).index("by_userId", ["userId"]),

  // 4. جدول التخزين المؤقت للمنتجات
  productCache: defineTable({
    keyword: v.string(), 
    results: v.any(),    
  }).index("by_keyword", ["keyword"]),

  // 5. جدول الحملات الإعلانية (جديد - لمتابعة ما تم نشره)
  campaigns: defineTable({
    userId: v.string(),
    productUrl: v.string(),
    videoUrl: v.string(),    // رابط الفيديو النهائي (MP4)
    platform: v.string(),    // المنصة التي نُشر عليها
    status: v.string(),      // "published", "failed", "processing"
    externalCampaignId: v.optional(v.string()), // ID الحملة بعد النشر
  }).index("by_userId", ["userId"]),
});
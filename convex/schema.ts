import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // --- جدول المستخدمين (Core Users) ---
  users: defineTable({
    tokenIdentifier: v.string(), 
    name: v.string(),
    email: v.string(),
    imageUrl: v.string(),
    credits: v.number(), 
    isSubscribed: v.boolean(),
    
    // البيانات الجغرافية
    country: v.optional(v.string()), 
    language: v.optional(v.string()),
    city: v.optional(v.string()),
    
    // تفضيلات المستخدم (Data Mining)
    settings: v.optional(v.object({
      favoriteStyle: v.optional(v.string()),
      preferredMusic: v.optional(v.string()),
      totalExports: v.optional(v.number()),
    })), 
  })
  .index("by_token", ["tokenIdentifier"])
  .index("by_email", ["email"]),

  // --- الخزنة الذكية (The Hook Vault) ---
  // تخزن النصوص المولدة بواسطة الـ AI مع تحليلها
  hooks: defineTable({
    userId: v.id("users"),
    text: v.string(),
    score: v.number(),
    verdict: v.string(), // النتيجة (مثلاً: Viral, Strong, etc.)
    strategy: v.string(),
    productName: v.string(),
    productUrl: v.string(),
    targetCountry: v.optional(v.string()),
    isSaved: v.boolean(),
    usageCount: v.number(),
    
    // حقول الربط بالميديا
    lastExportedVideo: v.optional(v.string()), 
    selectedStyle: v.optional(v.string()),
  })
  .index("by_userId", ["userId"])
  .index("by_score", ["score"]),

  // --- سجل الفيديوهات المُصدرة (The Archive) ---
  // هذا الجدول هو الذي سيعرض البيانات في صفحة History
  exports: defineTable({
    userId: v.id("users"),
    hookId: v.optional(v.id("hooks")),
    videoUrl: v.string(),
    style: v.string(),
    text: v.optional(v.string()), // لتخزين النص الذي ظهر في الفيديو للمراجعة السريعة
    prompt: v.optional(v.string()),
  })
  .index("by_user", ["userId"]),

  // --- الحملات الإعلانية (Campaigns) ---
  // ملاحظة: أبقينا عليه في حال أردت تتبع الحالة داخلياً دون ربط خارجي
  campaigns: defineTable({
    userId: v.id("users"),
    hookId: v.optional(v.id("hooks")),
    productUrl: v.string(),
    videoUrl: v.optional(v.string()),    
    status: v.string(), // (Draft, Exported, Shared)      
    
    exportSettings: v.optional(v.object({
      resolution: v.string(),
      hasMusic: v.boolean(),
      voiceType: v.string(),
    })),
  }).index("by_userId", ["userId"]),

  // ملاحظة: تم حذف جداول adAccounts و stores لأنك طلبت إزالتها من الـ SaaS
});
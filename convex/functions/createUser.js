import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    uid: v.string(), // Firebase UID
    name: v.string(),
    email: v.string(),
    photoURL: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // تحقق من وجود المستخدم مسبقاً
    const existing = await ctx.db
      .query("users")
      .withIndex("by_uid", (q) => q.eq("uid", args.uid))
      .first();

    if (existing) return existing._id;

    // إنشاء مستخدم جديد مع 5 credits مجانية
    return await ctx.db.insert("users", {
      uid: args.uid,
      name: args.name,
      email: args.email,
      photoURL: args.photoURL,
      plan: "free",
      credits: 5, // ← 5 محاولات مجانية
      videosGenerated: 0,
      createdAt: Date.now(),
    });
  },
});

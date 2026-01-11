import { query } from "../_generated/server";
import { v } from "convex/values";

export const getUser = query({
  // نحن نرسل userId من المتصفح
  args: { userId: v.string() }, 
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      // البحث يتم في حقل "uid" (الموجود في السكيما) باستخدام القيمة args.userId
      .withIndex("by_uid", (q) => q.eq("uid", args.userId))
      .unique();
  },
});
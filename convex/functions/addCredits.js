import { mutation } from "../_generated/server"; // ✅ استورد من الملف المولد محلياً
import { v } from "convex/values";

export const addCredits = mutation({
  args: { userId: v.id("users"), amount: v.number() },
  handler: async (ctx, args) => {
    // كود الدالة الخاص بك...
  },
});



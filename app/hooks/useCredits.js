"use client";

import { useMutation } from "convex/react";
// ✅ استورد api فقط، هو يحتوي على كل المجلدات والدوال بداخله
import { api } from "@/convex/_generated/api"; 

export function useAddCredits() {
  /**
   * 💡 ملاحظة: إذا كان ملفك في (convex/functions/addCredits.js)
   * فإن المسار البرمجي يكون كالتالي:
   */
  return useMutation(api.functions.addCredits.addCredits);
}
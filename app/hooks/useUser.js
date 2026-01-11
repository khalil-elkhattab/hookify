"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api"; 

export function useUser(email) {
  // 1. المسار الصحيح هو api.user.getUser
  // 2. البحث يجب أن يكون بالـ email لأننا عرفنا index له
  const result = useQuery(api.user.getUser, { 
    email: email || "" 
  });
  
  return result;
}

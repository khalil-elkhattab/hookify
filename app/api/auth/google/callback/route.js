import { NextResponse } from 'next/server';
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

// ربط السيرفر بـ Convex
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) return NextResponse.redirect(new URL('/dashboard?error=no_code', request.url));

  try {
    // تبادل الكود بالتوكنات من جوجل
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: 'http://localhost:3000/api/auth/google/callback',
        grant_type: 'authorization_code',
      }),
    });

    const data = await response.json();

    if (data.access_token) {
      // حفظ البيانات في Convex تحت معرف "user_1" مؤقتاً للتجربة
      await convex.mutation(api.social.saveGoogleAccount, {
        userId: "user_1", 
        accessToken: data.access_token,
        refreshToken: data.refresh_token || "",
      });
    }

    // إعادة التوجيه للوحة التحكم مع رسالة نجاح
    return NextResponse.redirect(new URL('/dashboard?google=connected', request.url));
    
  } catch (error) {
    console.error("Auth Error:", error);
    return NextResponse.redirect(new URL('/dashboard?error=auth_failed', request.url));
  }
}
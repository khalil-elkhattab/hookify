import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: "No code received from Google" }, { status: 400 });
  }

  try {
    // 1. طلب تبادل الـ Code بالـ Tokens من جوجل
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

    if (data.error) {
      console.error("Google Token Error:", data.error);
      return NextResponse.json({ error: data.error_description }, { status: 500 });
    }

    // 2. طباعة التوكن في الـ Terminal للتأكد (سيظهر في VS Code)
    console.log("✅ SUCCESS! Access Token received:");
    console.log("Access Token:", data.access_token);
    console.log("Refresh Token:", data.refresh_token); // هذا مهم جداً للربط الدائم

    /**
     * ملاحظة للمستقبل:
     * هنا يجب أن تقوم بحفظ data.refresh_token في قاعدة البيانات (Supabase/Prisma)
     * لكي لا يضطر المستخدم لعمل Connect كل مرة.
     */

    // 3. توجيه المستخدم للوحة التحكم مع رسالة نجاح
    return NextResponse.redirect(new URL('/dashboard?google=success', request.url));

  } catch (error) {
    console.error("Auth Exception:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
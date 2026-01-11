import { NextResponse } from 'next/server';

export async function GET(request) {
  // 1. التقاط الرمز (Code) الذي أرسله تيك توك في الرابط
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'لم يتم العثور على رمز من تيك توك' }, { status: 400 });
  }

  // 2. هنا سنقوم بتبديل الرمز بـ Access Token (المفتاح الدائم)
  // ملاحظة: سنحتاج لاحقاً لإرسال طلب لـ https://open.tiktokapis.com/v2/oauth/token/
  
  console.log("الرمز السري الذي استلمناه هو:", code);

  // مؤقتاً: سنقوم بإعادة المستخدم للوحة التحكم لنرى النتيجة
  return NextResponse.redirect(new URL('/dashboard', request.url));
}
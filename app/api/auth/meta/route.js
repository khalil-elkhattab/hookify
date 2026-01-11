import { NextResponse } from 'next/server';

export async function GET() {
  const appId = process.env.NEXT_PUBLIC_META_APP_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_URL}/api/auth/meta/callback`;

  // رابط فيسبوك لطلب صلاحيات الإعلانات والملف الشخصي
  const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
    `client_id=${appId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=ads_management,ads_read,public_profile` +
    `&response_type=code`;

  return NextResponse.redirect(authUrl);
}
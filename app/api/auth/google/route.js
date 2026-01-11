import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = 'http://localhost:3000/api/auth/google/callback';

  // الرابط الذي يرسل المستخدم لجوجل
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` + // تأكد من وجود هذه الكلمة
    `&scope=openid%20profile%20email%20https://www.googleapis.com/auth/youtube.upload` +
    `&access_type=offline` +
    `&prompt=consent`;

  return NextResponse.redirect(authUrl);
}
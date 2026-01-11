import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET() {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const redirectUri = `http://localhost:3000/api/auth/tiktok/callback`;

  // 1. إنشاء رمز عشوائي (Code Verifier)
  const codeVerifier = crypto.randomBytes(32).toString('hex');
  
  // 2. تشفير الرمز ليصبح (Code Challenge) كما يطلب تيك توك
  const codeChallenge = crypto
    .createHash('sha256')
    .update(codeVerifier)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  // 3. بناء الرابط الجديد مع المعايير المطلوبة
  const authUrl = `https://www.tiktok.com/v2/auth/authorize/` +
    `?client_key=${clientKey}` +
    `&scope=user.info.basic,video.upload,video.publish` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&code_challenge=${codeChallenge}` +
    `&code_challenge_method=S256` +
    `&state=hookify`;

  return NextResponse.redirect(authUrl);
}
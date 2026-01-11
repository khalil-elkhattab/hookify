import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'لم يتم استلام كود من فيسبوك' }, { status: 400 });
  }

  // هنا سنضع لاحقاً الكود الذي يحول الـ code إلى Access Token دائم
  console.log("تم استلام كود فيسبوك بنجاح:", code);

  return NextResponse.redirect(new URL('/dashboard', request.url));
}
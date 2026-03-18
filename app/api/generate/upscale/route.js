import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req) {
  try {
    const { imageUrl } = await req.json();

    // تأكد من أن الرابط ليس فارغاً
    if (!imageUrl) {
      return NextResponse.json({ success: false, error: "رابط الصورة مطلوب" });
    }

    // تشغيل موديل Real-ESRGAN لتحسين جودة الصورة
    // هذا الموديل يعيد بناء البكسلات بدلاً من مجرد تكبيرها
    const output = await replicate.run(
      "daanelson/real-esrgan-a10b:720e514a3bc35672205566370211566860000000000000000000000000000000",
      {
        input: {
          image: imageUrl,
          upscale: 4, // تكبير 4 أضعاف الجودة الأصلية
          face_enhance: true, // تحسين ملامح الوجوه إذا وجدت في الصورة
        }
      }
    );

    // ملاحظة: Replicate قد يعيد رابطاً مباشراً أو مصفوفة روابط حسب الموديل
    const upscaleUrl = Array.isArray(output) ? output[0] : output;

    return NextResponse.json({ success: true, upscaleUrl });
  } catch (error) {
    console.error("Replicate Error:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
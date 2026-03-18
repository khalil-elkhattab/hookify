import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { getCulturalContext } from "./cultureData";

export const generateSmartHook = action({
  args: {
    productDescription: v.string(),
    targetAudience: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. جلب بيانات المستخدم المحدثة (مع الدولة والمدينة واللغة)
    const user = await ctx.runQuery(api.users.currentUser);
    if (!user) throw new Error("User not found. Please log in.");

    // استخدام البيانات المكتشفة أو العودة للقيم الافتراضية
    const country = user.country || "US";
    const language = user.language || "en";
    const city = user.city || "this region";
    
    // 2. جلب القواعد الثقافية (المخ الثقافي)
    const culture = getCulturalContext(country);

    // 3. بناء الـ Prompt الاحترافي
    const systemPrompt = `
      You are a world-class viral marketing expert specializing in the ${country} market.
      Your goal is to write a high-converting 'Ad Hook' for social media.
      
      Target City/Region: ${city}
      Cultural Strategy: ${culture.triggers}
      Tone of Voice: ${culture.tone}
      Local Slang to Mix: ${culture.slang}
      
      Strict Rules:
      1. Response must be in ${language}.
      2. If Arabic, use a "White Dialect" suitable for ${city}.
      3. Focus heavily on emotional triggers.
      4. Output ONLY the hook text. No quotes, no intro, no explanation.
    `;

    // 4. استدعاء Groq API بالموديل الجديد 2026
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // تم التحديث إلى النموذج الجديد لأن llama3-70b-8192 توقف
          model: "llama-3.3-70b-versatile", 
          messages: [
            { role: "system", content: systemPrompt },
            { 
              role: "user", 
              content: `Product/URL: ${args.productDescription}. Audience: ${args.targetAudience}.` 
            }
          ],
          temperature: 0.85,
          max_tokens: 200,
        }),
      });

      // فحص إذا كان هناك خطأ في الاستجابة
      if (!response.ok) {
        const errorDetail = await response.json();
        console.error("Groq API Error Detail:", errorDetail);
        throw new Error(`Groq API Error: ${errorDetail.error?.message || "Invalid API request"}`);
      }

      const data = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error("AI returned an empty response.");
      }

      const hookResult = data.choices[0].message.content.trim();

      // 5. خصم الكريديت بعد التأكد من نجاح التوليد
      await ctx.runMutation(api.users.deductCredits, { amount: 1 });

      return {
        success: true,
        hook: hookResult,
        metadata: {
          country,
          city,
          language
        }
      };

    } catch (error) {
      console.error("Critical AI Failure:", error.message);
      throw new Error(error.message || "Failed to connect to AI engine");
    }
  },
});
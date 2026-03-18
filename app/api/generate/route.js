import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ 
  apiKey: process.env.GROQ_API_KEY 
});

export async function POST(req) {
  try {
    const { productTitle, productDescription, language, style } = await req.json();

    // مكتبة الشخصيات العالمية للدروبشيبرز
    const personas = {
      // المغرب - الداريجة
      "Arabic_MA": {
        name: "Moroccan TikTok Influencer",
        traits: "Native Darija, street slang, high energy, uses words like 'ناضي', 'هربان'.",
        rules: "ABSOLUTELY NO MSA (Fusha). Mix in French words like 'offre', 'livraison'."
      },
      // السعودية والخليج - اللهجة البيضاء/النجدية
      "Arabic_SA": {
        name: "Saudi Content Creator",
        traits: "Khaliji/Najdi dialect, polite but trendy, uses 'يا هلا', 'شي خيالي', 'توصيل سريع'.",
        rules: "Focus on Gulf slang. Use terms popular in Saudi Snapchat/TikTok ads."
      },
      // الصين - لغة التسويق في Douyin (تيك توك الصين)
      "Chinese": {
        name: "Douyin Live-Stream Seller",
        traits: "Urgent, benefit-driven, uses internet slang (e.g., 种草, 杀手锏).",
        rules: "Sound like a viral professional seller. Use high-conversion Chinese social media terms."
      },
      // فرنسا - لغة الشباب الباريسي
      "French": {
        name: "French E-commerce Expert",
        traits: "Native French, cool, sophisticated, uses 'incroyable', 'pépite', 'foncez'.",
        rules: "Avoid formal 'vous' if the style is UGC. Use natural, catchy phrases."
      },
      // ألمانيا - لغة موثوقة وعملية
      "German": {
        name: "German Direct Response Expert",
        traits: "Trustworthy, clear, problem-solving, uses 'Hammer-Angebot', 'Must-have'.",
        rules: "Focus on quality and efficiency. Native conversational German."
      },
      // أمريكا وبريطانيا - لغة سريعة ومحفزة
      "English": {
        name: "US Viral Marketing Specialist",
        traits: "High FOMO, psychological triggers, slang like 'game-changer', 'obsessed'.",
        rules: "Conversational American English. No dry corporate language."
      },
      // البرازيل - سوق الدروبشيبينغ الضخم
      "Portuguese": {
        name: "Brazilian Social Media Strategist",
        traits: "Very friendly, persuasive, uses 'top demais', 'oferta imperdível'.",
        rules: "Portuguese (Brazil) only. Focus on excitement and social proof."
      }
    };

    // اختيار الشخصية بناءً على اللغة المرسلة من الـ Frontend
    const selectedPersona = personas[language] || personas["English"];

    const prompt = `
    You are now a ${selectedPersona.name}. 
    Your personality: ${selectedPersona.traits}.
    Linguistic Rules: ${selectedPersona.rules}.

    TASK: Generate 4 high-converting, viral hooks for this product:
    Product: ${productTitle}
    Description: ${productDescription}
    Style: ${style}

    OUTPUT STRUCTURE:
    - Respond ONLY in JSON format.
    - Language: ${language} (MUST be native and local slang).
    - Keys: problem_hook, benefit_hook, curiosity_hook, social_proof.
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { 
          role: "system", 
          content: "You are a world-class localized marketing engine. You don't translate; you adapt content to the soul of the local culture. You speak every language as a native expert. Output JSON only." 
        },
        { role: "user", content: prompt }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const content = chatCompletion.choices[0].message.content;

    return NextResponse.json({ 
      success: true, 
      hooks: JSON.parse(content) 
    });

  } catch (error) {
    console.error("GROQ_API_ERROR:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
// convex/cultureData.js

export const culturalRules = {
  // مجموعة الشرق الأوسط وشمال أفريقيا (MENA)
  "ARABIC_CORE": {
    triggers: "Trust, Family, Generosity, Social Proof, Hospitality",
    tone: "Respectful, Warm, Story-driven, Personal",
    slang: "Local dialect nuances (Ammiya), use warm greetings like 'Ya Hala'",
  },
  // مجموعة الدول الغربية (Western)
  "WESTERN_CORE": {
    triggers: "Individual Success, Efficiency, Time-saving, Logic, FOMO",
    tone: "Direct, Action-oriented, Casual, Bold",
    slang: "Industry-specific buzzwords, modern internet slang",
  },
  // مجموعة شرق آسيا (East Asia)
  "EAST_ASIA_CORE": {
    triggers: "Harmony, Quality, Long-term Value, Respect, Social Status",
    tone: "Polite, Humble, Detailed, Professional",
    slang: "Formal and precise terms, honorifics if applicable",
  }
};

/**
 * دالة ذكية لاختيار السياق الثقافي بناءً على رمز الدولة
 * @param {string} countryCode - رمز الدولة المكون من حرفين (مثل SA, US, MA)
 */
export const getCulturalContext = (countryCode) => {
  const mena = ["SA", "AE", "EG", "MA", "JO", "KW", "QA", "OM", "BH", "DZ", "TN"];
  const western = ["US", "GB", "CA", "AU", "DE", "FR", "IT", "ES", "NL"];
  const eastAsia = ["JP", "KR", "CN", "SG"];

  const code = countryCode?.toUpperCase();

  if (mena.includes(code)) return culturalRules.ARABIC_CORE;
  if (western.includes(code)) return culturalRules.WESTERN_CORE;
  if (eastAsia.includes(code)) return culturalRules.EAST_ASIA_CORE;
  
  // الخيار الافتراضي العالمي (Global Default)
  return culturalRules.WESTERN_CORE; 
};
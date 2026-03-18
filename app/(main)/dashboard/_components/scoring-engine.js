// lib/scoring-engine.js

export function analyzeHook(text) {
  if (!text) return null;

  const cleanText = text.toLowerCase().trim();
  const words = cleanText.split(/\s+/);
  const wordCount = words.length;

  // 1. مصفوفة الأنماط الناجحة (Viral Velocity)
  const viralPatterns = [
    { regex: /i (found|discovered) the/g, weight: 25 },
    { regex: /stop (scrolling|doing)/g, weight: 20 },
    { regex: /they don't want you to/g, weight: 30 },
    { regex: /this is why your/g, weight: 15 },
    { regex: /how to .* without/g, weight: 25 },
    { regex: /^\d+ secrets/g, weight: 20 },
    { regex: /the secret to/g, weight: 20 }
  ];

  let patternScore = 0;
  viralPatterns.forEach(p => {
    if (p.regex.test(cleanText)) patternScore += p.weight;
  });

  // 2. محرك الرنين العاطفي (Psychological Resonance)
  const emotionalTriggers = {
    fear: ['wrong', 'dangerous', 'stop', 'scam', 'exposed', 'losing', 'avoid'],
    greed: ['free', 'cheapest', 'money', 'profit', 'save', 'win', 'rich'],
    curiosity: ['secret', 'hidden', 'hacks', 'weird', 'finally', 'unbelievable'],
    urgency: ['now', 'fast', 'limited', 'today', 'quick', 'before']
  };

  let emotionalScore = 0;
  const foundEmotions = [];
  Object.entries(emotionalTriggers).forEach(([emotion, list]) => {
    if (words.some(w => list.includes(w))) {
      emotionalScore += 15;
      foundEmotions.push(emotion);
    }
  });
  emotionalScore = Math.min(emotionalScore, 40);

  // 3. تحليل الاحتفاظ (Retention Sweet Spot)
  let retentionScore = 0;
  if (wordCount >= 6 && wordCount <= 12) retentionScore = 30;
  else if (wordCount > 12 && wordCount <= 18) retentionScore = 15;
  else retentionScore = 5;

  const totalScore = Math.min(patternScore + emotionalScore + retentionScore, 100);

  let verdict = "Needs Refinement";
  let color = "#ef4444"; 

  if (totalScore >= 80) {
    verdict = "Viral Masterpiece";
    color = "#3b82f6"; 
  } else if (totalScore >= 60) {
    verdict = "Strong Engagement";
    color = "#10b981"; 
  }

  return {
    totalScore,
    breakdown: { patterns: patternScore, psychology: emotionalScore, retention: retentionScore },
    verdict,
    color,
    suggestedFormat: foundEmotions[0] || "General"
  };
}
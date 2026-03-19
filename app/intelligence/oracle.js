const SERPER_KEY = process.env.SERPER_KEY;
const GROQ_KEY = process.env.GROQ_KEY;

export const performDeepScan = async (keyword) => {
  try {
    // 1. التجسس الشامل: جمع 100 نتيجة من 4 منصات كبرى
    const queries = [
      { q: `"${keyword}" site:myshopify.com`, type: "Shopify (Dropshippers)" },
      { q: `"${keyword}" site:amazon.com`, type: "Amazon (Retail)" },
      { q: `"${keyword}" site:aliexpress.com`, type: "AliExpress (Suppliers)" },
      { q: `"${keyword}" site:ebay.com`, type: "eBay (Resellers)" }
    ];

    const searchResults = await Promise.all(
      queries.map(item => 
        fetch('https://google.serper.dev/search', {
          method: 'POST',
          headers: { 
            'X-API-KEY': SERPER_KEY, 
            'Content-Type': 'application/json' 
          },
          body: JSON.stringify({ q: item.q, num: 25 }) // 25 نتيجة لكل منصة
        }).then(async res => {
            const data = await res.json();
            return { platform: item.type, listings: data.organic || [] };
        })
      )
    );

    // تنظيف البيانات لتقليل استهلاك الـ Tokens في Groq
    const marketContext = searchResults.map(entry => ({
      platform: entry.platform,
      data: entry.listings.map(l => ({
        title: l.title,
        link: l.link,
        snippet: l.snippet
      }))
    }));

    // 2. موجه الأوامر الاستخباري (The Ultimate Spy Prompt)
    const prompt = `
      Act as a Wall Street E-commerce Spy. Analyze 100 real-time listings for: "${keyword}".
      Context: ${JSON.stringify(marketContext)}
      
      Your Goal: 
      - Extract price patterns from Amazon vs Shopify vs AliExpress.
      - Identify the top 3 Shopify competitors who are likely making the most money.
      - Calculate the "Revenue Gap" (The difference between supplier cost and highest retail price).

      Return ONLY a JSON object:
      {
        "saturation": number (0-100),
        "avgMarketPrice": "string",
        "supplierPrice": "string",
        "netProfit": "string (formula: price - supplier - $10 marketing)",
        "opportunityScore": number (0-100),
        "viralScore": number (1-10),
        "amazonAvg": "string",
        "shopifyAvg": "string",
        "verdict": "Detailed professional market strategy",
        "bestSupplier": "URL",
        "bestCompetitor": "URL",
        "competitorAnalysis": [
          { "name": "Store Name", "price": "$xx", "link": "URL", "estMonthlySales": "$xxxx" }
        ],
        "safeStatus": "Safe" | "Risk",
        "adStrategy": "The winning ad hook"
      }
    `;

    const aiResponse = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "You are a Master Market Analyst. Return only valid JSON." },
          { role: "user", content: prompt }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.1,
        response_format: { type: "json_object" }
      })
    });

    const aiData = await aiResponse.json();

    if (aiData.choices && aiData.choices[0]) {
      return JSON.parse(aiData.choices[0].message.content);
    } else {
      throw new Error("Spy Engine Logic Failure");
    }

  } catch (error) {
    console.error("Critical Oracle Spy Error:", error);
    return {
      saturation: 50,
      avgMarketPrice: "N/A",
      supplierPrice: "N/A",
      netProfit: "Calculation Error",
      opportunityScore: 0,
      competitorAnalysis: [],
      verdict: "The Oracle's eyes are clouded. Check API keys.",
      bestSupplier: "#",
      bestCompetitor: "#",
      safeStatus: "Risk"
    };
  }
};
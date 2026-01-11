// app/api/generate/route.js
import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  try {
    const { productUrl, language, style, productTitle, productDescription } = await req.json();

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a High-Ticket E-commerce Copywriter.
          
          DATA PROVIDED:
          - Title: ${productTitle}
          - Description: ${productDescription}
          - URL: ${productUrl}
          
          YOUR INSTRUCTIONS:
          1. Strictly analyze if this is a GADGET or CLOTHING. 
          2. If the URL is from a platform like AliExpress/Amazon, focus on the "Description" provided to understand the product's function.
          3. SCRIPTING RULES:
             - NO generic phrases like "this product". Use the actual product name.
             - Language: ${language}.
             - Style: ${style}.
          
          JSON FORMAT:
          {
            "problem_hook": "Specific pain point for this product",
            "benefit_hook": "The #1 transformation after using it",
            "curiosity_hook": "A 'did you know' style hook about this specific item",
            "social_proof": "Realistic proof (e.g. 15,000+ sold, 4.8/5 rating)"
          }`
        },
        {
          role: "user",
          content: `Write 4 viral TikTok hooks for: ${productTitle}. Context: ${productDescription}`
        }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    return NextResponse.json(JSON.parse(completion.choices[0].message.content));
  } catch (error) {
    return NextResponse.json({ error: "AI Error" }, { status: 500 });
  }
}
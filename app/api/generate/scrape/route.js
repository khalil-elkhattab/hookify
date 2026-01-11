import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function POST(req) { // حذفنا : Request
  try {
    const { productUrl, source } = await req.json();

    if (!productUrl) {
      return NextResponse.json({ success: false, error: "URL is required" }, { status: 400 });
    }

    // --- 1. المسار السريع لـ Shopify ---
    if (source === "shopify" || productUrl.includes("myshopify.com")) {
      try {
        const cleanUrl = productUrl.split('?')[0]; 
        const response = await fetch(`${cleanUrl}.js`);
        if (response.ok) {
          const data = await response.json();
          return NextResponse.json({
            success: true,
            title: data.title,
            description: data.description?.replace(/<[^>]*>?/gm, '').slice(0, 200),
            mainImage: data.featured_image,
            allImages: data.images.map((img) => img.startsWith('http') ? img : `https:${img}`),
            sourceType: "shopify_api"
          });
        }
      } catch (e) {
        console.log("Shopify API failed, falling back to Scraper...");
      }
    }

    // --- 2. المسار العام (AliExpress / CJ / Others) باستخدام Cheerio ---
    const response = await fetch(productUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);

    const html = await response.text();
    const $ = cheerio.load(html);
    
    const title = $('meta[property="og:title"]').attr('content') || $("title").text().trim();
    const description = $('meta[property="og:description"]').attr('content') || "";
    
    const images = []; // حذفنا تحديد النوع : string[]
    const ogImage = $('meta[property="og:image"]').attr('content');
    if (ogImage) images.push(ogImage);

    $("img").each((i, el) => {
      let src = $(el).attr("src") || $(el).attr("data-src") || $(el).attr("data-old-hires");
      if (src) {
        if (src.startsWith("//")) src = "https:" + src;
        if (src.startsWith("/") && !src.startsWith("http")) {
          const urlObj = new URL(productUrl);
          src = urlObj.origin + src;
        }
        const isNotIcon = !/icon|logo|sprite|css|avatar|flag/i.test(src);
        if (src.startsWith("http") && isNotIcon) images.push(src);
      }
    });

    const uniqueImages = [...new Set(images)];

    return NextResponse.json({
      success: true,
      title: title || "Product Found",
      description: description,
      mainImage: uniqueImages[0] || "",
      allImages: uniqueImages.slice(0, 15),
      sourceType: "general_scraper"
    });

  } catch (error) { // حذفنا : any
    console.error("Scraper Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
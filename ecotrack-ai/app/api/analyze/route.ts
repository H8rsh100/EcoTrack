import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();
    
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Missing Gemini API Key" }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // Fetch the image from Supabase and convert to base64
    const imageResp = await fetch(imageUrl);
    const imageBuffer = await imageResp.arrayBuffer();

    const result = await model.generateContent([
      "Extract the total units (kWh) and total amount due from this electricity bill. Return as JSON: { \"units\": number, \"amount\": number }",
      {
        inlineData: {
          data: Buffer.from(imageBuffer).toString("base64"),
          mimeType: "image/png",
        },
      },
    ]);

    const text = result.response.text();
    // Clean the markdown if AI returns ```json ... ```
    const jsonString = text.replace(/```json|```/g, "").trim();
    
    return NextResponse.json(JSON.parse(jsonString));
  } catch (error: any) {
    console.error("AI ROUTE ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
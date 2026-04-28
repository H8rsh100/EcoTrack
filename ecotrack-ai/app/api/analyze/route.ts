import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 1. Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// 2. Initialize Supabase (Using Service Role Key to bypass RLS for the backend)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();
    
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Missing Gemini API Key" }, { status: 500 });
    }

    // Use the 2.5-flash model we established earlier
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    // Fetch the image from Supabase and convert to base64
    const imageResp = await fetch(imageUrl);
    const imageBuffer = await imageResp.arrayBuffer();

    // 3. Call Gemini to extract data
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
    const jsonString = text.replace(/```json|```/g, "").trim();
    const aiData = JSON.parse(jsonString);

    // 4. PERFORM BRICK 6 MATH & PERSISTENCE
    const units = parseFloat(aiData.units) || 0;
    const amount = parseFloat(aiData.amount) || 0;
    const carbonImpact = units * 0.695; // 2026 India Grid Intensity Factor

    const { error: dbError } = await supabase
      .from('carbon_logs')
      .insert({
        category: 'Electricity',
        consumption_value: units,
        unit: 'kWh',
        co2_emitted_kg: carbonImpact,
        document_url: imageUrl,
        is_verified: true
        // Note: user_id is omitted because we made it optional in the SQL step
      });

    if (dbError) {
      console.error("❌ DATABASE SAVE FAILED:", dbError.message);
    } else {
      console.log("✅ DATA PERSISTED TO CARBON_LOGS");
    }

    // 5. Return everything to the frontend
    return NextResponse.json({
      units,
      amount,
      carbonImpact: carbonImpact.toFixed(2)
    });

  } catch (error: any) {
    console.error("AI ROUTE ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
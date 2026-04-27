import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();

    // 1. Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 2. Define the prompt
    const prompt = `
      Analyze this utility bill. Extract the following data into a clean JSON format:
      - category (Electricity, Water, or Fuel)
      - total_amount (number only)
      - units_consumed (e.g., kWh or Liters)
      - estimated_co2_kg (Calculate using 0.385kg/kWh for Electricity or 2.3kg/L for Fuel)
      
      Only return the JSON.
    `;

    // 3. Fetch image and process
    const response = await fetch(imageUrl);
    const imageData = await response.arrayBuffer();

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: Buffer.from(imageData).toString("base64"),
          mimeType: "image/jpeg",
        },
      },
    ]);

    const text = result.response.text();
    return NextResponse.json(JSON.parse(text));
  } catch (error) {
    return NextResponse.json({ error: "AI Processing Failed" }, { status: 500 });
  }
}
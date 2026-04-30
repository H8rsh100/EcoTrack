export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("DEBUG: GEMINI_API_KEY is missing from .env.local");
      return new Response(JSON.stringify({ error: "API Key missing" }), { status: 500 });
    }

    console.log("DEBUG: Analyzing image at URL:", imageUrl);

    // Call Gemini
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: "Extract the total electricity units consumed (kWh) from this bill. Return ONLY a JSON object: { \"units\": number }" },
            { inlineData: { mimeType: "image/jpeg", data: await fetch(imageUrl).then(res => res.arrayBuffer()).then(buf => Buffer.from(buf).toString('base64')) } }
          ]
        }]
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("DEBUG: Gemini API Error:", data);
      return new Response(JSON.stringify(data), { status: response.status });
    }

    return new Response(JSON.stringify(data), { status: 200 });

  } catch (error) {
    console.error("DEBUG: Catch Error:", error);
    return new Response(JSON.stringify({ error: "Server Error" }), { status: 500 });
  }
}
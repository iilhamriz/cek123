// testGemini.js

import { GoogleGenerativeAI } from "@google/generative-ai";

// Contoh fungsi getNextApiKeyGemini() (sekadar placeholder).
// Mungkin Anda punya cara dinamis mengambil API key berbeda-beda.
function getNextApiKeyGemini() {
  return "YOUR_GEMINI_API_KEY";
}

async function main() {
  try {
    // 1. Buat instance
    const genAI = new GoogleGenerativeAI(getNextApiKeyGemini());

    // 2. Dapatkan model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // 3. Generate content
    const prompt = "Halo Gemini, apa kabar?";
    const result = await model.generateContent(prompt);

        // Dapatkan teks hasil AI
    const rawText = await result.response.text();

    console.log(rawText, "RESPONSE V2");
  } catch (error) {
    console.error("Error di main:", error.message);
  }
}

main();

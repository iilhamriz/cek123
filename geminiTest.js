// testGemini.js

import { GoogleGenerativeAI } from "@google/generative-ai";

function parseAiJsonResponse(rawText) {
  // 1) Hapus backticks + label "json", tapi simpan isi di dalamnya.
  // Contoh: ```json\n{ "isScam":false}\n``` menjadi { "isScam":false}
  // Regex global (g) agar jika AI menulis beberapa code fence, semuanya dihapus.
  const fenceRegex = /```(?:json)?([\s\S]*?)```/g;
  let cleaned = rawText.replace(fenceRegex, (match, p1) => p1).trim();

  // 2) Coba temukan blok { ... }
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) {
    // Jika tidak ada match, mungkin respons sudah JSON polos (tanpa bracket di luar code fence)
    try {
      return JSON.parse(cleaned);
    } catch (err) {
      throw new Error("Respons AI bukan JSON valid.\nRespons: " + rawText);
    }
  }

  // 3) Jika ketemu { ... }, parse substring itu
  try {
    return JSON.parse(match[0]);
  } catch (err) {
    throw new Error("Gagal parse JSON dari respons AI:\n" + err.message);
  }
}

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

    // Bersihkan backticks + parse JSON
    const parsed = parseAiJsonResponse(rawText);

    console.log(parsed, "RESPONSE");
  } catch (error) {
    console.error("Error di main:", error.message);
  }
}

main();

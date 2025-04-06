import { GoogleGenerativeAI } from "@google/generative-ai";

// Contoh fungsi getNextApiKeyGemini() (sekadar placeholder).
// Mungkin Anda punya cara dinamis mengambil API key berbeda-beda.
function getNextApiKeyGemini() {
  return "YOUR_GEMINI_API_KEY";
}

async function onEdit(e) {
  try {
    const range = e.range;
    const sheet = range.getSheet();
    const col = range.getColumn();
    const row = range.getRow();

    // Hanya berjalan jika kolom F (col = 6) diisi pada baris > 1
    if (col === 6 && row > 1) {
      const status = sheet.getRange(row, 5).getValue();   // Kolom E
      const pertanyaan = sheet.getRange(row, 6).getValue(); // Kolom F
      const jawaban = sheet.getRange(row, 7).getValue();    // Kolom G

      // Jika kolom E berisi "[Aku isi otomatis]" dan kolom F terisi, lalu kolom G masih kosong,
      // maka panggil fungsi generateJawabanDariGPT
      if (status === "[Aku isi otomatis]" && pertanyaan && !jawaban) {
        await generateJawabanDariGPT(sheet, row, pertanyaan);
      }
    }
  } catch (error) {
    Logger.log("onEdit error: " + error.message);
  }
}

async function geminiAI(prompt) {
  try {
    // 1. Buat instance
    const genAI = new GoogleGenerativeAI(getNextApiKeyGemini());

    // 2. Dapatkan model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent(prompt);

        // Dapatkan teks hasil AI
    const rawText = await result.response.text();

    console.log(rawText, "RESPONSE V2");
    return rawText;
  } catch (error) {
    console.error("Error di main:", error.message);
  }
}

async function generateJawabanDariGPT(sheet, row, prompt) {
  try {
    const minggu = sheet.getRange(row, 1).getValue();    // Kolom A
    const kegiatan = sheet.getRange(row, 4).getValue();  // Kolom D
    const matkul = sheet.getName();

    // Perbaikan: gunakan backtick untuk string template
    const fullPrompt = `Jawablah pertanyaan diskusi untuk mata kuliah ${matkul}, minggu ke-${minggu}, kegiatan: ${kegiatan}. Pertanyaannya: "${prompt}"`;

    const response = await geminiAI(fullPrompt)
    
    sheet.getRange(row, 7).setValue(response);
  } catch (err) {
    // Jika ada error, tampilkan pesan error di kolom G
    sheet.getRange(row, 7).setValue("❌ Error: " + err.message);
  }
}

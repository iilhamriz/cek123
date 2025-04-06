/***************
 *  CATATAN PENTING:
 *  1) Sampai saat ini, Gemini belum punya endpoint publik resmi dari Google.
 *  2) Kode di bawah hanya CONTOH (template). Anda perlu mengubah:
 *     - URL endpoint
 *     - Parameter request (payload) 
 *     - Model name dsb.
 *    agar sesuai ketentuan API Gemini.
 *  3) Pastikan script ini "container-bound" ke spreadsheet (buka via Extensions > Apps Script).
 *  4) Buat "Installable Trigger" untuk onEdit agar dapat melakukan panggilan eksternal.
 ***************/

const GEMINI_API_KEY = 'MASUKKAN_GEMINI_API_KEY_ANDA_DI_SINI';

function onEdit(e) {
  try {
    const range = e.range;
    const sheet = range.getSheet();
    const col = range.getColumn();
    const row = range.getRow();

    // Misalnya: trigger di kolom F (6), baris > 1
    if (col === 6 && row > 1) {
      const status = sheet.getRange(row, 5).getValue();   // Kolom E
      const pertanyaan = sheet.getRange(row, 6).getValue(); // Kolom F
      const jawaban = sheet.getRange(row, 7).getValue();    // Kolom G

      // Jika kolom E berisi "[Aku isi otomatis]" dan kolom F terisi, lalu kolom G masih kosong,
      // maka panggil fungsi generateJawabanDariGemini
      if (status === "[Aku isi otomatis]" && pertanyaan && !jawaban) {
        generateJawabanDariGemini(sheet, row, pertanyaan);
      }
    }
  } catch (error) {
    Logger.log("onEdit error: " + error.message);
  }
}

function generateJawabanDariGemini(sheet, row, prompt) {
  try {
    const minggu = sheet.getRange(row, 1).getValue();     // Kolom A
    const kegiatan = sheet.getRange(row, 4).getValue();   // Kolom D
    const matkul = sheet.getName();

    // Bangun prompt sesuai kebutuhan
    const fullPrompt = `Jawablah pertanyaan diskusi untuk mata kuliah ${matkul}, 
    minggu ke-${minggu}, kegiatan: ${kegiatan}. 
    Pertanyaannya: "${prompt}"`;

    // ---- Perhatikan: URL di bawah ini hanyalah CONTOH. ----
    // Anda harus menggantinya dengan endpoint resmi Gemini ketika tersedia.
    const GEMINI_ENDPOINT = 'https://api.google.com/v1/gemini/chat';  // Contoh placeholder
    
    const response = UrlFetchApp.fetch(GEMINI_ENDPOINT, {
      method: 'post',
      contentType: 'application/json',
      headers: {
        // Format Authorization kemungkinan akan sama, tapi sesuaikan dengan dokumentasi resmi nantinya
        Authorization: `Bearer ${GEMINI_API_KEY}`,
      },
      payload: JSON.stringify({
        // Struktur payload kemungkinan beda. Ini hanya contoh.
        // Silakan sesuaikan parameter “model”, “messages”, dsb. 
        // dengan yang ditentukan API Gemini. 
        model: 'gemini-bison-alpha', 
        messages: [{ role: "user", content: fullPrompt }],
        temperature: 0.7,
      }),
    });

    // Respons JSON juga kemungkinan berbeda dengan OpenAI.
    // Ini hanya contoh parsing minimal.
    const json = JSON.parse(response.getContentText());
    const reply = json?.choices?.[0]?.message?.content?.trim() || 'Tidak ada jawaban.';
    sheet.getRange(row, 7).setValue(reply);

  } catch (err) {
    sheet.getRange(row, 7).setValue("❌ Error: " + err.message);
  }
}

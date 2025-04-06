/***************
 *  CATATAN:
 *  1) Pastikan script ini ditempel di file Apps Script yang sama (container-bound)
 *     dengan Google Sheets tempat Anda ingin menjalankan onEdit.
 *  2) Setelah itu, jadikan onEdit ini sebagai "Installable Trigger" agar diizinkan
 *     melakukan UrlFetchApp.fetch() ke OpenAI. Caranya:
 *     - Buka editor Apps Script
 *     - Klik 'Triggers' (ikon jam)
 *     - Tambahkan trigger baru:
 *       - Pilih fungsi: onEdit
 *       - Pilih event type: "On edit"
 *     - Simpan dan berikan izin yang diperlukan.
 ***************/

const OPENAI_API_KEY = ""

function onEdit(e) {
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
        generateJawabanDariGPT(sheet, row, pertanyaan);
      }
    }
  } catch (error) {
    Logger.log("onEdit error: " + error.message);
  }
}

function generateJawabanDariGPT(sheet, row, prompt) {
  try {
    const minggu = sheet.getRange(row, 1).getValue();    // Kolom A
    const kegiatan = sheet.getRange(row, 4).getValue();  // Kolom D
    const matkul = sheet.getName();

    // Perbaikan: gunakan backtick untuk string template
    const fullPrompt = `Jawablah pertanyaan diskusi untuk mata kuliah ${matkul}, minggu ke-${minggu}, kegiatan: ${kegiatan}. Pertanyaannya: "${prompt}"`;

    const response = UrlFetchApp.fetch("https://api.openai.com/v1/chat/completions", {
      method: "post",
      contentType: "application/json",
      headers: {
        // Perbaikan: gunakan backtick juga di sini
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      payload: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: fullPrompt }],
        temperature: 0.7,
      }),
    });

    const json = JSON.parse(response.getContentText());
    const reply = json.choices[0].message.content.trim();
    sheet.getRange(row, 7).setValue(reply);
  } catch (err) {
    // Jika ada error, tampilkan pesan error di kolom G
    sheet.getRange(row, 7).setValue("❌ Error: " + err.message);
  }
}

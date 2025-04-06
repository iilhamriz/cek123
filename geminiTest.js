// testGemini.js
//
// Pastikan Anda install 'node-fetch' dulu:
//   npm install node-fetch
//
// Cara pakai (command line):
//   node testGemini.js "Apa itu asynchronous dalam JavaScript?"
//
// Kode di bawah hanya CONTOH.
// Endpoint, model, dan struktur payload kemungkinan berbeda jika Gemini sudah rilis resmi.

const fetch = require('node-fetch');

// Ganti dengan API key Gemini Anda (saat sudah tersedia).
const GEMINI_API_KEY = "MASUKKAN_API_KEY_GEMINI_DI_SINI";

// Fungsi pemanggilan "Gemini" (placeholder) untuk satu pertanyaan
async function getGeminiReply(question) {
  // Placeholder endpoint – ubah sesuai dokumentasi Gemini
  const GEMINI_ENDPOINT = "https://api.google.com/v1/gemini/chat"; 

  // Payload ini juga hanya contoh. Bisa berbeda di versi resmi.
  const payload = {
    model: "gemini-beta-model",
    messages: [{ role: "user", content: question }],
    temperature: 0.7
  };

  // Lakukan request ke endpoint
  const response = await fetch(GEMINI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GEMINI_API_KEY}`
    },
    body: JSON.stringify(payload)
  });

  // Jika gagal, lempar error
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status} - ${await response.text()}`);
  }

  // Parsing respons
  const data = await response.json();
  // Asumsi strukturnya mirip OpenAI
  const answer = data?.choices?.[0]?.message?.content?.trim() || "Tidak ada jawaban.";
  return answer;
}

// Fungsi utama untuk running via CLI
async function main() {
  // Ambil argumen ke-2 (pertanyaan) dari command line
  const question = process.argv[2];

  if (!question) {
    console.log("Usage: node testGemini.js \"Pertanyaan AI\"");
    process.exit(1);
  }

  try {
    console.log("Memanggil Gemini...\n");
    const answer = await getGeminiReply(question);
    console.log("Jawaban AI:\n", answer);
  } catch (error) {
    console.error("Terjadi error:", error.message);
  }
}

// Eksekusi main()
main();

import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true });

const apiKey = process.env.GEMINI_API_KEY!;

const models = [
  'gemini-3.1-flash-lite',
  'gemini-3.5-flash-lite',
  'gemini-pro-latest',
  'gemini-2.5-pro',
  'gemma-4-31b-it',
];

async function testAll() {
  for (const m of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`;
    console.log(`Testing ${m}...`);
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Diga "Pronto para o Salão"' }] }],
        }),
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (res.ok) {
        const json = await res.json();
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
        console.log(`✅ ${m} SUCESSO (${res.status}): ${text?.trim()}`);
        return m;
      } else {
        console.log(`❌ ${m} HTTP ${res.status}`);
      }
    } catch (e: any) {
      console.log(`⏱️ ${m} Timeout ou erro: ${e.name || e.message}`);
    }
  }
}

testAll().then((winner) => {
  if (winner) console.log(`\n🏆 Modelo vencedor: ${winner}`);
});

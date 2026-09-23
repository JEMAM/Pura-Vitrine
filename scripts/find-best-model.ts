import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true });

const apiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

const candidates = [
  'gemini-2.5-flash-lite',
  'gemini-3.5-flash',
  'gemini-3.1-flash-lite',
  'gemini-3.8-flash',
  'gemini-pro-latest',
];

async function findAvailableModel() {
  for (const m of candidates) {
    try {
      process.stdout.write(`Testing model ${m}... `);
      const model = genAI.getGenerativeModel({ model: m });
      const res = await model.generateContent('Diga apenas "OK"');
      console.log(`✅ Sucesso! Resposta: ${res.response.text().trim()}`);
      return m;
    } catch (e: any) {
      console.log(`❌ Falha (${e.status || e.message})`);
    }
  }
}

findAvailableModel().then((best) => {
  if (best) console.log(`\n🏆 Melhor modelo estável no momento: ${best}`);
});

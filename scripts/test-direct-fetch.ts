import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true });

const apiKey = process.env.GEMINI_API_KEY!;

async function testDirectFetch() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;
  const start = Date.now();
  console.log('Sending direct HTTP fetch to Gemini 3.5 Flash...');

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: 'Escreva uma legenda curta e 3 hashtags para um post de salão sobre Morena Iluminada.',
            },
          ],
        },
      ],
    }),
  });

  const duration = (Date.now() - start) / 1000;
  console.log(`HTTP Status: ${res.status} (${duration.toFixed(2)}s)`);

  const json = await res.json();
  const candidate = json.candidates?.[0]?.content?.parts?.[0]?.text;
  console.log('Output:\n', candidate);
}

testDirectFetch().catch(console.error);

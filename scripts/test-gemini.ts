import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env.local with override: true
dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true });

const apiKey = process.env.GEMINI_API_KEY;

console.log('═══════════════════════════════════════════════════════════════');
console.log('🚀 TESTE COMPLETO DOS AGENTES DE IA COM GOOGLE GEMINI');
console.log('═══════════════════════════════════════════════════════════════\n');

if (!apiKey || apiKey === 'sua-chave-gemini-aqui') {
  console.error('❌ Chave GEMINI_API_KEY não encontrada ou inválida!');
  process.exit(1);
}

console.log(`🔑 Chave detectada: ${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`);

const genAI = new GoogleGenerativeAI(apiKey);

async function runTests() {
  try {
    // ─── TESTE 1: Conexão Básica ─────────────────────────────────
    console.log('\n[1/4] Testando conexão com Gemini 3.1 Flash Lite...');
    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite' });
    const pingResponse = await model.generateContent('Responda apenas: "Conexão Gemini OK para Salão Marketing"');
    console.log(`✅ Resposta: ${pingResponse.response.text().trim()}`);

    // ─── TESTE 2: Agente Copywriter ──────────────────────────────
    console.log('\n[2/4] Testando Agente Copywriter (Procedimento: Morena Iluminada Avelã)...');
    const copyPrompt = `Você é um copywriter de elite especialista em salões de beleza de alto padrão.
Gere um post completo para Instagram:
- Serviço: Cabelo
- Procedimento: Morena Iluminada Avelã
- Tom: Elegante e Sofisticado
- Objetivo: Atrair novas clientes para o final de semana

Estruture a resposta EXATAMENTE no seguinte formato JSON (sem formatação markdown extra):
{
  "caption": "legenda envolvente e persuasiva",
  "cta": "chamada para ação específica",
  "hashtags": "#tag1 #tag2 #tag3 #tag4 #tag5"
}`;

    const copyResult = await model.generateContent(copyPrompt);
    const rawCopyText = copyResult.response.text().trim();
    const cleanJson = rawCopyText.replace(/```json/g, '').replace(/```/g, '').trim();
    const copyData = JSON.parse(cleanJson);

    console.log('✅ Agente Copywriter respondeu com sucesso:');
    console.log('--------------------------------------------------');
    console.log('📝 LEGENDA:\n' + copyData.caption);
    console.log('\n📣 CTA:\n' + copyData.cta);
    console.log('\n🏷️  HASHTAGS:\n' + copyData.hashtags);
    console.log('--------------------------------------------------');

    // ─── TESTE 3: Agente de Ideias & Cronograma ──────────────────
    console.log('\n[3/4] Testando Agente de Ideias Semanais (Tema: Unhas em Gel & Nail Art)...');
    const ideasPrompt = `Crie 3 ideias de posts inovadores para um salão de unhas:
Retorne EXATAMENTE um array JSON:
[
  {
    "title": "Dia: Tema",
    "format": "Reels / Story / Carrossel",
    "hook": "Frase de impacto inicial",
    "objective": "Objetivo do post"
  }
]`;

    const ideasResult = await model.generateContent(ideasPrompt);
    const rawIdeasText = ideasResult.response.text().trim();
    const cleanIdeasJson = rawIdeasText.replace(/```json/g, '').replace(/```/g, '').trim();
    const ideasData = JSON.parse(cleanIdeasJson);

    console.log(`✅ Agente de Ideias gerou ${ideasData.length} conteúdos estruturados:`);
    ideasData.forEach((idea: any, idx: number) => {
      console.log(`  ${idx + 1}. [${idea.format}] ${idea.title}`);
      console.log(`     Hook: "${idea.hook}"`);
      console.log(`     Objetivo: ${idea.objective}`);
    });

    // ─── TESTE 4: Agente de Curadoria Visual & Estratégia ────────
    console.log('\n[4/4] Testando Agente de Curadoria & Recomendações Estratégicas...');
    const strategyPrompt = `Como consultor especialista em marketing de beleza, liste 3 dicas práticas para fotografar cabelos loiros e morenas iluminadas no salão para ter o maior engajamento possível no Instagram. Seja direto em tópicos curtos.`;

    const strategyResult = await model.generateContent(strategyPrompt);
    console.log('✅ Dicas do Agente de Curadoria Visual:');
    console.log(strategyResult.response.text().trim());

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('🎉 TODOS OS TESTES COM O GOOGLE GEMINI PASSARAM COM SUCESSO!');
    console.log('═══════════════════════════════════════════════════════════════\n');
  } catch (error) {
    console.error('❌ Erro durante o teste com Gemini:', error);
    process.exit(1);
  }
}

runTests();

import * as dotenv from 'dotenv';
import * as path from 'path';
import { getGeminiClient, getGeminiApiKey, generateContentWithFallback } from '../src/lib/gemini';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), override: true });

async function testAllSystemFeatures() {
  const apiKey = getGeminiApiKey();
  console.log('================================================================');
  console.log('🚀 TESTANDO TODAS AS FUNCIONALIDADES COM A CHAVE DO .ENV.LOCAL');
  console.log('Chave API:', apiKey.slice(0, 8) + '...' + apiKey.slice(-4));
  console.log('================================================================\n');

  const genAI = getGeminiClient();

  const tests = [
    {
      name: '1. COPYWRITING INTELIGENTE (Legenda, CTA e Hashtags)',
      prompt: `Você é uma especialista em copywriting para salão de beleza de luxo em Campinas (Barão Geraldo / Cambuí).
Crie um post completo para Morena Iluminada Avelã em tom Sofisticado e acolhedor.
Retorne EXATAMENTE um objeto JSON (sem markdown ao redor) no formato:
{ "caption": "texto da legenda completo", "cta": "chamada para agendamento no WhatsApp", "hashtags": "#morenailuminada #salaocampinas", "previewHooks": ["gancho 1", "gancho 2"] }`,
    },
    {
      name: '2. TIKTOK & REELS VIRAL (Roteiro 3s com Gancho e Áudio)',
      prompt: `Você é um diretor de vídeos virais de beleza para TikTok e Reels.
Crie um roteiro de 15 segundos para a tendência Acidificação Capilar Pós-Loiro.
Retorne EXATAMENTE um objeto JSON (sem markdown ao redor) no formato:
{ "hook": "gancho verbal de 3s", "caption": "legenda", "hashtags": "#hairtok", "soundTip": "dica de áudio", "scriptOutline": [{"time": "0:00 - 0:03", "visual": "v", "audio": "a"}] }`,
    },
    {
      name: '3. PINTEREST STUDIO 2:3 (SEO & Visual Pins de Tráfego Orgânico)',
      prompt: `Você é um especialista em SEO no Pinterest para salões de beleza de alto padrão.
Crie um Pin de alta atração para Mechas Loiro Perolado.
Retorne EXATAMENTE um objeto JSON (sem markdown ao redor) no formato:
{ "pinTitle": "título SEO com máx 80 caracteres", "pinDescription": "descrição rica em palavras-chave", "overlayText": "texto curto no Pin 2:3", "boardSuggestion": "pasta sugerida", "seoKeywords": ["loiro perolado", "salao campinas"] }`,
    },
    {
      name: '4. GOOGLE MEU NEGÓCIO / MAPS (SEO Local Campinas - Barão Geraldo)',
      prompt: `Você é especialista em SEO Local para Perfil da Empresa no Google Maps de salão em Barão Geraldo / Cambuí, Campinas.
Crie uma publicação semanal para o Google Maps destacando Especialistas em Mechas e Loiros.
Retorne EXATAMENTE um objeto JSON (sem markdown ao redor) no formato:
{ "postTitle": "título com localização", "postContent": "texto com prova e acolhimento", "ctaType": "Agendar Agora", "localKeywords": ["salao barao geraldo", "salao campinas"] }`,
    },
    {
      name: '5. META ADS LOCAL (Anúncio Patrocinado Instagram/Facebook Ads)',
      prompt: `Você é gestor de tráfego pago especialista em salões de beleza em Campinas.
Crie um anúncio de alta conversão para o feed do Instagram focado em atrair mulheres no raio de 5km de Barão Geraldo.
Retorne EXATAMENTE um objeto JSON (sem markdown ao redor) no formato:
{ "headline": "título curto do anúncio", "primaryText": "texto persuasivo", "hook": "gancho inicial", "callToAction": "Enviar Mensagem no WhatsApp", "audienceTargeting": { "location": "Campinas raio 5km", "ageRange": "24 a 50" }, "suggestedBudget": "R$ 15 a 25/dia" }`,
    },
    {
      name: '6. STORIES INTERATIVOS (Enquete, Caixinha e Quiz de Engajamento)',
      prompt: `Você é estrategista de Instagram Stories para salões de beleza.
Crie 3 ideias de stories interativos com stickers para o procedimento Morena Iluminada.
Retorne EXATAMENTE um objeto JSON (sem markdown ao redor) no formato:
{ "stories": [ { "type": "ENQUETE", "title": "Duelo de Tons", "stickerText": "Mel Dourado ou Avelã?", "optionA": "Mel", "optionB": "Avelã" }, { "type": "CAIXA_PERGUNTAS", "title": "Dúvidas", "stickerText": "Sua dúvida sobre iluminação?" }, { "type": "QUIZ", "title": "Teste", "stickerText": "Pergunta", "optionA": "Opção A", "optionB": "Opção B" } ] }`,
    },
    {
      name: '7. CALENDÁRIO & PLANEJAMENTO EDITORIAL SEMANAL',
      prompt: `Crie um plano semanal com 5 ideias de posts inovadores para o salão de beleza.
Retorne EXATAMENTE um array JSON com 5 itens no formato:
[ { "title": "Dia: Tema", "format": "Feed / Reels", "hook": "gancho", "objective": "objetivo", "suggestedMedia": "mídia sugerida" } ]`,
    },
  ];

  let passed = 0;
  const results: any[] = [];

  for (const t of tests) {
    console.log(`▶ Testando: ${t.name}...`);
    try {
      const startTime = Date.now();
      const { text, modelUsed } = await generateContentWithFallback(genAI, t.prompt);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
      
      const jsonMatch = text.match(/[\{\[][\s\S]*[\}\]]/);
      if (!jsonMatch) {
        throw new Error('Resposta não continha JSON válido');
      }
      const parsed = JSON.parse(jsonMatch[0]);
      const keys = Array.isArray(parsed) ? `Array com ${parsed.length} itens` : Object.keys(parsed).join(', ');
      
      console.log(`  ✅ APROVADO (${elapsed}s | Modelo: ${modelUsed})`);
      console.log(`     Estrutura retornada: [${keys}]`);
      passed++;
      results.push({ name: t.name, status: 'SUCESSO', time: `${elapsed}s`, model: modelUsed });
    } catch (err: any) {
      console.log(`  ❌ FALHA:`, err?.message || err);
      results.push({ name: t.name, status: 'FALHA', error: err?.message });
    }
  }

  console.log('\n================================================================');
  console.log(`🏁 RESUMO DOS TESTES: ${passed} de ${tests.length} FUNCIONALIDADES 100% OPERACIONAIS`);
  console.log('================================================================');
  console.table(results);
}

testAllSystemFeatures();

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getGeminiClient, getGeminiApiKey, activeModelName } from '@/lib/gemini';

// Intelligent Fallback generators for Beauty Salon Marketing
function getFallbackCopywriting(service: string, procedure: string, tone: string, goal: string) {
  const isElegant = tone.toLowerCase().includes('elegante');
  const isFriendly = tone.toLowerCase().includes('descontraído') || tone.toLowerCase().includes('amigável');

  let title = '';
  let body = '';
  let cta = '';
  let hashtags = '';

  if (service.toLowerCase().includes('cabelo')) {
    title = isElegant
      ? 'A arte da transformação capilar com saúde e sofisticação ✨'
      : 'Pronta para aquele cabelo dos sonhos que para qualquer lugar? 😍';
    body = `O resultado do procedimento de ${procedure || 'transformação capilar'} alia técnica refinada, respeito à fibra do cabelo e aquele acabamento brilhante que você merece.\n\nFios leves, movimento natural e uma cor feita sob medida para harmonizar com a sua beleza única.`;
    cta = goal.includes('Vagas')
      ? 'Restam poucos horários nesta semana! Toque no link da bio para garantir sua transformação.'
      : 'Comente "EU QUERO" ou envie uma mensagem no direct para avaliação personalizada.';
    hashtags = '#salaodebeleza #cabeloperfeito #morenailuminada #loirodossonhos #cronogramacapilar #hairtransformation #salaosp';
  } else if (service.toLowerCase().includes('unha')) {
    title = isElegant
      ? 'Delicadeza e precisão em cada detalhe das suas unhas 💅✨'
      : 'Alerta de unhas perfeitas passando no seu feed! 💖';
    body = `A aplicação de ${procedure || 'alongamento em gel'} entrega resistência, simetria e uma durabilidade que dura semanas sem descascar.\n\nUm toque de sofisticação que eleva sua autoestima no dia a dia.`;
    cta = 'Gostou dessa inspiração? Salve este post e agende seu horário pelo WhatsApp na bio!';
    hashtags = '#unhasdecoradas #alongamentodeunhas #unhasemgel #nailart #unhasdelicadas #manicureprofissional';
  } else {
    title = 'Dedique um momento ao cuidado mais importante: você ✨';
    body = `Nosso procedimento de ${procedure || 'estética facial'} foi pensado para devolver a vitalidade, luminosidade e o equilíbrio que sua pele precisa.\n\nUm momento de relaxamento profundo e resultados visíveis logo na primeira sessão.`;
    cta = 'Envie uma mensagem no direct para agendar sua sessão de autocuidado!';
    hashtags = '#esteticafacial #skincarebrasil #limpezadepele #glowskin #autocuidado #belezaebemestar';
  }

  return {
    caption: `${title}\n\n${body}\n\n${cta}`,
    cta,
    hashtags,
    previewHooks: [
      `Você sabia que o segredo de ${procedure || 'um procedimento impecável'} está na preparação?`,
      `Antes e Depois: a transformação que você precisa ver hoje! ✨`,
      `3 motivos para agendar seu ${procedure || 'tratamento'} esta semana!`,
    ],
  };
}

function getFallbackIdeas(theme: string) {
  return [
    {
      title: 'Segunda-feira: Dica de Manutenção em Casa',
      format: 'Carrossel (Feed)',
      hook: '3 erros que você comete cuidando do seu cabelo em casa sem perceber!',
      objective: 'Educar o público e gerar autoridade profissional.',
      suggestedMedia: 'Foto segurando um produto profissional ou carrossel com dicas de lavagem.',
    },
    {
      title: 'Terça-feira: Antes e Depois Impactante',
      format: 'Reels / Vídeo curto',
      hook: 'De 0 a 10, que nota você dá para essa transformação?',
      objective: 'Gerar comentários e compartilhamentos orgânicos.',
      suggestedMedia: 'Vídeo rápido mostrando o estado inicial e o balanço final pós-finalização.',
    },
    {
      title: 'Quarta-feira: Bastidores & Higiene do Salão',
      format: 'Stories com Enquete',
      hook: 'Como preparamos todo o instrumental esterilizado para o seu atendimento.',
      objective: 'Passar confiança, biossegurança e gerar votos na enquete.',
      suggestedMedia: 'Vídeo na autoclave ou bancada higienizada.',
    },
    {
      title: 'Quinta-feira: Alerta de Horários Vagos no Fim de Semana',
      format: 'Story com Link Direto',
      hook: 'Quem deixou para última hora? Abrimos 2 vagas extras para sábado!',
      objective: 'Preencher a agenda do fim de semana rapidamente.',
      suggestedMedia: 'Foto charmosa do salão com sticker de link para o WhatsApp.',
    },
    {
      title: 'Sexta-feira: Depoimento Real de Cliente Satisfeita',
      format: 'Feed ou Reels',
      hook: 'O sorriso de quem saiu com a autoestima renovada! ✨',
      objective: 'Prova social e identificação imediata.',
      suggestedMedia: 'Cliente em frente ao espelho com iluminação Ring Light.',
    },
  ];
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { agentType, service, procedure, tone, goal, customPrompt, mediaDescription } = body;

    const apiKey = getGeminiApiKey();
    const hasValidKey = apiKey && apiKey !== 'sua-chave-gemini-aqui';

    if (agentType === 'copywriting') {
      if (hasValidKey) {
        try {
          const genAI = getGeminiClient();
          const model = genAI.getGenerativeModel({ model: activeModelName });

          const prompt = `Você é um copywriter de elite especialista em marketing digital para salões de beleza e estética de alto padrão.
Gere um post completo para Instagram e Facebook para o seguinte serviço:
- Serviço: ${service || 'Cabelos e Beleza'}
- Procedimento: ${procedure || 'Transformação no salão'}
- Tom de voz: ${tone || 'Elegante, acolhedor e sofisticado'}
- Objetivo: ${goal || 'Atrair novas clientes e engajar'}
- Detalhes adicionais: ${customPrompt || 'Nenhum'}

Estruture a resposta EXATAMENTE no seguinte formato JSON (sem formatação markdown extra ao redor):
{
  "caption": "texto completo e envolvente com quebras de linha e emojis moderados e elegantes",
  "cta": "chamada para ação específica e persuasiva",
  "hashtags": "#tag1 #tag2 #tag3 (entre 7 e 12 hashtags relevantes em português)",
  "previewHooks": ["gancho 1", "gancho 2", "gancho 3"]
}`;

          const result = await model.generateContent(prompt);
          const rawText = result.response.text().trim();
          const jsonMatch = rawText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return NextResponse.json({ success: true, data: parsed, source: 'gemini' });
          }
        } catch (geminiError) {
          console.warn('Gemini copywriting call error, fallback:', geminiError);
        }
      }

      // Fallback
      const fallback = getFallbackCopywriting(
        service || 'Cabelo',
        procedure || 'Mechas',
        tone || 'Elegante',
        goal || 'Atrair clientes'
      );
      return NextResponse.json({ success: true, data: fallback, source: 'template' });
    }

    if (agentType === 'ideas') {
      if (hasValidKey) {
        try {
          const genAI = getGeminiClient();
          const model = genAI.getGenerativeModel({ model: activeModelName });

          const prompt = `Você é um diretor de conteúdo para redes sociais de salões de beleza.
Crie um plano semanal de 5 ideias de posts inovadores para atrair e reter clientes no salão:
- Foco: ${service || 'Salão Completo'}
- Tom: ${tone || 'Elegante'}
- Tema específico: ${customPrompt || 'Geral de beleza'}

Retorne EXATAMENTE um array JSON de 5 objetos no formato:
[
  {
    "title": "Dia: Tema",
    "format": "Feed / Carrossel / Reels / Story",
    "hook": "Frase de impacto inicial",
    "objective": "Objetivo do post",
    "suggestedMedia": "Descrição do que filmar ou fotografar no salão"
  }
]`;

          const result = await model.generateContent(prompt);
          const rawText = result.response.text().trim();
          const jsonMatch = rawText.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return NextResponse.json({ success: true, data: parsed, source: 'gemini' });
          }
        } catch (geminiError) {
          console.warn('Gemini ideas error, fallback:', geminiError);
        }
      }

      const ideas = getFallbackIdeas(service || 'Cabelos e Unhas');
      return NextResponse.json({ success: true, data: ideas, source: 'template' });
    }

    if (agentType === 'curation') {
      return NextResponse.json({
        success: true,
        data: {
          score: 9.3,
          lightingAnalysis:
            'Iluminação excelente, com realce para os reflexos da cor e boa definição de textura.',
          framingTip:
            'Para o Feed do Instagram, recorte na proporção 4:5 (vertical) para ocupar o máximo de tela no celular da cliente.',
          engagementPrediction:
            'Alto potencial para formato carrossel com foto de Antes na segunda lâmina.',
          recommendation:
            'Use um áudio em alta no Reels com transição no momento em que a cliente mexe no cabelo.',
        },
        source: 'curator-agent',
      });
    }

    if (agentType === 'strategy') {
      return NextResponse.json({
        success: true,
        data: {
          bestDays: ['Quinta-feira', 'Sexta-feira', 'Sábado de manhã'],
          bestHours: [
            { period: 'Manhã', time: '08:30 - 09:30', reason: 'Público checando o celular no trajeto' },
            { period: 'Almoço', time: '12:00 - 13:30', reason: 'Pico de agendamento de horários para a semana' },
            { period: 'Noite', time: '19:30 - 21:30', reason: 'Maior tempo de tela e retenção em Reels' },
          ],
          goldenTip:
            'Poste transformações (antes/depois) na quarta ou quinta-feira para alimentar o desejo de marcar horário para sexta e sábado.',
        },
        source: 'strategy-agent',
      });
    }

    if (agentType === 'tiktok-trend') {
      const { trendName, hashtag, suggestedHook, videoFormat, soundtrackSuggestion } = body;

      if (hasValidKey) {
        try {
          const genAI = getGeminiClient();
          const model = genAI.getGenerativeModel({ model: activeModelName });

          const prompt = `Você é um diretor criativo de vídeos virais de beleza para TikTok e Instagram Reels de salões de alto padrão.
Crie um roteiro completo e post para a seguinte tendência do TikTok Creative Center Brasil:
- Tendência: ${trendName || 'Tendência de Cabelo / Beleza'}
- Hashtag em alta: ${hashtag || '#hairtok'}
- Gancho sugerido: ${suggestedHook || 'Veja essa transformação'}
- Formato recomendado: ${videoFormat || 'Reels / TikTok'}
- Trilha sugerida: ${soundtrackSuggestion || 'Áudio viral de transição'}

Retorne EXATAMENTE um objeto JSON (sem markdown ao redor) no formato:
{
  "hook": "Gancho verbal e visual para prender a atenção nos primeiros 3 segundos",
  "scriptOutline": [
    { "time": "0:00 - 0:03", "visual": "O que filmar na tela", "audio": "Fala ou áudio de impacto" },
    { "time": "0:04 - 0:15", "visual": "Passo a passo / processo no salão", "audio": "Explicação técnica simplificada do diferencial" },
    { "time": "0:16 - 0:30", "visual": "Revelação / balanço dos fios e brilho espelhado", "audio": "Resultado deslumbrante e convite para agendar" }
  ],
  "caption": "Legenda completa para o post no Instagram/TikTok com quebras de linha e tom sofisticado",
  "cta": "Chamada para ação focada em agendamento no WhatsApp ou bio",
  "hashtags": "${hashtag} #salaodebeleza #salaocampinas #cabelosdeluxo #beautytokbrasil #transformacaocapilar",
  "soundTip": "Dica de como usar o áudio em alta para dobrar a entrega do algoritmo"
}`;

          const result = await model.generateContent(prompt);
          const rawText = result.response.text().trim();
          const jsonMatch = rawText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return NextResponse.json({ success: true, data: parsed, source: 'gemini' });
          }
        } catch (geminiError) {
          console.warn('Gemini tiktok trend error, fallback:', geminiError);
        }
      }

      // Fallback
      return NextResponse.json({
        success: true,
        data: {
          hook: suggestedHook || `O procedimento que está dominando o feed: ${trendName}! ✨`,
          scriptOutline: [
            {
              time: '0:00 - 0:03',
              visual: 'Close no cabelo antes ou cliente olhando surpresa para a câmera.',
              audio: suggestedHook || `Você sabia o poder do ${trendName}?`,
            },
            {
              time: '0:04 - 0:15',
              visual: 'Aplicação cuidadosa na bancada, textura do produto e lavatório relaxante.',
              audio: `Aqui no salão personalizamos cada etapa para manter a integridade dos fios.`,
            },
            {
              time: '0:16 - 0:30',
              visual: 'Movimento em câmera lenta, cliente sorrindo e balanço do cabelo ao vento.',
              audio: 'O resultado fala por si! Agende pelo link da nossa bio.',
            },
          ],
          caption: `A tendência ${trendName} que conquistou o TikTok agora com a assinatura de sofisticação do nosso salão! ✨🤎\n\nPreservando a saúde da fibra capilar com ativos nobres e acabamento impecável.\n\nPronta para renovar seu visual?`,
          cta: 'Envie uma mensagem no direct ou clique no link da bio para garantir seu horário!',
          hashtags: `${hashtag || '#hairtok'} #salaodebeleza #salaocampinas #morenailuminada #cabelosluxuosos #beautytok`,
          soundTip: `Use o áudio sugerido "${soundtrackSuggestion || 'Áudio Viral de Beleza'}" no Reels do Instagram com o volume da música em 40% e a sua voz em 100%.`,
        },
        source: 'template',
      });
    }

    if (agentType === 'pinterest-pin') {
      const { procedure, service, tone } = body;
      if (hasValidKey) {
        try {
          const genAI = getGeminiClient();
          const model = genAI.getGenerativeModel({ model: activeModelName });

          const prompt = `Você é um especialista em SEO e Marketing no Pinterest para salões de beleza de alto padrão.
Crie um Pin de alta atração visual e cliques para o seguinte procedimento:
- Procedimento: ${procedure || 'Transformação Capilar'}
- Categoria: ${service || 'Cabelos & Beleza'}
- Tom: ${tone || 'Elegante e Inspirador'}

Retorne EXATAMENTE um objeto JSON (sem markdown ao redor) no formato:
{
  "pinTitle": "Título chamativo e rico em palavras-chave para busca no Pinterest (máx 80 caracteres)",
  "pinDescription": "Descrição rica em SEO explicando o procedimento, benefícios e chamada para salvar na pasta de inspirações (200-350 caracteres)",
  "overlayText": "Texto curto e impactante para colocar sobre a foto na proporção 2:3",
  "boardSuggestion": "Nome da pasta recomendada para salvar no Pinterest",
  "seoKeywords": ["palavra-chave 1", "palavra-chave 2", "palavra-chave 3", "palavra-chave 4", "palavra-chave 5"]
}`;

          const result = await model.generateContent(prompt);
          const rawText = result.response.text().trim();
          const jsonMatch = rawText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return NextResponse.json({ success: true, data: parsed, source: 'gemini' });
          }
        } catch (geminiError) {
          console.warn('Gemini pinterest error, fallback:', geminiError);
        }
      }

      // Fallback
      return NextResponse.json({
        success: true,
        data: {
          pinTitle: `${procedure || 'Morena Iluminada'}: Guia Completo e Inspirações ✨`,
          pinDescription: `Buscando a transformação perfeita para seus cabelos? Conheça nossa técnica de ${procedure || 'Morena Iluminada'} com preservação da fibra e brilho espelhado no salão. Salve este Pin na sua pasta de inspirações e agende seu horário em Campinas!`,
          overlayText: `${(procedure || 'MORENA ILUMINADA').toUpperCase()} • TENDÊNCIA SALÃO`,
          boardSuggestion: 'Cabelos dos Sonhos & Inspirações',
          seoKeywords: [
            `${procedure?.toLowerCase() || 'morena iluminada'}`,
            'cabelos de luxo',
            'salao campinas',
            'mechas saudaveis',
            'corte e cor',
          ],
        },
        source: 'template',
      });
    }

    if (agentType === 'google-business') {
      const { procedure, service, branch } = body;
      if (hasValidKey) {
        try {
          const genAI = getGeminiClient();
          const model = genAI.getGenerativeModel({ model: activeModelName });

          const prompt = `Você é um especialista em SEO Local e Perfil da Empresa no Google (Google Meu Negócio) para salões de beleza de alto padrão em Campinas-SP.
Gere uma publicação semanal otimizada para o Google Maps / Google Meu Negócio:
- Procedimento / Destaque: ${procedure || 'Especialista em Mechas e Loiros'}
- Categoria: ${service || 'Cabelos & Estética'}
- Unidade: ${branch || 'Barão Geraldo • Campinas'}

Retorne EXATAMENTE um objeto JSON (sem markdown ao redor) no formato:
{
  "postTitle": "Título com localização e procedimento (ex: Especialista em Mechas em Campinas)",
  "postContent": "Texto direto e confiável de 150 a 300 palavras, com prova técnica, acolhimento e menção à unidade física para ranquear no Google Maps",
  "ctaType": "Agendar Agora ou Ligar",
  "localKeywords": ["salao de beleza campinas", "mechas barao geraldo", "cabeleireiro cambui", "salao proximo a mim"]
}`;

          const result = await model.generateContent(prompt);
          const rawText = result.response.text().trim();
          const jsonMatch = rawText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return NextResponse.json({ success: true, data: parsed, source: 'gemini' });
          }
        } catch (geminiError) {
          console.warn('Gemini google business error, fallback:', geminiError);
        }
      }

      return NextResponse.json({
        success: true,
        data: {
          postTitle: `Especialista em ${procedure || 'Transformação Capilar'} • ${branch || 'Barão Geraldo, Campinas'}`,
          postContent: `Procurando o melhor resultado em ${procedure || 'mechas e cuidados capilares'} em Campinas?\n\nNossa equipe conta com consultoria personalizada e protocolos exclusivos para garantir fios luminosos, sedosos e saudáveis.\n\n📍 Atendimento com hora marcada em nossa unidade.\n☕ Estacionamento próprio e ambiente climatizado.\n\nClique no botão abaixo para garantir seu horário pelo WhatsApp!`,
          ctaType: 'Agendar Agora',
          localKeywords: [
            'salao de beleza campinas',
            'mechas barao geraldo',
            'salao cambui campinas',
            'morena iluminada campinas',
          ],
        },
        source: 'template',
      });
    }

    if (agentType === 'meta-ads') {
      const { procedure, service, offerText } = body;
      if (hasValidKey) {
        try {
          const genAI = getGeminiClient();
          const model = genAI.getGenerativeModel({ model: activeModelName });

          const prompt = `Você é um gestor de tráfego pago e copywriter especialista em anúncios patrocinados no Instagram e Facebook (Meta Ads) para salões de alto padrão.
Gere um anúncio completo para atração de novas clientes locais:
- Procedimento: ${procedure || 'Morena Iluminada'}
- Serviço: ${service || 'Cabelos'}
- Oferta / Diferencial: ${offerText || 'Consulta visagista inclusa e diagnóstico capilar'}

Retorne EXATAMENTE um objeto JSON (sem markdown ao redor) no formato:
{
  "headline": "Título curto do anúncio com emojis moderados (máx 45 caracteres)",
  "primaryText": "Texto principal persuasivo: gancho inicial + identificação da dor + solução no salão + chamada de ação clara",
  "hook": "Gancho de abertura de 1 frase para prender a rolagem do feed",
  "callToAction": "Enviar Mensagem no WhatsApp ou Agendar",
  "audienceTargeting": {
    "location": "Campinas-SP (Raio de 4km a 7km das unidades)",
    "gender": "Mulheres",
    "ageRange": "25 a 54 anos",
    "interests": "Beleza, Cuidados com cabelos, Moda, Bem-estar"
  },
  "suggestedBudget": "R$ 15,00 a R$ 25,00 / dia para 15 a 30 contatos no WhatsApp"
}`;

          const result = await model.generateContent(prompt);
          const rawText = result.response.text().trim();
          const jsonMatch = rawText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return NextResponse.json({ success: true, data: parsed, source: 'gemini' });
          }
        } catch (geminiError) {
          console.warn('Gemini meta ads error, fallback:', geminiError);
        }
      }

      return NextResponse.json({
        success: true,
        data: {
          headline: `Transforme seu visual em Campinas ✨`,
          primaryText: `Cansada de mechas que deixam os fios ressecados? Conheça a técnica personalizada de ${procedure || 'Morena Iluminada'} que virou sensação em Campinas!\n\nPreservamos 100% da integridade da fibra capilar com ativos nobres e consultoria de cor sob medida para seu tom de pele.\n\n✨ Ganhe diagnóstico capilar completo no seu primeiro agendamento.\n\nToque no botão e converse diretamente com nossos especialistas pelo WhatsApp!`,
          hook: `Mulheres de Campinas: o cabelo iluminado e saudável que você sempre quis!`,
          callToAction: 'Enviar Mensagem no WhatsApp',
          audienceTargeting: {
            location: 'Campinas - SP (Raio de 5km de Barão Geraldo e Cambuí)',
            gender: 'Mulheres',
            ageRange: '24 a 52 anos',
            interests: 'Salões de beleza, Morena Iluminada, Loiro, Cuidados com o cabelo',
          },
          suggestedBudget: 'R$ 15 a R$ 20 / dia (estimativa de 20 a 40 leads/mês)',
        },
        source: 'template',
      });
    }

    if (agentType === 'interactive-stories') {
      const { procedure, service } = body;
      if (hasValidKey) {
        try {
          const genAI = getGeminiClient();
          const model = genAI.getGenerativeModel({ model: activeModelName });

          const prompt = `Você é um estrategista de conteúdo para Instagram Stories de salões de beleza de alto padrão.
Crie 3 ideias práticas e altamente engajantes de Stories Interativos com stickers (Enquete, Caixa de Pergunta e Quiz) para o procedimento ${procedure || 'Transformação no salão'}:

Retorne EXATAMENTE um objeto JSON (sem markdown ao redor) no formato:
{
  "stories": [
    {
      "type": "ENQUETE",
      "title": "Duelo de Escolhas",
      "visualDescription": "O que filmar ou fotografar no salão para o fundo do story",
      "stickerText": "Pergunta da enquete",
      "optionA": "Opção 1 com emoji",
      "optionB": "Opção 2 com emoji",
      "engagementGoal": "Por que esse story esquenta o algoritmo e atrai clientes"
    },
    {
      "type": "CAIXA_PERGUNTAS",
      "title": "Consultoria Aberta",
      "visualDescription": "Profissional na bancada ou segurando produto de tratamento",
      "stickerText": "Chamada para a caixinha",
      "optionA": "",
      "optionB": "",
      "engagementGoal": "Gerar conversas no direct para agendamento"
    },
    {
      "type": "QUIZ",
      "title": "Mito ou Verdade",
      "visualDescription": "Cabelo balançando em câmera lenta",
      "stickerText": "Pergunta do quiz",
      "optionA": "Verdade ✨",
      "optionB": "Mito ❌",
      "engagementGoal": "Educar a cliente e quebrar objeções de tratamento"
    }
  ]
}`;

          const result = await model.generateContent(prompt);
          const rawText = result.response.text().trim();
          const jsonMatch = rawText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return NextResponse.json({ success: true, data: parsed, source: 'gemini' });
          }
        } catch (geminiError) {
          console.warn('Gemini stories error, fallback:', geminiError);
        }
      }

      return NextResponse.json({
        success: true,
        data: {
          stories: [
            {
              type: 'ENQUETE',
              title: 'Duelo de Tons de Mechas',
              visualDescription: 'Foto dividida mostrando nuance Mel Dourado à esquerda e nuance Avelã à direita.',
              stickerText: 'Qual tom combina mais com a sua personalidade neste outono?',
              optionA: 'Mel Dourado 🍯',
              optionB: 'Avelã Quente 🤎',
              engagementGoal: 'Mais de 65% de taxa de votação, ativando o algoritmo do Instagram.',
            },
            {
              type: 'CAIXA_PERGUNTAS',
              title: 'Tire suas Dúvidas com o Especialista',
              visualDescription: 'Vídeo rápido de 5s no lavatório ou bancada com luz acolhedora.',
              stickerText: 'Qual o seu maior medo na hora de clarear os fios?',
              optionA: '',
              optionB: '',
              engagementGoal: 'Responda as caixinhas citando o nome da cliente e oferecendo o link da bio.',
            },
            {
              type: 'QUIZ',
              title: 'Diagnóstico Rápido de Saúde Capilar',
              visualDescription: 'Close nos fios tratados com brilho espelhado.',
              stickerText: 'O cabelo precisa de acidificação capilar logo após descolorir?',
              optionA: 'Sim! É obrigatório ✨',
              optionB: 'Não faz diferença ❌',
              engagementGoal: 'Gera autoridade imediata e desejo de realizar o tratamento no salão.',
            },
          ],
        },
        source: 'template',
      });
    }

    return NextResponse.json({ error: 'Tipo de agente inválido' }, { status: 400 });
  } catch (error) {
    console.error('AI agent API error:', error);
    return NextResponse.json({ error: 'Erro ao processar agente de IA' }, { status: 500 });
  }
}

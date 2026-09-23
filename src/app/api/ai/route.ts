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

    return NextResponse.json({ error: 'Tipo de agente inválido' }, { status: 400 });
  } catch (error) {
    console.error('AI agent API error:', error);
    return NextResponse.json({ error: 'Erro ao processar agente de IA' }, { status: 500 });
  }
}

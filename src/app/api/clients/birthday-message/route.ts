import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient, generateContentWithFallback, getModelFallbackList } from '@/lib/gemini';
import { memoryStore } from '@/lib/store';

function formatWhatsAppLink(phone: string, text: string): string {
  // Remove tudo que não for dígito
  const digits = phone.replace(/\D/g, '');
  // Adiciona o DDI 55 (Brasil) caso não tenha
  const fullPhone = digits.length <= 11 ? `55${digits}` : digits;
  const encodedText = encodeURIComponent(text);
  return `https://api.whatsapp.com/send?phone=${fullPhone}&text=${encodedText}`;
}

function getFallbackBirthdayMessage(params: {
  clientName: string;
  salonName: string;
  tone: string;
  gift?: string;
  services?: string;
}): string {
  const firstName = params.clientName.trim().split(' ')[0];
  const salon = params.salonName || 'Nosso Salão';
  const gift = params.gift?.trim() || 'um mimo especial de 15% OFF em qualquer procedimento';
  const services = params.services ? `especialmente para cuidar do seu ${params.services.toLowerCase()}` : '';

  switch (params.tone) {
    case 'festivo':
      return `Oie, *${firstName}*! Parabéns pelo seu dia! 🎂🎉✨\n\nToda a equipe do *${salon}* está passando para te desejar um ano novo repleto de sorrisos, realizações, saúde e momentos inesquecíveis!\n\nE como você merece comemorar com a autoestima nas alturas, preparamos um presentão de aniversário para você: 🎁\n👉 *${gift}* ${services} válido durante todo o seu mês de aniversário!\n\nVamos celebrar e te deixar ainda mais deslumbrante? Me avisa aqui qual dia fica melhor para você! 💕🥂`;

    case 'vip':
      return `Querida *${firstName}*, feliz aniversário! 🥂✨\n\nÉ um verdadeiro privilégio ter você como nossa cliente especial no *${salon}*. Desejamos que este novo ciclo venha carregado de prosperidade, luz e motivos para celebrar!\n\nPara o seu dia brilhar ainda mais, seu presente exclusivo já está reservado: 🎁\n✨ *${gift}*\n\nSerá uma honra te receber para brindar seu novo ano e cuidar de você como você merece. Quando podemos agendar seu momento VIP? 💆‍♀️💖`;

    case 'curto':
      return `Parabéns, *${firstName}*! 🎂✨ Desejamos um dia lindo e cheio de alegrias! O *${salon}* preparou um mimo especial para você: *${gift}*. Vamos agendar seu horário? Um grande abraço de toda a nossa equipe! 💕`;

    case 'elegante':
    default:
      return `Querida *${firstName}*, feliz aniversário! ✨🎂\n\nQue este novo ano seja leve, inspirador e repleto de conquistas extraordinárias. Você é uma mulher iluminada e merece todos os aplausos hoje e sempre!\n\nPara celebrar a sua vida, a equipe do *${salon}* preparou um presente especial com muito carinho:\n🎁 *${gift}*\n\nVenha tirar um momento só seu para relaxar, brindar e realçar ainda mais a sua beleza única. Podemos agendar seu horário especial? 💕`;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      clientName,
      phone,
      services,
      notes,
      gift = '15% de desconto de aniversário + tratamento cortesia',
      tone = 'elegante', // elegante | festivo | vip | curto
    } = body;

    if (!clientName) {
      return NextResponse.json({ error: 'Nome da cliente é obrigatório.' }, { status: 400 });
    }

    const settings = memoryStore.getSettings();
    const salonName = settings?.salonName || 'Studio Beleza & Elegância';

    const toneDescriptions: Record<string, string> = {
      elegante: 'Elegante, caloroso, afetuoso e focado em alta autoestima e sofisticação.',
      festivo: 'Muito animado, alegre, festivo, comemorativo e contagiante.',
      vip: 'Tratamento VIP luxuoso, exclusivo, refinado, fazendo a cliente se sentir única e valorizada.',
      curto: 'Curto, direto ao ponto, gentil, empático e objetivo.',
    };

    const prompt = `Você é a assistente de marketing e atendimento humanizado do salão de beleza de alto padrão "${salonName}".
Crie uma mensagem carinhosa e persuasiva para ser enviada pelo WhatsApp para a cliente no dia do aniversário dela.

Dados da cliente:
- Nome: ${clientName}
- Procedimentos que ela costuma fazer no salão: ${services || 'Tratamentos capilares, unhas e estética'}
- Observações/preferências da cliente: ${notes || 'Gosta de momentos de relaxamento e atendimento atencioso'}
- Mimo / Presente do salão para ela: ${gift}
- Tom de voz desejado: ${toneDescriptions[tone] || toneDescriptions.elegante}

Regras obrigatórias:
1. Comece parabenizando pelo primeiro nome da cliente de forma muito calorosa.
2. Seja humanizada, simpática e profissional (não pareça um robô ou spam comercial genérico).
3. Apresente o presente/mimo exclusivo do salão para comemorar o aniversário dela e cuidar da autoestima.
4. Finalize com um convite sutil e acolhedor para ela agendar o horário dela no WhatsApp.
5. Use formatação de WhatsApp com *negrito* nos pontos importantes (primeiro nome, mimo, nome do salão).
6. Use emojis bonitos de beleza e celebração (✨, 🎂, 🥂, 💖, 🎁, 💇‍♀️, 💅) com equilíbrio.
7. NÃO use hashtags (#), pois é uma conversa direta no WhatsApp.
8. Retorne APENAS o texto da mensagem pronta para envio, sem aspas e sem explicações prévias.`;

    let generatedText = '';
    let usedModel = 'fallback';

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey && apiKey.length > 5) {
        const genAI = getGeminiClient();
        const fallbackList = getModelFallbackList(settings?.geminiModel);
        const result = await generateContentWithFallback(genAI, prompt, {
          models: fallbackList,
        });
        generatedText = result.text.trim();
        usedModel = result.modelUsed;
      } else {
        generatedText = getFallbackBirthdayMessage({
          clientName,
          salonName,
          tone,
          gift,
          services,
        });
      }
    } catch (aiErr: any) {
      console.warn('Erro ao chamar Gemini para mensagem de aniversário, usando gerador inteligente:', aiErr);
      generatedText = getFallbackBirthdayMessage({
        clientName,
        salonName,
        tone,
        gift,
        services,
      });
    }

    const whatsappUrl = phone ? formatWhatsAppLink(phone, generatedText) : '';

    return NextResponse.json({
      message: generatedText,
      whatsappUrl,
      modelUsed: usedModel,
      salonName,
    });
  } catch (error: any) {
    console.error('Erro na rota de mensagem de aniversário:', error);
    return NextResponse.json(
      { error: 'Falha ao gerar mensagem de aniversário', details: error?.message },
      { status: 500 }
    );
  }
}

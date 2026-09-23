'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

export default function GuiaPage() {
  const [activeTab, setActiveTab] = useState<'inicio' | 'dashboard' | 'editor' | 'trends' | 'dicas' | 'faq'>('inicio');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      category: 'TikTok & Tendências',
      question: 'Como o TikTok Creative Center ajuda a atrair mais clientes para o salão?',
      answer:
        'O TikTok é a principal plataforma onde nascem as maiores tendências de beleza (#hairtok). Monitorando hashtags como #acidificacaocapilar, #morenailuminada e cortes em camadas em tempo real no Brasil, seu salão publica exatamente o que as clientes estão procurando, aumentando o alcance orgânico dos Reels e o desejo de agendamento.',
    },
    {
      category: 'Vídeos Curtos & Ganchos',
      question: 'O que é o Gancho Viral de 3 segundos (Hook) e por que ele é indispensável?',
      answer:
        'Mais de 70% das pessoas decidem se continuam assistindo ou rolam o feed nos primeiros 3 segundos de um vídeo. O gancho inicial (ex: "Se o seu cabelo tá poroso, você precisa desse procedimento urgente!") prende a atenção da cliente antes que ela mude de vídeo, multiplicando a taxa de retenção e entrega do algoritmo.',
    },
    {
      category: 'IA & Conteúdo',
      question: 'Como a BelezaIA (Google Gemini) cria as legendas?',
      answer:
        'A IA analisa os detalhes do procedimento inserido (ex: nuances de morena iluminada, tratamento reconstrutor), o tom de voz selecionado (Sofisticado, Divertido, Educativo ou VIP) e o público local de Campinas (Barão Geraldo, Cambuí). Em seguida, gera uma legenda com copywriting envolvente, emojis elegantes e hashtags estratégicas de alto alcance.',
    },
    {
      category: 'Formatos & Feed',
      question: 'Por que o formato 4:5 é o mais recomendado para o Feed?',
      answer:
        'No feed do Instagram, a proporção 4:5 (vertical) ocupa até 25% mais espaço na tela do celular da seguidora em comparação com o tradicional 1:1 quadrado. Isso retém a atenção por mais tempo, melhora a taxa de salvamentos e aumenta a entrega orgânica pelo algoritmo.',
    },
    {
      category: 'Agendamentos',
      question: 'O que significa a recomendação de horário de pico (ex: 18:45)?',
      answer:
        'O algoritmo de recomendação cruza os dados de atividade das seguidoras locais de Campinas e região. O horário entre 18:15 e 19:45 é o momento de maior visualização após o expediente de trabalho, ideal para posts de transformação que geram conversas no Direct e pedidos de orçamento.',
    },
    {
      category: 'Próximos Posts',
      question: 'Como aprovar um post com status "Rascunho IA"?',
      answer:
        'No Dashboard, na coluna de Próximas Publicações, você encontra os rascunhos sugeridos pela IA. Basta clicar em "Aprovar Agora" ou clicar no ícone de lápis para abrir o Editor e refinar a legenda antes de agendar.',
    },
    {
      category: 'Filiais & Unidades',
      question: 'Como alternar entre a unidade Barão Geraldo, Cambuí e Matriz?',
      answer:
        'No menu lateral esquerdo, clique no botão "Filial Ativa". Um menu dropdown permitirá selecionar a unidade desejada, adaptando os CTAs e a comunicação automaticamente para a filial selecionada.',
    },
  ];

  return (
    <div className="flex flex-col w-full animate-fadeIn pb-16">
      <div className="w-full max-w-7xl mx-auto px-space-md lg:px-space-lg py-space-md flex flex-col gap-space-lg">
        {/* Luxury Hero Banner */}
        <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-surface-container-lowest via-surface-container-low to-surface-container-high p-space-md lg:p-space-lg shadow-sm border border-outline-variant/20">
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-primary-fixed-dim/25 blur-3xl pointer-events-none"></div>
          <div className="absolute right-1/3 -bottom-20 w-64 h-64 rounded-full bg-secondary-fixed/30 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
            <div className="flex flex-col max-w-3xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest/80 text-secondary font-label-sm text-label-sm uppercase tracking-widest backdrop-blur-sm shadow-sm font-semibold">
                  <span className="material-symbols-outlined text-sm">auto_stories</span>
                  Manual Oficial do Aplicativo
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Pura Vitrine • Marketing para Salões
                </span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface font-normal tracking-tight">
                Guia de Utilização &amp; <span className="italic text-primary font-medium">Boas Práticas</span> ✨
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mt-1.5 leading-relaxed">
                Tudo o que você e sua equipe precisam saber para criar posts de alto padrão, ativar o poder da inteligência
                artificial (Gemini) e transformar visualizações em clientes fiéis na poltrona.
              </p>
            </div>

            {/* Quick action triggers */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-space-xs shrink-0">
              <Link
                href="/dashboard/posts"
                className="flex items-center gap-2 px-space-md py-3 rounded-xl bg-primary text-on-primary font-title-md text-title-md shadow-md hover:scale-[1.02] active:scale-95 transition-all font-semibold"
              >
                <span className="material-symbols-outlined text-xl text-primary-fixed">edit_square</span>
                <span>Ir para o Editor</span>
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-space-sm py-3 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-variant font-title-md text-title-md shadow-sm transition-all"
              >
                <span className="material-symbols-outlined text-secondary text-xl">dashboard</span>
                <span>Ver Dashboard</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-outline-variant/20 scrollbar-none">
          {[
            { id: 'inicio', label: 'Passo a Passo Rápido', icon: 'rocket_launch' },
            { id: 'dashboard', label: 'Dashboard & Métricas', icon: 'insights' },
            { id: 'editor', label: 'Editor Inteligente & IA', icon: 'auto_awesome' },
            { id: 'trends', label: 'Tendências TikTok & Reels', icon: 'local_fire_department' },
            { id: 'dicas', label: 'Dicas de Fotografia & Salão', icon: 'photo_camera' },
            { id: 'faq', label: 'Perguntas Frequentes (FAQ)', icon: 'help_outline' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-title-md text-title-md text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-on-primary font-semibold shadow-sm'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab 1: Passo a Passo Rápido */}
        {activeTab === 'inicio' && (
          <div className="flex flex-col gap-space-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
              {/* Step 1 */}
              <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/15 flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <div className="w-12 h-12 rounded-xl bg-primary-fixed/40 text-primary flex items-center justify-center font-headline-sm text-headline-sm font-bold">
                    01
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface text-lg">
                    Escolha a Foto &amp; Formato
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    No <strong>Editor de Post</strong>, suba a foto da cliente após o procedimento (corte, coloração, mechas ou estética).
                    Recomendamos sempre o formato vertical <strong>Feed (4:5)</strong> para máximo impacto visual na timeline.
                  </p>
                </div>
                <div className="p-3 bg-surface-container-low rounded-xl text-xs text-on-surface-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-base">aspect_ratio</span>
                  <span>Otimização automática para 4:5 e 9:16</span>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/15 flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <div className="w-12 h-12 rounded-xl bg-secondary-fixed/50 text-secondary flex items-center justify-center font-headline-sm text-headline-sm font-bold">
                    02
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface text-lg">
                    Ative a Inteligência BelezaIA
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Defina o tom de voz desejado (ex: <em>Sofisticado &amp; Aspiracional</em>) e descreva em poucas palavras o procedimento
                    realizado. Clique em <strong>&ldquo;Gerar Legenda &amp; Hashtags com IA&rdquo;</strong> para receber o texto pronto com emojis e hashtags.
                  </p>
                </div>
                <div className="p-3 bg-surface-container-low rounded-xl text-xs text-on-surface-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-base">psychology</span>
                  <span>Alimentado com Google Gemini 3.1 Flash</span>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/15 flex flex-col justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center font-headline-sm text-headline-sm font-bold">
                    03
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface text-lg">
                    Valide no Mockup &amp; Agende
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                    Veja em tempo real exatamente como o post vai aparecer no iPhone de suas clientes. Adicione o CTA de Barão Geraldo
                    com 1 clique e agende para o horário nobre de Campinas (18:45).
                  </p>
                </div>
                <div className="p-3 bg-surface-container-low rounded-xl text-xs text-on-surface-variant flex items-center gap-2">
                  <span className="material-symbols-outlined text-emerald-600 text-base">send</span>
                  <span>Agendamento inteligente em 1 clique</span>
                </div>
              </div>
            </div>

            {/* Banner Chamada Rápida */}
            <div className="rounded-2xl bg-gradient-to-r from-secondary-container/50 via-primary-fixed/30 to-surface-container-low p-space-md flex flex-col sm:flex-row items-center justify-between gap-space-md border border-outline-variant/20">
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-xl">verified</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-title-md text-title-md text-on-surface font-semibold">
                    Pronto para publicar agora?
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">
                    Experimente o fluxo completo no Editor de Post Inteligente.
                  </span>
                </div>
              </div>
              <Link
                href="/dashboard/posts"
                className="px-space-md py-2.5 rounded-xl bg-primary text-on-primary font-title-md text-title-md shadow-sm hover:opacity-95 transition-all font-semibold shrink-0"
              >
                Abrir Editor de Post
              </Link>
            </div>
          </div>
        )}

        {/* Tab 2: Dashboard & Métricas */}
        {activeTab === 'dashboard' && (
          <div className="flex flex-col gap-space-md">
            <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/15 flex flex-col gap-space-sm">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">
                Entendendo os 4 Indicadores de Sucesso (Satin Cards)
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                O Dashboard foi desenhado no formato de <em>Cockpit Estratégico</em> para que a proprietária ou gestora do salão visualize
                o retorno de investimento das campanhas em segundos:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm mt-2">
                <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-1 border border-outline-variant/15">
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <span className="material-symbols-outlined text-xl">group</span>
                    <span>Alcance Semanal (48.6K)</span>
                  </div>
                  <p className="text-body-sm text-on-surface-variant">
                    Mede o número total de perfis únicos de Campinas que viram seus Reels, Carrosséis e Stories nos últimos 7 dias.
                    O objetivo do salão de luxo é manter o indicador sempre acima de 30k.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-1 border border-outline-variant/15">
                  <div className="flex items-center gap-2 text-secondary font-bold">
                    <span className="material-symbols-outlined text-xl">favorite</span>
                    <span>Taxa de Engajamento (4.8%)</span>
                  </div>
                  <p className="text-body-sm text-on-surface-variant">
                    Representa o percentual de seguidoras que curtem, comentam e principalmente <strong>salvam</strong> as publicações.
                    No segmento de beleza, taxas acima de 3.5% representam autoridade máxima.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-1 border border-outline-variant/15">
                  <div className="flex items-center gap-2 text-primary font-bold">
                    <span className="material-symbols-outlined text-xl">event_available</span>
                    <span>Agendamentos Direct/Bio (154)</span>
                  </div>
                  <p className="text-body-sm text-on-surface-variant">
                    O dado mais valioso: quantas clientes clicaram no link da bio ou enviaram mensagem no Direct para reservar horário
                    após verem os posts da semana.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-1 border border-outline-variant/15">
                  <div className="flex items-center gap-2 text-on-surface font-bold">
                    <span className="material-symbols-outlined text-xl">track_changes</span>
                    <span>Meta do Mês (21/24)</span>
                  </div>
                  <p className="text-body-sm text-on-surface-variant">
                    Acompanha a constância do salão. A meta ideal para manter o algoritmo favorável é de 5 a 6 publicações semanais
                    (distribuídas entre Reels, Carrosséis e Stories).
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Editor Inteligente & IA */}
        {activeTab === 'editor' && (
          <div className="flex flex-col gap-space-md">
            <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/15 flex flex-col gap-space-sm">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">
                Recursos Avançados do Editor de Post
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Descubra como extrair o melhor de cada ferramenta do estúdio de criação:
              </p>

              <div className="flex flex-col gap-4 mt-2">
                <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-2 border border-outline-variant/15">
                  <span className="font-title-md text-title-md text-primary font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined">psychology</span>
                    1. Tons de Voz Estratégicos
                  </span>
                  <ul className="text-body-sm text-on-surface-variant list-disc pl-5 space-y-1">
                    <li><strong>Sofisticado &amp; Aspiracional:</strong> Vocabulário nobre, foco em elegância atemporal, saúde da fibra capilar e exclusividade. Ideal para mechas, morena iluminada e dia da noiva.</li>
                    <li><strong>Divertido &amp; Tendência:</strong> Linguagem moderna e leve, perfeita para reels descontraídos com a equipe, antes/depois impactantes e nail arts criativas.</li>
                    <li><strong>Educativo &amp; Cuidados:</strong> Explica como manter a hidratação em casa, cronograma capilar e cuidados pós-química. Constrói alta autoridade técnica.</li>
                    <li><strong>Agenda Aberta / VIP:</strong> Chamada persuasiva de urgência para vagas limitadas e dias especiais de atendimento.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-2 border border-outline-variant/15">
                  <span className="font-title-md text-title-md text-secondary font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined">format_quote</span>
                    2. Barra de Emojis &amp; Quebra Limpa
                  </span>
                  <p className="text-body-sm text-on-surface-variant">
                    Textos no Instagram sem espaçamento cansam a leitura. Use o botão <strong>&ldquo;Quebra de Linha Limpa&rdquo;</strong> para criar
                    parágrafos arejados e agradáveis. Os botões de emoji inserem rapidamente ícones de luxo como ✨, 🤎 e ✂️.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-2 border border-outline-variant/15">
                  <span className="font-title-md text-title-md text-primary font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined">tag</span>
                    3. Pílulas de Hashtags Dinâmicas
                  </span>
                  <p className="text-body-sm text-on-surface-variant">
                    Basta clicar em qualquer pílula de hashtag (como <code>#salaocampinas</code> ou <code>#morenailuminada</code>) para alternar
                    sua inclusão na legenda e vê-la refletida automaticamente na tela do iPhone de teste.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Tendências TikTok & Reels */}
        {activeTab === 'trends' && (
          <div className="flex flex-col gap-space-md">
            <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/15 flex flex-col gap-space-sm">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-rose-500/10 text-rose-500 material-symbols-outlined text-2xl">
                  local_fire_department
                </span>
                <div>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface">
                    TikTok Creative Center &amp; Tendências de Beleza
                  </h2>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Como aproveitar as maiores tendências de cabelos e cosméticos do Brasil para lotar a agenda do salão
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-2 border border-outline-variant/15">
                  <span className="font-title-md text-title-md text-rose-600 font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined">trending_up</span>
                    1. Monitoramento em Tempo Real
                  </span>
                  <p className="text-body-sm text-on-surface-variant leading-relaxed">
                    Nossa central monitora continuamente o volume de buscas no Brasil para procedimentos como <strong>Acidificação Capilar</strong>, <strong>Morena Iluminada Mel</strong> e <strong>Corte Butterfly</strong>, apontando o que está em alta no momento.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-2 border border-outline-variant/15">
                  <span className="font-title-md text-title-md text-primary font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined">timer</span>
                    2. Ganchos Virais de 3s (Hooks)
                  </span>
                  <p className="text-body-sm text-on-surface-variant leading-relaxed">
                    A primeira frase falada ou escrita na tela define a retenção do vídeo. No painel de tendências, cada procedimento vem acompanhado de um gancho persuasivo já testado para prender a atenção da cliente.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-2 border border-outline-variant/15">
                  <span className="font-title-md text-title-md text-secondary font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined">movie_edit</span>
                    3. Roteiros Cronometrados com IA
                  </span>
                  <p className="text-body-sm text-on-surface-variant leading-relaxed">
                    Com 1 clique em <strong>&ldquo;Gerar Roteiro IA&rdquo;</strong>, o Google Gemini divide o seu vídeo em 3 partes: <em>Introdução de impacto (0-3s)</em>, <em>Processo no salão (4-15s)</em> e <em>Revelação brilhante com CTA (16-30s)</em>.
                  </p>
                </div>
              </div>

              <div className="mt-3 p-4 rounded-xl bg-gradient-to-r from-rose-500/10 via-surface-container-low to-amber-500/10 border border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-rose-500 text-2xl">music_note</span>
                  <div className="flex flex-col">
                    <span className="font-title-md text-title-md text-on-surface font-semibold text-sm">
                      Dica de Áudios em Alta para Reels &amp; TikTok:
                    </span>
                    <span className="text-body-sm text-on-surface-variant text-xs">
                      Sempre utilize a trilha sugerida em segundo plano com volume em 30% a 40% e a voz do profissional em 100%. Isso garante a impulsão do áudio viral sem perder a clareza da explicação técnica.
                    </span>
                  </div>
                </div>

                <Link
                  href="/dashboard/ai"
                  className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold whitespace-nowrap shadow-sm hover:scale-[1.02] active:scale-95 transition-all shrink-0"
                >
                  Abrir Tendências no BelezaIA
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Dicas de Fotografia & Salão */}
        {activeTab === 'dicas' && (
          <div className="flex flex-col gap-space-md">
            <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/15 flex flex-col gap-space-sm">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">
                Dicas de Ouro para Fotografia &amp; Vídeos no Salão
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Boas práticas testadas nas principais referências de salões de beleza de alto padrão no Brasil e no mundo:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-sm mt-2">
                <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-2 border border-outline-variant/15">
                  <span className="font-title-md text-title-md text-primary font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined">wb_incandescent</span> Iluminação &amp; Ring Light
                  </span>
                  <p className="text-body-sm text-on-surface-variant leading-relaxed">
                    Evite luz fria de teto direta na cabeça da cliente, pois cria sombras nos olhos. Posicione a ring light ou luz difusa
                    levemente inclinada na altura do rosto para realçar o brilho espelhado dos fios e a textura natural da pele.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-2 border border-outline-variant/15">
                  <span className="font-title-md text-title-md text-secondary font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined">water_drop</span> Lavatório Sensorial (Reels de Sucesso)
                  </span>
                  <p className="text-body-sm text-on-surface-variant leading-relaxed">
                    Vídeos curtos de 7 a 15 segundos mostrando a água caindo suavemente, a aplicação de máscara com movimentos relaxantes
                    e som ambiente têm 3x mais salvamentos e compartilhamentos que fotos estáticas.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-2 border border-outline-variant/15">
                  <span className="font-title-md text-title-md text-primary font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined">compare</span> Antes &amp; Depois Elegante
                  </span>
                  <p className="text-body-sm text-on-surface-variant leading-relaxed">
                    Nunca coloque a cliente descabelada ou triste na foto do &ldquo;Antes&rdquo;. Fotografe com postura digna e boa luz tanto o antes
                    quanto o depois para valorizar a cliente e manter a sofisticação da marca.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-surface-container-low flex flex-col gap-2 border border-outline-variant/15">
                  <span className="font-title-md text-title-md text-secondary font-bold flex items-center gap-1.5">
                    <span className="material-symbols-outlined">location_on</span> Geotargeting de Campinas
                  </span>
                  <p className="text-body-sm text-on-surface-variant leading-relaxed">
                    Sempre marque a localização oficial &ldquo;Barão Geraldo, Campinas&rdquo; ou &ldquo;Cambuí, Campinas&rdquo; em todos os posts. O algoritmo do
                    Instagram entrega prioritariamente para moradoras de condomínios e bairros vizinhos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: FAQ Interativo */}
        {activeTab === 'faq' && (
          <div className="flex flex-col gap-space-md">
            <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/15 flex flex-col gap-space-sm">
              <h2 className="font-headline-sm text-headline-sm text-on-surface">Perguntas Frequentes (FAQ)</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Dúvidas comuns sobre o uso diário da plataforma:
              </p>

              <div className="flex flex-col gap-2 mt-2">
                {faqs.map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div
                      key={index}
                      className="rounded-xl border border-outline-variant/20 bg-surface-container-low overflow-hidden transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                        className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-surface-container transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="px-2 py-0.5 rounded-full bg-primary-fixed/40 text-primary text-[10px] font-bold uppercase tracking-wider">
                            {faq.category}
                          </span>
                          <span className="font-title-md text-title-md text-on-surface font-semibold text-sm">
                            {faq.question}
                          </span>
                        </div>
                        <span
                          className={`material-symbols-outlined text-primary text-xl transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        >
                          expand_more
                        </span>
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-4 pt-1 text-body-sm text-on-surface-variant leading-relaxed border-t border-outline-variant/10">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

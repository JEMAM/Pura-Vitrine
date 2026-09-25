'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

export default function GuiaPage() {
  const [activeTab, setActiveTab] = useState<
    'inicio' | 'beleza-ia' | 'dashboard' | 'editor' | 'trends' | 'dicas' | 'chaves' | 'faq'
  >('inicio');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      category: 'BelezaIA Assist (Passo a Passo)',
      question: 'Eu nunca usei inteligência artificial antes. Vou conseguir usar o BelezaIA Assist?',
      answer:
        'Com certeza, 100%! O BelezaIA Assist foi desenhado para ser tão simples quanto conversar no WhatsApp. Você não precisa digitar comandos difíceis ou saber informática. Basta clicar no serviço feito (ex: Cabelo, Unhas ou Estética) e clicar no botão "Gerar". Em 3 segundos a IA entrega a legenda prontinha com emojis elegantes, hashtags que atraem clientes locais e a frase final convidando para agendar!',
    },
    {
      category: 'BelezaIA Assist (Passo a Passo)',
      question: 'O que o BelezaIA Assist faz exatamente para o meu salão?',
      answer:
        'Ele é como ter uma agência de marketing digital e uma redatora profissional trabalhando no seu salão 24 horas por dia. Ele: 1) Cria legendas para o Instagram e Facebook; 2) Dá ideias do que postar quando faltar criatividade; 3) Mostra quais músicas e vídeos estão bombando no TikTok; 4) Gera mensagens automáticas de feliz aniversário para suas clientes no WhatsApp com descontos/mimos; 5) Analisa se a foto do cabelo ou unha ficou bem iluminada antes de você postar; 6) Diz qual o melhor horário para publicar.',
    },
    {
      category: 'BelezaIA Assist (Passo a Passo)',
      question: 'As clientes vão perceber que foi uma IA que escreveu?',
      answer:
        'Não! Os textos são configurados com vocabulário acolhedor, caloroso e sofisticado, exatamente como uma cabeleireira ou manicure de alto padrão fala com suas clientes. Fica natural, charmoso e você pode editar qualquer palavra antes de postar se quiser.',
    },
    {
      category: 'Chaves & APIs',
      question: 'Qual é a única chave de API obrigatória para gerar conteúdo com IA?',
      answer:
        'A única chave necessária para o motor de Inteligência Artificial é a GEMINI_API_KEY do Google. Ela é 100% gratuita no Google AI Studio (aistudio.google.com). Sem ela, o sistema utiliza o mecanismo de templates inteligentes de contingência automaticamente.',
    },
    {
      category: 'Chaves & APIs',
      question: 'Preciso pagar ou ter chave de API para usar o Pinterest Business?',
      answer:
        'Não! O Pinterest Business é 100% gratuito e não exige chave de API de desenvolvedor. Toda a inteligência de títulos SEO, descrições ricas e sobreposição visual 2:3 é gerada automaticamente pelo Google Gemini (3.6 ou 3.7 Flash) integrado ao Pura Vitrine. Você publica gratuitamente pelo próprio app do Pinterest ou pelo painel web.',
    },
    {
      category: 'Chaves & APIs',
      question: 'Onde configuro as chaves para que funcionem na Vercel e no celular?',
      answer:
        'No painel da Vercel (vercel.com), acesse o seu projeto -> Settings -> Environment Variables. Adicione a variável GEMINI_API_KEY com a sua chave copiada do Google AI Studio e faça um novo Deploy. Assim, todos os computadores e celulares da equipe terão acesso instantâneo às gerações de IA.',
    },
    {
      category: 'Vídeos & Edição com IA',
      question: 'Posso usar vídeos no aplicativo e como faço para editar com IA?',
      answer:
        'Sim! A plataforma suporta upload de vídeos (.mp4, .mov, .webm) de até 50MB na Biblioteca de Mídia para agendamento em Reels, TikTok e Feed. Para a edição inteligente do vídeo, a IA do Pura Vitrine (Google Gemini) cria o roteiro cronometrado de 3s a 30s com gancho e áudios em alta. Para a edição do vídeo gravado, recomendamos ferramentas gratuitas de IA parceiras como o CapCut (para legendas automáticas animadas com 1 clique e redutor de ruído de secador) ou o Opus Clip (para cortes automáticos em 9:16).',
    },
    {
      category: 'Vídeos & Edição com IA',
      question: 'Qual é o formato ideal e o fluxo perfeito de gravação para salões?',
      answer:
        'O formato obrigatório para Reels e TikTok é a proporção vertical 9:16 (1080 x 1920 px) com duração recomendada de 15 a 30 segundos. O fluxo de maior sucesso é: 1) Gerar o roteiro no Pura Vitrine; 2) Gravar apenas 3 clipes curtos no celular com ring light (Antes de 2s, Processo de 6s e Revelação em câmera lenta de 5s); 3) No CapCut, aplicar Legendas Automáticas IA e Redutor de Ruído; 4) Fazer upload no Pura Vitrine e agendar o post.',
    },
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
            { id: 'beleza-ia', label: 'BelezaIA Assist (Passo a Passo)', icon: 'psychology', badge: 'NOVO' },
            { id: 'dashboard', label: 'Dashboard & Métricas', icon: 'insights' },
            { id: 'editor', label: 'Editor Inteligente & IA', icon: 'auto_awesome' },
            { id: 'trends', label: 'Tendências TikTok & Reels', icon: 'local_fire_department' },
            { id: 'dicas', label: 'Dicas de Fotografia & Salão', icon: 'photo_camera' },
            { id: 'chaves', label: 'Chaves de API & Cadastros', icon: 'key' },
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
              {(tab as any).badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider ${
                  activeTab === tab.id ? 'bg-white text-primary' : 'bg-primary/10 text-primary'
                }`}>
                  {(tab as any).badge}
                </span>
              )}
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

        {/* Tab: BelezaIA Assist (Guia Prático Passo a Passo) */}
        {activeTab === 'beleza-ia' && (
          <div className="flex flex-col gap-space-lg animate-fadeIn">
            {/* Banner Descomplicado de Boas-Vindas */}
            <div className="bg-gradient-to-r from-primary-50 via-surface to-secondary-container/40 p-6 lg:p-8 rounded-3xl border border-primary/25 shadow-sm relative overflow-hidden">
              <div className="absolute right-4 -bottom-6 opacity-10 pointer-events-none">
                <span className="material-symbols-outlined text-[160px] text-primary">psychology</span>
              </div>
              <div className="max-w-3xl relative z-10 space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider">
                  <span className="material-symbols-outlined text-sm">auto_awesome</span>
                  Sem Complicações • 100% Intuitivo
                </div>
                <h2 className="font-display text-2xl lg:text-3xl font-bold text-on-surface leading-tight">
                  O que é a BelezaIA Assist e por que você não precisa ter medo de usar? ✨
                </h2>
                <p className="text-on-surface-variant text-sm lg:text-base leading-relaxed">
                  Pense na <strong>BelezaIA Assist</strong> como uma especialista em marketing digital e uma redatora de salões
                  de beleza de luxo contratada exclusivamente para trabalhar para você, <strong>24 horas por dia</strong>.
                  Você não precisa entender de informática, robôs ou comandos difíceis: basta dizer o que você fez no salão
                  (como quem conta uma história para uma amiga) e ela cria legendas irresistíveis, ideias de vídeos e mensagens
                  que transformam curtidas em clientes sentadas na sua cadeira.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link
                    href="/dashboard/ai"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-semibold text-sm shadow-md hover:brightness-105 transition-all"
                  >
                    <span className="material-symbols-outlined text-lg">psychology</span>
                    <span>Abrir a BelezaIA Assist Agora</span>
                  </Link>
                  <Link
                    href="/dashboard/clients"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-surface text-on-surface border border-border/80 rounded-xl font-semibold text-sm hover:bg-surface-container-high transition-all"
                  >
                    <span className="material-symbols-outlined text-lg text-primary">cake</span>
                    <span>Ver Mensagens de Aniversário IA</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* O Passo a Passo Mais Simples do Mundo (Em 3 Passos) */}
            <div className="bg-surface-container-lowest p-6 lg:p-8 rounded-3xl border border-outline-variant/20 shadow-xs space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Método Prático</span>
                <h3 className="font-display text-xl font-bold text-on-surface mt-0.5">
                  Como usar a BelezaIA no dia a dia em 3 passos simples
                </h3>
                <p className="text-xs text-on-surface-variant mt-1">
                  Leva menos de 1 minuto para ter um conteúdo profissional de salão pronto para postar:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Passo 1 */}
                <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/15 flex flex-col justify-between gap-3">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-lg shadow-sm">
                      1
                    </div>
                    <h4 className="font-bold text-on-surface text-base">Tire a Foto ou Vídeo</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Ao terminar o cabelo, as unhas ou o procedimento da cliente, tire uma foto bem iluminada
                      (em frente à janela ou ring light). Você pode fazer o upload na plataforma ou postar direto do celular.
                    </p>
                  </div>
                  <div className="text-[11px] text-primary font-semibold flex items-center gap-1.5 pt-2 border-t border-border/40">
                    <span className="material-symbols-outlined text-sm">photo_camera</span>
                    <span>Dica: capture o movimento dos fios!</span>
                  </div>
                </div>

                {/* Passo 2 */}
                <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/15 flex flex-col justify-between gap-3">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-secondary text-white flex items-center justify-center font-bold text-lg shadow-sm">
                      2
                    </div>
                    <h4 className="font-bold text-on-surface text-base">Diga o que você fez</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Abra a <strong>BelezaIA Assist</strong>. Escolha o serviço (ex: Cabelo) e digite o procedimento
                      com suas palavras, por exemplo: <em>&quot;Morena iluminada em tons de avelã e corte em camadas&quot;</em>.
                      Escolha se quer um tom Elegante ou Descontraído.
                    </p>
                  </div>
                  <div className="text-[11px] text-secondary font-semibold flex items-center gap-1.5 pt-2 border-t border-border/40">
                    <span className="material-symbols-outlined text-sm">edit_note</span>
                    <span>Sem termos difíceis: fale naturalmente!</span>
                  </div>
                </div>

                {/* Passo 3 */}
                <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant/15 flex flex-col justify-between gap-3">
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                      3
                    </div>
                    <h4 className="font-bold text-on-surface text-base">Clique em Gerar e Copie!</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Em 3 segundos, a IA entrega a legenda completa, emojis selecionados com bom gosto, as hashtags
                      perfeitas da sua região e a frase final convidando a cliente para agendar. Basta clicar em
                      <strong>&quot;Copiar Legenda&quot;</strong> ou <strong>&quot;Usar no Post&quot;</strong>!
                    </p>
                  </div>
                  <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1.5 pt-2 border-t border-border/40">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    <span>Pronto para publicar no Instagram!</span>
                  </div>
                </div>
              </div>
            </div>

            {/* As 7 Super Ferramentas da BelezaIA explicadas */}
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-secondary">Recursos Detalhados</span>
                <h3 className="font-display text-xl font-bold text-on-surface mt-0.5">
                  Conheça cada uma das 7 Ferramentas da BelezaIA Assist
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Tudo o que está disponível na barra superior da BelezaIA Assist, explicado passo a passo:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Ferramenta 1: Copywriting */}
                <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/15 shadow-xs space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 bg-primary/10 text-primary rounded-xl">
                      <span className="material-symbols-outlined text-2xl">edit_square</span>
                    </span>
                    <div>
                      <h4 className="font-bold text-on-surface text-base">1. Criador de Legendas (Copywriting)</h4>
                      <p className="text-xs text-primary font-medium">Para você nunca mais travar na hora de escrever</p>
                    </div>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    <strong>Como usar:</strong> Selecione a categoria (Cabelo, Unhas, Estética, Sobrancelhas), digite o nome do procedimento e escolha o objetivo (atrair clientes, preencher horários livres ou engajar).
                  </p>
                  <div className="bg-surface-container-low p-3 rounded-xl text-xs space-y-1 text-on-surface">
                    <p className="font-semibold text-primary">✨ O que você ganha com 1 clique:</p>
                    <ul className="list-disc list-inside text-on-surface-variant space-y-0.5 text-[11px]">
                      <li>Legenda magnética que valoriza a técnica profissional.</li>
                      <li>CTA (Chamada para Ação): a frase que manda a cliente para o seu WhatsApp ou Direct.</li>
                      <li>Hashtags estratégicas que fazem seu post ser encontrado por quem mora na sua cidade.</li>
                      <li>Hooks (Ganchos): 3 opções de frases de impacto para colocar na primeira linha.</li>
                    </ul>
                  </div>
                </div>

                {/* Ferramenta 2: Ideias & Pautas */}
                <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/15 shadow-xs space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 bg-secondary-container/50 text-secondary rounded-xl">
                      <span className="material-symbols-outlined text-2xl">lightbulb</span>
                    </span>
                    <div>
                      <h4 className="font-bold text-on-surface text-base">2. Pautas &amp; Ideias Semanais</h4>
                      <p className="text-xs text-secondary font-medium">Quando você não faz ideia do que postar hoje</p>
                    </div>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    <strong>Como usar:</strong> Clique na aba &quot;Pautas &amp; Ideias&quot;, escolha o foco do seu salão (ex: Cabelos e Mechas, Unhas em Gel ou Estética) e clique no botão roxo.
                  </p>
                  <div className="bg-surface-container-low p-3 rounded-xl text-xs space-y-1 text-on-surface">
                    <p className="font-semibold text-secondary">💡 O que a IA cria para você:</p>
                    <ul className="list-disc list-inside text-on-surface-variant space-y-0.5 text-[11px]">
                      <li>Roteiro pronto de posts para segunda, quarta, sexta e sábado.</li>
                      <li>Indica o formato ideal: se deve ser Carrossel com fotos, Reel com vídeo ou Foto única.</li>
                      <li>Sugere a foto certa (ex: &quot;Foto segurando um óleo reparador no lavatório&quot;).</li>
                    </ul>
                  </div>
                </div>

                {/* Ferramenta 3: TikTok Trends */}
                <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/15 shadow-xs space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
                      <span className="material-symbols-outlined text-2xl">local_fire_department</span>
                    </span>
                    <div>
                      <h4 className="font-bold text-on-surface text-base">3. Tendências do TikTok &amp; Reels</h4>
                      <p className="text-xs text-rose-600 font-medium">Vídeos curtos que o algoritmo ama entregar</p>
                    </div>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    <strong>O que é isso de forma simples?</strong> &quot;Trend&quot; é um assunto ou estilo de vídeo que está todo mundo assistindo agora no Brasil. Quando você posta algo no mesmo formato, o Instagram mostra seu vídeo para centenas de pessoas novas sem você pagar nada.
                  </p>
                  <div className="bg-surface-container-low p-3 rounded-xl text-xs space-y-1 text-on-surface">
                    <p className="font-semibold text-rose-700">🎬 Como usar o roteiro do TikTok:</p>
                    <ul className="list-disc list-inside text-on-surface-variant space-y-0.5 text-[11px]">
                      <li>A IA já escreve a frase que você ou a cliente devem falar nos primeiros 3 segundos.</li>
                      <li>Indica músicas e áudios que estão em alta no momento para você colocar no vídeo.</li>
                    </ul>
                  </div>
                </div>

                {/* Ferramenta 4: Multicanal */}
                <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/15 shadow-xs space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 bg-amber-50 text-amber-700 rounded-xl">
                      <span className="material-symbols-outlined text-2xl">share</span>
                    </span>
                    <div>
                      <h4 className="font-bold text-on-surface text-base">4. Multicanal (Google, Pinterest e Stories)</h4>
                      <p className="text-xs text-amber-700 font-medium">Atraia clientes de todos os cantos da internet</p>
                    </div>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Você não vive só de Instagram! A BelezaIA cria conteúdos sob medida para outros locais onde clientes ricas procuram salão:
                  </p>
                  <div className="bg-surface-container-low p-3 rounded-xl text-xs space-y-1 text-on-surface">
                    <ul className="list-disc list-inside text-on-surface-variant space-y-1 text-[11px]">
                      <li><strong>Google Meu Negócio:</strong> Textos com palavras-chave da sua cidade para você aparecer em 1º quando alguém buscar salão no mapa.</li>
                      <li><strong>Pinterest:</strong> Títulos magnéticos para pastas de inspiração de noivas e madrinhas.</li>
                      <li><strong>Roteiro de Stories:</strong> Enquetes e perguntas prontas para fazer suas seguidoras responderem.</li>
                    </ul>
                  </div>
                </div>

                {/* Ferramenta 5: WhatsApp de Aniversário */}
                <div className="bg-surface-container-lowest p-5 rounded-2xl border border-primary/30 shadow-xs space-y-3 md:col-span-2">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
                      <span className="material-symbols-outlined text-2xl">cake</span>
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-on-surface text-base">5. Mensagens de Feliz Aniversário no WhatsApp com IA</h4>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">NOVO</span>
                      </div>
                      <p className="text-xs text-emerald-700 font-medium">A ferramenta que mais reativa clientes e lota o salão</p>
                    </div>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Toda cliente ama ser lembrada no aniversário, ainda mais com um presentinho ou mimo exclusivo!
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="bg-surface-container-low p-3 rounded-xl text-xs space-y-1">
                      <span className="font-bold text-on-surface">1. Abra a Agenda:</span>
                      <p className="text-[11px] text-on-surface-variant">Acesse o menu <em>Clientes &amp; Agenda</em> para ver quem faz aniversário hoje ou neste mês.</p>
                    </div>
                    <div className="bg-surface-container-low p-3 rounded-xl text-xs space-y-1">
                      <span className="font-bold text-on-surface">2. Clique no Botão de IA:</span>
                      <p className="text-[11px] text-on-surface-variant">A IA redige o texto na hora, com o nome da aniversariante e o mimo selecionado (ex: 15% OFF).</p>
                    </div>
                    <div className="bg-surface-container-low p-3 rounded-xl text-xs space-y-1">
                      <span className="font-bold text-on-surface">3. 1 Toque para Enviar:</span>
                      <p className="text-[11px] text-on-surface-variant">Clique em <em>Abrir WhatsApp</em>. O aplicativo abre a conversa com o texto prontinho para enviar!</p>
                    </div>
                  </div>
                </div>

                {/* Ferramenta 6: Curadoria Visual */}
                <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/15 shadow-xs space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
                      <span className="material-symbols-outlined text-2xl">photo_camera</span>
                    </span>
                    <div>
                      <h4 className="font-bold text-on-surface text-base">6. Curadoria Visual de Fotos</h4>
                      <p className="text-xs text-blue-700 font-medium">Sua consultora de fotografia antes de postar</p>
                    </div>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Suba a foto do cabelo ou unha e a IA atua como uma fotógrafa profissional: dá uma nota de 1 a 10 e explica com gentileza se a luz está boa, se o ângulo valorizou a cor ou se vale a pena tirar outra foto antes de publicar.
                  </p>
                </div>

                {/* Ferramenta 7: Melhores Horários */}
                <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/15 shadow-xs space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="p-2.5 bg-purple-50 text-purple-700 rounded-xl">
                      <span className="material-symbols-outlined text-2xl">schedule</span>
                    </span>
                    <div>
                      <h4 className="font-bold text-on-surface text-base">7. Melhores Horários para Postar</h4>
                      <p className="text-xs text-purple-700 font-medium">Poste no minuto em que suas clientes estão com o celular na mão</p>
                    </div>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Não adianta postar um cabelo incrível às 10 da manhã se suas clientes estão no trabalho. A IA analisa os hábitos do público feminino local e recomenda o horário de ouro (geralmente entre 18:15 e 19:45) para você ter o máximo de curtidas e mensagens.
                  </p>
                </div>
              </div>
            </div>

            {/* Comparativo Didático: Antes e Depois da Legenda */}
            <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/20 shadow-xs space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">Comparativo Prático</span>
                <h3 className="font-display text-xl font-bold text-on-surface mt-0.5">
                  Veja a diferença real no resultado:
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Como uma postagem comum se transforma em um ímã de agendamentos com a BelezaIA:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Como as pessoas postam */}
                <div className="p-5 rounded-2xl bg-red-50/50 border border-red-200/60 space-y-2">
                  <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
                    <span className="material-symbols-outlined text-base">cancel</span>
                    <span>Como a maioria posta (Pouco Engajamento):</span>
                  </div>
                  <p className="text-xs text-red-950/80 italic font-mono bg-white/70 p-3 rounded-xl border border-red-200/40">
                    &quot;Cabelo de hoje lindo da cliente Mariana mechas morena iluminada agende seu horário no WhatsApp 98765-4321 #salao #cabelo&quot;
                  </p>
                  <p className="text-[11px] text-red-700">
                    ❌ <strong>O que faltou:</strong> Emoção, desejo, valorização do procedimento e sofisticação. Passa a impressão de amadorismo.
                  </p>
                </div>

                {/* Como o BelezaIA escreve */}
                <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200/70 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                    <span className="material-symbols-outlined text-base">check_circle</span>
                    <span>Como a BelezaIA Assist transforma (Lota a Agenda):</span>
                  </div>
                  <p className="text-xs text-emerald-950/90 italic bg-white/80 p-3 rounded-xl border border-emerald-200/50 leading-relaxed font-sans">
                    &quot;A harmonia sutil entre as nuances avelã e caramelo para iluminar com elegância e respeito absoluto à fibra capilar. ✨ Fios leves, toque sedoso e aquele acabamento brilhante que transforma a autoestima no espelho.\n\nRestam poucos horários nesta semana! Toque no link da bio para garantir sua avaliação personalizada. 💕 #morenailuminada #cabeloperfeito #salaocampinas&quot;
                  </p>
                  <p className="text-[11px] text-emerald-800">
                    ✅ <strong>Resultado:</strong> Desperta desejo imediato, atrai clientes de alto padrão e transmite autoridade técnica!
                  </p>
                </div>
              </div>
            </div>

            {/* Dicionário Descomplicado do Marketing */}
            <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/20 shadow-xs space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-secondary">Glossário Sem Mistério</span>
                <h3 className="font-display text-xl font-bold text-on-surface mt-0.5">
                  Dicionário Descomplicado: O que significam esses termos em inglês?
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Para você nunca mais ficar em dúvida quando ouvir palavras do marketing:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 bg-surface-container-low rounded-xl border border-border/40 space-y-1">
                  <span className="font-bold text-primary text-sm">Hook (Gancho)</span>
                  <p className="text-on-surface-variant text-[11px] leading-relaxed">
                    É a primeira frase de um vídeo ou legenda. O objetivo dela é &quot;fisgar&quot; a cliente nos primeiros 3 segundos para que ela pare de rolar a tela e preste atenção em você.
                  </p>
                </div>

                <div className="p-3.5 bg-surface-container-low rounded-xl border border-border/40 space-y-1">
                  <span className="font-bold text-secondary text-sm">CTA (Call to Action)</span>
                  <p className="text-on-surface-variant text-[11px] leading-relaxed">
                    Significa &quot;Chamada para Ação&quot;. É o empurrãozinho final convidando a cliente a fazer algo, como: &quot;Clique no link da bio para agendar&quot; ou &quot;Mande mensagem no direct&quot;.
                  </p>
                </div>

                <div className="p-3.5 bg-surface-container-low rounded-xl border border-border/40 space-y-1">
                  <span className="font-bold text-accent-dark text-sm">Copywriting (Copy)</span>
                  <p className="text-on-surface-variant text-[11px] leading-relaxed">
                    É a arte de escrever textos pensados para encantar e vender. Não é só dizer &quot;olha meu trabalho&quot;, mas sim fazer a cliente desejar sentir aquela experiência no salão.
                  </p>
                </div>

                <div className="p-3.5 bg-surface-container-low rounded-xl border border-border/40 space-y-1">
                  <span className="font-bold text-emerald-700 text-sm">Feed 4:5</span>
                  <p className="text-on-surface-variant text-[11px] leading-relaxed">
                    É o tamanho de foto vertical mais gordinha que ocupa quase a tela inteira do celular no Instagram. É o formato que mais dá curtidas e comentários hoje.
                  </p>
                </div>
              </div>
            </div>

            {/* Chamada Final para Ação */}
            <div className="rounded-3xl bg-gradient-to-r from-primary via-primary-dark to-[#703b44] p-6 lg:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
              <div className="space-y-2 text-center md:text-left">
                <h3 className="font-display text-xl lg:text-2xl font-bold">
                  Pronta para colocar a BelezaIA para trabalhar por você?
                </h3>
                <p className="text-white/85 text-xs lg:text-sm max-w-xl">
                  Dê o primeiro passo agora mesmo: gere uma legenda teste ou crie sua pauta semanal de posts em menos de 10 segundos!
                </p>
              </div>
              <Link
                href="/dashboard/ai"
                className="px-6 py-3.5 bg-white text-primary font-bold rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all text-sm shrink-0"
              >
                Abrir BelezaIA Assist ✨
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

        {/* Tab 6: Chaves de API & Cadastros */}
        {activeTab === 'chaves' && (
          <div className="flex flex-col gap-space-lg">
            {/* Header da Aba */}
            <div className="bg-surface-container-lowest rounded-2xl p-space-md lg:p-space-lg shadow-sm border border-outline-variant/15 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">vpn_key</span>
                  Guia de Integrações &amp; Credenciais
                </span>
                <span className="text-xs text-on-surface-variant font-medium">Configuração em 5 minutos</span>
              </div>
              <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                Chaves de API &amp; Cadastros Necessários
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-4xl leading-relaxed">
                Para tirar 100% de proveito do <strong>Pura Vitrine</strong>, veja abaixo exatamente quais serviços exigem chave de API, quais exigem apenas um cadastro gratuito e como configurá-los no seu computador e na Vercel para celular.
              </p>

              {/* Grid de Resumo Rápido */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                <div className="p-3.5 bg-surface-container-low rounded-xl border border-primary/20 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold">
                    ✨
                  </div>
                  <div>
                    <span className="text-xs font-bold text-on-surface block">Google Gemini AI</span>
                    <span className="text-[11px] text-emerald-700 font-semibold block">100% Gratuito &bull; Chave Obrigatória</span>
                    <span className="text-[10px] text-on-surface-variant">Geração de legendas, roteiros e estratégias</span>
                  </div>
                </div>

                <div className="p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/15 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-stone-900 text-white flex items-center justify-center shrink-0 font-bold text-xs">
                    🎵
                  </div>
                  <div>
                    <span className="text-xs font-bold text-on-surface block">TikTok Creative Center</span>
                    <span className="text-[11px] text-emerald-700 font-semibold block">100% Gratuito &bull; Sem Chave</span>
                    <span className="text-[10px] text-on-surface-variant">Hashtags e áudios virais de beleza (#hairtok)</span>
                  </div>
                </div>

                <div className="p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/15 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0 font-bold">
                    📌
                  </div>
                  <div>
                    <span className="text-xs font-bold text-on-surface block">Pinterest Business</span>
                    <span className="text-[11px] text-emerald-700 font-semibold block">100% Gratuito &bull; Sem Chave</span>
                    <span className="text-[10px] text-on-surface-variant">Busca visual para mechas, cortes e noivas</span>
                  </div>
                </div>

                <div className="p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/15 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-600/10 text-blue-600 flex items-center justify-center shrink-0 font-bold">
                    📍
                  </div>
                  <div>
                    <span className="text-xs font-bold text-on-surface block">Google Meu Negócio</span>
                    <span className="text-[11px] text-emerald-700 font-semibold block">100% Gratuito &bull; Sem Chave</span>
                    <span className="text-[10px] text-on-surface-variant">Presença no Google Maps e busca local</span>
                  </div>
                </div>

                <div className="p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/15 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-600/10 text-indigo-600 flex items-center justify-center shrink-0 font-bold">
                    🎯
                  </div>
                  <div>
                    <span className="text-xs font-bold text-on-surface block">Meta Business &amp; Ads</span>
                    <span className="text-[11px] text-indigo-700 font-semibold block">Opcional &bull; Orçamento Flexível</span>
                    <span className="text-[10px] text-on-surface-variant">Anúncios no Instagram por raio de 3 a 5km</span>
                  </div>
                </div>

                <div className="p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/15 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center shrink-0 font-bold">
                    ⚡
                  </div>
                  <div>
                    <span className="text-xs font-bold text-on-surface block">Vercel &amp; Produção</span>
                    <span className="text-[11px] text-emerald-700 font-semibold block">Deploy em Nuvem &bull; Gratuito</span>
                    <span className="text-[10px] text-on-surface-variant">Variáveis de ambiente (Environment Variables)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SEÇÃO 1: GOOGLE GEMINI AI */}
            <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/15 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant/15">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-base shadow-sm">
                    1
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface text-lg font-bold flex items-center gap-2">
                      Google Gemini AI (Chave Obrigatória para IA)
                    </h3>
                    <span className="text-xs text-on-surface-variant">
                      Alimenta o BelezaIA, criação de legendas, hashtags, roteiros virais e posts multicanais.
                    </span>
                  </div>
                </div>
                <a
                  href="https://aistudio.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-90 transition-all flex items-center gap-1.5 shadow-sm shrink-0"
                >
                  <span>Abrir Google AI Studio</span>
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed text-on-surface-variant">
                <div className="flex flex-col gap-2.5">
                  <strong className="text-on-surface text-sm">Passo a Passo para Gerar sua Chave Gratuita:</strong>
                  <ol className="list-decimal pl-4 space-y-1.5">
                    <li>
                      Acesse o portal oficial: <strong className="text-primary">aistudio.google.com</strong> e faça login com qualquer conta Google (Gmail).
                    </li>
                    <li>
                      No canto superior esquerdo ou no topo, clique no botão azul <strong>&ldquo;Get API key&rdquo;</strong>.
                    </li>
                    <li>
                      Clique em <strong>&ldquo;Create API key&rdquo;</strong> e selecione <strong>&ldquo;Create API key in new project&rdquo;</strong>.
                    </li>
                    <li>
                      Copie o código gerado (uma sequência que inicia com <code>AIzaSy...</code>).
                    </li>
                  </ol>
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-900 mt-1">
                    <strong>💰 Custo &amp; Cotas:</strong> O plano gratuito do Google AI Studio oferece até 15 requisições por minuto e 1.500 requisições por dia sem cobrar absolutamente nada no cartão.
                  </div>
                </div>

                <div className="flex flex-col gap-2.5">
                  <strong className="text-on-surface text-sm">Onde Colar a Chave:</strong>
                  <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 font-mono text-[11px] flex flex-col gap-2">
                    <span className="text-on-surface-variant font-sans font-bold">1. No seu computador (.env.local):</span>
                    <div className="p-2 bg-surface rounded border border-outline-variant/30 text-on-surface">
                      GEMINI_API_KEY=&quot;sua_chave_copiada_aqui&quot;
                    </div>
                    <span className="text-on-surface-variant font-sans font-bold mt-1">2. No painel da Vercel (para celular e equipe):</span>
                    <p className="text-[11px] font-sans text-on-surface-variant leading-relaxed">
                      Acesse <strong>vercel.com</strong> &rarr; Selecione o projeto &rarr; <strong>Settings</strong> &rarr; <strong>Environment Variables</strong>. Em &ldquo;Key&rdquo; digite <code>GEMINI_API_KEY</code> e em &ldquo;Value&rdquo; cole a sua chave. Em seguida, clique em <strong>Save</strong> e faça um Redeploy.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* SEÇÃO 2: TIKTOK CREATIVE CENTER */}
            <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/15 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant/15">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center font-bold text-base shadow-sm">
                    2
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface text-lg font-bold flex items-center gap-2">
                      TikTok Creative Center &amp; Tendências #hairtok
                    </h3>
                    <span className="text-xs text-on-surface-variant">
                      Descubra músicas em alta, hashtags virais de beleza e vídeos com maior retenção no Brasil.
                    </span>
                  </div>
                </div>
                <a
                  href="https://ads.tiktok.com/business/creativecenter/inspiration/popular/hashtag/pc/pt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-all flex items-center gap-1.5 shadow-sm shrink-0"
                >
                  <span>Abrir TikTok Creative Center</span>
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed text-on-surface-variant">
                <div className="flex flex-col gap-2.5">
                  <strong className="text-on-surface text-sm">Precisa de Chave de API?</strong>
                  <p>
                    <strong>Não!</strong> O TikTok Creative Center é um portal público gratuito de inteligência de mercado fornecido pela própria ByteDance.
                  </p>
                  <strong className="text-on-surface text-sm mt-1">Como Acessar e Explorar:</strong>
                  <ol className="list-decimal pl-4 space-y-1.5">
                    <li>Acesse o link do Creative Center e faça login com qualquer conta TikTok ou TikTok for Business.</li>
                    <li>No menu superior, vá em <strong>Trends (Tendências)</strong> &rarr; <strong>Hashtags</strong> ou <strong>Songs (Músicas)</strong>.</li>
                    <li>No filtro de Região, selecione <strong>Brasil</strong> e no setor filtre por <strong>Beleza &amp; Cuidados Pessoais</strong>.</li>
                    <li>Você verá gráficos de crescimento diário de termos como <code>#cortedecabelo</code>, <code>#morenailuminada</code> e <code>#cronogramacapilar</code>.</li>
                  </ol>
                </div>

                <div className="flex flex-col gap-2.5">
                  <strong className="text-on-surface text-sm">Integração Nativa no Pura Vitrine:</strong>
                  <p>
                    Nosso aplicativo já possui uma curadoria em tempo real das tendências mais quentes de salão na aba <strong>&ldquo;TikTok Trends (Vídeos Virais)&rdquo;</strong> na seção de Inteligência Artificial:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-on-surface">
                    <li>Você pode clicar em <strong>&ldquo;Ouvir / Ver Tendência&rdquo;</strong> para inspecionar o som original no TikTok.</li>
                    <li>O botão <strong>&ldquo;Gerar Roteiro Viral&rdquo;</strong> cria em 3 segundos a estrutura de cena + fala + trilha sonora recomendada.</li>
                    <li>O botão <strong>&ldquo;Abrir no Editor de Post&rdquo;</strong> transcreve tudo diretamente para agendamento!</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* SEÇÃO 3: PRODUÇÃO & EDIÇÃO DE VÍDEOS COM IA */}
            <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/15 flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant/15">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                    3
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-headline-sm text-headline-sm text-on-surface text-lg font-bold">
                        Produção &amp; Edição de Vídeos com IA (Reels, TikTok &amp; Shorts 9:16)
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-300">
                        CapCut IA + Pura Vitrine + Roteiros 9:16
                      </span>
                    </div>
                    <span className="text-xs text-on-surface-variant">
                      Grave vídeos magnéticos no salão com seu celular e use Inteligência Artificial para legendas automáticas, corte de ruído e alta retenção.
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap shrink-0">
                  <a
                    href="https://www.capcut.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Abrir CapCut IA</span>
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                  </a>
                  <a
                    href="https://www.opus.pro"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-surface-container-high text-on-surface text-xs font-bold hover:bg-surface-container-highest transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Opus Clip (Cortes IA)</span>
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                  </a>
                </div>
              </div>

              {/* Banner de Impacto dos Vídeos */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-purple-600 text-2xl">movie_filter</span>
                  <div>
                    <h4 className="text-xs font-bold text-purple-950">Por que o Vídeo é o Formato de Maior Conversão para Salões?</h4>
                    <p className="text-[11px] text-purple-900 leading-relaxed mt-0.5">
                      No Instagram Reels e TikTok, vídeos verticais entregam até <strong>4x mais alcance orgânico</strong> do que fotos estáticas. As clientes compram <em>transformação e movimento</em>. Com ferramentas gratuitas de IA, você não precisa ser editor profissional para criar vídeos cinematográficos em menos de 5 minutos!
                    </p>
                  </div>
                </div>
              </div>

              {/* Grade de 3 Pilares: Pura Vitrine + Ferramentas IA + Fórmula de Gravação */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed text-on-surface-variant">
                {/* Pilar 1: O que o Pura Vitrine faz */}
                <div className="flex flex-col gap-2.5 p-4 rounded-xl bg-surface-container-low border border-outline-variant/10">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-purple-600 text-lg">psychology</span>
                    <strong className="text-on-surface text-sm">1. IA do Pura Vitrine (Roteiro)</strong>
                  </div>
                  <ul className="list-disc pl-4 space-y-1.5 text-on-surface-variant text-[11px]">
                    <li><strong>Roteiro Cronometrado (0s a 30s)</strong>: A IA cria a cena visual exata e a fala do profissional para cada segundo do vídeo.</li>
                    <li><strong>Gancho Viral de 3 Segundos</strong>: Frases magnéticas geradas pelo Gemini para prender a rolagem nos primeiros segundos.</li>
                    <li><strong>Sugestão de Áudio em Alta</strong>: Indica o estilo de música e o momento do <em>drop da batida</em> para a revelação.</li>
                    <li><strong>Upload de Vídeos (.mp4 / .mov)</strong>: Guarde e organize todos os vídeos de procedimentos na Biblioteca de Mídia para agendamento.</li>
                  </ul>
                </div>

                {/* Pilar 2: Como Editar com IA (Ferramentas) */}
                <div className="flex flex-col gap-2.5 p-4 rounded-xl bg-surface-container-low border border-outline-variant/10">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-purple-600 text-lg">auto_fix_high</span>
                    <strong className="text-on-surface text-sm">2. Como Editar com IA Grátis</strong>
                  </div>
                  <ul className="list-disc pl-4 space-y-1.5 text-on-surface-variant text-[11px]">
                    <li>
                      <strong>CapCut (Legendas com IA)</strong>: Com 1 toque em <em>&ldquo;Legendas Automáticas&rdquo;</em>, a IA transcreve sua voz com letras dinâmicas e coloridas (mais de 70% assistem sem som no feed!).
                    </li>
                    <li>
                      <strong>CapCut (Redutor de Ruído IA)</strong>: Remove com 1 clique o barulho de secadores e conversas ao fundo, deixando a voz nítida.
                    </li>
                    <li>
                      <strong>CapCut (Aprimoramento de Imagem IA)</strong>: Aumenta a nitidez HD e realça o brilho e os reflexos dos fios de cabelo.
                    </li>
                    <li>
                      <strong>Opus Clip</strong>: Se você filmou um procedimento longo de 10 min, a IA corta automaticamente em 3 a 5 Reels verticais prontos.
                    </li>
                  </ul>
                </div>

                {/* Pilar 3: A Regra dos 3 Clipes (Gravação no Salão) */}
                <div className="flex flex-col gap-2.5 p-4 rounded-xl bg-surface-container-low border border-outline-variant/10">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-purple-600 text-lg">videocam</span>
                    <strong className="text-on-surface text-sm">3. Regra de Ouro: Grave em 2 Min</strong>
                  </div>
                  <p className="text-[11px]">Grave apenas 3 momentos no celular na vertical <strong>9:16</strong> com Ring Light:</p>
                  <ol className="list-decimal pl-4 space-y-1 text-on-surface-variant text-[11px]">
                    <li><strong>O Antes (2 a 3s)</strong>: Close no cabelo antes do procedimento ou cliente olhando surpresa.</li>
                    <li><strong>O Processo (5 a 8s)</strong>: Aplicação de produto na bancada, lavatório relaxante ou água correndo.</li>
                    <li><strong>A Revelação (5 a 8s)</strong>: Em <em>Câmera Lenta (Slow Motion)</em>, cliente sorrindo e balanço dos fios ao vento.</li>
                  </ol>
                  <div className="p-2 rounded-lg bg-surface border border-outline-variant/20 text-[10px] text-on-surface-variant mt-1">
                    💡 <strong>Dica Pro</strong>: Junte os 3 clipes no CapCut, aplique a legenda IA e suba no Pura Vitrine para agendar com a legenda já pronta!
                  </div>
                </div>
              </div>
            </div>

            {/* SEÇÃO 4: PINTEREST BUSINESS */}
            <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/15 flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant/15">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                    4
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-headline-sm text-headline-sm text-on-surface text-lg font-bold">
                        Pinterest Business (Pins 2:3 &amp; Tráfego Orgânico de Longo Prazo)
                      </h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        100% Gratuito • Não exige chave de API
                      </span>
                    </div>
                    <span className="text-xs text-on-surface-variant">
                      O maior motor de busca visual do mundo para mechas, morena iluminada, noivas e unhas.
                    </span>
                  </div>
                </div>
                <a
                  href="https://www.pinterest.com/business/create/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-all flex items-center gap-1.5 shadow-sm shrink-0"
                >
                  <span>Criar Conta Pinterest Business</span>
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </a>
              </div>

              {/* Comparativo de Impacto */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-rose-600 text-2xl">trending_up</span>
                  <div>
                    <h4 className="text-xs font-bold text-rose-950">Por que o Pinterest é uma Mina de Ouro para o seu Salão?</h4>
                    <p className="text-[11px] text-rose-900 leading-relaxed mt-0.5">
                      No <strong>Instagram</strong>, a vida útil de um post é de <strong>24 a 48 horas</strong>. No <strong>Pinterest</strong>, um Pin vertical bem indexado continua gerando visitas e pedidos no WhatsApp por <strong>6 a 18 meses</strong>, pois ele é indexado nas buscas do próprio Pinterest e do Google Imagens!
                    </p>
                  </div>
                </div>
              </div>

              {/* Passo a Passo Prático */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed text-on-surface-variant">
                {/* Etapa 1 e 2 */}
                <div className="flex flex-col gap-3 p-4 rounded-xl bg-surface-container-low border border-outline-variant/10">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs">1</span>
                    <strong className="text-on-surface text-sm">Criar Conta Comercial Gratuita</strong>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-on-surface-variant">
                    <li>Acesse <strong>pinterest.com/business/create</strong> e cadastre o e-mail do salão.</li>
                    <li>Defina o nome comercial (ex: <em>Studio Beleza &amp; Elegância • Especialista em Mechas</em>).</li>
                    <li>No perfil, adicione sua <strong>cidade e bairro</strong> e coloque o link da bio apontando para o <strong>WhatsApp</strong>.</li>
                  </ul>

                  <div className="flex items-center gap-2 pt-2 border-t border-outline-variant/10">
                    <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs">2</span>
                    <strong className="text-on-surface text-sm">Organizar Pastas Estratégicas</strong>
                  </div>
                  <p className="text-[11px]">Crie pastas temáticas para o algoritmo entender o seu nicho:</p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 rounded-lg bg-surface text-[11px] border border-outline-variant/20 font-medium">📌 Morena Iluminada</span>
                    <span className="px-2 py-0.5 rounded-lg bg-surface text-[11px] border border-outline-variant/20 font-medium">📌 Loiros Saudáveis</span>
                    <span className="px-2 py-0.5 rounded-lg bg-surface text-[11px] border border-outline-variant/20 font-medium">📌 Unhas em Gel &amp; Nail Art</span>
                    <span className="px-2 py-0.5 rounded-lg bg-surface text-[11px] border border-outline-variant/20 font-medium">📌 Noivas &amp; Penteados</span>
                  </div>
                </div>

                {/* Etapa 3 e 4 */}
                <div className="flex flex-col gap-3 p-4 rounded-xl bg-surface-container-low border border-outline-variant/10">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs">3</span>
                    <strong className="text-on-surface text-sm">Gerar Conteúdo no Pura Vitrine</strong>
                  </div>
                  <ul className="list-disc pl-5 space-y-1 text-on-surface-variant">
                    <li>No menu <strong>Inteligência Artificial &rarr; Expansão Multicanal &rarr; Pinterest 2:3</strong>.</li>
                    <li>Digite o procedimento (ex: <em>Morena Iluminada Doce de Leite</em>) e clique em <strong>Gerar</strong>.</li>
                    <li>A IA (Gemini 3.6/3.7) gera o <strong>Título SEO</strong>, a <strong>Descrição com Palavras-Chave</strong>, o <strong>Texto de Sobreposição (Overlay)</strong> e a <strong>Pasta Recomendada</strong>.</li>
                  </ul>

                  <div className="flex items-center gap-2 pt-2 border-t border-outline-variant/10">
                    <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center font-bold text-xs">4</span>
                    <strong className="text-on-surface text-sm">Publicar com o Link de Agendamento</strong>
                  </div>
                  <p className="text-[11px]">
                    Suba a foto na vertical <strong>2:3 (1000 x 1500 px)</strong>, cole os textos gerados e coloque no campo <strong>Link de Destino</strong> o link do WhatsApp:
                  </p>
                  <div className="p-2.5 rounded-lg bg-surface border border-outline-variant/20 font-mono text-[10px] text-primary break-all select-all">
                    https://wa.me/55SEUNUMERO?text=Ola!+Vi+seu+Pin+no+Pinterest+e+quero+agendar
                  </div>
                </div>
              </div>
            </div>

            {/* SEÇÃO 5: GOOGLE MEU NEGÓCIO */}
            <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/15 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant/15">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                    5
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface text-lg font-bold flex items-center gap-2">
                      Google Meu Negócio &amp; Maps (Perfil da Empresa)
                    </h3>
                    <span className="text-xs text-on-surface-variant">
                      Capture clientes com alta intenção de compra imediata que buscam &ldquo;salão de beleza perto de mim&rdquo;.
                    </span>
                  </div>
                </div>
                <a
                  href="https://www.google.com/business/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-all flex items-center gap-1.5 shadow-sm shrink-0"
                >
                  <span>Acessar Google Perfil da Empresa</span>
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed text-on-surface-variant">
                <div className="flex flex-col gap-2.5">
                  <strong className="text-on-surface text-sm">Passos para Validação do Endereço:</strong>
                  <ol className="list-decimal pl-4 space-y-1.5">
                    <li>Acesse <strong>google.com/business</strong> e faça login com a conta Google do salão.</li>
                    <li>Digite o nome do salão e o endereço completo em Campinas (rua, número, bairro como Cambuí ou Barão Geraldo).</li>
                    <li>Selecione a categoria principal como <strong>&ldquo;Salão de Beleza&rdquo;</strong> ou <strong>&ldquo;Cabeleireiro&rdquo;</strong>.</li>
                    <li>Conclua a verificação física solicitada pelo Google (vídeo de demonstração do salão ou código via SMS).</li>
                  </ol>
                </div>

                <div className="flex flex-col gap-2.5">
                  <strong className="text-on-surface text-sm">Estratégia de Ranqueamento no Top 3 (Local Pack):</strong>
                  <ul className="list-disc pl-4 space-y-1 text-on-surface">
                    <li>
                      <strong>Atualizações Semanais:</strong> Utilize a aba <em>Expansão Multicanal &rarr; Google Meu Negócio</em> do Pura Vitrine para publicar 1 post por semana com foto de procedimento e botão de agendamento.
                    </li>
                    <li>
                      <strong>QR Code de Avaliações 5 Estrelas:</strong> No painel do Google, copie o link de avaliação curta e coloque um display com QR Code no caixa e nas bancadas do salão.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* SEÇÃO 6: META BUSINESS SUITE & ADS */}
            <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/15 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-outline-variant/15">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                    6
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface text-lg font-bold flex items-center gap-2">
                      Meta Ads (Instagram &amp; Facebook Patrocinado)
                    </h3>
                    <span className="text-xs text-on-surface-variant">
                      Campanhas de tráfego pago hiperlocal com raio de 3 a 5km ao redor do salão.
                    </span>
                  </div>
                </div>
                <a
                  href="https://adsmanager.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all flex items-center gap-1.5 shadow-sm shrink-0"
                >
                  <span>Abrir Gerenciador de Anúncios</span>
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed text-on-surface-variant">
                <div className="flex flex-col gap-2.5">
                  <strong className="text-on-surface text-sm">Como Preparar a Conta de Anúncios:</strong>
                  <ol className="list-decimal pl-4 space-y-1.5">
                    <li>Garanta que o perfil do Instagram do salão está conectado a uma Página no <strong>business.facebook.com</strong>.</li>
                    <li>No <strong>Gerenciador de Anúncios (Ads Manager)</strong>, cadastre sua forma de pagamento (PIX, Boleto ou Cartão).</li>
                    <li>Crie uma campanha com objetivo de <strong>&ldquo;Engajamento&rdquo;</strong> ou <strong>&ldquo;Tráfego para WhatsApp/Direct&rdquo;</strong>.</li>
                  </ol>
                </div>

                <div className="flex flex-col gap-2.5">
                  <strong className="text-on-surface text-sm">Como Utilizar a IA do Pura Vitrine para Anunciar:</strong>
                  <p>
                    Na aba <strong>Expansão Multicanal &rarr; Meta Ads Local</strong>, informe o procedimento e clique em Gerar:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-on-surface">
                    <li>O sistema gera a <strong>Headline</strong> magnética e o texto completo com copywriting de alta conversão.</li>
                    <li>Fornece a <strong>Segmentação Técnica Exata</strong>: raio recomendado em km, faixa etária feminina e interesses em beleza.</li>
                    <li>Indica a sugestão de orçamento diário (ex: R$ 15 a R$ 25/dia) para lotar a agenda da semana.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* SEÇÃO 7: CHECKLIST DE VARIÁVEIS NA VERCEL */}
            <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/15 flex flex-col gap-4">
              <div className="flex items-center gap-3 pb-3 border-b border-outline-variant/15">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center font-bold text-base shadow-sm">
                  7
                </div>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface text-lg font-bold">
                    Checklist de Variáveis de Ambiente no Vercel (Produção)
                  </h3>
                  <span className="text-xs text-on-surface-variant">
                    Configurações necessárias para que o sistema funcione na nuvem para toda a equipe.
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-outline-variant/20 bg-surface-container-low text-on-surface">
                      <th className="py-2.5 px-3 font-bold">Variável</th>
                      <th className="py-2.5 px-3 font-bold">Obrigatória?</th>
                      <th className="py-2.5 px-3 font-bold">Para que serve</th>
                      <th className="py-2.5 px-3 font-bold">Exemplo / Como Obter</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10 text-on-surface-variant">
                    <tr>
                      <td className="py-2.5 px-3 font-mono font-bold text-primary">GEMINI_API_KEY</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 font-bold text-[10px]">
                          Sim (IA)
                        </span>
                      </td>
                      <td className="py-2.5 px-3">Motor de geração de legendas, roteiros virais e posts multicanais</td>
                      <td className="py-2.5 px-3 font-mono text-[11px]">AIzaSy... (aistudio.google.com)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-mono font-bold text-on-surface">DATABASE_URL</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-800 font-bold text-[10px]">
                          Produção
                        </span>
                      </td>
                      <td className="py-2.5 px-3">Conexão segura com banco de dados PostgreSQL via Prisma ORM</td>
                      <td className="py-2.5 px-3 font-mono text-[11px]">postgresql://user:pass@host:5432/db</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-mono font-bold text-on-surface">NEXTAUTH_SECRET</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-800 font-bold text-[10px]">
                          Produção
                        </span>
                      </td>
                      <td className="py-2.5 px-3">Chave de criptografia de cookies e sessões de login dos usuários</td>
                      <td className="py-2.5 px-3 font-mono text-[11px]">openssl rand -base64 32</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-mono font-bold text-on-surface">NEXTAUTH_URL</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-800 font-bold text-[10px]">
                          Produção
                        </span>
                      </td>
                      <td className="py-2.5 px-3">Domínio oficial onde o sistema está hospedado na Vercel</td>
                      <td className="py-2.5 px-3 font-mono text-[11px]">https://pura-vitrine.vercel.app</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 7: FAQ Interativo */}
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

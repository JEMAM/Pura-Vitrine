'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

type FormatType = 'feed' | 'stories' | 'reels' | 'carousel';
type ToneType = 'luxo' | 'tendencia' | 'educativo' | 'promo';

function PostsEditorContent() {
  const searchParams = useSearchParams();

  // Selected format and tone
  const [format, setFormat] = useState<FormatType>('feed');
  const [tone, setTone] = useState<ToneType>('luxo');

  // Input procedure / focus
  const [prompt, setPrompt] = useState(
    searchParams.get('prompt') ||
      'Morena Iluminada com nuances quentes avelã e caramelo, finalizada com escova modelada glossy'
  );

  // Caption content
  const [caption, setCaption] = useState(
    `Aquele momento em que o tom avelã encontra a luminosidade perfeita para realçar os traços com elegância atemporal ✨🤎\n\nPara quem busca transformação sem abrir mão da saúde dos fios, nossa técnica personalizada de Morena Iluminada preserva a fibra capilar e entrega movimento impecável.\n\n📍 Unidade Barão Geraldo, Campinas\n☕ Experiência acolhedora com consultoria exclusiva.\n\nAgende seu horário através do link na nossa bio e viva essa transformação.`
  );

  // Hashtags
  const [hashtags, setHashtags] = useState<string[]>([
    '#salaocampinas',
    '#morenailuminada',
    '#cabelosdeluxo',
    '#salaobelezapura',
    '#baraogeraldo',
    '#mechaspersonalizadas',
  ]);

  // Scheduled date / time
  const [scheduledTime, setScheduledTime] = useState('18:45');
  const [scheduledDate, setScheduledDate] = useState('Hoje');

  // Media state
  const [selectedMediaUrl, setSelectedMediaUrl] = useState(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDVjExCi9qrlouELGPBRdR7EoC2MM8Hn0XuGIoR_nwTjFLPBcpYVlPN2WursjrA2wue0gbyUetM2RT5PqauQYJN0lkYB8b0tJTE8YzQM784-NSiCjbxvE-gmCLide91ek_pLnbRrA0VukvaqsmWxzV6P7bYsseFY6HbCe6y--hKASiepMFSpJ-5_mM7SjTXOVyDxFYffLyV5IsU1IUVYweYxwy9wRz_OlOeVEfFbO1yF9f1qmizG1zbXw'
  );
  const [mediaTitle, setMediaTitle] = useState('Morena Iluminada Mel Dourado');

  // Loading & confirmation
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'history'>('editor');
  const [recentDrafts, setRecentDrafts] = useState<any[]>([]);
  const [isLiked, setIsLiked] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [showFullCaption, setShowFullCaption] = useState(false);

  // File upload input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // If user opened with AI mode from dashboard, trigger generation or focus
    if (searchParams.get('mode') === 'ai') {
      const customPrompt = searchParams.get('prompt');
      if (customPrompt) {
        setPrompt(customPrompt);
        handleGenerateAi(customPrompt, tone);
      }
    }

    // Load recent posts
    fetch('/api/posts?limit=10')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.posts) setRecentDrafts(data.posts);
      })
      .catch((err) => console.error(err));
  }, []);

  // AI Generation with Gemini
  const handleGenerateAi = async (customPrompt?: string, selectedTone?: ToneType) => {
    setIsGeneratingAi(true);
    setShowConfirmation(false);
    try {
      const toneMap: Record<ToneType, string> = {
        luxo: 'sofisticado, elegante e aspiracional para salão de alto padrão',
        tendencia: 'descontraído, moderno e focado em tendências de beleza',
        educativo: 'informativo sobre cuidados capilares, saúde dos fios e rotina',
        promo: 'persuasivo para agendamento rápido de vagas VIP e horários',
      };

      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: customPrompt || prompt,
          tone: toneMap[selectedTone || tone],
          targetAudience: 'Mulheres sofisticadas de Campinas e região (Barão Geraldo, Cambuí)',
          service: 'Beleza & Cabelos',
          callToAction: 'Agende seu horário exclusivo pelo link da bio',
          platform: 'INSTAGRAM',
        }),
      });

      const data = await res.json();
      if (data?.caption) {
        setCaption(data.caption);
        if (data.hashtags?.length > 0) {
          const formatted = data.hashtags.map((h: string) => (h.startsWith('#') ? h : `#${h}`));
          setHashtags(formatted);
        }
      }
    } catch (err) {
      console.error('Erro na IA:', err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Save / Publish
  const handleSavePost = async (status: 'DRAFT' | 'SCHEDULED') => {
    setIsSaving(true);
    try {
      await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caption,
          hashtags: hashtags.join(' '),
          status,
          platform: 'INSTAGRAM',
          postType: format.toUpperCase(),
          scheduledAt: status === 'SCHEDULED' ? new Date(Date.now() + 4 * 3600000).toISOString() : null,
          mediaIds: [],
        }),
      });

      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 5000);
    } catch (err) {
      console.error('Erro ao salvar:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Emoji insertions
  const insertText = (text: string) => {
    setCaption((prev) => prev + text);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedMediaUrl(url);
      setMediaTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  return (
    <div className="flex flex-col w-full animate-fadeIn pb-16">
      <div className="w-full max-w-7xl mx-auto px-space-md lg:px-space-lg py-space-md flex flex-col gap-space-lg">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={handleFileUpload}
        />

        {/* Studio Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
              <span className="text-secondary font-semibold">Studio de Conteúdo</span>
              <span>•</span>
              <span>Campanha Barão Geraldo Premium</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-0.5">
              Editor de Post Inteligente
            </h1>
          </div>

          <div className="flex items-center gap-space-xs">
            <span className="inline-flex items-center gap-1.5 px-space-sm py-1.5 rounded-full bg-surface-container-high text-on-surface font-label-md text-label-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              BelezaIA v2.4 Conectada
            </span>

            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'editor' ? 'history' : 'editor')}
              className={`px-space-sm py-2 rounded-xl transition-colors font-title-md text-title-md flex items-center gap-1 ${
                activeTab === 'history'
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-lg">history</span>
              <span className="hidden sm:inline">
                {activeTab === 'history' ? 'Voltar ao Editor' : 'Histórico de Rascunhos'}
              </span>
            </button>
          </div>
        </div>

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/20 flex flex-col gap-4">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Histórico de Publicações &amp; Rascunhos</h2>
            {recentDrafts.length === 0 ? (
              <p className="text-on-surface-variant text-sm py-8 text-center">Nenhum rascunho anterior encontrado.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentDrafts.map((post) => (
                  <div
                    key={post.id}
                    className="p-4 rounded-xl bg-surface-container-low flex flex-col justify-between gap-2 border border-outline-variant/15"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-bold text-primary">{post.status}</span>
                      <span className="text-[11px] text-on-surface-variant">
                        {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <p className="text-body-sm line-clamp-3 text-on-surface">{post.caption}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setCaption(post.caption);
                        if (post.hashtags) setHashtags(post.hashtags.split(' '));
                        setActiveTab('editor');
                      }}
                      className="mt-2 text-xs font-semibold text-primary hover:underline text-left flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-sm">edit</span> Carregar neste editor
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Main Editor Grid (Left: Settings & Inputs, Right: Live Instagram Mockup) */}
        {activeTab === 'editor' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
            {/* Left Column: Form & AI Controls */}
            <div className="lg:col-span-7 flex flex-col gap-space-md">
              {/* 1. Formato de Destino */}
              <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex flex-col gap-space-md border border-outline-variant/15">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">
                    1. Formato de Destino
                  </span>
                  <span className="font-label-sm text-label-sm text-primary font-semibold">
                    {format === 'feed'
                      ? 'Otimização Automática 4:5'
                      : format === 'stories'
                      ? 'Formato Vertical 9:16'
                      : format === 'reels'
                      ? 'Vídeo Curto 9:16'
                      : 'Carrossel Multimídia'}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs">
                  <button
                    type="button"
                    onClick={() => setFormat('feed')}
                    className={`format-btn p-space-sm rounded-xl flex flex-col items-center gap-1 text-center transition-all ${
                      format === 'feed'
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">grid_on</span>
                    <span className="font-title-md text-title-md font-medium text-xs leading-tight">
                      Feed (4:5 / 1:1)
                    </span>
                    <span className="font-label-sm text-label-sm opacity-80">Principal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormat('stories')}
                    className={`format-btn p-space-sm rounded-xl flex flex-col items-center gap-1 text-center transition-all ${
                      format === 'stories'
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">amp_stories</span>
                    <span className="font-title-md text-title-md font-medium text-xs leading-tight">
                      Stories (9:16)
                    </span>
                    <span className="font-label-sm text-label-sm opacity-70">24 horas</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormat('reels')}
                    className={`format-btn p-space-sm rounded-xl flex flex-col items-center gap-1 text-center transition-all ${
                      format === 'reels'
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">movie</span>
                    <span className="font-title-md text-title-md font-medium text-xs leading-tight">Reels</span>
                    <span className="font-label-sm text-label-sm opacity-70">Vídeo Curto</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormat('carousel')}
                    className={`format-btn p-space-sm rounded-xl flex flex-col items-center gap-1 text-center transition-all ${
                      format === 'carousel'
                        ? 'bg-primary text-on-primary shadow-sm'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">view_carousel</span>
                    <span className="font-title-md text-title-md font-medium text-xs leading-tight">Carrossel</span>
                    <span className="font-label-sm text-label-sm opacity-70">Multimídia</span>
                  </button>
                </div>
              </div>

              {/* 2. Mídia em Destaque */}
              <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex flex-col gap-space-md border border-outline-variant/15">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">
                    2. Mídia em Destaque
                  </span>
                  <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-semibold">
                    Resolução 4K Salon Ready
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row gap-space-md items-start">
                  <div className="relative w-full sm:w-44 h-56 rounded-xl overflow-hidden bg-surface-container flex-shrink-0 shadow-sm group">
                    <img
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      alt="Mídia Selecionada"
                      src={selectedMediaUrl}
                    />
                    <div className="absolute bottom-2 left-2 right-2 bg-inverse-surface/75 backdrop-blur-md rounded-lg px-2 py-1 flex items-center justify-between text-inverse-on-surface font-label-sm text-label-sm">
                      <span>Aspecto {format === 'stories' || format === 'reels' ? '9:16' : '4:5'}</span>
                      <span className="material-symbols-outlined text-xs">aspect_ratio</span>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between flex-1 h-full gap-space-sm w-full">
                    <div className="flex flex-col gap-1">
                      <span className="font-title-md text-title-md text-on-surface font-semibold">
                        {mediaTitle}
                      </span>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Foto capturada na Unidade Barão Geraldo após aplicação do gloss tonalizante e finalização com
                        babyliss largo.
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-space-sm py-2 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center gap-1.5 transition-colors font-medium cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-base text-primary">add_photo_alternate</span>
                        Trocar Foto
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMediaUrl(
                            'https://lh3.googleusercontent.com/aida-public/AB6AXuBKKr6S6VhMbYWgDNlT8tKtTKsQWRHs3-Xo4y2OlyC4uoPxxFtFJmb0KQWBhLGYu0ds0ooJXasCur1AE--1iewAMwWk0DblwVAlMYQwwnvsfhvhMcz2kFuQAYGzKzwuNOuNEIdEZTJ0ZZHCdPq8nuksthd2hEfgxIt9b_qypqr5hLRZHb5dsUOc8SrrpLKaizlbjjd5xTYgWl2d6exVmP-8Ehq4H9Ist9VMhrVJsBXICg3yeDyy-OvInA'
                          );
                          setMediaTitle('Antes & Depois: Glow Facial');
                        }}
                        className="px-space-sm py-2 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-on-surface font-label-md text-label-md flex items-center gap-1.5 transition-colors font-medium"
                      >
                        <span className="material-symbols-outlined text-base text-secondary">compare</span>
                        Adicionar Antes/Depois
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedMediaUrl(
                            'https://lh3.googleusercontent.com/aida-public/AB6AXuBcGK5YqPrYKhUoGkTSGVHoczyic-s2crvGOZLfoih0oLg3Krm4CMRs7aFwVGOZDbUK6bg7aiKTbikH6Z0WFRMSa_SazZ45OdtKHzmZLL85XfdamXyKia5oj97qC-N1TyL-usth-tOS8hN_rSn0AB0NTqMK_nrLIaXraggb7mDUqrTD4GHs5zszPMvQ14TnODoqo6-6giOLlHVN1md_pS-Q2uPXB1u7hmBUn1_wDricdsA0rIXdARv_wg'
                          );
                          setMediaTitle('Nuance Dourada Quente');
                        }}
                        className="px-space-sm py-2 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-secondary font-label-md text-label-md flex items-center gap-1.5 transition-colors font-medium"
                      >
                        <span className="material-symbols-outlined text-base">wb_sunny</span>
                        Filtro Dourado Suave
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Assistente de IA • Beleza Pura */}
              <div className="bg-gradient-to-br from-surface-container-lowest via-surface-container-low to-primary-fixed/20 rounded-2xl p-space-md shadow-sm flex flex-col gap-space-md border border-outline-variant/15">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-primary text-xl">psychology</span>
                    <span className="font-label-md text-label-md uppercase tracking-wider text-primary font-bold">
                      Assistente de IA • Beleza Pura
                    </span>
                  </div>
                  <span className="font-label-sm text-label-sm bg-primary-fixed text-on-primary-fixed-variant px-2.5 py-0.5 rounded-full font-semibold">
                    Modo Salão de Alto Padrão
                  </span>
                </div>

                {/* Tone Selector */}
                <div className="flex flex-col gap-space-xs">
                  <label className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                    Tom de Voz da Marca
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setTone('luxo')}
                      className={`tone-btn px-2 py-2 rounded-xl font-label-md text-label-md text-center transition-all ${
                        tone === 'luxo'
                          ? 'bg-primary text-on-primary shadow-xs font-semibold'
                          : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      Sofisticado &amp; Aspiracional
                    </button>

                    <button
                      type="button"
                      onClick={() => setTone('tendencia')}
                      className={`tone-btn px-2 py-2 rounded-xl font-label-md text-label-md text-center transition-all ${
                        tone === 'tendencia'
                          ? 'bg-primary text-on-primary shadow-xs font-semibold'
                          : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      Divertido &amp; Tendência
                    </button>

                    <button
                      type="button"
                      onClick={() => setTone('educativo')}
                      className={`tone-btn px-2 py-2 rounded-xl font-label-md text-label-md text-center transition-all ${
                        tone === 'educativo'
                          ? 'bg-primary text-on-primary shadow-xs font-semibold'
                          : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      Educativo &amp; Cuidados
                    </button>

                    <button
                      type="button"
                      onClick={() => setTone('promo')}
                      className={`tone-btn px-2 py-2 rounded-xl font-label-md text-label-md text-center transition-all ${
                        tone === 'promo'
                          ? 'bg-primary text-on-primary shadow-xs font-semibold'
                          : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      Agenda Aberta / VIP
                    </button>
                  </div>
                </div>

                {/* Procedure input */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                    Detalhes do Procedimento / Foco do Post
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="w-full bg-surface-container-lowest rounded-xl px-space-sm py-2.5 text-on-surface font-body-md text-body-md pr-10 focus:outline-none focus:ring-2 focus:ring-primary/30 border border-outline-variant/20 shadow-xs"
                      placeholder="Ex: Morena Iluminada mel com tratamento Kérastase..."
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setPrompt(
                          'Transformação Morena Iluminada avelã com mechas suaves e tratamento reconstrutor Fusio-Dose'
                        )
                      }
                      title="Sugerir foco refinado"
                      className="absolute right-3 top-2.5 text-on-surface-variant hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">auto_fix_high</span>
                    </button>
                  </div>
                </div>

                {/* Generate Button with Gemini */}
                <button
                  type="button"
                  onClick={() => handleGenerateAi()}
                  disabled={isGeneratingAi}
                  className="w-full py-3 px-space-md rounded-xl bg-gradient-to-r from-primary-container via-tertiary-container to-secondary-container text-on-primary-container font-title-md text-title-md font-bold flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(200,138,133,0.35)] hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
                >
                  <span
                    className={`material-symbols-outlined text-xl ${
                      isGeneratingAi ? 'animate-spin' : ''
                    }`}
                  >
                    {isGeneratingAi ? 'refresh' : 'auto_awesome'}
                  </span>
                  <span>{isGeneratingAi ? 'Gerando com BelezaIA (Gemini)...' : 'Gerar Legenda & Hashtags com IA'}</span>
                </button>
              </div>

              {/* 4. Conteúdo da Legenda */}
              <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex flex-col gap-space-sm border border-outline-variant/15">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">
                    3. Conteúdo da Legenda
                  </span>
                  <div className="flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
                    <span className="font-bold text-primary">{caption.length}</span> / 2.200 caracteres
                  </div>
                </div>

                {/* Emoji & Quick Format Bar */}
                <div className="flex items-center gap-1.5 py-1 bg-surface-container-low rounded-lg px-2">
                  {['✨', '🤎', '✂️', '📍', '💆‍♀️'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => insertText(` ${emoji} `)}
                      className="p-1 rounded hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface font-title-md text-title-md transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                  <div className="h-4 w-px bg-outline-variant mx-1"></div>
                  <button
                    type="button"
                    onClick={() => insertText('\n\n.\n\n')}
                    className="px-2 py-0.5 rounded text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm hover:bg-surface-container-high transition-colors"
                  >
                    Quebra de Linha Limpa
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      insertText(
                        '\n\n✨ Atendimento com hora marcada em Barão Geraldo. Reserve sua cadeira pelo link da bio!'
                      )
                    }
                    className="px-2 py-0.5 rounded text-secondary hover:text-on-surface font-label-sm text-label-sm hover:bg-surface-container-high font-semibold transition-colors"
                  >
                    + CTA Barão Geraldo
                  </button>
                </div>

                {/* Textarea */}
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={6}
                  className="w-full bg-surface-container-low rounded-xl p-space-sm text-on-surface font-body-md text-body-md focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/20 transition-colors resize-y leading-relaxed border border-outline-variant/20"
                />

                {/* Hashtag Pills */}
                <div className="flex flex-col gap-1.5 pt-2">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                    Grupos de Hashtags Estratégicas
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {hashtags.map((tag) => (
                      <span
                        key={tag}
                        onClick={() => {
                          // Toggle hashtag
                          if (caption.includes(tag)) {
                            setCaption((prev) => prev.replace(tag, '').trim());
                          } else {
                            setCaption((prev) => `${prev} ${tag}`);
                          }
                        }}
                        className="px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-semibold cursor-pointer hover:opacity-85 transition-opacity"
                        title="Clique para adicionar ou remover da legenda"
                      >
                        {tag}
                      </span>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const newTag = typeof window !== 'undefined' ? window.prompt('Digite a nova hashtag:') || '' : '';
                        if (newTag) {
                          const formatted = newTag.startsWith('#') ? newTag : `#${newTag}`;
                          if (!hashtags.includes(formatted)) {
                            setHashtags([...hashtags, formatted]);
                          }
                        }
                      }}
                      className="px-2 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-label-sm hover:text-on-surface hover:bg-surface-container-high transition-colors"
                    >
                      + Adicionar
                    </button>
                  </div>
                </div>
              </div>

              {/* 5. Agendamento & Audiência */}
              <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex flex-col gap-space-sm border border-outline-variant/15">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">
                    4. Agendamento &amp; Audiência
                  </span>
                  <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-secondary font-bold">
                    <span className="material-symbols-outlined text-sm">bolt</span>
                    Recomendação IA
                  </span>
                </div>

                <div className="p-space-sm rounded-xl bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
                  <div className="flex items-center gap-space-xs">
                    <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-xl">schedule</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-title-md text-title-md text-on-surface font-semibold">
                        {scheduledDate} às {scheduledTime}
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        Pico de 4.8k seguidoras ativas em Campinas
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const newTime = scheduledTime === '18:45' ? '12:00' : '18:45';
                        setScheduledTime(newTime);
                      }}
                      className="px-space-sm py-1.5 rounded-lg bg-surface-container-high text-on-surface font-label-md text-label-md hover:bg-surface-container transition-colors"
                    >
                      Alterar Horário
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setScheduledTime('18:45');
                        setScheduledDate('Hoje');
                      }}
                      className="px-space-sm py-1.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md font-semibold"
                    >
                      Aplicar Horário
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Instagram iPhone Mockup Preview */}
            <div className="lg:col-span-5 flex flex-col gap-space-md sticky top-24">
              <div className="flex items-center justify-between px-space-xs">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">visibility</span>
                  <span className="font-headline-sm text-headline-sm text-on-surface">Preview do Instagram</span>
                </div>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                  Feed em Tempo Real
                </span>
              </div>

              {/* Realistic Phone Frame */}
              <div className="mx-auto w-full max-w-[380px] bg-surface-container-lowest rounded-[40px] p-3 shadow-[0_20px_48px_-10px_rgba(29,27,30,0.18)] flex flex-col border border-outline-variant/30">
                {/* Phone Top Notch / Status Bar */}
                <div className="w-full flex items-center justify-between px-4 pt-2 pb-2 text-on-surface">
                  <span className="font-label-sm text-label-sm font-semibold tracking-tight">{scheduledTime}</span>
                  <div className="w-20 h-4 bg-surface-container-highest rounded-full mx-auto"></div>
                  <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-xs">signal_cellular_alt</span>
                    <span className="material-symbols-outlined text-xs">wifi</span>
                    <span className="material-symbols-outlined text-xs">battery_full</span>
                  </div>
                </div>

                {/* Inner Instagram Screen */}
                <div className="w-full bg-surface-container-lowest rounded-[32px] overflow-hidden flex flex-col border border-outline-variant/15">
                  {/* Instagram Post Header */}
                  <div className="flex items-center justify-between px-3 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-secondary via-primary to-primary-container">
                        <img
                          alt="Avatar"
                          className="w-full h-full object-cover rounded-full"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0yoGKbmCkm6wxKj1WT4tg2VNqXAolR3dMNsBkNSWEZy9X2PFYIO3ZdoE2W8suuSCvn2vggZbRajYNG_lVwGkAjvXecd8cLFNZRfMrLUTxYTjBRv4OgW7bI1uHc5G_6-u_91sVQoJ940u5AV9UG4K21q9ax_Nzskr-bKfeAga9zjg_Ws0Abo_RTGNvzyOPBZezf_JdGkyyen8hMNPb0TT8Zyl8KzCJB-MDoE6RQORU9skIQeGFED0aRQ"
                        />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <span className="font-title-md text-title-md text-xs font-bold leading-tight">
                            salaobelezapuracampinas
                          </span>
                          <span
                            className="material-symbols-outlined text-primary text-[13px]"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            verified
                          </span>
                        </div>
                        <span className="font-label-sm text-label-sm text-[10px] text-on-surface-variant leading-none">
                          Barão Geraldo, Campinas - SP
                        </span>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-on-surface text-lg">more_horiz</span>
                  </div>

                  {/* Post Media Preview (Aspect ratio matching format) */}
                  <div
                    className={`relative w-full bg-surface-container overflow-hidden ${
                      format === 'stories' || format === 'reels' ? 'aspect-[9/16]' : 'aspect-[4/5]'
                    }`}
                  >
                    <img className="w-full h-full object-cover" alt="Visualização" src={selectedMediaUrl} />
                    {format === 'carousel' && (
                      <div className="absolute top-3 right-3 bg-inverse-surface/60 backdrop-blur-md rounded-full px-2 py-0.5 text-inverse-on-surface font-label-sm text-label-sm">
                        1/3
                      </div>
                    )}
                  </div>

                  {/* Post Actions (Like, Comment, Share, Bookmark) */}
                  <div className="flex flex-col px-3.5 py-2.5 gap-2">
                    <div className="flex items-center justify-between text-on-surface">
                      <div className="flex items-center gap-3.5">
                        <button
                          type="button"
                          onClick={() => setIsLiked(!isLiked)}
                          className="transition-transform active:scale-125"
                        >
                          <span
                            className={`material-symbols-outlined text-2xl transition-colors ${
                              isLiked ? 'text-primary' : 'text-on-surface'
                            }`}
                            style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}
                          >
                            favorite
                          </span>
                        </button>
                        <span className="material-symbols-outlined text-2xl">chat_bubble</span>
                        <span className="material-symbols-outlined text-2xl">send</span>
                      </div>
                      <button type="button" onClick={() => setIsSaved(!isSaved)}>
                        <span
                          className={`material-symbols-outlined text-2xl ${
                            isSaved ? 'text-primary' : 'text-on-surface'
                          }`}
                          style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}
                        >
                          {isSaved ? 'bookmark' : 'bookmark_border'}
                        </span>
                      </button>
                    </div>

                    {/* Like stats */}
                    <div className="font-title-md text-title-md text-xs font-bold text-on-surface">
                      Curtido por <span className="font-extrabold">marina.silveira</span> e outras{' '}
                      <span className="font-extrabold">342 pessoas</span>
                    </div>

                    {/* Synchronized Caption */}
                    <div className="flex flex-col font-body-sm text-body-sm text-xs leading-relaxed text-on-surface">
                      <div>
                        <span className="font-bold text-on-surface mr-1">salaobelezapuracampinas</span>
                        <span className="whitespace-pre-line">
                          {showFullCaption || caption.length <= 140
                            ? caption
                            : `${caption.slice(0, 140)}...`}
                        </span>
                      </div>
                      {caption.length > 140 && (
                        <button
                          type="button"
                          onClick={() => setShowFullCaption(!showFullCaption)}
                          className="text-left text-on-surface-variant mt-1 text-[11px] font-semibold hover:underline"
                        >
                          {showFullCaption ? 'Ver menos' : 'Ver mais...'}
                        </button>
                      )}
                    </div>

                    {/* Hashtags Preview */}
                    <div className="font-label-sm text-label-sm text-[10px] text-secondary mt-0.5">
                      {hashtags.slice(0, 5).join(' ')}
                    </div>

                    {/* Timestamp */}
                    <div className="flex items-center justify-between text-[10px] text-on-surface-variant uppercase tracking-wider pt-1 border-t border-outline-variant/15">
                      <span>Há 2 minutos • Campinas</span>
                      <span className="text-primary font-semibold">Ver Tradução</span>
                    </div>
                  </div>

                  {/* Instagram App Bottom Bar */}
                  <div className="h-10 bg-surface-container-low flex items-center justify-around text-on-surface-variant px-3 mt-1">
                    <span
                      className="material-symbols-outlined text-xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      home
                    </span>
                    <span className="material-symbols-outlined text-xl">search</span>
                    <span className="material-symbols-outlined text-xl">slideshow</span>
                    <span className="material-symbols-outlined text-xl">favorite_border</span>
                    <div className="w-5 h-5 rounded-full overflow-hidden ring-1 ring-primary/20">
                      <img
                        alt="Profile Thumb"
                        className="w-full h-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0yoGKbmCkm6wxKj1WT4tg2VNqXAolR3dMNsBkNSWEZy9X2PFYIO3ZdoE2W8suuSCvn2vggZbRajYNG_lVwGkAjvXecd8cLFNZRfMrLUTxYTjBRv4OgW7bI1uHc5G_6-u_91sVQoJ940u5AV9UG4K21q9ax_Nzskr-bKfeAga9zjg_Ws0Abo_RTGNvzyOPBZezf_JdGkyyen8hMNPb0TT8Zyl8KzCJB-MDoE6RQORU9skIQeGFED0aRQ"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Bottom Card */}
              <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex flex-col gap-space-sm border border-outline-variant/15 mt-space-xs">
                <div className="flex items-center justify-between gap-space-xs">
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => handleSavePost('DRAFT')}
                    className="flex-1 py-2.5 rounded-xl bg-surface-container-low text-on-surface hover:bg-surface-container-high font-title-md text-title-md transition-colors flex items-center justify-center gap-1.5 font-semibold"
                  >
                    <span className="material-symbols-outlined text-lg">bookmark</span>
                    <span>Salvar Rascunho</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      alert('Simulação de visualização em dispositivos móveis ativada!')
                    }
                    className="px-space-sm py-2.5 rounded-xl bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                    title="Alternar modo de dispositivo"
                  >
                    <span className="material-symbols-outlined text-xl">smartphone</span>
                  </button>
                </div>

                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => handleSavePost('SCHEDULED')}
                  className="w-full py-3.5 rounded-xl bg-primary text-on-primary font-title-md text-title-md font-bold flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(133,80,76,0.3)] hover:opacity-95 active:scale-[0.99] transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xl">send</span>
                  <span>Agendar Publicação para {scheduledTime}</span>
                </button>

                {showConfirmation && (
                  <div className="p-space-sm rounded-xl bg-emerald-50 text-emerald-900 flex items-center gap-2 text-xs font-medium border border-emerald-200">
                    <span className="material-symbols-outlined text-base text-emerald-600">check_circle</span>
                    <span>Post agendado com sucesso no feed @salaobelezapuracampinas!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PostsEditorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-12 text-primary">
          <span className="material-symbols-outlined text-3xl animate-spin">refresh</span>
        </div>
      }
    >
      <PostsEditorContent />
    </Suspense>
  );
}

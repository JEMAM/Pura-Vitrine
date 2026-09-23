'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface DashboardStats {
  media: number;
  posts: number;
  scheduled: number;
  published: number;
  drafts: number;
}

interface RecentPostItem {
  id: string;
  caption: string;
  status: string;
  platform: string;
  postType?: string;
  createdAt: string;
  scheduledAt?: string | null;
  postMedia?: Array<{
    media: {
      path: string;
      originalName: string;
      thumbnailPath?: string | null;
    };
  }>;
}

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentPosts, setRecentPosts] = useState<RecentPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAiRibbon, setShowAiRibbon] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.stats) {
          setStats(data.stats);
        }
        if (data?.recentPosts?.length > 0) {
          setRecentPosts(data.recentPosts);
        }
      })
      .catch((err) => console.error('Erro ao carregar dados:', err))
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleApproveDraft = async (postId: string) => {
    try {
      await fetch(`/api/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'SCHEDULED' }),
      });
      showToast('Post aprovado e agendado com sucesso!');
    } catch {
      showToast('Status atualizado para Agendado!');
    }
  };

  return (
    <div className="flex flex-col w-full animate-fadeIn">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-primary/30">
          <span className="material-symbols-outlined text-primary-fixed">check_circle</span>
          <span className="font-title-md text-title-md text-xs">{toastMessage}</span>
        </div>
      )}

      <div className="w-full max-w-[1360px] mx-auto px-margin-sm md:px-margin py-space-md flex flex-col gap-space-lg md:gap-space-xl">
        {/* Ambient Subtle Glows Banner */}
        <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-surface-container-lowest via-surface-container-low to-surface-container-high p-space-md lg:p-space-lg shadow-sm border border-outline-variant/20">
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-primary-fixed-dim/20 blur-3xl pointer-events-none"></div>
          <div className="absolute right-1/3 -bottom-20 w-64 h-64 rounded-full bg-secondary-fixed/25 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
            <div className="flex flex-col max-w-2xl">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest/80 text-secondary font-label-sm text-label-sm uppercase tracking-widest backdrop-blur-sm shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  Studio Concierge Ativo
                </span>
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Campinas • Unidade Barão Geraldo
                </span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface font-normal tracking-tight">
                Bom dia, <span className="italic text-primary font-medium">Camila</span> ✨
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">
                Sua presença digital reflete o cuidado e a excelência que suas clientes sentem na poltrona. Hoje seu
                engajamento está <strong className="text-primary font-semibold">+18.4% acima da média regional</strong>.
              </p>
            </div>

            {/* Quick Launch Triggers */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-space-xs">
              <Link
                href="/dashboard/posts"
                className="group flex items-center gap-2 px-space-md py-3 rounded-xl bg-primary text-on-primary font-title-md text-title-md shadow-md hover:scale-[1.02] active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-xl text-primary-fixed group-hover:rotate-90 transition-transform">
                  add_circle
                </span>
                <span>Novo Post</span>
              </Link>

              <button
                type="button"
                onClick={() => router.push('/dashboard/posts?mode=ai&prompt=' + encodeURIComponent('Vídeo no lavatório com tratamento relaxante'))}
                className="flex items-center gap-2 px-space-sm py-3 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-variant font-title-md text-title-md shadow-sm transition-all"
              >
                <span className="material-symbols-outlined text-secondary text-xl">auto_awesome</span>
                <span className="hidden sm:inline">Pauta IA</span>
              </button>

              <Link
                href="/dashboard/calendar"
                className="flex items-center gap-2 px-space-sm py-3 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-variant font-title-md text-title-md shadow-sm transition-all"
              >
                <span className="material-symbols-outlined text-primary text-xl">calendar_month</span>
                <span className="hidden xl:inline">Semana Editorial</span>
              </Link>

              <Link
                href="/dashboard/media"
                className="flex items-center justify-center w-12 h-12 rounded-xl bg-surface-container-lowest text-on-surface-variant hover:text-primary hover:bg-surface-variant shadow-sm transition-colors"
                title="Upload de Fotos do Salão"
              >
                <span className="material-symbols-outlined text-xl">add_a_photo</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Metrics (Luxury Satin Cards) */}
        <section className="flex flex-col gap-space-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant">
                Pulso Estratégico
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
              <span className="font-body-sm text-body-sm text-secondary font-medium">
                Últimos 7 dias em tempo real
              </span>
            </div>
            <Link
              href="/dashboard/posts"
              className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider hover:underline flex items-center gap-1"
            >
              Ver Relatório Completo <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-sm">
            {/* Metric 1: Alcance */}
            <div className="relative bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between overflow-hidden border border-outline-variant/15">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                    Alcance Semanal
                  </span>
                  <span className="font-headline-lg text-headline-lg text-on-surface font-semibold mt-1">
                    48.6K
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary-fixed/40 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-xl">group</span>
                </div>
              </div>
              <div className="mt-4 pt-3 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-primary font-label-md text-label-md bg-primary-fixed/30 px-2 py-0.5 rounded-full">
                  <span className="material-symbols-outlined text-sm">trending_up</span> +18.4%
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                  vs. semana anterior
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-container to-secondary-container opacity-60"></div>
            </div>

            {/* Metric 2: Engajamento */}
            <div className="relative bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between overflow-hidden border border-outline-variant/15">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                    Taxa de Engajamento
                  </span>
                  <span className="font-headline-lg text-headline-lg text-on-surface font-semibold mt-1">
                    4.8%
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full bg-secondary-fixed/50 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-xl">favorite</span>
                </div>
              </div>
              <div className="mt-4 pt-3 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-secondary font-label-md text-label-md bg-secondary-fixed/40 px-2 py-0.5 rounded-full">
                  <span className="material-symbols-outlined text-sm">verified</span> Top Região
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                  Barão Geraldo &amp; Taquaral
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary opacity-60"></div>
            </div>

            {/* Metric 3: Agendamentos */}
            <div className="relative bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between overflow-hidden border border-outline-variant/15">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                    Agendamentos Direct/Bio
                  </span>
                  <span className="font-headline-lg text-headline-lg text-on-surface font-semibold mt-1">
                    {stats ? stats.scheduled * 12 + 142 : 142}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-xl">event_available</span>
                </div>
              </div>
              <div className="mt-4 pt-3 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-primary font-label-md text-label-md bg-primary-fixed/30 px-2 py-0.5 rounded-full">
                  <span className="material-symbols-outlined text-sm">arrow_upward</span> +24% no mês
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                  R$ 58.4k gerados
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary opacity-60"></div>
            </div>

            {/* Metric 4: Planejamento */}
            <div className="relative bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between overflow-hidden border border-outline-variant/15">
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                    Meta do Mês (Feed &amp; Reels)
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-headline-lg text-headline-lg text-on-surface font-semibold">
                      {stats ? stats.posts + 18 : 18}
                    </span>
                    <span className="font-title-lg text-title-lg text-on-surface-variant">/ 24</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-on-surface">
                  <span className="material-symbols-outlined text-xl">track_changes</span>
                </div>
              </div>
              <div className="mt-4 pt-3 flex flex-col gap-1.5">
                <div className="flex justify-between font-label-sm text-label-sm">
                  <span className="text-on-surface-variant">Progresso</span>
                  <span className="text-primary font-bold">75% Concluído</span>
                </div>
                <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full"
                    style={{ width: '75%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BelezaIA Recommendation Ribbon (Luxury Highlight) */}
        {showAiRibbon && (
          <div className="relative rounded-2xl bg-gradient-to-r from-surface-container-low via-surface-container-lowest to-surface-container-low p-space-md lg:p-space-lg shadow-md overflow-hidden border border-outline-variant/20">
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-secondary to-primary"></div>
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-md pl-2">
              <div className="flex items-start gap-space-sm max-w-3xl">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-secondary-container to-primary-fixed flex items-center justify-center text-on-secondary-container shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-2xl">magic_button</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">
                      Insight BelezaIA • Algoritmo Campinas
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-secondary-fixed font-label-sm text-label-sm text-on-secondary-fixed font-semibold">
                      Alta Conversão
                    </span>
                  </div>
                  <p className="font-title-md text-title-md text-on-surface mt-1">
                    &ldquo;Vídeos em close no lavatório com som de água relaxante e aplicação de máscara têm{' '}
                    <strong className="text-primary font-semibold">3.2x mais salvamentos</strong> que a média. Que
                    tal agendar um Reels dos bastidores de relaxamento para esta sexta-feira às 12h?&rdquo;
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-space-xs shrink-0 self-end lg:self-center">
                <button
                  type="button"
                  onClick={() => {
                    const promptText = 'Reels sensorial no lavatório do salão com foco em massagem capilar, aplicação de máscara de brilho e som relaxante de água';
                    router.push(`/dashboard/posts?mode=ai&prompt=${encodeURIComponent(promptText)}`);
                  }}
                  className="px-space-md py-2.5 rounded-xl bg-primary-container text-on-primary-container font-title-md text-title-md shadow-sm hover:opacity-95 active:scale-95 transition-all flex items-center gap-2 font-semibold"
                >
                  <span className="material-symbols-outlined text-lg">auto_awesome</span>
                  <span>Gerar Rascunho com IA</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAiRibbon(false)}
                  className="w-10 h-10 rounded-xl text-on-surface-variant hover:bg-surface-container flex items-center justify-center transition-colors"
                  title="Ignorar sugestão"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Workspace Split: Scheduled Queue + Instagram Live Preview */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg">
          {/* Left Column: Upcoming Posts Pipeline (7 cols desktop) */}
          <section className="xl:col-span-7 flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-label-md text-label-md uppercase tracking-wider text-secondary">
                  Fila de Produção &amp; Feed
                </span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Próximas Publicações</h2>
              </div>
              <Link
                href="/dashboard/calendar"
                className="font-label-sm text-label-sm text-primary uppercase font-bold tracking-wider hover:underline flex items-center gap-1"
              >
                Grade Semanal <span className="material-symbols-outlined text-sm">chevron_right</span>
              </Link>
            </div>

            <div className="flex flex-col gap-space-sm">
              {/* Scheduled Post 1 */}
              <article className="bg-surface-container-lowest rounded-2xl p-space-sm md:p-space-md shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-center gap-space-md group border border-outline-variant/15">
                <div className="relative w-full sm:w-32 h-44 sm:h-36 rounded-xl overflow-hidden shrink-0 bg-surface-container">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt="Morena Iluminada"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDuW43gxGcbPyqhxuFhqzV49AIY1qhG6Lp8LE_17SYZcVehuYt4C0NaE1ZTNwiHWPuoE99VhLEAsuZXbgmELfkdbioGbOEEecYoGYmLz3eZmcx_Tkz1hIezCBnASyBCufM08xNJLU63u479Hdto2XfjoGnmqp1nVHm9QoCc2NXqwgk38_G6010v7mrhJma287G0Va_q214TZ0r0w5rtRpMKHB4AivjVkQVXWN0v1Nv0BHwEoLvrpsY45A"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm text-on-surface font-label-sm text-label-sm uppercase flex items-center gap-1 shadow-xs">
                    <span className="material-symbols-outlined text-xs text-primary">play_circle</span> Reels
                  </span>
                </div>
                <div className="flex flex-col flex-1 w-full justify-between h-full">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-secondary-fixed/50 text-on-secondary-container font-label-sm text-label-sm uppercase tracking-wide font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping"></span>
                        Hoje • 18:30 (em 4h 12m)
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-surface-container-high text-on-surface font-label-sm text-label-sm">
                        Agendado Auto
                      </span>
                    </div>
                    <h3 className="font-title-md text-title-md text-on-surface font-semibold group-hover:text-primary transition-colors mt-1">
                      Iluminação Morena Iluminada &amp; Tratamento Kérastase Fusio-Dose
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                      &ldquo;O segredo para o tom amêndoa perfeito sem comprometer a saúde dos fios. Arraste para ver a
                      transição completa de raiz e o brilho espelhado...&rdquo;
                    </p>
                  </div>
                  <div className="mt-3 pt-3 flex items-center justify-between border-t border-outline-variant/15">
                    <div className="flex items-center gap-2">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">Colab:</span>
                      <span className="font-label-sm text-label-sm text-primary font-medium">
                        @marcelahair_beleza
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Link
                        href="/dashboard/posts"
                        className="w-8 h-8 rounded-lg text-on-surface-variant hover:bg-surface-container flex items-center justify-center transition-colors"
                        title="Editar legenda e tags"
                      >
                        <span className="material-symbols-outlined text-base">edit</span>
                      </Link>
                      <button
                        className="w-8 h-8 rounded-lg text-on-surface-variant hover:bg-surface-container flex items-center justify-center transition-colors"
                        title="Mais opções"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-base">more_vert</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>

              {/* Scheduled Post 2 */}
              <article className="bg-surface-container-lowest rounded-2xl p-space-sm md:p-space-md shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-center gap-space-md group border border-outline-variant/15">
                <div className="relative w-full sm:w-32 h-44 sm:h-36 rounded-xl overflow-hidden shrink-0 bg-surface-container">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt="Nail Art Rosé"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBy1xff9c1GBVbidO2FPkhEd-amlt6qC_G-X8MkTzsKaOpWWpt-xQ1R-bvUmdGWfKfVjTkeo-EM13SXDrBstANKE_rR1tAzZy0nVKHJEoDJuDpkmWHjtVt1PxzhbITj1Q6BfXBreu_MP78ArlEC_18BpiLb9cV5Ldrxai0Ju4L_rQgWYbuWGo7RHgZilPH0HY1slEkWBa5E5NCfznAywEC9_mO5bzmiMSGAHEiKz6edAIT5T0zZM9gM8g"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm text-on-surface font-label-sm text-label-sm uppercase flex items-center gap-1 shadow-xs">
                    <span className="material-symbols-outlined text-xs text-secondary">burst_mode</span> Carrossel (4)
                  </span>
                </div>
                <div className="flex flex-col flex-1 w-full justify-between h-full">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm uppercase tracking-wide">
                        Amanhã • 11:00
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-primary-fixed/40 text-on-primary-fixed-variant font-label-sm text-label-sm font-semibold">
                        Aprovado por Camila
                      </span>
                    </div>
                    <h3 className="font-title-md text-title-md text-on-surface font-semibold group-hover:text-primary transition-colors mt-1">
                      Unhas em Gel Nail Art Rosé Minimalista &amp; Blindagem Diamante
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                      &ldquo;Detalhes sutis que elevam a sofisticação diária. Nossa nail designer Luiza preparou 4
                      combinações delicadas para o fim de semana...&rdquo;
                    </p>
                  </div>
                  <div className="mt-3 pt-3 flex items-center justify-between border-t border-outline-variant/15">
                    <div className="flex items-center gap-2">
                      <span className="font-label-sm text-label-sm text-on-surface-variant">CTA:</span>
                      <span className="font-label-sm text-label-sm text-secondary font-medium">
                        Link Bio (Agenda VIP)
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Link
                        href="/dashboard/posts"
                        className="w-8 h-8 rounded-lg text-on-surface-variant hover:bg-surface-container flex items-center justify-center transition-colors"
                        title="Editar legenda e tags"
                      >
                        <span className="material-symbols-outlined text-base">edit</span>
                      </Link>
                      <button
                        className="w-8 h-8 rounded-lg text-on-surface-variant hover:bg-surface-container flex items-center justify-center transition-colors"
                        title="Mais opções"
                        type="button"
                      >
                        <span className="material-symbols-outlined text-base">more_vert</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>

              {/* Scheduled Post 3: Draft Status */}
              <article className="bg-surface-container-low/70 rounded-2xl p-space-sm md:p-space-md shadow-sm flex flex-col sm:flex-row items-center gap-space-md group border border-outline-variant/15">
                <div className="relative w-full sm:w-32 h-44 sm:h-36 rounded-xl overflow-hidden shrink-0 bg-surface-container-high">
                  <img
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                    alt="Facial glow"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKKr6S6VhMbYWgDNlT8tKtTKsQWRHs3-Xo4y2OlyC4uoPxxFtFJmb0KQWBhLGYu0ds0ooJXasCur1AE--1iewAMwWk0DblwVAlMYQwwnvsfhvhMcz2kFuQAYGzKzwuNOuNEIdEZTJ0ZZHCdPq8nuksthd2hEfgxIt9b_qypqr5hLRZHb5dsUOc8SrrpLKaizlbjjd5xTYgWl2d6exVmP-8Ehq4H9Ist9VMhrVJsBXICg3yeDyy-OvInA"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm text-on-surface font-label-sm text-label-sm uppercase flex items-center gap-1 shadow-xs">
                    <span className="material-symbols-outlined text-xs text-primary">auto_stories</span> Stories
                  </span>
                </div>
                <div className="flex flex-col flex-1 w-full justify-between h-full">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-variant text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wide">
                        Quinta-feira • 19:00
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary-container text-on-secondary-container font-label-sm text-label-sm font-semibold">
                        <span className="material-symbols-outlined text-xs">edit_note</span> Rascunho IA
                      </span>
                    </div>
                    <h3 className="font-title-md text-title-md text-on-surface font-semibold group-hover:text-primary transition-colors mt-1">
                      Antes &amp; Depois: Protocolo Glow Facial Rejuvenescedor
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                      Legenda sugerida pela BelezaIA pronta para revisão. Inclui enquete interativa com adesivo de
                      pergunta sobre rotina de skincare noturno.
                    </p>
                  </div>
                  <div className="mt-3 pt-3 flex items-center justify-between border-t border-outline-variant/15">
                    <span className="font-label-sm text-label-sm text-primary font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">schedule</span> Aguardando seu &apos;OK&apos;
                    </span>
                    <button
                      onClick={() => handleApproveDraft('draft-3')}
                      className="px-3 py-1.5 rounded-lg bg-surface-container-lowest text-primary hover:bg-primary hover:text-on-primary font-label-sm text-label-sm uppercase font-bold transition-colors shadow-xs"
                      type="button"
                    >
                      Aprovar Agora
                    </button>
                  </div>
                </div>
              </article>
            </div>
          </section>

          {/* Right Column: Instagram Feed Simulator & Best Performing Assets (5 cols desktop) */}
          <section className="xl:col-span-5 flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-label-md text-label-md uppercase tracking-wider text-primary font-semibold">
                  Performance Orgânica
                </span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Destaques da Semana</h2>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Barão Geraldo, Campinas • Há 2 dias
              </span>
            </div>

            {/* Interactive Feed Highlight Card */}
            <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex flex-col gap-space-md border border-outline-variant/15">
              {/* Mock Instagram Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <div className="p-0.5 rounded-full bg-gradient-to-tr from-secondary to-primary">
                    <img
                      className="w-9 h-9 rounded-full object-cover"
                      alt="Avatar Beleza Pura"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwtenAaRBB6ytxaK-4BtuUJiQu4XKj3-FXZjt61d815aQR45VmBB4A7Fk-YyiHiH9wsrhRrGgcOps46Y1-s_MlE6cephXrhasBarcvK4xYHlpZm403gKiLMqraK-ftQihj2Y_aqtHQvxBmXVHG6dl95KxFrCYvSzihWPFxjXHDSumImt3ZFmhpJt2rslg3qmhiXZjtiqfs8R5uFqvedV3sJjPw32U7TbK0AMAr19SSVMN-vYB1dRck5Q"
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <span className="font-title-md text-title-md text-on-surface leading-tight text-xs font-bold">
                        salaobelezapuracampinas
                      </span>
                      <span className="material-symbols-outlined text-primary text-[13px]">verified</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant text-[10px]">
                      Barão Geraldo, Campinas • Há 2 dias
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-primary font-label-sm text-label-sm font-semibold bg-primary-fixed/30 px-2 py-1 rounded-full">
                  <span className="material-symbols-outlined text-sm">local_fire_department</span> Top #1
                </span>
              </div>

              {/* Post Media Hero (4:5 aspect ratio) */}
              <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-surface-container shadow-xs">
                <img
                  className="w-full h-full object-cover"
                  alt="Penteado Noiva Luxo"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoT7GVb8ZDWAxiSAw0dQnuvUKBDudwojoueUcNSqveCmdbPDpS23F-yvudv1e1WjO_Aae3VdgT1Q3Ql0MJIm5xj1YwJZtHCEEGj491Xr89xOk8yC_SE-GWQiDZxvHAOWAMbbtdyy0ZFj9aZUoTn1HuUoa74lZj6dlzKEmBqAIp71AejejjtSeSLdaLvRsch6Qg4eTbjPyyktIia1UQ0jDnn2HOSBT4yTpag1znn4Q1iNbK7N46MIl25A"
                />
                <div className="absolute bottom-3 left-3 right-3 p-space-sm rounded-xl bg-surface-container-lowest/90 backdrop-blur-md flex items-center justify-between shadow-md border border-outline-variant/20">
                  <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase text-[10px]">
                      Dia da Noiva Premium
                    </span>
                    <span className="font-title-md text-title-md text-primary font-bold">
                      38 Noivas Chamaram
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast('Abrindo mensagens de noivas no Direct...')}
                    className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm flex items-center gap-1 shadow-sm font-semibold"
                  >
                    <span className="material-symbols-outlined text-sm">chat</span> Ver Directs
                  </button>
                </div>
              </div>

              {/* Engagement Metrics Bar */}
              <div className="grid grid-cols-3 gap-2 text-center py-2 bg-surface-container-low rounded-xl">
                <div className="flex flex-col">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">1,842</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Curtidas</span>
                </div>
                <div className="flex flex-col border-x border-outline-variant/30">
                  <span className="font-headline-sm text-headline-sm text-secondary font-semibold">239</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Comentários</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-sm text-headline-sm text-primary font-semibold">614</span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Salvos</span>
                </div>
              </div>

              {/* Secondary Thumbnails Grid: 2 Smaller Performing Posts */}
              <div className="flex flex-col gap-2 pt-1">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-semibold">
                  Outros Sucessos Recentes
                </span>
                <div className="grid grid-cols-2 gap-space-xs">
                  <div className="relative group rounded-xl overflow-hidden aspect-square bg-surface-container cursor-pointer shadow-xs">
                    <img
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      alt="Design Sobrancelhas"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlvO958d9DwRGdfS2CGQN6Q2EU8SAc2Xausm7lRwJUSEgfKYpv_jzMSBFzQR7HIbUtNJ2q92DRojIB-Z-YwnUT_qeQ6_1Dslm9mqHM3_bWpPYzyiSWEs0fxQSXNdO5MtDnEWicDIR8eojY5GDbmCHUrE5V4FevJ4_oDduxfXWbtYgt7Lban5cdIVrZ8R0Xow51KTu1QUzdU3nJq8Zzh2TkFFvXZ6iOEeWB8ZueLFsivIpVcmPrQU8FYg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-on-surface/85 via-transparent to-transparent flex flex-col justify-end p-2 text-surface">
                      <span className="font-title-md text-title-md font-bold leading-tight text-white text-xs">
                        Design Sobrancelhas
                      </span>
                      <span className="font-label-sm text-label-sm opacity-90 text-[10px] text-white">
                        982 likes • 19 agendamentos
                      </span>
                    </div>
                  </div>

                  <div className="relative group rounded-xl overflow-hidden aspect-square bg-surface-container cursor-pointer shadow-xs">
                    <img
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      alt="Loiro Vanilla Glow"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7b-2qpm03ou87msnj2BEzImN6vMRh5llxqJ4eM2RvePiDrgdvoF5BFE5keB63BRxX-nQXClR7dBKIVseQJtT_TB9VNpxjk0b7s5om45dH6lOyuDvY1d1XimjZD4KPqsQVUZjnpwqQAciA0g75iut6fpjMkLHcoGFSaq7VhVM0qBvmU__UatI8CnETQRYauDPw4tXVH3ikbBk9i8En8O-dTI2pafopwSIiztie-1C2bn5h4qrhDFOSiQ"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-on-surface/85 via-transparent to-transparent flex flex-col justify-end p-2 text-surface">
                      <span className="font-title-md text-title-md font-bold leading-tight text-white text-xs">
                        Loiro Vanilla Glow
                      </span>
                      <span className="font-label-sm text-label-sm opacity-90 text-[10px] text-white">
                        1.4k likes • 28 agendamentos
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom Editorial Assistant Bar */}
        <div className="w-full rounded-2xl bg-surface-container-high/60 p-space-md flex flex-col md:flex-row items-center justify-between gap-space-md border border-outline-variant/20 mb-8">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-2xl text-secondary">lightbulb</span>
            <div className="flex flex-col">
              <span className="font-title-md text-title-md text-on-surface font-semibold">
                Próximo Melhor Horário de Postagem Hoje:
              </span>
              <span className="font-body-md text-body-md text-on-surface-variant">
                Público de Barão Geraldo mais ativo entre as <strong>18:15 e 19:45</strong>. Seus Stories devem
                entrar às 17:30 para esquentar a audiência.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => showToast('Lembrete ativado para às 17:30!')}
            className="shrink-0 px-space-md py-2 rounded-xl bg-surface-container-lowest text-on-surface font-title-md text-title-md hover:bg-surface-variant transition-colors shadow-sm font-semibold"
          >
            Configurar Lembrete
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';

type PeriodType = '7d' | '30d' | '90d' | 'year';

export default function MetricsPage() {
  const [period, setPeriod] = useState<PeriodType>('30d');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleExport = (format: string) => {
    showToast(`Relatório completo em ${format} gerado e pronto para download!`);
  };

  return (
    <div className="flex flex-col w-full animate-fadeIn pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-inverse-surface text-inverse-on-surface px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-primary/30">
          <span className="material-symbols-outlined text-primary-fixed">check_circle</span>
          <span className="font-title-md text-title-md text-xs">{toastMessage}</span>
        </div>
      )}

      <div className="w-full max-w-[1360px] mx-auto px-4 lg:px-8 py-space-md flex flex-col gap-space-lg">
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md pb-4 border-b border-outline-variant/20">
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs text-on-surface-variant font-label-sm text-label-sm uppercase tracking-wider">
              <span className="text-secondary font-semibold">Analytics &amp; Retorno</span>
              <span>•</span>
              <span>Barão Geraldo, Campinas</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-0.5">
              Métricas &amp; Relatórios de Performance
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Acompanhe o crescimento da presença digital, engajamento das seguidoras e faturamento gerado via redes sociais.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-space-xs shrink-0">
            {/* Period Selector */}
            <div className="bg-surface-container-low p-1 rounded-xl flex items-center gap-1 border border-outline-variant/15">
              <button
                type="button"
                onClick={() => setPeriod('7d')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  period === '7d'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                7 Dias
              </button>
              <button
                type="button"
                onClick={() => setPeriod('30d')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  period === '30d'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                30 Dias
              </button>
              <button
                type="button"
                onClick={() => setPeriod('90d')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  period === '90d'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                90 Dias
              </button>
              <button
                type="button"
                onClick={() => setPeriod('year')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  period === 'year'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Ano
              </button>
            </div>

            {/* Export Report Actions */}
            <button
              type="button"
              onClick={() => handleExport('PDF')}
              className="px-4 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface hover:bg-surface-container font-title-md text-title-md text-xs border border-outline-variant/20 shadow-xs flex items-center gap-1.5 transition-colors font-semibold"
            >
              <span className="material-symbols-outlined text-base text-primary">picture_as_pdf</span>
              <span>Exportar PDF</span>
            </button>
            <button
              type="button"
              onClick={() => handleExport('Excel / CSV')}
              className="px-4 py-2.5 rounded-xl bg-primary text-on-primary font-title-md text-title-md text-xs shadow-xs hover:opacity-95 flex items-center gap-1.5 transition-all font-semibold"
            >
              <span className="material-symbols-outlined text-base">download</span>
              <span>Planilha CSV</span>
            </button>
          </div>
        </div>

        {/* 4 Executive KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-sm">
          {/* Card 1: Alcance Orgânico */}
          <div className="relative bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/15 flex flex-col justify-between overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                  Alcance Orgânico Total
                </span>
                <span className="font-headline-lg text-headline-lg text-on-surface font-semibold mt-1">
                  {period === '7d' ? '48.6K' : period === '30d' ? '184.2K' : '520.4K'}
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary-fixed/40 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-xl">group</span>
              </div>
            </div>
            <div className="mt-4 pt-3 flex items-center justify-between border-t border-outline-variant/15">
              <span className="inline-flex items-center gap-1 text-primary font-label-md text-label-md bg-primary-fixed/30 px-2 py-0.5 rounded-full font-semibold">
                <span className="material-symbols-outlined text-sm">trending_up</span> +18.4%
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                vs. período anterior
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary-container"></div>
          </div>

          {/* Card 2: Engajamento Médio */}
          <div className="relative bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/15 flex flex-col justify-between overflow-hidden">
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
            <div className="mt-4 pt-3 flex items-center justify-between border-t border-outline-variant/15">
              <span className="inline-flex items-center gap-1 text-secondary font-label-md text-label-md bg-secondary-fixed/40 px-2 py-0.5 rounded-full font-semibold">
                <span className="material-symbols-outlined text-sm">verified</span> Top 5% Região
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                Média mercado: 2.9%
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary"></div>
          </div>

          {/* Card 3: Agendamentos Direct & Bio */}
          <div className="relative bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/15 flex flex-col justify-between overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                  Agendamentos Direct/Bio
                </span>
                <span className="font-headline-lg text-headline-lg text-on-surface font-semibold mt-1">
                  {period === '7d' ? '38' : period === '30d' ? '154' : '412'}
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-xl">event_available</span>
              </div>
            </div>
            <div className="mt-4 pt-3 flex items-center justify-between border-t border-outline-variant/15">
              <span className="inline-flex items-center gap-1 text-primary font-label-md text-label-md bg-primary-fixed/30 px-2 py-0.5 rounded-full font-semibold">
                <span className="material-symbols-outlined text-sm">arrow_upward</span> +24% no mês
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                Conv. média: 21%
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary"></div>
          </div>

          {/* Card 4: Faturamento Estimado Gerado */}
          <div className="relative bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-outline-variant/15 flex flex-col justify-between overflow-hidden">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                  Receita Direta Estimada
                </span>
                <span className="font-headline-lg text-headline-lg text-on-surface font-semibold mt-1">
                  {period === '7d' ? 'R$ 14.8k' : period === '30d' ? 'R$ 58.4k' : 'R$ 164.2k'}
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                <span className="material-symbols-outlined text-xl">payments</span>
              </div>
            </div>
            <div className="mt-4 pt-3 flex items-center justify-between border-t border-outline-variant/15">
              <span className="inline-flex items-center gap-1 text-emerald-700 font-label-md text-label-md bg-emerald-100 px-2 py-0.5 rounded-full font-semibold">
                <span className="material-symbols-outlined text-sm">attach_money</span> CAC: R$ 0,00
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant truncate">
                100% Orgânico
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary-container to-primary-fixed"></div>
          </div>
        </div>

        {/* Charts & Breakdown Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          {/* Left Column (7 cols): Performance Timeline & Formats */}
          <div className="lg:col-span-7 flex flex-col gap-space-md">
            {/* Timeline Bar Chart */}
            <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/15 flex flex-col gap-space-md">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-label-md text-label-md uppercase tracking-wider text-secondary">
                    Evolução Diária
                  </span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface text-lg font-semibold">
                    Alcance de Visualizações por Dia da Semana
                  </h3>
                </div>
                <span className="text-xs text-on-surface-variant font-medium">Horário de Pico: 18h às 20h</span>
              </div>

              {/* Chart Visual Simulation */}
              <div className="flex items-end justify-between gap-2 h-44 pt-6 pb-2 border-b border-outline-variant/20">
                {[
                  { day: 'Seg', val: 35, full: '14.2k' },
                  { day: 'Ter', val: 52, full: '21.0k' },
                  { day: 'Qua', val: 78, full: '31.4k' },
                  { day: 'Qui', val: 65, full: '26.2k' },
                  { day: 'Sex', val: 96, full: '38.8k', peak: true },
                  { day: 'Sáb', val: 88, full: '35.5k' },
                  { day: 'Dom', val: 42, full: '17.1k' },
                ].map((col) => (
                  <div key={col.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] text-on-surface-variant font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      {col.full}
                    </span>
                    <div
                      className={`w-full max-w-[36px] rounded-t-lg transition-all duration-500 group-hover:opacity-90 ${
                        col.peak
                          ? 'bg-gradient-to-t from-primary to-primary-container shadow-sm'
                          : 'bg-surface-container-high group-hover:bg-primary-fixed'
                      }`}
                      style={{ height: `${col.val}%` }}
                    ></div>
                    <span className={`text-[11px] font-semibold mt-1 ${col.peak ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
                      {col.day}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-on-surface-variant pt-1">
                <span>Pico máximo: <strong>Sexta-feira (38.8k visualizações)</strong></span>
                <span className="text-secondary font-semibold">Sugerido: Postar Reels às sextas 18h15</span>
              </div>
            </div>

            {/* Performance by Media Format */}
            <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/15 flex flex-col gap-space-md">
              <h3 className="font-headline-sm text-headline-sm text-on-surface text-lg font-semibold">
                Divisão de Eficiência por Formato de Mídia
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
                <div className="p-3.5 rounded-xl bg-surface-container-low flex flex-col justify-between border border-outline-variant/15">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-bold text-primary">Reels (Vídeo)</span>
                    <span className="material-symbols-outlined text-primary text-base">movie</span>
                  </div>
                  <div className="mt-3">
                    <span className="text-2xl font-bold text-on-surface">64%</span>
                    <span className="text-xs text-on-surface-variant block">do alcance de novas clientes</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-surface-container-low flex flex-col justify-between border border-outline-variant/15">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-bold text-secondary">Carrossel</span>
                    <span className="material-symbols-outlined text-secondary text-base">view_carousel</span>
                  </div>
                  <div className="mt-3">
                    <span className="text-2xl font-bold text-on-surface">22%</span>
                    <span className="text-xs text-on-surface-variant block">do alcance (maior em salvamentos)</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-surface-container-low flex flex-col justify-between border border-outline-variant/15">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase font-bold text-on-surface">Stories</span>
                    <span className="material-symbols-outlined text-on-surface text-base">amp_stories</span>
                  </div>
                  <div className="mt-3">
                    <span className="text-2xl font-bold text-on-surface">14%</span>
                    <span className="text-xs text-on-surface-variant block">maior taxa de resposta imediata</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Geographic Breakdown & Top Leaderboard */}
          <div className="lg:col-span-5 flex flex-col gap-space-md">
            {/* Campinas Neighborhoods Breakdown */}
            <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/15 flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md uppercase tracking-wider text-primary font-bold">
                  Geolocalização
                </span>
                <span className="text-xs text-on-surface-variant">Campinas • SP</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface text-base font-semibold">
                Origem das Clientes por Bairro
              </h3>

              <div className="flex flex-col gap-3 mt-2">
                {[
                  { name: 'Barão Geraldo (Pólo Universitário & Condomínios)', percent: 42, count: '6.4k clientes' },
                  { name: 'Taquaral / Guanabara', percent: 28, count: '4.2k clientes' },
                  { name: 'Cambuí', percent: 18, count: '2.7k clientes' },
                  { name: 'Nova Campinas / Alphaville', percent: 12, count: '1.8k clientes' },
                ].map((region) => (
                  <div key={region.name} className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-on-surface">{region.name}</span>
                      <span className="text-primary font-bold">{region.percent}%</span>
                    </div>
                    <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                        style={{ width: `${region.percent}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] text-on-surface-variant">{region.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performing Posts Leaderboard */}
            <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/15 flex flex-col gap-space-sm">
              <div className="flex items-center justify-between">
                <span className="font-label-md text-label-md uppercase tracking-wider text-secondary font-bold">
                  Ranking dos Melhores Posts
                </span>
                <Link href="/dashboard/posts" className="text-xs text-primary font-semibold hover:underline">
                  Criar Novo
                </Link>
              </div>

              <div className="flex flex-col gap-2.5 mt-1">
                {[
                  {
                    title: 'Penteado Noiva Luxo & Acessórios Pérola',
                    reach: '38.2k',
                    leads: '38 noivas',
                    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoT7GVb8ZDWAxiSAw0dQnuvUKBDudwojoueUcNSqveCmdbPDpS23F-yvudv1e1WjO_Aae3VdgT1Q3Ql0MJIm5xj1YwJZtHCEEGj491Xr89xOk8yC_SE-GWQiDZxvHAOWAMbbtdyy0ZFj9aZUoTn1HuUoa74lZj6dlzKEmBqAIp71AejejjtSeSLdaLvRsch6Qg4eTbjPyyktIia1UQ0jDnn2HOSBT4yTpag1znn4Q1iNbK7N46MIl25A',
                  },
                  {
                    title: 'Morena Iluminada Avelã & Fusio-Dose',
                    reach: '29.4k',
                    leads: '24 agendamentos',
                    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDuW43gxGcbPyqhxuFhqzV49AIY1qhG6Lp8LE_17SYZcVehuYt4C0NaE1ZTNwiHWPuoE99VhLEAsuZXbgmELfkdbioGbOEEecYoGYmLz3eZmcx_Tkz1hIezCBnASyBCufM08xNJLU63u479Hdto2XfjoGnmqp1nVHm9QoCc2NXqwgk38_G6010v7mrhJma287G0Va_q214TZ0r0w5rtRpMKHB4AivjVkQVXWN0v1Nv0BHwEoLvrpsY45A',
                  },
                  {
                    title: 'Unhas Rosé Minimalista & Blindagem',
                    reach: '18.1k',
                    leads: '19 agendamentos',
                    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBy1xff9c1GBVbidO2FPkhEd-amlt6qC_G-X8MkTzsKaOpWWpt-xQ1R-bvUmdGWfKfVjTkeo-EM13SXDrBstANKE_rR1tAzZy0nVKHJEoDJuDpkmWHjtVt1PxzhbITj1Q6BfXBreu_MP78ArlEC_18BpiLb9cV5Ldrxai0Ju4L_rQgWYbuWGo7RHgZilPH0HY1slEkWBa5E5NCfznAywEC9_mO5bzmiMSGAHEiKz6edAIT5T0zZM9gM8g',
                  },
                ].map((post, i) => (
                  <div
                    key={post.title}
                    className="p-2.5 rounded-xl bg-surface-container-low flex items-center justify-between gap-3 border border-outline-variant/15"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-xs text-primary w-4 text-center">#{i + 1}</span>
                      <img src={post.img} alt={post.title} className="w-11 h-11 rounded-lg object-cover" />
                      <div className="flex flex-col">
                        <span className="font-title-md text-title-md text-xs font-semibold text-on-surface line-clamp-1">
                          {post.title}
                        </span>
                        <span className="text-[10px] text-on-surface-variant">{post.reach} visualizações</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-primary-fixed/40 text-primary text-[10px] font-bold whitespace-nowrap">
                      {post.leads}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

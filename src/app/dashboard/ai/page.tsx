'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Copy,
  Check,
  Lightbulb,
  Camera,
  Clock,
  Send,
  Wand2,
  FileText,
  ThumbsUp,
  Tag,
  Scissors,
  CheckCircle2,
  Flame,
  ExternalLink,
  TrendingUp,
  Music,
  ArrowRight,
  Sparkle,
  Eye,
  Trash2,
  Heart,
  MessageCircle,
  Bookmark,
  RotateCcw,
} from 'lucide-react';
import { TIKTOK_BEAUTY_TRENDS, TikTokTrend } from '@/lib/tiktok-trends';

interface CopyResult {
  caption: string;
  cta: string;
  hashtags: string;
  previewHooks?: string[];
}

interface IdeaItem {
  title: string;
  format: string;
  hook: string;
  objective: string;
  suggestedMedia: string;
}

interface StrategyResult {
  bestDays: string[];
  bestHours: Array<{ period: string; time: string; reason: string }>;
  goldenTip: string;
}

interface CurationResult {
  score: number;
  lightingAnalysis: string;
  framingTip: string;
  engagementPrediction: string;
  recommendation: string;
}

export default function AIPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'copy' | 'ideas' | 'trends' | 'curation' | 'strategy'>('copy');

  // Copywriting state
  const [service, setService] = useState('Cabelo');
  const [procedure, setProcedure] = useState('Morena Iluminada');
  const [tone, setTone] = useState('Elegante e Sofisticado');
  const [goal, setGoal] = useState('Atrair novas clientes e engajar');
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatingCopy, setGeneratingCopy] = useState(false);
  const [copyResult, setCopyResult] = useState<CopyResult | null>(null);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedTags, setCopiedTags] = useState(false);

  // Ideas state
  const [ideaFocus, setIdeaFocus] = useState('Cabelos e Mechas');
  const [generatingIdeas, setGeneratingIdeas] = useState(false);
  const [ideasResult, setIdeasResult] = useState<IdeaItem[] | null>(null);

  // TikTok Trends state
  const [selectedTrendCategory, setSelectedTrendCategory] = useState<string>('all');
  const [searchTrend, setSearchTrend] = useState<string>('');
  const [activeTrendModal, setActiveTrendModal] = useState<TikTokTrend | null>(null);
  const [previewingTrend, setPreviewingTrend] = useState<TikTokTrend | null>(null);
  const [hiddenTrendIds, setHiddenTrendIds] = useState<string[]>([]);
  const [generatingTrendScript, setGeneratingTrendScript] = useState(false);
  const [trendScriptResult, setTrendScriptResult] = useState<any>(null);
  const [copiedScript, setCopiedScript] = useState(false);

  // Curation state
  const [generatingCuration, setGeneratingCuration] = useState(false);
  const [curationResult, setCurationResult] = useState<CurationResult | null>(null);

  // Strategy state
  const [generatingStrategy, setGeneratingStrategy] = useState(false);
  const [strategyResult, setStrategyResult] = useState<StrategyResult | null>(null);

  const handleGenerateCopy = async () => {
    setGeneratingCopy(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentType: 'copywriting',
          service,
          procedure,
          tone,
          goal,
          customPrompt,
        }),
      });
      const data = await res.json();
      if (data.data) {
        setCopyResult(data.data);
      }
    } catch (err) {
      console.error('AI generate error:', err);
    } finally {
      setGeneratingCopy(false);
    }
  };

  const handleGenerateIdeas = async () => {
    setGeneratingIdeas(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentType: 'ideas',
          service: ideaFocus,
          tone,
        }),
      });
      const data = await res.json();
      if (data.data) {
        setIdeasResult(data.data);
      }
    } catch (err) {
      console.error('Ideas error:', err);
    } finally {
      setGeneratingIdeas(false);
    }
  };

  const handleRunCuration = async () => {
    setGeneratingCuration(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentType: 'curation' }),
      });
      const data = await res.json();
      if (data.data) {
        setCurationResult(data.data);
      }
    } catch (err) {
      console.error('Curation error:', err);
    } finally {
      setGeneratingCuration(false);
    }
  };

  const handleRunStrategy = async () => {
    setGeneratingStrategy(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentType: 'strategy' }),
      });
      const data = await res.json();
      if (data.data) {
        setStrategyResult(data.data);
      }
    } catch (err) {
      console.error('Strategy error:', err);
    } finally {
      setGeneratingStrategy(false);
    }
  };

  const handleCopyCaption = () => {
    if (!copyResult) return;
    navigator.clipboard.writeText(`${copyResult.caption}\n\n${copyResult.hashtags}`);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const handleCreatePostWithCopy = () => {
    if (!copyResult) return;
    // Save generated copy to sessionStorage and redirect to posts
    sessionStorage.setItem(
      'draft_from_ai',
      JSON.stringify({
        caption: copyResult.caption,
        hashtags: copyResult.hashtags,
        cta: copyResult.cta,
      })
    );
    router.push('/dashboard/posts');
  };

  const handleGenerateTrendScript = async (trend: TikTokTrend) => {
    setActiveTrendModal(trend);
    setGeneratingTrendScript(true);
    setTrendScriptResult(null);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentType: 'tiktok-trend',
          trendName: trend.name,
          hashtag: trend.hashtag,
          suggestedHook: trend.suggestedHook,
          videoFormat: trend.videoFormat,
          soundtrackSuggestion: trend.soundtrackSuggestion,
        }),
      });
      const data = await res.json();
      if (data.data) {
        setTrendScriptResult(data.data);
      }
    } catch (err) {
      console.error('TikTok script error:', err);
    } finally {
      setGeneratingTrendScript(false);
    }
  };

  const handleSendTrendToEditor = (trend: TikTokTrend, scriptData?: any) => {
    sessionStorage.setItem(
      'draft_from_ai',
      JSON.stringify({
        caption:
          scriptData?.caption ||
          `A tendência ${trend.name} que conquistou o TikTok agora com o padrão de excelência do nosso salão! ✨🤎\n\n${trend.description}\n\nAgende seu horário pelo link da bio!`,
        hashtags:
          scriptData?.hashtags ||
          `${trend.hashtag} #salaodebeleza #salaocampinas #cabelosdeluxo #beautytok`,
        cta: scriptData?.cta || 'Agende seu horário pelo WhatsApp no link da bio!',
      })
    );
    router.push(`/dashboard/posts?prompt=${encodeURIComponent(trend.name + ' - ' + trend.suggestedHook)}&mode=ai`);
  };

  const handleHideTrend = (trendId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setHiddenTrendIds((prev) => [...prev, trendId]);
    if (previewingTrend?.id === trendId) {
      setPreviewingTrend(null);
    }
  };

  const handleRestoreHiddenTrends = () => {
    setHiddenTrendIds([]);
  };

  const filteredTrends = TIKTOK_BEAUTY_TRENDS.filter((t) => {
    if (hiddenTrendIds.includes(t.id)) return false;
    const matchesCategory = selectedTrendCategory === 'all' || t.category === selectedTrendCategory;
    const matchesSearch =
      !searchTrend ||
      t.name.toLowerCase().includes(searchTrend.toLowerCase()) ||
      t.hashtag.toLowerCase().includes(searchTrend.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTrend.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="ai-page max-w-[1360px] mx-auto w-full px-4 lg:px-8">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Agentes de <span className="text-gradient">Inteligência Artificial</span>
          </h1>
          <p className="page-description">
            Especialistas virtuais em marketing de beleza para alavancar os resultados do seu salão
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="ai-tabs">
        <button
          className={`ai-tab-btn ${activeTab === 'copy' ? 'active' : ''}`}
          onClick={() => setActiveTab('copy')}
        >
          <Wand2 size={16} />
          Agente Copywriter
        </button>
        <button
          className={`ai-tab-btn ${activeTab === 'ideas' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('ideas');
            if (!ideasResult) handleGenerateIdeas();
          }}
        >
          <Lightbulb size={16} />
          Ideias & Cronograma
        </button>
        <button
          className={`ai-tab-btn ${activeTab === 'trends' ? 'active' : ''}`}
          onClick={() => setActiveTab('trends')}
        >
          <Flame size={16} className="text-rose-500" />
          <span>Tendências TikTok</span>
          <span className="ml-1 text-[10px] font-bold uppercase tracking-wider bg-rose-500 text-white px-1.5 py-0.5 rounded-full">
            CREATIVE CENTER
          </span>
        </button>
        <button
          className={`ai-tab-btn ${activeTab === 'curation' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('curation');
            if (!curationResult) handleRunCuration();
          }}
        >
          <Camera size={16} />
          Curadoria Visual
        </button>
        <button
          className={`ai-tab-btn ${activeTab === 'strategy' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('strategy');
            if (!strategyResult) handleRunStrategy();
          }}
        >
          <Clock size={16} />
          Estratégia & Horários
        </button>
      </div>

      {/* TAB 1: COPYWRITER */}
      {activeTab === 'copy' && (
        <div className="ai-layout">
          {/* Controls */}
          <div className="card ai-card-controls">
            <h2 className="ai-section-title">Configurar Geração de Post</h2>

            <div className="input-group">
              <label className="input-label">Categoria de Serviço</label>
              <select
                className="select"
                value={service}
                onChange={(e) => setService(e.target.value)}
              >
                <option value="Cabelo">Cabelos (Mechas, Cortes, Tratamentos)</option>
                <option value="Unhas">Unhas (Gel, Fibra, Nail Art)</option>
                <option value="Estética">Estética Facial & Corporal</option>
                <option value="Sobrancelhas">Sobrancelhas & Cílios</option>
                <option value="Promoção">Promoção ou Vaga de Horário</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Procedimento ou Técnica Específica</label>
              <input
                type="text"
                className="input"
                placeholder="Ex: Morena Iluminada Avelã, Unhas em Gel Francesinha..."
                value={procedure}
                onChange={(e) => setProcedure(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Tom de Voz da Marca</label>
              <select
                className="select"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                <option value="Elegante e Sofisticado">Elegante & Sofisticado (Salão Premium)</option>
                <option value="Descontraído e Amigável">Descontraído, Jovem & Amigável</option>
                <option value="Especialista e Educativo">Especialista & Educativo (Autoridade)</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Objetivo Principal do Post</label>
              <select
                className="select"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              >
                <option value="Atrair novas clientes e engajar">Atrair novas clientes (Topo de funil)</option>
                <option value="Preencher vagas na semana">Preencher horários vagos na semana</option>
                <option value="Mostrar transformação Antes/Depois">Apresentar transformação Antes & Depois</option>
                <option value="Dica de cuidado em casa">Dica de manutenção/autocuidado em casa</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Detalhes ou Observações (Opcional)</label>
              <textarea
                className="textarea"
                rows={2}
                placeholder="Ex: Citar que usamos produtos sem formol, valor da hidratação grátis..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
              />
            </div>

            <button
              className="btn btn-primary btn-generate"
              onClick={handleGenerateCopy}
              disabled={generatingCopy}
            >
              {generatingCopy ? (
                <>
                  <div className="spinner-border animate-spin" />
                  Criando Copy Perfeita...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Gerar Post com IA
                </>
              )}
            </button>
          </div>

          {/* Result */}
          <div className="card ai-card-result">
            {copyResult ? (
              <div className="copy-result-content">
                <div className="copy-result-header">
                  <div className="badge badge-success">
                    <CheckCircle2 size={12} /> Sugestão Pronta para Postar
                  </div>
                  <div className="copy-actions-top">
                    <button
                      className="btn btn-sm btn-ghost"
                      onClick={handleCopyCaption}
                      title="Copiar tudo"
                    >
                      {copiedCaption ? <Check size={14} /> : <Copy size={14} />}
                      {copiedCaption ? 'Copiado!' : 'Copiar Legenda'}
                    </button>
                  </div>
                </div>

                {/* Caption Box */}
                <div className="caption-preview-box">
                  <pre className="caption-text">{copyResult.caption}</pre>
                </div>

                {/* Hashtags */}
                <div className="hashtags-box">
                  <span className="hashtags-title">
                    <Tag size={14} /> Hashtags Recomendadas:
                  </span>
                  <p className="hashtags-list">{copyResult.hashtags}</p>
                </div>

                {/* Hooks */}
                {copyResult.previewHooks && copyResult.previewHooks.length > 0 && (
                  <div className="hooks-box">
                    <span className="hooks-title">
                      <Lightbulb size={14} /> Ganchos alternativos para a primeira linha:
                    </span>
                    <ul>
                      {copyResult.previewHooks.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Call to Action to Posts */}
                <div className="copy-footer-action">
                  <button
                    className="btn btn-primary"
                    onClick={handleCreatePostWithCopy}
                  >
                    <FileText size={16} />
                    Usar no Gerenciador de Posts
                  </button>
                </div>
              </div>
            ) : (
              <div className="empty-state-ai">
                <Sparkles size={56} strokeWidth={1.2} className="empty-state-icon" />
                <h3>Pronto para criar conteúdo de alto impacto?</h3>
                <p>
                  Escolha o serviço do salão ao lado e clique em <strong>Gerar Post com IA</strong>{' '}
                  para receber legendas persuasivas, ganchos visuais e hashtags em alta.
                </p>
                <button
                  className="btn btn-secondary"
                  onClick={handleGenerateCopy}
                  disabled={generatingCopy}
                >
                  <Wand2 size={16} />
                  Testar com Morena Iluminada
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: IDEAS */}
      {activeTab === 'ideas' && (
        <div className="ideas-container">
          <div className="ideas-toolbar card">
            <div className="ideas-controls">
              <label className="input-label" style={{ marginBottom: 0 }}>
                Foco do Salão para a Semana:
              </label>
              <select
                className="select"
                style={{ width: 'auto' }}
                value={ideaFocus}
                onChange={(e) => setIdeaFocus(e.target.value)}
              >
                <option value="Cabelos e Mechas">Cabelos e Mechas</option>
                <option value="Alongamento de Unhas">Alongamento de Unhas & Nail Art</option>
                <option value="Estética Facial & Limpeza">Estética Facial & Skincare</option>
                <option value="Geral do Salão e Autocuidado">Geral do Salão & Autocuidado</option>
              </select>
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleGenerateIdeas}
              disabled={generatingIdeas}
            >
              <Sparkles size={14} />
              {generatingIdeas ? 'Gerando...' : 'Atualizar Ideias'}
            </button>
          </div>

          <div className="ideas-grid">
            {generatingIdeas ? (
              <div className="card loading-card">Criando cronograma semanal inteligente...</div>
            ) : ideasResult ? (
              ideasResult.map((item, idx) => (
                <div key={idx} className="card idea-card card-interactive">
                  <div className="idea-card-header">
                    <span className="badge badge-primary">{item.format}</span>
                    <span className="idea-day">{item.title}</span>
                  </div>
                  <h3 className="idea-hook">"{item.hook}"</h3>
                  <div className="idea-body">
                    <p>
                      <strong>Objetivo:</strong> {item.objective}
                    </p>
                    <p className="idea-media-hint">
                      <strong>Cena sugerida:</strong> {item.suggestedMedia}
                    </p>
                  </div>
                  <button
                    className="btn btn-ghost btn-sm btn-use-idea"
                    onClick={() => {
                      setProcedure(item.title);
                      setCustomPrompt(item.hook);
                      setActiveTab('copy');
                    }}
                  >
                    <Wand2 size={14} /> Criar Post desta Ideia
                  </button>
                </div>
              ))
            ) : null}
          </div>
        </div>
      )}

      {/* TAB 3: CURATION */}
      {activeTab === 'curation' && (
        <div className="card curation-container">
          <div className="curation-header">
            <div className="curation-score-circle">
              <span className="score-num">{curationResult?.score || 9.3}</span>
              <span className="score-max">/10</span>
            </div>
            <div>
              <h2>Diagnóstico de Curadoria Visual para Salão</h2>
              <p className="curation-sub">
                Avaliação automatizada de potencial estético e engajamento para procedimentos
              </p>
            </div>
          </div>

          <div className="curation-insights-grid">
            <div className="card curation-item">
              <div className="curation-item-icon text-primary">
                <Camera size={20} />
              </div>
              <div>
                <h4>Iluminação & Nitidez</h4>
                <p>
                  {curationResult?.lightingAnalysis ||
                    'Iluminação ideal destacando reflexos da cor e brilho natural dos fios.'}
                </p>
              </div>
            </div>

            <div className="card curation-item">
              <div className="curation-item-icon text-accent">
                <Scissors size={20} />
              </div>
              <div>
                <h4>Melhor Enquadramento</h4>
                <p>
                  {curationResult?.framingTip ||
                    'Use proporção vertical 4:5 no feed para dominar a tela do smartphone da cliente.'}
                </p>
              </div>
            </div>

            <div className="card curation-item">
              <div className="curation-item-icon text-info">
                <ThumbsUp size={20} />
              </div>
              <div>
                <h4>Potencial de Engajamento</h4>
                <p>
                  {curationResult?.engagementPrediction ||
                    'Altíssimo potencial para carrossel com Antes na segunda imagem.'}
                </p>
              </div>
            </div>
          </div>

          <div className="curation-recommendation">
            <Lightbulb size={20} className="text-warning" />
            <p>
              <strong>Dica de Ouro do Especialista:</strong>{' '}
              {curationResult?.recommendation ||
                'Grave vídeos curtos de 3 segundos balançando os fios na luz natural para publicar nos Stories.'}
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: TIKTOK CREATIVE CENTER TRENDS */}
      {activeTab === 'trends' && (
        <div className="trends-container flex flex-col gap-6">
          {/* Header Banner */}
          <div className="p-6 bg-gradient-to-r from-rose-950/20 via-surface-container-low to-amber-950/10 border border-outline-variant/30 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
                <Flame size={26} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold text-on-surface">TikTok Creative Center • Brasil</h2>
                  <span className="text-xs bg-rose-500 text-white font-semibold px-2 py-0.5 rounded-full">
                    Cabelos & Cosméticos
                  </span>
                </div>
                <p className="text-sm text-on-surface-variant mt-1">
                  Hashtags virais, procedimentos em alta no mercado nacional e formatos de vídeo monitorados no TikTok e Reels para salões de alto padrão.
                </p>
              </div>
            </div>

            <a
              href="https://ads.tiktok.com/business/creativecenter/inspiration/popular/hashtag/pc/pt?countryCode=BR"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container-lowest hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-all border border-outline-variant/30 shadow-sm shrink-0"
            >
              <span>Abrir Creative Center Oficial</span>
              <ExternalLink size={14} />
            </a>
          </div>

          {/* Filter Pills and Search */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'all', label: 'Todas as Trends' },
                { id: 'cabelo', label: '💇‍♀️ Cabelos & Mechas' },
                { id: 'cosmeticos', label: '🧴 Cosméticos & Skincare' },
                { id: 'unhas', label: '💅 Unhas & Estética' },
                { id: 'audios', label: '🎵 Áudios Virais' },
              ].map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedTrendCategory(category.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    selectedTrendCategory === category.id
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
                >
                  <span>{category.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              {hiddenTrendIds.length > 0 && (
                <button
                  type="button"
                  onClick={handleRestoreHiddenTrends}
                  className="px-3 py-1.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-primary text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <RotateCcw size={13} />
                  <span>Restaurar ({hiddenTrendIds.length})</span>
                </button>
              )}

              <input
                type="text"
                placeholder="Buscar tendência ou hashtag..."
                value={searchTrend}
                onChange={(e) => setSearchTrend(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-64"
              />
            </div>
          </div>

          {/* Trends Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTrends.map((trend) => (
              <div
                key={trend.id}
                onClick={() => setPreviewingTrend(trend)}
                className="p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 shadow-sm hover:shadow-md hover:border-primary/40 transition-all flex flex-col justify-between gap-4 group cursor-pointer"
              >
                <div className="flex flex-col gap-3">
                  {/* Top badges & delete/hide button */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${trend.badgeColor}`}>
                      {trend.badge} • {trend.growth}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-on-surface-variant flex items-center gap-1">
                        <TrendingUp size={13} className="text-emerald-500" />
                        {trend.views}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => handleHideTrend(trend.id, e)}
                        title="Deletar / Ocultar da lista"
                        className="p-1 rounded-lg text-on-surface-variant/40 hover:text-error hover:bg-error-container/20 transition-colors"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Title & Hashtag */}
                  <div>
                    <h3 className="text-base font-bold text-on-surface group-hover:text-primary transition-colors flex items-center justify-between">
                      <span>{trend.name}</span>
                      <Eye size={15} className="text-on-surface-variant/40 group-hover:text-primary transition-colors" />
                    </h3>
                    <span className="text-xs font-semibold text-primary">{trend.hashtag}</span>
                  </div>

                  <p className="text-xs text-on-surface-variant line-clamp-2">{trend.description}</p>

                  {/* Hook Box */}
                  <div className="bg-surface-container-low p-3 rounded-xl border border-outline-variant/20">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose-600 uppercase tracking-wider mb-1">
                      <Flame size={12} />
                      Gancho Viral de 3s (Hook)
                    </div>
                    <p className="text-xs text-on-surface italic font-medium">"{trend.suggestedHook}"</p>
                  </div>

                  {/* Audio & Video Format */}
                  <div className="flex flex-wrap gap-2 text-[11px] text-on-surface-variant">
                    <span className="bg-surface-container-highest px-2 py-0.5 rounded-md font-medium">
                      📹 {trend.videoFormat}
                    </span>
                    {trend.soundtrackSuggestion && (
                      <span className="bg-surface-container-highest px-2 py-0.5 rounded-md font-medium truncate max-w-[180px]" title={trend.soundtrackSuggestion}>
                        🎵 {trend.soundtrackSuggestion}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-outline-variant/20 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewingTrend(trend);
                    }}
                    className="flex-1 py-2 px-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Eye size={14} className="text-primary" />
                    <span>Visualizar</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGenerateTrendScript(trend);
                    }}
                    title="Gerar Roteiro com IA"
                    className="py-2 px-3 rounded-xl bg-primary-container text-on-primary-container text-xs font-semibold hover:opacity-95 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Wand2 size={14} />
                    <span className="hidden sm:inline">Roteiro IA</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSendTrendToEditor(trend);
                    }}
                    title="Criar post no editor"
                    className="p-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface transition-colors"
                  >
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive TikTok / Reels Visual Preview Modal */}
          {previewingTrend && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-surface border border-outline-variant/30 rounded-3xl max-w-4xl w-full p-6 shadow-2xl flex flex-col gap-6 relative">
                {/* Modal Header */}
                <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
                      <Flame size={20} />
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                        <span>{previewingTrend.name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${previewingTrend.badgeColor}`}>
                          {previewingTrend.badge}
                        </span>
                      </h3>
                      <p className="text-xs text-on-surface-variant">
                        Simulador de Visualização TikTok &amp; Reels • Proporção 9:16
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleHideTrend(previewingTrend.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-error hover:bg-error-container/20 flex items-center gap-1.5 transition-colors border border-error/20"
                      title="Deletar / Ocultar da Lista"
                    >
                      <Trash2 size={14} />
                      <span>Deletar da Lista</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewingTrend(null)}
                      className="p-1.5 rounded-xl hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface text-lg leading-none"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* 2-Column Content: Left Smartphone Mockup, Right Strategy Intel */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  {/* Left: 9:16 TikTok Smartphone Mockup */}
                  <div className="md:col-span-5 flex justify-center">
                    <div className="relative w-full max-w-[280px] aspect-[9/16] rounded-[36px] bg-gradient-to-b from-stone-900 via-stone-950 to-black text-white p-3.5 shadow-2xl border-4 border-stone-800 flex flex-col justify-between overflow-hidden select-none">
                      {/* Dynamic Background visual elements */}
                      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-rose-900/60 via-purple-950/40 to-transparent pointer-events-none" />
                      <div className="absolute top-1/4 -right-10 w-40 h-40 rounded-full bg-amber-500/20 blur-2xl pointer-events-none" />

                      {/* Phone Top Notch & Tabs */}
                      <div className="relative z-10 flex flex-col gap-2 pt-1">
                        <div className="mx-auto w-20 h-4 rounded-full bg-black/60 flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-stone-700 mr-2" />
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
                        </div>
                        <div className="flex items-center justify-center gap-4 text-xs font-semibold text-white/70">
                          <span>Seguindo</span>
                          <span className="text-white border-b-2 border-white pb-0.5 font-bold">Para você</span>
                        </div>
                      </div>

                      {/* Center: Viral Hook on screen */}
                      <div className="relative z-10 my-auto px-2 flex flex-col items-center text-center gap-2">
                        <div className="p-1 rounded-full bg-rose-500/30 text-rose-300 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 flex items-center gap-1 backdrop-blur-md">
                          <Flame size={10} />
                          <span>Gancho Viral de 3s</span>
                        </div>
                        <div className="bg-black/70 backdrop-blur-md p-3.5 rounded-2xl border border-white/15 shadow-xl">
                          <p className="text-sm font-extrabold text-white leading-snug drop-shadow-md">
                            &ldquo;{previewingTrend.suggestedHook}&rdquo;
                          </p>
                        </div>
                        <span className="text-[10px] text-white/70 font-medium">
                          ✨ Retenção máxima nos primeiros segundos
                        </span>
                      </div>

                      {/* Right-rail actions on TikTok */}
                      <div className="absolute right-2 bottom-16 z-20 flex flex-col items-center gap-3 text-white/90">
                        {/* Profile avatar */}
                        <div className="relative mb-1">
                          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center font-bold text-xs border border-white">
                            PV
                          </div>
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-bold">
                            +
                          </div>
                        </div>

                        {/* Likes */}
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-rose-500">
                            <Heart size={18} fill="currentColor" />
                          </div>
                          <span className="text-[10px] font-semibold mt-0.5">84.2K</span>
                        </div>

                        {/* Comments */}
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white">
                            <MessageCircle size={18} />
                          </div>
                          <span className="text-[10px] font-semibold mt-0.5">1.5K</span>
                        </div>

                        {/* Bookmark */}
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-amber-400">
                            <Bookmark size={18} fill="currentColor" />
                          </div>
                          <span className="text-[10px] font-semibold mt-0.5">22.8K</span>
                        </div>

                        {/* Spinning Record */}
                        <div className="w-8 h-8 rounded-full bg-black/60 border border-white/20 flex items-center justify-center animate-spin">
                          <Music size={12} className="text-white" />
                        </div>
                      </div>

                      {/* Bottom Info Bar */}
                      <div className="relative z-10 flex flex-col gap-1 pr-12 pb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white drop-shadow">
                            @salaobelezapuracampinas
                          </span>
                          <span className="material-symbols-outlined text-[13px] text-primary">verified</span>
                        </div>
                        <p className="text-[11px] text-white/90 line-clamp-2 leading-tight drop-shadow">
                          {previewingTrend.description}
                        </p>
                        <span className="text-[11px] font-bold text-primary-fixed drop-shadow">
                          {previewingTrend.hashtag}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-white/70 mt-0.5 truncate">
                          <Music size={10} />
                          <span className="truncate">
                            {previewingTrend.soundtrackSuggestion || 'Áudio Viral de Beleza • Brasil'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Trend Intelligence & Actions */}
                  <div className="md:col-span-7 flex flex-col gap-4">
                    <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/20 flex flex-col gap-3">
                      <span className="text-xs font-bold text-primary uppercase tracking-wider">
                        Inteligência de Mercado • TikTok Brasil
                      </span>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/10">
                          <span className="text-on-surface-variant block mb-0.5">Crescimento:</span>
                          <span className="text-sm font-bold text-emerald-600">{previewingTrend.growth}</span>
                        </div>
                        <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/10">
                          <span className="text-on-surface-variant block mb-0.5">Visualizações:</span>
                          <span className="text-sm font-bold text-on-surface">{previewingTrend.views}</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-on-surface mb-1">Por que está viralizando:</h4>
                        <p className="text-xs text-on-surface-variant leading-relaxed">
                          {previewingTrend.description} Clientes de salão procuram esse procedimento ativamente no TikTok e Instagram Reels no Brasil antes de agendar.
                        </p>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-on-surface mb-1">Formato de Gravação Recomendado:</h4>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="px-2.5 py-1 rounded-lg bg-surface-container-high text-on-surface font-semibold">
                            📹 {previewingTrend.videoFormat}
                          </span>
                          <span className="text-on-surface-variant">Luz natural ou anel de led suave a 45º</span>
                        </div>
                      </div>

                      {previewingTrend.soundtrackSuggestion && (
                        <div>
                          <h4 className="text-xs font-bold text-on-surface mb-1">Trilha Sonora Sugerida:</h4>
                          <p className="text-xs text-on-surface-variant flex items-center gap-1.5">
                            <Music size={13} className="text-rose-500 shrink-0" />
                            <span>{previewingTrend.soundtrackSuggestion}</span>
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          const t = previewingTrend;
                          setPreviewingTrend(null);
                          handleGenerateTrendScript(t);
                        }}
                        className="w-full py-3 px-4 rounded-xl bg-primary text-white text-xs font-semibold hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-sm"
                      >
                        <Wand2 size={16} />
                        <span>Gerar Roteiro Completo com IA (Gemini)</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const t = previewingTrend;
                            setPreviewingTrend(null);
                            handleSendTrendToEditor(t);
                          }}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-primary-container text-on-primary-container text-xs font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <ArrowRight size={14} />
                          <span>Usar no Editor de Post</span>
                        </button>

                        <a
                          href={previewingTrend.creativeCenterUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2.5 px-3 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-semibold transition-all flex items-center gap-1.5 border border-outline-variant/20"
                        >
                          <span>Ver no TikTok Oficial</span>
                          <ExternalLink size={13} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Script Drawer / Modal */}
          {activeTrendModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-surface border border-outline-variant/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl flex flex-col gap-4">
                <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
                  <div>
                    <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">
                      TikTok Creative Center • Roteiro Gerado
                    </span>
                    <h3 className="text-lg font-bold text-on-surface">{activeTrendModal.name}</h3>
                  </div>
                  <button
                    onClick={() => setActiveTrendModal(null)}
                    className="p-1 rounded-lg hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface text-lg leading-none"
                  >
                    ✕
                  </button>
                </div>

                {generatingTrendScript ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-on-surface-variant">
                      Criando roteiro com gancho viral, cenas cronometradas e legenda com IA...
                    </p>
                  </div>
                ) : trendScriptResult ? (
                  <div className="flex flex-col gap-4">
                    {/* Gancho */}
                    <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                      <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block mb-1">
                        🎯 Gancho de Retenção (0 a 3 segundos)
                      </span>
                      <p className="text-sm font-semibold text-on-surface">{trendScriptResult.hook}</p>
                    </div>

                    {/* Roteiro por segundo */}
                    <div>
                      <span className="text-xs font-bold text-on-surface uppercase tracking-wider block mb-2">
                        🎬 Roteiro do Vídeo (Passo a Passo)
                      </span>
                      <div className="flex flex-col gap-2">
                        {trendScriptResult.scriptOutline?.map((scene: any, idx: number) => (
                          <div key={idx} className="p-3 bg-surface-container-low rounded-xl text-xs flex flex-col gap-1 border border-outline-variant/10">
                            <span className="font-bold text-primary">{scene.time}</span>
                            <div><strong>Visual:</strong> {scene.visual}</div>
                            <div><strong>Áudio/Fala:</strong> {scene.audio}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Dica de Áudio */}
                    {trendScriptResult.soundTip && (
                      <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs">
                        <strong className="text-amber-700 block mb-0.5">🎵 Dica de Trilha Sonora:</strong>
                        <span className="text-on-surface-variant">{trendScriptResult.soundTip}</span>
                      </div>
                    )}

                    {/* Legenda Pronta */}
                    <div>
                      <span className="text-xs font-bold text-on-surface uppercase tracking-wider block mb-1">
                        ✍️ Legenda Pronta com Hashtags
                      </span>
                      <div className="p-3.5 bg-surface-container-low rounded-xl text-xs whitespace-pre-wrap text-on-surface border border-outline-variant/20 font-body">
                        {trendScriptResult.caption}
                        {'\n\n'}
                        <span className="text-primary font-semibold">{trendScriptResult.hashtags}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 flex items-center justify-end gap-3 border-t border-outline-variant/20">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `GANCHO: ${trendScriptResult.hook}\n\nROTEIRO:\n${trendScriptResult.scriptOutline?.map((s: any) => `${s.time} - ${s.visual} | ${s.audio}`).join('\n')}\n\nLEGENDA:\n${trendScriptResult.caption}\n\n${trendScriptResult.hashtags}`
                          );
                          setCopiedScript(true);
                          setTimeout(() => setCopiedScript(false), 2000);
                        }}
                        className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-xs font-semibold transition-all flex items-center gap-1.5"
                      >
                        {copiedScript ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                        <span>{copiedScript ? 'Copiado!' : 'Copiar Roteiro'}</span>
                      </button>
                      <button
                        onClick={() => handleSendTrendToEditor(activeTrendModal, trendScriptResult)}
                        className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:opacity-95 transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <span>Abrir no Editor de Post</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: STRATEGY */}
      {activeTab === 'strategy' && (
        <div className="strategy-container">
          <div className="card strategy-card">
            <h2>Melhores Horários de Postagem para Salões de Beleza</h2>
            <p className="strategy-sub">
              Calculado com base nos picos de comportamento de clientes femininas em busca de agendamento
            </p>

            <div className="strategy-grid">
              {(strategyResult?.bestHours || [
                {
                  period: 'Manhã',
                  time: '08:30 - 09:30',
                  reason: 'Checagem matinal de stories no transporte e início do dia',
                },
                {
                  period: 'Horário de Almoço',
                  time: '12:00 - 13:30',
                  reason: 'Momento onde a maioria das clientes reserva horários de fim de semana',
                },
                {
                  period: 'Noite',
                  time: '19:30 - 21:30',
                  reason: 'Maior tempo de tela no Reels e maior taxa de comentários e saves',
                },
              ]).map((item, i) => (
                <div key={i} className="card hour-card">
                  <div className="hour-period">{item.period}</div>
                  <div className="hour-time">{item.time}</div>
                  <p className="hour-reason">{item.reason}</p>
                </div>
              ))}
            </div>

            <div className="golden-tip-box">
              <Sparkles size={22} className="golden-icon" />
              <div>
                <h4>Estratégia Semanal para Agenda Cheia</h4>
                <p>
                  {strategyResult?.goldenTip ||
                    'Concentre posts de transformação (antes/depois) na quarta e quinta-feira. Isso dispara o desejo e preenche todos os horários restantes para a sexta e sábado!'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .ai-page {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .ai-tabs {
          display: flex;
          gap: var(--space-2);
          border-bottom: 1px solid var(--color-border);
          padding-bottom: var(--space-2);
          overflow-x: auto;
        }

        .ai-tab-btn {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-3) var(--space-4);
          background: transparent;
          border: none;
          border-radius: var(--radius-md);
          font-family: var(--font-body);
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: all var(--transition-base);
          white-space: nowrap;
        }

        .ai-tab-btn:hover {
          color: var(--color-primary);
          background: var(--color-primary-50);
        }

        .ai-tab-btn.active {
          color: var(--color-primary);
          background: var(--color-primary-50);
          font-weight: 600;
        }

        .ai-layout {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: var(--space-6);
        }

        .ai-card-controls {
          padding: var(--space-6);
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .ai-section-title {
          font-size: 1.15rem;
          color: var(--color-text);
          font-weight: 600;
          margin-bottom: var(--space-2);
        }

        .btn-generate {
          width: 100%;
          justify-content: center;
          padding: var(--space-4);
          font-size: 0.95rem;
        }

        .ai-card-result {
          padding: var(--space-6);
          display: flex;
          flex-direction: column;
          background: #ffffff;
        }

        .copy-result-content {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .copy-result-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .caption-preview-box {
          background: var(--color-bg);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: var(--space-4);
        }

        .caption-text {
          font-family: var(--font-body);
          font-size: 0.925rem;
          line-height: 1.6;
          white-space: pre-wrap;
          color: var(--color-text);
        }

        .hashtags-box {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
          background: var(--color-primary-50);
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-md);
        }

        .hashtags-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--color-primary);
        }

        .hashtags-list {
          font-size: 0.85rem;
          color: var(--color-primary-dark);
          line-height: 1.5;
        }

        .hooks-box {
          font-size: 0.85rem;
          color: var(--color-text-secondary);
        }

        .hooks-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 600;
          color: var(--color-text);
          margin-bottom: var(--space-2);
        }

        .hooks-box ul {
          padding-left: var(--space-5);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .copy-footer-action {
          margin-top: var(--space-2);
          display: flex;
          justify-content: flex-end;
        }

        .empty-state-ai {
          margin: auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: var(--space-3);
          max-width: 420px;
          padding: var(--space-8) var(--space-4);
        }

        .empty-state-ai h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--color-text);
        }

        .empty-state-ai p {
          font-size: 0.875rem;
          color: var(--color-text-tertiary);
          line-height: 1.5;
        }

        /* Ideas Container */
        .ideas-container {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .ideas-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-4) var(--space-6);
        }

        .ideas-controls {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .ideas-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: var(--space-4);
        }

        .idea-card {
          padding: var(--space-5);
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .idea-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .idea-day {
          font-size: 0.8rem;
          color: var(--color-text-tertiary);
          font-weight: 500;
        }

        .idea-hook {
          font-size: 1rem;
          font-weight: 600;
          color: var(--color-text);
          line-height: 1.4;
        }

        .idea-body {
          font-size: 0.825rem;
          color: var(--color-text-secondary);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .idea-media-hint {
          color: var(--color-primary-dark);
        }

        .btn-use-idea {
          margin-top: auto;
          align-self: flex-start;
          padding: var(--space-1) var(--space-2);
        }

        /* Curation */
        .curation-container {
          padding: var(--space-8);
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .curation-header {
          display: flex;
          align-items: center;
          gap: var(--space-6);
        }

        .curation-score-circle {
          width: 80px;
          height: 80px;
          border-radius: var(--radius-full);
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .score-num {
          font-family: var(--font-display);
          font-size: 1.85rem;
          font-weight: 700;
          line-height: 1;
        }

        .score-max {
          font-size: 0.75rem;
          opacity: 0.8;
        }

        .curation-sub {
          color: var(--color-text-tertiary);
          font-size: 0.9rem;
        }

        .curation-insights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: var(--space-4);
        }

        .curation-item {
          padding: var(--space-5);
          display: flex;
          gap: var(--space-4);
        }

        .curation-item h4 {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--color-text);
          margin-bottom: 4px;
        }

        .curation-item p {
          font-size: 0.825rem;
          color: var(--color-text-secondary);
          line-height: 1.4;
        }

        .curation-recommendation {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          background: #fef8ec;
          border: 1px solid #fae8c6;
          border-radius: var(--radius-md);
          padding: var(--space-4) var(--space-5);
          color: #7c5819;
          font-size: 0.9rem;
        }

        /* Strategy */
        .strategy-container {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .strategy-card {
          padding: var(--space-8);
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .strategy-sub {
          color: var(--color-text-tertiary);
          font-size: 0.9rem;
          margin-top: -8px;
        }

        .strategy-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: var(--space-4);
        }

        .hour-card {
          padding: var(--space-5);
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }

        .hour-period {
          font-size: 0.8rem;
          text-transform: uppercase;
          color: var(--color-text-tertiary);
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .hour-time {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-primary);
        }

        .hour-reason {
          font-size: 0.8rem;
          color: var(--color-text-secondary);
          line-height: 1.35;
        }

        .golden-tip-box {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          background: linear-gradient(135deg, var(--color-primary-50) 0%, #ffffff 100%);
          border-left: 4px solid var(--color-primary);
          padding: var(--space-5) var(--space-6);
          border-radius: var(--radius-md);
        }

        .golden-icon {
          color: var(--color-primary);
          flex-shrink: 0;
        }

        .golden-tip-box h4 {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--color-text);
          margin-bottom: 4px;
        }

        .golden-tip-box p {
          font-size: 0.85rem;
          color: var(--color-text-secondary);
          line-height: 1.4;
        }

        @media (max-width: 900px) {
          .ai-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

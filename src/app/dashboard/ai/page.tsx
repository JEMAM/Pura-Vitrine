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
} from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'copy' | 'ideas' | 'curation' | 'strategy'>('copy');

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

'use client';

import { useState, useEffect } from 'react';
import {
  Scissors,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Eye,
  EyeOff,
  Key,
  RefreshCw,
  ExternalLink,
  Cpu,
  Zap,
  Check,
  Share2,
} from 'lucide-react';
import { InstagramIcon as Instagram, FacebookIcon as Facebook } from '@/components/icons';
import { AVAILABLE_GEMINI_MODELS } from '@/lib/gemini-models';

interface SalonSettings {
  salonName: string;
  phone: string;
  instagram: string;
  facebookPageName?: string;
  tone: string;
  targetAudience: string;
  services: string[];
  professionals: string[];
  instagramConnected: boolean;
  facebookConnected: boolean;
  geminiModel: string;
  instagramAccountId?: string;
  facebookPageId?: string;
}

interface ApiKeysState {
  GEMINI_API_KEY: string;
  META_APP_ID: string;
  META_APP_SECRET: string;
  INSTAGRAM_ACCOUNT_ID: string;
  INSTAGRAM_ACCESS_TOKEN: string;
  FACEBOOK_PAGE_ID: string;
  FACEBOOK_PAGE_ACCESS_TOKEN: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SalonSettings>({
    salonName: 'Studio Beleza & Elegância',
    phone: '(11) 98765-4321',
    instagram: '@studiobelezasp',
    facebookPageName: 'Studio Beleza & Elegância SP',
    tone: 'Elegante, acolhedor e focado em alta autoestima',
    targetAudience: 'Mulheres de 22 a 50 anos que valorizam cuidados pessoais e estética premium',
    services: ['Cabelos (Mechas, Cortes, Escova)', 'Unhas (Gel, Fibra, Esmaltação)', 'Estética Facial e Corporal', 'Sobrancelhas e Cílios'],
    professionals: ['Camila Rocha (Colorista)', 'Juliana Prado (Nail Designer)', 'Patrícia Mendes (Esteticista)'],
    instagramConnected: true,
    facebookConnected: true,
    geminiModel: 'gemini-3.6-flash',
    instagramAccountId: '',
    facebookPageId: '',
  });

  const [apiKeys, setApiKeys] = useState<ApiKeysState>({
    GEMINI_API_KEY: '',
    META_APP_ID: '',
    META_APP_SECRET: '',
    INSTAGRAM_ACCOUNT_ID: '',
    INSTAGRAM_ACCESS_TOKEN: '',
    FACEBOOK_PAGE_ID: '',
    FACEBOOK_PAGE_ACCESS_TOKEN: '',
  });

  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({
    GEMINI_API_KEY: false,
    META_APP_SECRET: false,
    INSTAGRAM_ACCESS_TOKEN: false,
    FACEBOOK_PAGE_ACCESS_TOKEN: false,
  });

  const [servicesInput, setServicesInput] = useState('');
  const [professionalsInput, setProfessionalsInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);
  const [savedError, setSavedError] = useState<string | null>(null);

  // Social account switch modals/panels
  const [editingSocial, setEditingSocial] = useState<'instagram' | 'facebook' | null>(null);

  // AI Connection Test state
  const [testingAi, setTestingAi] = useState(false);
  const [aiTestResult, setAiTestResult] = useState<{
    success: boolean;
    message: string;
    modelUsed?: string;
    latency?: string;
    response?: string;
  } | null>(null);

  // Load settings and API keys on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [settingsRes, keysRes] = await Promise.all([
          fetch('/api/settings').then((r) => (r.ok ? r.json() : null)),
          fetch('/api/env-keys').then((r) => (r.ok ? r.json() : null)),
        ]);

        if (settingsRes?.settings) {
          const s = settingsRes.settings;
          setSettings((prev) => ({
            ...prev,
            ...s,
            geminiModel: s.geminiModel || 'gemini-3.6-flash',
          }));
          setServicesInput(s.services?.join(', ') || '');
          setProfessionalsInput(s.professionals?.join(', ') || '');
        }

        if (keysRes?.keys) {
          const k = keysRes.keys;
          setApiKeys({
            GEMINI_API_KEY: k.GEMINI_API_KEY?.rawValue || '',
            META_APP_ID: k.META_APP_ID?.value || '',
            META_APP_SECRET: k.META_APP_SECRET?.rawValue || '',
            INSTAGRAM_ACCOUNT_ID: k.INSTAGRAM_ACCOUNT_ID?.value || '',
            INSTAGRAM_ACCESS_TOKEN: k.INSTAGRAM_ACCESS_TOKEN?.rawValue || '',
            FACEBOOK_PAGE_ID: k.FACEBOOK_PAGE_ID?.value || '',
            FACEBOOK_PAGE_ACCESS_TOKEN: k.FACEBOOK_PAGE_ACCESS_TOKEN?.rawValue || '',
          });

          // Sync IDs to settings if empty
          setSettings((prev) => ({
            ...prev,
            instagramAccountId: prev.instagramAccountId || k.INSTAGRAM_ACCOUNT_ID?.value || '',
            facebookPageId: prev.facebookPageId || k.FACEBOOK_PAGE_ID?.value || '',
          }));
        }
      } catch (err) {
        console.error('Fetch settings/keys error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const toggleShowKey = (field: string) => {
    setShowKeys((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSaveAll = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(null);
    setSavedError(null);

    const updatedSettings: SalonSettings = {
      ...settings,
      services: servicesInput.split(',').map((s) => s.trim()).filter(Boolean),
      professionals: professionalsInput.split(',').map((p) => p.trim()).filter(Boolean),
      instagramAccountId: apiKeys.INSTAGRAM_ACCOUNT_ID,
      facebookPageId: apiKeys.FACEBOOK_PAGE_ID,
    };

    try {
      // 1. Save Settings to memoryStore / session
      const settingsPromise = fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings),
      });

      // 2. Save API keys to .env.local
      const keysPromise = fetch('/api/env-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiKeys),
      });

      const [resSettings, resKeys] = await Promise.all([settingsPromise, keysPromise]);

      if (resSettings.ok && resKeys.ok) {
        setSettings(updatedSettings);
        setSavedSuccess('Todas as configurações, contas de redes sociais e chaves de API foram salvas com sucesso!');
        setEditingSocial(null);
        setTimeout(() => setSavedSuccess(null), 5000);
      } else {
        const errorData = await resKeys.json().catch(() => ({}));
        setSavedError(errorData.error || 'Erro ao persistir configurações ou chaves de API.');
      }
    } catch (err: any) {
      console.error('Save error:', err);
      setSavedError('Falha na comunicação com o servidor ao salvar as alterações.');
    } finally {
      setSaving(false);
    }
  };

  const toggleConnection = (platform: 'instagramConnected' | 'facebookConnected') => {
    setSettings((prev) => ({
      ...prev,
      [platform]: !prev[platform],
    }));
  };

  const handleTestAiConnection = async () => {
    setTestingAi(true);
    setAiTestResult(null);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentType: 'test-connection',
          model: settings.geminiModel,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAiTestResult({
          success: true,
          message: data.message || 'Conexão confirmada com sucesso!',
          modelUsed: data.modelUsed,
          latency: data.latency,
          response: data.response,
        });
      } else {
        setAiTestResult({
          success: false,
          message: data.error || 'Falha ao responder com o modelo Gemini selecionado.',
        });
      }
    } catch (err: any) {
      setAiTestResult({
        success: false,
        message: 'Erro ao conectar à API do Google Gemini. Verifique a chave de API.',
      });
    } finally {
      setTestingAi(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="animate-spin text-primary" size={32} />
          <p className="text-sm text-text-secondary">Carregando configurações e credenciais...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-page max-w-[1360px] mx-auto w-full px-4 lg:px-8 pb-16">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Configurações do <span className="text-gradient">Salão</span>
          </h1>
          <p className="page-description">
            Gerencie o modelo de IA do Google, troca das contas das redes sociais e chaves de API
          </p>
        </div>
      </div>

      {/* Alerts */}
      {savedSuccess && (
        <div className="alert-saved animate-fade-in">
          <CheckCircle2 size={18} className="shrink-0 text-success" />
          <span>{savedSuccess}</span>
        </div>
      )}

      {savedError && (
        <div className="alert-error animate-fade-in">
          <AlertCircle size={18} className="shrink-0 text-error" />
          <span>{savedError}</span>
        </div>
      )}

      <form onSubmit={handleSaveAll} className="settings-grid">
        {/* Left Column: AI Model Selection & API Keys */}
        <div className="settings-col-left flex flex-col gap-6">
          {/* Card 1: Escolha da IA do Google */}
          <div className="card settings-card">
            <div className="card-header-row">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h2 className="card-heading">Escolha da IA do Google</h2>
                  <p className="text-xs text-text-tertiary">Selecione o modelo Gemini para geração de copy, tendências e ideias</p>
                </div>
              </div>
              <span className="badge-model-active">
                Ativo: {settings.geminiModel === 'gemini-3.7-flash' ? 'Gemini 3.7 Flash' : 'Gemini 3.6 Flash'}
              </span>
            </div>

            {/* Radio Cards for Gemini 3.6 Flash vs Gemini 3.7 Flash */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
              {AVAILABLE_GEMINI_MODELS.map((model) => {
                const isSelected = settings.geminiModel === model.id;
                return (
                  <div
                    key={model.id}
                    onClick={() => setSettings({ ...settings, geminiModel: model.id })}
                    className={`model-card cursor-pointer transition-all ${
                      isSelected ? 'model-card-selected' : 'model-card-normal'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'border-primary bg-primary text-white'
                              : 'border-border bg-surface'
                          }`}
                        >
                          {isSelected && <Check size={12} strokeWidth={3} />}
                        </div>
                        <span className="font-bold text-sm text-text">{model.name}</span>
                      </div>
                      {model.badge && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            model.recommended
                              ? 'bg-success-bg text-success border border-success/30'
                              : 'bg-primary-50 text-primary border border-primary/30'
                          }`}
                        >
                          {model.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-secondary leading-relaxed pl-7">{model.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Test Connection Button & Status */}
            <div className="mt-3 p-3.5 rounded-xl bg-bg-secondary border border-border-light flex flex-col gap-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Cpu size={16} className="text-primary" />
                  <span className="text-xs font-semibold text-text">
                    Diagnóstico de Conectividade ({settings.geminiModel})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleTestAiConnection}
                  disabled={testingAi}
                  className="btn btn-sm btn-outline flex items-center gap-1.5 text-xs py-1.5 px-3"
                >
                  <RefreshCw size={13} className={testingAi ? 'animate-spin' : ''} />
                  <span>{testingAi ? 'Testando Conexão...' : 'Testar Conexão com a IA'}</span>
                </button>
              </div>

              {aiTestResult && (
                <div
                  className={`p-3 rounded-lg text-xs flex items-start gap-2.5 animate-fade-in ${
                    aiTestResult.success
                      ? 'bg-success-bg text-success border border-success/30'
                      : 'bg-error-bg text-error border border-error/30'
                  }`}
                >
                  {aiTestResult.success ? (
                    <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-success" />
                  ) : (
                    <AlertCircle size={16} className="shrink-0 mt-0.5 text-error" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold">{aiTestResult.message}</p>
                    {aiTestResult.success && (
                      <p className="mt-1 text-[11px] opacity-90">
                        Modelo respondendo: <strong>{aiTestResult.modelUsed}</strong> • Latência:{' '}
                        <strong>{aiTestResult.latency}</strong>
                        {aiTestResult.response && ` — "${aiTestResult.response}"`}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Chaves de API & Credenciais (.env.local) */}
          <div className="card settings-card">
            <div className="card-header-row">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-accent-light/30 flex items-center justify-center text-accent-dark">
                  <Key size={18} />
                </div>
                <div>
                  <h2 className="card-heading">Chaves de API & Credenciais do Sistema</h2>
                  <p className="text-xs text-text-tertiary">
                    Persistidas com segurança no arquivo <code className="text-primary font-mono">.env.local</code>
                  </p>
                </div>
              </div>
            </div>

            {/* Google Gemini API Key */}
            <div className="p-4 rounded-xl bg-bg border border-border-light flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-primary" />
                  <label className="text-xs font-bold text-text">Google Gemini API Key</label>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      apiKeys.GEMINI_API_KEY
                        ? 'bg-success-bg text-success border border-success/30'
                        : 'bg-warning-bg text-warning border border-warning/30'
                    }`}
                  >
                    {apiKeys.GEMINI_API_KEY ? 'Configurada' : 'Chave Pendente'}
                  </span>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-primary hover:underline flex items-center gap-1 font-semibold"
                  >
                    Obter Chave <ExternalLink size={11} />
                  </a>
                </div>
              </div>

              <div className="relative">
                <input
                  type={showKeys.GEMINI_API_KEY ? 'text' : 'password'}
                  className="input font-mono text-xs pr-10"
                  placeholder="AIzaSy..."
                  value={apiKeys.GEMINI_API_KEY}
                  onChange={(e) => setApiKeys({ ...apiKeys, GEMINI_API_KEY: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => toggleShowKey('GEMINI_API_KEY')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text p-1"
                  title={showKeys.GEMINI_API_KEY ? 'Ocultar' : 'Exibir'}
                >
                  {showKeys.GEMINI_API_KEY ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-[11px] text-text-tertiary">
                Utilizada para operar os agentes de Copywriting, Roteiros de Vídeo Viral e Pinterest Studio.
              </p>
            </div>

            {/* Meta Graph API Credentials (Instagram & Facebook) */}
            <div className="p-4 rounded-xl bg-bg border border-border-light flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-border-light pb-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-info" />
                  <span className="text-xs font-bold text-text">Meta Graph API (Instagram & Facebook)</span>
                </div>
                <a
                  href="https://developers.facebook.com/apps/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-primary hover:underline flex items-center gap-1 font-semibold"
                >
                  Meta for Developers <ExternalLink size={11} />
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="input-group">
                  <label className="input-label text-xs">META_APP_ID</label>
                  <input
                    type="text"
                    className="input font-mono text-xs"
                    placeholder="Ex: 123456789012345"
                    value={apiKeys.META_APP_ID}
                    onChange={(e) => setApiKeys({ ...apiKeys, META_APP_ID: e.target.value })}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label text-xs">META_APP_SECRET</label>
                  <div className="relative">
                    <input
                      type={showKeys.META_APP_SECRET ? 'text' : 'password'}
                      className="input font-mono text-xs pr-10"
                      placeholder="Chave secreta do aplicativo"
                      value={apiKeys.META_APP_SECRET}
                      onChange={(e) => setApiKeys({ ...apiKeys, META_APP_SECRET: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowKey('META_APP_SECRET')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text p-1"
                    >
                      {showKeys.META_APP_SECRET ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="input-group">
                  <label className="input-label text-xs">INSTAGRAM_ACCOUNT_ID</label>
                  <input
                    type="text"
                    className="input font-mono text-xs"
                    placeholder="ID da conta profissional"
                    value={apiKeys.INSTAGRAM_ACCOUNT_ID}
                    onChange={(e) => {
                      setApiKeys({ ...apiKeys, INSTAGRAM_ACCOUNT_ID: e.target.value });
                      setSettings((prev) => ({ ...prev, instagramAccountId: e.target.value }));
                    }}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label text-xs">INSTAGRAM_ACCESS_TOKEN</label>
                  <div className="relative">
                    <input
                      type={showKeys.INSTAGRAM_ACCESS_TOKEN ? 'text' : 'password'}
                      className="input font-mono text-xs pr-10"
                      placeholder="Token de acesso da conta"
                      value={apiKeys.INSTAGRAM_ACCESS_TOKEN}
                      onChange={(e) => setApiKeys({ ...apiKeys, INSTAGRAM_ACCESS_TOKEN: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowKey('INSTAGRAM_ACCESS_TOKEN')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text p-1"
                    >
                      {showKeys.INSTAGRAM_ACCESS_TOKEN ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="input-group">
                  <label className="input-label text-xs">FACEBOOK_PAGE_ID</label>
                  <input
                    type="text"
                    className="input font-mono text-xs"
                    placeholder="ID numérico da página"
                    value={apiKeys.FACEBOOK_PAGE_ID}
                    onChange={(e) => {
                      setApiKeys({ ...apiKeys, FACEBOOK_PAGE_ID: e.target.value });
                      setSettings((prev) => ({ ...prev, facebookPageId: e.target.value }));
                    }}
                  />
                </div>

                <div className="input-group">
                  <label className="input-label text-xs">FACEBOOK_PAGE_ACCESS_TOKEN</label>
                  <div className="relative">
                    <input
                      type={showKeys.FACEBOOK_PAGE_ACCESS_TOKEN ? 'text' : 'password'}
                      className="input font-mono text-xs pr-10"
                      placeholder="Token de acesso da página"
                      value={apiKeys.FACEBOOK_PAGE_ACCESS_TOKEN}
                      onChange={(e) => setApiKeys({ ...apiKeys, FACEBOOK_PAGE_ACCESS_TOKEN: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowKey('FACEBOOK_PAGE_ACCESS_TOKEN')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text p-1"
                    >
                      {showKeys.FACEBOOK_PAGE_ACCESS_TOKEN ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Salon Brand Identity & Social Accounts Switch */}
        <div className="settings-col-right flex flex-col gap-6">
          {/* Card 3: Troca das Contas das Redes Sociais */}
          <div className="card settings-card">
            <div className="card-header-row">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-info-bg flex items-center justify-center text-info">
                  <Share2 size={18} />
                </div>
                <div>
                  <h2 className="card-heading">Troca & Conexão de Contas Sociais</h2>
                  <p className="text-xs text-text-tertiary">Alterne perfis, páginas e vincule novas contas de publicação</p>
                </div>
              </div>
            </div>

            {/* Instagram Account Card */}
            <div className="social-connection-item">
              <div className="social-item-left">
                <div className="social-icon-box bg-ig shadow-sm">
                  <Instagram size={22} color="white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm text-text">Instagram Profissional</h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                        settings.instagramConnected
                          ? 'bg-success-bg text-success'
                          : 'bg-bg-tertiary text-text-tertiary'
                      }`}
                    >
                      {settings.instagramConnected ? 'Conectado' : 'Desconectado'}
                    </span>
                  </div>
                  <p className="text-xs text-primary font-medium mt-0.5">
                    {settings.instagram || '@perfil_nao_definido'}
                  </p>
                  <p className="social-status-sub">
                    {apiKeys.INSTAGRAM_ACCOUNT_ID
                      ? `ID da Conta: ${apiKeys.INSTAGRAM_ACCOUNT_ID}`
                      : 'Nenhum ID da Meta vinculado'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline text-xs"
                  onClick={() => setEditingSocial(editingSocial === 'instagram' ? null : 'instagram')}
                >
                  {editingSocial === 'instagram' ? 'Fechar' : 'Trocar Conta'}
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${settings.instagramConnected ? 'btn-danger' : 'btn-primary'}`}
                  onClick={() => toggleConnection('instagramConnected')}
                >
                  {settings.instagramConnected ? 'Desconectar' : 'Conectar'}
                </button>
              </div>
            </div>

            {/* Switch Instagram Account Sub-Panel */}
            {editingSocial === 'instagram' && (
              <div className="p-4 rounded-xl bg-bg border border-primary/20 flex flex-col gap-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-primary flex items-center gap-1.5">
                    <Instagram size={14} /> Trocar Conta do Instagram
                  </h5>
                  <span className="text-[11px] text-text-tertiary">Atualiza perfil e tokens associados</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="input-group">
                    <label className="input-label text-xs">Nome / @ da Conta</label>
                    <input
                      type="text"
                      className="input text-xs"
                      placeholder="@seu_novo_salao"
                      value={settings.instagram}
                      onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label text-xs">Instagram Account ID (Meta)</label>
                    <input
                      type="text"
                      className="input font-mono text-xs"
                      placeholder="178414..."
                      value={apiKeys.INSTAGRAM_ACCOUNT_ID}
                      onChange={(e) => {
                        setApiKeys({ ...apiKeys, INSTAGRAM_ACCOUNT_ID: e.target.value });
                        setSettings((prev) => ({ ...prev, instagramAccountId: e.target.value }));
                      }}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label text-xs">Novo Token de Acesso (Access Token)</label>
                  <input
                    type="password"
                    className="input font-mono text-xs"
                    placeholder="EAAB..."
                    value={apiKeys.INSTAGRAM_ACCESS_TOKEN}
                    onChange={(e) => setApiKeys({ ...apiKeys, INSTAGRAM_ACCESS_TOKEN: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Facebook Page Card */}
            <div className="social-connection-item">
              <div className="social-item-left">
                <div className="social-icon-box bg-fb shadow-sm">
                  <Facebook size={22} color="white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm text-text">Página do Facebook</h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                        settings.facebookConnected
                          ? 'bg-success-bg text-success'
                          : 'bg-bg-tertiary text-text-tertiary'
                      }`}
                    >
                      {settings.facebookConnected ? 'Conectado' : 'Desconectado'}
                    </span>
                  </div>
                  <p className="text-xs text-primary font-medium mt-0.5">
                    {settings.facebookPageName || 'Página do Salão'}
                  </p>
                  <p className="social-status-sub">
                    {apiKeys.FACEBOOK_PAGE_ID
                      ? `ID da Página: ${apiKeys.FACEBOOK_PAGE_ID}`
                      : 'Nenhum Page ID vinculado'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="btn btn-sm btn-outline text-xs"
                  onClick={() => setEditingSocial(editingSocial === 'facebook' ? null : 'facebook')}
                >
                  {editingSocial === 'facebook' ? 'Fechar' : 'Trocar Conta'}
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${settings.facebookConnected ? 'btn-danger' : 'btn-primary'}`}
                  onClick={() => toggleConnection('facebookConnected')}
                >
                  {settings.facebookConnected ? 'Desconectar' : 'Conectar'}
                </button>
              </div>
            </div>

            {/* Switch Facebook Page Sub-Panel */}
            {editingSocial === 'facebook' && (
              <div className="p-4 rounded-xl bg-bg border border-info/20 flex flex-col gap-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-info flex items-center gap-1.5">
                    <Facebook size={14} /> Trocar Página do Facebook
                  </h5>
                  <span className="text-[11px] text-text-tertiary">Atualiza página e tokens do Meta Graph</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="input-group">
                    <label className="input-label text-xs">Nome da Página</label>
                    <input
                      type="text"
                      className="input text-xs"
                      placeholder="Studio Beleza Oficial"
                      value={settings.facebookPageName || ''}
                      onChange={(e) => setSettings({ ...settings, facebookPageName: e.target.value })}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label text-xs">Facebook Page ID</label>
                    <input
                      type="text"
                      className="input font-mono text-xs"
                      placeholder="109823..."
                      value={apiKeys.FACEBOOK_PAGE_ID}
                      onChange={(e) => {
                        setApiKeys({ ...apiKeys, FACEBOOK_PAGE_ID: e.target.value });
                        setSettings((prev) => ({ ...prev, facebookPageId: e.target.value }));
                      }}
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label text-xs">Novo Token de Acesso da Página (Page Access Token)</label>
                  <input
                    type="password"
                    className="input font-mono text-xs"
                    placeholder="EAAB..."
                    value={apiKeys.FACEBOOK_PAGE_ACCESS_TOKEN}
                    onChange={(e) => setApiKeys({ ...apiKeys, FACEBOOK_PAGE_ACCESS_TOKEN: e.target.value })}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Card 4: Identidade & Perfil do Salão */}
          <div className="card settings-card">
            <div className="card-header-row">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary">
                  <Scissors size={18} />
                </div>
                <div>
                  <h2 className="card-heading">Identidade & Perfil do Salão</h2>
                  <p className="text-xs text-text-tertiary">Dados do negócio para calibrar os agentes de IA</p>
                </div>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Nome Oficial do Salão / Estúdio</label>
              <input
                type="text"
                className="input"
                value={settings.salonName}
                onChange={(e) => setSettings({ ...settings, salonName: e.target.value })}
                required
              />
            </div>

            <div className="form-row-2">
              <div className="input-group">
                <label className="input-label">WhatsApp Comercial</label>
                <input
                  type="text"
                  className="input"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Instagram do Salão</label>
                <input
                  type="text"
                  className="input"
                  value={settings.instagram}
                  onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Tom de Voz Padrão para os Agentes de IA</label>
              <select
                className="select"
                value={settings.tone}
                onChange={(e) => setSettings({ ...settings, tone: e.target.value })}
              >
                <option value="Elegante, acolhedor e focado em alta autoestima">
                  Elegante, acolhedor e focado em alta autoestima (Salão Premium)
                </option>
                <option value="Descontraído, amigável e com linguagem próxima">
                  Descontraído, jovem e com linguagem próxima
                </option>
                <option value="Técnico, especialista e didático">
                  Técnico, especialista e didático (Foco em autoridade e saúde capilar)
                </option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Público-Alvo Principal</label>
              <textarea
                className="textarea"
                rows={2}
                value={settings.targetAudience}
                onChange={(e) => setSettings({ ...settings, targetAudience: e.target.value })}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Serviços Oferecidos (separados por vírgula)</label>
              <input
                type="text"
                className="input"
                placeholder="Cabelos, Unhas em Gel, Estética Facial, Maquiagem..."
                value={servicesInput}
                onChange={(e) => setServicesInput(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Profissionais da Equipe (para marcações e tags)</label>
              <input
                type="text"
                className="input"
                placeholder="Camila (Colorista), Juliana (Nail Designer)..."
                value={professionalsInput}
                onChange={(e) => setProfessionalsInput(e.target.value)}
              />
            </div>
          </div>

          {/* Unified Save Action */}
          <div className="sticky bottom-6 z-10 p-2 rounded-2xl bg-surface/80 backdrop-blur-md border border-border shadow-lg">
            <button
              type="submit"
              className="btn btn-primary btn-save-settings w-full flex items-center justify-center gap-2 py-3.5 text-sm font-bold shadow-md cursor-pointer"
              disabled={saving}
            >
              <Save size={18} />
              <span>{saving ? 'Salvando Alterações e Chaves...' : 'Salvar Todas as Configurações'}</span>
            </button>
          </div>
        </div>
      </form>

      <style>{`
        .settings-page {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .alert-saved {
          background: #edf7f1;
          color: #276749;
          border: 1px solid #c6f6d5;
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          gap: var(--space-3);
          font-size: 0.9rem;
          font-weight: 500;
        }

        .alert-error {
          background: #fdf0f0;
          color: #9b2c2c;
          border: 1px solid #feb2b2;
          padding: var(--space-3) var(--space-4);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          gap: var(--space-3);
          font-size: 0.9rem;
          font-weight: 500;
        }

        .settings-grid {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: var(--space-6);
        }

        .settings-card {
          padding: var(--space-6);
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .card-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--color-border-light);
          padding-bottom: var(--space-3);
          flex-wrap: wrap;
          gap: var(--space-2);
        }

        .card-heading {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--color-text);
        }

        .badge-model-active {
          font-size: 0.725rem;
          font-weight: 700;
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-full);
          background: var(--color-primary-50);
          color: var(--color-primary);
          border: 1px solid var(--color-primary-200);
        }

        .model-card {
          padding: var(--space-4);
          border-radius: var(--radius-lg);
          border: 1.5px solid var(--color-border);
          background: var(--color-surface);
        }

        .model-card:hover {
          border-color: var(--color-primary-light);
          transform: translateY(-1px);
        }

        .model-card-selected {
          border-color: var(--color-primary);
          background: var(--color-primary-50);
          box-shadow: 0 4px 12px rgba(183, 110, 121, 0.12);
        }

        .model-card-normal {
          background: var(--color-surface);
        }

        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-4);
        }

        .social-connection-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-4);
          border-radius: var(--radius-lg);
          background: var(--color-bg);
          border: 1px solid var(--color-border-light);
          flex-wrap: wrap;
          gap: var(--space-3);
        }

        .social-item-left {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .social-icon-box {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .bg-ig {
          background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
        }

        .bg-fb {
          background: #1877f2;
        }

        .social-status-sub {
          font-size: 0.75rem;
          color: var(--color-text-tertiary);
          margin-top: 2px;
        }

        @media (max-width: 960px) {
          .settings-grid {
            grid-template-columns: 1fr;
          }
          .form-row-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Sparkles, Key, CheckCircle2, ExternalLink, ChevronDown, ChevronUp, Save } from 'lucide-react';

interface EnvKeysState {
  GEMINI_API_KEY: string;
  META_APP_ID: string;
  META_APP_SECRET: string;
  INSTAGRAM_ACCOUNT_ID: string;
  INSTAGRAM_ACCESS_TOKEN: string;
  FACEBOOK_PAGE_ID: string;
  FACEBOOK_PAGE_ACCESS_TOKEN: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // API Keys Drawer State
  const [showApiKeysModal, setShowApiKeysModal] = useState(false);
  const [loadingKeys, setLoadingKeys] = useState(false);
  const [savingKeys, setSavingKeys] = useState(false);
  const [keysFeedback, setKeysFeedback] = useState<string | null>(null);

  const [keys, setKeys] = useState<EnvKeysState>({
    GEMINI_API_KEY: '',
    META_APP_ID: '',
    META_APP_SECRET: '',
    INSTAGRAM_ACCOUNT_ID: '',
    INSTAGRAM_ACCESS_TOKEN: '',
    FACEBOOK_PAGE_ID: '',
    FACEBOOK_PAGE_ACCESS_TOKEN: '',
  });

  const [geminiConfigured, setGeminiConfigured] = useState(false);

  // Load existing keys from .env.local
  useEffect(() => {
    fetch('/api/env-keys')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.keys) {
          setGeminiConfigured(data.keys.GEMINI_API_KEY?.isConfigured || false);
          setKeys({
            GEMINI_API_KEY: data.keys.GEMINI_API_KEY?.rawValue || '',
            META_APP_ID: data.keys.META_APP_ID?.value || '',
            META_APP_SECRET: data.keys.META_APP_SECRET?.rawValue || '',
            INSTAGRAM_ACCOUNT_ID: data.keys.INSTAGRAM_ACCOUNT_ID?.value || '',
            INSTAGRAM_ACCESS_TOKEN: data.keys.INSTAGRAM_ACCESS_TOKEN?.rawValue || '',
            FACEBOOK_PAGE_ID: data.keys.FACEBOOK_PAGE_ID?.value || '',
            FACEBOOK_PAGE_ACCESS_TOKEN: data.keys.FACEBOOK_PAGE_ACCESS_TOKEN?.rawValue || '',
          });
        }
      })
      .catch((err) => console.error('Erro ao ler chaves:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Credenciais inválidas');
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('Erro ao conectar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveKeys = async () => {
    setSavingKeys(true);
    setKeysFeedback(null);
    try {
      const res = await fetch('/api/env-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(keys),
      });

      const data = await res.json();
      if (res.ok) {
        setKeysFeedback('Chaves salvas com sucesso no arquivo .env.local!');
        if (keys.GEMINI_API_KEY) setGeminiConfigured(true);
        setTimeout(() => setKeysFeedback(null), 4000);
      } else {
        setKeysFeedback(data.error || 'Erro ao salvar chaves');
      }
    } catch {
      setKeysFeedback('Erro na conexão ao salvar chaves.');
    } finally {
      setSavingKeys(false);
    }
  };

  return (
    <div className="login-page">
      {/* Background decoration */}
      <div className="login-bg">
        <div className="login-bg-orb login-bg-orb-1" />
        <div className="login-bg-orb login-bg-orb-2" />
        <div className="login-bg-orb login-bg-orb-3" />
      </div>

      <div className="login-container animate-scale-in">
        {/* Brand Header with Pura Vitrine Logo */}
        <div className="login-brand flex flex-col items-center text-center">
          <img
            src="/logo.png"
            alt="Pura Vitrine - Marketing para Salões"
            className="h-28 w-auto max-w-[280px] object-contain mb-3"
          />
          <h1 className="login-title text-xl font-bold text-on-surface">
            Pura Vitrine <span className="text-gradient">Marketing</span>
          </h1>
          <p className="login-subtitle text-xs text-on-surface-variant">
            Plataforma Inteligente de Gestão de Mídias e IA para Salões
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="email" className="input-label text-xs font-semibold">
              E-mail de Acesso
            </label>
            <input
              id="email"
              type="email"
              className="input text-sm"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              autoFocus
            />
          </div>

          <div className="input-group">
            <label htmlFor="password" className="input-label text-xs font-semibold">
              Senha
            </label>
            <div className="login-password-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="input text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <div className="login-error animate-slide-down text-xs">{error}</div>}

          <button type="submit" className="btn btn-primary btn-lg login-submit" disabled={loading}>
            {loading ? (
              <span className="login-spinner" />
            ) : (
              <>
                <Sparkles size={18} />
                Entrar no Sistema
              </>
            )}
          </button>
        </form>

        <p className="login-hint text-center mt-3 text-xs text-on-surface-variant">
          Acesso padrão: <strong>admin@salao.com</strong> / <strong>admin123</strong>
        </p>

        {/* API Keys Drawer Toggle Button */}
        <div className="mt-5 pt-4 border-t border-outline-variant/30 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => setShowApiKeysModal(!showApiKeysModal)}
            className="w-full py-2.5 px-3 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-title-md text-xs font-semibold flex items-center justify-between transition-colors border border-outline-variant/20"
          >
            <div className="flex items-center gap-2">
              <Key size={16} className="text-primary" />
              <span>Configurar Chaves de API (.env.local)</span>
            </div>
            <div className="flex items-center gap-1.5">
              {geminiConfigured && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Gemini Ativo
                </span>
              )}
              {showApiKeysModal ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </button>
        </div>
      </div>

      {/* Expandable API Keys Configuration Modal / Card */}
      {showApiKeysModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface-container-lowest max-w-2xl w-full rounded-3xl p-6 shadow-2xl border border-outline-variant/30 max-h-[90vh] overflow-y-auto flex flex-col gap-5 my-auto animate-scale-in">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-outline-variant/20">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                  <Key size={16} />
                  <span>Configuração de Variáveis de Ambiente</span>
                </div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface text-xl font-bold mt-1">
                  Chaves de API &amp; Integrações (.env.local)
                </h2>
                <p className="text-body-sm text-xs text-on-surface-variant mt-0.5">
                  Preencha suas chaves abaixo para salvar diretamente no arquivo <code>.env.local</code> com 1 clique.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowApiKeysModal(false)}
                className="w-8 h-8 rounded-full bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface-variant transition-colors"
              >
                ✕
              </button>
            </div>

            {keysFeedback && (
              <div
                className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  keysFeedback.includes('sucesso')
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'bg-red-50 text-red-900 border border-red-200'
                }`}
              >
                <CheckCircle2 size={16} />
                <span>{keysFeedback}</span>
              </div>
            )}

            {/* Section 1: Google Gemini API */}
            <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xs">
                    AI
                  </span>
                  <span className="font-bold text-sm text-on-surface">1. Google Gemini API (IA de Copy &amp; Posts)</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Gratuito • Essencial
                </span>
              </div>

              <div className="text-xs text-on-surface-variant bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/15 flex flex-col gap-1.5 leading-relaxed">
                <strong className="text-primary flex items-center gap-1">
                  <ExternalLink size={12} /> Como conseguir sua chave gratuitamente:
                </strong>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>
                    Acesse o Google AI Studio em:{' '}
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline font-semibold"
                    >
                      aistudio.google.com/app/apikey
                    </a>
                  </li>
                  <li>Faça login com qualquer conta Google (Gmail).</li>
                  <li>Clique no botão azul <strong>&ldquo;Create API key&rdquo;</strong>.</li>
                  <li>Copie o código gerado (começa com <code>AQ...</code> ou similar) e cole no campo abaixo:</li>
                </ol>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-on-surface">GEMINI_API_KEY</label>
                <input
                  type="text"
                  value={keys.GEMINI_API_KEY}
                  onChange={(e) => setKeys({ ...keys, GEMINI_API_KEY: e.target.value })}
                  placeholder="Cole sua GEMINI_API_KEY aqui"
                  className="w-full bg-surface-container-lowest rounded-xl p-2.5 text-xs text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono"
                />
              </div>
            </div>

            {/* Section 2: Meta / Instagram Graph API */}
            <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xs">
                    IG
                  </span>
                  <span className="font-bold text-sm text-on-surface">
                    2. Meta &amp; Instagram Graph API (Publicação Automática)
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant text-[10px] font-semibold">
                  Opcional (para agendamento real)
                </span>
              </div>

              <div className="text-xs text-on-surface-variant bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/15 flex flex-col gap-1.5 leading-relaxed">
                <strong className="text-secondary flex items-center gap-1">
                  <ExternalLink size={12} /> Como conseguir as credenciais da Meta:
                </strong>
                <ol className="list-decimal pl-4 space-y-1">
                  <li>
                    Acesse o portal de desenvolvedores em:{' '}
                    <a
                      href="https://developers.facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary underline font-semibold"
                    >
                      developers.facebook.com
                    </a>
                  </li>
                  <li>Crie um Aplicativo do tipo <strong>&ldquo;Empresarial / Business&rdquo;</strong>.</li>
                  <li>No menu lateral, vá em <strong>Configurações &gt; Básico</strong> para copiar o <strong>App ID</strong> e a <strong>Chave Secreta</strong>.</li>
                  <li>
                    No <strong>Graph API Explorer</strong>, vincule a conta comercial do Instagram (ex: <code>@salaobelezapuracampinas</code>) e gere o Token com permissões <code>instagram_basic</code> e <code>instagram_content_publish</code>.
                  </li>
                </ol>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface">META_APP_ID</label>
                  <input
                    type="text"
                    value={keys.META_APP_ID}
                    onChange={(e) => setKeys({ ...keys, META_APP_ID: e.target.value })}
                    placeholder="Ex: 123456789012345"
                    className="w-full bg-surface-container-lowest rounded-xl p-2.5 text-xs text-on-surface border border-outline-variant/30 font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface">META_APP_SECRET</label>
                  <input
                    type="password"
                    value={keys.META_APP_SECRET}
                    onChange={(e) => setKeys({ ...keys, META_APP_SECRET: e.target.value })}
                    placeholder="Chave secreta do app"
                    className="w-full bg-surface-container-lowest rounded-xl p-2.5 text-xs text-on-surface border border-outline-variant/30 font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface">INSTAGRAM_ACCOUNT_ID</label>
                  <input
                    type="text"
                    value={keys.INSTAGRAM_ACCOUNT_ID}
                    onChange={(e) => setKeys({ ...keys, INSTAGRAM_ACCOUNT_ID: e.target.value })}
                    placeholder="ID numérico da conta IG"
                    className="w-full bg-surface-container-lowest rounded-xl p-2.5 text-xs text-on-surface border border-outline-variant/30 font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface">INSTAGRAM_ACCESS_TOKEN</label>
                  <input
                    type="password"
                    value={keys.INSTAGRAM_ACCESS_TOKEN}
                    onChange={(e) => setKeys({ ...keys, INSTAGRAM_ACCESS_TOKEN: e.target.value })}
                    placeholder="Token permanente de acesso"
                    className="w-full bg-surface-container-lowest rounded-xl p-2.5 text-xs text-on-surface border border-outline-variant/30 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Facebook Page API */}
            <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface flex items-center justify-center font-bold text-xs">
                    FB
                  </span>
                  <span className="font-bold text-sm text-on-surface">
                    3. Página do Facebook (Cross-Posting Opcional)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface">FACEBOOK_PAGE_ID</label>
                  <input
                    type="text"
                    value={keys.FACEBOOK_PAGE_ID}
                    onChange={(e) => setKeys({ ...keys, FACEBOOK_PAGE_ID: e.target.value })}
                    placeholder="ID da Página do Facebook"
                    className="w-full bg-surface-container-lowest rounded-xl p-2.5 text-xs text-on-surface border border-outline-variant/30 font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-on-surface">FACEBOOK_PAGE_ACCESS_TOKEN</label>
                  <input
                    type="password"
                    value={keys.FACEBOOK_PAGE_ACCESS_TOKEN}
                    onChange={(e) => setKeys({ ...keys, FACEBOOK_PAGE_ACCESS_TOKEN: e.target.value })}
                    placeholder="Token de acesso da página"
                    className="w-full bg-surface-container-lowest rounded-xl p-2.5 text-xs text-on-surface border border-outline-variant/30 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Modal Bottom Save Action */}
            <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setShowApiKeysModal(false)}
                className="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high text-xs font-semibold transition-colors"
              >
                Fechar
              </button>

              <button
                type="button"
                onClick={handleSaveKeys}
                disabled={savingKeys}
                className="px-6 py-2.5 rounded-xl bg-primary text-on-primary hover:opacity-95 text-xs font-bold shadow-md flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <Save size={16} />
                <span>{savingKeys ? 'Salvando no .env.local...' : 'Salvar Chaves no .env.local'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-6);
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, var(--color-bg) 0%, var(--color-primary-50) 50%, var(--color-bg) 100%);
        }

        .login-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .login-bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.4;
          animation: pulse 6s ease-in-out infinite;
        }

        .login-bg-orb-1 {
          width: 400px;
          height: 400px;
          background: var(--color-primary-200);
          top: -100px;
          right: -100px;
          animation-delay: 0s;
        }

        .login-bg-orb-2 {
          width: 300px;
          height: 300px;
          background: var(--color-accent-light);
          bottom: -80px;
          left: -80px;
          animation-delay: 2s;
        }

        .login-bg-orb-3 {
          width: 200px;
          height: 200px;
          background: var(--color-primary-300);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: 4s;
        }

        .login-container {
          width: 100%;
          max-width: 440px;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.6);
          border-radius: var(--radius-2xl);
          padding: var(--space-8);
          box-shadow: var(--shadow-xl), 0 0 60px rgba(183, 110, 121, 0.08);
          position: relative;
          z-index: 1;
        }

        .login-brand {
          text-align: center;
          margin-bottom: var(--space-6);
        }

        .login-title {
          font-family: var(--font-display);
          font-weight: 700;
          margin-bottom: var(--space-1);
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .login-password-wrapper {
          position: relative;
        }

        .login-password-wrapper .input {
          padding-right: var(--space-12);
        }

        .login-password-toggle {
          position: absolute;
          right: var(--space-3);
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: var(--color-text-tertiary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-1);
        }

        .login-password-toggle:hover {
          color: var(--color-text);
        }

        .login-submit {
          width: 100%;
          margin-top: var(--space-2);
        }

        .login-error {
          padding: var(--space-3);
          background: var(--color-error-bg);
          color: var(--color-error);
          border: 1px solid rgba(196, 84, 84, 0.2);
          border-radius: var(--radius-md);
        }

        .login-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.1); opacity: 0.6; }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

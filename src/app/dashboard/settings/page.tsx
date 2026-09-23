'use client';

import { useState, useEffect } from 'react';
import {
  Settings,
  Scissors,
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  Users,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import { InstagramIcon as Instagram, FacebookIcon as Facebook } from '@/components/icons';

interface SalonSettings {
  salonName: string;
  phone: string;
  instagram: string;
  tone: string;
  targetAudience: string;
  services: string[];
  professionals: string[];
  instagramConnected: boolean;
  facebookConnected: boolean;
  geminiModel: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SalonSettings>({
    salonName: 'Studio Beleza & Elegância',
    phone: '(11) 98765-4321',
    instagram: '@studiobelezasp',
    tone: 'Elegante, acolhedor e focado em alta autoestima',
    targetAudience: 'Mulheres de 22 a 50 anos que valorizam cuidados pessoais e estética premium',
    services: ['Cabelos', 'Unhas em Gel', 'Estética Facial', 'Sobrancelhas'],
    professionals: ['Camila Rocha', 'Juliana Prado', 'Patrícia Mendes'],
    instagramConnected: true,
    facebookConnected: true,
    geminiModel: 'gemini-1.5-flash',
  });

  const [servicesInput, setServicesInput] = useState('');
  const [professionalsInput, setProfessionalsInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.settings) {
          setSettings(data.settings);
          setServicesInput(data.settings.services?.join(', ') || '');
          setProfessionalsInput(data.settings.professionals?.join(', ') || '');
        }
      })
      .catch((err) => console.error('Fetch settings error:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    const updatedSettings = {
      ...settings,
      services: servicesInput.split(',').map((s) => s.trim()).filter(Boolean),
      professionals: professionalsInput.split(',').map((p) => p.trim()).filter(Boolean),
    };

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSettings),
      });

      if (res.ok) {
        setSettings(updatedSettings);
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Save error:', err);
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

  return (
    <div className="settings-page max-w-[1360px] mx-auto w-full px-4 lg:px-8">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Configurações do <span className="text-gradient">Salão</span>
          </h1>
          <p className="page-description">
            Personalize a identidade da marca, tom de voz da IA e contas conectadas
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="alert-saved animate-fade-in">
          <CheckCircle2 size={18} />
          <span>Configurações salvas e aplicadas com sucesso!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="settings-grid">
        {/* Card 1: Salon Brand Identity */}
        <div className="card settings-card">
          <div className="card-header-row">
            <Scissors size={20} className="text-primary" />
            <h2 className="card-heading">Identidade & Perfil do Salão</h2>
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
            <label className="input-label">
              Tom de Voz Padrão para os Agentes de IA
            </label>
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
                Técnico, especialista e didático (Foco em autoridade)
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
            <label className="input-label">
              Serviços Oferecidos (separados por vírgula)
            </label>
            <input
              type="text"
              className="input"
              placeholder="Cabelos, Unhas em Gel, Estética Facial, Maquiagem..."
              value={servicesInput}
              onChange={(e) => setServicesInput(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">
              Profissionais da Equipe (para marcação de tags)
            </label>
            <input
              type="text"
              className="input"
              placeholder="Camila (Colorista), Juliana (Nail Designer)..."
              value={professionalsInput}
              onChange={(e) => setProfessionalsInput(e.target.value)}
            />
          </div>
        </div>

        {/* Column 2: Social Integrations & AI */}
        <div className="settings-col-right">
          {/* Card 2: Redes Sociais */}
          <div className="card settings-card">
            <div className="card-header-row">
              <ShieldCheck size={20} className="text-info" />
              <h2 className="card-heading">Contas de Redes Sociais</h2>
            </div>

            <div className="social-connection-item">
              <div className="social-item-left">
                <div className="social-icon-box bg-ig">
                  <Instagram size={22} color="white" />
                </div>
                <div>
                  <h4>Instagram Profissional</h4>
                  <p className="social-status-sub">
                    {settings.instagramConnected ? 'Conectado via Meta Graph API' : 'Desconectado'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className={`btn btn-sm ${settings.instagramConnected ? 'btn-danger' : 'btn-primary'}`}
                onClick={() => toggleConnection('instagramConnected')}
              >
                {settings.instagramConnected ? 'Desconectar' : 'Conectar'}
              </button>
            </div>

            <div className="social-connection-item">
              <div className="social-item-left">
                <div className="social-icon-box bg-fb">
                  <Facebook size={22} color="white" />
                </div>
                <div>
                  <h4>Página do Facebook</h4>
                  <p className="social-status-sub">
                    {settings.facebookConnected ? 'Conectado via Meta Graph API' : 'Desconectado'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                className={`btn btn-sm ${settings.facebookConnected ? 'btn-danger' : 'btn-primary'}`}
                onClick={() => toggleConnection('facebookConnected')}
              >
                {settings.facebookConnected ? 'Desconectar' : 'Conectar'}
              </button>
            </div>
          </div>

          {/* Card 3: Configuração de IA */}
          <div className="card settings-card">
            <div className="card-header-row">
              <Sparkles size={20} className="text-accent-dark" />
              <h2 className="card-heading">Motor de Inteligência Artificial</h2>
            </div>

            <div className="input-group">
              <label className="input-label">Modelo Google Gemini Padrão</label>
              <select
                className="select"
                value={settings.geminiModel}
                onChange={(e) => setSettings({ ...settings, geminiModel: e.target.value })}
              >
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (Ultra rápido e preciso)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Análise aprofundada de fotos)</option>
              </select>
            </div>

            <div className="ai-status-note">
              <CheckCircle2 size={16} className="text-success" />
              <span>
                Fallback local inteligente ativado caso a chave não esteja definida no ambiente.
              </span>
            </div>
          </div>

          {/* Submit Action */}
          <button type="submit" className="btn btn-primary btn-save-settings" disabled={saving}>
            <Save size={16} />
            {saving ? 'Salvando Alterações...' : 'Salvar Todas as Configurações'}
          </button>
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
          gap: var(--space-2);
          font-size: 0.9rem;
          font-weight: 500;
        }

        .settings-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
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
          gap: var(--space-3);
          border-bottom: 1px solid var(--color-border-light);
          padding-bottom: var(--space-3);
        }

        .card-heading {
          font-size: 1.15rem;
          font-weight: 600;
          color: var(--color-text);
        }

        .form-row-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-4);
        }

        .settings-col-right {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .social-connection-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-3);
          border-radius: var(--radius-md);
          background: var(--color-bg);
          border: 1px solid var(--color-border-light);
        }

        .social-item-left {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .social-icon-box {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .bg-ig {
          background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
        }

        .bg-fb {
          background: #1877f2;
        }

        .social-status-sub {
          font-size: 0.775rem;
          color: var(--color-text-tertiary);
        }

        .ai-status-note {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          background: var(--color-primary-50);
          padding: var(--space-3);
          border-radius: var(--radius-md);
          font-size: 0.8rem;
          color: var(--color-primary-dark);
        }

        .btn-save-settings {
          width: 100%;
          justify-content: center;
          padding: var(--space-4);
          font-size: 0.95rem;
        }

        @media (max-width: 900px) {
          .settings-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

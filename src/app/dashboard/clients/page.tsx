'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Calendar as CalendarIcon,
  Cake,
  Gift,
  Sparkles,
  Search,
  Plus,
  Phone,
  MessageCircle,
  Copy,
  Check,
  Edit2,
  Trash2,
  X,
  User,
  Heart,
  Mail,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { InstagramIcon } from '@/components/icons';

interface ClientItem {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  birthDay: number;
  birthMonth: number;
  birthYear?: number | null;
  instagram?: string | null;
  preferredServices?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const MONTH_SHORT = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
];

const PRESET_GIFTS = [
  '15% de desconto em qualquer procedimento durante o mês',
  'Hidratação profunda de presente ao agendar escova ou corte',
  'Spa dos Pés cortesia ao fazer as unhas das mãos',
  'Design de Sobrancelhas de brinde de aniversário',
  'Uma taça de espumante e mimo surpresa no seu atendimento',
];

function getZodiacSign(day: number, month: number): string {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Áries ♈';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Touro ♉';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gêmeos ♊';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Câncer ♋';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leão ♌';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgem ♍';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra ♎';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Escorpião ♏';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagitário ♐';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricórnio ♑';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquário ♒';
  return 'Peixes ♓';
}

function formatPhoneDisplay(val: string): string {
  const digits = val.replace(/\D/g, '');
  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
  }
  return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
}

export default function ClientsPage() {
  const today = new Date();
  const currentMonth = today.getMonth() + 1; // 1-12
  const currentDay = today.getDate(); // 1-31

  const [activeTab, setActiveTab] = useState<'calendar' | 'list'>('calendar');
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dayFilter, setDayFilter] = useState<'ALL' | 'TODAY' | 'WEEK'>('ALL');

  // Modal State para Cliente
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<ClientItem | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    birthDay: String(currentDay),
    birthMonth: String(currentMonth),
    birthYear: '',
    instagram: '',
    preferredServices: '',
    notes: '',
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Modal State para WhatsApp com IA
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiTargetClient, setAiTargetClient] = useState<ClientItem | null>(null);
  const [aiTone, setAiTone] = useState<'elegante' | 'festivo' | 'vip' | 'curto'>('elegante');
  const [aiGift, setAiGift] = useState(PRESET_GIFTS[0]);
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Carregar lista de clientes
  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/clients');
      if (res.ok) {
        const data = await res.json();
        setClients(data.clients || []);
      }
    } catch (err) {
      console.error('Erro ao buscar clientes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Aniversariantes de Hoje
  const todayBirthdays = useMemo(() => {
    return clients.filter((c) => c.birthMonth === currentMonth && c.birthDay === currentDay);
  }, [clients, currentMonth, currentDay]);

  // Contagem de aniversariantes por mês para a barra de navegação
  const birthdayCountByMonth = useMemo(() => {
    const counts: Record<number, number> = {};
    for (let m = 1; m <= 12; m++) counts[m] = 0;
    clients.forEach((c) => {
      if (counts[c.birthMonth] !== undefined) {
        counts[c.birthMonth]++;
      }
    });
    return counts;
  }, [clients]);

  // Clientes filtrados para a visualização da Agenda / Mês
  const monthClients = useMemo(() => {
    let list = clients.filter((c) => c.birthMonth === selectedMonth);

    if (dayFilter === 'TODAY' && selectedMonth === currentMonth) {
      list = list.filter((c) => c.birthDay === currentDay);
    } else if (dayFilter === 'WEEK' && selectedMonth === currentMonth) {
      list = list.filter((c) => c.birthDay >= currentDay && c.birthDay <= currentDay + 7);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          (c.preferredServices && c.preferredServices.toLowerCase().includes(q))
      );
    }

    // Ordenar pelo dia do mês
    return list.sort((a, b) => a.birthDay - b.birthDay);
  }, [clients, selectedMonth, dayFilter, currentMonth, currentDay, searchQuery]);

  // Clientes para a visualização Geral de Lista
  const allFilteredClients = useMemo(() => {
    let list = [...clients];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          (c.email && c.email.toLowerCase().includes(q)) ||
          (c.preferredServices && c.preferredServices.toLowerCase().includes(q)) ||
          (c.instagram && c.instagram.toLowerCase().includes(q))
      );
    }
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [clients, searchQuery]);

  // Handlers para abrir modal de novo cliente ou editar
  const handleOpenNewClientModal = () => {
    setEditingClient(null);
    setFormData({
      name: '',
      phone: '',
      email: '',
      birthDay: String(currentDay),
      birthMonth: String(selectedMonth),
      birthYear: '',
      instagram: '',
      preferredServices: '',
      notes: '',
    });
    setFormError('');
    setIsClientModalOpen(true);
  };

  const handleOpenEditClientModal = (client: ClientItem) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      phone: client.phone,
      email: client.email || '',
      birthDay: String(client.birthDay),
      birthMonth: String(client.birthMonth),
      birthYear: client.birthYear ? String(client.birthYear) : '',
      instagram: client.instagram || '',
      preferredServices: client.preferredServices || '',
      notes: client.notes || '',
    });
    setFormError('');
    setIsClientModalOpen(true);
  };

  const handleSaveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!formData.name.trim()) {
      setFormError('Por favor, informe o nome da cliente.');
      return;
    }
    if (!formData.phone.trim()) {
      setFormError('Por favor, informe o telefone/WhatsApp da cliente.');
      return;
    }

    try {
      setFormSubmitting(true);
      const url = editingClient ? `/api/clients/${editingClient.id}` : '/api/clients';
      const method = editingClient ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Erro ao salvar cliente');
      }

      setIsClientModalOpen(false);
      await fetchClients();
    } catch (err: any) {
      setFormError(err.message || 'Ocorreu um erro ao salvar.');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteClient = async (id: string, name: string) => {
    if (!confirm(`Deseja realmente excluir o cadastro de "${name}"?`)) return;

    try {
      const res = await fetch(`/api/clients/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setClients((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error('Erro ao excluir cliente:', err);
    }
  };

  // Handlers para Mensagem de Aniversário com IA
  const handleOpenAiModal = (client: ClientItem) => {
    setAiTargetClient(client);
    setAiTone('elegante');
    setAiGift(PRESET_GIFTS[0]);
    setGeneratedMessage('');
    setWhatsappUrl('');
    setCopied(false);
    setIsAiModalOpen(true);
    generateAiMessage(client, 'elegante', PRESET_GIFTS[0]);
  };

  const generateAiMessage = async (
    client: ClientItem,
    tone: 'elegante' | 'festivo' | 'vip' | 'curto',
    gift: string
  ) => {
    try {
      setAiGenerating(true);
      const res = await fetch('/api/clients/birthday-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: client.name,
          phone: client.phone,
          services: client.preferredServices,
          notes: client.notes,
          gift,
          tone,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedMessage(data.message);
        setWhatsappUrl(data.whatsappUrl);
      }
    } catch (err) {
      console.error('Erro ao gerar mensagem de aniversário:', err);
    } finally {
      setAiGenerating(false);
    }
  };

  const handleCopyMessage = () => {
    if (!generatedMessage) return;
    navigator.clipboard.writeText(generatedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenWhatsapp = () => {
    if (!aiTargetClient) return;
    const digits = aiTargetClient.phone.replace(/\D/g, '');
    const fullPhone = digits.length <= 11 ? `55${digits}` : digits;
    const url = `https://api.whatsapp.com/send?phone=${fullPhone}&text=${encodeURIComponent(
      generatedMessage
    )}`;
    window.open(url, '_blank');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* ─── HEADER COM VISUAL LUXO ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="material-symbols-outlined text-primary text-3xl">cake</span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              Clientes & Agenda de Aniversários
            </h1>
          </div>
          <p className="text-on-surface-variant text-sm sm:text-base">
            Gerencie o cadastro das clientes, acompanhe os aniversariantes de cada mês e encante com
            mensagens de parabéns via WhatsApp criadas por IA.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleOpenNewClientModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-medium shadow-md hover:shadow-lg hover:brightness-105 transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Cliente</span>
          </button>
        </div>
      </div>

      {/* ─── BANNER / CARDS DE DESTAQUE ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Aniversariantes de Hoje */}
        <div className="bg-gradient-to-br from-primary-50 via-surface to-surface-elevated p-5 rounded-2xl border border-primary/20 shadow-sm relative overflow-hidden">
          <div className="absolute right-2 top-2 opacity-10">
            <Cake className="w-24 h-24 text-primary" />
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Hoje ({currentDay} de {MONTH_NAMES[currentMonth - 1]})
            </span>
            <span className="p-1.5 bg-primary/10 rounded-lg text-primary">
              <Cake className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-on-surface font-display">
            {todayBirthdays.length} Aniversariante{todayBirthdays.length === 1 ? '' : 's'}
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            {todayBirthdays.length > 0
              ? 'Clique para enviar parabéns com 1 toque!'
              : 'Nenhum aniversariante hoje.'}
          </p>
          {todayBirthdays.length > 0 && (
            <button
              onClick={() => {
                setSelectedMonth(currentMonth);
                setDayFilter('TODAY');
                setActiveTab('calendar');
              }}
              className="mt-3 text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              Ver aniversariantes de hoje →
            </button>
          )}
        </div>

        {/* Card 2: Aniversariantes do Mês Selecionado */}
        <div className="bg-surface p-5 rounded-2xl border border-border/60 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              Mês de {MONTH_NAMES[selectedMonth - 1]}
            </span>
            <span className="p-1.5 bg-secondary-container/30 rounded-lg text-secondary">
              <CalendarIcon className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-on-surface font-display">
            {birthdayCountByMonth[selectedMonth] || 0} Clientes
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Celebrando mais um ciclo neste mês
          </p>
        </div>

        {/* Card 3: Total de Clientes Cadastrados */}
        <div className="bg-surface p-5 rounded-2xl border border-border/60 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              Base de Clientes
            </span>
            <span className="p-1.5 bg-accent/10 rounded-lg text-accent-dark">
              <User className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-bold text-on-surface font-display">
            {clients.length} Cadastros
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Clientes ativas e datas registradas
          </p>
        </div>

        {/* Card 4: Conversão com IA */}
        <div className="bg-gradient-to-br from-[#faf4ee] to-[#f4ebe1] p-5 rounded-2xl border border-accent/20 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent-dark">
              Fidelização com IA
            </span>
            <span className="p-1.5 bg-accent/20 rounded-lg text-accent-dark">
              <Sparkles className="w-4 h-4" />
            </span>
          </div>
          <div className="text-sm font-medium text-[#4a3b32] leading-snug">
            Mensagens de aniversário geram até <strong>42%</strong> de retorno e reativação ao salão!
          </div>
          <div className="mt-2 text-xs text-accent-dark font-medium flex items-center gap-1">
            ✨ Textos exclusivos e humanizados
          </div>
        </div>
      </div>

      {/* ─── NAVEGAÇÃO DE ABAS & BUSCA ─── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-surface p-3 rounded-2xl border border-border/60 shadow-xs">
        {/* Toggle Abas */}
        <div className="flex items-center bg-surface-container-high/60 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'calendar'
                ? 'bg-surface text-primary shadow-xs font-semibold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            <span>Agenda por Mês</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'list'
                ? 'bg-surface text-primary shadow-xs font-semibold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Todos os Clientes ({clients.length})</span>
          </button>
        </div>

        {/* Input de Busca */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Buscar por nome, telefone, serviço..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-surface-container-low border border-border/60 rounded-xl text-sm text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ─── ABA 1: AGENDA DE ANIVERSÁRIOS POR MÊS ─── */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          {/* Seletor Visual dos 12 Meses */}
          <div className="bg-surface p-4 rounded-2xl border border-border/60 shadow-xs">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <Cake className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold text-on-surface font-display">
                  Selecione o Mês para Visualizar a Agenda:
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedMonth(currentMonth);
                  setDayFilter('ALL');
                }}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                  selectedMonth === currentMonth
                    ? 'bg-primary-50 text-primary border-primary/30 font-medium'
                    : 'text-on-surface-variant border-border/60 hover:bg-surface-container-high'
                }`}
              >
                Mês Atual ({MONTH_NAMES[currentMonth - 1]})
              </button>
            </div>

            {/* Grid dos 12 Meses */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
              {MONTH_NAMES.map((mName, idx) => {
                const mNum = idx + 1;
                const isSelected = selectedMonth === mNum;
                const isCurrent = currentMonth === mNum;
                const count = birthdayCountByMonth[mNum] || 0;

                return (
                  <button
                    key={mNum}
                    type="button"
                    onClick={() => {
                      setSelectedMonth(mNum);
                      setDayFilter('ALL');
                    }}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-primary text-white border-primary shadow-sm scale-102'
                        : isCurrent
                        ? 'bg-primary-50 text-primary border-primary/30 hover:border-primary'
                        : 'bg-surface hover:bg-surface-container-high border-border/60 text-on-surface'
                    }`}
                  >
                    <span className="text-xs font-bold">{MONTH_SHORT[idx]}</span>
                    <span
                      className={`text-[10px] mt-1 px-1.5 py-0.2 rounded-full font-semibold ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : count > 0
                          ? 'bg-primary/10 text-primary'
                          : 'text-on-surface-variant/60'
                      }`}
                    >
                      {count} {count === 1 ? 'aniv.' : 'aniv.'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Subfiltros do Mês Atual (Hoje, Esta Semana, Todos) */}
            {selectedMonth === currentMonth && (
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/40">
                <span className="text-xs text-on-surface-variant font-medium">Filtro rápido:</span>
                <button
                  type="button"
                  onClick={() => setDayFilter('ALL')}
                  className={`text-xs px-3 py-1 rounded-full transition-all ${
                    dayFilter === 'ALL'
                      ? 'bg-primary text-white font-medium'
                      : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Todos de {MONTH_NAMES[selectedMonth - 1]}
                </button>
                <button
                  type="button"
                  onClick={() => setDayFilter('TODAY')}
                  className={`text-xs px-3 py-1 rounded-full transition-all flex items-center gap-1 ${
                    dayFilter === 'TODAY'
                      ? 'bg-primary text-white font-medium'
                      : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <Cake className="w-3 h-3" />
                  <span>Hoje ({todayBirthdays.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDayFilter('WEEK')}
                  className={`text-xs px-3 py-1 rounded-full transition-all ${
                    dayFilter === 'WEEK'
                      ? 'bg-primary text-white font-medium'
                      : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  Próximos 7 dias
                </button>
              </div>
            )}
          </div>

          {/* Lista de Cards dos Aniversariantes do Mês */}
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 bg-surface rounded-2xl border border-border/60">
              <RefreshCw className="w-8 h-8 animate-spin text-primary mb-3" />
              <p className="text-sm text-on-surface-variant">Carregando aniversariantes...</p>
            </div>
          ) : monthClients.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-surface rounded-2xl border border-dashed border-border text-center">
              <div className="p-4 bg-primary-50 rounded-full text-primary mb-3">
                <Cake className="w-8 h-8" />
              </div>
              <h3 className="font-display text-lg font-bold text-on-surface mb-1">
                Nenhum aniversariante encontrado em {MONTH_NAMES[selectedMonth - 1]}
              </h3>
              <p className="text-sm text-on-surface-variant max-w-md mb-4">
                Cadastre novas clientes informando o dia de nascimento para que apareçam
                automaticamente na agenda mensal.
              </p>
              <button
                type="button"
                onClick={handleOpenNewClientModal}
                className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:brightness-105 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Cadastrar Cliente para {MONTH_NAMES[selectedMonth - 1]}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {monthClients.map((client) => {
                const isToday =
                  client.birthMonth === currentMonth && client.birthDay === currentDay;
                const isUpcoming =
                  client.birthMonth === currentMonth &&
                  client.birthDay > currentDay &&
                  client.birthDay <= currentDay + 7;

                const age = client.birthYear
                  ? today.getFullYear() - client.birthYear
                  : null;
                const zodiac = getZodiacSign(client.birthDay, client.birthMonth);

                return (
                  <div
                    key={client.id}
                    className={`bg-surface rounded-2xl border transition-all hover:shadow-md flex flex-col justify-between overflow-hidden ${
                      isToday
                        ? 'border-primary ring-2 ring-primary/20 shadow-md bg-gradient-to-b from-primary-50/40 to-surface'
                        : 'border-border/60'
                    }`}
                  >
                    {/* Header do Card */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-accent text-white flex items-center justify-center font-bold text-lg shadow-sm">
                            {client.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-bold text-on-surface text-base leading-tight">
                              {client.name}
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mt-0.5">
                              <span>{zodiac}</span>
                              {age && <span>• {age} anos</span>}
                            </div>
                          </div>
                        </div>

                        {/* Badge de Data */}
                        <div
                          className={`flex flex-col items-center px-3 py-1 rounded-xl text-center font-medium ${
                            isToday
                              ? 'bg-primary text-white shadow-xs animate-pulse'
                              : isUpcoming
                              ? 'bg-secondary-container/40 text-secondary border border-secondary/20'
                              : 'bg-surface-container-high text-on-surface-variant'
                          }`}
                        >
                          <span className="text-xs uppercase tracking-wider font-semibold">
                            {MONTH_SHORT[client.birthMonth - 1]}
                          </span>
                          <span className="text-lg font-bold leading-none">
                            {client.birthDay}
                          </span>
                          {isToday && (
                            <span className="text-[9px] uppercase font-bold tracking-tight">
                              HOJE! 🎉
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Informações de Contato e Serviços */}
                      <div className="space-y-2 text-xs text-on-surface-variant mt-3 pt-3 border-t border-border/40">
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="font-medium text-on-surface">
                            {formatPhoneDisplay(client.phone)}
                          </span>
                        </div>

                        {client.instagram && (
                          <div className="flex items-center gap-2">
                            <InstagramIcon size={14} className="text-pink-500 shrink-0" />
                            <span>{client.instagram}</span>
                          </div>
                        )}

                        {client.preferredServices && (
                          <div className="flex items-start gap-2 pt-1">
                            <Heart className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                            <span className="line-clamp-2">
                              <strong>Prefere:</strong> {client.preferredServices}
                            </span>
                          </div>
                        )}

                        {client.notes && (
                          <div className="bg-surface-container-low p-2 rounded-lg text-[11px] text-on-surface-variant italic border border-border/40">
                            &quot;{client.notes}&quot;
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Ações do Card */}
                    <div className="p-3 bg-surface-container-lowest border-t border-border/50 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditClientModal(client)}
                          title="Editar Cadastro"
                          className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteClient(client.id, client.name)}
                          title="Excluir"
                          className="p-2 text-on-surface-variant hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Botão de WhatsApp com IA */}
                      <button
                        type="button"
                        onClick={() => handleOpenAiModal(client)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition-all ${
                          isToday
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white hover:brightness-110'
                            : 'bg-gradient-to-r from-primary to-primary-dark text-white hover:brightness-105'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Mandar WhatsApp IA</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ─── ABA 2: LISTA GERAL DE CLIENTES ─── */}
      {activeTab === 'list' && (
        <div className="bg-surface rounded-2xl border border-border/60 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold text-on-surface">
                Cadastro Completo de Clientes
              </h2>
              <p className="text-xs text-on-surface-variant">
                Exibindo {allFilteredClients.length} de {clients.length} clientes cadastradas
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenNewClientModal}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-xs font-semibold hover:brightness-105 transition-all self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar Cliente</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-high/50 text-on-surface-variant text-xs font-semibold uppercase tracking-wider border-b border-border/50">
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Aniversário</th>
                  <th className="py-3 px-4">WhatsApp</th>
                  <th className="py-3 px-4">Procedimentos Preferidos</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-sm">
                {allFilteredClients.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-on-surface-variant text-sm">
                      Nenhum cliente cadastrado ou correspondente à busca.
                    </td>
                  </tr>
                ) : (
                  allFilteredClients.map((client) => {
                    const isToday =
                      client.birthMonth === currentMonth && client.birthDay === currentDay;

                    return (
                      <tr key={client.id} className="hover:bg-surface-container-low/50 transition-colors">
                        {/* Nome e Iniciais */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm shrink-0">
                              {client.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold text-on-surface flex items-center gap-2">
                                <span>{client.name}</span>
                                {isToday && (
                                  <span className="text-[10px] bg-primary text-white px-1.5 py-0.2 rounded-full font-bold">
                                    HOJE!
                                  </span>
                                )}
                              </div>
                              {client.email && (
                                <div className="text-xs text-on-surface-variant">{client.email}</div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Data Aniversário */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Cake className="w-4 h-4 text-primary" />
                            <span className="font-medium text-on-surface">
                              {client.birthDay} de {MONTH_NAMES[client.birthMonth - 1]}
                            </span>
                            {client.birthYear && (
                              <span className="text-xs text-on-surface-variant">
                                ({client.birthYear})
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-on-surface-variant ml-5">
                            {getZodiacSign(client.birthDay, client.birthMonth)}
                          </div>
                        </td>

                        {/* Telefone / WhatsApp */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="font-mono text-xs text-on-surface">
                            {formatPhoneDisplay(client.phone)}
                          </span>
                          {client.instagram && (
                            <div className="text-xs text-pink-600 font-medium flex items-center gap-1 mt-0.5">
                              <InstagramIcon size={12} />
                              <span>{client.instagram}</span>
                            </div>
                          )}
                        </td>

                        {/* Procedimentos */}
                        <td className="py-3.5 px-4 max-w-xs truncate text-xs text-on-surface-variant">
                          {client.preferredServices || '—'}
                        </td>

                        {/* Botões de Ação */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenAiModal(client)}
                              title="Criar WhatsApp com IA"
                              className="px-2.5 py-1 bg-primary-50 text-primary border border-primary/20 hover:bg-primary hover:text-white rounded-lg text-xs font-medium transition-all flex items-center gap-1"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>IA Parabéns</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEditClientModal(client)}
                              title="Editar"
                              className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteClient(client.id, client.name)}
                              title="Excluir"
                              className="p-1.5 text-on-surface-variant hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── MODAL DE CADASTRO / EDIÇÃO DE CLIENTE ─── */}
      {isClientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-surface rounded-2xl border border-border shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            {/* Header do Modal */}
            <div className="p-5 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-primary-50 text-primary rounded-xl">
                  <User className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-on-surface">
                    {editingClient ? 'Editar Cliente' : 'Novo Cadastro de Cliente'}
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Preencha os dados e a data de aniversário da cliente
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsClientModalOpen(false)}
                className="p-1.5 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container-high transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSaveClient} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-medium">
                  {formError}
                </div>
              )}

              {/* Nome Completo */}
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Nome Completo da Cliente *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Mariana Silveira"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-surface-container-low border border-border rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* WhatsApp e Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">
                    WhatsApp / Telefone *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="(11) 99876-5432"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: formatPhoneDisplay(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 bg-surface-container-low border border-border rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">
                    Instagram (opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="@mari.silveira"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-surface-container-low border border-border rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Data de Aniversário (Dia, Mês, Ano) */}
              <div className="bg-primary-50/50 p-4 rounded-xl border border-primary/20 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider">
                  <Cake className="w-4 h-4" />
                  <span>Data de Aniversário *</span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-on-surface-variant mb-1">
                      Dia
                    </label>
                    <select
                      value={formData.birthDay}
                      onChange={(e) => setFormData({ ...formData, birthDay: e.target.value })}
                      className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary"
                    >
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-on-surface-variant mb-1">
                      Mês
                    </label>
                    <select
                      value={formData.birthMonth}
                      onChange={(e) => setFormData({ ...formData, birthMonth: e.target.value })}
                      className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary"
                    >
                      {MONTH_NAMES.map((m, idx) => (
                        <option key={idx + 1} value={idx + 1}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-on-surface-variant mb-1">
                      Ano (opcional)
                    </label>
                    <input
                      type="number"
                      placeholder="Ex: 1994"
                      min="1930"
                      max={today.getFullYear()}
                      value={formData.birthYear}
                      onChange={(e) => setFormData({ ...formData, birthYear: e.target.value })}
                      className="w-full px-3 py-2 bg-surface border border-border rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Procedimentos Preferidos */}
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Procedimentos / Serviços Mais Realizados
                </label>
                <input
                  type="text"
                  placeholder="Ex: Mechas, Cronograma Capilar, Escova Modelada"
                  value={formData.preferredServices}
                  onChange={(e) => setFormData({ ...formData, preferredServices: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-surface-container-low border border-border rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Observações / Preferências */}
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Notas & Preferências Especiais
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Ama café sem açúcar, prefere tons quentes, tem couro cabeludo sensível..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3.5 py-2 bg-surface-container-low border border-border rounded-xl text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Botões do Rodapé */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/50">
                <button
                  type="button"
                  onClick={() => setIsClientModalOpen(false)}
                  className="px-4 py-2 border border-border rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-5 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:brightness-105 disabled:opacity-50 transition-all flex items-center gap-2"
                >
                  {formSubmitting && <RefreshCw className="w-4 h-4 animate-spin" />}
                  <span>{editingClient ? 'Salvar Alterações' : 'Cadastrar Cliente'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL ESPECIAL: WHATSAPP DE ANIVERSÁRIO COM IA ─── */}
      {isAiModalOpen && aiTargetClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-surface rounded-3xl border border-border shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
            {/* Header do Modal */}
            <div className="p-5 bg-gradient-to-r from-primary-50 via-surface to-accent/10 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-tr from-primary to-accent text-white rounded-2xl shadow-sm">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg font-bold text-on-surface">
                      Parabéns com IA para {aiTargetClient.name}
                    </h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                      {aiTargetClient.birthDay}/{aiTargetClient.birthMonth}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant">
                    Gerador inteligente de felicitações personalizadas com presente do salão
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAiModalOpen(false)}
                className="p-1.5 text-on-surface-variant hover:text-on-surface rounded-lg hover:bg-surface-container-high transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conteúdo com Scroll */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1">
              {/* Opções de Tom de Voz */}
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-2">
                  Escolha o Tom da Mensagem:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { key: 'elegante', label: 'Elegante & Afetuoso', icon: '✨' },
                    { key: 'festivo', label: 'Festivo & Animado', icon: '🎉' },
                    { key: 'vip', label: 'VIP & Exclusivo', icon: '👑' },
                    { key: 'curto', label: 'Curto & Direto', icon: '💬' },
                  ].map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => {
                        const newTone = t.key as any;
                        setAiTone(newTone);
                        generateAiMessage(aiTargetClient, newTone, aiGift);
                      }}
                      className={`p-2.5 rounded-xl border text-center text-xs font-medium transition-all ${
                        aiTone === t.key
                          ? 'bg-primary text-white border-primary shadow-xs'
                          : 'bg-surface-container-low hover:bg-surface-container-high border-border text-on-surface'
                      }`}
                    >
                      <div className="text-base mb-1">{t.icon}</div>
                      <div>{t.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mimo / Presente do Salão */}
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1.5 flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-primary" />
                  <span>Presente / Mimo de Aniversário do Salão:</span>
                </label>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_GIFTS.slice(0, 3).map((gift) => (
                      <button
                        key={gift}
                        type="button"
                        onClick={() => {
                          setAiGift(gift);
                          generateAiMessage(aiTargetClient, aiTone, gift);
                        }}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
                          aiGift === gift
                            ? 'bg-primary-50 text-primary border-primary font-semibold'
                            : 'bg-surface border-border text-on-surface-variant hover:bg-surface-container-high'
                        }`}
                      >
                        {gift}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    placeholder="Ou digite outro presente/desconto personalizado..."
                    value={aiGift}
                    onChange={(e) => setAiGift(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-container-low border border-border rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Botão de Regerar */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-on-surface">
                  Mensagem Pronta para Envio:
                </span>
                <button
                  type="button"
                  disabled={aiGenerating}
                  onClick={() => generateAiMessage(aiTargetClient, aiTone, aiGift)}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${aiGenerating ? 'animate-spin' : ''}`} />
                  <span>Gerar Nova Variação com IA</span>
                </button>
              </div>

              {/* Visualização de Balão do WhatsApp */}
              <div className="bg-[#efeae2] p-4 rounded-2xl border border-border/50 relative shadow-inner">
                {aiGenerating ? (
                  <div className="flex flex-col items-center justify-center py-10 space-y-2">
                    <RefreshCw className="w-6 h-6 animate-spin text-emerald-700" />
                    <p className="text-xs text-[#54656f] font-medium">
                      O Gemini IA está redigindo a mensagem perfeita...
                    </p>
                  </div>
                ) : (
                  <div className="bg-white p-4 rounded-2xl rounded-tl-xs shadow-sm border border-emerald-900/10 max-w-xl text-[#111b21] space-y-2">
                    <textarea
                      rows={8}
                      value={generatedMessage}
                      onChange={(e) => setGeneratedMessage(e.target.value)}
                      className="w-full bg-transparent text-sm leading-relaxed border-none focus:outline-none resize-none font-sans"
                    />
                    <div className="text-[10px] text-[#667781] text-right">
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Rodapé com Botões de Ação para o WhatsApp */}
            <div className="p-4 bg-surface-container-lowest border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-on-surface-variant flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-primary" />
                <span>
                  Enviar para: <strong>{formatPhoneDisplay(aiTargetClient.phone)}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  disabled={!generatedMessage}
                  className="flex-1 sm:flex-initial px-4 py-2.5 border border-border rounded-xl text-xs font-semibold text-on-surface hover:bg-surface-container-high transition-colors flex items-center justify-center gap-1.5"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenWhatsapp}
                  disabled={!generatedMessage}
                  className="flex-1 sm:flex-initial px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl text-xs font-bold hover:brightness-110 shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Abrir WhatsApp da Cliente</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

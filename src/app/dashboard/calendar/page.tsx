'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  CheckCircle2,
  Calendar as CalendarIcon,
  X,
  Share2,
} from 'lucide-react';
import { InstagramIcon as Instagram, FacebookIcon as Facebook } from '@/components/icons';
import { formatDate } from '@/lib/utils';

interface PostItem {
  id: string;
  caption: string;
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHING' | 'PUBLISHED' | 'FAILED';
  platform: 'INSTAGRAM' | 'FACEBOOK' | 'BOTH';
  postType: 'FEED' | 'STORY' | 'REEL';
  scheduledAt?: string | null;
  publishedAt?: string | null;
  createdAt: string;
  postMedia?: Array<{
    media: {
      path: string;
      thumbnailPath?: string | null;
      originalName: string;
    };
  }>;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    fetch('/api/posts')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.posts) setPosts(data.posts);
      })
      .catch((err) => console.error('Error fetching posts for calendar:', err))
      .finally(() => setLoading(false));
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
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

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Calendar matrix calculation
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Previous month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        monthOffset: -1,
        date: new Date(year, month - 1, daysInPrevMonth - i),
      });
    }

    // Current month days
    for (let i = 1; i <= daysInCurrentMonth; i++) {
      days.push({
        day: i,
        monthOffset: 0,
        date: new Date(year, month, i),
      });
    }

    // Next month padding to fill 35 or 42 grid cells
    const remaining = 35 - days.length > 0 ? 35 - days.length : 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        day: i,
        monthOffset: 1,
        date: new Date(year, month + 1, i),
      });
    }

    return days;
  }, [year, month]);

  // Map posts to dates
  const getPostsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return posts.filter((p) => {
      const targetDate = p.scheduledAt || p.publishedAt;
      if (!targetDate) return false;
      return targetDate.split('T')[0] === dateStr;
    });
  };

  const upcomingScheduled = useMemo(() => {
    return posts
      .filter((p) => p.status === 'SCHEDULED' && p.scheduledAt)
      .sort((a, b) => new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime());
  }, [posts]);

  const selectedDayPosts = useMemo(() => {
    if (!selectedDate) return [];
    return getPostsForDate(selectedDate);
  }, [selectedDate, posts]);

  const formatSelectedDateFull = (d: Date) => {
    const weekday = d.toLocaleDateString('pt-BR', { weekday: 'long' });
    const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);
    const day = d.getDate();
    const monthName = monthNames[d.getMonth()];
    const fullYear = d.getFullYear();
    return `${capitalizedWeekday}, ${day} de ${monthName} de ${fullYear}`;
  };

  return (
    <div className="calendar-page max-w-[1360px] mx-auto w-full px-4 lg:px-8">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Calendário <span className="text-gradient">Editorial</span>
          </h1>
          <p className="page-description">
            Organize o cronograma visual de postagens para manter o salão sempre ativo nas redes
          </p>
        </div>
        <div className="page-actions">
          <Link href="/dashboard/posts" className="btn btn-primary">
            <Plus size={16} />
            Agendar Novo Post
          </Link>
        </div>
      </div>

      <div className="calendar-layout">
        {/* Main Calendar Card */}
        <div className="card calendar-card">
          {/* Header Controls */}
          <div className="calendar-controls">
            <div className="calendar-title-wrap">
              <CalendarIcon size={20} className="calendar-icon-head" />
              <h2 className="calendar-month-title">
                {monthNames[month]} {year}
              </h2>
            </div>

            <div className="calendar-nav-buttons">
              <button className="btn btn-sm btn-ghost" onClick={handleToday}>
                Hoje
              </button>
              <button
                className="btn btn-sm btn-icon btn-ghost"
                onClick={handlePrevMonth}
                aria-label="Mês anterior"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                className="btn btn-sm btn-icon btn-ghost"
                onClick={handleNextMonth}
                aria-label="Próximo mês"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="calendar-weekdays">
            <span>Dom</span>
            <span>Seg</span>
            <span>Ter</span>
            <span>Qua</span>
            <span>Qui</span>
            <span>Sex</span>
            <span>Sáb</span>
          </div>

          {/* Grid of days */}
          <div className="calendar-grid">
            {calendarDays.map((item, idx) => {
              const dayPosts = getPostsForDate(item.date);
              const isToday =
                item.date.toDateString() === new Date().toDateString();
              const isOtherMonth = item.monthOffset !== 0;
              const isSelected =
                selectedDate &&
                item.date.toDateString() === selectedDate.toDateString();

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDate(item.date)}
                  className={`calendar-day-cell ${isOtherMonth ? 'other-month' : ''} ${
                    isToday ? 'today-cell' : ''
                  } ${isSelected ? 'selected-day-cell' : ''}`}
                  title={`${item.day} de ${monthNames[item.date.getMonth()]} - ${
                    dayPosts.length === 0
                      ? 'Nenhum post agendado'
                      : `${dayPosts.length} publicação(ões)`
                  } (Clique para abrir)`}
                >
                  <div className="cell-header">
                    <span className={`day-number ${isToday ? 'today-badge' : ''}`}>
                      {item.day}
                    </span>
                    {dayPosts.length > 0 && (
                      <span className="post-count-badge">
                        {dayPosts.length}
                      </span>
                    )}
                  </div>

                  {/* Indicador compacto sem esticar o dia */}
                  <div className="cell-indicator-row">
                    {dayPosts.length > 0 ? (
                      <div className="day-dots-group">
                        {dayPosts.slice(0, 3).map((post) => (
                          <span
                            key={post.id}
                            className={`day-dot ${
                              post.status === 'PUBLISHED'
                                ? 'dot-published'
                                : post.status === 'SCHEDULED'
                                ? 'dot-scheduled'
                                : 'dot-draft'
                            }`}
                            title={`${post.status}: ${post.caption.slice(0, 40)}...`}
                          />
                        ))}
                        {dayPosts.length > 3 && (
                          <span className="dot-overflow">+{dayPosts.length - 3}</span>
                        )}
                      </div>
                    ) : (
                      <span className="empty-day-hint" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar: Upcoming Schedule or Selected Day */}
        <div className="card calendar-sidebar">
          <div className="sidebar-title-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {selectedDate ? (
                <CalendarDays size={18} className="text-primary" />
              ) : (
                <Clock size={18} className="text-primary" />
              )}
              <h3>
                {selectedDate
                  ? `${selectedDate.getDate()} de ${monthNames[selectedDate.getMonth()]}`
                  : 'Próximos Agendamentos'}
              </h3>
            </div>
            {selectedDate && (
              <button
                type="button"
                onClick={() => setSelectedDate(null)}
                style={{ fontSize: '0.75rem', color: 'var(--color-primary)', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: '600' }}
              >
                Limpar
              </button>
            )}
          </div>

          <div className="upcoming-list">
            {selectedDate ? (
              selectedDayPosts.length === 0 ? (
                <div className="empty-upcoming">
                  <p>Nenhum post agendado para {selectedDate.getDate()} de {monthNames[selectedDate.getMonth()]}.</p>
                  <Link href="/dashboard/posts" className="btn btn-sm btn-primary">
                    <Plus size={14} /> Agendar neste dia
                  </Link>
                </div>
              ) : (
                selectedDayPosts.map((post) => (
                  <div
                    key={post.id}
                    className="card upcoming-item card-interactive"
                    onClick={() => setSelectedPost(post)}
                  >
                    <div className="upcoming-time-tag">
                      <Clock size={12} />
                      <span>
                        {post.scheduledAt
                          ? formatDate(post.scheduledAt)
                          : post.publishedAt
                          ? formatDate(post.publishedAt)
                          : 'Rascunho'}
                      </span>
                    </div>
                    <p className="upcoming-caption truncate">{post.caption}</p>
                    <div className="upcoming-badges">
                      <span className="badge badge-primary">
                        {post.platform === 'INSTAGRAM' ? 'Instagram' : 'Instagram & FB'}
                      </span>
                      <span className="badge badge-neutral">{post.postType}</span>
                    </div>
                  </div>
                ))
              )
            ) : upcomingScheduled.length === 0 ? (
              <div className="empty-upcoming">
                <p>Nenhum post agendado para os próximos dias.</p>
                <Link href="/dashboard/posts" className="btn btn-sm btn-primary">
                  <Plus size={14} /> Agendar Agora
                </Link>
              </div>
            ) : (
              upcomingScheduled.map((post) => (
                <div
                  key={post.id}
                  className="card upcoming-item card-interactive"
                  onClick={() => setSelectedPost(post)}
                >
                  <div className="upcoming-time-tag">
                    <Clock size={12} />
                    <span>{formatDate(post.scheduledAt!)}</span>
                  </div>
                  <p className="upcoming-caption truncate">{post.caption}</p>
                  <div className="upcoming-badges">
                    <span className="badge badge-primary">
                      {post.platform === 'INSTAGRAM' ? 'Instagram' : 'Instagram & FB'}
                    </span>
                    <span className="badge badge-neutral">{post.postType}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal da Data Específica Selecionada */}
      {selectedDate && (
        <>
          <div className="overlay" onClick={() => setSelectedDate(null)} />
          <div className="modal date-detail-modal" style={{ width: 'min(92vw, 560px)', maxHeight: '90vh' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(199, 142, 60, 0.12)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CalendarDays size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--color-text)', margin: 0 }}>
                    {formatSelectedDateFull(selectedDate)}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                    {selectedDayPosts.length === 0
                      ? 'Nenhuma publicação neste dia'
                      : `${selectedDayPosts.length} publicação(ões) registrada(s)`}
                  </span>
                </div>
              </div>
              <button
                className="btn btn-ghost btn-icon"
                onClick={() => setSelectedDate(null)}
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', maxHeight: '60vh', overflowY: 'auto', padding: 'var(--space-4)' }}>
              {selectedDayPosts.length === 0 ? (
                <div style={{ padding: 'var(--space-6) var(--space-4)', borderRadius: 'var(--radius-lg)', background: 'var(--color-bg)', border: '1px dashed var(--color-border)', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--color-bg-secondary)', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
                    📅
                  </div>
                  <div>
                    <h4 style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--color-text)', margin: '0 0 4px 0' }}>
                      Nenhum post agendado para esta data
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', margin: 0, maxWidth: '340px', lineHeight: '1.4' }}>
                      Mantenha a frequência do seu salão ativa aproveitando esta data para programar novos conteúdos.
                    </p>
                  </div>
                  <Link
                    href="/dashboard/posts"
                    className="btn btn-primary btn-sm"
                    style={{ marginTop: '4px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    onClick={() => setSelectedDate(null)}
                  >
                    <Plus size={14} />
                    <span>Agendar Post para este dia</span>
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {selectedDayPosts.map((post) => (
                    <div
                      key={post.id}
                      style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: 'var(--color-bg)', border: '1px solid var(--color-border-light)', display: 'flex', flexDirection: 'column', gap: '8px' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span
                            className={`badge ${
                              post.status === 'PUBLISHED'
                                ? 'badge-success'
                                : post.status === 'SCHEDULED'
                                ? 'badge-primary'
                                : 'badge-neutral'
                            }`}
                          >
                            {post.status === 'PUBLISHED'
                              ? 'Publicado'
                              : post.status === 'SCHEDULED'
                              ? 'Agendado'
                              : 'Rascunho'}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {post.platform === 'INSTAGRAM' ? (
                              <Instagram size={12} className="text-pink-600" />
                            ) : post.platform === 'FACEBOOK' ? (
                              <Facebook size={12} className="text-blue-600" />
                            ) : (
                              'IG & FB'
                            )}
                            &bull; {post.postType}
                          </span>
                        </div>

                        <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} />
                          <span>
                            {post.scheduledAt
                              ? new Date(post.scheduledAt).toLocaleTimeString('pt-BR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : post.publishedAt
                              ? new Date(post.publishedAt).toLocaleTimeString('pt-BR', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : '--:--'}
                          </span>
                        </div>
                      </div>

                      <p style={{ fontSize: '0.8rem', color: 'var(--color-text)', margin: 0, whiteSpace: 'pre-wrap', lineHeight: '1.4', maxHeight: '4.2em', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {post.caption}
                      </p>

                      <div style={{ paddingTop: '8px', borderTop: '1px solid var(--color-border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-text-tertiary)' }}>
                          ID: #{post.id.slice(0, 8)}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            type="button"
                            className="btn btn-sm btn-ghost"
                            onClick={() => setSelectedPost(post)}
                            style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                          >
                            Ver Detalhes
                          </button>
                          <Link
                            href="/dashboard/posts"
                            className="btn btn-sm btn-primary"
                            onClick={() => setSelectedDate(null)}
                            style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                          >
                            Abrir no Editor
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-3) var(--space-4)', borderTop: '1px solid var(--color-border-light)' }}>
              <button
                type="button"
                className="btn btn-sm btn-ghost"
                onClick={() => setSelectedDate(null)}
              >
                Fechar
              </button>
              <Link
                href="/dashboard/posts"
                className="btn btn-sm btn-primary"
                onClick={() => setSelectedDate(null)}
                style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Plus size={14} />
                <span>+ Agendar Novo Post</span>
              </Link>
            </div>
          </div>
        </>
      )}

      {/* Post Detail Modal */}
      {selectedPost && (
        <>
          <div className="overlay" onClick={() => setSelectedPost(null)} />
          <div className="modal" style={{ width: 'min(90vw, 500px)' }}>
            <div className="modal-header">
              <h3>Detalhes do Post</h3>
              <button
                className="btn btn-ghost btn-icon"
                onClick={() => setSelectedPost(null)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div className="detail-status-bar">
                <span
                  className={`badge ${
                    selectedPost.status === 'PUBLISHED'
                      ? 'badge-success'
                      : selectedPost.status === 'SCHEDULED'
                      ? 'badge-primary'
                      : 'badge-neutral'
                  }`}
                >
                  {selectedPost.status === 'PUBLISHED'
                    ? 'Publicado'
                    : selectedPost.status === 'SCHEDULED'
                    ? 'Agendado'
                    : 'Rascunho'}
                </span>
                <span className="detail-time">
                  {selectedPost.scheduledAt
                    ? `Agendado para: ${formatDate(selectedPost.scheduledAt)}`
                    : selectedPost.publishedAt
                    ? `Publicado em: ${formatDate(selectedPost.publishedAt)}`
                    : `Criado em: ${formatDate(selectedPost.createdAt)}`}
                </span>
              </div>

              <div className="detail-caption-box">
                <p style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  {selectedPost.caption}
                </p>
              </div>

              <div className="detail-footer-links">
                <Link
                  href="/dashboard/posts"
                  className="btn btn-primary"
                  onClick={() => setSelectedPost(null)}
                >
                  Ver no Gerenciador de Posts
                </Link>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        .calendar-page {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        .calendar-layout {
          display: grid;
          grid-template-columns: 1fr 320px;
          gap: var(--space-6);
        }

        .calendar-card {
          padding: var(--space-6);
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .calendar-controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .calendar-title-wrap {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .calendar-icon-head {
          color: var(--color-primary);
        }

        .calendar-month-title {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--color-text);
        }

        .calendar-nav-buttons {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        /* Weekdays */
        .calendar-weekdays {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          font-size: 0.775rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-text-tertiary);
          border-bottom: 1px solid var(--color-border-light);
          padding-bottom: var(--space-2);
        }

        /* Grid */
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 1px;
          background: var(--color-border-light);
          border: 1px solid var(--color-border-light);
          border-radius: var(--radius-md);
          overflow: hidden;
        }

        .calendar-day-cell {
          background: #ffffff;
          height: 68px;
          min-height: 68px;
          max-height: 68px;
          padding: 6px 8px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          cursor: pointer;
          transition: all var(--transition-fast);
          user-select: none;
          position: relative;
        }

        .calendar-day-cell:hover {
          background: var(--color-surface-hover, #fafafa);
          box-shadow: inset 0 0 0 1px var(--color-primary);
        }

        .calendar-day-cell.selected-day-cell {
          background: var(--color-primary-50, #fcf7f0);
          box-shadow: inset 0 0 0 2px var(--color-primary);
        }

        .calendar-day-cell.other-month {
          background: var(--color-bg);
          opacity: 0.4;
        }

        .calendar-day-cell.today-cell {
          background: rgba(199, 142, 60, 0.05);
        }

        .cell-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .day-number {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--color-text-secondary);
        }

        .today-badge {
          background: var(--color-primary);
          color: white;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }

        .post-count-badge {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--color-primary);
          background: rgba(199, 142, 60, 0.12);
          padding: 1px 6px;
          border-radius: 9999px;
        }

        .cell-indicator-row {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          min-height: 12px;
        }

        .day-dots-group {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .day-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          display: inline-block;
        }

        .dot-published {
          background: #10b981;
        }

        .dot-scheduled {
          background: #3b82f6;
        }

        .dot-draft {
          background: #9ca3af;
        }

        .dot-overflow {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--color-primary);
          margin-left: 2px;
        }

        @media (max-width: 640px) {
          .calendar-day-cell {
            height: 52px;
            min-height: 52px;
            padding: 4px;
          }
        }

        /* Sidebar */
        .calendar-sidebar {
          padding: var(--space-6);
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }

        .sidebar-title-row {
          display: flex;
          align-items: center;
          gap: var(--space-2);
        }

        .sidebar-title-row h3 {
          font-size: 1rem;
          font-weight: 600;
          color: var(--color-text);
        }

        .upcoming-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .empty-upcoming {
          text-align: center;
          padding: var(--space-6) 0;
          color: var(--color-text-tertiary);
          font-size: 0.85rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-3);
        }

        .upcoming-item {
          padding: var(--space-3);
          display: flex;
          flex-direction: column;
          gap: 6px;
          cursor: pointer;
        }

        .upcoming-time-tag {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          color: var(--color-primary);
          font-weight: 600;
        }

        .upcoming-caption {
          font-size: 0.825rem;
          color: var(--color-text);
          font-weight: 500;
        }

        .upcoming-badges {
          display: flex;
          gap: 4px;
        }

        /* Detail Modal */
        .detail-status-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .detail-time {
          font-size: 0.8rem;
          color: var(--color-text-tertiary);
        }

        .detail-caption-box {
          background: var(--color-bg);
          padding: var(--space-4);
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
        }

        .detail-footer-links {
          display: flex;
          justify-content: flex-end;
        }

        @media (max-width: 900px) {
          .calendar-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

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

              return (
                <div
                  key={idx}
                  className={`calendar-day-cell ${isOtherMonth ? 'other-month' : ''} ${
                    isToday ? 'today-cell' : ''
                  }`}
                >
                  <div className="cell-header">
                    <span className={`day-number ${isToday ? 'today-badge' : ''}`}>
                      {item.day}
                    </span>
                    {dayPosts.length > 0 && (
                      <span className="post-count-dot">{dayPosts.length}</span>
                    )}
                  </div>

                  <div className="cell-posts-container">
                    {dayPosts.map((post) => (
                      <div
                        key={post.id}
                        className={`cell-post-pill ${
                          post.status === 'PUBLISHED'
                            ? 'pill-published'
                            : post.status === 'SCHEDULED'
                            ? 'pill-scheduled'
                            : 'pill-draft'
                        }`}
                        onClick={() => setSelectedPost(post)}
                      >
                        <span className="pill-platform">
                          {post.platform === 'INSTAGRAM' ? (
                            <Instagram size={10} />
                          ) : post.platform === 'FACEBOOK' ? (
                            <Facebook size={10} />
                          ) : (
                            'IG/FB'
                          )}
                        </span>
                        <span className="pill-caption truncate">{post.caption}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar: Upcoming Schedule */}
        <div className="card calendar-sidebar">
          <div className="sidebar-title-row">
            <Clock size={18} className="text-primary" />
            <h3>Próximos Agendamentos</h3>
          </div>

          <div className="upcoming-list">
            {upcomingScheduled.length === 0 ? (
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
          min-height: 90px;
          padding: var(--space-2);
          display: flex;
          flex-direction: column;
          gap: 4px;
          transition: background var(--transition-fast);
        }

        .calendar-day-cell:hover {
          background: var(--color-surface-hover);
        }

        .calendar-day-cell.other-month {
          background: var(--color-bg);
          opacity: 0.5;
        }

        .calendar-day-cell.today-cell {
          background: var(--color-primary-50);
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
        }

        .post-count-dot {
          background: var(--color-accent);
          color: white;
          font-size: 0.65rem;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cell-posts-container {
          display: flex;
          flex-direction: column;
          gap: 3px;
          overflow: hidden;
        }

        .cell-post-pill {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 2px 6px;
          border-radius: var(--radius-sm);
          font-size: 0.7rem;
          cursor: pointer;
          transition: transform var(--transition-fast);
        }

        .cell-post-pill:hover {
          transform: translateY(-1px);
        }

        .pill-published {
          background: #edf7f1;
          color: #276749;
          border-left: 2px solid var(--color-success);
        }

        .pill-scheduled {
          background: var(--color-primary-50);
          color: var(--color-primary-dark);
          border-left: 2px solid var(--color-primary);
        }

        .pill-draft {
          background: var(--color-bg-secondary);
          color: var(--color-text-secondary);
        }

        .pill-caption {
          font-weight: 500;
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

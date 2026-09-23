'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Video,
  Search,
  Filter,
  Trash2,
  X,
  CloudUpload,
  FileImage,
  Tag,
  Clock,
  Sparkles,
} from 'lucide-react';
import { formatFileSize, formatDate } from '@/lib/utils';

interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  path: string;
  thumbnailPath: string | null;
  type: 'IMAGE' | 'VIDEO';
  createdAt: string;
  aiAnalysis: Record<string, unknown> | null;
  tags: { id: string; tag: string; category: string }[];
}

export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');
  const [search, setSearch] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.set('type', filter);
      if (search) params.set('search', search);

      const res = await fetch(`/api/media?${params.toString()}`);
      const data = await res.json();
      setMedia(data.media || []);
    } catch (err) {
      console.error('Fetch media error:', err);
    } finally {
      setLoading(false);
    }
  }, [filter, search]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleUpload = async (files: FileList | File[]) => {
    if (!files.length) return;
    setUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append('files', file));

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setUploadProgress(100);
        setTimeout(() => {
          setUploading(false);
          setUploadProgress(0);
          fetchMedia();
        }, 500);
      } else {
        const data = await res.json();
        alert(data.error || 'Erro ao fazer upload');
        setUploading(false);
      }
    } catch {
      alert('Erro ao fazer upload. Tente novamente.');
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deseja excluir esta mídia?')) return;

    try {
      const res = await fetch('/api/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setMedia(prev => prev.filter(m => m.id !== id));
        if (selectedMedia?.id === id) setSelectedMedia(null);
      }
    } catch {
      alert('Erro ao excluir mídia');
    }
  };

  const getMediaUrl = (path: string) => {
    // Convert /uploads/originals/filename to /api/files/originals/filename
    return path.replace('/uploads/', '/api/files/');
  };

  return (
    <div className="media-page max-w-[1360px] mx-auto w-full px-4 lg:px-8">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Biblioteca de Mídia</h1>
          <p className="page-description">
            {media.length} {media.length === 1 ? 'arquivo' : 'arquivos'}
          </p>
        </div>
        <div className="page-actions">
          <button
            className="btn btn-primary"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={16} />
            Upload
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={(e) => e.target.files && handleUpload(e.target.files)}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {/* Filters Bar */}
      <div className="media-filters">
        <div className="media-search">
          <Search size={16} className="media-search-icon" />
          <input
            type="text"
            className="input"
            placeholder="Buscar por nome..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="media-type-filters">
          {[
            { value: 'all' as const, label: 'Todos', icon: Filter },
            { value: 'image' as const, label: 'Imagens', icon: ImageIcon },
            { value: 'video' as const, label: 'Vídeos', icon: Video },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <button
                key={f.value}
                className={`btn ${filter === f.value ? 'btn-primary btn-sm' : 'btn-ghost btn-sm'}`}
                onClick={() => setFilter(f.value)}
              >
                <Icon size={14} />
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Upload Zone */}
      <div
        className={`upload-zone ${dragOver ? 'upload-zone-active' : ''} ${uploading ? 'upload-zone-uploading' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        {uploading ? (
          <div className="upload-progress">
            <div className="upload-spinner animate-spin" />
            <span>Enviando arquivos...</span>
            <div className="upload-progress-bar">
              <div className="upload-progress-fill" style={{ width: `${uploadProgress}%` }} />
            </div>
          </div>
        ) : (
          <>
            <CloudUpload size={32} strokeWidth={1.5} />
            <p><strong>Arraste e solte</strong> seus arquivos aqui</p>
            <span>ou clique para selecionar • JPG, PNG, MP4 • até 50MB</span>
          </>
        )}
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="media-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="media-skeleton skeleton" />
          ))}
        </div>
      ) : media.length === 0 ? (
        <div className="empty-state">
          <FileImage size={64} strokeWidth={1} className="empty-state-icon" />
          <h3 className="empty-state-title">Nenhuma mídia ainda</h3>
          <p className="empty-state-description">
            Faça upload de fotos e vídeos do salão para começar a criar conteúdo incrível.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={16} />
            Fazer primeiro upload
          </button>
        </div>
      ) : (
        <div className="media-grid">
          {media.map((item) => (
            <div
              key={item.id}
              className="media-card card-interactive"
              onClick={() => setSelectedMedia(item)}
            >
              <div className="media-card-preview">
                {item.type === 'IMAGE' ? (
                  <img
                    src={getMediaUrl(item.path)}
                    alt={item.originalName}
                    loading="lazy"
                  />
                ) : (
                  <div className="media-card-video">
                    <Video size={32} />
                  </div>
                )}
                <div className="media-card-overlay">
                  <button
                    className="btn btn-icon btn-sm btn-danger"
                    onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                    title="Excluir"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="media-card-type">
                  <span className="badge badge-neutral">
                    {item.type === 'IMAGE' ? <ImageIcon size={10} /> : <Video size={10} />}
                    {item.type === 'IMAGE' ? 'IMG' : 'VID'}
                  </span>
                </div>
              </div>
              <div className="media-card-info">
                <span className="media-card-name truncate">{item.originalName}</span>
                <div className="media-card-meta">
                  <span>{formatFileSize(item.size)}</span>
                  <span>•</span>
                  <span>{formatDate(item.createdAt)}</span>
                </div>
                {item.tags.length > 0 && (
                  <div className="media-card-tags">
                    {item.tags.slice(0, 3).map((t) => (
                      <span key={t.id} className="badge badge-primary">{t.tag}</span>
                    ))}
                    {item.tags.length > 3 && (
                      <span className="badge badge-neutral">+{item.tags.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Media Detail Modal */}
      {selectedMedia && (
        <>
          <div className="overlay" onClick={() => setSelectedMedia(null)} />
          <div className="modal media-modal">
            <div className="modal-header">
              <h3>{selectedMedia.originalName}</h3>
              <button
                className="btn btn-ghost btn-icon"
                onClick={() => setSelectedMedia(null)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="media-detail-preview">
                {selectedMedia.type === 'IMAGE' ? (
                  <img
                    src={getMediaUrl(selectedMedia.path)}
                    alt={selectedMedia.originalName}
                  />
                ) : (
                  <video
                    src={getMediaUrl(selectedMedia.path)}
                    controls
                    className="media-detail-video"
                  />
                )}
              </div>
              <div className="media-detail-info">
                <div className="media-detail-row">
                  <FileImage size={16} />
                  <span><strong>Tipo:</strong> {selectedMedia.mimeType}</span>
                </div>
                <div className="media-detail-row">
                  <Tag size={16} />
                  <span><strong>Tamanho:</strong> {formatFileSize(selectedMedia.size)}</span>
                </div>
                <div className="media-detail-row">
                  <Clock size={16} />
                  <span><strong>Enviado:</strong> {formatDate(selectedMedia.createdAt)}</span>
                </div>
                {selectedMedia.tags.length > 0 && (
                  <div className="media-detail-tags">
                    <Sparkles size={16} />
                    <div className="media-detail-tags-list">
                      {selectedMedia.tags.map((t) => (
                        <span key={t.id} className="badge badge-primary">{t.tag}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-danger btn-sm"
                onClick={() => { handleDelete(selectedMedia.id); setSelectedMedia(null); }}
              >
                <Trash2 size={14} />
                Excluir
              </button>
            </div>
          </div>
        </>
      )}

      <style>{`
        .media-page {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }

        /* ─── Filters ──────────────────── */
        .media-filters {
          display: flex;
          gap: var(--space-4);
          align-items: center;
          flex-wrap: wrap;
        }

        .media-search {
          position: relative;
          flex: 1;
          min-width: 200px;
          max-width: 400px;
        }

        .media-search-icon {
          position: absolute;
          left: var(--space-4);
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-tertiary);
          pointer-events: none;
        }

        .media-search .input {
          padding-left: var(--space-10);
        }

        .media-type-filters {
          display: flex;
          gap: var(--space-2);
        }

        /* ─── Upload Zone ──────────────── */
        .upload-zone {
          border: 2px dashed var(--color-border);
          border-radius: var(--radius-xl);
          padding: var(--space-8);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: var(--space-2);
          text-align: center;
          color: var(--color-text-tertiary);
          cursor: pointer;
          transition: all var(--transition-base);
          background: var(--color-surface);
        }

        .upload-zone:hover,
        .upload-zone-active {
          border-color: var(--color-primary);
          background: var(--color-primary-50);
          color: var(--color-primary);
        }

        .upload-zone-uploading {
          cursor: default;
          border-color: var(--color-primary-light);
          background: var(--color-primary-50);
        }

        .upload-zone p { font-size: 0.9375rem; }
        .upload-zone span { font-size: 0.8125rem; }

        .upload-progress {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-3);
          color: var(--color-primary);
        }

        .upload-spinner {
          width: 32px;
          height: 32px;
          border: 3px solid var(--color-primary-200);
          border-top-color: var(--color-primary);
          border-radius: 50%;
        }

        .upload-progress-bar {
          width: 200px;
          height: 4px;
          background: var(--color-primary-200);
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .upload-progress-fill {
          height: 100%;
          background: var(--color-primary);
          border-radius: var(--radius-full);
          transition: width var(--transition-base);
        }

        /* ─── Media Grid ───────────────── */
        .media-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: var(--space-4);
        }

        .media-skeleton {
          aspect-ratio: 1;
          border-radius: var(--radius-lg);
        }

        .media-card {
          background: var(--color-surface);
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid var(--color-border-light);
          cursor: pointer;
          transition: all var(--transition-base);
        }

        .media-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-lg);
        }

        .media-card-preview {
          aspect-ratio: 1;
          position: relative;
          overflow: hidden;
          background: var(--color-bg-tertiary);
        }

        .media-card-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-slow);
        }

        .media-card:hover .media-card-preview img {
          transform: scale(1.05);
        }

        .media-card-video {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-tertiary);
          background: linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-tertiary) 100%);
        }

        .media-card-overlay {
          position: absolute;
          top: var(--space-2);
          right: var(--space-2);
          display: flex;
          gap: var(--space-1);
          opacity: 0;
          transition: opacity var(--transition-fast);
        }

        .media-card:hover .media-card-overlay {
          opacity: 1;
        }

        .media-card-type {
          position: absolute;
          bottom: var(--space-2);
          left: var(--space-2);
        }

        .media-card-info {
          padding: var(--space-3) var(--space-4);
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
        }

        .media-card-name {
          font-size: 0.8125rem;
          font-weight: 500;
          color: var(--color-text);
        }

        .media-card-meta {
          display: flex;
          gap: var(--space-2);
          font-size: 0.6875rem;
          color: var(--color-text-tertiary);
        }

        .media-card-tags {
          display: flex;
          gap: var(--space-1);
          flex-wrap: wrap;
          margin-top: var(--space-1);
        }

        /* ─── Modal ────────────────────── */
        .media-modal {
          width: min(90vw, 700px);
        }

        .media-detail-preview {
          border-radius: var(--radius-md);
          overflow: hidden;
          background: var(--color-bg-tertiary);
          margin-bottom: var(--space-4);
        }

        .media-detail-preview img {
          width: 100%;
          max-height: 400px;
          object-fit: contain;
        }

        .media-detail-video {
          width: 100%;
          max-height: 400px;
        }

        .media-detail-info {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }

        .media-detail-row {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          font-size: 0.875rem;
          color: var(--color-text-secondary);
        }

        .media-detail-tags {
          display: flex;
          align-items: flex-start;
          gap: var(--space-3);
          font-size: 0.875rem;
          color: var(--color-text-secondary);
        }

        .media-detail-tags-list {
          display: flex;
          gap: var(--space-2);
          flex-wrap: wrap;
        }

        @media (max-width: 768px) {
          .media-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: var(--space-3);
          }
        }
      `}</style>
    </div>
  );
}

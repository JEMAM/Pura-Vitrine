'use client';

import { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Scissors,
  Share2,
  ThumbsUp,
  Sparkles,
} from 'lucide-react';
import { InstagramIcon as Instagram, FacebookIcon as Facebook } from '@/components/icons';

interface SocialPostPreviewProps {
  caption: string;
  hashtags?: string;
  mediaUrl?: string | null;
  salonName?: string;
  salonHandle?: string;
  platform?: 'INSTAGRAM' | 'FACEBOOK' | 'BOTH';
  postType?: 'FEED' | 'STORY' | 'REEL';
}

export default function SocialPostPreview({
  caption,
  hashtags,
  mediaUrl,
  salonName = 'Studio Beleza & Elegância',
  salonHandle = 'studiobelezasp',
  platform = 'INSTAGRAM',
  postType = 'FEED',
}: SocialPostPreviewProps) {
  const [activePlatform, setActivePlatform] = useState<'INSTAGRAM' | 'FACEBOOK'>(
    platform === 'FACEBOOK' ? 'FACEBOOK' : 'INSTAGRAM'
  );
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expandedCaption, setExpandedCaption] = useState(false);

  const displayMedia =
    mediaUrl ||
    'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800&q=80';

  const fullCaption = `${caption || 'Sua legenda personalizada com IA aparecerá aqui...'}${
    hashtags ? `\n\n${hashtags}` : ''
  }`;

  return (
    <div className="social-preview-container">
      {/* Platform Switcher */}
      <div className="preview-top-bar">
        <span className="preview-label">Pré-visualização em Tempo Real:</span>
        <div className="preview-switcher">
          <button
            type="button"
            className={`btn-switch ${activePlatform === 'INSTAGRAM' ? 'active-ig' : ''}`}
            onClick={() => setActivePlatform('INSTAGRAM')}
          >
            <Instagram size={14} /> Instagram
          </button>
          <button
            type="button"
            className={`btn-switch ${activePlatform === 'FACEBOOK' ? 'active-fb' : ''}`}
            onClick={() => setActivePlatform('FACEBOOK')}
          >
            <Facebook size={14} /> Facebook
          </button>
        </div>
      </div>

      {/* MOCKUP: INSTAGRAM */}
      {activePlatform === 'INSTAGRAM' && (
        <div className={`ig-phone-frame ${postType === 'STORY' ? 'ig-story-frame' : ''}`}>
          {postType === 'STORY' ? (
            /* STORY MOCKUP */
            <div className="ig-story-container">
              <div
                className="ig-story-bg"
                style={{ backgroundImage: `url(${displayMedia})` }}
              >
                <div className="ig-story-overlay">
                  <div className="ig-story-header">
                    <div className="ig-story-user">
                      <div className="ig-avatar-ring">
                        <div className="ig-avatar-inner">
                          <Scissors size={12} />
                        </div>
                      </div>
                      <span className="ig-story-name">{salonHandle}</span>
                      <span className="ig-story-time">2 h</span>
                    </div>
                    <MoreHorizontal size={18} color="white" />
                  </div>

                  <div className="ig-story-caption-card">
                    <p>{caption || 'Toque no link abaixo para agendar!'}</p>
                    {hashtags && <span className="ig-story-tags">{hashtags}</span>}
                  </div>

                  <div className="ig-story-footer">
                    <div className="ig-story-reply">Enviar mensagem...</div>
                    <Heart size={20} color="white" />
                    <Send size={20} color="white" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* FEED MOCKUP */
            <div className="ig-mockup-card">
              {/* Header */}
              <div className="ig-header">
                <div className="ig-user-info">
                  <div className="ig-avatar-ring">
                    <div className="ig-avatar-inner">
                      <Scissors size={14} />
                    </div>
                  </div>
                  <div className="ig-user-text">
                    <span className="ig-username">{salonHandle}</span>
                    <span className="ig-location">{salonName} • São Paulo</span>
                  </div>
                </div>
                <MoreHorizontal size={18} className="ig-more" />
              </div>

              {/* Photo */}
              <div className="ig-media-box">
                <img src={displayMedia} alt="Post preview" className="ig-image" />
                <div className="ig-double-tap-hint">
                  <Sparkles size={12} /> Preview Oficial
                </div>
              </div>

              {/* Action Bar */}
              <div className="ig-actions">
                <div className="ig-actions-left">
                  <button
                    type="button"
                    className={`ig-action-btn ${liked ? 'liked' : ''}`}
                    onClick={() => setLiked(!liked)}
                  >
                    <Heart size={22} fill={liked ? '#ed4956' : 'none'} color={liked ? '#ed4956' : '#262626'} />
                  </button>
                  <button type="button" className="ig-action-btn">
                    <MessageCircle size={22} color="#262626" />
                  </button>
                  <button type="button" className="ig-action-btn">
                    <Send size={22} color="#262626" />
                  </button>
                </div>
                <button
                  type="button"
                  className="ig-action-btn"
                  onClick={() => setSaved(!saved)}
                >
                  <Bookmark size={22} fill={saved ? '#262626' : 'none'} color="#262626" />
                </button>
              </div>

              {/* Likes */}
              <div className="ig-likes">
                Curtido por <strong>camila_colorista</strong> e <strong>outras 342 pessoas</strong>
              </div>

              {/* Caption */}
              <div className="ig-caption-box">
                <span className="ig-username">{salonHandle}</span>{' '}
                <span className="ig-caption-text">
                  {expandedCaption ? (
                    <span style={{ whiteSpace: 'pre-wrap' }}>{fullCaption}</span>
                  ) : (
                    <>
                      {caption ? caption.slice(0, 110) : 'Sua legenda incrível aparecerá aqui...'}
                      {caption && caption.length > 110 && (
                        <button
                          type="button"
                          className="ig-more-btn"
                          onClick={() => setExpandedCaption(true)}
                        >
                          {' '}
                          ...mais
                        </button>
                      )}
                    </>
                  )}
                </span>
              </div>

              {/* Comments mock */}
              <div className="ig-view-comments">Ver todos os 48 comentários</div>
              <div className="ig-add-comment">
                <div className="ig-mini-avatar">
                  <Scissors size={10} />
                </div>
                <span className="ig-comment-placeholder">Adicione um comentário...</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MOCKUP: FACEBOOK */}
      {activePlatform === 'FACEBOOK' && (
        <div className="fb-mockup-card">
          <div className="fb-header">
            <div className="fb-user-info">
              <div className="fb-avatar">
                <Scissors size={18} />
              </div>
              <div className="fb-user-text">
                <span className="fb-name">{salonName}</span>
                <span className="fb-date">Publicado agora • 🌎</span>
              </div>
            </div>
            <MoreHorizontal size={18} className="fb-more" />
          </div>

          <div className="fb-caption-text" style={{ whiteSpace: 'pre-wrap' }}>
            {fullCaption}
          </div>

          <div className="fb-media-box">
            <img src={displayMedia} alt="Facebook post" className="fb-image" />
          </div>

          <div className="fb-metrics-bar">
            <div className="fb-reactions">
              <span className="fb-icon-circle bg-blue">👍</span>
              <span className="fb-icon-circle bg-pink">❤️</span>
              <span className="fb-reactions-count">128</span>
            </div>
            <div className="fb-comments-count">19 comentários • 8 compartilhamentos</div>
          </div>

          <div className="fb-actions-bar">
            <button type="button" className="fb-action-btn">
              <ThumbsUp size={16} /> Curtir
            </button>
            <button type="button" className="fb-action-btn">
              <MessageCircle size={16} /> Comentar
            </button>
            <button type="button" className="fb-action-btn">
              <Share2 size={16} /> Compartilhar
            </button>
          </div>
        </div>
      )}

      <style>{`
        .social-preview-container {
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          max-width: 440px;
          margin: 0 auto;
        }

        .preview-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 var(--space-2);
        }

        .preview-label {
          font-size: 0.8rem;
          color: var(--color-text-tertiary);
          font-weight: 500;
        }

        .preview-switcher {
          display: flex;
          gap: var(--space-1);
          background: var(--color-bg-secondary);
          padding: 3px;
          border-radius: var(--radius-full);
        }

        .btn-switch {
          display: flex;
          align-items: center;
          gap: 4px;
          border: none;
          background: transparent;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .btn-switch.active-ig {
          background: #ffffff;
          color: #c13584;
          box-shadow: var(--shadow-sm);
        }

        .btn-switch.active-fb {
          background: #ffffff;
          color: #1877f2;
          box-shadow: var(--shadow-sm);
        }

        /* INSTAGRAM FEED MOCKUP */
        .ig-phone-frame {
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          border: 1px solid #e1e8ed;
          overflow: hidden;
        }

        .ig-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
        }

        .ig-user-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .ig-avatar-ring {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          padding: 2px;
          background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ig-avatar-inner {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-primary);
        }

        .ig-user-text {
          display: flex;
          flex-direction: column;
        }

        .ig-username {
          font-size: 0.85rem;
          font-weight: 700;
          color: #262626;
        }

        .ig-location {
          font-size: 0.7rem;
          color: #8e8e8e;
        }

        .ig-more {
          color: #262626;
        }

        .ig-media-box {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          background: #000;
        }

        .ig-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .ig-double-tap-hint {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: rgba(0, 0, 0, 0.65);
          color: #ffffff;
          font-size: 0.65rem;
          padding: 3px 8px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .ig-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px 6px;
        }

        .ig-actions-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .ig-action-btn {
          border: none;
          background: transparent;
          cursor: pointer;
          padding: 0;
          display: flex;
        }

        .ig-likes {
          padding: 0 14px;
          font-size: 0.8rem;
          color: #262626;
          margin-bottom: 6px;
        }

        .ig-caption-box {
          padding: 0 14px;
          font-size: 0.825rem;
          line-height: 1.4;
          color: #262626;
        }

        .ig-more-btn {
          border: none;
          background: transparent;
          color: #8e8e8e;
          cursor: pointer;
          font-size: 0.825rem;
        }

        .ig-view-comments {
          padding: 6px 14px 0;
          font-size: 0.775rem;
          color: #8e8e8e;
        }

        .ig-add-comment {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 14px 14px;
        }

        .ig-mini-avatar {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--color-bg-tertiary);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-primary);
        }

        .ig-comment-placeholder {
          font-size: 0.775rem;
          color: #8e8e8e;
        }

        /* INSTAGRAM STORY MOCKUP */
        .ig-story-frame {
          aspect-ratio: 9 / 16;
          max-height: 580px;
        }

        .ig-story-container {
          width: 100%;
          height: 100%;
        }

        .ig-story-bg {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          position: relative;
        }

        .ig-story-overlay {
          width: 100%;
          height: 100%;
          background: linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 20%, transparent 70%, rgba(0,0,0,0.8) 100%);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 14px;
          box-sizing: border-box;
        }

        .ig-story-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .ig-story-user {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ig-story-name {
          color: white;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .ig-story-time {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.75rem;
        }

        .ig-story-caption-card {
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          padding: 12px;
          color: white;
          font-size: 0.85rem;
          line-height: 1.4;
          margin-top: auto;
          margin-bottom: 14px;
        }

        .ig-story-tags {
          display: block;
          margin-top: 6px;
          font-size: 0.75rem;
          color: var(--color-primary-light);
        }

        .ig-story-footer {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ig-story-reply {
          flex: 1;
          border: 1px solid rgba(255, 255, 255, 0.4);
          border-radius: 20px;
          padding: 8px 14px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.75rem;
        }

        /* FACEBOOK FEED MOCKUP */
        .fb-mockup-card {
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.06);
          border: 1px solid #dddfe2;
          overflow: hidden;
        }

        .fb-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
        }

        .fb-user-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .fb-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #1877f2;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .fb-user-text {
          display: flex;
          flex-direction: column;
        }

        .fb-name {
          font-size: 0.9rem;
          font-weight: 700;
          color: #050505;
        }

        .fb-date {
          font-size: 0.75rem;
          color: #65676b;
        }

        .fb-more {
          color: #65676b;
        }

        .fb-caption-text {
          padding: 0 16px 10px;
          font-size: 0.875rem;
          color: #050505;
          line-height: 1.4;
        }

        .fb-media-box {
          width: 100%;
          aspect-ratio: 1;
          background: #f0f2f5;
        }

        .fb-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .fb-metrics-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 16px;
          border-bottom: 1px solid #ced0d4;
          font-size: 0.775rem;
          color: #65676b;
        }

        .fb-reactions {
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .fb-icon-circle {
          display: inline-flex;
          font-size: 0.8rem;
        }

        .fb-reactions-count {
          margin-left: 4px;
        }

        .fb-actions-bar {
          display: flex;
          padding: 4px 8px;
        }

        .fb-action-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 0;
          border: none;
          background: transparent;
          font-size: 0.825rem;
          font-weight: 600;
          color: #65676b;
          border-radius: 6px;
          cursor: pointer;
        }

        .fb-action-btn:hover {
          background: #f0f2f5;
        }
      `}</style>
    </div>
  );
}

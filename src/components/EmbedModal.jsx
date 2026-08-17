import React, { useState } from 'react';
import { X, Share2, Copy, Check, Code, Globe, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function EmbedModal({ isOpen, onClose, doc }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  if (!isOpen || !doc) return null;

  const publicUrl = `https://docusphere.dev/@public/doc/${doc.id}`;
  const embedCode = `<iframe src="${publicUrl}?embed=true" width="100%" height="600" frameborder="0" style="border-radius: 12px; border: 1px solid #e2e8f0;"></iframe>`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopiedLink(true);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedEmbed(true);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
    setTimeout(() => setCopiedEmbed(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: '800' }}>
              Public Share & Website Embed Widget
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Publish your README for public web viewing or embed on your portfolio.
            </p>
          </div>
          <button className="fav-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Public Share Link Section */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '700', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
            <Globe size={16} style={{ color: 'var(--accent-primary)' }} /> Public Web Permalink
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              readOnly
              className="search-input"
              style={{ flex: 1, backgroundColor: 'var(--bg-subtle)' }}
              value={publicUrl}
            />
            <button className="btn btn-primary btn-sm" onClick={handleCopyLink}>
              {copiedLink ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Embed Widget Code Section */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: '700', fontFamily: 'var(--font-heading)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
            <Code size={16} style={{ color: 'var(--sky-primary)' }} /> Embed HTML iFrame Code
          </label>
          <textarea
            readOnly
            className="editor-textarea"
            style={{ height: '85px', fontSize: '0.82rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.5rem' }}
            value={embedCode}
          />
          <button className="btn btn-secondary btn-sm" onClick={handleCopyEmbed} style={{ width: '100%', justifyContent: 'center' }}>
            {copiedEmbed ? <Check size={14} style={{ color: 'var(--emerald-primary)' }} /> : <Copy size={14} />}
            <span>{copiedEmbed ? 'iFrame Code Copied!' : 'Copy iFrame Code'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

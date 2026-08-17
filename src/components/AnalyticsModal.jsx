import React from 'react';
import { X, Eye, Copy, Download, Clock, TrendingUp } from 'lucide-react';
import { getDocumentAnalytics } from '../utils/userState';

export default function AnalyticsModal({ isOpen, onClose, doc }) {
  if (!isOpen || !doc) return null;

  const statsMap = getDocumentAnalytics();
  const docStats = statsMap[doc.id] || { views: 1, copies: 0, exports: 0, lastViewed: new Date().toISOString() };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: '800' }}>
              Document Analytics & Traffic
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {doc.title} ({doc.filename})
            </p>
          </div>
          <button className="fav-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="stat-card" style={{ padding: '1rem' }}>
            <div className="stat-icon-wrapper stat-blue" style={{ width: '38px', height: '38px' }}>
              <Eye size={18} />
            </div>
            <div>
              <div className="stat-value">{docStats.views}</div>
              <div className="stat-label">Total Views</div>
            </div>
          </div>

          <div className="stat-card" style={{ padding: '1rem' }}>
            <div className="stat-icon-wrapper stat-emerald" style={{ width: '38px', height: '38px' }}>
              <Copy size={18} />
            </div>
            <div>
              <div className="stat-value">{docStats.copies || 0}</div>
              <div className="stat-label">Raw Copies</div>
            </div>
          </div>

          <div className="stat-card" style={{ padding: '1rem' }}>
            <div className="stat-icon-wrapper stat-amber" style={{ width: '38px', height: '38px' }}>
              <Download size={18} />
            </div>
            <div>
              <div className="stat-value">{docStats.exports || 0}</div>
              <div className="stat-label">Exports</div>
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <TrendingUp size={16} /> Activity Log
          </h4>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            Last reader engagement recorded on: <strong style={{ color: 'var(--accent-primary)' }}>{new Date(docStats.lastViewed || Date.now()).toLocaleString()}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}

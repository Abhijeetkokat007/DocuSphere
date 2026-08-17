import React from 'react';
import { X, History, RotateCcw, Clock, Check } from 'lucide-react';
import { getDocVersions } from '../utils/versionHistory';
import confetti from 'canvas-confetti';

export default function VersionModal({ isOpen, onClose, doc, onRestoreVersion }) {
  if (!isOpen || !doc) return null;

  const versions = getDocVersions(doc.id);

  const handleRestore = (ver) => {
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    onRestoreVersion(ver.content);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: '800' }}>
              Document Revision History
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {doc.title} ({doc.filename})
            </p>
          </div>
          <button className="fav-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {versions.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
            <History size={32} style={{ marginBottom: '0.5rem', color: 'var(--text-muted)' }} />
            <p style={{ fontSize: '0.9rem' }}>No previous revisions recorded for this document yet.</p>
            <p style={{ fontSize: '0.78rem' }}>Revisions are saved automatically whenever you edit and save the README.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '60vh', overflowY: 'auto' }}>
            {versions.map((ver, idx) => (
              <div
                key={ver.versionId}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                    <Clock size={14} style={{ color: 'var(--accent-primary)' }} />
                    <strong style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem' }}>
                      {new Date(ver.timestamp).toLocaleString()}
                    </strong>
                    {idx === 0 && <span style={{ fontSize: '0.7rem', background: 'var(--emerald-light)', color: 'var(--emerald-primary)', padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-full)', fontWeight: '700' }}>Current Version</span>}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Saved by {ver.updatedBy} • Title: "{ver.title}"
                  </p>
                </div>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleRestore(ver)}
                  disabled={idx === 0}
                  title="Restore this version"
                >
                  <RotateCcw size={14} />
                  <span>Restore</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

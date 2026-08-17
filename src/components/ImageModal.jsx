import React from 'react';
import { X } from 'lucide-react';

export default function ImageModal({ imgSrc, onClose }) {
  if (!imgSrc) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 200 }}>
      <div
        style={{
          position: 'relative',
          maxWidth: '90vw',
          maxHeight: '90vh',
          background: 'white',
          borderRadius: 'var(--radius-md)',
          padding: '0.5rem',
          boxShadow: 'var(--shadow-lg)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="fav-btn"
          style={{ position: 'absolute', top: '-12px', right: '-12px', background: 'white', borderRadius: '50%', padding: '4px', boxShadow: 'var(--shadow-md)' }}
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <img
          src={imgSrc}
          alt="Zoom Preview"
          style={{ maxWidth: '100%', maxHeight: '85vh', objectFit: 'contain', borderRadius: 'var(--radius-sm)' }}
        />
      </div>
    </div>
  );
}

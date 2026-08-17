import React from 'react';
import { Sparkles, Star, Copy, ArrowRight, BookOpen, Layers } from 'lucide-react';
import { COMMUNITY_TEMPLATES } from '../utils/templateData';
import confetti from 'canvas-confetti';

export default function TemplateGallery({ onSelectTemplate, onBack }) {
  const handleUseTemplate = (template) => {
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    onSelectTemplate({
      title: `${template.title} (From Template)`,
      filename: `${template.title.toLowerCase().replace(/\s+/g, '_')}.md`,
      category: template.category,
      tags: [...template.tags, 'Template'],
      favorite: false,
      content: template.content
    });
  };

  return (
    <div className="template-gallery-container">
      {/* Header Banner */}
      <div className="dashboard-header">
        <div className="welcome-card" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)', borderColor: '#bae6fd' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--sky-light)', color: 'var(--sky-primary)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', fontSize: '0.78rem', fontWeight: '700', marginBottom: '0.6rem' }}>
              <Sparkles size={14} /> Open-Source Community Showcase
            </div>
            <h1 className="welcome-title">Viral README Templates Gallery</h1>
            <p className="welcome-subtitle">
              Choose from battle-tested open-source README templates designed to wow developers, investors, and users.
            </p>
          </div>

          <button className="btn btn-secondary" onClick={onBack}>
            <BookOpen size={16} /> Back to Dashboard
          </button>
        </div>
      </div>

      {/* Grid of Templates */}
      <div className="docs-grid">
        {COMMUNITY_TEMPLATES.map((tpl) => (
          <div key={tpl.id} className="doc-card">
            <div className="doc-header">
              <div>
                <span className="doc-tag" style={{ background: 'var(--accent-light)', color: 'var(--accent-primary)', marginBottom: '0.4rem', display: 'inline-block' }}>
                  {tpl.category}
                </span>
                <h3 className="doc-title">{tpl.title}</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.82rem', fontWeight: '700', color: 'var(--amber-primary)' }}>
                <Star size={14} fill="currentColor" /> {tpl.stars}
              </div>
            </div>

            <p className="doc-preview-text" style={{ minHeight: '60px' }}>
              {tpl.description}
            </p>

            <div className="doc-footer">
              <div className="doc-tags">
                {tpl.tags.map(t => (
                  <span key={t} className="doc-tag">{t}</span>
                ))}
              </div>

              <button className="btn btn-primary btn-sm" onClick={() => handleUseTemplate(tpl)}>
                <span>Use Template</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

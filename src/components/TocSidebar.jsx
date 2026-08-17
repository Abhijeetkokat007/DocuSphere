import React from 'react';
import { ListTree, Hash } from 'lucide-react';
import { extractHeadings } from '../utils/storage';

export default function TocSidebar({ content, activeHeadingId, onHeadingClick }) {
  const headings = extractHeadings(content);

  if (headings.length === 0) {
    return (
      <aside className="toc-sidebar">
        <div className="toc-title">
          <ListTree size={16} />
          <span>Outline</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          No headings found in this document.
        </p>
      </aside>
    );
  }

  return (
    <aside className="toc-sidebar">
      <div className="toc-title">
        <ListTree size={16} />
        <span>Table of Contents</span>
      </div>
      <ul className="toc-list">
        {headings.map((h, idx) => (
          <li key={idx}>
            <a
              href={`#${h.id}`}
              className={`toc-item toc-level-${h.level} ${
                activeHeadingId === h.id ? 'active' : ''
              }`}
              onClick={(e) => {
                e.preventDefault();
                onHeadingClick(h.id);
              }}
            >
              {h.title}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

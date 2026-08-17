import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Edit3, 
  Copy, 
  Download, 
  Printer, 
  ZoomIn, 
  ZoomOut, 
  Check, 
  ListTree,
  FileCode,
  Share2,
  BarChart2,
  History
} from 'lucide-react';
import TocSidebar from './TocSidebar';
import { renderMarkdown } from '../utils/markdownParser';
import { calculateWordCount, calculateReadingTime, exportAsFile } from '../utils/storage';
import { recordDocumentView, recordDocumentAction } from '../utils/userState';
import confetti from 'canvas-confetti';

export default function ReadmeViewer({
  doc,
  onBack,
  onEdit,
  onImageClick,
  onOpenAnalytics,
  onOpenEmbed,
  onOpenVersions
}) {
  const [fontSize, setFontSize] = useState(16);
  const [showToc, setShowToc] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeHeadingId, setActiveHeadingId] = useState('');
  const [readingProgress, setReadingProgress] = useState(0);

  const paperRef = useRef(null);

  useEffect(() => {
    if (doc?.id) {
      recordDocumentView(doc.id);
    }
  }, [doc?.id]);

  const renderedHtml = renderMarkdown(doc.content);
  const words = calculateWordCount(doc.content);
  const readTime = calculateReadingTime(words);

  useEffect(() => {
    const handleScroll = () => {
      const el = paperRef.current;
      if (!el) return;

      const totalHeight = el.scrollHeight - el.clientHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (el.scrollTop / totalHeight) * 100));
        setReadingProgress(progress);
      }

      const headings = Array.from(el.querySelectorAll('h1[id], h2[id], h3[id]'));
      for (const h of headings) {
        const rect = h.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= 200) {
          setActiveHeadingId(h.id);
          break;
        }
      }
    };

    const currentEl = paperRef.current;
    if (currentEl) {
      currentEl.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (currentEl) {
        currentEl.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleCopyRaw = () => {
    navigator.clipboard.writeText(doc.content);
    recordDocumentAction(doc.id, 'copies');
    setCopied(true);
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.8 } });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    recordDocumentAction(doc.id, 'exports');
    exportAsFile(doc.filename || 'README.md', doc.content);
  };

  const handleHeadingClick = (id) => {
    setActiveHeadingId(id);
    const target = paperRef.current?.querySelector(`#${id}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="viewer-container">
      {/* Top Header Navigation Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <button className="btn btn-secondary" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </button>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary" onClick={() => onOpenVersions(doc)}>
            <History size={16} />
            <span>Version History</span>
          </button>
          <button className="btn btn-secondary" onClick={() => onOpenAnalytics(doc)}>
            <BarChart2 size={16} />
            <span>Traffic Stats</span>
          </button>
          <button className="btn btn-secondary" onClick={() => onOpenEmbed(doc)}>
            <Share2 size={16} />
            <span>Public Share & Embed</span>
          </button>
          <button className="btn btn-secondary" onClick={() => setShowToc(!showToc)}>
            <ListTree size={16} />
            <span>{showToc ? 'Hide Outline' : 'Show Outline'}</span>
          </button>
          <button className="btn btn-primary" onClick={() => onEdit(doc)}>
            <Edit3 size={16} />
            <span>Edit README</span>
          </button>
        </div>
      </div>

      <div className={`viewer-layout ${!showToc ? 'viewer-full' : ''}`}>
        {/* TOC Outline Sidebar */}
        {showToc && (
          <TocSidebar
            content={doc.content}
            activeHeadingId={activeHeadingId}
            onHeadingClick={handleHeadingClick}
          />
        )}

        {/* Main Document Paper */}
        <div className="reader-paper" style={{ position: 'relative' }}>
          {/* Reading Progress Indicator */}
          <div
            style={{
              height: '3px',
              width: `${readingProgress}%`,
              backgroundColor: 'var(--accent-primary)',
              transition: 'width 0.1s linear'
            }}
          />

          {/* Reader Toolbar */}
          <div className="reader-toolbar">
            <div className="reader-title-area">
              <FileCode size={20} style={{ color: 'var(--accent-primary)' }} />
              <div>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: '700' }}>
                  {doc.title}
                </h2>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {doc.filename} • {words} words • {readTime} min read
                </span>
              </div>
            </div>

            <div className="reader-actions">
              {/* Text Zoom Controls */}
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)' }}>
                <button
                  className="btn btn-subtle btn-sm"
                  onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                  title="Decrease Text Size"
                >
                  <ZoomOut size={14} />
                </button>
                <span style={{ fontSize: '0.8rem', fontWeight: '600', padding: '0 0.4rem' }}>
                  {fontSize}px
                </span>
                <button
                  className="btn btn-subtle btn-sm"
                  onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                  title="Increase Text Size"
                >
                  <ZoomIn size={14} />
                </button>
              </div>

              <button className="btn btn-secondary btn-sm" onClick={handleCopyRaw}>
                {copied ? <Check size={14} style={{ color: 'var(--emerald-primary)' }} /> : <Copy size={14} />}
                <span>{copied ? 'Copied!' : 'Copy Raw'}</span>
              </button>

              <button className="btn btn-secondary btn-sm" onClick={handleExport} title="Download .md file">
                <Download size={14} />
                <span>Export .md</span>
              </button>

              <button className="btn btn-secondary btn-sm" onClick={() => window.print()} title="Print document to PDF">
                <Printer size={14} />
              </button>
            </div>
          </div>

          {/* Rendered HTML Document */}
          <div
            ref={paperRef}
            className="reader-content markdown-body"
            style={{
              '--user-font-size': `${fontSize}px`,
              maxHeight: 'calc(100vh - 200px)',
              overflowY: 'auto'
            }}
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
            onClick={(e) => {
              if (e.target.tagName === 'IMG') {
                onImageClick(e.target.src);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

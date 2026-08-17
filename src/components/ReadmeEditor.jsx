import React, { useState } from 'react';
import { 
  Save, 
  X, 
  Bold, 
  Italic, 
  Heading, 
  List, 
  Code, 
  AlertCircle,
  Eye,
  Edit3,
  Sparkles,
  Shield
} from 'lucide-react';
import { renderMarkdown } from '../utils/markdownParser';
import { saveDocVersion } from '../utils/versionHistory';
import confetti from 'canvas-confetti';

export default function ReadmeEditor({ doc, onSave, onCancel, activeSession }) {
  const [title, setTitle] = useState(doc?.title || 'New README Document');
  const [category, setCategory] = useState(doc?.category || 'Documentation');
  const [tagsInput, setTagsInput] = useState((doc?.tags || ['Markdown']).join(', '));
  const [content, setContent] = useState(doc?.content || '# New README\n\nStart typing markdown here...');

  const handleSave = () => {
    const tagsArr = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const docId = doc?.id || `readme-${Date.now()}`;

    const updatedDoc = {
      id: docId,
      orgId: doc?.orgId || activeSession?.org?.id,
      title: title.trim() || 'Untitled Document',
      filename: doc?.filename || `${title.toLowerCase().replace(/\s+/g, '_')}.md`,
      category: category.trim() || 'General',
      tags: tagsArr.length > 0 ? tagsArr : ['Markdown'],
      favorite: doc?.favorite || false,
      userId: doc?.userId || activeSession?.user?.id,
      createdAt: doc?.createdAt || new Date().toISOString(),
      content
    };

    // Auto-save snapshot into version history
    saveDocVersion(docId, updatedDoc.title, content, activeSession?.user?.name || "System User");

    confetti({ particleCount: 50, spread: 70, origin: { y: 0.7 } });
    onSave(updatedDoc);
  };

  const insertSnippet = (prefix, suffix = '') => {
    const textarea = document.getElementById('readme-textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const replacement = `${prefix}${selectedText || 'text'}${suffix}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length + (selectedText ? 0 : 4));
    }, 50);
  };

  const insertBadges = () => {
    const badges = `![License](https://img.shields.io/badge/license-MIT-blue.svg)\n![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)\n![Version](https://img.shields.io/badge/version-1.0.0-emerald.svg)\n\n`;
    setContent(badges + content);
  };

  const insertLicenseSection = () => {
    const license = `\n\n## 📜 License\n\nDistributed under the **MIT License**. See \`LICENSE\` file for more details.`;
    setContent(content + license);
  };

  return (
    <div className="editor-container">
      {/* Top Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1, marginRight: '1rem' }}>
          <input
            type="text"
            className="search-input"
            style={{ fontSize: '1.1rem', fontWeight: '700', fontFamily: 'var(--font-heading)', width: '340px' }}
            placeholder="Document Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            className="search-input"
            style={{ width: '220px' }}
            placeholder="Tags (comma separated)..."
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-secondary" onClick={onCancel}>
            <X size={16} />
            <span>Cancel</span>
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={16} />
            <span>Save README</span>
          </button>
        </div>
      </div>

      {/* Editor Main Dual Pane */}
      <div className="editor-layout">
        {/* Markdown Source Pane */}
        <div className="editor-pane">
          <div className="reader-toolbar" style={{ padding: '0.6rem 1rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
              <Edit3 size={14} style={{ display: 'inline', marginRight: '0.3rem' }} /> Markdown Source
            </span>

            {/* Snippet Helper Buttons */}
            <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
              <button className="btn btn-subtle btn-sm" onClick={insertBadges} title="Insert Shields Badges">
                <Sparkles size={13} style={{ color: 'var(--accent-primary)' }} /> Badges
              </button>
              <button className="btn btn-subtle btn-sm" onClick={insertLicenseSection} title="Add MIT License Section">
                <Shield size={13} /> License
              </button>
              <span style={{ color: 'var(--border-light)', margin: '0 0.2rem' }}>|</span>
              <button className="btn btn-subtle btn-sm" onClick={() => insertSnippet('**', '**')} title="Bold">
                <Bold size={13} />
              </button>
              <button className="btn btn-subtle btn-sm" onClick={() => insertSnippet('*', '*')} title="Italic">
                <Italic size={13} />
              </button>
              <button className="btn btn-subtle btn-sm" onClick={() => insertSnippet('## ')} title="Heading 2">
                <Heading size={13} />
              </button>
              <button className="btn btn-subtle btn-sm" onClick={() => insertSnippet('- ')} title="Bullet List">
                <List size={13} />
              </button>
              <button className="btn btn-subtle btn-sm" onClick={() => insertSnippet('```typescript\n', '\n```')} title="Code Block">
                <Code size={13} />
              </button>
              <button className="btn btn-subtle btn-sm" onClick={() => insertSnippet('\n> [!NOTE]\n> ')} title="GitHub Alert Callout">
                <AlertCircle size={13} />
              </button>
            </div>
          </div>

          <textarea
            id="readme-textarea"
            className="editor-textarea"
            placeholder="Type your markdown content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* Live Preview Pane */}
        <div className="editor-pane">
          <div className="reader-toolbar" style={{ padding: '0.6rem 1rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-secondary)' }}>
              <Eye size={14} style={{ display: 'inline', marginRight: '0.3rem' }} /> Live Rendered Preview
            </span>
          </div>

          <div
            className="preview-pane markdown-body"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
          />
        </div>
      </div>
    </div>
  );
}

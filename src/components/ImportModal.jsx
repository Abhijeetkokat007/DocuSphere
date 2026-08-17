import React, { useState } from 'react';
import { Upload, X, Link, FileText, Sparkles, Check, AlertCircle, RefreshCw, Server } from 'lucide-react';
import { fetchGitHubRepoReadme } from '../utils/githubSync';
import { fetchDirectusDocs } from '../utils/directusSync';
import confetti from 'canvas-confetti';

export default function ImportModal({ isOpen, onClose, onImportDocs, currentUser }) {
  const [activeTab, setActiveTab] = useState('directus'); // 'directus', 'github', 'upload', 'url', 'paste'
  
  const [directusUrl, setDirectusUrl] = useState('http://localhost:8055');
  const [directusCollection, setDirectusCollection] = useState('documentation');
  
  const [githubInput, setGithubInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [pastedTitle, setPastedTitle] = useState('');
  const [pastedContent, setPastedContent] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleDirectusFetch = async () => {
    if (!directusUrl.trim()) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const docs = await fetchDirectusDocs(directusUrl.trim(), directusCollection.trim());
      const scoped = docs.map(d => ({ ...d, userId: currentUser.id }));

      confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
      onImportDocs(scoped);
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubFetch = async () => {
    if (!githubInput.trim()) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const doc = await fetchGitHubRepoReadme(githubInput);
      doc.userId = currentUser.id;

      confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
      onImportDocs([doc]);
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (files) => {
    if (!files || files.length === 0) return;

    const imported = [];
    let processedCount = 0;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const cleanTitle = file.name
          .replace(/\.md$/i, '')
          .replace(/\.markdown$/i, '')
          .replace(/_/g, ' ')
          .replace(/-/g, ' ');

        imported.push({
          id: `readme-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          title: cleanTitle.toUpperCase() === 'README' ? `README (${file.name})` : cleanTitle,
          filename: file.name,
          category: 'Uploaded Docs',
          tags: ['Uploaded', 'Markdown'],
          favorite: false,
          userId: currentUser.id,
          createdAt: new Date().toISOString(),
          content: text
        });

        processedCount++;
        if (processedCount === files.length) {
          confetti({ particleCount: 60, spread: 80, origin: { y: 0.6 } });
          onImportDocs(imported);
          onClose();
        }
      };
      reader.readAsText(file);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFileUpload(e.dataTransfer.files);
  };

  const handleUrlFetch = async () => {
    if (!urlInput.trim()) return;
    setLoading(true);
    setErrorMsg('');

    try {
      let targetUrl = urlInput.trim();
      if (targetUrl.includes('github.com') && !targetUrl.includes('raw.githubusercontent.com')) {
        targetUrl = targetUrl
          .replace('github.com', 'raw.githubusercontent.com')
          .replace('/blob/', '/');
      }

      const res = await fetch(targetUrl);
      if (!res.ok) throw new Error(`HTTP Error ${res.status}: Failed to fetch URL`);

      const text = await res.text();
      const urlParts = targetUrl.split('/');
      const fileName = urlParts[urlParts.length - 1] || 'imported_readme.md';

      const importedDoc = {
        id: `readme-${Date.now()}`,
        title: fileName.replace(/\.md$/i, ''),
        filename: fileName,
        category: 'Web Imports',
        tags: ['GitHub', 'Imported'],
        favorite: false,
        userId: currentUser.id,
        createdAt: new Date().toISOString(),
        content: text
      };

      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      onImportDocs([importedDoc]);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to import from URL. Make sure CORS is enabled.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasteSubmit = () => {
    if (!pastedContent.trim()) return;

    const importedDoc = {
      id: `readme-${Date.now()}`,
      title: pastedTitle.trim() || 'Pasted README Document',
      filename: `${(pastedTitle || 'pasted').toLowerCase().replace(/\s+/g, '_')}.md`,
      category: 'Pasted Docs',
      tags: ['Custom', 'Markdown'],
      favorite: false,
      userId: currentUser.id,
      createdAt: new Date().toISOString(),
      content: pastedContent
    };

    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    onImportDocs([importedDoc]);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: '800' }}>
            Import & Sync READMEs
          </h2>
          <button className="fav-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Tab switchers */}
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <button
            className={`btn btn-sm ${activeTab === 'directus' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('directus')}
          >
            <Server size={14} /> Directus CMS
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'github' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('github')}
          >
            <RefreshCw size={14} /> GitHub Sync
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'upload' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('upload')}
          >
            <Upload size={14} /> Upload Files
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'url' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('url')}
          >
            <Link size={14} /> Raw URL
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'paste' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('paste')}
          >
            <FileText size={14} /> Paste Text
          </button>
        </div>

        {errorMsg && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <AlertCircle size={16} /> {errorMsg}
          </div>
        )}

        {/* Tab 1: Directus CMS Sync */}
        {activeTab === 'directus' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Connect to your <strong>Directus Headless CMS</strong> backend server (e.g. <code>http://localhost:8055</code>):
            </p>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', marginBottom: '0.3rem', display: 'block' }}>Directus API Server URL</label>
              <input
                type="text"
                className="search-input"
                style={{ width: '100%' }}
                placeholder="http://localhost:8055"
                value={directusUrl}
                onChange={(e) => setDirectusUrl(e.target.value)}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', marginBottom: '0.3rem', display: 'block' }}>Collection Name</label>
              <input
                type="text"
                className="search-input"
                style={{ width: '100%' }}
                placeholder="documentation"
                value={directusCollection}
                onChange={(e) => setDirectusCollection(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" onClick={handleDirectusFetch} disabled={loading}>
              {loading ? 'Connecting to Directus...' : 'Sync Directus CMS Documents'}
            </button>
          </div>
        )}

        {/* Tab 2: GitHub Repo Sync */}
        {activeTab === 'github' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Enter any public GitHub repository (e.g. <code>facebook/react</code>, <code>vercel/next.js</code>):
            </p>
            <input
              type="text"
              className="search-input"
              style={{ width: '100%' }}
              placeholder="username/repository"
              value={githubInput}
              onChange={(e) => setGithubInput(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleGitHubFetch} disabled={loading}>
              {loading ? 'Fetching README...' : 'Sync GitHub Repository README'}
            </button>
          </div>
        )}

        {/* Tab 3: Drag & Drop Zone */}
        {activeTab === 'upload' && (
          <div>
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              style={{
                border: '2px dashed var(--accent-primary)',
                backgroundColor: 'var(--accent-light)',
                borderRadius: 'var(--radius-md)',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                cursor: 'pointer'
              }}
              onClick={() => document.getElementById('file-picker').click()}
            >
              <Upload size={40} style={{ color: 'var(--accent-primary)', marginBottom: '0.75rem' }} />
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', marginBottom: '0.4rem' }}>
                Drag & Drop multiple .md files here
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                or click to browse your computer files
              </p>
              <button className="btn btn-secondary btn-sm" type="button">
                Browse Files
              </button>
              <input
                id="file-picker"
                type="file"
                multiple
                accept=".md,.markdown,text/plain"
                style={{ display: 'none' }}
                onChange={(e) => handleFileUpload(e.target.files)}
              />
            </div>
          </div>
        )}

        {/* Tab 4: Raw URL */}
        {activeTab === 'url' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Enter raw Markdown URL:
            </p>
            <input
              type="text"
              className="search-input"
              style={{ width: '100%' }}
              placeholder="https://raw.githubusercontent.com/user/repo/main/README.md"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleUrlFetch} disabled={loading}>
              {loading ? 'Fetching...' : 'Fetch & Import README'}
            </button>
          </div>
        )}

        {/* Tab 5: Paste Text */}
        {activeTab === 'paste' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              type="text"
              className="search-input"
              style={{ width: '100%' }}
              placeholder="Document Title (e.g. API Docs)"
              value={pastedTitle}
              onChange={(e) => setPastedTitle(e.target.value)}
            />
            <textarea
              className="editor-textarea"
              style={{ height: '180px', borderRadius: 'var(--radius-sm)' }}
              placeholder="Paste raw markdown content here..."
              value={pastedContent}
              onChange={(e) => setPastedContent(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handlePasteSubmit}>
              Import Pasted README
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

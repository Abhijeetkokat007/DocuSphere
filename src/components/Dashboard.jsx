import React, { useState } from 'react';
import { 
  FileText, 
  Star, 
  Clock, 
  Tag, 
  Grid, 
  List, 
  Upload, 
  BookOpen,
  Trash2,
  Edit3,
  Eye,
  Sparkles,
  BarChart2,
  Share2,
  Globe,
  Settings,
  Users,
  Building
} from 'lucide-react';
import StatsCard from './StatsCard';
import { calculateWordCount, calculateReadingTime } from '../utils/storage';

export default function Dashboard({
  readmes,
  onSelectReadme,
  onEditReadme,
  onToggleFavorite,
  onDeleteReadme,
  onOpenImport,
  onNewDoc,
  searchQuery,
  setSearchQuery,
  activeSession,
  onOpenAuth,
  onOpenSettings,
  onOpenTeam,
  onOpenTemplates,
  onOpenAnalytics,
  onOpenEmbed
}) {
  const [selectedTag, setSelectedTag] = useState('All');
  const [viewMode, setViewMode] = useState('grid');

  // Filter readmes strictly belonging to active organization
  const orgReadmes = readmes.filter(r => !r.orgId || r.orgId === activeSession?.org?.id);

  // Gather all unique tags
  const allTags = ['All', 'Starred', ...new Set(orgReadmes.flatMap(r => r.tags || []))];

  // Filter readmes based on search and selected tag
  const filteredReadmes = orgReadmes.filter(r => {
    const matchesSearch = searchQuery === '' || 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedTag === 'All') return true;
    if (selectedTag === 'Starred') return r.favorite;
    return r.tags?.includes(selectedTag);
  });

  // Calculate statistics
  const totalDocs = orgReadmes.length;
  const totalWords = orgReadmes.reduce((acc, r) => acc + calculateWordCount(r.content), 0);
  const totalReadingTime = calculateReadingTime(totalWords);
  const starredDocs = orgReadmes.filter(r => r.favorite).length;

  return (
    <div className="dashboard-container">
      {/* Welcome Banner */}
      <div className="dashboard-header">
        <div className="welcome-card">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.6rem' }}>{activeSession?.org?.logo}</span>
              <span style={{ fontSize: '1.3rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
                {activeSession?.org?.name}
              </span>
              <span style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--accent-primary)', background: 'var(--accent-light)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)' }}>
                {activeSession?.org?.industry || 'Enterprise'}
              </span>
            </div>
            <h1 className="welcome-title" style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>
              Welcome back, {activeSession?.user?.name}!
            </h1>
            <p className="welcome-subtitle">
              Strictly isolated workspace for <strong>{activeSession?.org?.name}</strong>. Only authorized members of this organization can access these README documents.
            </p>
          </div>

          <div className="welcome-actions">
            <button className="btn btn-secondary" onClick={onOpenTeam}>
              <Users size={16} />
              <span>Team ({activeSession?.org?.membersCount || 1})</span>
            </button>
            <button className="btn btn-secondary" onClick={onOpenSettings}>
              <Settings size={16} />
              <span>Org Settings</span>
            </button>
            <button className="btn btn-primary" onClick={onOpenImport}>
              <Upload size={16} />
              <span>Import / Sync</span>
            </button>
          </div>
        </div>
      </div>

      {/* Analytics Stats Grid */}
      <div className="stats-grid">
        <StatsCard
          icon={FileText}
          value={totalDocs}
          label={`${activeSession?.org?.name} Docs`}
          colorClass="stat-blue"
        />
        <StatsCard
          icon={Sparkles}
          value={totalWords.toLocaleString()}
          label="Total Word Count"
          colorClass="stat-sky"
        />
        <StatsCard
          icon={Clock}
          value={`${totalReadingTime} mins`}
          label="Est. Reading Time"
          colorClass="stat-emerald"
        />
        <StatsCard
          icon={Star}
          value={starredDocs}
          label="Starred Docs"
          colorClass="stat-amber"
        />
      </div>

      {/* Filters and Controls */}
      <div className="controls-bar">
        <div className="tags-filter">
          <Tag size={16} style={{ color: 'var(--text-muted)' }} />
          {allTags.map(tag => (
            <button
              key={tag}
              className={`tag-badge ${selectedTag === tag ? 'active' : ''}`}
              onClick={() => setSelectedTag(tag)}
            >
              {tag === 'Starred' ? '⭐ Starred' : tag}
            </button>
          ))}
        </div>

        <div className="view-controls">
          <button
            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="Grid View"
          >
            <Grid size={18} />
          </button>
          <button
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
            title="List View"
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Document Items List / Grid */}
      {filteredReadmes.length === 0 ? (
        <div className="welcome-card" style={{ justifyContent: 'center', textAlign: 'center' }}>
          <div>
            <BookOpen size={48} style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }} />
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
              No README files found in {activeSession?.org?.name}
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Import your first `.md` file or sync live from GitHub for {activeSession?.org?.name}.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <button className="btn btn-primary" onClick={onOpenImport}>
                <Upload size={16} />
                <span>Import Markdown Files</span>
              </button>
              <button className="btn btn-secondary" onClick={onOpenTemplates}>
                <Sparkles size={16} />
                <span>Browse Templates</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'docs-grid' : 'docs-list'}>
          {filteredReadmes.map(doc => {
            const words = calculateWordCount(doc.content);
            const readTime = calculateReadingTime(words);

            return (
              <div key={doc.id} className="doc-card" onClick={() => onSelectReadme(doc)}>
                <div className="doc-header">
                  <div>
                    <h3 className="doc-title">{doc.title}</h3>
                    {doc.githubRepo && (
                      <span style={{ fontSize: '0.73rem', color: 'var(--accent-primary)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.2rem' }}>
                        <Globe size={12} /> Syncing with GitHub: {doc.githubRepo}
                      </span>
                    )}
                  </div>
                  <button
                    className={`fav-btn ${doc.favorite ? 'starred' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(doc.id);
                    }}
                    title="Toggle Favorite"
                  >
                    <Star size={18} fill={doc.favorite ? 'currentColor' : 'none'} />
                  </button>
                </div>

                <div className="doc-meta">
                  <span>
                    <FileText size={14} /> {words.toLocaleString()} words
                  </span>
                  <span>
                    <Clock size={14} /> {readTime} min read
                  </span>
                </div>

                <p className="doc-preview-text">
                  {doc.content.replace(/[#*`>-]/g, '').slice(0, 140)}...
                </p>

                <div className="doc-footer" onClick={(e) => e.stopPropagation()}>
                  <div className="doc-tags">
                    {(doc.tags || []).map(t => (
                      <span key={t} className="doc-tag">{t}</span>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button
                      className="btn btn-subtle btn-sm"
                      onClick={() => onSelectReadme(doc)}
                      title="Read Document"
                    >
                      <Eye size={14} />
                      <span>Read</span>
                    </button>

                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => onOpenAnalytics(doc)}
                      title="View Traffic & Stats"
                    >
                      <BarChart2 size={14} />
                    </button>

                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => onOpenEmbed(doc)}
                      title="Public Share & Embed Code"
                    >
                      <Share2 size={14} />
                    </button>

                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => onEditReadme(doc)}
                      title="Edit Document"
                    >
                      <Edit3 size={14} />
                    </button>

                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => onDeleteReadme(doc.id)}
                      title="Delete Document"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

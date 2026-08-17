import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ReadmeViewer from './components/ReadmeViewer';
import ReadmeEditor from './components/ReadmeEditor';
import ImportModal from './components/ImportModal';
import ImageModal from './components/ImageModal';
import AuthModal from './components/AuthModal';
import SettingsModal from './components/SettingsModal';
import TeamModal from './components/TeamModal';
import VersionModal from './components/VersionModal';
import TemplateGallery from './components/TemplateGallery';
import AnalyticsModal from './components/AnalyticsModal';
import EmbedModal from './components/EmbedModal';
import Footer from './components/Footer';

import { 
  getAuthSessionAsync, 
  setAuthSessionAsync, 
  getOrgDocsAsync, 
  saveOrgDocAsync, 
  deleteOrgDocAsync,
  checkBackendHealth,
  DEMO_ORGS,
  DEMO_USERS
} from './utils/authContext';

export default function App() {
  const [activeSession, setActiveSession] = useState({
    user: DEMO_USERS[0],
    org: DEMO_ORGS["org_celesta"]
  });
  const [readmes, setReadmes] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [backendConnected, setBackendConnected] = useState(false);

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTeamOpen, setIsTeamOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [analyticsDoc, setAnalyticsDoc] = useState(null);
  const [embedDoc, setEmbedDoc] = useState(null);
  const [versionDoc, setVersionDoc] = useState(null);
  const [zoomImage, setZoomImage] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');

  // Check backend connection on port 8055 & fetch session on mount
  useEffect(() => {
    async function init() {
      const isOnline = await checkBackendHealth();
      setBackendConnected(isOnline);
      if (isOnline) {
        const session = await getAuthSessionAsync();
        if (session) setActiveSession(session);
      }
    }
    init();
  }, []);

  // Fetch documents from backend API port 8055 whenever active org changes
  useEffect(() => {
    async function fetchDocs() {
      if (activeSession?.org?.id) {
        const docs = await getOrgDocsAsync(activeSession.org.id);
        setReadmes(docs);
      }
    }
    fetchDocs();
  }, [activeSession?.org?.id]);

  const handleLoginSuccess = async (user, org) => {
    const session = await setAuthSessionAsync(user, org);
    setActiveSession(session || { user, org });
    setActiveTab('dashboard');
  };

  const handleUpdateSession = async (user, org) => {
    const session = await setAuthSessionAsync(user, org);
    setActiveSession(session || { user, org });
  };

  const handleSelectReadme = (doc) => {
    setSelectedDoc(doc);
    setActiveTab('viewer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditReadme = (doc) => {
    setSelectedDoc(doc);
    setActiveTab('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewDoc = () => {
    setSelectedDoc({
      title: 'New README Document',
      filename: 'README.md',
      category: 'Documentation',
      tags: ['Guide', 'Markdown'],
      favorite: false,
      orgId: activeSession.org.id,
      userId: activeSession.user.id,
      content: '# 📖 Project Title\n\nWrite a short summary of your project...\n\n## 🚀 Getting Started\n\n```bash\nnpm install\nnpm run dev\n```\n\n## ✨ Features\n\n- Feature 1\n- Feature 2\n'
    });
    setActiveTab('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTemplate = async (templateDoc) => {
    templateDoc.orgId = activeSession.org.id;
    templateDoc.userId = activeSession.user.id;
    templateDoc.id = `readme-${Date.now()}`;
    
    await saveOrgDocAsync(activeSession.org.id, templateDoc);
    const updated = [templateDoc, ...readmes];
    setReadmes(updated);
    setSelectedDoc(templateDoc);
    setActiveTab('viewer');
  };

  const handleSaveReadme = async (savedDoc) => {
    savedDoc.orgId = savedDoc.orgId || activeSession.org.id;
    savedDoc.userId = savedDoc.userId || activeSession.user.id;

    await saveOrgDocAsync(activeSession.org.id, savedDoc);

    const exists = readmes.some(r => r.id === savedDoc.id);
    let updated;
    if (exists) {
      updated = readmes.map(r => r.id === savedDoc.id ? savedDoc : r);
    } else {
      updated = [savedDoc, ...readmes];
    }
    setReadmes(updated);
    setSelectedDoc(savedDoc);
    setActiveTab('viewer');
  };

  const handleDeleteReadme = async (id) => {
    if (window.confirm('Are you sure you want to delete this README file permanently from the database?')) {
      await deleteOrgDocAsync(activeSession.org.id, id);
      const updated = readmes.filter(r => r.id !== id);
      setReadmes(updated);
      if (selectedDoc?.id === id) {
        setSelectedDoc(null);
        setActiveTab('dashboard');
      }
    }
  };

  const handleToggleFavorite = async (id) => {
    const target = readmes.find(r => r.id === id);
    if (target) {
      const updatedDoc = { ...target, favorite: !target.favorite };
      await saveOrgDocAsync(activeSession.org.id, updatedDoc);
      const updated = readmes.map(r => r.id === id ? updatedDoc : r);
      setReadmes(updated);
      if (selectedDoc?.id === id) {
        setSelectedDoc(updatedDoc);
      }
    }
  };

  const handleImportDocs = async (importedDocs) => {
    const scoped = importedDocs.map(d => ({
      ...d,
      orgId: activeSession.org.id,
      userId: activeSession.user.id
    }));

    for (const doc of scoped) {
      await saveOrgDocAsync(activeSession.org.id, doc);
    }

    const updated = [...scoped, ...readmes];
    setReadmes(updated);

    if (scoped.length === 1) {
      setSelectedDoc(scoped[0]);
      setActiveTab('viewer');
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleRestoreVersion = async (restoredContent) => {
    if (!selectedDoc) return;
    const updatedDoc = { ...selectedDoc, content: restoredContent };
    await handleSaveReadme(updatedDoc);
  };

  return (
    <div className="app-container">
      {/* Backend API Connection Status Bar */}
      <div style={{ background: backendConnected ? '#ecfdf5' : '#fffbeb', borderBottom: '1px solid #e2e8f0', padding: '0.25rem 1rem', fontSize: '0.76rem', fontWeight: '600', color: backendConnected ? '#065f46' : '#92400e', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
        <span>{backendConnected ? '🟢 Backend API Connected (Port 8055 - Celesta Directus Architecture)' : '🟡 Local Storage Fallback Mode'}</span>
        <span>• Database: <code>server/database.json</code></span>
      </div>

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenImport={() => setIsImportOpen(true)}
        onNewDoc={handleNewDoc}
        activeSession={activeSession}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenTeam={() => setIsTeamOpen(true)}
      />

      {/* Main View Area */}
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <Dashboard
            readmes={readmes}
            onSelectReadme={handleSelectReadme}
            onEditReadme={handleEditReadme}
            onToggleFavorite={handleToggleFavorite}
            onDeleteReadme={handleDeleteReadme}
            onOpenImport={() => setIsImportOpen(true)}
            onNewDoc={handleNewDoc}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeSession={activeSession}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenTeam={() => setIsTeamOpen(true)}
            onOpenTemplates={() => setActiveTab('templates')}
            onOpenAnalytics={(doc) => setAnalyticsDoc(doc)}
            onOpenEmbed={(doc) => setEmbedDoc(doc)}
          />
        )}

        {activeTab === 'templates' && (
          <TemplateGallery
            onSelectTemplate={handleSelectTemplate}
            onBack={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'viewer' && selectedDoc && (
          <ReadmeViewer
            doc={selectedDoc}
            onBack={() => setActiveTab('dashboard')}
            onEdit={handleEditReadme}
            onImageClick={(src) => setZoomImage(src)}
            onOpenAnalytics={(doc) => setAnalyticsDoc(doc)}
            onOpenEmbed={(doc) => setEmbedDoc(doc)}
            onOpenVersions={(doc) => setVersionDoc(doc)}
          />
        )}

        {activeTab === 'editor' && (
          <ReadmeEditor
            doc={selectedDoc}
            onSave={handleSaveReadme}
            onCancel={() => setActiveTab(selectedDoc?.id ? 'viewer' : 'dashboard')}
            activeSession={activeSession}
          />
        )}
      </main>

      {/* Footer */}
      <Footer activeSession={activeSession} />

      {/* Authentication / Login Switcher Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        activeSession={activeSession}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* User Profile & Org Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        activeSession={activeSession}
        onUpdateSession={handleUpdateSession}
      />

      {/* Team Members & Roles Modal */}
      <TeamModal
        isOpen={isTeamOpen}
        onClose={() => setIsTeamOpen(false)}
        activeSession={activeSession}
      />

      {/* Revision History Modal */}
      <VersionModal
        isOpen={!!versionDoc}
        onClose={() => setVersionDoc(null)}
        doc={versionDoc}
        onRestoreVersion={handleRestoreVersion}
      />

      {/* Import & GitHub Sync Modal */}
      <ImportModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImportDocs={handleImportDocs}
        currentUser={activeSession.user}
      />

      {/* Traffic Analytics Modal */}
      <AnalyticsModal
        isOpen={!!analyticsDoc}
        onClose={() => setAnalyticsDoc(null)}
        doc={analyticsDoc}
      />

      {/* Public Share & Embed Generator Modal */}
      <EmbedModal
        isOpen={!!embedDoc}
        onClose={() => setEmbedDoc(null)}
        doc={embedDoc}
      />

      {/* Image Lightbox Zoom Modal */}
      <ImageModal
        imgSrc={zoomImage}
        onClose={() => setZoomImage(null)}
      />
    </div>
  );
}

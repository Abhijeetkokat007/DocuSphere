import React, { useState, useRef, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Upload, 
  Search, 
  LayoutDashboard, 
  Sparkles, 
  ChevronDown,
  Settings,
  Users,
  Building,
  UserCheck,
  Command,
  LogOut,
  FolderSync
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onOpenImport,
  onNewDoc,
  activeSession,
  onOpenAuth,
  onOpenSettings,
  onOpenTeam
}) {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="navbar">
      <div className="nav-content">
        {/* Left Section: Logo & Organization Switcher */}
        <div className="nav-left">
          <div className="logo-brand" onClick={() => setActiveTab('dashboard')}>
            <div className="logo-icon">
              <BookOpen size={20} />
            </div>
            <span className="logo-text">Docu<span>Sphere</span></span>
          </div>

          <div className="nav-divider" />

          {/* Active Organization Switcher Pill */}
          <div
            className="org-pill"
            onClick={onOpenAuth}
            title="Switch Team / Organization"
          >
            <span className="org-pill-emoji">{activeSession?.org?.logo || '🏢'}</span>
            <span className="org-pill-name">{activeSession?.org?.name}</span>
            <ChevronDown size={14} className="org-pill-arrow" />
          </div>
        </div>

        {/* Center Section: Navigation Tabs & Search */}
        <div className="nav-center">
          {/* Navigation Tabs */}
          <nav className="nav-tabs">
            <button
              className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <LayoutDashboard size={15} />
              <span>Dashboard</span>
            </button>

            <button
              className={`nav-tab ${activeTab === 'templates' ? 'active' : ''}`}
              onClick={() => setActiveTab('templates')}
            >
              <Sparkles size={15} className="template-icon" />
              <span>Templates</span>
            </button>
          </nav>

          {/* Search Box */}
          <div className="search-box">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search READMEs, tags..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'dashboard') {
                  setActiveTab('dashboard');
                }
              }}
            />
            <span className="search-shortcut">⌘K</span>
          </div>
        </div>

        {/* Right Section: Actions & User Profile */}
        <div className="nav-right">
          <button className="btn btn-secondary btn-nav-action" onClick={onOpenImport}>
            <Upload size={15} />
            <span>Import</span>
          </button>

          <button className="btn btn-primary btn-nav-action" onClick={onNewDoc}>
            <Plus size={15} />
            <span>New README</span>
          </button>

          <div className="nav-divider" />

          {/* Unified User Profile & Quick Actions Menu */}
          <div className="profile-menu-container" ref={menuRef}>
            <div
              className="profile-pill"
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              title="User Account & Quick Actions"
            >
              <span className="profile-avatar">{activeSession?.user?.avatar || '👤'}</span>
              <div className="profile-info">
                <span className="profile-name">{activeSession?.user?.name}</span>
                <span className="profile-role">{activeSession?.user?.role || 'Admin'}</span>
              </div>
              <ChevronDown size={14} className={`profile-arrow ${profileMenuOpen ? 'open' : ''}`} />
            </div>

            {/* Dropdown Menu */}
            {profileMenuOpen && (
              <div className="profile-dropdown-menu">
                <div className="dropdown-header">
                  <span className="dropdown-user-avatar">{activeSession?.user?.avatar || '👤'}</span>
                  <div>
                    <div className="dropdown-user-name">{activeSession?.user?.name}</div>
                    <div className="dropdown-user-email">{activeSession?.user?.email}</div>
                  </div>
                </div>

                <div className="dropdown-divider" />

                <button
                  className="dropdown-item"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    onOpenAuth();
                  }}
                >
                  <Building size={16} />
                  <span>Switch Team / Workspace</span>
                </button>

                <button
                  className="dropdown-item"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    onOpenTeam();
                  }}
                >
                  <Users size={16} />
                  <span>Team Members & Access</span>
                </button>

                <button
                  className="dropdown-item"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    onOpenSettings();
                  }}
                >
                  <Settings size={16} />
                  <span>Profile & Org Settings</span>
                </button>

                <div className="dropdown-divider" />

                <button
                  className="dropdown-item dropdown-logout"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    onOpenAuth();
                  }}
                >
                  <LogOut size={16} />
                  <span>Logout / Switch User</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

import React, { useState } from 'react';
import { X, User, Building, Sliders, Save, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SettingsModal({ isOpen, onClose, activeSession, onUpdateSession }) {
  const [tab, setTab] = useState('profile'); // 'profile', 'org', 'preferences'

  // User Profile state
  const [name, setName] = useState(activeSession?.user?.name || '');
  const [email, setEmail] = useState(activeSession?.user?.email || '');
  const [title, setTitle] = useState(activeSession?.user?.title || '');
  const [avatar, setAvatar] = useState(activeSession?.user?.avatar || '👨‍💻');
  const [bio, setBio] = useState(activeSession?.user?.bio || '');

  // Org Settings state
  const [orgName, setOrgName] = useState(activeSession?.org?.name || '');
  const [industry, setIndustry] = useState(activeSession?.org?.industry || '');
  const [orgLogo, setOrgLogo] = useState(activeSession?.org?.logo || '🏥');

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updatedUser = {
      ...activeSession.user,
      name,
      email,
      title,
      avatar,
      bio
    };
    onUpdateSession(updatedUser, activeSession.org);
    setSavedSuccess(true);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSaveOrg = (e) => {
    e.preventDefault();
    const updatedOrg = {
      ...activeSession.org,
      name: orgName,
      industry,
      logo: orgLogo
    };
    onUpdateSession(activeSession.user, updatedOrg);
    setSavedSuccess(true);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: '800' }}>
              User Profile & Organization Settings
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Manage personal info, organization details, and workspace preferences.
            </p>
          </div>
          <button className="fav-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', background: 'var(--bg-subtle)', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
          <button
            className={`btn btn-sm ${tab === 'profile' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={() => setTab('profile')}
          >
            <User size={14} /> My Profile
          </button>
          <button
            className={`btn btn-sm ${tab === 'org' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={() => setTab('org')}
          >
            <Building size={14} /> Organization Settings
          </button>
        </div>

        {savedSuccess && (
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Check size={16} /> Settings updated successfully!
          </div>
        )}

        {/* Tab 1: Personal Profile */}
        {tab === 'profile' && (
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ fontSize: '2.5rem', background: 'var(--bg-subtle)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-light)' }}>
                {avatar}
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', marginBottom: '0.2rem', display: 'block' }}>Avatar Emoji</label>
                <input
                  type="text"
                  className="search-input"
                  style={{ width: '100px' }}
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.3rem', display: 'block' }}>Full Name</label>
                <input
                  type="text"
                  className="search-input"
                  style={{ width: '100%' }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.3rem', display: 'block' }}>Email Address</label>
                <input
                  type="email"
                  className="search-input"
                  style={{ width: '100%' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.3rem', display: 'block' }}>Job Title / Position</label>
              <input
                type="text"
                className="search-input"
                style={{ width: '100%' }}
                placeholder="e.g. Chief Medical Officer or Senior Lead Architect"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.3rem', display: 'block' }}>Short Bio</label>
              <textarea
                className="editor-textarea"
                style={{ height: '70px', borderRadius: 'var(--radius-sm)' }}
                placeholder="Tell your team about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <button className="btn btn-primary" type="submit" style={{ justifyContent: 'center' }}>
              <Save size={16} /> Save Profile Changes
            </button>
          </form>
        )}

        {/* Tab 2: Organization Settings */}
        {tab === 'org' && (
          <form onSubmit={handleSaveOrg} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div style={{ fontSize: '2.5rem', background: 'var(--bg-subtle)', width: '64px', height: '64px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border-light)' }}>
                {orgLogo}
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', marginBottom: '0.2rem', display: 'block' }}>Organization Badge / Emoji</label>
                <input
                  type="text"
                  className="search-input"
                  style={{ width: '100px' }}
                  value={orgLogo}
                  onChange={(e) => setOrgLogo(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.3rem', display: 'block' }}>Organization Name</label>
              <input
                type="text"
                className="search-input"
                style={{ width: '100%' }}
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.3rem', display: 'block' }}>Industry Category</label>
              <input
                type="text"
                className="search-input"
                style={{ width: '100%' }}
                placeholder="e.g. Healthcare, Software, Hardware"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
            </div>

            <button className="btn btn-primary" type="submit" style={{ justifyContent: 'center' }}>
              <Save size={16} /> Save Organization Settings
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

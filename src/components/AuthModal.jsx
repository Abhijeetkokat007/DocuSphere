import React, { useState } from 'react';
import { X, Lock, Mail, Building, User, Sparkles, Shield, ArrowRight, Check } from 'lucide-react';
import { DEMO_ORGS, DEMO_USERS } from '../utils/authContext';
import confetti from 'canvas-confetti';

export default function AuthModal({ isOpen, onClose, activeSession, onLoginSuccess }) {
  const [tab, setTab] = useState('demo'); // 'demo', 'login', 'register'
  
  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regOrg, setRegOrg] = useState('');
  const [regPassword, setRegPassword] = useState('');

  if (!isOpen) return null;

  const handleDemoSwitch = (userKey) => {
    const user = DEMO_USERS.find(u => u.id === userKey);
    const org = DEMO_ORGS[user.orgId];
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    onLoginSuccess(user, org);
    onClose();
  };

  const handleCustomLogin = (e) => {
    e.preventDefault();
    if (!email) return;

    // Check if demo user
    const existing = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      handleDemoSwitch(existing.id);
    } else {
      // Create instant user session
      const newUser = {
        id: `usr_${Date.now()}`,
        name: email.split('@')[0],
        email,
        role: "Admin",
        title: "Developer",
        avatar: "👤",
        bio: "Member of Workspace",
        orgId: "org_custom"
      };
      const newOrg = {
        id: "org_custom",
        name: `${newUser.name}'s Tech Team`,
        logo: "🚀",
        industry: "Technology",
        membersCount: 1
      };
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      onLoginSuccess(newUser, newOrg);
      onClose();
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!regName || !regEmail || !regOrg) return;

    const newOrgId = `org_${Date.now()}`;
    const newOrg = {
      id: newOrgId,
      name: regOrg.trim(),
      logo: "🏢",
      industry: "Enterprise SaaS",
      membersCount: 1
    };

    const newUser = {
      id: `usr_${Date.now()}`,
      name: regName.trim(),
      email: regEmail.trim(),
      role: "Admin",
      title: "Organization Founder",
      avatar: "👔",
      bio: `Founder & Admin at ${regOrg.trim()}`,
      orgId: newOrgId
    };

    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    onLoginSuccess(newUser, newOrg);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: '800' }}>
              Multi-Tenant Authentication & Login
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Secure team login with isolated organization workspaces.
            </p>
          </div>
          <button className="fav-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', background: 'var(--bg-subtle)', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
          <button
            className={`btn btn-sm ${tab === 'demo' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={() => setTab('demo')}
          >
            <Sparkles size={14} /> 1-Click Demo Teams
          </button>
          <button
            className={`btn btn-sm ${tab === 'login' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={() => setTab('login')}
          >
            <Lock size={14} /> Login
          </button>
          <button
            className={`btn btn-sm ${tab === 'register' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flex: 1, justifyContent: 'center' }}
            onClick={() => setTab('register')}
          >
            <Building size={14} /> Register New Team
          </button>
        </div>

        {/* Tab 1: 1-Click Demo Teams */}
        {tab === 'demo' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
              Click any team below to test 100% strict data isolation:
            </p>

            {/* Celesta Healthcare Demo Switch */}
            <div
              onClick={() => handleDemoSwitch('usr_celesta_admin')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.1rem',
                borderRadius: 'var(--radius-md)',
                border: activeSession?.org?.id === 'org_celesta' ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)',
                background: activeSession?.org?.id === 'org_celesta' ? 'var(--accent-light)' : 'var(--bg-surface)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <span style={{ fontSize: '2rem' }}>🏥</span>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                    Celesta Healthcare Team
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Logged in as <strong>Dr. Vikram Sharma</strong> (vikram@celesta.health)
                  </p>
                </div>
              </div>
              {activeSession?.org?.id === 'org_celesta' ? (
                <span style={{ fontSize: '0.75rem', background: 'var(--accent-primary)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', fontWeight: '700' }}>Active</span>
              ) : (
                <ArrowRight size={18} style={{ color: 'var(--text-muted)' }} />
              )}
            </div>

            {/* AB Technology Demo Switch */}
            <div
              onClick={() => handleDemoSwitch('usr_abtech_admin')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.1rem',
                borderRadius: 'var(--radius-md)',
                border: activeSession?.org?.id === 'org_abtech' ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)',
                background: activeSession?.org?.id === 'org_abtech' ? 'var(--accent-light)' : 'var(--bg-surface)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <span style={{ fontSize: '2rem' }}>💻</span>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                    AB Technology Team
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Logged in as <strong>Arjun Mehta</strong> (arjun@abtechnology.com)
                  </p>
                </div>
              </div>
              {activeSession?.org?.id === 'org_abtech' ? (
                <span style={{ fontSize: '0.75rem', background: 'var(--accent-primary)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', fontWeight: '700' }}>Active</span>
              ) : (
                <ArrowRight size={18} style={{ color: 'var(--text-muted)' }} />
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Custom Login Form */}
        {tab === 'login' && (
          <form onSubmit={handleCustomLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.3rem', display: 'block' }}>Email Address</label>
              <input
                type="email"
                className="search-input"
                style={{ width: '100%' }}
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.3rem', display: 'block' }}>Password</label>
              <input
                type="password"
                className="search-input"
                style={{ width: '100%' }}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button className="btn btn-primary" type="submit" style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
              Login to Workspace
            </button>
          </form>
        )}

        {/* Tab 3: Register New Team Form */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.3rem', display: 'block' }}>Organization / Company Name</label>
              <input
                type="text"
                className="search-input"
                style={{ width: '100%' }}
                placeholder="e.g. Celesta Healthcare or AB Technology"
                value={regOrg}
                onChange={(e) => setRegOrg(e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.3rem', display: 'block' }}>Your Full Name</label>
              <input
                type="text"
                className="search-input"
                style={{ width: '100%' }}
                placeholder="John Doe"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.3rem', display: 'block' }}>Work Email</label>
              <input
                type="email"
                className="search-input"
                style={{ width: '100%' }}
                placeholder="john@organization.com"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                required
              />
            </div>
            <button className="btn btn-primary" type="submit" style={{ justifyContent: 'center', marginTop: '0.5rem' }}>
              Create Organization & Workspace
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

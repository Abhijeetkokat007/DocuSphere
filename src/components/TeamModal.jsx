import React, { useState } from 'react';
import { X, Users, UserPlus, ShieldCheck, Mail, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TeamModal({ isOpen, onClose, activeSession }) {
  const [members, setMembers] = useState([
    {
      id: "m1",
      name: activeSession?.user?.name || "Dr. Vikram Sharma",
      email: activeSession?.user?.email || "vikram@celesta.health",
      role: "Admin",
      title: activeSession?.user?.title || "Chief Technology Officer",
      avatar: activeSession?.user?.avatar || "👨‍⚕️"
    },
    {
      id: "m2",
      name: "Priya Patel",
      email: `priya@${activeSession?.org?.name.toLowerCase().replace(/\s+/g, '')}.com`,
      role: "Editor",
      title: "Senior Documentation Lead",
      avatar: "👩‍💼"
    },
    {
      id: "m3",
      name: "Rahul Verma",
      email: `rahul@${activeSession?.org?.name.toLowerCase().replace(/\s+/g, '')}.com`,
      role: "Viewer",
      title: "Support Engineer",
      avatar: "👨‍💻"
    }
  ]);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Editor');
  const [inviteSuccess, setInviteSuccess] = useState(false);

  if (!isOpen) return null;

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail) return;

    const newMember = {
      id: `m_${Date.now()}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      title: "Invited Team Member",
      avatar: "👤"
    };

    setMembers([...members, newMember]);
    setInviteEmail('');
    setInviteSuccess(true);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => setInviteSuccess(false), 2500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.35rem', fontWeight: '800' }}>
              {activeSession?.org?.logo} {activeSession?.org?.name} Team Members
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Manage member roles (Admin, Editor, Viewer) and invite teammates.
            </p>
          </div>
          <button className="fav-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {inviteSuccess && (
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Check size={16} /> Team member invite sent successfully!
          </div>
        )}

        {/* Invite Form */}
        <form onSubmit={handleInvite} style={{ background: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', marginBottom: '1.5rem' }}>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <UserPlus size={16} /> Invite New Teammate
          </h4>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="email"
              className="search-input"
              style={{ flex: 1 }}
              placeholder="colleague@organization.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              required
            />
            <select
              className="search-input"
              style={{ width: '130px' }}
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
            >
              <option value="Admin">Admin</option>
              <option value="Editor">Editor</option>
              <option value="Viewer">Viewer</option>
            </select>
            <button className="btn btn-primary btn-sm" type="submit">
              Send Invite
            </button>
          </div>
        </form>

        {/* Member List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {members.map((m) => (
            <div
              key={m.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-light)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{m.avatar}</span>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: '700' }}>
                    {m.name}
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {m.email} • {m.title}
                  </p>
                </div>
              </div>

              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-full)',
                  background: m.role === 'Admin' ? 'var(--accent-light)' : 'var(--bg-subtle)',
                  color: m.role === 'Admin' ? 'var(--accent-primary)' : 'var(--text-secondary)'
                }}
              >
                {m.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

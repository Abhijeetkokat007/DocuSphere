import React from 'react';
import { Heart, Sparkles, Shield, Code, Globe } from 'lucide-react';

export default function Footer({ activeSession }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-left">
          <div className="footer-brand">
            <span className="footer-logo-emoji">{activeSession?.org?.logo || '🏢'}</span>
            <span className="footer-brand-name">{activeSession?.org?.name || 'DocuSphere Enterprise'}</span>
          </div>
          <p className="footer-tagline">
            Next-Gen Multi-Tenant Documentation & README Management Platform.
          </p>
        </div>

        <div className="footer-center">
          <div className="footer-credit">
            Developed with <Heart size={14} className="heart-icon" /> by <strong>{activeSession?.user?.name || 'Lead Developer'}</strong> for <strong>{activeSession?.org?.name}</strong>
          </div>
          <div className="footer-subtext">
            All workspace data, users, and documents are permanently saved & isolated.
          </div>
        </div>

        <div className="footer-right">
          <span className="footer-version">v3.2.0 Enterprise</span>
          <span className="footer-bullet">•</span>
          <span className="footer-copy">© {currentYear} Celesta & AB Tech Engine</span>
        </div>
      </div>
    </footer>
  );
}

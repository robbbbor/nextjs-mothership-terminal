'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import TerminalInterface from '../Terminal/TerminalInterface';
import GlitchText from '../GlitchText/GlitchText';

interface SubnetMenuItem {
  label: string;
  href: string;
}

const menuItems: SubnetMenuItem[] = [
  { label: 'GALACTIC WIKI', href: '/subnet/galactic-wiki' },
];

export default function SubnetMenu() {
  const router = useRouter();
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const playSound = () => {
    const audio = new Audio('/click.mp3');
    audio.volume = 0.8;
    audio.play().catch(error => console.error('Audio play failed:', error));
  };

  return (
    <div className="main-menu">
      <div className="header-container">
        <h1 className="menu-title"><GlitchText>Subnet</GlitchText></h1>
        <div className="status-container">
          <div className="status-line">
            <GlitchText>subnet: </GlitchText>
            <span className="status-indicator offline">offline</span>
          </div>
        </div>
      </div>
      <div className="separator">========</div>
      <nav>
        {menuItems.map((item, index) => (
          <a
            key={index}
            href={item.href}
            className="menu-item"
            onMouseEnter={playSound}
            onClick={(e) => {
              playSound();
              e.preventDefault();
              setShowErrorDialog(true);
            }}
          >
            <GlitchText>{item.label}</GlitchText>
          </a>
        ))}
        <a
          href="/main"
          className="menu-item back-button"
          onMouseEnter={playSound}
          onClick={(e) => {
            playSound();
            e.preventDefault();
            setTimeout(() => {
              router.push('/main');
            }, 100);
          }}
        >
          <GlitchText>BACK TO MAIN MENU</GlitchText>
        </a>
      </nav>

      {showErrorDialog && (
        <div className="dialog-overlay" onClick={() => setShowErrorDialog(false)}>
          <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
            <div className="error-message">
              <GlitchText>error: subnet offline</GlitchText>
            </div>
            <button className="dialog-close" onClick={() => setShowErrorDialog(false)}>
              <GlitchText>CLOSE</GlitchText>
            </button>
          </div>
        </div>
      )}

      <TerminalInterface />

      <style jsx>{`
        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        .status-container {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          text-align: right;
        }
        .status-line {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.5rem;
        }
        .status-indicator {
          font-family: "Glass TTY VT220", "VT323", monospace;
          text-transform: lowercase;
        }
        .status-indicator.offline {
          color: #ff4444;
          text-shadow: 0 0 10px rgba(255, 68, 68, 0.8);
        }
        .dialog-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .dialog-content {
          background: var(--background);
          border: 1px solid var(--menu-text);
          padding: 2rem;
          position: relative;
          font-family: "Glass TTY VT220", "VT323", monospace;
          color: var(--menu-text);
          text-shadow: var(--text-glow);
          font-size: 1.8rem;
          min-width: 300px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .error-message {
          margin: 1rem 0;
          color: #ff4444;
          text-shadow: 0 0 10px rgba(255, 68, 68, 0.8);
          text-align: center;
          padding: 0 3rem;
        }
        .dialog-close {
          position: relative;
          background: none;
          border: 1px solid var(--menu-text);
          color: var(--menu-text);
          padding: 0.5rem 1rem;
          cursor: pointer;
          font-family: "Glass TTY VT220", "VT323", monospace;
          text-transform: uppercase;
          transition: all 0.2s ease;
          font-size: 1.8rem;
          text-shadow: var(--text-glow);
          margin-top: 1rem;
        }
        .dialog-close:hover {
          color: var(--background);
          background-color: var(--menu-text);
          text-shadow: none;
        }
      `}</style>
    </div>
  );
} 
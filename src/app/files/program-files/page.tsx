'use client';

import React from 'react';
import Link from 'next/link';
import TerminalInterface from '@/components/Terminal/TerminalInterface';
import GlitchText from '@/components/GlitchText/GlitchText';

export default function ProgramFilesPage() {
  const playSound = () => {
    const audio = new Audio('/click.mp3');
    audio.volume = 0.8;
    audio.play().catch(error => console.error('Audio play failed:', error));
  };

  return (
    <main>
      <div className="main-menu">
        <h1 className="menu-title"><GlitchText>Program Files</GlitchText></h1>
        <div className="separator">========</div>
        
        <div className="program-files-container">
          <div className="no-files-message">
            <GlitchText>NO FILES INSTALLED</GlitchText>
          </div>
        </div>
        
        <Link
          href="/files"
          className="menu-item back-button"
          onMouseEnter={playSound}
          onClick={playSound}
        >
          <GlitchText>BACK TO FILES</GlitchText>
        </Link>

        <TerminalInterface />

        <style jsx>{`
          .program-files-container {
            margin: 2rem 0;
            padding: 1rem;
            border: 1px solid var(--menu-text);
            background: rgba(0, 0, 0, 0.7);
          }
          .no-files-message {
            text-align: center;
            color: var(--menu-text);
            opacity: 0.8;
            font-size: 1.2rem;
            text-shadow: var(--text-glow);
          }
        `}</style>
      </div>
    </main>
  );
} 
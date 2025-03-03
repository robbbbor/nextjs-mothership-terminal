'use client';

import React from 'react';
import Link from 'next/link';
import TerminalInterface from '@/components/Terminal/TerminalInterface';
import GlitchText from '@/components/GlitchText/GlitchText';

export default function ProgramFilesPage() {
  const playSound = () => {
    const audio = new Audio('/sounds/click.mp3');
    audio.volume = 0.8;
    audio.play().catch(error => console.error('Audio play failed:', error));
  };

  return (
    <main>
      <div className="main-menu">
        <h1 className="menu-title"><GlitchText>Program Files</GlitchText></h1>
        <div className="separator">========</div>
        
        <div className="program-files-container">
          {/* Placeholder for future program files content */}
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
      </div>
    </main>
  );
} 
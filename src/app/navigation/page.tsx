'use client';

import React from 'react';
import Link from 'next/link';
import TerminalInterface from '@/components/Terminal/TerminalInterface';
import GlitchText from '@/components/GlitchText/GlitchText';

export default function NavigationPage() {
  const playSound = () => {
    const audio = new Audio('/sounds/click.mp3');
    audio.volume = 0.8;
    audio.play().catch(error => console.error('Audio play failed:', error));
  };

  return (
    <main>
      <div className="main-menu">
        <h1 className="menu-title"><GlitchText>Navigation</GlitchText></h1>
        <div className="separator">========</div>
        
        <div className="navigation-container">
          {/* Placeholder for future navigation content */}
        </div>
        
        <Link
          href="/main"
          className="menu-item back-button"
          onMouseEnter={playSound}
          onClick={playSound}
        >
          <GlitchText>BACK TO MAIN MENU</GlitchText>
        </Link>

        <TerminalInterface />
      </div>
    </main>
  );
} 
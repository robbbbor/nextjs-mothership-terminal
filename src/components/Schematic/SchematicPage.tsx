'use client';

import React from 'react';
import Link from 'next/link';
import TerminalInterface from '../Terminal/TerminalInterface';
import GlitchText from '../GlitchText/GlitchText';

export default function SchematicPage() {
  const playSound = () => {
    const audio = new Audio('/sounds/click.mp3');
    audio.volume = 0.8;
    audio.play().catch(error => console.error('Audio play failed:', error));
  };

  return (
    <div className="main-menu">
      <h1 className="menu-title"><GlitchText>Ship Schematic</GlitchText></h1>
      <div className="separator">========</div>
      
      <div className="schematic-container">
        {/* Placeholder for future schematic content */}
      </div>
      
      <Link
        href="/ship-info"
        className="menu-item back-button"
        onMouseEnter={playSound}
        onClick={playSound}
      >
        <GlitchText>BACK TO SHIP INFO</GlitchText>
      </Link>

      <TerminalInterface />
    </div>
  );
} 
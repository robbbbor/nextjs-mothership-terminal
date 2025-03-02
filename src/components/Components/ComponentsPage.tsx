'use client';

import React from 'react';
import Link from 'next/link';
import TerminalInterface from '../Terminal/TerminalInterface';
import GlitchText from '../GlitchText/GlitchText';

export default function ComponentsPage() {
  const playSound = () => {
    const audio = new Audio('/sounds/click.mp3');
    audio.volume = 0.8;
    audio.play().catch(error => console.error('Audio play failed:', error));
  };

  return (
    <div className="main-menu">
      <h1 className="menu-title"><GlitchText>Ship Components</GlitchText></h1>
      <div className="separator">========</div>
      
      <div className="ship-components-grid">
        <div className="component-section">
          <h2 className="component-title"><GlitchText>Hull Integrity</GlitchText></h2>
          <div className="component-value"><GlitchText>92%</GlitchText></div>
        </div>
        
        <div className="component-section">
          <h2 className="component-title"><GlitchText>Jump Fuel</GlitchText></h2>
          <div className="component-value"><GlitchText>78%</GlitchText></div>
        </div>
        
        <div className="component-section">
          <h2 className="component-title"><GlitchText>System Fuel</GlitchText></h2>
          <div className="component-value"><GlitchText>65%</GlitchText></div>
        </div>
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
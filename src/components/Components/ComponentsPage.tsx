'use client';

import React from 'react';
import Link from 'next/link';
import TerminalInterface from '../Terminal/TerminalInterface';

export default function ComponentsPage() {
  const playSound = () => {
    const audio = new Audio('/sounds/click.mp3');
    audio.volume = 0.8;
    audio.play().catch(error => console.error('Audio play failed:', error));
  };

  return (
    <div className="main-menu">
      <h1 className="menu-title">Ship Components</h1>
      <div className="separator">========</div>
      
      <div className="ship-components-grid">
        <div className="component-section">
          <h2 className="component-title">Hull Integrity</h2>
          <div className="component-value">92%</div>
        </div>
        
        <div className="component-section">
          <h2 className="component-title">Jump Fuel</h2>
          <div className="component-value">78%</div>
        </div>
        
        <div className="component-section">
          <h2 className="component-title">System Fuel</h2>
          <div className="component-value">65%</div>
        </div>
      </div>
      
      <Link
        href="/ship-info"
        className="menu-item back-button"
        onMouseEnter={playSound}
        onClick={(e) => {
          playSound();
        }}
      >
        BACK TO SHIP INFO
      </Link>

      <TerminalInterface />
    </div>
  );
} 
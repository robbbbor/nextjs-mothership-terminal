'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import TerminalInterface from '../Terminal/TerminalInterface';
import GlitchText from '../GlitchText/GlitchText';

interface SchematicLabel {
  id: string;
  text: string;
  position: { top: string; left: string };
}

const labels: SchematicLabel[] = [
  { id: 'cockpit', text: 'COCKPIT', position: { top: '50%', left: '85%' } },
  { id: 'medbay', text: 'MEDBAY/LAB', position: { top: '75%', left: '75%' } },
  { id: 'engine1', text: 'ENGINE 1', position: { top: '25%', left: '15%' } },
  { id: 'engine2', text: 'ENGINE 2', position: { top: '80%', left: '15%' } },
  { id: 'bathroom', text: 'BATHROOM', position: { top: '30%', left: '70%' } },
  { id: 'central', text: 'CENTRAL ROOM', position: { top: '45%', left: '50%' } },
  { id: 'quarters1', text: 'QUARTERS 1', position: { top: '80%', left: '45%' } },
  { id: 'quarters2', text: 'QUARTERS 2', position: { top: '30%', left: '45%' } },
  { id: 'cargo', text: 'CARGO', position: { top: '50%', left: '25%' } },
];

export default function SchematicPage() {
  const playSound = () => {
    const audio = new Audio('/click.mp3');
    audio.volume = 0.8;
    audio.play().catch(error => console.error('Audio play failed:', error));
  };

  return (
    <div className="main-menu">
      <h1 className="menu-title"><GlitchText>Ship Schematic</GlitchText></h1>
      <div className="separator">========</div>
      
      <div className="schematic-container">
        <div className="schematic-wrapper">
          <Image
            src="/schematic.svg"
            alt="Ship Schematic"
            width={1200}
            height={900}
            className="schematic-image"
            priority
          />
          <div className="schematic-labels">
            {labels.map((label) => (
              <div
                key={label.id}
                className="schematic-label"
                style={{
                  top: label.position.top,
                  left: label.position.left,
                }}
              >
                <GlitchText>{label.text}</GlitchText>
              </div>
            ))}
          </div>
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
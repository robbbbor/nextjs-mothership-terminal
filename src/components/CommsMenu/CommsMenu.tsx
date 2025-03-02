'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import TerminalInterface from '../Terminal/TerminalInterface';
import GlitchText from '../GlitchText/GlitchText';

interface CommsMenuItem {
  label: string;
  href: string;
}

const menuItems: CommsMenuItem[] = [
  { label: 'STATUS', href: '/comms/status' },
  { label: 'PERSONAL COMMUNICATIONS', href: '/comms/personal' },
  { label: 'SHIP COMMUNICATIONS', href: '/comms/ship' },
];

export default function CommsMenu() {
  const router = useRouter();

  const playSound = () => {
    const audio = new Audio('/sounds/click.mp3');
    audio.volume = 0.8;
    audio.play().catch(error => console.error('Audio play failed:', error));
  };

  return (
    <div className="main-menu">
      <h1 className="menu-title"><GlitchText>Comms</GlitchText></h1>
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
              setTimeout(() => {
                window.location.href = item.href;
              }, 100);
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

      <TerminalInterface />
    </div>
  );
} 
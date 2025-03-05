'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TerminalInterface from '../Terminal/TerminalInterface';
import GlitchText from '../GlitchText/GlitchText';

interface MainMenuItem {
  label: string;
  href: string;
}

const menuItems: MainMenuItem[] = [
  { label: 'COMMS', href: '/comms' },
  { label: 'FILES', href: '/files' },
  { label: 'ROSTER', href: '/roster' },
  { label: 'SHIP INFO', href: '/ship-info' },
  { label: 'SUBNET', href: '/subnet' },
  { label: 'NAVIGATION', href: '/navigation' },
];

export default function MainMenu() {
  const router = useRouter();

  const playSound = () => {
    const audio = new Audio('/click.mp3');
    audio.volume = 0.8;
    audio.play().catch(error => console.error('Audio play failed:', error));
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    playSound();
    setTimeout(() => {
      router.push('/');
    }, 100);
  };

  return (
    <div className="main-menu">
      <h1 className="menu-title"><GlitchText>Main Menu</GlitchText></h1>
      <div className="separator">========</div>
      <nav>
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="menu-item"
            onMouseEnter={playSound}
            onClick={(e) => {
              playSound();
              e.preventDefault();
              setTimeout(() => {
                router.push(item.href);
              }, 100);
            }}
          >
            <GlitchText>{item.label}</GlitchText>
          </Link>
        ))}
        <div className="separator logout-separator">========</div>
        <Link
          href="/"
          className="menu-item logout-button"
          onMouseEnter={playSound}
          onClick={handleLogout}
        >
          <GlitchText>LOG OUT</GlitchText>
        </Link>
      </nav>

      <TerminalInterface />
    </div>
  );
} 
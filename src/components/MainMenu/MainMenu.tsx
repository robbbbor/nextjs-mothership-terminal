'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TerminalInterface from '../Terminal/TerminalInterface';
import GlitchText from '../GlitchText/GlitchText';
import { useAudio } from '@/hooks/useAudio';

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
  const { playSound } = useAudio();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    playSound('click');
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
            onMouseEnter={() => playSound('click')}
            onClick={(e) => {
              playSound('click');
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
          onMouseEnter={() => playSound('click')}
          onClick={handleLogout}
        >
          <GlitchText>LOG OUT</GlitchText>
        </Link>
      </nav>

      <TerminalInterface />
    </div>
  );
} 
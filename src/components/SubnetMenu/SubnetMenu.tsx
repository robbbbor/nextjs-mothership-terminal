'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import TerminalInterface from '../Terminal/TerminalInterface';

interface SubnetMenuItem {
  label: string;
  href: string;
}

const menuItems: SubnetMenuItem[] = [
  { label: 'GALACTIC WIKI', href: '/subnet/galactic-wiki' },
];

export default function SubnetMenu() {
  const router = useRouter();

  const playSound = () => {
    const audio = new Audio('/sounds/click.mp3');
    audio.volume = 0.8;
    audio.play().catch(error => console.error('Audio play failed:', error));
  };

  return (
    <div className="main-menu">
      <h1 className="menu-title">Subnet</h1>
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
                router.push(item.href);
              }, 100);
            }}
          >
            {item.label}
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
          BACK TO MAIN MENU
        </a>
      </nav>

      <TerminalInterface />
    </div>
  );
} 
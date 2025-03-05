'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import TerminalInterface from '../Terminal/TerminalInterface';
import GlitchText from '../GlitchText/GlitchText';

interface FilesMenuItem {
  label: string;
  href: string;
}

export default function FilesMenu() {
  const router = useRouter();

  const playSound = () => {
    const audio = new Audio('/click.mp3');
    audio.volume = 0.8;
    audio.play().catch(error => console.error('Audio play failed:', error));
  };

  // Define menu items based on logged-in user
  const getMenuItems = (): FilesMenuItem[] => {
    const baseItems = [
      { label: 'MISSION LOGS', href: '/files/mission-logs' },
      { label: 'PROGRAM FILES', href: '/files/program-files' },
    ];

    // Only return base items for now
    return baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <div className="main-menu">
      <h1 className="menu-title"><GlitchText>Files</GlitchText></h1>
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
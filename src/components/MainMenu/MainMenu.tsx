'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface MainMenuItem {
  label: string;
  href: string;
}

const menuItems: MainMenuItem[] = [
  { label: 'STATION MAP', href: '/station-map' },
  { label: 'DIAGNOSTICS', href: '/diagnostics' },
  { label: 'SCHEDULE', href: '/schedule' },
  { label: 'ROSTER', href: '/roster' },
  { label: 'COMMS', href: '/comms' },
  { label: 'CONTROLS', href: '/controls' },
];

export default function MainMenu() {
  const router = useRouter();

  const playSound = () => {
    const audio = new Audio('/sounds/click.mp3');
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
      <h1 className="menu-title">Main Menu</h1>
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
            {item.label}
          </Link>
        ))}
        <div className="separator logout-separator">========</div>
        <Link
          href="/"
          className="menu-item logout-button"
          onMouseEnter={playSound}
          onClick={handleLogout}
        >
          LOG OUT
        </Link>
      </nav>
    </div>
  );
} 
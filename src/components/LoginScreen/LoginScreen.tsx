'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginDialog from '../LoginDialog/LoginDialog';
import LoadingDialog from '../LoadingDialog/LoadingDialog';
import TerminalInterface from '../Terminal/TerminalInterface';
import InfectedText from '../InfectedText/InfectedText';

type DialogType = 'crew' | 'admin' | 'loading' | null;

interface CrewLogin {
  name: string;
  infectedName: string;
}

const crewLogins: CrewLogin[] = [
  {
    name: "ANDY THE AUTOMATON",
    infectedName: "ANNIHILATE ASSAULT"
  },
  {
    name: "HUGO OCTAVIUS PHILLIPS",
    infectedName: "HURT&OPPRESS. PUNISH!"
  },
  {
    name: "KAI ROE",
    infectedName: "KILLALL"
  },
  {
    name: "V3235",
    infectedName: "VILE!"
  }
];

export default function LoginScreen() {
  const router = useRouter();
  const [audio] = useState(() => typeof window !== 'undefined' ? new Audio('/sounds/click.mp3') : null);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [showDialog, setShowDialog] = useState<DialogType>(null);

  useEffect(() => {
    if (audio) {
      audio.volume = 0.8;
      
      // Enable audio on first user interaction
      const enableAudio = () => {
        audio.play().then(() => {
          audio.pause();
          audio.currentTime = 0;
          setAudioEnabled(true);
        }).catch(() => {
          // Handle any play() failures silently
        });
      };

      document.addEventListener('mouseenter', enableAudio, { once: true });
      document.addEventListener('click', enableAudio, { once: true });
      
      return () => {
        document.removeEventListener('mouseenter', enableAudio);
        document.removeEventListener('click', enableAudio);
      };
    }
  }, [audio]);

  const playSound = () => {
    if (audio && audioEnabled) {
      audio.currentTime = 0;
      const playPromise = audio.play();
      if (playPromise) {
        playPromise.catch(() => {
          // Handle any play() failures silently
        });
      }
    }
  };

  const handleCrewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    playSound();
    setShowDialog('loading');
  };

  const handleAdminClick = (e: React.MouseEvent) => {
    e.preventDefault();
    playSound();
    setShowDialog('admin');
  };

  const handleLoginSuccess = () => {
    playSound();
    setTimeout(() => {
      router.push(showDialog === 'admin' ? '/admin' : '/main');
    }, 100);
  };

  const handleLoginCancel = () => {
    playSound();
    setShowDialog(null);
  };

  return (
    <div className="main-menu">
      <h1 className="menu-title">Terminal Login</h1>
      <div className="separator">========</div>
      <nav>
        {crewLogins.map((login, index) => (
          <a
            key={index}
            href="/main"
            className="menu-item"
            onMouseEnter={playSound}
            onClick={handleCrewClick}
          >
            LOGIN AS <InfectedText 
              originalText={login.name}
              infectedText={login.infectedName}
            />
          </a>
        ))}
        <div className="separator dashed-separator">- - - - - - - -</div>
        <a
          href="/main"
          className="menu-item"
          onMouseEnter={playSound}
          onClick={handleCrewClick}
        >
          LOGIN AS GUEST
        </a>
        <a
          href="/admin"
          className="menu-item"
          onMouseEnter={playSound}
          onClick={handleAdminClick}
        >
          LOGIN AS <InfectedText originalText="ADMIN" infectedText="ASHLI" />
        </a>
      </nav>
      {showDialog === 'admin' && (
        <LoginDialog
          type="admin"
          onSuccess={handleLoginSuccess}
          onCancel={handleLoginCancel}
        />
      )}
      {showDialog === 'loading' && (
        <LoadingDialog
          onComplete={() => {
            setShowDialog(null);
            router.push('/main');
          }}
        />
      )}

      <TerminalInterface />
    </div>
  );
} 
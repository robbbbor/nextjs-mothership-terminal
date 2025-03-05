'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginDialog from '../LoginDialog/LoginDialog';
import LoadingDialog from '../LoadingDialog/LoadingDialog';
import TerminalInterface from '../Terminal/TerminalInterface';
import InfectedText from '../InfectedText/InfectedText';
import GlitchText from '../GlitchText/GlitchText';
import { useUser } from '@/contexts/UserContext';
import { useAudio } from '@/hooks/useAudio';

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
  const { setLoggedInUser } = useUser();
  const { playSound } = useAudio();
  const [showDialog, setShowDialog] = useState<DialogType>(null);

  const handleCrewClick = (crewName?: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    playSound('click');
    setLoggedInUser(crewName || 'GUEST');
    setShowDialog('loading');
  };

  const handleAdminClick = (e: React.MouseEvent) => {
    e.preventDefault();
    playSound('click');
    setShowDialog('admin');
  };

  const handleLoginSuccess = () => {
    playSound('grant');
    if (showDialog === 'admin') {
      setLoggedInUser('ADMIN');
    }
    setTimeout(() => {
      router.push(showDialog === 'admin' ? '/admin' : '/main');
    }, 100);
  };

  const handleLoginCancel = () => {
    playSound('click');
    setShowDialog(null);
  };

  return (
    <div className="main-menu">
      <h1 className="menu-title"><GlitchText>Spacedix Login</GlitchText></h1>
      <div className="separator">========</div>
      <nav>
        {crewLogins.map((login, index) => (
          <a
            key={index}
            href="/main"
            className="menu-item"
            onMouseEnter={() => playSound('click')}
            onClick={handleCrewClick(login.name)}
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
          onMouseEnter={() => playSound('click')}
          onClick={handleCrewClick()}
        >
          LOGIN AS <InfectedText originalText="GUEST           " infectedText="GUESS WHO? :D" />
        </a>
        <a
          href="/admin"
          className="menu-item"
          onMouseEnter={() => playSound('click')}
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
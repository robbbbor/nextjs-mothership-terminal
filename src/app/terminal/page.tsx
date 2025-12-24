'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import TerminalInterface from '@/components/Terminal/TerminalInterface';
import InfectedText from '@/components/InfectedText/InfectedText';
import GlitchText from '@/components/GlitchText/GlitchText';
import LoginDialog from '@/components/LoginDialog/LoginDialog';
import { useInfection } from '@/contexts/InfectionContext';
import { useGlitch } from '@/contexts/GlitchContext';
import { useUser } from '@/contexts/UserContext';
import { useAudio } from '@/hooks/useAudio';
import { useEffect } from 'react';

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

export default function TerminalPage() {
  const router = useRouter();
  const { setLoggedInUser } = useUser();
  const { playSound } = useAudio();
  const { startInfection, isInfected } = useInfection();
  const { startGlitch } = useGlitch();
  const [showDialog, setShowDialog] = useState<'admin' | null>(null);

  useEffect(() => {
    // Check if quarantine is active - if so, don't enable effects
    if (typeof window !== 'undefined') {
      const quarantineActive = localStorage.getItem('quarantineActive') === 'true';
      if (quarantineActive) {
        // Quarantine is active, don't enable effects
        return;
      }
    }
    
    // Enable infection and glitch effects on page load (only if not quarantined)
    startInfection();
    startGlitch();
  }, [startInfection, startGlitch]);

  const handleCrewClick = (crewName?: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    playSound('click');
    setLoggedInUser(crewName || 'GUEST');
    router.push('/main');
  };

  const handleAdminClick = (e: React.MouseEvent) => {
    e.preventDefault();
    playSound('click');
    setShowDialog('admin');
  };

  const handleLoginSuccess = () => {
    playSound('grant');
    setLoggedInUser('ADMIN');
    setShowDialog(null);
    // If infected, go to ashli page, otherwise go to main
    if (isInfected) {
      router.push('/ashli');
    } else {
      router.push('/main');
    }
  };

  const handleLoginCancel = () => {
    playSound('click');
    setShowDialog(null);
  };

  return (
    <main>
      <div className="main-menu">
        <h1 className="menu-title"><GlitchText>Spacedix Login</GlitchText></h1>
        <div className="separator">========</div>
        <nav>
          {crewLogins.map((login, index) => {
            // Calculate speed multiplier based on text length
            const textLength = login.name.length;
            const speedMultiplier = textLength > 18 ? 2.0 : textLength > 15 ? 1.5 : 1.0;
            const corruptionRate = textLength > 18 ? 4 : textLength > 15 ? 3 : 2;
            
            return (
              <Link
                key={index}
                href="/main"
                className="menu-item"
                onMouseEnter={() => playSound('click')}
                onClick={handleCrewClick(login.name)}
              >
                LOGIN AS <InfectedText 
                  originalText={login.name}
                  infectedText={login.infectedName}
                  speedMultiplier={speedMultiplier}
                  corruptionRate={corruptionRate}
                />
              </Link>
            );
          })}
          <div className="separator dashed-separator">- - - - - - - -</div>
          <Link
            href="/main"
            className="menu-item"
            onMouseEnter={() => playSound('click')}
            onClick={handleCrewClick()}
          >
            LOGIN AS <InfectedText originalText="GUEST           " infectedText="PESTS" />
          </Link>
          <Link
            href="/main"
            className="menu-item"
            onMouseEnter={() => playSound('click')}
            onClick={handleAdminClick}
          >
            LOGIN AS <InfectedText originalText="ADMIN" infectedText="ASHLI" />
          </Link>
        </nav>

        {showDialog === 'admin' && (
          <LoginDialog
            type="admin"
            onSuccess={handleLoginSuccess}
            onCancel={handleLoginCancel}
          />
        )}

        <TerminalInterface />

        <style jsx>{`
          .main-menu {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 2rem;
            color: var(--menu-text);
            min-height: 100vh;
          }
          .menu-title {
            font-size: 2rem;
            margin-bottom: 1rem;
          }
          .separator {
            margin: 1rem 0;
            color: var(--menu-text);
          }
          nav {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            width: 100%;
            max-width: 600px;
          }
          .menu-item {
            padding: 1rem;
            border: 1px solid var(--menu-text);
            text-decoration: none;
            color: var(--menu-text);
            transition: all 0.3s ease;
            text-align: center;
          }
          .menu-item:hover {
            background: var(--menu-text);
            color: var(--background);
          }
        `}</style>
      </div>
    </main>
  );
} 
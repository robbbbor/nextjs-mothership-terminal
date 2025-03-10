'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import GlitchText from '../GlitchText/GlitchText';
import InfectedText from '../InfectedText/InfectedText';
import TerminalInterface from '../Terminal/TerminalInterface';
import { useAudio } from '@/hooks/useAudio';

interface CrewMember {
  name: string;
  infectedName: string;
  details: string[];
}

const crewMembers: CrewMember[] = [
  {
    name: "ANDY THE AUTOMATON",
    infectedName: "ANNIHILATE ASSAULT",
    details: [
      "PILOT",
      "MECHANIC",
      "MAY BE OBSOLETE SOON",
      "ANDROID",
      "ANOMALY: SMOKES CIGARETTES AND TAKES PILLS DESPITE BEING AN AUTOMATON"
    ]
  },
  {
    name: "HUGO OCTAVIUS PHILLIPS",
    infectedName: "HURT&OPPRESS. PUNISH!",
    details: [
      "FORMER CAPTAIN OF INFINITE PROFITS",
      "MILITARY TRAINING",
      "HAS A PET DOG",
      "HUMAN",
      "ANOMALY: MYSTICISM. NO ELABORATION REQUIRED"
    ]
  },
  {
    name: "KAI ROE",
    infectedName: "KILLALL",
    details: [
      "MEDIC",
      "HAND-TO-HAND SPECIALIST. CRACKS SKULLS",
      "HAND-TO-BACK SPECIALIST. CRACKS BACKS",
      "HUMAN CYBORG",
      "ANOMALY: DETACHABLE APPENDAGE. UNSPECIFIED"
    ]
  },
  {
    name: "V3235",
    infectedName: "VILE!",
    details: [
      "SCIENTIST",
      "HAS A PET LAB RAT",
      "GENDER-SHIFTING CAPABILITIES",
      "ANDROID",
      "ANOMALY: ONLY ACTIVATES NON-GENDERED CONFIGURATION"
    ]
  }
];

export default function RosterMenu() {
  const router = useRouter();
  const { playSound } = useAudio();
  const [expandedCrew, setExpandedCrew] = useState<string | null>(null);

  const toggleCrewDetails = (crewName: string) => {
    playSound('click');
    setExpandedCrew(prevState => prevState === crewName ? null : crewName);
  };

  return (
    <div className="main-menu">
      <h1 className="menu-title"><GlitchText>Roster</GlitchText></h1>
      <div className="separator">========</div>
      <nav className="roster-list">
        {crewMembers.map((crew) => (
          <div key={crew.name} className="roster-item">
            <button 
              type="button"
              className="roster-name-button"
              onClick={() => toggleCrewDetails(crew.name)}
              onMouseEnter={() => playSound('click')}
              aria-expanded={expandedCrew === crew.name}
            >
              <div className="roster-name">
                <InfectedText 
                  originalText={crew.name}
                  infectedText={crew.infectedName}
                />
                <span className="expand-indicator" aria-hidden="true">
                  {expandedCrew === crew.name ? '[-]' : '[+]'}
                </span>
              </div>
            </button>
            {expandedCrew === crew.name && (
              <ul className="roster-details" role="list">
                {crew.details.map((detail) => (
                  <li key={`${crew.name}-${detail}`} className="roster-detail">
                    <GlitchText>{detail}</GlitchText>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </nav>
      <a
        href="/main"
        className="menu-item back-button"
        onMouseEnter={() => playSound('click')}
        onClick={(e) => {
          e.preventDefault();
          playSound('click');
          setTimeout(() => {
            router.push('/main');
          }, 100);
        }}
      >
        <GlitchText>BACK TO MAIN MENU</GlitchText>
      </a>

      <TerminalInterface />
    </div>
  );
} 
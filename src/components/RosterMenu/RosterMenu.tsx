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
    setExpandedCrew(expandedCrew === crewName ? null : crewName);
  };

  return (
    <div className="main-menu">
      <h1 className="menu-title"><GlitchText>Roster</GlitchText></h1>
      <div className="separator">========</div>
      <div className="roster-list">
        {crewMembers.map((crew, index) => (
          <div key={index} className="roster-item">
            <button 
              className="roster-name-button"
              onClick={() => toggleCrewDetails(crew.name)}
              onMouseEnter={() => playSound('click')}
            >
              <div className="roster-name">
                <InfectedText 
                  originalText={crew.name}
                  infectedText={crew.infectedName}
                />
                <span className="expand-indicator">
                  {expandedCrew === crew.name ? '[-]' : '[+]'}
                </span>
              </div>
            </button>
            {expandedCrew === crew.name && (
              <ul className="roster-details">
                {crew.details.map((detail, detailIndex) => (
                  <li key={detailIndex} className="roster-detail">
                    <GlitchText>{detail}</GlitchText>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      <a
        href="/main"
        className="menu-item back-button"
        onMouseEnter={() => playSound('click')}
        onClick={(e) => {
          playSound('click');
          e.preventDefault();
          setTimeout(() => {
            router.push('/main');
          }, 100);
        }}
      >
        <GlitchText>BACK TO MAIN MENU</GlitchText>
      </a>

      <TerminalInterface />

      <style jsx>{`
        .roster-name-button {
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          padding: 0.5rem 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          color: var(--menu-text);
          border: 1px solid transparent;
        }

        .roster-name-button:hover {
          background: rgba(var(--menu-text-rgb), 0.1);
          border: 1px solid var(--menu-text);
        }

        .roster-name {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .expand-indicator {
          font-family: "Glass TTY VT220", "VT323", monospace;
          margin-left: 1rem;
          opacity: 0.8;
        }

        .roster-details {
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
} 
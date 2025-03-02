'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import TerminalInterface from '../Terminal/TerminalInterface';
import InfectedText from '../InfectedText/InfectedText';

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
      "ROLE: SHIP'S ENGINEER",
      "STATUS: OPERATIONAL",
      "NOTES: ARTIFICIAL INTELLIGENCE, MAINTENANCE SPECIALIST"
    ]
  },
  {
    name: "HUGO OCTAVIUS PHILLIPS",
    infectedName: "HURT&OPPRESS. PUNISH!",
    details: [
      "ROLE: CAPTAIN",
      "STATUS: ACTIVE",
      "NOTES: VETERAN SPACER, FORMER MILITARY"
    ]
  },
  {
    name: "KAI ROE",
    infectedName: "KILLALL",
    details: [
      "ROLE: PILOT",
      "STATUS: ACTIVE",
      "NOTES: EXPERT NAVIGATOR, RACING BACKGROUND"
    ]
  },
  {
    name: "V3235",
    infectedName: "VILE!",
    details: [
      "ROLE: SECURITY",
      "STATUS: ACTIVE",
      "NOTES: COMBAT ANDROID, ADVANCED TACTICAL SYSTEMS"
    ]
  }
];

export default function RosterMenu() {
  const router = useRouter();

  const playSound = () => {
    const audio = new Audio('/sounds/click.mp3');
    audio.volume = 0.8;
    audio.play().catch(error => console.error('Audio play failed:', error));
  };

  return (
    <div className="main-menu">
      <h1 className="menu-title">Roster</h1>
      <div className="separator">========</div>
      <div className="roster-list">
        {crewMembers.map((crew, index) => (
          <div key={index} className="roster-item">
            <div className="roster-name">
              <InfectedText 
                originalText={crew.name}
                infectedText={crew.infectedName}
              />
            </div>
            <ul className="roster-details">
              {crew.details.map((detail, detailIndex) => (
                <li key={detailIndex} className="roster-detail">{detail}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
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

      <TerminalInterface />
    </div>
  );
} 
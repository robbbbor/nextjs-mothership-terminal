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
      "PET DOG",
      "HUMAN",
      "ANOMALY: MYSTICISM. NO ELABORATION REQUIRED"
    ]
  },
  {
    name: "KAI ROE",
    infectedName: "KILLALL",
    details: [
      "MEDIC",
      "HAND-TO-HAND SPECIALIST",
      "DETACHABLE PENIS",
      "HUMAN CYBORG",
      "ANOMALY: CRACKS BACKS AND CRACKS SKULLS"
    ]
  },
  {
    name: "V3235",
    infectedName: "VILE!",
    details: [
      "SCIENTIST",
      "PET LAB RAT",
      "GENDER-SHIFTING CAPABILITIES",
      "ANDROID",
      "ANOMALY: ONLY ACTIVATES NON-GENDERED CONFIGURATION"
    ]
  }
];

export default function RosterMenu() {
  const router = useRouter();

  const playSound = () => {
    const audio = new Audio('/click.mp3');
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
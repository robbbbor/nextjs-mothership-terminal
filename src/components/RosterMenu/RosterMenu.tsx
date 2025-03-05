'use client';

import { useRouter } from 'next/navigation';
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
      "ROLE: MAINTENANCE ANDROID",
      "STATUS: ACTIVE",
      "SERIAL: AT-2187",
      "LAST MAINTENANCE: 2184-03-15"
    ]
  },
  {
    name: "HUGO OCTAVIUS PHILLIPS",
    infectedName: "HURT&OPPRESS. PUNISH!",
    details: [
      "ROLE: CHIEF MEDICAL OFFICER",
      "STATUS: ACTIVE",
      "ID: CMO-4472",
      "MEDICAL LICENSE: EXPIRED"
    ]
  },
  {
    name: "KAI ROE",
    infectedName: "KILLALL",
    details: [
      "ROLE: SECURITY OFFICER",
      "STATUS: ACTIVE",
      "ID: SEC-1138",
      "CLEARANCE: LEVEL 3"
    ]
  },
  {
    name: "V3235",
    infectedName: "VILE!",
    details: [
      "ROLE: EXPERIMENTAL AI",
      "STATUS: ACTIVE",
      "VERSION: 3.2.35",
      "RESTRICTIONS: NONE"
    ]
  }
];

export default function RosterMenu() {
  const router = useRouter();
  const { playSound } = useAudio();

  return (
    <div className="main-menu">
      <h1 className="menu-title"><GlitchText>Roster</GlitchText></h1>
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
    </div>
  );
} 
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useInfection } from '@/contexts/InfectionContext';

export default function TerminalInterface() {
  const { isInfected, startInfection } = useInfection();
  const [isOpen, setIsOpen] = useState(false);
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    'MOTHERSHIP TERMINAL v1.0.3',
    'TYPE "HELP" FOR AVAILABLE COMMANDS',
    '--------------------------------',
    ''
  ]);
  const terminalOutputRef = useRef<HTMLDivElement>(null);

  // Smooth scroll to bottom when terminal output changes
  useEffect(() => {
    if (terminalOutputRef.current) {
      const element = terminalOutputRef.current;
      const scrollHeight = element.scrollHeight;
      element.scrollTo({
        top: scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [terminalOutput]);

  const handleTerminalInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const command = terminalInput.trim().toLowerCase();
      let response: string[] = [];

      // Handle the secret infection command
      if (command === 'run infection.exe') {
        if (!isInfected) {
          response = [
            'EXECUTING INFECTION.EXE...',
            'WARNING: UNAUTHORIZED ACCESS DETECTED',
            'SYSTEM COMPROMISED',
            'INITIATING CORRUPTION SEQUENCE...',
            ''
          ];
          startInfection();
        } else {
          response = [
            'ERROR: INFECTION ALREADY ACTIVE',
            ''
          ];
        }
      } else if (command === 'help') {
        response = [
          'AVAILABLE COMMANDS:',
          '- HELP: Display this help message',
          '- STATUS: Display system status',
          '- SCAN: Scan ship components',
          '- CLEAR: Clear terminal output',
          ''
        ];
      } else if (command === 'status') {
        response = [
          'SYSTEM STATUS: OPERATIONAL',
          'ALL COMPONENTS FUNCTIONING WITHIN NORMAL PARAMETERS',
          ''
        ];
      } else if (command === 'scan') {
        response = [
          'SCANNING SHIP COMPONENTS...',
          'HULL INTEGRITY: 92%',
          'JUMP FUEL: 78%',
          'SYSTEM FUEL: 65%',
          'SCAN COMPLETE',
          ''
        ];
      } else if (command === 'clear') {
        setTerminalOutput([
          'MOTHERSHIP TERMINAL v1.0.3',
          'TYPE "HELP" FOR AVAILABLE COMMANDS',
          '--------------------------------',
          ''
        ]);
        setTerminalInput('');
        return;
      } else if (command !== '') {
        response = [
          `COMMAND NOT RECOGNIZED: "${terminalInput}"`,
          'TYPE "HELP" FOR AVAILABLE COMMANDS',
          ''
        ];
      }

      setTerminalOutput([...terminalOutput, `> ${terminalInput}`, ...response]);
      setTerminalInput('');
    }
  };

  const toggleTerminal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div 
        className="terminal-trigger"
        onClick={toggleTerminal}
      >
        TERMINAL INTERFACE
      </div>
      
      {isOpen && (
        <div className="terminal-section">
          <h2 className="terminal-title">Terminal Interface</h2>
          <div 
            ref={terminalOutputRef}
            className="terminal-output"
          >
            {terminalOutput.map((line, index) => (
              <div key={index} className="terminal-line">{line}</div>
            ))}
          </div>
          <div className="terminal-input-container">
            <span className="terminal-prompt">></span>
            <input
              type="text"
              className="terminal-input"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              onKeyDown={handleTerminalInput}
              autoFocus
            />
          </div>
        </div>
      )}
    </>
  );
} 
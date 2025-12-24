'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useInfection } from '@/contexts/InfectionContext';
import { useGlitch } from '@/contexts/GlitchContext';

interface TerminalInterfaceProps {
  onCustomCommand?: (command: string) => boolean; // Returns true if command was handled
}

export default function TerminalInterface({ onCustomCommand }: TerminalInterfaceProps = {}) {
  const { isInfected, startInfection } = useInfection();
  const { isGlitchActive, startGlitch, stopGlitch } = useGlitch();
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

      // Check for custom command handler first
      if (onCustomCommand && onCustomCommand(command)) {
        setTerminalInput('');
        return;
      }

      // Handle the glitch command
      if (command === 'run glitch.exe') {
        if (!isGlitchActive) {
          response = [
            'EXECUTING GLITCH.EXE...',
            'INITIALIZING VISUAL DISTORTION SEQUENCE',
            'SYSTEM ANOMALY DETECTED',
            'GLITCH EFFECT ACTIVATED',
            ''
          ];
          startGlitch();
        } else {
          response = [
            'ERROR: GLITCH EFFECT ALREADY ACTIVE',
            ''
          ];
        }
      }
      // Handle the stop glitch command
      else if (command === 'stop glitch.exe') {
        if (isGlitchActive) {
          response = [
            'TERMINATING GLITCH.EXE...',
            'VISUAL DISTORTION SEQUENCE HALTED',
            'SYSTEM RETURNING TO NORMAL',
            ''
          ];
          stopGlitch();
        } else {
          response = [
            'ERROR: NO ACTIVE GLITCH EFFECT DETECTED',
            ''
          ];
        }
      }
      // Handle the secret infection command
      else if (command === 'run infection.exe') {
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

  return (
    <div className="terminal-section">
      <div className="terminal-title">TERMINAL {'>'}</div>
      <div 
        ref={terminalOutputRef}
        className="terminal-output"
      >
        {terminalOutput.map((line, index) => (
          <div key={index} className="terminal-line">{line}</div>
        ))}
      </div>
      <div className="terminal-input-container">
        <span className="terminal-prompt">{'>'}</span>
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
  );
} 
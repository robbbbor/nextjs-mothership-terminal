'use client';

import TerminalInterface from '@/components/Terminal/TerminalInterface';
import { useInfection } from '@/contexts/InfectionContext';
import { useGlitch } from '@/contexts/GlitchContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function FinalTerminalPage() {
  const router = useRouter();
  const { startInfection, stopInfection } = useInfection();
  const { startGlitch, stopGlitch } = useGlitch();

  useEffect(() => {
    // Enable infection and glitch effects on page load
    startInfection();
    startGlitch();
  }, [startInfection, startGlitch]);

  const handleCustomCommand = (command: string): boolean => {
    if (command === 'quarantine ashli.exe') {
      // Stop infection and glitch effects
      stopInfection();
      stopGlitch();
      
      // Set a flag in localStorage to prevent terminal page from re-enabling effects
      if (typeof window !== 'undefined') {
        localStorage.setItem('quarantineActive', 'true');
      }
      
      // Add a small delay to ensure state updates propagate before navigation
      setTimeout(() => {
        // Navigate back to the beginning terminal page
        router.push('/terminal');
      }, 100);
      
      return true; // Command was handled
    }
    return false; // Command not handled, let TerminalInterface handle it
  };

  return (
    <main>
      <TerminalInterface onCustomCommand={handleCustomCommand} />
    </main>
  );
}


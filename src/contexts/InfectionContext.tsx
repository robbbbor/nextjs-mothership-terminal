'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface InfectionContextType {
  isInfected: boolean;
  startInfection: () => void;
  stopInfection: () => void;
}

const InfectionContext = createContext<InfectionContextType | undefined>(undefined);

export function InfectionProvider({ children }: { children: React.ReactNode }) {
  const [isInfected, setIsInfected] = useState(false);

  const startInfection = useCallback(() => {
    setIsInfected(true);
  }, []);

  const stopInfection = useCallback(() => {
    setIsInfected(false);
  }, []);

  return (
    <InfectionContext.Provider value={{ isInfected, startInfection, stopInfection }}>
      {children}
    </InfectionContext.Provider>
  );
}

export function useInfection() {
  const context = useContext(InfectionContext);
  if (context === undefined) {
    throw new Error('useInfection must be used within an InfectionProvider');
  }
  return context;
} 
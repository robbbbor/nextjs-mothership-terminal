'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface InfectionContextType {
  isInfected: boolean;
  startInfection: () => void;
  stopInfection: () => void;
}

const InfectionContext = createContext<InfectionContextType | undefined>(undefined);

export function InfectionProvider({ children }: { children: React.ReactNode }) {
  // Check for quarantine flag on initialization
  const getInitialInfectedState = () => {
    if (typeof window !== 'undefined') {
      const quarantineActive = localStorage.getItem('quarantineActive') === 'true';
      if (quarantineActive) {
        return false; // Quarantine is active, start with infection disabled
      }
    }
    return true; // Default to infected
  };

  const [isInfected, setIsInfected] = useState(getInitialInfectedState);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage when the component mounts
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized) {
      try {
        const quarantineActive = localStorage.getItem('quarantineActive') === 'true';
        if (quarantineActive) {
          setIsInfected(false);
        } else {
          const saved = localStorage.getItem('isInfected');
          if (saved !== null) {
            setIsInfected(saved === 'true');
          } else {
            setIsInfected(true);
          }
        }
      } catch (error) {
        console.error('Failed to read from localStorage:', error);
      }
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Update localStorage when state changes (but respect quarantine)
  useEffect(() => {
    if (typeof window !== 'undefined' && isInitialized) {
      try {
        const quarantineActive = localStorage.getItem('quarantineActive') === 'true';
        if (!quarantineActive) {
          localStorage.setItem('isInfected', isInfected.toString());
        }
      } catch (error) {
        console.error('Failed to write to localStorage:', error);
      }
    }
  }, [isInfected, isInitialized]);

  const startInfection = useCallback(() => {
    // Don't start infection if quarantine is active
    if (typeof window !== 'undefined') {
      const quarantineActive = localStorage.getItem('quarantineActive') === 'true';
      if (quarantineActive) {
        return; // Quarantine is active, don't start infection
      }
    }
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
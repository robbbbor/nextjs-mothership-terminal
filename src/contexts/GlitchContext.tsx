'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface GlitchContextType {
  isGlitchActive: boolean;
  startGlitch: () => void;
  stopGlitch: () => void;
}

const GlitchContext = createContext<GlitchContextType | undefined>(undefined);

export function GlitchProvider({ children }: { children: React.ReactNode }) {
  // Initialize with glitch enabled by default
  const [isGlitchActive, setIsGlitchActive] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage when the component mounts
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized) {
      try {
        const quarantineActive = localStorage.getItem('quarantineActive') === 'true';
        if (quarantineActive) {
          setIsGlitchActive(false); // Quarantine is active, start with glitch disabled
        } else {
          const saved = localStorage.getItem('isGlitchActive');
          if (saved !== null) {
            setIsGlitchActive(saved === 'true');
          } else {
            // If no saved value, default to enabled
            setIsGlitchActive(true);
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
          localStorage.setItem('isGlitchActive', isGlitchActive.toString());
        }
      } catch (error) {
        console.error('Failed to write to localStorage:', error);
      }
    }
  }, [isGlitchActive, isInitialized]);

  const startGlitch = useCallback(() => {
    // Don't start glitch if quarantine is active
    if (typeof window !== 'undefined') {
      const quarantineActive = localStorage.getItem('quarantineActive') === 'true';
      if (quarantineActive) {
        return; // Quarantine is active, don't start glitch
      }
    }
    setIsGlitchActive(true);
  }, []);

  const stopGlitch = useCallback(() => {
    setIsGlitchActive(false);
  }, []);

  const value = {
    isGlitchActive,
    startGlitch,
    stopGlitch
  };

  return (
    <GlitchContext.Provider value={value}>
      {children}
    </GlitchContext.Provider>
  );
}

export function useGlitch() {
  const context = useContext(GlitchContext);
  if (context === undefined) {
    throw new Error('useGlitch must be used within a GlitchProvider');
  }
  return context;
} 
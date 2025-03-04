'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface GlitchContextType {
  isGlitchActive: boolean;
  startGlitch: () => void;
  stopGlitch: () => void;
}

const GlitchContext = createContext<GlitchContextType | undefined>(undefined);

export function GlitchProvider({ children }: { children: React.ReactNode }) {
  const [isGlitchActive, setIsGlitchActive] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined' && !isInitialized) {
      const saved = localStorage.getItem('isGlitchActive');
      if (saved !== null) {
        setIsGlitchActive(saved === 'true');
      }
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Update localStorage when state changes
  useEffect(() => {
    if (typeof window !== 'undefined' && isInitialized) {
      localStorage.setItem('isGlitchActive', isGlitchActive.toString());
    }
  }, [isGlitchActive, isInitialized]);

  const startGlitch = () => setIsGlitchActive(true);
  const stopGlitch = () => setIsGlitchActive(false);

  return (
    <GlitchContext.Provider value={{ isGlitchActive, startGlitch, stopGlitch }}>
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
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useGlitch } from '@/contexts/GlitchContext';

interface GlitchTextProps {
  children: React.ReactNode;
}

const glitchCharacters = '!@#$%^&*()_+-=[]{}|;:,.<>?';

export default function GlitchText({ children }: GlitchTextProps) {
  const { isGlitchActive } = useGlitch();
  const [displayText, setDisplayText] = useState<string>('');
  const originalText = React.Children.toArray(children).join('');
  const [isInitialized, setIsInitialized] = useState(false);

  const updateGlitchText = useCallback(() => {
    if (!isGlitchActive) {
      setDisplayText(originalText);
      return;
    }

    const newText = originalText.split('').map(char => {
      if (Math.random() < 0.01 && char !== ' ') {
        const effect = Math.random();
        
        if (effect < 0.3) {
          return glitchCharacters[Math.floor(Math.random() * glitchCharacters.length)];
        } else if (effect < 0.5) {
          return char + '\u0300';
        }
      }
      return char;
    }).join('');

    setDisplayText(newText);
  }, [isGlitchActive, originalText]);

  // Initialize on mount
  useEffect(() => {
    setIsInitialized(true);
    setDisplayText(originalText);
  }, [originalText]);

  // Handle glitch effect
  useEffect(() => {
    if (!isInitialized) return;

    if (!isGlitchActive) {
      setDisplayText(originalText);
      return;
    }

    const glitchInterval = setInterval(updateGlitchText, 100);
    return () => clearInterval(glitchInterval);
  }, [isGlitchActive, originalText, isInitialized, updateGlitchText]);

  return (
    <span className={isGlitchActive ? 'subtle-glitch' : ''}>
      {displayText || children}
    </span>
  );
} 
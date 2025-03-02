'use client';

import React, { useEffect, useState } from 'react';
import { useGlitch } from '@/contexts/GlitchContext';

interface GlitchTextProps {
  children: React.ReactNode;
}

const glitchCharacters = '!@#$%^&*()_+-=[]{}|;:,.<>?';

export default function GlitchText({ children }: GlitchTextProps) {
  const { isGlitchActive } = useGlitch();
  const [displayText, setDisplayText] = useState<string>('');
  const originalText = React.Children.toArray(children).join('');

  useEffect(() => {
    if (!isGlitchActive) {
      setDisplayText(originalText);
      return;
    }

    let frameCount = 0;
    const glitchProbability = 0.01; // Reduced from 0.02 to 0.01 (1% chance per character per frame)
    const frameInterval = 100; // Increased from 50ms to 100ms

    const glitchInterval = setInterval(() => {
      frameCount++;
      
      const newText = originalText.split('').map((char, index) => {
        // Only glitch if random chance hits and character is not a space
        if (Math.random() < glitchProbability && char !== ' ') {
          // Randomly choose between different glitch effects
          const effect = Math.random();
          
          if (effect < 0.3) {
            // Replace with random glitch character
            return glitchCharacters[Math.floor(Math.random() * glitchCharacters.length)];
          } else if (effect < 0.5) {
            // Slight vertical offset using combining diacritical marks
            return char + '\u0300';
          } else {
            // No glitch this frame
            return char;
          }
        }
        return char;
      }).join('');

      setDisplayText(newText);
    }, frameInterval);

    return () => clearInterval(glitchInterval);
  }, [isGlitchActive, originalText]);

  return (
    <span className={isGlitchActive ? 'subtle-glitch' : ''}>
      {displayText || children}
    </span>
  );
} 
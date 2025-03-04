'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useInfection } from '@/contexts/InfectionContext';

interface InfectedTextProps {
  originalText: string;
  infectedText: string;
  className?: string;
}

export default function InfectedText({ originalText, infectedText, className = '' }: InfectedTextProps) {
  const { isInfected } = useInfection();
  const [glitchPhase, setGlitchPhase] = useState(0);
  const [displayText, setDisplayText] = useState(originalText);
  const [corruptedPositions, setCorruptedPositions] = useState<Set<number>>(new Set());
  const elementRef = useRef<HTMLSpanElement>(null);
  const [isNearScanLine, setIsNearScanLine] = useState(false);
  const lastGlitchTime = useRef(0);

  // Track scan line position and trigger glitch when nearby
  useEffect(() => {
    if (!isInfected) {
      setDisplayText(originalText);
      setGlitchPhase(0);
      setCorruptedPositions(new Set());
      return;
    }

    const checkScanLineProximity = () => {
      const element = elementRef.current;
      const scanLine = document.querySelector('.scan-line') as HTMLElement;
      
      if (!element || !scanLine) return;

      const elementRect = element.getBoundingClientRect();
      const scanLineRect = scanLine.getBoundingClientRect();
      
      const elementMidpoint = elementRect.top + elementRect.height / 2;
      const scanLineMidpoint = scanLineRect.top + scanLineRect.height / 2;
      
      const distanceThreshold = 40;
      const isNear = Math.abs(scanLineMidpoint - elementMidpoint) < distanceThreshold;
      
      // Only trigger if we weren't near before and enough time has passed
      if (isNear && !isNearScanLine && Date.now() - lastGlitchTime.current > 2000) {
        setIsNearScanLine(true);
        lastGlitchTime.current = Date.now();
      } else if (!isNear) {
        setIsNearScanLine(false);
      }
    };

    const animationFrame = requestAnimationFrame(function check() {
      checkScanLineProximity();
      requestAnimationFrame(check);
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [isInfected, originalText, isNearScanLine]);

  // Handle glitch effect when scan line is near
  useEffect(() => {
    if (!isInfected || !isNearScanLine) {
      // When not glitching, show text with current corrupted positions
      const newText = originalText.split('');
      corruptedPositions.forEach(pos => {
        newText[pos] = infectedText[pos];
      });
      setDisplayText(newText.join(''));
      setGlitchPhase(0);
      return;
    }

    let glitchInterval: NodeJS.Timeout;
    let phaseTimeout: NodeJS.Timeout;

    const startGlitchSequence = () => {
      setGlitchPhase(1);
      
      // Phase 1: Initial glitch (200ms)
      glitchInterval = setInterval(() => {
        setDisplayText(Math.random() > 0.5 ? originalText : infectedText);
      }, 100);

      // Phase 2: Rapid glitch (100ms)
      phaseTimeout = setTimeout(() => {
        setGlitchPhase(2);
        clearInterval(glitchInterval);
        glitchInterval = setInterval(() => {
          setDisplayText(Math.random() > 0.3 ? infectedText : originalText);
        }, 50);

        // Final phase: Return to mixed text with two more characters corrupted
        setTimeout(() => {
          clearInterval(glitchInterval);
          
          // Find first uncorrupted position
          let firstUncorruptedPos = 0;
          while (corruptedPositions.has(firstUncorruptedPos) && firstUncorruptedPos < originalText.length) {
            firstUncorruptedPos++;
          }
          
          // Get all available uncorrupted positions (excluding the first uncorrupted position)
          const availablePositions = [];
          for (let i = 0; i < originalText.length; i++) {
            if (i !== firstUncorruptedPos && !corruptedPositions.has(i)) {
              availablePositions.push(i);
            }
          }
          
          // Create new corrupted positions set
          const newCorruptedPositions = new Set(corruptedPositions);
          
          // Always corrupt the first uncorrupted position if available
          if (firstUncorruptedPos < originalText.length) {
            newCorruptedPositions.add(firstUncorruptedPos);
          }
          
          // Corrupt a random position if available
          if (availablePositions.length > 0) {
            const randomIndex = Math.floor(Math.random() * availablePositions.length);
            newCorruptedPositions.add(availablePositions[randomIndex]);
          }
          
          // Update corrupted positions
          setCorruptedPositions(newCorruptedPositions);
          
          // Create new display text
          const newText = originalText.split('');
          newCorruptedPositions.forEach(pos => {
            newText[pos] = infectedText[pos];
          });
          setDisplayText(newText.join(''));
          setGlitchPhase(0);
        }, 100);
      }, 200);
    };

    startGlitchSequence();

    return () => {
      clearInterval(glitchInterval);
      clearTimeout(phaseTimeout);
    };
  }, [isInfected, isNearScanLine, originalText, infectedText, corruptedPositions]);

  // Split text into corrupted and uncorrupted parts for rendering
  const renderText = () => {
    if (!isInfected || corruptedPositions.size === 0) {
      return <span>{displayText}</span>;
    }

    if (glitchPhase > 0) {
      // During active glitch, show the entire text with glitch effect
      return <span data-text={displayText}>{displayText}</span>;
    }

    // Create spans for each character with appropriate styling
    return (
      <>
        {displayText.split('').map((char, index) => (
          corruptedPositions.has(index) ? (
            <span key={index} className="evil-glitch-permanent" data-text={char}>
              {char}
            </span>
          ) : (
            <span key={index}>{char}</span>
          )
        ))}
      </>
    );
  };

  const glitchClass = (isInfected && (glitchPhase === 1 || glitchPhase === 2)) ? 
    `${glitchPhase === 1 ? 'evil-glitch-1' : 'evil-glitch-2'}` : '';

  return (
    <span ref={elementRef} className={`${className} ${glitchClass}`}>
      {renderText()}
    </span>
  );
} 
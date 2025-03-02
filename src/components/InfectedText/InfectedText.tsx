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
  const [corruptedChars, setCorruptedChars] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const [isNearScanLine, setIsNearScanLine] = useState(false);
  const lastGlitchTime = useRef(0);

  // Track scan line position and trigger glitch when nearby
  useEffect(() => {
    if (!isInfected) {
      setDisplayText(originalText);
      setGlitchPhase(0);
      setCorruptedChars(0);
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
  }, [isInfected, originalText]);

  // Handle glitch effect when scan line is near
  useEffect(() => {
    if (!isInfected || !isNearScanLine) {
      // When not glitching, show corrupted part from infected text and uncorrupted part from original
      if (corruptedChars > 0) {
        setDisplayText(infectedText.slice(0, corruptedChars) + originalText.slice(corruptedChars));
      } else {
        setDisplayText(originalText);
      }
      setGlitchPhase(0);
      return;
    }

    let glitchInterval: NodeJS.Timeout;
    let phaseTimeout: NodeJS.Timeout;

    const startGlitchSequence = () => {
      setGlitchPhase(1);
      
      // Phase 1: Initial glitch (200ms)
      glitchInterval = setInterval(() => {
        setDisplayText(prev => 
          Math.random() > 0.5 ? originalText : infectedText
        );
      }, 100);

      // Phase 2: Rapid glitch (100ms)
      phaseTimeout = setTimeout(() => {
        setGlitchPhase(2);
        clearInterval(glitchInterval);
        glitchInterval = setInterval(() => {
          setDisplayText(prev => 
            Math.random() > 0.3 ? infectedText : originalText
          );
        }, 50);

        // Final phase: Return to mixed text with one more character corrupted
        setTimeout(() => {
          clearInterval(glitchInterval);
          setCorruptedChars(prev => Math.min(prev + 1, originalText.length));
          const newCorruptedCount = Math.min(corruptedChars + 1, originalText.length);
          setDisplayText(infectedText.slice(0, newCorruptedCount) + originalText.slice(newCorruptedCount));
          setGlitchPhase(0);
        }, 100);
      }, 200);
    };

    startGlitchSequence();

    return () => {
      clearInterval(glitchInterval);
      clearTimeout(phaseTimeout);
    };
  }, [isInfected, isNearScanLine, originalText, infectedText, corruptedChars]);

  // Split text into corrupted and uncorrupted parts
  const renderText = () => {
    if (!isInfected || corruptedChars === 0) {
      return <span>{displayText}</span>;
    }

    if (glitchPhase > 0) {
      // During active glitch, show the entire text with glitch effect
      return <span data-text={displayText}>{displayText}</span>;
    }

    // Split display into corrupted and uncorrupted parts
    const corruptedPart = displayText.slice(0, corruptedChars);
    const uncorruptedPart = displayText.slice(corruptedChars);

    return (
      <>
        <span className="evil-glitch-permanent" data-text={corruptedPart}>
          {corruptedPart}
        </span>
        <span>{uncorruptedPart}</span>
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
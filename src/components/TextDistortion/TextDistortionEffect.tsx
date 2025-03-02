'use client';

import { useEffect, useState } from 'react';
import distortionConfig from '@/config/distortionConfig';

interface TextDistortionEffectProps {
  enabled?: boolean;
}

export default function TextDistortionEffect({ enabled = true }: TextDistortionEffectProps) {
  const [scanLinePosition, setScanLinePosition] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    if (!enabled || !distortionConfig.enabled) {
      return;
    }
    
    const initTimeout = setTimeout(() => {
      setIsInitialized(true);
    }, 500);
    
    return () => clearTimeout(initTimeout);
  }, [enabled]);
  
  useEffect(() => {
    if (!isInitialized) return;
    
    const trackScanLine = () => {
      const scanLine = document.querySelector('.scan-line') as HTMLElement;
      if (!scanLine) return;
      const rect = scanLine.getBoundingClientRect();
      setScanLinePosition(rect.top + rect.height / 2);
    };
    
    // Simple function to replace text while preserving case
    const replaceTextPreservingCase = (element: Element, oldText: string, newText: string) => {
      const content = element.textContent || '';
      const lowerContent = content.toLowerCase();
      const lowerOld = oldText.toLowerCase();
      const startIndex = lowerContent.indexOf(lowerOld);
      
      if (startIndex === -1) return;
      
      // Get the actual case of the text we're replacing
      const actualOldText = content.substring(startIndex, startIndex + oldText.length);
      let actualNewText = newText;
      
      // Match the case of the original text
      if (actualOldText === actualOldText.toUpperCase()) {
        actualNewText = newText.toUpperCase();
      } else if (actualOldText === actualOldText.toLowerCase()) {
        actualNewText = newText.toLowerCase();
      }
      
      // Create a span for the replacement text with evil glitch effect
      const beforeText = content.substring(0, startIndex);
      const afterText = content.substring(startIndex + oldText.length);
      const glitchSpan = document.createElement('span');
      glitchSpan.textContent = actualNewText;
      // Use data-replacing-count to determine which glitch effect to apply
      const replacingCount = element.getAttribute('data-replacing-count') || '1';
      glitchSpan.className = `evil-glitch-${replacingCount}`;
      glitchSpan.setAttribute('data-text', actualNewText);
      
      // Clear and rebuild the element's content
      element.textContent = '';
      if (beforeText) element.appendChild(document.createTextNode(beforeText));
      element.appendChild(glitchSpan);
      if (afterText) element.appendChild(document.createTextNode(afterText));
    };
    
    const applyDistortion = () => {
      const distortionRange = 40; // pixels above and below scan line
      
      // Find all text nodes that contain "ADMIN"
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            return node.textContent?.toLowerCase().includes('admin') 
              ? NodeFilter.FILTER_ACCEPT 
              : NodeFilter.FILTER_REJECT;
          }
        }
      );
      
      const nodesToProcess = [];
      let node;
      while (node = walker.nextNode()) {
        nodesToProcess.push(node);
      }
      
      nodesToProcess.forEach(node => {
        const element = node.parentElement;
        if (!element) return;
        
        const rect = element.getBoundingClientRect();
        if (rect.height === 0 || rect.width === 0) return;
        
        const elementMidpoint = rect.top + rect.height / 2;
        const distance = Math.abs(scanLinePosition - elementMidpoint);
        
        if (distance < distortionRange) {
          if (!element.hasAttribute('data-replacing')) {
            element.setAttribute('data-replacing', 'true');
            element.setAttribute('data-replacing-count', '1');
            
            // First change to ASHLI with minimal delay
            setTimeout(() => {
              replaceTextPreservingCase(element, 'ADMIN', 'ASHLI');
              
              // Sequence of changes with shorter delays
              setTimeout(() => {
                // Back to ADMIN
                const currentText = element.textContent;
                if (currentText) {
                  element.textContent = currentText.replace('ASHLI', 'ADMIN');
                }
                
                // Wait longer before the second ASHLI
                setTimeout(() => {
                  element.setAttribute('data-replacing-count', '2');
                  replaceTextPreservingCase(element, 'ADMIN', 'ASHLI');
                  
                  // Final change back to ADMIN
                  setTimeout(() => {
                    const finalText = element.textContent;
                    if (finalText) {
                      element.textContent = finalText.replace('ASHLI', 'ADMIN');
                    }
                    element.removeAttribute('data-replacing');
                    element.removeAttribute('data-replacing-count');
                  }, 100); // Second ASHLI duration: 100ms
                }, 850);
              }, 200); // First ASHLI duration: 200ms
            }, 10);
          }
        }
      });
    };
    
    let animationFrameId: number;
    
    const updateAnimation = () => {
      trackScanLine();
      applyDistortion();
      animationFrameId = requestAnimationFrame(updateAnimation);
    };
    
    animationFrameId = requestAnimationFrame(updateAnimation);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      
      // Restore any remaining replacements
      document.querySelectorAll('[data-replacing]').forEach(element => {
        const cleanupText = element.textContent;
        if (cleanupText) {
          element.textContent = cleanupText.replace('ASHLI', 'ADMIN');
        }
        element.removeAttribute('data-replacing');
      });
    };
  }, [isInitialized, scanLinePosition]);
  
  return null;
} 
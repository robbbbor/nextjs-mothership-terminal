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
      
      // Create the new content with the replacement
      const beforeText = content.substring(0, startIndex);
      const afterText = content.substring(startIndex + oldText.length);
      element.textContent = beforeText + actualNewText + afterText;
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
            
            // First change to ASHLI
            replaceTextPreservingCase(element, 'ADMIN', 'ASHLI');
            
            // Sequence of changes with delays (400ms each)
            setTimeout(() => {
              // Back to ADMIN
              replaceTextPreservingCase(element, 'ASHLI', 'ADMIN');
              
              // Wait a bit, then change to ASHLI again
              setTimeout(() => {
                replaceTextPreservingCase(element, 'ADMIN', 'ASHLI');
                
                // Final change back to ADMIN
                setTimeout(() => {
                  replaceTextPreservingCase(element, 'ASHLI', 'ADMIN');
                  element.removeAttribute('data-replacing');
                }, 400);
              }, 400);
            }, 400);
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
        replaceTextPreservingCase(element, 'ASHLI', 'ADMIN');
        element.removeAttribute('data-replacing');
      });
    };
  }, [isInitialized, scanLinePosition]);
  
  return null;
} 
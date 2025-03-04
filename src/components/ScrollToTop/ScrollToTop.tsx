'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    const resetScroll = () => {
      // Force scroll to top with multiple methods
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
      
      document.documentElement.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
      
      if (document.body) {
        document.body.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant'
        });
        document.body.scrollTop = 0;
      }

      // Also set overflow to visible temporarily
      const html = document.documentElement;
      const body = document.body;
      
      if (html && body) {
        const originalHtmlOverflow = html.style.overflow;
        const originalBodyOverflow = body.style.overflow;
        
        html.style.overflow = 'visible';
        body.style.overflow = 'visible';
        
        // Reset back after a brief delay
        setTimeout(() => {
          html.style.overflow = originalHtmlOverflow;
          body.style.overflow = originalBodyOverflow;
        }, 0);
      }
    };

    // Reset scroll immediately
    resetScroll();
    
    // And also after a brief delay to catch any late renders
    setTimeout(resetScroll, 0);
    setTimeout(resetScroll, 100);
  }, [pathname]);

  return null;
} 
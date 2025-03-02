'use client';

import { useEffect, useState } from 'react';
import TextDistortionEffect from './TextDistortionEffect';

export default function ClientDistortion() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  
  // Only render the distortion effect on the client side
  if (!isMounted) return null;
  
  return <TextDistortionEffect />;
} 
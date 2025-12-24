'use client';

import { useInfection } from '@/contexts/InfectionContext';

export function ScanLines() {
  const { isInfected } = useInfection();
  return (
    <>
      <div className="scan-line" />
      <div className={`infection-scan-line ${isInfected ? 'active' : ''}`} />
    </>
  );
} 
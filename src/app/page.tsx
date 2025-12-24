'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to terminal page on load
    router.push('/terminal');
  }, [router]);

  return null;
}

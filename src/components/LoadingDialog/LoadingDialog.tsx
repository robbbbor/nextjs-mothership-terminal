'use client';

import { useState, useEffect } from 'react';
import { useAudio } from '@/hooks/useAudio';

interface LoadingDialogProps {
  onComplete: () => void;
}

export default function LoadingDialog({ onComplete }: LoadingDialogProps) {
  const [message, setMessage] = useState('AUTHENTICATING...');
  const { playSound } = useAudio();

  useEffect(() => {
    // Play initial sound
    playSound('click');
    
    // Sequence timing
    const authTimeout = setTimeout(() => {
      setMessage('ACCESS GRANTED');
      playSound('grant');
      // Wait a moment after showing "ACCESS GRANTED" before completing
      const completeTimeout = setTimeout(() => {
        onComplete();
      }, 1500);
      
      return () => clearTimeout(completeTimeout);
    }, 2000);

    return () => clearTimeout(authTimeout);
  }, [onComplete, playSound]);

  return (
    <div className="login-dialog">
      <div className="dialog-content loading-content">
        <div className={message === 'ACCESS GRANTED' ? 'success-message' : 'loading-message'}>
          {message}
        </div>
        <div className="separator">========</div>
      </div>
    </div>
  );
} 
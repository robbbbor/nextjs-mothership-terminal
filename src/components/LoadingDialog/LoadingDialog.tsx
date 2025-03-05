'use client';

import React, { useEffect, useState } from 'react';

interface LoadingDialogProps {
  onComplete: () => void;
}

export default function LoadingDialog({ onComplete }: LoadingDialogProps) {
  const [message, setMessage] = useState('AUTHENTICATING...');

  const playClickSound = () => {
    const audio = new Audio('/click.mp3');
    audio.volume = 0.8;
    audio.play().catch(error => console.error('Audio play failed:', error));
  };

  const playGrantSound = () => {
    const audio = new Audio('/grant.mp3');
    audio.volume = 0.8;
    audio.play().catch(error => console.error('Audio play failed:', error));
  };

  useEffect(() => {
    // Play initial sound
    playClickSound();
    
    // Sequence timing
    const authTimeout = setTimeout(() => {
      setMessage('ACCESS GRANTED');
      playGrantSound();
      // Wait a moment after showing "ACCESS GRANTED" before completing
      const completeTimeout = setTimeout(() => {
        onComplete();
      }, 1500);
      
      return () => clearTimeout(completeTimeout);
    }, 2000);

    return () => clearTimeout(authTimeout);
  }, [onComplete]);

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
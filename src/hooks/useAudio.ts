import { useEffect } from 'react';
import { audioManager } from '../utils/audioContext';

export function useAudio() {
  useEffect(() => {
    // Initialize audio on component mount
    audioManager.initialize();

    // Cleanup on component unmount
    return () => {
      audioManager.cleanup();
    };
  }, []);

  return {
    playSound: (type: 'click' | 'grant' | 'deny' = 'click') => audioManager.playSound(type)
  };
} 
// Audio context for managing sound effects across the application
const basePath = process.env.NODE_ENV === 'production' ? '/nextjs-mothership-terminal' : '';

class AudioManager {
  private static instance: AudioManager;
  private audioElements: { [key: string]: HTMLAudioElement | null } = {};
  private initialized = false;

  private constructor() {
    if (typeof window !== 'undefined') {
      this.audioElements = {
        click: new Audio(`${basePath}/click.mp3`),
        grant: new Audio(`${basePath}/grant.mp3`),
        deny: new Audio(`${basePath}/deny.mp3`)
      };

      // Set volume for all audio elements
      Object.values(this.audioElements).forEach(audio => {
        if (audio) {
          audio.volume = 0.8;
        }
      });
    }
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  public initialize(): void {
    if (this.initialized) return;
    
    // Preload audio files
    Object.values(this.audioElements).forEach(audio => {
      if (audio) {
        audio.load();
      }
    });

    this.initialized = true;
  }

  public playSound(type: 'click' | 'grant' | 'deny' = 'click'): void {
    try {
      const audio = this.audioElements[type];
      if (audio) {
        audio.currentTime = 0;
        const playPromise = audio.play();
        if (playPromise) {
          playPromise.catch(error => {
            console.warn(`Audio play failed: ${error.message}`);
          });
        }
      }
    } catch (error) {
      console.warn(`Sound playback error: ${error}`);
    }
  }

  public cleanup(): void {
    Object.values(this.audioElements).forEach(audio => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
  }
}

export const audioManager = AudioManager.getInstance(); 
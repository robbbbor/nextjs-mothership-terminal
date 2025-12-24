// Map of sound names to their audio files
const sounds: { [key: string]: string } = {
  click: '/sounds/click.mp3',
  error: '/sounds/error.mp3',
  success: '/sounds/success.mp3',
};

// Function to play a sound by name
export const playSound = (soundName: keyof typeof sounds) => {
  if (typeof window === 'undefined') return; // Don't run on server-side
  
  const audio = new Audio(sounds[soundName]);
  audio.volume = 0.5; // Set volume to 50%
  audio.play().catch(error => {
    console.error('Error playing sound:', error);
  });
}; 
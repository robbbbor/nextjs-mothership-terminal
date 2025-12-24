// Utility to track puzzle completion status
const STORAGE_KEY = 'puzzle_completion';

export interface PuzzleCompletion {
  lifeSupport: boolean;
  pilotControls: boolean;
}

export function getPuzzleCompletion(): PuzzleCompletion {
  if (typeof window === 'undefined') {
    return { lifeSupport: false, pilotControls: false };
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading puzzle completion:', error);
  }
  
  return { lifeSupport: false, pilotControls: false };
}

export function markPuzzleComplete(puzzle: 'lifeSupport' | 'pilotControls'): void {
  if (typeof window === 'undefined') return;
  
  try {
    const completion = getPuzzleCompletion();
    completion[puzzle] = true;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completion));
  } catch (error) {
    console.error('Error saving puzzle completion:', error);
  }
}

export function areBothPuzzlesComplete(): boolean {
  const completion = getPuzzleCompletion();
  return completion.lifeSupport && completion.pilotControls;
}

export function resetPuzzleCompletion(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error resetting puzzle completion:', error);
  }
}


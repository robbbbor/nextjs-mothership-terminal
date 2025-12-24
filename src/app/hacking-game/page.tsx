'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import GlitchText from '@/components/GlitchText/GlitchText';
import { useAudio } from '@/hooks/useAudio';

interface CodeBlock {
  id: number;
  content: string;
  target: string;
  matched: boolean;
}

type GamePhase = 'matching' | 'scrolling' | 'bruteforce';

type LetterResult = 'correct' | 'present-left' | 'present-right' | 'absent';

interface GuessResult {
  word: string;
  result: LetterResult[];
}

export default function HackingGame() {
  const router = useRouter();
  const { playSound } = useAudio();
  const [codeBlocks, setCodeBlocks] = useState<CodeBlock[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<number | null>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [currentPhase, setCurrentPhase] = useState<GamePhase>('matching');
  const [scrollingLines, setScrollingLines] = useState<string[]>([]);
  const [bruteforceInput, setBruteforceInput] = useState('');
  const [guesses, setGuesses] = useState<GuessResult[]>([]);
  const [gameWon, setGameWon] = useState(false);
  const [lockedWords, setLockedWords] = useState<string[]>([]);
  const targetWords = ['control', 'systems'];
  const maxGuesses = 20;
  const scrollRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Generate random hex characters
  const generateRandomHex = () => {
    const hex = Math.floor(Math.random() * 16).toString(16);
    return hex.toUpperCase();
  };

  // Generate a code block with random content
  const generateCodeBlock = (id: number): CodeBlock => {
    const target = generateRandomHex();
    const content = Array(8).fill('').map(() => generateRandomHex()).join('');
    return {
      id,
      content,
      target,
      matched: false
    };
  };

  // Generate fake code lines for scrolling phase
  const generateFakeCodeLine = () => {
    const prefixes = ['access', 'override', 'overwrite', 'initiate', 'execute', 'run'];
    const numbers = ['3-1-7-2', '3-1-7-3', '3-1-7-4', '3-1-7-1', '3-1-7-5', '3-1-7-0'];
    
    // 20% chance to generate the correct code
    if (Math.random() < 0.2) {
      return 'access override 3-1-7-2';
    }
    
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const number = numbers[Math.floor(Math.random() * numbers.length)];
    return `${prefix} ${number}`;
  };

  // Initialize game
  useEffect(() => {
    const initialBlocks = Array(5).fill(null).map((_, index) => generateCodeBlock(index));
    setCodeBlocks(initialBlocks);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0 && !gameComplete && currentPhase === 'matching') {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && currentPhase === 'matching') {
      // Reset the game with new numbers
      const newBlocks = Array(5).fill(null).map((_, index) => generateCodeBlock(index));
      setCodeBlocks(newBlocks);
      setTimeLeft(10);
      setSelectedBlock(null);
      playSound('click');
    }
  }, [timeLeft, gameComplete, currentPhase, playSound]);

  // Handle scrolling phase
  useEffect(() => {
    if (currentPhase === 'scrolling') {
      const interval = setInterval(() => {
        setScrollingLines(prev => {
          const newLines = [...prev, generateFakeCodeLine()];
          if (newLines.length > 20) {
            return newLines.slice(1);
          }
          return newLines;
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [currentPhase]);

  // Handle block selection
  const handleBlockClick = (id: number) => {
    playSound('click');
    setSelectedBlock(id);
  };

  // Handle key press for matching
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (selectedBlock !== null && !gameComplete && currentPhase === 'matching') {
        const key = e.key.toUpperCase();
        const block = codeBlocks.find(b => b.id === selectedBlock);
        
        if (block && key === block.target) {
          playSound('click');
          setCodeBlocks(prev => 
            prev.map(b => 
              b.id === selectedBlock ? { ...b, matched: true } : b
            )
          );
          setSelectedBlock(null);

          // Check if all blocks are matched
          const allMatched = codeBlocks.every(b => 
            b.id === selectedBlock ? true : b.matched
          );
          if (allMatched) {
            setCurrentPhase('scrolling');
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedBlock, codeBlocks, gameComplete, playSound, currentPhase]);

  // Handle scrolling phase click
  const handleScrollingClick = (line: string) => {
    console.log('Clicked line:', line); // Add logging
    if (line.toLowerCase() === 'access override 3-1-7-2') {
      console.log('Correct code clicked!'); // Add logging
      playSound('click');
      setCurrentPhase('bruteforce');
    }
  };

  // Handle bruteforce phase
  const handleBruteforceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bruteforceInput.length === 0) return;

    const currentGuess = bruteforceInput.toLowerCase();
    const results: GuessResult[] = [];
    const newlyLockedWords: string[] = [];

    // Check each target word
    targetWords.forEach(word => {
      // Skip locked words for new guesses
      if (lockedWords.includes(word)) {
        // Keep the last guess for locked words
        const lastGuess = guesses.find(g => g.word === word);
        if (lastGuess) {
          results.push(lastGuess);
        }
        return;
      }

      const result: LetterResult[] = [];
      const presentIndices: number[] = [];
      
      // First pass: mark correct letters
      for (let i = 0; i < 7; i++) {
        if (i >= currentGuess.length) {
          result.push('absent');
          continue;
        }

        if (currentGuess[i] === word[i]) {
          result.push('correct');
        } else {
          result.push('present-left'); // Temporary value, will be updated in second pass
          presentIndices.push(i);
        }
      }

      // Second pass: check if present letters are in the word
      presentIndices.forEach(i => {
        const letter = currentGuess[i];
        if (!word.includes(letter)) {
          result[i] = 'absent';
        } else {
          // Find the correct position of the letter
          const correctPos = word.indexOf(letter);
          result[i] = correctPos < i ? 'present-left' : 'present-right';
        }
      });

      results.push({ word: currentGuess, result });

      // If all letters are correct, mark this word to be locked
      if (result.every(r => r === 'correct')) {
        newlyLockedWords.push(word);
      }
    });

    // Update locked words
    const updatedLockedWords = [...lockedWords, ...newlyLockedWords];
    
    setGuesses(prev => {
      const newGuesses = [...prev, ...results];
      
      // Check if all words are locked (win condition)
      const allLocked = targetWords.every(word => updatedLockedWords.includes(word));
      
      if (allLocked) {
        setLockedWords(updatedLockedWords);
        setGameWon(true);
        setBruteforceInput('');
        return newGuesses;
      }
      
      // Check if we've reached max guesses
      const guessCount = Math.floor(newGuesses.length / 2);
      
      // If we've reached max guesses and haven't won, reset
      if (guessCount >= maxGuesses) {
        setLockedWords([]);
        setBruteforceInput('');
        return [];
      }
      
      // Normal case: update locked words and continue
      setLockedWords(updatedLockedWords);
      setBruteforceInput('');
      return newGuesses;
    });
  };

  if (gameComplete && currentPhase === 'matching') {
    return (
      <div className="hacking-game complete">
        <div className="glitch-text-container">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="glitch-text" style={{ 
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`
            }}>
              <GlitchText>HACK FAILED</GlitchText>
            </div>
          ))}
        </div>
        <button
          className="return-button"
          onMouseEnter={() => playSound('click')}
          onClick={() => {
            playSound('click');
            router.push('/');
          }}
        >
          <GlitchText>RETURN</GlitchText>
        </button>
      </div>
    );
  }

  if (currentPhase === 'scrolling') {
    return (
      <div className="hacking-game scrolling">
        <div className="scrolling-header">
          <GlitchText>TO INITIATE OVERRIDE, SELECT "ACCESS OVERRIDE 3-1-7-2"</GlitchText>
        </div>
        <div className="scrolling-container" ref={scrollContainerRef}>
          {scrollingLines.map((line, index) => (
            <div
              key={index}
              className={`scrolling-line ${index % 2 === 0 ? 'red' : 'green'}`}
              onClick={() => handleScrollingClick(line)}
            >
              {line}
            </div>
          ))}
        </div>
        <style jsx>{`
          .hacking-game.scrolling {
            min-height: 100vh;
            background: #000;
            color: #ff4444;
            font-family: "Glass TTY VT220", "VT323", monospace;
            padding: 2rem;
            display: flex;
            flex-direction: column;
            align-items: center;
            overflow: hidden;
          }

          .scrolling-header {
            position: fixed;
            top: 2rem;
            left: 50%;
            transform: translateX(-50%);
            text-align: center;
            z-index: 10;
            font-size: 2rem;
            text-shadow: 0 0 10px #ff4444;
          }

          .scrolling-container {
            margin-top: 5rem;
            height: calc(100vh - 10rem);
            overflow-y: auto;
            width: 100%;
            max-width: 800px;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }

          .scrolling-line {
            padding: 0.5rem;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 1.2rem;
          }

          .scrolling-line.red {
            color: #ff4444;
            text-shadow: 0 0 5px #ff4444;
          }

          .scrolling-line.green {
            color: #00ff00;
            text-shadow: 0 0 5px #00ff00;
          }

          .scrolling-line:hover {
            background: rgba(255, 68, 68, 0.1);
          }

          .scrolling-line.red:hover {
            text-shadow: 0 0 10px #ff4444;
          }

          .scrolling-line.green:hover {
            text-shadow: 0 0 10px #00ff00;
          }
        `}</style>
      </div>
    );
  }

  if (currentPhase === 'bruteforce') {
    return (
      <div className="hacking-game bruteforce">
        <div className="bruteforce-header">
          <GlitchText>UNKNOWN COMMAND REQUIRED TO CONTINUE. </GlitchText>
          <div className="guess-count">Guesses remaining: {maxGuesses - Math.floor(guesses.length / 2)}</div>
        </div>
        
        <div className="word-grid">
          {Array(maxGuesses).fill(null).map((_, rowIndex) => (
            <div key={rowIndex} className="word-row">
              {Array(2).fill(null).map((_, colIndex) => {
                const word = targetWords[colIndex];
                const isLocked = lockedWords.includes(word);
                const guess = guesses[rowIndex * 2 + colIndex];
                
                return (
                  <div key={colIndex} className={`word-boxes ${isLocked ? 'locked' : ''}`}>
                    {Array(7).fill(null).map((_, letterIndex) => {
                      const letter = guess?.word[letterIndex] || '';
                      const result = guess?.result[letterIndex];
                      
                      return (
                        <div 
                          key={letterIndex} 
                          className={`letter-box ${result || ''} ${isLocked ? 'locked' : ''}`}
                        >
                          {letter}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <form onSubmit={handleBruteforceSubmit} className="bruteforce-form">
          <input
            type="text"
            value={bruteforceInput}
            onChange={(e) => setBruteforceInput(e.target.value.slice(0, 7))}
            autoFocus
            placeholder="Enter 7-letter word..."
            maxLength={7}
            disabled={gameWon || lockedWords.length === targetWords.length}
          />
        </form>

        {lockedWords.length === targetWords.length && (
          <div className="success-message">
            <GlitchText>SYSTEM CONTROL NOW ACCESSIBLE</GlitchText>
            <button
              className="access-button"
              onClick={() => {
                playSound('click');
                router.push('/systems-overview');
              }}
            >
              <GlitchText>ACCESS SYSTEMS OVERVIEW</GlitchText>
            </button>
          </div>
        )}

        <style jsx>{`
          .hacking-game.bruteforce {
            min-height: 100vh;
            background: #000;
            color: #ff4444;
            font-family: "Glass TTY VT220", "VT323", monospace;
            padding: 2rem;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .bruteforce-header {
            text-align: center;
            margin-bottom: 2rem;
            font-size: 2rem;
            text-shadow: 0 0 10px #ff4444;
          }

          .guess-count {
            font-size: 1.5rem;
            margin-top: 1rem;
            color: #00ff00;
            text-shadow: 0 0 5px #00ff00;
          }

          .word-grid {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            margin-bottom: 2rem;
          }

          .word-row {
            display: flex;
            gap: 2rem;
            justify-content: center;
          }

          .word-boxes {
            display: flex;
            gap: 0.5rem;
          }

          .letter-box {
            width: 2.5rem;
            height: 2.5rem;
            border: 2px solid #ff4444;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.2rem;
            text-transform: uppercase;
            background: rgba(255, 68, 68, 0.1);
            position: relative;
          }

          .letter-box.correct {
            background: rgba(0, 255, 0, 0.2);
            border-color: #00ff00;
          }

          .letter-box.present-left,
          .letter-box.present-right {
            background: rgba(255, 255, 0, 0.2);
            border-color: #ffff00;
          }

          .letter-box.absent {
            background: rgba(255, 68, 68, 0.2);
            border-color: #ff4444;
          }

          .direction-indicator {
            position: absolute;
            font-size: 1.2rem;
            color: #ffff00;
            text-shadow: 0 0 8px #ffff00;
            font-weight: bold;
          }

          .letter-box.present-left .direction-indicator {
            left: -0.8rem;
          }

          .letter-box.present-right .direction-indicator {
            right: -0.8rem;
          }

          .bruteforce-form {
            width: 100%;
            max-width: 800px;
          }

          input {
            width: 100%;
            background: transparent;
            border: 1px solid #ff4444;
            color: #ff4444;
            font-family: inherit;
            font-size: 1.5rem;
            padding: 1rem;
            outline: none;
            text-shadow: 0 0 5px #ff4444;
            text-transform: uppercase;
          }

          input:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          input::placeholder {
            color: rgba(255, 68, 68, 0.5);
          }

          .word-boxes.locked {
            opacity: 0.7;
          }
          .letter-box.locked {
            background: rgba(0, 255, 0, 0.3);
            border-color: #00ff00;
          }

          .success-message {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 2rem;
            z-index: 1000;
          }

          .access-button {
            background: none;
            border: 2px solid #00ff00;
            color: #00ff00;
            padding: 1rem 2rem;
            font-size: 1.2rem;
            cursor: pointer;
            transition: all 0.3s ease;
            font-family: inherit;
          }

          .access-button:hover {
            background: rgba(0, 255, 0, 0.1);
            box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="hacking-game">
      <div className="game-header">
        <GlitchText>HACKING TERMINAL</GlitchText>
      </div>
      
      <div className="timer-container">
        <div className="timer">Time: {timeLeft}s</div>
      </div>

      <div className="code-container">
        {codeBlocks.map((block, index) => (
          <div
            key={block.id}
            ref={el => { scrollRefs.current[index] = el; }}
            className={`code-block ${selectedBlock === block.id ? 'selected' : ''} ${block.matched ? 'matched' : ''}`}
            onClick={() => handleBlockClick(block.id)}
          >
            <div className="code-content">{block.content}</div>
            <div className="target">{block.target}</div>
          </div>
        ))}
      </div>

      <div className="instructions">
        <GlitchText>Click the number string and use the keyboard to press the corresponding key</GlitchText>
      </div>

      <style jsx>{`
        .hacking-game {
          min-height: 100vh;
          background: #000;
          color: #ff4444;
          font-family: "Glass TTY VT220", "VT323", monospace;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
        }

        .game-header {
          display: flex;
          justify-content: center;
          width: 100%;
          margin-bottom: 2rem;
          font-size: 2rem;
        }

        .timer-container {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1000;
          pointer-events: none;
        }

        .timer {
          color: #ff4444;
          text-shadow: 0 0 30px #ff4444;
          animation: blink 1s infinite;
          font-size: 4rem;
          font-weight: bold;
          opacity: 1;
          text-align: center;
        }

        @keyframes blink {
          0% {
            opacity: 1;
            text-shadow: 0 0 30px #ff4444, 0 0 60px #ff4444;
          }
          50% {
            opacity: 0.8;
            text-shadow: 0 0 40px #ff4444, 0 0 80px #ff4444;
          }
          100% {
            opacity: 1;
            text-shadow: 0 0 30px #ff4444, 0 0 60px #ff4444;
          }
        }

        .code-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
          max-width: 800px;
        }

        .code-block {
          background: rgba(255, 68, 68, 0.1);
          border: 1px solid #ff4444;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .code-block:hover {
          background: rgba(255, 68, 68, 0.2);
        }

        .code-block.selected {
          background: rgba(255, 68, 68, 0.3);
          border-color: #00ff00;
          box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
        }

        .code-block.matched {
          background: rgba(0, 255, 0, 0.1);
          border-color: #00ff00;
        }

        .code-content {
          font-size: 1.5rem;
          letter-spacing: 0.2em;
          margin-bottom: 0.5rem;
        }

        .target {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          font-size: 2rem;
          color: #00ff00;
          text-shadow: 0 0 10px #00ff00;
        }

        .instructions {
          margin-top: 2rem;
          font-size: 1.2rem;
          text-align: center;
        }

        .complete {
          position: relative;
          overflow: hidden;
        }

        .glitch-text-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .glitch-text {
          position: absolute;
          color: #ff4444;
          font-size: 2rem;
          text-shadow: 0 0 10px #ff4444;
          animation: glitch 0.3s infinite;
          opacity: 0.7;
        }

        .return-button {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: none;
          border: none;
          color: #ff4444;
          font-size: 4rem;
          cursor: pointer;
          font-family: inherit;
          text-transform: uppercase;
          text-shadow: 0 0 20px #ff4444;
          animation: glitch 0.3s infinite;
          z-index: 1;
          padding: 1rem 2rem;
          transition: all 0.3s ease;
        }

        .return-button:hover {
          transform: translate(-50%, -50%) scale(1.1);
          text-shadow: 0 0 30px #ff4444;
        }

        @keyframes glitch {
          0% {
            text-shadow: 0.05em 0 0 #ff4444, -0.05em -0.025em 0 #00ff00;
          }
          14% {
            text-shadow: 0.05em 0 0 #ff4444, -0.05em -0.025em 0 #00ff00;
          }
          15% {
            text-shadow: -0.05em -0.025em 0 #ff4444, 0.025em 0.025em 0 #00ff00;
          }
          49% {
            text-shadow: -0.05em -0.025em 0 #ff4444, 0.025em 0.025em 0 #00ff00;
          }
          50% {
            text-shadow: 0.025em 0.05em 0 #ff4444, 0.05em 0 0 #00ff00;
          }
          99% {
            text-shadow: 0.025em 0.05em 0 #ff4444, 0.05em 0 0 #00ff00;
          }
          100% {
            text-shadow: -0.025em 0 0 #ff4444, -0.025em -0.025em 0 #00ff00;
          }
        }
      `}</style>
    </div>
  );
} 
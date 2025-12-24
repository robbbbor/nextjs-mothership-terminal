"use client";

import React, { useState } from 'react';
import LifeSupportPuzzle from '@/components/LifeSupportPuzzle/LifeSupportPuzzle';
import GlitchText from '@/components/GlitchText/GlitchText';
import { useAudio } from '@/hooks/useAudio';

export default function LifeSupportPage() {
  const { playSound } = useAudio();
  const [showWarning, setShowWarning] = useState(true);
  const [understood, setUnderstood] = useState(false);

  const handleAgree = () => {
    if (understood) {
      playSound('click');
      setShowWarning(false);
    }
  };

  return (
    <div className="life-support-page">
      {showWarning && (
        <div className="warning-dialog">
          <div className="warning-content">
            <GlitchText>WARNING</GlitchText>
            <p>Do not attempt to access life support systems without proper certifications.</p>
             <div className="checkbox-container">
              <input
                type="checkbox"
                id="understood"
                checked={understood}
                onChange={(e) => {
                  playSound('click');
                  setUnderstood(e.target.checked);
                }}
              />
              <label htmlFor="understood">I have read and understood the warning</label>
            </div>
            <button
              className="agree-button"
              onClick={handleAgree}
              disabled={!understood}
            >
              <GlitchText>I Agree</GlitchText>
            </button>
          </div>
        </div>
      )}

      {!showWarning && (
        <>
          <div className="page-header">
            <GlitchText>LIFE SUPPORT SYSTEMS</GlitchText>
          </div>
          
          <div className="emergency-warning">
            <GlitchText>WARNING: LIFE SUPPORT SYSTEMS UNSTABLE - IMMEDIATE RECALIBRATION REQUIRED</GlitchText>
          </div>
          
          <LifeSupportPuzzle />
        </>
      )}
      
      <style jsx>{`
        .life-support-page {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
          color: #44ff44;
          margin: 0;
          padding: 1rem;
          background-color: #000;
        }

        .warning-dialog {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .warning-content {
          background: rgba(0, 0, 0, 0.95);
          border: 2px solid #44ff44;
          padding: 2rem;
          max-width: 600px;
          text-align: center;
          box-shadow: 0 0 20px rgba(68, 255, 68, 0.3);
          color: #44ff44;
        }

        .warning-content p {
          margin: 1rem 0;
          font-size: 1.2rem;
          line-height: 1.5;
        }

        .checkbox-container {
          margin: 2rem 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        input[type="checkbox"] {
          width: 20px;
          height: 20px;
          accent-color: #44ff44;
        }

        .agree-button {
          background: none;
          border: 2px solid #44ff44;
          color: #44ff44;
          padding: 1rem 2rem;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .agree-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .agree-button:not(:disabled):hover {
          background: rgba(68, 255, 68, 0.1);
          box-shadow: 0 0 10px rgba(68, 255, 68, 0.5);
        }
        
        .page-header {
          text-align: center;
          margin-bottom: 1rem;
          color: #44ff44;
          text-shadow: 0 0 8px rgba(68, 255, 68, 0.8);
          position: relative;
          font-size: 2rem;
        }
        
        .emergency-warning {
          background: rgba(255, 68, 68, 0.1);
          border: 2px solid #ff4444;
          padding: 1rem;
          margin: 1rem auto;
          max-width: 800px;
          text-align: center;
          animation: pulse-warning 2s infinite;
          color: #ff4444;
          text-shadow: 0 0 8px rgba(255, 68, 68, 0.8);
          position: relative;
          font-size: 1.4rem;
        }
        
        @keyframes pulse-warning {
          0% {
            box-shadow: 0 0 10px rgba(255, 68, 68, 0.5);
            text-shadow: 0 0 8px rgba(255, 68, 68, 0.8);
          }
          50% {
            box-shadow: 0 0 20px rgba(255, 68, 68, 0.8);
            text-shadow: 0 0 12px rgba(255, 68, 68, 1);
          }
          100% {
            box-shadow: 0 0 10px rgba(255, 68, 68, 0.5);
            text-shadow: 0 0 8px rgba(255, 68, 68, 0.8);
          }
        }
      `}</style>
    </div>
  );
} 
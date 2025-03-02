'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import TerminalInterface from '../Terminal/TerminalInterface';

export default function LifeSupportPage() {
  const [oxygenLevel, setOxygenLevel] = useState(78);
  const [nitrogenLevel, setNitrogenLevel] = useState(21);
  const [otherGasesLevel, setOtherGasesLevel] = useState(1);
  const [gravity, setGravity] = useState(1.0);
  const [pressure, setPressure] = useState(101.3);
  const [temperature, setTemperature] = useState(21.5);

  const playSound = () => {
    const audio = new Audio('/sounds/click.mp3');
    audio.volume = 0.8;
    audio.play().catch(error => console.error('Audio play failed:', error));
  };

  // Function to generate a random value within a range
  const getRandomValue = (min: number, max: number, precision: number = 0) => {
    const value = Math.random() * (max - min) + min;
    return Number(value.toFixed(precision));
  };

  // Update values periodically to simulate fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      // Update oxygen with more fluctuation
      const newOxygen = getRandomValue(76, 80, 1);
      
      // Only update nitrogen occasionally (5% chance)
      if (Math.random() < 0.05) {
        const newNitrogen = getRandomValue(20, 22, 1);
        setNitrogenLevel(newNitrogen);
        
        // Adjust other gases to ensure total is 100%
        const total = newOxygen + newNitrogen;
        if (total < 100) {
          setOtherGasesLevel(Number((100 - total).toFixed(1)));
        } else {
          // If rounding causes total to exceed 100, adjust oxygen
          setOxygenLevel(Number((100 - newNitrogen - otherGasesLevel).toFixed(1)));
          return;
        }
      }
      
      setOxygenLevel(newOxygen);
      setGravity(getRandomValue(0.98, 1.02, 2));
      setPressure(getRandomValue(101.1, 101.5, 1));
      setTemperature(getRandomValue(21.0, 22.0, 1));
    }, 2000);

    return () => clearInterval(interval);
  }, [otherGasesLevel]);

  const handleSystemClick = () => {
    if (selectedSystem) {
      setSelectedSystem(null);
    }
  };

  return (
    <div className="main-menu">
      <h1 className="menu-title">Life Support Systems</h1>
      <div className="separator">========</div>
      
      <div className="life-support-grid">
        <div className="support-section">
          <h2 className="section-title">Atmospheric Composition</h2>
          <div className="gas-levels">
            <div className="gas-item">
              <span className="gas-name">Oxygen:</span>
              <span className="gas-value">{oxygenLevel}%</span>
            </div>
            <div className="gas-item">
              <span className="gas-name">Nitrogen:</span>
              <span className="gas-value">{nitrogenLevel}%</span>
            </div>
            <div className="gas-item">
              <span className="gas-name">Other Gases:</span>
              <span className="gas-value">{otherGasesLevel}%</span>
            </div>
          </div>
        </div>
        
        <div className="support-section">
          <h2 className="section-title">Environmental Controls</h2>
          <div className="env-controls">
            <div className="env-item">
              <span className="env-name">Gravity:</span>
              <span className="env-value">{gravity} G</span>
            </div>
            <div className="env-item">
              <span className="env-name">Pressure:</span>
              <span className="env-value">{pressure} kPa</span>
            </div>
            <div className="env-item">
              <span className="env-name">Temperature:</span>
              <span className="env-value">{temperature}°C</span>
            </div>
          </div>
        </div>
      </div>
      
      <Link
        href="/ship-info"
        className="menu-item back-button"
        onMouseEnter={playSound}
        onClick={(e) => {
          playSound();
        }}
      >
        BACK TO SHIP INFO
      </Link>

      <TerminalInterface />
    </div>
  );
} 
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import TerminalInterface from '../Terminal/TerminalInterface';
import GlitchText from '../GlitchText/GlitchText';

export default function LifeSupportPage() {
  const [oxygenLevel, setOxygenLevel] = useState(78);
  const [nitrogenLevel, setNitrogenLevel] = useState(21);
  const [otherGasesLevel, setOtherGasesLevel] = useState(1);
  const [gravity, setGravity] = useState(1.0);
  const [pressure, setPressure] = useState(101.3);
  const [temperature, setTemperature] = useState(21.5);

  const playSound = () => {
    const audio = new Audio('/click.mp3');
    audio.volume = 0.8;
    audio.play().catch(error => console.error('Audio play failed:', error));
  };

  // Function to generate a random value within a range
  const getRandomValue = (min: number, max: number, precision: number = 0) => {
    const value = Math.random() * (max - min) + min;
    return Number(value.toFixed(precision));
  };

  // Function to get a small random change (-0.1, 0, or 0.1)
  const getSmallChange = () => {
    const random = Math.random();
    if (random < 0.33) return -0.1;
    if (random < 0.66) return 0;
    return 0.1;
  };

  // Update values periodically to simulate fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      // Calculate new oxygen value with small change
      const oxygenChange = getSmallChange();
      const newOxygen = Number((oxygenLevel + oxygenChange).toFixed(1));
      
      // Calculate new nitrogen value with small change
      const nitrogenChange = getSmallChange();
      const newNitrogen = Number((nitrogenLevel + nitrogenChange).toFixed(1));
      
      // Calculate other gases to ensure total is exactly 100%
      const otherGases = Number((100 - newOxygen - newNitrogen).toFixed(1));
      
      // Only update if values are within acceptable ranges
      if (newOxygen >= 77.5 && newOxygen <= 78.5 &&
          newNitrogen >= 20.5 && newNitrogen <= 21.5 &&
          otherGases >= 0 && otherGases <= 2) {
        setOxygenLevel(newOxygen);
        setNitrogenLevel(newNitrogen);
        setOtherGasesLevel(otherGases);
      }

      // Update other environmental values
      setGravity(getRandomValue(0.98, 1.02, 2));
      setPressure(getRandomValue(101.1, 101.5, 1));
      setTemperature(getRandomValue(21.0, 22.0, 1));
    }, 2000);

    return () => clearInterval(interval);
  }, [oxygenLevel, nitrogenLevel]);

  return (
    <div className="main-menu">
      <h1 className="menu-title"><GlitchText>Life Support Systems</GlitchText></h1>
      <div className="separator">========</div>
      
      <div className="life-support-grid">
        <div className="support-section">
          <h2 className="section-title"><GlitchText>Atmospheric Composition</GlitchText></h2>
          <div className="gas-levels">
            <div className="gas-item">
              <span className="gas-name"><GlitchText>Oxygen:</GlitchText></span>
              <span className="gas-value"><GlitchText>{oxygenLevel}%</GlitchText></span>
            </div>
            <div className="gas-item">
              <span className="gas-name"><GlitchText>Nitrogen:</GlitchText></span>
              <span className="gas-value"><GlitchText>{nitrogenLevel}%</GlitchText></span>
            </div>
            <div className="gas-item">
              <span className="gas-name"><GlitchText>Other Gases:</GlitchText></span>
              <span className="gas-value"><GlitchText>{otherGasesLevel}%</GlitchText></span>
            </div>
          </div>
        </div>
        
        <div className="support-section">
          <h2 className="section-title"><GlitchText>Environmental Controls</GlitchText></h2>
          <div className="env-controls">
            <div className="env-item">
              <span className="env-name"><GlitchText>Gravity:</GlitchText></span>
              <span className="env-value"><GlitchText>{gravity} G</GlitchText></span>
            </div>
            <div className="env-item">
              <span className="env-name"><GlitchText>Pressure:</GlitchText></span>
              <span className="env-value"><GlitchText>{pressure} kPa</GlitchText></span>
            </div>
            <div className="env-item">
              <span className="env-name"><GlitchText>Temperature:</GlitchText></span>
              <span className="env-value"><GlitchText>{temperature}°C</GlitchText></span>
            </div>
          </div>
        </div>
      </div>
      
      <Link
        href="/ship-info"
        className="menu-item back-button"
        onMouseEnter={playSound}
        onClick={playSound}
      >
        <GlitchText>BACK TO SHIP INFO</GlitchText>
      </Link>

      <TerminalInterface />
    </div>
  );
} 
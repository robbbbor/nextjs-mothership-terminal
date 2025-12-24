"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GlitchText from '@/components/GlitchText/GlitchText';
import { useAudio } from '@/hooks/useAudio';
import { markPuzzleComplete, areBothPuzzlesComplete } from '@/utils/puzzleCompletion';

// Define parameter ranges
const NORMAL_RANGES = {
  oxygen: { min: 19, max: 22 },
  nitrogen: { min: 76, max: 80 },
  otherGases: { min: 0.5, max: 2 },
  pressure: { min: 99, max: 103 },
  temperature: { min: 19, max: 23 },
  gravity: { min: 0.9, max: 1.1 }
};

// Starting conditions
const INITIAL_VALUES = {
  oxygen: 16,
  nitrogen: 70,
  otherGases: 14,
  pressure: 94,
  temperature: 17,
  gravity: 0.85
};

export default function LifeSupportPuzzle() {
  const router = useRouter();
  const { playSound } = useAudio();
  
  // State for all control values
  const [oxygen, setOxygen] = useState(INITIAL_VALUES.oxygen);
  const [nitrogen, setNitrogen] = useState(INITIAL_VALUES.nitrogen);
  const [otherGases, setOtherGases] = useState(INITIAL_VALUES.otherGases);
  const [pressure, setPressure] = useState(INITIAL_VALUES.pressure);
  const [temperature, setTemperature] = useState(INITIAL_VALUES.temperature);
  const [gravity, setGravity] = useState(INITIAL_VALUES.gravity);
  
  // Game state
  const [showInstructions, setShowInstructions] = useState(true);
  const [gameWon, setGameWon] = useState(false);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [timer, setTimer] = useState(300); // 5 minute countdown
  const [timerActive, setTimerActive] = useState(false);
  
  // Helper function to get status color
  const getStatusColor = (value: number, range: { min: number, max: number }) => {
    if (value < range.min * 0.8 || value > range.max * 1.2) return "#ff4444"; // Red - danger
    if (value < range.min || value > range.max) return "#ffff44"; // Yellow - warning
    return "#44ff44"; // Green - normal
  };
  
  // Adjust gas percentages and ensure they sum to 100%
  const adjustOxygen = (newValue: number) => {
    playSound('click');
    
    // Calculate how much the oxygen changes
    const delta = newValue - oxygen;
    
    // If increasing oxygen, decrease nitrogen and otherGases proportionally
    if (delta > 0) {
      const totalOther = nitrogen + otherGases;
      if (totalOther <= delta) return; // Cannot adjust if other gases would go below 0
      
      const nitrogenRatio = nitrogen / totalOther;
      const otherGasesRatio = otherGases / totalOther;
      
      setNitrogen(prev => Math.max(0, prev - delta * nitrogenRatio));
      setOtherGases(prev => Math.max(0, prev - delta * otherGasesRatio));
    } else {
      // If decreasing oxygen, increase nitrogen and otherGases proportionally
      const nitrogenRatio = nitrogen / (nitrogen + otherGases);
      const otherGasesRatio = otherGases / (nitrogen + otherGases);
      
      setNitrogen(prev => prev - delta * nitrogenRatio);
      setOtherGases(prev => prev - delta * otherGasesRatio);
    }
    
    setOxygen(newValue);
    
    // Adjust pressure and temperature based on change in gas composition
    setPressure(prev => prev + (delta * 0.2));
    setTemperature(prev => prev + (delta * 0.1));
  };
  
  const adjustNitrogen = (newValue: number) => {
    playSound('click');
    
    // Calculate how much the nitrogen changes
    const delta = newValue - nitrogen;
    
    // If increasing nitrogen, decrease oxygen and otherGases proportionally
    if (delta > 0) {
      const totalOther = oxygen + otherGases;
      if (totalOther <= delta) return; // Cannot adjust if other gases would go below 0
      
      const oxygenRatio = oxygen / totalOther;
      const otherGasesRatio = otherGases / totalOther;
      
      setOxygen(prev => Math.max(0, prev - delta * oxygenRatio));
      setOtherGases(prev => Math.max(0, prev - delta * otherGasesRatio));
    } else {
      // If decreasing nitrogen, increase oxygen and otherGases proportionally
      const oxygenRatio = oxygen / (oxygen + otherGases);
      const otherGasesRatio = otherGases / (oxygen + otherGases);
      
      setOxygen(prev => prev - delta * oxygenRatio);
      setOtherGases(prev => prev - delta * otherGasesRatio);
    }
    
    setNitrogen(newValue);
    
    // Adjust pressure and temperature based on change in gas composition
    setPressure(prev => prev + (delta * 0.1));
    setTemperature(prev => prev + (delta * 0.05));
  };
  
  const adjustOtherGases = (newValue: number) => {
    playSound('click');
    
    // Calculate how much the other gases change
    const delta = newValue - otherGases;
    
    // If increasing other gases, decrease oxygen and nitrogen proportionally
    if (delta > 0) {
      const totalOther = oxygen + nitrogen;
      if (totalOther <= delta) return; // Cannot adjust if other gases would go below 0
      
      const oxygenRatio = oxygen / totalOther;
      const nitrogenRatio = nitrogen / totalOther;
      
      setOxygen(prev => Math.max(0, prev - delta * oxygenRatio));
      setNitrogen(prev => Math.max(0, prev - delta * nitrogenRatio));
    } else {
      // If decreasing other gases, increase oxygen and nitrogen proportionally
      const oxygenRatio = oxygen / (oxygen + nitrogen);
      const nitrogenRatio = nitrogen / (oxygen + nitrogen);
      
      setOxygen(prev => prev - delta * oxygenRatio);
      setNitrogen(prev => prev - delta * nitrogenRatio);
    }
    
    setOtherGases(newValue);
    
    // Adjust pressure and temperature based on change in gas composition
    setPressure(prev => prev + (delta * 0.3));
    setTemperature(prev => prev + (delta * 0.15));
  };
  
  // Direct control adjustments
  const adjustPressure = (newValue: number) => {
    playSound('click');
    setPressure(newValue);
    
    // Pressure affects temperature
    const pressureDelta = newValue - pressure;
    const temperatureChange = pressureDelta * 0.2; // 20% relationship
    setTemperature(prev => Math.max(10, Math.min(30, prev + temperatureChange)));
  };
  
  const adjustTemperature = (newValue: number) => {
    playSound('click');
    setTemperature(newValue);
    
    // Temperature affects pressure
    const temperatureDelta = newValue - temperature;
    const pressureChange = temperatureDelta * 0.3; // 30% relationship
    setPressure(prev => Math.max(80, Math.min(120, prev + pressureChange)));
  };
  
  const adjustGravity = (newValue: number) => {
    playSound('click');
    setGravity(newValue);
    
    // Calculate gravity change and its magnitude
    const gravityDelta = newValue - gravity;
    const gravityMagnitude = Math.abs(gravityDelta);
    const baseMultiplier = 25; // Massively increased from 12 for extreme effects
    
    // Function to redistribute gases with more predictable behavior
    const redistributeGases = () => {
      // Determine direction of change based on gravity
      const gravityEffect = gravityDelta > 0 ? 1 : -1;
      
      // Calculate base change amount for gases with aggressive exponential scaling
      const baseChange = gravityMagnitude * baseMultiplier;
      
      // Super aggressive exponential scaling for massive effect at higher gravity
      const gravityScale = Math.pow(1 + gravityMagnitude, 2.5); // Increased power from 1.5 to 2.5
      
      // Higher gravity increases other gases with extreme intensity
      const otherGasesChange = baseChange * gravityEffect * 4.0 * gravityScale; // Doubled from 2.0 to 4.0
      const oxygenChange = -baseChange * gravityEffect * 2.5 * gravityScale; // More than doubled from 1.2 to 2.5
      const nitrogenChange = -baseChange * gravityEffect * 1.5 * gravityScale; // Nearly doubled from 0.8 to 1.5
      
      // Calculate new gas values with limits
      let newOxygen = Math.max(5, Math.min(30, oxygen + oxygenChange));
      let newNitrogen = Math.max(60, Math.min(90, nitrogen + nitrogenChange));
      let newOtherGases = Math.max(0.5, Math.min(20, otherGases + otherGasesChange));
      
      // Ensure total is 100%
      const total = newOxygen + newNitrogen + newOtherGases;
      const scaleFactor = 100 / total;
      
      newOxygen *= scaleFactor;
      newNitrogen *= scaleFactor;
      newOtherGases *= scaleFactor;
      
      // Apply minimum bounds after scaling
      newOxygen = Math.max(5, newOxygen);
      newNitrogen = Math.max(60, newNitrogen);
      newOtherGases = Math.max(0.5, newOtherGases);
      
      // Final adjustment to ensure exactly 100%
      const finalTotal = newOxygen + newNitrogen + newOtherGases;
      if (finalTotal !== 100) {
        // Adjust nitrogen to maintain total
        newNitrogen += (100 - finalTotal);
      }
      
      // Set new values
      setOxygen(newOxygen);
      setNitrogen(newNitrogen);
      setOtherGases(newOtherGases);
      
      // Add cascading extreme effects for any gravity change
      setTimeout(() => {
        // Extreme boost to other gases
        const extraOtherGases = Math.min(20, newOtherGases * 1.5); // 50% boost instead of 20%
        const remainingGases = 100 - extraOtherGases;
        const extraOxygen = Math.max(5, remainingGases * (newOxygen / (newOxygen + newNitrogen)));
        const extraNitrogen = 100 - extraOtherGases - extraOxygen;
        
        setOtherGases(extraOtherGases);
        setOxygen(extraOxygen);
        setNitrogen(extraNitrogen);
        
        // Add another extreme boost after a short delay
        setTimeout(() => {
          const finalOtherGases = Math.min(20, extraOtherGases * 1.3);
          const finalRemainingGases = 100 - finalOtherGases;
          const finalOxygen = Math.max(5, finalRemainingGases * (extraOxygen / (extraOxygen + extraNitrogen)));
          const finalNitrogen = 100 - finalOtherGases - finalOxygen;
          
          setOtherGases(finalOtherGases);
          setOxygen(finalOxygen);
          setNitrogen(finalNitrogen);
        }, 100);
      }, 150);
    };
    
    // Initial gas redistribution
    redistributeGases();
    
    // Apply extreme pressure and temperature changes with aggressive exponential scaling
    setPressure(prev => {
      const pressureChange = gravityMagnitude * baseMultiplier * 5.0 * Math.pow(1 + gravityMagnitude, 2.0);
      return Math.max(80, Math.min(120, prev + (gravityDelta > 0 ? pressureChange : -pressureChange)));
    });
    
    setTemperature(prev => {
      const tempChange = gravityMagnitude * baseMultiplier * 4.0 * Math.pow(1 + gravityMagnitude, 2.0);
      return Math.max(10, Math.min(30, prev + (gravityDelta > 0 ? tempChange : -tempChange)));
    });
    
    // Secondary effects with delay - massive cascade
    setTimeout(() => {
      redistributeGases();
      
      // Additional extreme environmental changes
      setPressure(prev => {
        const pressureChange = gravityMagnitude * baseMultiplier * 3.0 * Math.pow(1 + gravityMagnitude, 1.8);
        return Math.max(80, Math.min(120, prev + (gravityDelta > 0 ? pressureChange : -pressureChange)));
      });
      
      setTemperature(prev => {
        const tempChange = gravityMagnitude * baseMultiplier * 2.5 * Math.pow(1 + gravityMagnitude, 1.8);
        return Math.max(10, Math.min(30, prev + (gravityDelta > 0 ? tempChange : -tempChange)));
      });
    }, 300);
    
    // Tertiary effects with longer delay - final extreme adjustment
    setTimeout(() => {
      redistributeGases();
      
      // Final massive environmental adjustments
      setPressure(prev => {
        const pressureChange = gravityMagnitude * baseMultiplier * 4.0 * Math.pow(1 + gravityMagnitude, 1.5);
        return Math.max(80, Math.min(120, prev + (gravityDelta > 0 ? pressureChange : -pressureChange)));
      });
      
      setTemperature(prev => {
        const tempChange = gravityMagnitude * baseMultiplier * 3.0 * Math.pow(1 + gravityMagnitude, 1.5);
        return Math.max(10, Math.min(30, prev + (gravityDelta > 0 ? tempChange : -tempChange)));
      });
    }, 600);
  };
  
  // Vent oxygen to reduce pressure and temperature
  const ventOxygen = () => {
    playSound('click');
    
    if (oxygen <= 5) {
      setWarnings(prev => [...prev, "Oxygen levels critically low. Cannot vent more oxygen."]);
      return;
    }
    
    // Reduce oxygen by 2% and adjust pressure and temperature accordingly
    setOxygen(prev => Math.max(0, prev - 2));
    setPressure(prev => Math.max(0, prev - 4));
    setTemperature(prev => Math.max(0, prev - 2));
    
    // Increase nitrogen and other gases to maintain 100% total
    const totalOther = nitrogen + otherGases;
    const nitrogenRatio = nitrogen / totalOther;
    const otherGasesRatio = otherGases / totalOther;
    
    setNitrogen(prev => prev + 2 * nitrogenRatio);
    setOtherGases(prev => prev + 2 * otherGasesRatio);
  };
  
  // Check if all parameters are within normal ranges
  const checkRanges = () => {
    const newWarnings: string[] = [];
    
    if (oxygen < NORMAL_RANGES.oxygen.min) {
      newWarnings.push(`Oxygen level too low: ${oxygen.toFixed(1)}%`);
    } else if (oxygen > NORMAL_RANGES.oxygen.max) {
      newWarnings.push(`Oxygen level too high: ${oxygen.toFixed(1)}%`);
    }
    
    if (nitrogen < NORMAL_RANGES.nitrogen.min) {
      newWarnings.push(`Nitrogen level too low: ${nitrogen.toFixed(1)}%`);
    } else if (nitrogen > NORMAL_RANGES.nitrogen.max) {
      newWarnings.push(`Nitrogen level too high: ${nitrogen.toFixed(1)}%`);
    }
    
    if (otherGases < NORMAL_RANGES.otherGases.min) {
      newWarnings.push(`Other gases level too low: ${otherGases.toFixed(1)}%`);
    } else if (otherGases > NORMAL_RANGES.otherGases.max) {
      newWarnings.push(`Other gases level too high: ${otherGases.toFixed(1)}%`);
    }
    
    if (pressure < NORMAL_RANGES.pressure.min) {
      newWarnings.push(`Pressure too low: ${pressure.toFixed(1)} kPa`);
    } else if (pressure > NORMAL_RANGES.pressure.max) {
      newWarnings.push(`Pressure too high: ${pressure.toFixed(1)} kPa`);
    }
    
    if (temperature < NORMAL_RANGES.temperature.min) {
      newWarnings.push(`Temperature too low: ${temperature.toFixed(1)}°C`);
    } else if (temperature > NORMAL_RANGES.temperature.max) {
      newWarnings.push(`Temperature too high: ${temperature.toFixed(1)}°C`);
    }
    
    if (gravity < NORMAL_RANGES.gravity.min) {
      newWarnings.push(`Gravity too low: ${gravity.toFixed(2)} G`);
    } else if (gravity > NORMAL_RANGES.gravity.max) {
      newWarnings.push(`Gravity too high: ${gravity.toFixed(2)} G`);
    }
    
    if (JSON.stringify(newWarnings) !== JSON.stringify(warnings)) {
      setWarnings(newWarnings);
    }
    
    return newWarnings.length === 0;
  };
  
  // Check if all conditions are met to win the game
  const checkWinCondition = () => {
    const allNormal = checkRanges();
    
    // Ensure gas percentages sum to 100%
    const totalGas = oxygen + nitrogen + otherGases;
    const gasesCorrect = Math.abs(totalGas - 100) < 0.1;
    
    if (allNormal && gasesCorrect && !gameWon) {
      setGameWon(true);
      setTimerActive(false);
      playSound('click');
      // Mark life support puzzle as complete
      markPuzzleComplete('lifeSupport');
    }
  };
  
  // Reset the system to initial values
  const resetSystem = () => {
    playSound('click');
    setOxygen(INITIAL_VALUES.oxygen);
    setNitrogen(INITIAL_VALUES.nitrogen);
    setOtherGases(INITIAL_VALUES.otherGases);
    setPressure(INITIAL_VALUES.pressure);
    setTemperature(INITIAL_VALUES.temperature);
    setGravity(INITIAL_VALUES.gravity);
    setGameWon(false);
    setWarnings([]);
    setTimer(300);
    setTimerActive(true);
  };
  
  // Start timer when instructions are closed
  useEffect(() => {
    if (!showInstructions && !gameWon) {
      setTimerActive(true);
    }
  }, [showInstructions, gameWon]);
  
  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setTimerActive(false);
      setWarnings(prev => [...prev, "Time expired. Life support systems critical."]);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timer]);
  
  // Modify the useEffect to only check win condition when the check button is clicked
  useEffect(() => {
    if (!gameWon && !showInstructions) {
      checkRanges(); // Only update warnings, don't check win condition
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oxygen, nitrogen, otherGases, pressure, temperature, gravity]);

  return (
    <div className="life-support-puzzle">
      {showInstructions && (
        <div className="instructions-overlay">
          <div className="instructions-content">
            <GlitchText>LIFE SUPPORT CALIBRATION SYSTEM</GlitchText>
            <div className="instructions-text">
              <p>Life support systems are unstable and require immediate calibration.</p>
              <p>Adjust the following parameters to stabilize atmospheric conditions:</p>
              
              <div className="parameter-ranges">
                <div className="parameter">
                  <span className="parameter-name">Oxygen:</span>
                  <span className="parameter-range">19% - 22%</span>
                </div>
                <div className="parameter">
                  <span className="parameter-name">Nitrogen:</span>
                  <span className="parameter-range">76% - 80%</span>
                </div>
                <div className="parameter">
                  <span className="parameter-name">Other Gases:</span>
                  <span className="parameter-range">0.5% - 2%</span>
                </div>
                <div className="parameter">
                  <span className="parameter-name">Pressure:</span>
                  <span className="parameter-range">99 - 103 kPa</span>
                </div>
                <div className="parameter">
                  <span className="parameter-name">Temperature:</span>
                  <span className="parameter-range">19°C - 23°C</span>
                </div>
                <div className="parameter">
                  <span className="parameter-name">Gravity:</span>
                  <span className="parameter-range">0.9 - 1.1 G</span>
                </div>
              </div>
              
              <p className="note">Note: All gas percentages must total 100%. Adjusting one gas affects others proportionally.</p>
              <p className="warning">Warning: You have 5 minutes to stabilize life support before systems fail.</p>
            </div>
            
            <button 
              className="start-button"
              onClick={() => {
                playSound('click');
                setShowInstructions(false);
              }}
            >
              <GlitchText>BEGIN CALIBRATION</GlitchText>
            </button>
          </div>
        </div>
      )}
      
      {gameWon && (
        <div className="win-overlay">
          <div className="win-content">
            <GlitchText>LIFE SUPPORT SYSTEMS STABILIZED</GlitchText>
            <p>All parameters are now within normal operating ranges.</p>
            <p>Life support systems restored to optimal functionality.</p>
            <p>Remaining time: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</p>
            
            <div className="final-readings">
              <div className="reading">
                <span className="reading-name">Oxygen:</span>
                <span className="reading-value">{oxygen.toFixed(1)}%</span>
              </div>
              <div className="reading">
                <span className="reading-name">Nitrogen:</span>
                <span className="reading-value">{nitrogen.toFixed(1)}%</span>
              </div>
              <div className="reading">
                <span className="reading-name">Other Gases:</span>
                <span className="reading-value">{otherGases.toFixed(1)}%</span>
              </div>
              <div className="reading">
                <span className="reading-name">Pressure:</span>
                <span className="reading-value">{pressure.toFixed(1)} kPa</span>
              </div>
              <div className="reading">
                <span className="reading-name">Temperature:</span>
                <span className="reading-value">{temperature.toFixed(1)}°C</span>
              </div>
              <div className="reading">
                <span className="reading-name">Gravity:</span>
                <span className="reading-value">{gravity.toFixed(2)} G</span>
              </div>
            </div>
            
            <button 
              className="continue-button"
              onClick={() => {
                // Check if both puzzles are complete
                if (areBothPuzzlesComplete()) {
                  router.push('/final-terminal');
                } else {
                  // Navigate back to systems overview with power routing puzzle
                  router.push('/systems-overview');
                }
              }}
            >
              <GlitchText>RETURN TO SYSTEMS OVERVIEW</GlitchText>
            </button>
          </div>
        </div>
      )}
      
      <div className="system-header">
        <div className="timer-display">
          <div className="timer-label">TIME REMAINING</div>
          <div className={`timer-value ${timer < 60 ? 'critical' : timer < 120 ? 'warning' : ''}`}>
            {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
          </div>
        </div>
        
        <div className="warnings-display">
          {warnings.length > 0 ? (
            <div className="warnings-container">
              <div className="warnings-label">SYSTEM WARNINGS</div>
              <div className="warnings-list">
                {warnings.map((warning, index) => (
                  <div key={index} className="warning-item">{warning}</div>
                ))}
              </div>
            </div>
          ) : (
            <div className="system-status">
              <div className="status-label">SYSTEM STATUS</div>
              <div className="status-value">
                {checkRanges() ? 'NORMAL' : 'REQUIRES CALIBRATION'}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="control-panel">
        <div className="gas-controls">
          <h3><GlitchText>GAS COMPOSITION</GlitchText></h3>
          
          <div className="control-group">
            <div className="control-label">
              <span>Oxygen</span>
              <span className="current-value" style={{ color: getStatusColor(oxygen, NORMAL_RANGES.oxygen) }}>
                {oxygen.toFixed(1)}%
              </span>
            </div>
            <div className="slider-container">
              <input 
                type="range" 
                min="5" 
                max="30" 
                step="0.1" 
                value={oxygen} 
                onChange={(e) => adjustOxygen(parseFloat(e.target.value))}
                className="slider"
              />
              <div className="normal-range-indicator" style={{ 
                left: `${(NORMAL_RANGES.oxygen.min - 5) / (30 - 5) * 100}%`, 
                width: `${(NORMAL_RANGES.oxygen.max - NORMAL_RANGES.oxygen.min) / (30 - 5) * 100}%` 
              }}></div>
            </div>
            <div className="fine-controls">
              <button onClick={() => adjustOxygen(Math.max(5, oxygen - 0.5))}>-</button>
              <button onClick={() => adjustOxygen(Math.min(30, oxygen + 0.5))}>+</button>
            </div>
          </div>
          
          <div className="control-group">
            <div className="control-label">
              <span>Nitrogen</span>
              <span className="current-value" style={{ color: getStatusColor(nitrogen, NORMAL_RANGES.nitrogen) }}>
                {nitrogen.toFixed(1)}%
              </span>
            </div>
            <div className="slider-container">
              <input 
                type="range" 
                min="60" 
                max="90" 
                step="0.1" 
                value={nitrogen} 
                onChange={(e) => adjustNitrogen(parseFloat(e.target.value))}
                className="slider"
              />
              <div className="normal-range-indicator" style={{ 
                left: `${(NORMAL_RANGES.nitrogen.min - 60) / (90 - 60) * 100}%`, 
                width: `${(NORMAL_RANGES.nitrogen.max - NORMAL_RANGES.nitrogen.min) / (90 - 60) * 100}%` 
              }}></div>
            </div>
            <div className="fine-controls">
              <button onClick={() => adjustNitrogen(Math.max(60, nitrogen - 0.5))}>-</button>
              <button onClick={() => adjustNitrogen(Math.min(90, nitrogen + 0.5))}>+</button>
            </div>
          </div>
          
          <div className="control-group">
            <div className="control-label">
              <span>Other Gases</span>
              <span className="current-value" style={{ color: getStatusColor(otherGases, NORMAL_RANGES.otherGases) }}>
                {otherGases.toFixed(1)}%
              </span>
            </div>
            <div className="slider-container">
              <input 
                type="range" 
                min="0" 
                max="20" 
                step="0.1" 
                value={otherGases} 
                onChange={(e) => adjustOtherGases(parseFloat(e.target.value))}
                className="slider"
              />
              <div className="normal-range-indicator" style={{ 
                left: `${(NORMAL_RANGES.otherGases.min - 0) / (20 - 0) * 100}%`, 
                width: `${(NORMAL_RANGES.otherGases.max - NORMAL_RANGES.otherGases.min) / (20 - 0) * 100}%` 
              }}></div>
            </div>
            <div className="fine-controls">
              <button onClick={() => adjustOtherGases(Math.max(0, otherGases - 0.5))}>-</button>
              <button onClick={() => adjustOtherGases(Math.min(20, otherGases + 0.5))}>+</button>
            </div>
          </div>
          
          <div className="total-gas">
            <span>Total Gas:</span>
            <span className={`total-value ${Math.abs(oxygen + nitrogen + otherGases - 100) < 0.1 ? 'balanced' : 'unbalanced'}`}>
              {(oxygen + nitrogen + otherGases).toFixed(1)}%
            </span>
          </div>
        </div>
        
        <div className="environmental-controls">
          <h3><GlitchText>ENVIRONMENTAL PARAMETERS</GlitchText></h3>
          
          <div className="control-group">
            <div className="control-label">
              <span>Pressure</span>
              <span className="current-value" style={{ color: getStatusColor(pressure, NORMAL_RANGES.pressure) }}>
                {pressure.toFixed(1)} kPa
              </span>
            </div>
            <div className="slider-container">
              <input 
                type="range" 
                min="80" 
                max="120" 
                step="0.1" 
                value={pressure} 
                onChange={(e) => adjustPressure(parseFloat(e.target.value))}
                className="slider"
              />
              <div className="normal-range-indicator" style={{ 
                left: `${(NORMAL_RANGES.pressure.min - 80) / (120 - 80) * 100}%`, 
                width: `${(NORMAL_RANGES.pressure.max - NORMAL_RANGES.pressure.min) / (120 - 80) * 100}%` 
              }}></div>
            </div>
            <div className="fine-controls">
              <button onClick={() => adjustPressure(Math.max(80, pressure - 0.5))}>-</button>
              <button onClick={() => adjustPressure(Math.min(120, pressure + 0.5))}>+</button>
            </div>
          </div>
          
          <div className="control-group">
            <div className="control-label">
              <span>Temperature</span>
              <span className="current-value" style={{ color: getStatusColor(temperature, NORMAL_RANGES.temperature) }}>
                {temperature.toFixed(1)} °C
              </span>
            </div>
            <div className="slider-container">
              <input 
                type="range" 
                min="10" 
                max="30" 
                step="0.1" 
                value={temperature} 
                onChange={(e) => adjustTemperature(parseFloat(e.target.value))}
                className="slider"
              />
              <div className="normal-range-indicator" style={{ 
                left: `${(NORMAL_RANGES.temperature.min - 10) / (30 - 10) * 100}%`, 
                width: `${(NORMAL_RANGES.temperature.max - NORMAL_RANGES.temperature.min) / (30 - 10) * 100}%` 
              }}></div>
            </div>
            <div className="fine-controls">
              <button onClick={() => adjustTemperature(Math.max(10, temperature - 0.5))}>-</button>
              <button onClick={() => adjustTemperature(Math.min(30, temperature + 0.5))}>+</button>
            </div>
          </div>
          
          <div className="control-group">
            <div className="control-label">
              <span>Gravity</span>
              <span className="current-value" style={{ color: getStatusColor(gravity, NORMAL_RANGES.gravity) }}>
                {gravity.toFixed(2)} G
              </span>
            </div>
            <div className="slider-container">
              <input 
                type="range" 
                min="0.5" 
                max="1.5" 
                step="0.01" 
                value={gravity} 
                onChange={(e) => adjustGravity(parseFloat(e.target.value))}
                className="slider"
              />
              <div className="normal-range-indicator" style={{ 
                left: `${(NORMAL_RANGES.gravity.min - 0.5) / (1.5 - 0.5) * 100}%`, 
                width: `${(NORMAL_RANGES.gravity.max - NORMAL_RANGES.gravity.min) / (1.5 - 0.5) * 100}%` 
              }}></div>
            </div>
            <div className="fine-controls">
              <button onClick={() => adjustGravity(Math.max(0.5, gravity - 0.05))}>-</button>
              <button onClick={() => adjustGravity(Math.min(1.5, gravity + 0.05))}>+</button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="action-controls">
        <button 
          className="vent-button"
          onClick={ventOxygen}
        >
          <GlitchText>VENT OXYGEN</GlitchText>
        </button>
        
        <button 
          className="reset-button"
          onClick={resetSystem}
        >
          <GlitchText>RESET SYSTEM</GlitchText>
        </button>
        
        <button 
          className="check-button"
          onClick={checkWinCondition}
        >
          <GlitchText>CHECK STABILITY</GlitchText>
        </button>
      </div>
      
      <style jsx>{`
        .life-support-puzzle {
          display: flex;
          flex-direction: column;
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          background: rgba(0, 0, 0, 0.8);
          border: 2px solid #44ff44;
          padding: 1rem;
          box-shadow: 0 0 15px rgba(68, 255, 68, 0.3);
          position: relative;
        }
        
        .system-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
          padding: 0.5rem;
          border-bottom: 1px solid #44ff44;
        }
        
        .timer-display {
          font-family: monospace;
          text-align: center;
        }
        
        .timer-label {
          font-size: 0.9rem;
          color: #44ff44;
          margin-bottom: 0.2rem;
        }
        
        .timer-value {
          font-size: 2rem;
          font-weight: bold;
          color: #44ff44;
        }
        
        .timer-value.warning {
          color: #ffff44;
          animation: blink 1s infinite;
        }
        
        .timer-value.critical {
          color: #ff4444;
          animation: blink 0.5s infinite;
        }
        
        .warnings-display {
          flex: 1;
          max-width: 60%;
        }
        
        .warnings-container {
          border: 1px solid #ff4444;
          padding: 0.5rem;
        }
        
        .warnings-label {
          color: #ff4444;
          font-size: 0.9rem;
          margin-bottom: 0.2rem;
        }
        
        .warnings-list {
          max-height: 100px;
          overflow-y: auto;
        }
        
        .warning-item {
          color: #ff4444;
          margin-bottom: 0.2rem;
          font-size: 0.9rem;
        }
        
        .system-status {
          text-align: center;
          padding: 0.5rem;
          border: 1px solid #44ff44;
        }
        
        .status-label {
          color: #44ff44;
          font-size: 0.9rem;
          margin-bottom: 0.2rem;
        }
        
        .status-value {
          font-size: 1.2rem;
          font-weight: bold;
          color: #44ff44;
        }
        
        .control-panel {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }
        
        .gas-controls, .environmental-controls {
          flex: 1;
          min-width: 300px;
          border: 1px solid #44ff44;
          padding: 1rem;
        }
        
        h3 {
          margin-top: 0;
          margin-bottom: 1rem;
          text-align: center;
          font-size: 1.2rem;
        }
        
        .control-group {
          margin-bottom: 1.2rem;
        }
        
        .control-label {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }
        
        .current-value {
          font-weight: bold;
        }
        
        .slider-container {
          position: relative;
          height: 20px;
          margin-bottom: 0.5rem;
        }
        
        .normal-range-indicator {
          position: absolute;
          height: 100%;
          background-color: rgba(68, 255, 68, 0.2);
          border: 1px solid rgba(68, 255, 68, 0.5);
          top: 0;
          z-index: 1;
          pointer-events: none;
        }
        
        .slider {
          -webkit-appearance: none;
          width: 100%;
          height: 20px;
          background: #111;
          outline: none;
          position: relative;
          z-index: 2;
        }
        
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 15px;
          height: 30px;
          background: #44ff44;
          cursor: pointer;
          border-radius: 2px;
        }
        
        .slider::-moz-range-thumb {
          width: 15px;
          height: 30px;
          background: #44ff44;
          cursor: pointer;
          border-radius: 2px;
        }
        
        .fine-controls {
          display: flex;
          justify-content: space-between;
        }
        
        .fine-controls button {
          width: 30px;
          height: 30px;
          background: none;
          border: 1px solid #44ff44;
          color: #44ff44;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        
        .fine-controls button:hover {
          background: rgba(68, 255, 68, 0.1);
        }
        
        .total-gas {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem;
          border: 1px solid #44ff44;
          margin-top: 1rem;
        }
        
        .total-value {
          font-weight: bold;
        }
        
        .total-value.balanced {
          color: #44ff44;
        }
        
        .total-value.unbalanced {
          color: #ff4444;
        }
        
        .action-controls {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
        }
        
        .action-controls button {
          flex: 1;
          padding: 0.75rem;
          border: none;
          font-size: 1rem;
          cursor: pointer;
        }
        
        .vent-button {
          background: rgba(68, 68, 255, 0.2);
          border: 2px solid #4444ff !important;
          color: #4444ff;
        }
        
        .reset-button {
          background: rgba(255, 68, 68, 0.2);
          border: 2px solid #ff4444 !important;
          color: #ff4444;
        }
        
        .check-button {
          background: rgba(68, 255, 68, 0.2);
          border: 2px solid #44ff44 !important;
          color: #44ff44;
        }
        
        .vent-button:hover {
          background: rgba(68, 68, 255, 0.3);
          box-shadow: 0 0 10px rgba(68, 68, 255, 0.5);
        }
        
        .reset-button:hover {
          background: rgba(255, 68, 68, 0.3);
          box-shadow: 0 0 10px rgba(255, 68, 68, 0.5);
        }
        
        .check-button:hover {
          background: rgba(68, 255, 68, 0.3);
          box-shadow: 0 0 10px rgba(68, 255, 68, 0.5);
        }
        
        .win-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 100;
        }
        
        .win-content {
          background: rgba(0, 0, 0, 0.95);
          border: 2px solid #44ff44;
          padding: 2rem;
          max-width: 600px;
          text-align: center;
          color: #44ff44;
        }
        
        .final-readings {
          margin: 1.5rem 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        
        .reading {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem;
          border-bottom: 1px dashed #44ff44;
        }
        
        .reading-name {
          font-weight: bold;
        }
        
        .reading-value {
          color: #44ff44;
        }
        
        .continue-button {
          background: none;
          border: 2px solid #44ff44;
          color: #44ff44;
          padding: 0.75rem 1.5rem;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 1rem;
        }
        
        .continue-button:hover {
          background: rgba(68, 255, 68, 0.1);
          box-shadow: 0 0 10px rgba(68, 255, 68, 0.5);
        }
        
        .instructions-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 100;
        }
        
        .instructions-content {
          background: rgba(0, 0, 0, 0.95);
          border: 2px solid #44ff44;
          padding: 2rem;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          text-align: center;
          color: #44ff44;
          display: flex;
          flex-direction: column;
        }
        
        .instructions-text {
          margin: 1.5rem 0;
          line-height: 1.6;
          text-align: left;
          flex: 1;
          overflow-y: auto;
          min-height: 0;
        }

        .instructions-content .start-button {
          flex-shrink: 0;
          margin-top: auto;
        }
        
        .parameter-ranges {
          margin: 1.5rem 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        
        .parameter {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem;
          border-bottom: 1px dashed #44ff44;
        }
        
        .parameter-name {
          font-weight: bold;
        }
        
        .parameter-range {
          color: #ffff44;
        }
        
        .note {
          margin-top: 1.5rem;
          font-style: italic;
          color: #ffff44;
        }
        
        .warning {
          color: #ff4444;
          font-weight: bold;
          margin-top: 1rem;
        }
        
        .start-button {
          background: none;
          border: 2px solid #44ff44;
          color: #44ff44;
          padding: 0.75rem 1.5rem;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 1rem;
        }
        
        .start-button:hover {
          background: rgba(68, 255, 68, 0.1);
          box-shadow: 0 0 10px rgba(68, 255, 68, 0.5);
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @media (max-width: 768px) {
          .instructions-content {
            max-width: 90vw;
            max-height: 85vh;
            padding: 1.5rem;
          }

          .instructions-text {
            font-size: 0.9rem;
          }

          .parameter-ranges {
            grid-template-columns: 1fr;
          }

          .control-panel {
            flex-direction: column;
          }
          
          .gas-controls, .environmental-controls {
            width: 100%;
          }
          
          .action-controls {
            flex-direction: column;
          }
          
          .action-controls button {
            width: 100%;
          }
          
          .system-header {
            flex-direction: column;
            align-items: center;
          }
          
          .warnings-display {
            margin-top: 1rem;
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
} 
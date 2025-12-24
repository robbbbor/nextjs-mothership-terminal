import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GlitchText from '@/components/GlitchText/GlitchText';
import { useAudio } from '@/hooks/useAudio';

// Node types for the puzzle
type NodeType = 
  | 'reactor-core' 
  | 'pilot-controls' 
  | 'life-support' 
  | 'cargo-bay'
  | 'human-quarters'
  | 'cockpit'
  | 'central-room'
  | 'lower-level'
  | 'bathroom'
  | 'medbay'
  | 'communications'
  | 'engines'
  | 'airlocks'
  | 'junction'
  | 'stabilizer';

type PowerKey = 'stabilizer-1' | 'stabilizer-2';

interface Node {
  id: string;
  type: NodeType;
  name: string;
  powerDrain: number;
  position: { x: number; y: number };
  connections: Connection[];
  requiredKeys?: PowerKey[];
  isUnlocked: boolean;
}

interface Connection {
  targetId: string;
  isOneWay: boolean;
}

interface PowerKeyLocation {
  nodeId: string;
  collected: boolean;
}

export default function PowerRoutingPuzzle() {
  const router = useRouter();
  const { playSound } = useAudio();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [currentPath, setCurrentPath] = useState<string[]>(['reactor-core']);
  const [currentPower, setCurrentPower] = useState(100);
  const [gameWon, setGameWon] = useState(false);
  const [targetSystem, setTargetSystem] = useState<'pilot-controls' | 'life-support' | null>(null);
  const [powerKeys, setPowerKeys] = useState<PowerKeyLocation[]>([
    { nodeId: 'stabilizer-1', collected: false },
    { nodeId: 'stabilizer-2', collected: false },
  ]);
  const [showInstructions, setShowInstructions] = useState(true);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [showWinOptions, setShowWinOptions] = useState(false);
  const [showManual, setShowManual] = useState(false);

  // Initialize the game
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    // Create all nodes with their properties
    const gameNodes: Node[] = [
      {
        id: 'reactor-core',
        type: 'reactor-core',
        name: 'Reactor Core',
        powerDrain: 0,
        position: { x: 50, y: 85 },
        connections: [
          { targetId: 'central-room', isOneWay: false },
          { targetId: 'lower-level', isOneWay: false },
          { targetId: 'engines', isOneWay: false }
        ],
        isUnlocked: true
      },
      {
        id: 'pilot-controls',
        type: 'pilot-controls',
        name: 'Pilot Controls',
        powerDrain: 10,
        position: { x: 20, y: 15 },
        connections: [
        ],
        isUnlocked: false
      },
      {
        id: 'life-support',
        type: 'life-support',
        name: 'Life Support',
        powerDrain: 15,
        position: { x: 80, y: 15 },
        connections: [
        ],
        isUnlocked: false
      },
      {
        id: 'cargo-bay',
        type: 'cargo-bay',
        name: 'Cargo Bay',
        powerDrain: 5,
        position: { x: 25, y: 32 },
        connections: [
          { targetId: 'pilot-controls', isOneWay: true },
          { targetId: 'stabilizer-1', isOneWay: false },
          { targetId: 'central-room', isOneWay: false },
          { targetId: 'airlocks', isOneWay: false }
        ],
        isUnlocked: true
      },
      {
        id: 'human-quarters',
        type: 'human-quarters',
        name: 'Human Quarters',
        powerDrain: 8,
        position: { x: 75, y: 40 },
        connections: [
          { targetId: 'central-room', isOneWay: false },
          { targetId: 'bathroom', isOneWay: false },
          { targetId: 'android-quarters', isOneWay: false },
          { targetId: 'stabilizer-2', isOneWay: false }
        ],
        isUnlocked: true
      },
      {
        id: 'cockpit',
        type: 'cockpit',
        name: 'Cockpit',
        powerDrain: 3,
        position: { x: 65, y: 60 },
        connections: [
          { targetId: 'central-room', isOneWay: false },
          { targetId: 'lower-level', isOneWay: false },
          { targetId: 'stabilizer-2', isOneWay: false }
        ],
        isUnlocked: true
      },
      {
        id: 'stabilizer-2',
        type: 'stabilizer',
        name: 'Stabilizer',
        powerDrain: -2,
        position: { x: 70, y: 50 },
        connections: [
          { targetId: 'cockpit', isOneWay: false },
          { targetId: 'human-quarters', isOneWay: false }
        ],
        isUnlocked: true
      },
      {
        id: 'central-room',
        type: 'central-room',
        name: 'Central Room',
        powerDrain: 12,
        position: { x: 50, y: 50 },
        connections: [
          { targetId: 'cargo-bay', isOneWay: false },
          { targetId: 'human-quarters', isOneWay: false },
          { targetId: 'cockpit', isOneWay: false },
          { targetId: 'reactor-core', isOneWay: false },
          { targetId: 'communications', isOneWay: false },
          { targetId: 'stabilizer-1', isOneWay: false }
        ],
        isUnlocked: true
      },
      {
        id: 'lower-level',
        type: 'lower-level',
        name: 'Lower Level',
        powerDrain: 7,
        position: { x: 40, y: 70 },
        connections: [
          { targetId: 'reactor-core', isOneWay: false },
          { targetId: 'cockpit', isOneWay: false },
          { targetId: 'engines', isOneWay: false }
        ],
        isUnlocked: true
      },
      {
        id: 'bathroom',
        type: 'bathroom',
        name: 'Bathroom',
        powerDrain: 2,
        position: { x: 85, y: 30 },
        connections: [
          { targetId: 'human-quarters', isOneWay: false },
          { targetId: 'medbay', isOneWay: false }
        ],
        isUnlocked: true
      },
      {
        id: 'medbay',
        type: 'medbay',
        name: 'Medbay/Lab',
        powerDrain: 15,
        position: { x: 83, y: 23 },
        connections: [
          { targetId: 'bathroom', isOneWay: false },
          { targetId: 'life-support', isOneWay: true }
        ],
        isUnlocked: true
      },
      {
        id: 'communications',
        type: 'communications',
        name: 'Communications',
        powerDrain: 10,
        position: { x: 35, y: 28 },
        connections: [
          { targetId: 'central-room', isOneWay: false },
          { targetId: 'pilot-controls', isOneWay: true }
        ],
        isUnlocked: true
      },
      {
        id: 'engines',
        type: 'engines',
        name: 'Engines',
        powerDrain: 20,
        position: { x: 55, y: 75 },
        connections: [
          { targetId: 'reactor-core', isOneWay: false },
          { targetId: 'lower-level', isOneWay: false },
          { targetId: 'airlocks', isOneWay: false }
        ],
        isUnlocked: true
      },
      {
        id: 'airlocks',
        type: 'airlocks',
        name: 'Airlocks',
        powerDrain: 25,
        position: { x: 20, y: 70 },
        connections: [
          { targetId: 'engines', isOneWay: false },
          { targetId: 'cargo-bay', isOneWay: false }
        ],
        isUnlocked: true
      },
      {
        id: 'stabilizer-1',
        type: 'stabilizer',
        name: 'Stabilizer',
        powerDrain: -2,
        position: { x: 30, y: 50 },
        connections: [
          { targetId: 'central-room', isOneWay: false },
          { targetId: 'cargo-bay', isOneWay: false },
          { targetId: 'airlocks', isOneWay: true }
        ],
        isUnlocked: true
      },
      {
        id: 'android-quarters',
        type: 'cockpit',
        name: 'Android Quarters',
        powerDrain: 3,
        position: { x: 68, y: 28 },
        connections: [
          { targetId: 'human-quarters', isOneWay: false },
          { targetId: 'life-support', isOneWay: true }
        ],
        isUnlocked: true
      }
    ];

    setNodes(gameNodes);
    setCurrentPath(['reactor-core']);
    setCurrentPower(100);
    setGameWon(false);
    setTargetSystem(null);
  };

  // Determine if a node can be selected
  const canSelectNode = (nodeId: string): boolean => {
    // Can't select if game is won
    if (gameWon) return false;

    // If it's the first move, can only select nodes connected to the Reactor Core
    if (currentPath.length === 1) {
      const reactorCore = nodes.find(n => n.id === 'reactor-core');
      if (!reactorCore) return false;
      return reactorCore.connections.some(conn => conn.targetId === nodeId);
    }

    // Get the target node
    const targetNode = nodes.find(n => n.id === nodeId);
    if (!targetNode) return false;

    // Can only select if connected to the last node in the path
    const lastNodeId = currentPath[currentPath.length - 1];
    const lastNode = nodes.find(n => n.id === lastNodeId);
    
    if (!lastNode) return false;

    // Check direct connections from last node
    const directConnection = lastNode.connections.find(c => c.targetId === nodeId);
    if (!directConnection) return false;

    // Check if one-way connection is in the correct direction
    if (directConnection.isOneWay) {
      // If a one-way connection exists, we already know we're going from lastNode -> nodeId
      // which is the correct direction, so this is allowed
    }

    // Check if node is already in the path
    if (currentPath.includes(nodeId)) return false;

    // Check if node is unlocked
    if (!targetNode.isUnlocked) return false;

    // Calculate the power level after potential connection
    const powerAfterDrain = currentPower - targetNode.powerDrain;

    // Check if we have sufficient power after drain
    if (powerAfterDrain < 0) return false;

    return true;
  };

  // Handle node selection
  const selectNode = (nodeId: string) => {
    if (!canSelectNode(nodeId)) return;

    playSound('click');

    // Add node to path
    setCurrentPath(prev => [...prev, nodeId]);

    // Collect power key if present
    const keyAtNode = powerKeys.findIndex(key => key.nodeId === nodeId && !key.collected);
    if (keyAtNode !== -1) {
      setPowerKeys(prev => prev.map((key, idx) => 
        idx === keyAtNode ? { ...key, collected: true } : key
      ));
      playSound('click');
    }

    // Reduce power based on node's power drain
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setCurrentPower(prev => prev - node.powerDrain);
    }

    // Clear any warning messages when making a new move
    setWarningMessage(null);
  };

  const checkWinCondition = () => {
    const lastNodeId = currentPath[currentPath.length - 1];
    
    // Check if we're at a target system
    if (lastNodeId !== 'pilot-controls' && lastNodeId !== 'life-support') {
      setInfoMessage("Power Rerouted");
      playSound('click');
      return;
    }

    // Check if at least one stabilizer has been collected
    const hasStabilizer = powerKeys.some(key => key.collected);
    if (!hasStabilizer) {
      setWarningMessage("Route is unstable - at least one Stabilizer is required");
      return;
    }

    // Check power thresholds
    if (lastNodeId === 'life-support') {
      if (currentPower >= 10) {
        setWarningMessage("Life Support requires power level below 10%");
        return;
      }
    } else if (lastNodeId === 'pilot-controls') {
      if (currentPower < 10 || currentPower > 20) {
        setWarningMessage("Pilot Controls requires power level between 10-20%");
        return;
      }
    }

    // If we made it here, all conditions are met
    setTargetSystem(lastNodeId as 'pilot-controls' | 'life-support');
    setGameWon(true);
    setShowWinOptions(true);
    setWarningMessage(null);
    playSound('click');
  };

  // Reset the game
  const resetGame = () => {
    playSound('click');
    initializeGame();
    setPowerKeys([
      { nodeId: 'stabilizer-1', collected: false },
      { nodeId: 'stabilizer-2', collected: false },
    ]);
  };

  // Update node unlock status based on collected keys and power levels
  useEffect(() => {
    setNodes(prevNodes => 
      prevNodes.map(node => {
        // Update unlock status based on keys
        let isUnlocked = true;
        
        // If node requires keys, check if all required keys are collected
        if (node.requiredKeys && node.requiredKeys.length > 0) {
          isUnlocked = node.requiredKeys.every(keyType => {
            const keyIndex = keyType === 'stabilizer-1' ? 0 : 1;
            return powerKeys[keyIndex].collected;
          });
        }
        
        return { ...node, isUnlocked };
      })
    );
  }, [powerKeys, currentPower]);

  return (
    <div className="power-routing-puzzle">
      {showInstructions && (
        <div className="instructions-overlay">
          <div className="instructions-content">
            <GlitchText>POWER ROUTING SYSTEM</GlitchText>
            <div className="instructions-text">
              <p>Route power from the Reactor Core to either Life Support or Pilot Controls.</p>
              <p>Each room drains a variable amount of power when traveled through.</p>
              <p>Collect Stabilizers to unlock access to certain rooms.</p>
              <p>Pilot Controls require power level between 10-20%.</p>
              <p>Life Support requires power level below 10%.</p>
              <p>If power reaches zero, the routing attempt fails.</p>
              <p className="usage-instructions">
                <span className="highlight">HOW TO USE:</span> Click on connected rooms to route power through them. You can only select rooms that connect to the last room in your path. Available rooms will have a green glow.
              </p>
            </div>
            <button 
              className="start-button"
              onClick={() => {
                playSound('click');
                setShowInstructions(false);
              }}
            >
              <GlitchText>BEGIN</GlitchText>
            </button>
          </div>
        </div>
      )}

      <div className="emergency-warning">
        <GlitchText>WARNING. EMERGENCY POWER ONLY. PLEASE ROUTE POWER WHERE FULL ACCESS IS REQUIRED</GlitchText>
      </div>

      {gameWon && showWinOptions && (
        <div className="win-overlay">
          <div className="win-content">
            <GlitchText>POWER SUCCESSFULLY ROUTED</GlitchText>
            <p>Power successfully routed to {targetSystem === 'pilot-controls' ? 'Pilot Controls' : 'Life Support'}</p>
            <p>Remaining power: {currentPower}%</p>
            <div className="win-options">
              <p>{targetSystem === 'pilot-controls' ? 'Proceed to Pilot Controls?' : 'Proceed to Life Support Controls?'}</p>
              <div className="win-buttons">
                <button 
                  className="win-button proceed-button"
                  onClick={() => {
                    router.push(targetSystem === 'pilot-controls' ? '/pilot-controls' : '/life-support');
                  }}
                >
                  <GlitchText>YES</GlitchText>
                </button>
                <button 
                  className="win-button cancel-button"
                  onClick={() => setShowWinOptions(false)}
                >
                  <GlitchText>NO</GlitchText>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="game-header">
        <GlitchText>SHIP POWER ROUTING SYSTEM</GlitchText>
        <div className="power-level">Power: {currentPower}%</div>
        <div className="keys-collected">
          Stabilizers: {powerKeys.filter(k => k.collected).length}/{powerKeys.length}
        </div>
      </div>

      <div className="ship-map">
        <div className="map-container">
          {/* Draw connection lines - Modified SVG to ensure proper scaling */}
          <svg 
            className="connections-layer" 
            viewBox="0 0 100 100" 
            width="100%" 
            height="100%"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g>
              {nodes.flatMap(node => 
                node.connections.map((conn, idx) => {
                  const targetNode = nodes.find(n => n.id === conn.targetId);
                  if (!targetNode) return null;
                  
                  // Check if this connection is in the current path
                  const isInPath = currentPath.includes(node.id) && 
                                  currentPath.includes(conn.targetId) &&
                                  (currentPath.indexOf(node.id) === currentPath.indexOf(conn.targetId) - 1 ||
                                    currentPath.indexOf(node.id) === currentPath.indexOf(conn.targetId) + 1);
                  
                  // Check if this connection is available to select
                  const isAvailable = (node.id === currentPath[currentPath.length - 1] && 
                                      canSelectNode(conn.targetId)) ||
                                    (conn.targetId === currentPath[currentPath.length - 1] && 
                                      !conn.isOneWay && 
                                      canSelectNode(node.id));
                  
                  // Calculate the midpoint for placing the direction indicator
                  const midX = (node.position.x + targetNode.position.x) / 2;
                  const midY = (node.position.y + targetNode.position.y) / 2;
                  
                  // Calculate the direction vector for the arrow rotation
                  const directionX = targetNode.position.x - node.position.x;
                  const directionY = targetNode.position.y - node.position.y;
                  const angle = Math.atan2(directionY, directionX) * 180 / Math.PI;
                  
                  return (
                    <g key={`${node.id}-${conn.targetId}-${idx}`}>
                      <line 
                        x1={node.position.x} 
                        y1={node.position.y} 
                        x2={targetNode.position.x} 
                        y2={targetNode.position.y}
                        className={`connection ${isInPath ? 'active' : ''} ${isAvailable ? 'available' : ''} ${conn.isOneWay ? 'one-way' : 'two-way'}`}
                        vectorEffect="non-scaling-stroke"
                      />
                      
                      {/* One-way connection indicators */}
                      {conn.isOneWay && (
                        <g 
                          className={`one-way-indicator ${isInPath ? 'active' : ''} ${isAvailable ? 'available' : ''}`}
                        >
                          {/* Generate 7 small arrows along the path */}
                          {[...Array(7)].map((_, i) => {
                            // Calculate position along the line (from 20% to 80% of the line)
                            const t = 0.2 + (i * 0.1); // This spreads 7 arrows from 20% to 80% of the line
                            const arrowX = node.position.x + (targetNode.position.x - node.position.x) * t;
                            const arrowY = node.position.y + (targetNode.position.y - node.position.y) * t;
                            
                            return (
                              <g 
                                key={i}
                                transform={`translate(${arrowX}, ${arrowY}) rotate(${angle - 90})`}
                              >
                                <polygon 
                                  points="-1,0 1,0 0,2" 
                                  className="arrow-head"
                                />
                              </g>
                            );
                          })}
                          
                          {/* Animated pulse circle if available */}
                          {isAvailable && (
                            <circle 
                              cx={midX} 
                              cy={midY} 
                              r="3" 
                              className="pulse-circle"
                            />
                          )}
                        </g>
                      )}
                    </g>
                  );
                })
              )}
            </g>
          </svg>
          
          {/* Draw nodes */}
          <div className="nodes-layer">
            {nodes.map(node => {
              const isInPath = currentPath.includes(node.id);
              const isLastInPath = node.id === currentPath[currentPath.length - 1];
              const hasKey = powerKeys.some(key => key.nodeId === node.id && !key.collected);
              const canSelect = node.id !== currentPath[currentPath.length - 1] && canSelectNode(node.id);
              const nodeSize = node.type === 'junction' ? 14 : 40; // Adjusted sizes
              
              return (
                <div
                  key={node.id}
                  className={`
                    node 
                    node-${node.type} 
                    ${isInPath ? 'in-path' : ''} 
                    ${isLastInPath ? 'last-in-path' : ''}
                    ${hasKey ? 'has-key' : ''}
                    ${node.isUnlocked ? '' : 'locked'}
                    ${canSelect ? 'can-select' : ''}
                  `}
                  style={{
                    left: `${node.position.x}%`,
                    top: `${node.position.y}%`,
                    width: `${nodeSize}px`,
                    height: `${nodeSize}px`,
                    transform: `translate(-50%, -50%)`
                  }}
                  onClick={() => selectNode(node.id)}
                >
                  <div className="node-content">
                    {(node.type !== 'junction' || node.powerDrain !== 0) && <div className="node-name">{node.name}</div>}
                    {node.powerDrain !== 0 && <div className="power-drain">{node.powerDrain > 0 ? '-' : '+'}{Math.abs(node.powerDrain)}%</div>}
                    {hasKey && <div className="key-indicator">⚡</div>}
                    {node.requiredKeys && node.requiredKeys.length > 0 && !node.isUnlocked && (
                      <div className="lock-indicator">🔒</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="controls">
        <div className="control-buttons">
          <button 
            className="reset-button"
            onClick={resetGame}
          >
            <GlitchText>RESET</GlitchText>
          </button>
          <button 
            className="accept-button"
            onClick={checkWinCondition}
          >
            <GlitchText>ACCEPT</GlitchText>
          </button>
          <button 
            className="manual-button"
            onClick={() => setShowManual(true)}
          >
            <GlitchText>USER&apos;S MANUAL</GlitchText>
          </button>
        </div>
      </div>

      {showManual && (
        <div className="manual-overlay">
          <div className="manual-content">
            <h2><GlitchText>POWER ROUTING SYSTEM - USER&apos;S MANUAL</GlitchText></h2>
            
            <div className="manual-section">
              <h3><GlitchText>CONNECTION TYPES</GlitchText></h3>
              <div className="manual-item">
                <div className="connection-example two-way"></div>
                <p>Two-Way Connection: Power can flow in both directions</p>
              </div>
              <div className="manual-item">
                <div className="connection-example one-way">
                  <div className="arrow-example"></div>
                  <div className="arrow-example"></div>
                  <div className="arrow-example"></div>
                  <div className="arrow-example"></div>
                  <div className="arrow-example"></div>
                </div>
                <p>One-Way Connection: Power can only flow in direction of arrows</p>
              </div>
            </div>

            <div className="manual-section">
              <h3><GlitchText>COLOR INDICATORS</GlitchText></h3>
              <div className="manual-item">
                <div className="color-example normal"></div>
                <p>Red: Normal state / Unpowered</p>
              </div>
              <div className="manual-item">
                <div className="color-example active"></div>
                <p>Green: Active power flow</p>
              </div>
              <div className="manual-item">
                <div className="color-example available"></div>
                <p>Yellow: Available connection</p>
              </div>
            </div>

            <div className="manual-section">
              <h3><GlitchText>STABILIZERS</GlitchText></h3>
              <div className="manual-item">
                <div className="stabilizer-example">⚡</div>
                <p>Stabilizers reduce power drain by 2% each</p>
                <p>At least one Stabilizer is required to power critical systems</p>
              </div>
            </div>

            <div className="manual-section">
              <h3><GlitchText>POWER REQUIREMENTS</GlitchText></h3>
              <ul className="requirements-list">
                <li>Pilot Controls: Power must be between 10-20%</li>
                <li>Life Support: Power must be below 10%</li>
                <li>Each room has its own power drain percentage</li>
                <li>Power cannot connect to an already powered room</li>
                <li>Route must start from Reactor Core</li>
                <li>System will fail if power reaches 0%</li>
              </ul>
            </div>

            <button 
              className="manual-close-button"
              onClick={() => setShowManual(false)}
            >
              <GlitchText>CLOSE MANUAL</GlitchText>
            </button>
          </div>
        </div>
      )}

      {warningMessage && (
        <div className="warning-overlay">
          <div className="warning-content">
            <GlitchText>{warningMessage}</GlitchText>
            <button 
              className="warning-close-button"
              onClick={() => setWarningMessage(null)}
            >
              <GlitchText>CONTINUE</GlitchText>
            </button>
          </div>
        </div>
      )}

      {infoMessage && (
        <div className="info-overlay">
          <div className="info-content">
            <GlitchText>{infoMessage}</GlitchText>
            <button 
              className="info-close-button"
              onClick={() => setInfoMessage(null)}
            >
              <GlitchText>OK</GlitchText>
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .power-routing-puzzle {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
          color: #ff4444;
          margin: 0;
        }

        .game-header {
          text-align: center;
          margin-bottom: 0.5rem;
          color: #ff4444;
          text-shadow: 0 0 8px rgba(255, 68, 68, 0.8);
          position: relative;
          z-index: 5;
          font-size: 1.8rem;
        }

        .power-level, .keys-collected {
          margin-top: 0.5rem;
          font-size: 1.8rem;
          color: #ff4444;
          text-shadow: 0 0 8px rgba(255, 68, 68, 0.8);
          position: relative;
          z-index: 5;
        }

        .ship-map {
          position: relative;
          width: 100%;
          max-width: 900px;
          margin: 0.5rem auto;
          border: 2px solid #ff4444;
          background: rgba(0, 0, 0, 0.8);
          overflow: visible;
          box-shadow: 0 0 15px rgba(255, 68, 68, 0.3);
          aspect-ratio: 1;
          height: auto;
          min-height: unset;
        }

        .map-container {
          position: relative;
          width: 100%;
          height: 100%;
          padding-bottom: 100%;
          overflow: visible;
        }

        .connections-layer, .nodes-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .connections-layer {
          z-index: 1;
        }

        .nodes-layer {
          z-index: 2;
        }

        .connection {
          stroke: #ff4444;
          stroke-width: 3px;
          opacity: 0.7;
          fill: none;
        }

        .connection.active {
          stroke: #00ff00;
          stroke-width: 4px;
          opacity: 1;
        }

        .connection.available {
          stroke: #ffff00;
          stroke-width: 2.5px;
          opacity: 0.8;
          stroke-dasharray: 4;
          animation: pulse-connection 2s infinite;
        }

        .connection.one-way {
          stroke-dasharray: none;  /* Remove the dashed line style */
        }

        .one-way-indicator {
          fill: #ff4444;
          opacity: 0.8;
        }

        .one-way-indicator.active {
          fill: #00ff00;
          opacity: 1;
        }

        .one-way-indicator.available {
          fill: #ffff00;
          opacity: 0.9;
        }

        .pulse-circle {
          fill: #ffff00;
          opacity: 0;
          animation: pulse-fill 1.5s infinite;
        }

        .arrow-head {
          filter: drop-shadow(0px 0px 1px rgba(255, 255, 255, 0.3));
        }

        @keyframes pulse-fill {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.8; }
        }

        .node {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 68, 68, 0.2);
          border: 2px solid #ff4444;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 3;
          pointer-events: auto;
          box-sizing: border-box;
          /* Increase node size further */
          width: 15%;
          height: 15%;
          min-width: unset;
          min-height: unset;
          max-width: unset;
          max-height: unset;
          box-shadow: 0 0 5px rgba(255, 68, 68, 0.3);
        }

        .node-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          width: 160%;  /* Make content even wider than the node */
          height: 100%;
          overflow: visible;
          position: relative;
          z-index: 6;
        }

        .node-name {
          font-size: min(16px, 2.5vw);
          line-height: 1.2;
          text-align: center;
          max-height: none;
          overflow: visible;
          display: block;
          padding: 2px;
          color: #ffffff;
          text-shadow: 
            -1px -1px 0 #000,  
             1px -1px 0 #000,
            -1px  1px 0 #000,
             1px  1px 0 #000,
            0 0 8px rgba(0, 0, 0, 0.8);
          white-space: nowrap;
          font-weight: 500;
        }

        .power-drain {
          margin-top: 0.2rem;
          color: #ffffff;
          font-size: min(14px, 2vw);
          text-shadow: 
            -1px -1px 0 #000,  
             1px -1px 0 #000,
            -1px  1px 0 #000,
             1px  1px 0 #000,
            0 0 8px rgba(0, 0, 0, 0.8),
            0 0 4px rgba(255, 68, 68, 0.8);
          font-weight: 500;
        }

        .node-junction {
          width: 6% !important; /* Slightly increased for better proportion */
          height: 6% !important;
          min-width: unset;
          min-height: unset;
          max-width: unset;
          max-height: unset;
        }

        /* Enhanced hover effect */
        .node:hover .node-content {
          transform: scale(1.15);
          z-index: 10;
        }

        .node:hover .node-name,
        .node:hover .power-drain {
          font-weight: 600;
          text-shadow: 
            -1px -1px 0 #000,  
             1px -1px 0 #000,
            -1px  1px 0 #000,
             1px  1px 0 #000,
            0 0 10px rgba(0, 0, 0, 0.9),
            0 0 5px rgba(255, 255, 255, 0.5);
        }

        /* Add specific color for power drain on hover */
        .node:hover .power-drain {
          text-shadow: 
            -1px -1px 0 #000,  
             1px -1px 0 #000,
            -1px  1px 0 #000,
             1px  1px 0 #000,
            0 0 10px rgba(0, 0, 0, 0.9),
            0 0 6px rgba(255, 68, 68, 0.9);
        }

        /* Adjust indicators for larger node size */
        .key-indicator {
          position: absolute;
          top: -10px;
          right: -10px;
          font-size: min(18px, 3vw);
          filter: drop-shadow(0 0 3px rgba(255, 255, 0, 0.8));
          content: "⚡";
        }

        .lock-indicator {
          position: absolute;
          bottom: -10px;
          right: -10px;
          font-size: min(18px, 3vw);
          filter: drop-shadow(0 0 3px rgba(255, 0, 0, 0.8));
        }

        .node.in-path {
          background: rgba(0, 255, 0, 0.2);
          border-color: #00ff00;
          border-width: 3px;
          box-shadow: 0 0 8px rgba(0, 255, 0, 0.5);
        }

        .node.last-in-path {
          animation: pulse 1.5s infinite alternate;
        }

        .node.has-key::after {
          content: "⚡";
          position: absolute;
          width: min(12px, 2.5vw);
          height: min(12px, 2.5vw);
          background: transparent;
          color: #ffff00;
          border-radius: 50%;
          top: -5px;
          right: -5px;
          animation: glow 1s infinite alternate;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: min(18px, 3vw);
          text-shadow: 0 0 5px rgba(255, 255, 0, 0.8);
        }

        .node.locked {
          opacity: 0.5;
          background: rgba(255, 68, 68, 0.1);
          border-style: dashed;
        }

        .node.can-select {
          box-shadow: 0 0 10px 2px rgba(0, 255, 0, 0.5);
          cursor: pointer;
          z-index: 4;
          filter: brightness(1.2);
        }

        .node-reactor-core {
          background: rgba(255, 165, 0, 0.3);
          border-color: orange;
          z-index: 5;
          box-shadow: 0 0 12px rgba(255, 165, 0, 0.5);
        }

        /* Remove special styling for pilot controls and life support */
        /*.node-pilot-controls, .node-life-support {
          background: rgba(0, 191, 255, 0.3);
          border-color: deepskyblue;
          z-index: 5;
          box-shadow: 0 0 12px rgba(0, 191, 255, 0.5);
        }*/

        @media (max-width: 900px) {
          .ship-map {
            max-width: min(800px, 90vw);
          }
          
          .connection {
            stroke-width: 2px;
          }
          
          .connection.active {
            stroke-width: 3px;
          }
        }

        @media (max-width: 768px) {
          .ship-map {
            max-width: min(700px, 90vw);
          }
          
          .node {
            transform-origin: center center;
          }
          
          .connection {
            stroke-width: 1.5px;
          }
        }
        
        @media (max-width: 480px) {
          .ship-map {
            max-width: min(400px, 95vw);
          }
          
          .connection {
            stroke-width: 1.5px;
          }
          
          .connection.active {
            stroke-width: 2.5px;
          }

          .game-header {
            font-size: 0.9rem;
          }

          .power-level, .keys-collected {
            font-size: 0.9rem;
            margin-top: 0.3rem;
          }

          .node-name {
            font-size: min(14px, 3vw);
          }
          
          .power-drain {
            font-size: min(12px, 2.5vw);
          }
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(0, 255, 0, 0.4);
          }
          100% {
            box-shadow: 0 0 0 15px rgba(0, 255, 0, 0);
          }
        }

        @keyframes glow {
          0% {
            box-shadow: 0 0 5px 0 rgba(255, 255, 0, 0.8);
          }
          100% {
            box-shadow: 0 0 20px 5px rgba(255, 255, 0, 0.4);
          }
        }

        @keyframes pulse-connection {
          0% {
            stroke-width: 1;
            opacity: 0.6;
          }
          50% {
            stroke-width: 2;
            opacity: 0.9;
          }
          100% {
            stroke-width: 1;
            opacity: 0.6;
          }
        }

        .controls {
          display: flex;
          justify-content: center;
          margin-top: 1rem;
        }

        .control-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .control-buttons button {
          min-width: 150px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          padding: 0.5rem 1rem;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .reset-button {
          border: 2px solid #ff4444;
          color: #ff4444;
        }

        .reset-button:hover {
          background: rgba(255, 68, 68, 0.1);
          box-shadow: 0 0 10px rgba(255, 68, 68, 0.5);
        }

        .accept-button {
          border: 2px solid #00ff00;
          color: #00ff00;
        }

        .accept-button:hover {
          background: rgba(0, 255, 0, 0.1);
          box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
        }

        .manual-button {
          border: 2px solid #4444ff;
          color: #4444ff;
        }

        .manual-button:hover {
          background: rgba(68, 68, 255, 0.1);
          box-shadow: 0 0 10px rgba(68, 68, 255, 0.5);
        }

        .power-depleted {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .win-overlay, .instructions-overlay {
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

        .win-content, .instructions-content {
          background: rgba(0, 0, 0, 0.95);
          border: 2px solid #00ff00;
          padding: 2rem;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          text-align: center;
          z-index: 101;
        }

        .instructions-content {
          border-color: #ff4444;
          display: flex;
          flex-direction: column;
        }

        .instructions-text {
          margin: 1.5rem 0;
          line-height: 1.6;
          flex: 1;
          overflow-y: auto;
          min-height: 0;
        }

        .instructions-content .start-button {
          flex-shrink: 0;
          margin-top: auto;
        }

        .start-button {
          background: none;
          border: 2px solid #ff4444;
          color: #ff4444;
          padding: 0.75rem 1.5rem;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
          margin-top: 1rem;
        }

        .start-button:hover {
          background: rgba(255, 68, 68, 0.1);
          box-shadow: 0 0 10px rgba(255, 68, 68, 0.5);
        }

        .highlight {
          color: #00ff00;
          font-weight: bold;
        }

        .usage-instructions {
          margin-top: 1.5rem;
          border-top: 1px dashed #ff4444;
          padding-top: 1.5rem;
        }

        .manual-overlay {
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

        .manual-content {
          background: rgba(0, 0, 0, 0.95);
          border: 2px solid #ff4444;
          padding: 2rem;
          max-width: 800px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          color: #ff4444;
        }

        .manual-content h2 {
          text-align: center;
          margin-bottom: 2rem;
          font-size: 1.8rem;
        }

        .manual-section {
          margin-bottom: 2rem;
          padding: 1rem;
          border: 1px solid rgba(255, 68, 68, 0.3);
        }

        .manual-section h3 {
          margin-bottom: 1rem;
          font-size: 1.4rem;
          text-align: center;
        }

        .manual-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
          padding: 0.5rem;
        }

        .connection-example {
          width: 100px;
          height: 4px;
          background: #ff4444;
          position: relative;
        }

        .connection-example.two-way {
          opacity: 0.7;
        }

        .connection-example.one-way {
          position: relative;
          display: flex;
          align-items: center;
        }

        .arrow-example {
          position: absolute;
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-bottom: 8px solid #ff4444;
          transform: rotate(90deg);
        }

        /* Position 5 arrows along the line */
        .arrow-example:nth-child(1) { left: 10%; }
        .arrow-example:nth-child(2) { left: 30%; }
        .arrow-example:nth-child(3) { left: 50%; }
        .arrow-example:nth-child(4) { left: 70%; }
        .arrow-example:nth-child(5) { left: 90%; }

        .color-example {
          width: 50px;
          height: 4px;
        }

        .color-example.normal {
          background: #ff4444;
          box-shadow: 0 0 5px #ff4444;
        }

        .color-example.active {
          background: #00ff00;
          box-shadow: 0 0 5px #00ff00;
        }

        .color-example.available {
          background: #ffff00;
          box-shadow: 0 0 5px #ffff00;
        }

        .stabilizer-example {
          font-size: 1.8rem;
          color: #ffff00;
          text-shadow: 0 0 5px #ffff00;
        }

        .requirements-list {
          list-style-type: none;
          padding: 0;
        }

        .requirements-list li {
          margin-bottom: 0.5rem;
          padding-left: 1rem;
          border-left: 2px solid rgba(255, 68, 68, 0.5);
        }

        .manual-close-button {
          background: none;
          border: 2px solid #ff4444;
          color: #ff4444;
          padding: 0.75rem 1.5rem;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 1rem;
          width: 100%;
        }

        .manual-close-button:hover {
          background: rgba(255, 68, 68, 0.1);
          box-shadow: 0 0 10px rgba(255, 68, 68, 0.5);
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

          .manual-content {
            padding: 1rem;
            font-size: 0.9rem;
          }

          .manual-content h2 {
            font-size: 1.4rem;
          }

          .manual-section h3 {
            font-size: 1.2rem;
          }

          .connection-example {
            width: 60px;
          }
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
          z-index: 10;
          font-size: 1.8rem;
        }

        .emergency-warning :global(.glitch-text) {
          position: relative;
          z-index: 10;
          color: #ff4444;
          text-shadow: 0 0 8px rgba(255, 68, 68, 0.8);
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
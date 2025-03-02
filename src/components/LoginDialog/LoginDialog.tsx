'use client';

import React, { useState } from 'react';

interface LoginDialogProps {
  type: 'crew' | 'admin';
  onSuccess: () => void;
  onCancel: () => void;
}

export default function LoginDialog({ type, onSuccess, onCancel }: LoginDialogProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const playSound = () => {
    const audio = new Audio('/sounds/click.mp3');
    audio.volume = 0.8;
    audio.play().catch(error => console.error('Audio play failed:', error));
  };

  const playGrantSound = () => {
    const audio = new Audio('/sounds/grant.mp3');
    audio.volume = 0.8;
    audio.play().catch(error => console.error('Audio play failed:', error));
  };

  const playDenySound = () => {
    const audio = new Audio('/sounds/deny.mp3');
    audio.volume = 0.8;
    audio.play().catch(error => console.error('Audio play failed:', error));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setMessage('AUTHENTICATING...');
    playSound();

    const validCreds = credentials[type];
    
    // Simulate authentication delay
    setTimeout(() => {
      if (username === validCreds.username && password === validCreds.password) {
        setMessage('ACCESS GRANTED');
        playGrantSound();
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setMessage('ACCESS DENIED');
        playDenySound();
        setPassword('');
        setTimeout(() => {
          setIsAuthenticating(false);
          setMessage('');
        }, 1500);
      }
    }, 1500);
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    playSound();
    onCancel();
  };

  const credentials = {
    crew: { username: 'crew', password: 'crew123' },
    admin: { username: 'ASHLI', password: 'thecrewmustdie' }
  };

  return (
    <div className="login-dialog">
      <div className="dialog-content">
        <h2 className="dialog-title">{type.toUpperCase()} LOGIN</h2>
        <div className="separator">========</div>
        {message && (
          <div className={
            message === 'ACCESS DENIED' ? 'error-message' : 
            message === 'ACCESS GRANTED' ? 'success-message' : 
            'loading-message'
          }>
            {message}
            <div className="separator">--------</div>
          </div>
        )}
        {!isAuthenticating && (
          <form onSubmit={handleSubmit}>
            <div className="input-field">
              <label>USERNAME:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toUpperCase())}
                autoFocus
              />
            </div>
            <div className="input-field">
              <label>PASSWORD:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="separator">--------</div>
            <div className="dialog-actions">
              <button 
                type="submit" 
                className="menu-item"
                onMouseEnter={playSound}
              >
                LOGIN
              </button>
              <button 
                type="button" 
                className="menu-item" 
                onClick={handleCancel}
                onMouseEnter={playSound}
              >
                CANCEL
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 
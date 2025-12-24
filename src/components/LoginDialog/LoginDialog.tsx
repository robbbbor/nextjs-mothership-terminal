'use client';

import { useState } from 'react';
import InfectedText from '../InfectedText/InfectedText';
import { useAudio } from '@/hooks/useAudio';
import { useRouter } from 'next/navigation';
import { useInfection } from '@/contexts/InfectionContext';

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
  const { playSound } = useAudio();
  const router = useRouter();
  const { isInfected } = useInfection();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setMessage('AUTHENTICATING...');
    playSound('click');

    const validCreds = credentials[type];
    
    // Simulate authentication delay
    setTimeout(() => {
      if (username === validCreds.username && password === validCreds.password) {
        setMessage('ACCESS GRANTED');
        playSound('grant');
        
        if (type === 'admin' && username === 'ASHLI') {
          if (isInfected) {
            console.log('Infection active, redirecting to Ashli page...');
            router.push('/ashli');
          } else {
            onSuccess();
          }
        } else {
          setTimeout(() => {
            onSuccess();
          }, 1500);
        }
      } else {
        setMessage('ACCESS DENIED');
        playSound('deny');
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
    playSound('click');
    onCancel();
  };

  const credentials = {
    crew: { username: 'crew', password: 'crew123' },
    admin: { username: 'ASHLI', password: 'thecrewmustdie' }
  };

  return (
    <div className="login-dialog">
      <div className="dialog-content">
        <h2 className="dialog-title">
          {type === 'admin' ? (
            <InfectedText originalText="ADMIN LOGIN" infectedText="ASHLI LOGIN" />
          ) : (
            `${type.toUpperCase()} LOGIN`
          )}
        </h2>
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
                onMouseEnter={() => playSound('click')}
              >
                LOGIN
              </button>
              <button 
                type="button" 
                className="menu-item" 
                onClick={handleCancel}
                onMouseEnter={() => playSound('click')}
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
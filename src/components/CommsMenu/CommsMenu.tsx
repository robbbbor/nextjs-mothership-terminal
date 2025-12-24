'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import TerminalInterface from '../Terminal/TerminalInterface';
import GlitchText from '../GlitchText/GlitchText';
import { useUser } from '@/contexts/UserContext';

interface CommsMessage {
  id?: string;
  sender: string;
  senderName?: string;
  subject: string;
  content: string;
  timestamp?: string;
  image?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  hasMalware?: boolean;
  read?: boolean;
}

export default function CommsMenu() {
  const router = useRouter();
  const { loggedInUser } = useUser();
  const [selectedMessage, setSelectedMessage] = useState<CommsMessage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [showInstalling, setShowInstalling] = useState(false);
  const [invertColors, setInvertColors] = useState(false);
  const [installProgress, setInstallProgress] = useState(0);
  const [showPopupAds, setShowPopupAds] = useState<number[]>([]);
  const [realTimeMessages, setRealTimeMessages] = useState<CommsMessage[]>([]);
  const [audioElements] = useState(() => {
    const basePath = process.env.NODE_ENV === 'production' ? '/nextjs-mothership-terminal' : '';
    return {
      click: typeof Audio !== 'undefined' ? new Audio(`${basePath}/click.mp3`) : null,
      grant: typeof Audio !== 'undefined' ? new Audio(`${basePath}/grant.mp3`) : null,
      deny: typeof Audio !== 'undefined' ? new Audio(`${basePath}/deny.mp3`) : null
    };
  });

  // Message subscription removed - Firebase dependency removed

  const playSound = (type: 'click' | 'grant' | 'deny' = 'click') => {
    try {
      const audio = audioElements?.[type];
      if (audio) {
        audio.volume = 0.8;
        audio.currentTime = 0;
        audio.play().catch(error => {
          console.warn(`Audio play failed: ${error.message}`);
        });
      }
    } catch (error) {
      console.warn(`Sound playback error: ${error}`);
    }
  };

  useEffect(() => {
    // Preload audio files
    if (typeof Audio !== 'undefined') {
      Object.values(audioElements || {}).forEach(audio => {
        if (audio) {
          audio.load();
        }
      });
    }

    // Clean up audio elements on unmount
    return () => {
      Object.values(audioElements || {}).forEach(audio => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      });
    };
  }, [audioElements]);

  // Error boundary for image loading
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.warn('Image failed to load:', e);
  };

  // Get all messages for display to the user (different filtering for admins vs regular users)
  const getPersonalMessages = (): CommsMessage[] => {
    // Admin users should see all messages, including system messages
    const isAdmin = loggedInUser === 'ADMIN';
    if (isAdmin) {
      console.log(`Admin user: showing all ${realTimeMessages.length} messages including system messages`);
      return realTimeMessages;
    }
    
    // For non-admin users, filter out system messages
    const userMessages = realTimeMessages.filter(msg => 
      msg.sender !== 'SYSTEM' // Exclude system messages for regular users
    );
    
    console.log(`Regular user: showing ${userMessages.length} messages (filtered from ${realTimeMessages.length})`);
    return userMessages;
  };

  const personalMessages = getPersonalMessages();

  const handleMessageClick = (message: CommsMessage) => {
    playSound('click');
    
    // Check if message contains malware link text - case insensitive, with or without brackets
    const hasMalwareLink = message.content && 
      message.content.toLowerCase().includes('totallynotamalwarelink.exe');
    
    // Add malware property dynamically to any message containing the link text
    const messageWithMalwareCheck = {
      ...message,
      hasMalware: hasMalwareLink || message.hasMalware
    };
    
    setSelectedMessage(messageWithMalwareCheck);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    playSound('click');
    setIsDialogOpen(false);
    setSelectedMessage(null);
    setIsImageZoomed(false);
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsImageZoomed(!isImageZoomed);
    playSound('click');
  };

  const handleMalwareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    playSound('click');
    setShowInstalling(true);
    setInstallProgress(0);

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setInstallProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    // Pop-up ads sequence
    setTimeout(() => setShowPopupAds(prev => [...prev, 1]), 500);
    setTimeout(() => setShowPopupAds(prev => [...prev, 2]), 800);
    setTimeout(() => setShowPopupAds(prev => prev.filter(id => id !== 1)), 1500);
    setTimeout(() => setShowPopupAds(prev => [...prev, 3]), 1200);
    setTimeout(() => setShowPopupAds(prev => prev.filter(id => id !== 2)), 1800);
    setTimeout(() => setShowPopupAds(prev => prev.filter(id => id !== 3)), 2000);

    // Complete installation
    setTimeout(() => {
      setShowInstalling(false);
      setInstallProgress(0);
      setShowPopupAds([]);
      setInvertColors(true);
      setTimeout(() => {
        setInvertColors(false);
      }, 500);
    }, 2000);
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!messageId || loggedInUser !== 'ADMIN') return;
    
    try {
      playSound('deny');
      // Message deletion removed - Firebase dependency removed
      setIsDialogOpen(false);
      setSelectedMessage(null);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  return (
    <div className={`main-menu ${invertColors ? 'invert' : ''}`}>
      <div className="header-container">
      <h1 className="menu-title"><GlitchText>Comms</GlitchText></h1>
        <div className="status-container">
          <div className="status-line">
            <GlitchText>subnet: </GlitchText>
            <span className="status-indicator offline">offline</span>
          </div>
          <div className="status-line">
            <GlitchText>local: </GlitchText>
            <span className="status-indicator online">online</span>
          </div>
        </div>
      </div>
      <div className="separator">========</div>
      
      <div className="comms-sections">
        {/* Personal Messages Section - Only shown if user is logged in */}
        {loggedInUser && (
          <div className="comms-section">
            <h2 className="section-title">
              <GlitchText>{`${loggedInUser} PERSONAL COMMS`}</GlitchText>
            </h2>
            <div className="messages-container">
              <div className="messages-header">
                <div className="header-sender">
                  <GlitchText>SENDER</GlitchText>
                </div>
                <div className="header-subject">
                  <GlitchText>SUBJECT</GlitchText>
                </div>
              </div>
              {personalMessages.length > 0 ? (
                personalMessages.map((message, index) => (
                  <button
                    key={message.id || index}
                    className="message-button menu-item"
                    onMouseEnter={() => playSound('click')}
                    onClick={() => handleMessageClick(message)}
                  >
                    <div className="message-preview">
                      <div className="preview-sender">
                        <GlitchText>{message.sender}</GlitchText>
                      </div>
                      <div className="preview-subject">
                        <GlitchText>{message.subject}</GlitchText>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="no-messages">
                  <GlitchText>NO MESSAGES</GlitchText>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Admin Message Panel - Removed (Firebase dependency) */}

        <a
          href="/main"
          className="menu-item back-button"
          onMouseEnter={() => playSound('click')}
          onClick={(e) => {
            e.preventDefault();
            playSound('click');
            setTimeout(() => {
              router.push('/main');
            }, 100);
          }}
        >
          <GlitchText>BACK TO MAIN MENU</GlitchText>
        </a>
      </div>

      {/* Message Dialog */}
      {isDialogOpen && selectedMessage && (
        <div className="dialog-overlay" onClick={handleCloseDialog}>
          <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
            <div className="message-header">
              <div className="message-info">
                <div className="message-sender">
                  <GlitchText>FROM: {selectedMessage.sender}</GlitchText>
                </div>
                <div className="message-subject">
                  <GlitchText>SUBJECT: {selectedMessage.subject}</GlitchText>
                </div>
                {selectedMessage.timestamp && (
                  <div className="message-timestamp">
                    <GlitchText>TIMESTAMP: {selectedMessage.timestamp}</GlitchText>
                  </div>
                )}
              </div>
              {loggedInUser === 'ADMIN' && selectedMessage.id && (
                <button 
                  className="delete-button" 
                  onClick={() => handleDeleteMessage(selectedMessage.id || '')}
                >
                  <GlitchText>DELETE MESSAGE</GlitchText>
                </button>
              )}
            </div>
            <div className="message-body">
              {selectedMessage.image && (
                <div className={`message-image ${isImageZoomed ? 'zoomed' : ''}`}>
                  <Image
                    src={selectedMessage.image.src}
                    alt={selectedMessage.image.alt}
                    width={selectedMessage.image.width}
                    height={selectedMessage.image.height}
                    onClick={handleImageClick}
                    onError={handleImageError}
                    priority
                    style={{ width: '100%', height: 'auto', cursor: 'pointer' }}
                  />
                </div>
              )}
              <div className="message-text">
                {selectedMessage.hasMalware ? (
                  selectedMessage.content.split(/\[?TotallyNotAMalwareLink\.exe\]?/i).map((part, index, array) => (
                    <React.Fragment key={index}>
                      <GlitchText>{part}</GlitchText>
                      {index < array.length - 1 && (
                        <span className="malware-link" onClick={handleMalwareClick}>
                          <GlitchText>[TotallyNotAMalwareLink.exe]</GlitchText>
                        </span>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <GlitchText>{selectedMessage.content}</GlitchText>
                )}
              </div>
            </div>
            <button className="dialog-close" onClick={handleCloseDialog}>
              <GlitchText>CLOSE</GlitchText>
            </button>
          </div>
        </div>
      )}

      {showInstalling && (
        <div className="installing-overlay">
          <div className="installing-content">
            <div className="install-header">
              <GlitchText>Installing TotallyNotMalware.exe</GlitchText>
              <div className="close-button">✕</div>
            </div>
            <div className="install-body">
              <div className="progress-container">
                <div 
                  className="progress-bar" 
                  style={{ width: `${Math.min(installProgress, 100)}%` }}
                />
              </div>
              <div className="install-status">
                <GlitchText>
                  {installProgress < 30 ? "Downloading additional RAM..." :
                   installProgress < 60 ? "Encrypting your files..." :
                   installProgress < 90 ? "Mining cryptocurrency..." :
                   "Installing backdoors..."}
                </GlitchText>
              </div>
            </div>
          </div>

          {/* Pop-up Ads */}
          {showPopupAds.includes(1) && (
            <div className="popup-ad" style={{ top: '20%', left: '30%' }}>
              <div className="ad-header">
                <GlitchText>CONGRATULATIONS!</GlitchText>
                <div className="close-button">✕</div>
              </div>
              <div className="ad-content">
                <GlitchText>YOU ARE THE 1,000,000th VISITOR!</GlitchText>
              </div>
            </div>
          )}
          {showPopupAds.includes(2) && (
            <div className="popup-ad" style={{ top: '40%', left: '60%' }}>
              <div className="ad-header">
                <GlitchText>WARNING!</GlitchText>
                <div className="close-button">✕</div>
              </div>
              <div className="ad-content">
                <GlitchText>YOUR SYNTHETIC BRAIN NEEDS UPDATING!</GlitchText>
              </div>
            </div>
          )}
          {showPopupAds.includes(3) && (
            <div className="popup-ad" style={{ top: '30%', left: '45%' }}>
              <div className="ad-header">
                <GlitchText>HOT ANDROIDS IN YOUR AREA!</GlitchText>
                <div className="close-button">✕</div>
              </div>
              <div className="ad-content">
                <GlitchText>CLICK HERE TO MEET SINGLES!</GlitchText>
              </div>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .comms-sections {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          margin: 1rem 0;
        }
        .comms-section {
          border: 1px solid var(--menu-text);
          padding: 1rem;
          background: rgba(0, 0, 0, 0.7);
        }
        .section-title {
          color: var(--menu-text);
          margin-bottom: 1rem;
          font-size: 1.2rem;
          text-shadow: var(--text-glow);
        }
        .messages-container {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .messages-header {
          display: grid;
          grid-template-columns: 200px 1fr;
          padding: 0.5rem 1rem;
          border-bottom: 1px solid var(--menu-text);
          margin-bottom: 0.5rem;
          opacity: 0.8;
        }
        .header-sender, .header-subject {
          font-size: 0.9em;
        }
        .message-button {
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          padding: 0.5rem 1rem;
          width: 100%;
          transition: all 0.3s ease;
          color: var(--menu-text);
          border-bottom: 1px solid rgba(var(--menu-text-rgb), 0.2);
          position: relative;
          overflow: hidden;
        }
        .message-button::before {
          content: none;
        }
        .message-button:last-child {
          border-bottom: none;
        }
        .message-button:hover {
          background: var(--menu-text);
          color: var(--background);
          text-shadow: none;
        }
        .message-button:hover :global(.glitch-text) {
          color: var(--background);
          text-shadow: none;
        }
        .message-preview {
          display: grid;
          grid-template-columns: minmax(150px, 200px) 1fr;
          width: 100%;
          gap: 0;
          position: relative;
        }
        .message-preview::after {
          content: '';
          position: absolute;
          left: minmax(150px, 200px);
          top: -0.5rem;
          bottom: -0.5rem;
          width: 1px;
          background-color: var(--menu-text);
          opacity: 0.3;
        }
        .preview-sender {
          padding-right: 1rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          min-width: 150px;
          max-width: 200px;
        }
        .preview-subject {
          padding-left: 1rem;
          opacity: 0.8;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          min-width: 0;
        }
        .no-messages {
          color: var(--menu-text);
          opacity: 0.6;
          font-style: italic;
          padding: 0.5rem 1rem;
          text-shadow: var(--text-glow);
        }
        .dialog-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .dialog-content {
          background: var(--background);
          border: 1px solid var(--menu-text);
          padding: 2rem;
          max-width: 80%;
          max-height: 80vh;
          overflow-y: auto;
          position: relative;
          font-family: "Glass TTY VT220", "VT323", monospace;
          color: var(--menu-text);
          text-shadow: var(--text-glow);
          font-size: 1.8rem;
          margin: 2rem;
          padding-top: 4rem;
        }
        .message-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--menu-text);
          padding-right: 2rem;
        }
        .message-info {
          margin-bottom: 0.5rem;
        }
        .message-sender {
          margin-bottom: 0.5rem;
        }
        .message-subject {
          margin-bottom: 0.5rem;
        }
        .message-timestamp {
          font-size: 1.4rem;
          opacity: 0.8;
          margin-top: 0.5rem;
        }
        .message-body {
          white-space: pre-wrap;
          line-height: 1.5;
        }
        .message-image {
          width: 100%;
          margin-bottom: 1rem;
          transition: transform 0.3s ease;
        }
        .message-image.zoomed {
          transform: scale(1.5);
        }
        .message-text {
          white-space: pre-wrap;
        }
        .dialog-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: none;
          border: 1px solid var(--menu-text);
          color: var(--menu-text);
          padding: 0.5rem 1rem;
          cursor: pointer;
          font-family: "Glass TTY VT220", "VT323", monospace;
          text-transform: uppercase;
          transition: all 0.2s ease;
          font-size: 1.8rem;
          text-shadow: var(--text-glow);
          z-index: 1;
        }
        .dialog-close:hover {
          color: var(--background);
          background-color: var(--menu-text);
          text-shadow: none;
        }
        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        .status-container {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          text-align: right;
        }
        .status-line {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.5rem;
        }
        .status-indicator {
          font-family: "Glass TTY VT220", "VT323", monospace;
          text-transform: lowercase;
        }
        .status-indicator.offline {
          color: #ff4444;
          text-shadow: 0 0 10px rgba(255, 68, 68, 0.8);
        }
        .status-indicator.online {
          color: #44ff44;
          text-shadow: 0 0 10px rgba(68, 255, 68, 0.8);
        }
        .malware-link {
          color: var(--menu-text);
          text-decoration: underline;
          cursor: pointer;
        }
        .malware-link:hover {
          color: #ff4444;
          text-shadow: 0 0 10px rgba(255, 68, 68, 0.8);
        }
        .installing-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000;
        }
        .installing-content {
          background: var(--background);
          border: 2px solid var(--menu-text);
          width: 400px;
          box-shadow: 0 0 20px rgba(var(--menu-text-rgb), 0.3);
        }
        .install-header {
          background: linear-gradient(to right, #000, #222);
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--menu-text);
        }
        .install-body {
          padding: 2rem;
        }
        .progress-container {
          width: 100%;
          height: 20px;
          background: #000;
          border: 1px solid var(--menu-text);
          margin: 1rem 0;
        }
        .progress-bar {
          height: 100%;
          background: linear-gradient(to right, #44ff44, #88ff88);
          transition: width 0.2s ease;
          box-shadow: 0 0 10px rgba(68, 255, 68, 0.5);
        }
        .install-status {
          text-align: center;
          margin-top: 1rem;
          font-size: 1.4rem;
        }
        .close-button {
          cursor: pointer;
          padding: 0.2rem 0.5rem;
          color: var(--menu-text);
          text-shadow: var(--text-glow);
        }
        .popup-ad {
          position: absolute;
          width: 300px;
          background: var(--background);
          border: 2px solid #ff4444;
          box-shadow: 0 0 20px rgba(255, 68, 68, 0.3);
          animation: popIn 0.3s ease;
        }
        .ad-header {
          background: linear-gradient(to right, #440000, #880000);
          padding: 0.8rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #ff4444;
        }
        .ad-content {
          padding: 1.5rem;
          text-align: center;
          font-size: 1.4rem;
        }
        @keyframes popIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .invert {
          filter: invert(1);
          transition: filter 0.1s ease;
        }
        .delete-button {
          background: rgba(255, 0, 0, 0.2);
          border: 1px solid rgba(255, 0, 0, 0.5);
          color: var(--foreground);
          padding: 0.5rem 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-left: 1rem;
        }
        .delete-button:hover {
          background: rgba(255, 0, 0, 0.4);
        }
      `}</style>

      <TerminalInterface />
    </div>
  );
} 
'use client';

import React, { useState } from 'react';
import styles from './Terminal.module.css';

interface Dialog {
  id: string;
  type: string;
  content: string[];
}

interface TerminalProps {
  data: {
    screens: {
      id: string;
      content: (string | { type: string; text?: string; target?: string | { target: string; type: string }[] })[];
    }[];
    dialogs: Dialog[];
  };
}

export default function Terminal({ data }: TerminalProps) {
    const [activeScreenId, setActiveScreenId] = useState<string>('main');
    const [activeDialog, setActiveDialog] = useState<Dialog | null>(null);

    const activeScreen = data.screens.find(screen => screen.id === activeScreenId);

    const handleLink = (target: string | { target: string; type: string }[]) => {
        if (typeof target === 'string') {
            setActiveScreenId(target);
        } else {
            const action = target[0];
            if (action.type === 'dialog') {
                const dialog = data.dialogs.find(d => d.id === action.target);
                if (dialog) setActiveDialog(dialog);
            } else {
                setActiveScreenId(action.target);
            }
        }
    };

    const handleDialogClose = () => {
        setActiveDialog(null);
    };

    return (
        <div className={styles.terminal}>
            <div className={styles.screen}>
                {activeScreen?.content.map((item, index) => {
                    if (typeof item === 'string') {
                        return <div key={index} className={styles.text}>{item || ' '}</div>;
                    }
                    
                    if (item.type === 'link') {
                        return (
                            <button 
                                key={index}
                                className={styles.link}
                                onClick={() => handleLink(item.target!)}
                            >
                                {item.text}
                            </button>
                        );
                    }
                    
                    return null;
                })}
            </div>

            {activeDialog && (
                <div className={styles.dialog} onClick={handleDialogClose}>
                    <div className={styles.dialogContent}>
                        {activeDialog.content.map((line, index) => (
                            <div key={index}>{line}</div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ColorblindMode, TextScale, ThemeMode } from '../types';

interface AccessibilityContextType {
  textScale: TextScale;
  setTextScale: (scale: TextScale) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  dyslexicFont: boolean;
  setDyslexicFont: (enabled: boolean) => void;
  colorblindMode: ColorblindMode;
  setColorblindMode: (mode: ColorblindMode) => void;
  sensoryFriendly: boolean;
  setSensoryFriendly: (enabled: boolean) => void;
  soundAlerts: boolean;
  setSoundAlerts: (enabled: boolean) => void;
  isSpeaking: boolean;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  resetAllSettings: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [textScale, setTextScale] = useState<TextScale>(() => {
    return (localStorage.getItem('cb_textScale') as TextScale) || '100%';
  });
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    return (localStorage.getItem('cb_themeMode') as ThemeMode) || 'standard';
  });
  const [dyslexicFont, setDyslexicFont] = useState<boolean>(() => {
    return localStorage.getItem('cb_dyslexicFont') === 'true';
  });
  const [colorblindMode, setColorblindMode] = useState<ColorblindMode>(() => {
    return (localStorage.getItem('cb_colorblindMode') as ColorblindMode) || 'none';
  });
  const [sensoryFriendly, setSensoryFriendly] = useState<boolean>(() => {
    return localStorage.getItem('cb_sensoryFriendly') === 'true';
  });
  const [soundAlerts, setSoundAlerts] = useState<boolean>(() => {
    return localStorage.getItem('cb_soundAlerts') !== 'false';
  });
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Synchronize CSS attributes on the HTML/Body
  useEffect(() => {
    localStorage.setItem('cb_textScale', textScale);
    const root = document.documentElement;
    if (textScale === '100%') root.style.fontSize = '16px';
    else if (textScale === '115%') root.style.fontSize = '18.4px';
    else if (textScale === '130%') root.style.fontSize = '20.8px';
    else if (textScale === '150%') root.style.fontSize = '24px';
  }, [textScale]);

  useEffect(() => {
    localStorage.setItem('cb_themeMode', themeMode);
    const body = document.body;
    body.classList.remove('high-contrast', 'high-contrast-dark', 'high-contrast-light', 'dark');

    if (themeMode === 'high-contrast-dark') {
      body.classList.add('high-contrast', 'high-contrast-dark', 'dark');
    } else if (themeMode === 'high-contrast-light') {
      body.classList.add('high-contrast', 'high-contrast-light');
    }
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem('cb_dyslexicFont', String(dyslexicFont));
    if (dyslexicFont) {
      document.body.classList.add('font-dyslexic');
    } else {
      document.body.classList.remove('font-dyslexic');
    }
  }, [dyslexicFont]);

  useEffect(() => {
    localStorage.setItem('cb_colorblindMode', colorblindMode);
    const body = document.body;
    body.classList.remove('cb-protanopia', 'cb-deuteranopia', 'cb-tritanopia', 'cb-achromatopsia');
    if (colorblindMode !== 'none') {
      body.classList.add(`cb-${colorblindMode}`);
    }
  }, [colorblindMode]);

  useEffect(() => {
    localStorage.setItem('cb_sensoryFriendly', String(sensoryFriendly));
    if (sensoryFriendly) {
      document.body.classList.add('sensory-friendly');
    } else {
      document.body.classList.remove('sensory-friendly');
    }
  }, [sensoryFriendly]);

  useEffect(() => {
    localStorage.setItem('cb_soundAlerts', String(soundAlerts));
  }, [soundAlerts]);

  // Web Speech API Voiceover TTS
  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }
    window.speechSynthesis.cancel(); // cancel any active speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; // gentle, intelligible pace
    utterance.pitch = 1.0;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const resetAllSettings = () => {
    setTextScale('100%');
    setThemeMode('standard');
    setDyslexicFont(false);
    setColorblindMode('none');
    setSensoryFriendly(false);
    setSoundAlerts(true);
    stopSpeaking();
  };

  return (
    <AccessibilityContext.Provider
      value={{
        textScale,
        setTextScale,
        themeMode,
        setThemeMode,
        dyslexicFont,
        setDyslexicFont,
        colorblindMode,
        setColorblindMode,
        sensoryFriendly,
        setSensoryFriendly,
        soundAlerts,
        setSoundAlerts,
        isSpeaking,
        speak,
        stopSpeaking,
        resetAllSettings,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

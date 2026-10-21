import React, { useEffect, useRef } from 'react';
import {
  X,
  Type,
  Sun,
  Moon,
  Eye,
  Sliders,
  Sparkles,
  Volume2,
  RotateCcw,
  Check,
  ZapOff,
  Keyboard
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import { TextScale, ThemeMode, ColorblindMode } from '../types';

interface A11yToolbarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const A11yToolbarModal: React.FC<A11yToolbarModalProps> = ({ isOpen, onClose }) => {
  const {
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
    speak,
    resetAllSettings
  } = useAccessibility();

  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const textScales: { scale: TextScale; label: string }[] = [
    { scale: '100%', label: 'Standard (16px)' },
    { scale: '115%', label: 'Large (18px)' },
    { scale: '130%', label: 'Extra Large (21px)' },
    { scale: '150%', label: 'Maximum (24px)' }
  ];

  const colorblindOptions: { mode: ColorblindMode; label: string; desc: string }[] = [
    { mode: 'none', label: 'Default / Full Spectrum', desc: 'Standard colors' },
    { mode: 'deuteranopia', label: 'Deuteranopia', desc: 'Green-blind adjustment' },
    { mode: 'protanopia', label: 'Protanopia', desc: 'Red-blind adjustment' },
    { mode: 'tritanopia', label: 'Tritanopia', desc: 'Blue-blind adjustment' },
    { mode: 'achromatopsia', label: 'Monochrome (Grayscale)', desc: 'High luminance only' }
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="a11y-modal-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h2 id="a11y-modal-title" className="text-xl font-bold text-slate-900 dark:text-white">
                Accessibility & Usability Hub
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Tailor typography, color perception, contrast, and cognitive stimulation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close accessibility hub"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors touch-target-accessible"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content Sections */}
        <div className="space-y-6 pt-5">
          {/* Section 1: Text Scaling */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 font-semibold text-sm sm:text-base text-slate-800 dark:text-slate-100">
                <Type className="w-4 h-4 text-brand-600" />
                <span>Text Size & Typography Scale</span>
              </label>
              <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                Active: {textScale}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {textScales.map(item => (
                <button
                  key={item.scale}
                  onClick={() => setTextScale(item.scale)}
                  aria-pressed={textScale === item.scale}
                  className={`p-3 rounded-xl border text-center transition-all touch-target-accessible flex flex-col items-center justify-center ${
                    textScale === item.scale
                      ? 'border-brand-600 bg-brand-50 dark:bg-brand-950/60 text-brand-900 dark:text-brand-200 font-bold ring-2 ring-brand-500'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-750'
                  }`}
                >
                  <span className="text-sm font-semibold">{item.scale}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: High Contrast Modes */}
          <div>
            <label className="flex items-center gap-2 font-semibold text-sm sm:text-base text-slate-800 dark:text-slate-100 mb-2">
              <Sun className="w-4 h-4 text-brand-600" />
              <span>Visual Contrast (WCAG 2.2 AAA Ratio)</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={() => setThemeMode('standard')}
                aria-pressed={themeMode === 'standard'}
                className={`p-3 rounded-xl border text-left flex items-center justify-between touch-target-accessible ${
                  themeMode === 'standard'
                    ? 'border-brand-600 bg-brand-50 dark:bg-brand-950/60 text-brand-900 dark:text-brand-200 font-bold ring-2 ring-brand-500'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div>
                  <div className="text-sm font-semibold">Standard</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Natural theme</div>
                </div>
                {themeMode === 'standard' && <Check className="w-4 h-4 text-brand-600" />}
              </button>

              <button
                onClick={() => setThemeMode('high-contrast-dark')}
                aria-pressed={themeMode === 'high-contrast-dark'}
                className={`p-3 rounded-xl border text-left flex items-center justify-between touch-target-accessible ${
                  themeMode === 'high-contrast-dark'
                    ? 'border-yellow-400 bg-black text-white font-bold ring-2 ring-yellow-400'
                    : 'border-slate-200 dark:border-slate-700 bg-black text-white'
                }`}
              >
                <div>
                  <div className="text-sm font-semibold text-yellow-300">High Contrast Dark</div>
                  <div className="text-xs text-slate-300">Pure black with yellow focus</div>
                </div>
                {themeMode === 'high-contrast-dark' && <Check className="w-4 h-4 text-yellow-400" />}
              </button>

              <button
                onClick={() => setThemeMode('high-contrast-light')}
                aria-pressed={themeMode === 'high-contrast-light'}
                className={`p-3 rounded-xl border text-left flex items-center justify-between touch-target-accessible ${
                  themeMode === 'high-contrast-light'
                    ? 'border-black bg-white text-black font-bold ring-2 ring-black'
                    : 'border-slate-200 dark:border-slate-700 bg-white text-black'
                }`}
              >
                <div>
                  <div className="text-sm font-semibold text-black">High Contrast Light</div>
                  <div className="text-xs text-slate-700">Deep black on clean white</div>
                </div>
                {themeMode === 'high-contrast-light' && <Check className="w-4 h-4 text-black" />}
              </button>
            </div>
          </div>

          {/* Section 3: Dyslexia-Friendly Font & Sensory Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 flex items-start justify-between">
              <div className="pr-2">
                <span className="font-semibold text-sm text-slate-800 dark:text-slate-100 block">
                  OpenDyslexic Font
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Weighted bottom letters designed to prevent rotation and letter flipping.
                </span>
              </div>
              <button
                onClick={() => setDyslexicFont(!dyslexicFont)}
                role="switch"
                aria-checked={dyslexicFont}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors touch-target-accessible ${
                  dyslexicFont ? 'bg-brand-600 justify-end' : 'bg-slate-300 dark:bg-slate-600 justify-start'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white shadow-md"></span>
              </button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 flex items-start justify-between">
              <div className="pr-2">
                <div className="flex items-center gap-1.5">
                  <ZapOff className="w-3.5 h-3.5 text-amber-500" />
                  <span className="font-semibold text-sm text-slate-800 dark:text-slate-100">
                    Sensory / Low Distraction
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Stops animations, suppresses pulse effects, and softens high saturation.
                </span>
              </div>
              <button
                onClick={() => setSensoryFriendly(!sensoryFriendly)}
                role="switch"
                aria-checked={sensoryFriendly}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors touch-target-accessible ${
                  sensoryFriendly ? 'bg-brand-600 justify-end' : 'bg-slate-300 dark:bg-slate-600 justify-start'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white shadow-md"></span>
              </button>
            </div>
          </div>

          {/* Section 4: Colorblind Simulation Palette Adjustment */}
          <div>
            <label className="flex items-center gap-2 font-semibold text-sm sm:text-base text-slate-800 dark:text-slate-100 mb-2">
              <Sliders className="w-4 h-4 text-brand-600" />
              <span>Color Vision Accommodation (Colorblind Mode)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {colorblindOptions.map(opt => (
                <button
                  key={opt.mode}
                  onClick={() => setColorblindMode(opt.mode)}
                  aria-pressed={colorblindMode === opt.mode}
                  className={`p-2.5 rounded-xl border text-left transition-colors touch-target-accessible ${
                    colorblindMode === opt.mode
                      ? 'border-brand-600 bg-brand-50 dark:bg-brand-950/60 text-brand-900 dark:text-brand-200 font-bold ring-2 ring-brand-500'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="text-xs sm:text-sm font-semibold">{opt.label}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Section 5: Audio & Keyboard Assistant */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-brand-600" />
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Integrated Voiceover / Speech Synthesis
                </span>
              </div>
              <button
                onClick={() =>
                  speak(
                    'Welcome to ClarityBites. All menus feature complete ingredient disclosures, seed oil transparency, and certified allergen protection.'
                  )
                }
                className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium text-xs shadow-sm flex items-center gap-1.5 touch-target-accessible"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Test Audio Voiceover</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Keyboard className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                <strong>Keyboard shortcuts:</strong> <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded font-mono">Tab</kbd> to cycle items,{' '}
                <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded font-mono">Space/Enter</kbd> to select,{' '}
                <kbd className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 rounded font-mono">Esc</kbd> to dismiss modals.
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={resetAllSettings}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Standard</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md transition-transform active:scale-95 touch-target-accessible"
          >
            Save & Close Hub
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useRef } from 'react';
import {
  X,
  ShieldAlert,
  ShieldCheck,
  Check,
  Sparkles
} from 'lucide-react';
import { useCartAndOrder } from '../context/CartAndOrderContext';
import { ALLERGEN_LIST, DIETARY_LIST } from '../data/mockData';
import { AllergenType, DietaryPreference } from '../types';

interface AllergenProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AllergenProfileModal: React.FC<AllergenProfileModalProps> = ({ isOpen, onClose }) => {
  const {
    profile,
    toggleAllergy,
    toggleDietaryPreference,
    clearAllergensAndDiet,
    setRequireDedicatedKitchen
  } = useCartAndOrder();

  const modalRef = useRef<HTMLDivElement>(null);

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

  const applyPreset = (allergies: AllergenType[], diets: DietaryPreference[]) => {
    clearAllergensAndDiet();
    setTimeout(() => {
      allergies.forEach(a => toggleAllergy(a));
      diets.forEach(d => toggleDietaryPreference(d));
    }, 10);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="allergen-modal-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-2xl shadow-2xl p-6 sm:p-8 my-8 max-h-[92vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 id="allergen-modal-title" className="text-xl font-bold text-slate-900 dark:text-white">
                Personal Allergen & Dietary Shield (Indian Rasoi)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Menus will highlight conflicts (Kaju gravies, Maida-Hing, Desi Ghee, Sarson) with safe substitution options.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close allergen shield setup"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors touch-target-accessible"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Quick Indian Presets */}
        <div className="pt-4 pb-2">
          <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Quick Indian Lifestyle & Medical Presets:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => applyPreset([], ['jain', 'pure-veg'])}
              className="px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 text-xs font-medium hover:bg-amber-100"
            >
              🙏 Strict Jain Satvik (No Onion/Garlic/Roots)
            </button>
            <button
              onClick={() => applyPreset(['gluten'], ['gluten-free', 'pure-veg'])}
              className="px-3 py-1.5 rounded-lg border border-yellow-300 bg-yellow-50 dark:bg-yellow-950/40 text-yellow-900 dark:text-yellow-200 text-xs font-medium hover:bg-yellow-100"
            >
              🌾 Celiac / Wheat & Hing Safe (Millets Only)
            </button>
            <button
              onClick={() => applyPreset(['tree-nuts', 'peanuts'], ['nut-free'])}
              className="px-3 py-1.5 rounded-lg border border-rose-300 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 text-xs font-medium hover:bg-rose-100"
            >
              🌰 Cashew & Almond Free (Nut-Safe Gravies)
            </button>
            <button
              onClick={() => applyPreset(['dairy'], ['vegan', 'dairy-free'])}
              className="px-3 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 text-xs font-medium hover:bg-emerald-100"
            >
              🥛🚫 100% Dairy-Free (No Ghee/Paneer/Malai)
            </button>
          </div>
        </div>

        {/* Section 1: Major Allergens Matrix */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <label className="font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
              <span>1. Select Your Allergens</span>
              <span className="text-xs font-normal text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-900">
                Active alerts will fire for any conflicts
              </span>
            </label>
            <span className="text-xs font-semibold text-slate-500">
              {profile.allergies.length} selected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {ALLERGEN_LIST.map(item => {
              const isSelected = profile.allergies.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggleAllergy(item.id)}
                  aria-pressed={isSelected}
                  className={`p-3 rounded-xl border text-left flex items-start justify-between transition-all touch-target-accessible ${
                    isSelected
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-950 dark:text-rose-100 font-bold ring-2 ring-rose-400'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl" role="img" aria-hidden="true">
                      {item.icon}
                    </span>
                    <div>
                      <div className="text-sm font-semibold">{item.label}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {item.severityLevel}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border mt-0.5 shrink-0 ${
                      isSelected
                        ? 'bg-rose-600 border-rose-600 text-white'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Dietary Preferences */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <label className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
              2. Indian Dietary & Lifestyle Goals
            </label>
            <span className="text-xs font-semibold text-slate-500">
              {profile.dietaryPreferences.length} active
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {DIETARY_LIST.map(diet => {
              const isSelected = profile.dietaryPreferences.includes(diet.id);
              return (
                <button
                  key={diet.id}
                  onClick={() => toggleDietaryPreference(diet.id)}
                  aria-pressed={isSelected}
                  className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors touch-target-accessible ${
                    isSelected
                      ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/50 text-amber-950 dark:text-amber-100 font-bold ring-2 ring-amber-500'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg" aria-hidden="true">
                      {diet.icon}
                    </span>
                    <span className="text-xs font-semibold">{diet.label}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-amber-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Kitchen Safety Protocols */}
        <div className="mt-6 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-start justify-between">
          <div className="pr-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                Require Sanitized Dedicated Handi / Kadai Station
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Instructs partner rasois to sanitize tawa, change ladles, and use isolated cookware for your order automatically.
            </p>
          </div>
          <button
            onClick={() => setRequireDedicatedKitchen(!profile.requireDedicatedKitchenArea)}
            role="switch"
            aria-checked={profile.requireDedicatedKitchenArea}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors touch-target-accessible shrink-0 ${
              profile.requireDedicatedKitchenArea ? 'bg-amber-600 justify-end' : 'bg-slate-300 dark:bg-slate-600 justify-start'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white shadow-md"></span>
          </button>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={clearAllergensAndDiet}
            className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-medium py-2 px-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Clear All Selections
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md transition-transform active:scale-95 touch-target-accessible"
          >
            Apply Allergen Shield
          </button>
        </div>
      </div>
    </div>
  );
};

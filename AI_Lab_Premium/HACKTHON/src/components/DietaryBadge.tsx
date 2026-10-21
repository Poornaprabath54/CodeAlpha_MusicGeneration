import React from 'react';
import { SpiceLevel, Dish } from '../types';

interface DietaryBadgeProps {
  type?: 'veg' | 'non-veg' | 'vegan' | 'jain' | 'egg' | 'dairy' | 'gluten' | 'spice';
  dish?: Dish;
  spiceLevel?: SpiceLevel;
  size?: 'sm' | 'md';
}

export const DietaryBadge: React.FC<DietaryBadgeProps> = ({ type, dish, spiceLevel, size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  // If dish is passed directly
  if (dish) {
    if (dish.isVegan) {
      return (
        <span
          className={`inline-flex items-center gap-1 font-bold rounded-lg bg-purple-50 border border-purple-200 text-purple-800 shadow-sm ${sizeClasses}`}
          title="100% Plant-Based Vegan"
        >
          <span className="text-[10px]">🟣</span>
          <span>VEGAN</span>
        </span>
      );
    }
    if (dish.isJain) {
      return (
        <span
          className={`inline-flex items-center gap-1 font-bold rounded-lg bg-amber-50 border border-amber-200 text-amber-900 shadow-sm ${sizeClasses}`}
          title="Jain Satvik"
        >
          <span className="text-[10px]">🟡</span>
          <span>JAIN</span>
        </span>
      );
    }
    if (dish.isVegetarian) {
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-bold rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 shadow-sm ${sizeClasses}`}
          title="100% Pure Vegetarian"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-emerald-200" />
          <span>VEG</span>
        </span>
      );
    }
    if (dish.isNonVeg) {
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-bold rounded-lg bg-rose-50 border border-rose-300 text-rose-800 shadow-sm ${sizeClasses}`}
          title="Non-Vegetarian"
        >
          <span className="w-2 h-2 rounded-full bg-rose-600 ring-2 ring-rose-200" />
          <span>NON-VEG</span>
        </span>
      );
    }
  }

  if (type === 'veg') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-bold rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 shadow-sm ${sizeClasses}`}
        title="100% Pure Vegetarian"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-emerald-200" />
        <span>VEG</span>
      </span>
    );
  }

  if (type === 'non-veg') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-bold rounded-lg bg-rose-50 border border-rose-300 text-rose-800 shadow-sm ${sizeClasses}`}
        title="Non-Vegetarian"
      >
        <span className="w-2 h-2 rounded-full bg-rose-600 ring-2 ring-rose-200" />
        <span>NON-VEG</span>
      </span>
    );
  }

  if (type === 'vegan') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-bold rounded-lg bg-purple-50 border border-purple-200 text-purple-800 shadow-sm ${sizeClasses}`}
        title="100% Plant-Based Vegan"
      >
        <span className="text-[10px]">🟣</span>
        <span>VEGAN</span>
      </span>
    );
  }

  if (type === 'jain') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-bold rounded-lg bg-amber-50 border border-amber-200 text-amber-900 shadow-sm ${sizeClasses}`}
        title="Jain Satvik"
      >
        <span className="text-[10px]">🟡</span>
        <span>JAIN</span>
      </span>
    );
  }

  if (type === 'egg') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-semibold rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-900 ${sizeClasses}`}
      >
        <span>🥚</span>
        <span>EGG</span>
      </span>
    );
  }

  if (type === 'dairy') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-semibold rounded-lg bg-blue-50 border border-blue-200 text-blue-900 ${sizeClasses}`}
      >
        <span>🥛</span>
        <span>DAIRY</span>
      </span>
    );
  }

  if (type === 'gluten') {
    return (
      <span
        className={`inline-flex items-center gap-1 font-semibold rounded-lg bg-amber-50 border border-amber-200 text-amber-900 ${sizeClasses}`}
      >
        <span>🌾</span>
        <span>GLUTEN</span>
      </span>
    );
  }

  if (type === 'spice' || spiceLevel) {
    const activeSpice = spiceLevel || 'Medium';
    const icon = activeSpice === 'Mild' ? '🍃' : activeSpice === 'Medium' ? '🌶️' : activeSpice === 'Spicy' ? '🌶️🌶️' : '🔥';
    return (
      <span
        className={`inline-flex items-center gap-1 font-semibold rounded-lg bg-slate-100 border border-slate-200 text-slate-800 ${sizeClasses}`}
        title={`Spice Level: ${activeSpice}`}
      >
        <span>{icon}</span>
        <span>{activeSpice}</span>
      </span>
    );
  }

  return null;
};

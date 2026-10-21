import React, { useEffect, useRef } from 'react';
import { X, Check, SlidersHorizontal, Sparkles, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DietaryPreference, RegionType, SpiceLevel } from '../types';
import { DIETARY_FILTERS, REGIONAL_CUISINES } from '../data/mockData';

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDietary: DietaryPreference[];
  onToggleDietary: (pref: DietaryPreference) => void;
  selectedRegion: RegionType;
  onSelectRegion: (reg: RegionType) => void;
  selectedSpice: SpiceLevel | 'All';
  onSelectSpice: (spice: SpiceLevel | 'All') => void;
  sortBy: 'featured' | 'rating' | 'prepTime' | 'priceAsc' | 'priceDesc';
  onSelectSort: (sort: 'featured' | 'rating' | 'prepTime' | 'priceAsc' | 'priceDesc') => void;
  onResetFilters: () => void;
  totalResultsCount: number;
}

export const FilterSheet: React.FC<FilterSheetProps> = ({
  isOpen,
  onClose,
  selectedDietary,
  onToggleDietary,
  selectedRegion,
  onSelectRegion,
  selectedSpice,
  onSelectSpice,
  sortBy,
  onSelectSort,
  onResetFilters,
  totalResultsCount,
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const SPICE_LEVELS: (SpiceLevel | 'All')[] = ['All', 'Mild', 'Medium', 'Spicy', 'Extra Spicy'];

  const SORT_OPTIONS: { id: 'featured' | 'rating' | 'prepTime' | 'priceAsc' | 'priceDesc'; label: string }[] = [
    { id: 'featured', label: 'Featured & Popular' },
    { id: 'rating', label: 'Highest Rated (4.8+)' },
    { id: 'prepTime', label: 'Fastest Prep Time' },
    { id: 'priceAsc', label: 'Price: Low to High' },
    { id: 'priceDesc', label: 'Price: High to Low' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm flex justify-center items-end sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="filter-sheet-title"
    >
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
        ref={sheetRef}
        className="w-full max-w-lg bg-white border-t sm:border border-slate-200 rounded-t-3xl sm:rounded-3xl shadow-2xl p-5 sm:p-6 max-h-[88vh] overflow-y-auto space-y-6 text-slate-900"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h2 id="filter-sheet-title" className="text-lg font-black text-slate-900">
                Filter & Refine Dishes
              </h2>
              <p className="text-xs text-slate-500">
                {totalResultsCount} matching Indian dishes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close filters"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Dietary & Food Type System */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Dietary Type & Allergies
            </span>
            {selectedDietary.length > 0 && (
              <span className="text-xs text-amber-700 font-bold">
                {selectedDietary.length} active
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {DIETARY_FILTERS.map(filter => {
              const isSelected = selectedDietary.includes(filter.id);

              return (
                <button
                  key={filter.id}
                  onClick={() => onToggleDietary(filter.id)}
                  className={`p-2.5 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50 text-slate-900 ring-1 ring-amber-400'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span>{filter.icon}</span>
                    <span className="truncate">{filter.label}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </section>

        {/* 2. Indian Regions */}
        <section className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Regional Cuisine
          </span>

          <div className="flex flex-wrap gap-2">
            {REGIONAL_CUISINES.map(cuis => {
              const isSelected = selectedRegion === cuis.id;

              return (
                <button
                  key={cuis.id}
                  onClick={() => onSelectRegion(cuis.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-white font-black shadow-md'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                  }`}
                >
                  {cuis.name}
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. Spice Level */}
        <section className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Spice Level
          </span>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {SPICE_LEVELS.map(spice => {
              const isSelected = selectedSpice === spice;

              return (
                <button
                  key={spice}
                  onClick={() => onSelectSpice(spice)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold text-center transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-amber-100 text-amber-900 border font-black'
                      : 'border-slate-200 bg-slate-50 text-slate-700 border hover:border-slate-300'
                  }`}
                >
                  {spice}
                </button>
              );
            })}
          </div>
        </section>

        {/* 4. Sort Options */}
        <section className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Sort By
          </span>

          <div className="space-y-1.5">
            {SORT_OPTIONS.map(opt => (
              <button
                key={opt.id}
                onClick={() => onSelectSort(opt.id)}
                className={`w-full p-2.5 rounded-xl border text-xs font-medium flex items-center justify-between text-left transition-colors ${
                  sortBy === opt.id
                    ? 'border-amber-500 bg-amber-50 text-slate-900 font-bold'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{opt.label}</span>
                {sortBy === opt.id && <Check className="w-4 h-4 text-amber-600" />}
              </button>
            ))}
          </div>
        </section>

        {/* Footer Actions */}
        <div className="pt-2 flex items-center gap-3 border-t border-slate-100">
          <button
            onClick={onResetFilters}
            className="px-4 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xs shadow-lg shadow-amber-500/20 text-center transition-transform active:scale-95"
          >
            Apply & View ({totalResultsCount} Dishes)
          </button>
        </div>
      </motion.div>
    </div>
  );
};

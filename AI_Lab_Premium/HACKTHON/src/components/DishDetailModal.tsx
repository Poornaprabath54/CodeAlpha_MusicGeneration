import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ShieldCheck,
  AlertTriangle,
  Droplets,
  Volume2,
  Activity,
  ChevronDown,
  ChevronUp,
  Star,
  Clock,
  Sparkles,
  Sliders,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dish } from '../types';
import { DietaryBadge } from './DietaryBadge';
import { useAccessibility } from '../context/AccessibilityContext';
import { useCartAndOrder } from '../context/CartAndOrderContext';

interface DishDetailModalProps {
  dish: Dish | null;
  onClose: () => void;
  onCustomize: (dish: Dish) => void;
  onDirectAddToCart?: (dish: Dish) => void;
}

export const DishDetailModal: React.FC<DishDetailModalProps> = ({
  dish,
  onClose,
  onCustomize,
  onDirectAddToCart
}) => {
  const { speak } = useAccessibility();
  const { hasAllergenConflict } = useCartAndOrder();

  const [portionMultiplier, setPortionMultiplier] = useState<number>(1);
  const [isKnowYourFoodExpanded, setIsKnowYourFoodExpanded] = useState<boolean>(true);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && dish) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dish, onClose]);

  if (!dish) return null;

  const conflicts = hasAllergenConflict(dish);
  const hasConflict = conflicts.length > 0;

  // Scaled nutrition facts
  const scaledNutrition = {
    calories: Math.round(dish.nutrition.calories * portionMultiplier),
    proteinG: Math.round(dish.nutrition.proteinG * portionMultiplier),
    carbsG: Math.round(dish.nutrition.carbsG * portionMultiplier),
    fatG: Math.round(dish.nutrition.fatG * portionMultiplier),
    sodiumMg: Math.round(dish.nutrition.sodiumMg * portionMultiplier),
    fiberG: Math.round(dish.nutrition.fiberG * portionMultiplier),
  };

  const handleReadFullIngredients = () => {
    const ingredientNames = dish.ingredients.map(i => i.name).join(', ');
    const oilText = dish.cookingOils.join(' and ');
    const speech = `${dish.name} from ${dish.restaurant}. Price is ${dish.price} rupees. Primary ingredients include: ${ingredientNames}. Prepared using ${oilText}. Cross contamination risk is ${dish.crossContaminationRisk}. ${dish.crossContaminationDetails}. Serving size: ${dish.servingSize}.`;
    speak(speech);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dish-detail-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        ref={modalRef}
        className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl my-6 max-h-[92vh] overflow-y-auto text-slate-900"
      >
        {/* Top Hero Image Banner */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden rounded-t-3xl bg-slate-100">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Floating Close Button */}
          <button
            onClick={onClose}
            aria-label="Close dish transparency details"
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-md text-slate-700 hover:text-slate-950 hover:bg-white transition-colors shadow-lg touch-target-accessible"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Floating Read Aloud Button */}
          <button
            onClick={handleReadFullIngredients}
            aria-label="Read complete ingredient and preparation breakdown out loud"
            className="absolute top-4 left-4 px-3 py-2 rounded-xl bg-white/90 backdrop-blur-md text-slate-900 hover:bg-white text-xs font-bold flex items-center gap-1.5 shadow-lg transition-colors touch-target-accessible"
          >
            <Volume2 className="w-4 h-4 text-amber-600" />
            <span>Read Aloud</span>
          </button>

          {/* Badges Over Image Bottom */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <DietaryBadge dish={dish} />
              <DietaryBadge spiceLevel={dish.spiceLevel} />
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/90 backdrop-blur-sm text-slate-900 border border-slate-200 shadow-sm">
                {dish.region}
              </span>
            </div>

            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-black text-xs shadow-md">
              <Star className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
              <span>{dish.rating} ({dish.reviewCount})</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 space-y-6">
          {/* Title, Restaurant, Price */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                {dish.cuisine} • {dish.category}
              </span>
              <h2 id="dish-detail-title" className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
                {dish.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 flex items-center gap-2">
                <span>By <strong className="text-slate-900 font-bold">{dish.restaurant}</strong></span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  {dish.prepTimeMins} mins
                </span>
                <span>•</span>
                <span>{dish.servingSize}</span>
              </p>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <div className="text-3xl font-black text-slate-900 font-mono">
                ₹{dish.price}
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 sm:justify-end">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Price Match Guaranteed
              </span>
            </div>
          </div>

          {/* Dish Description */}
          <p className="text-sm text-slate-700 leading-relaxed font-normal">
            {dish.description}
          </p>

          {/* Allergen Conflict Alert Banner */}
          {hasConflict && (
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <strong className="text-sm font-bold text-amber-900 block">
                  Allergen Shield Conflict Detected
                </strong>
                <p className="text-xs leading-relaxed text-amber-900">
                  This dish contains <strong className="font-bold">{conflicts.join(', ')}</strong> matching your saved allergen profile. You can customize this dish to exclude or swap this ingredient safely.
                </p>
              </div>
            </div>
          )}

          {/* Expandable "Know What’s In Your Food" Drawer */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 overflow-hidden shadow-sm">
            <button
              onClick={() => setIsKnowYourFoodExpanded(!isKnowYourFoodExpanded)}
              aria-expanded={isKnowYourFoodExpanded}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-100/70 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    Know What’s In Your Food
                  </h3>
                  <p className="text-xs text-slate-500">
                    Full ingredient disclosure, cooking oils, cross-contact & nutrition
                  </p>
                </div>
              </div>
              <div className="p-1 rounded-lg bg-white border border-slate-200 text-slate-600">
                {isKnowYourFoodExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </div>
            </button>

            <AnimatePresence>
              {isKnowYourFoodExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="px-4 pb-5 pt-1 space-y-5 border-t border-slate-200 bg-white"
                >
                  {/* Ingredients Breakdown */}
                  <div className="space-y-2.5 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-500">
                        Disclosed Ingredients ({dish.ingredients.length})
                      </span>
                      <span className="text-[11px] text-amber-700 font-bold">
                        {dish.customizations.filter(c => c.category === 'removals').length} Removable
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {dish.ingredients.map((ing, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                ing.isAllergen
                                  ? 'bg-rose-500 ring-2 ring-rose-200'
                                  : ing.isPrimary
                                  ? 'bg-amber-500'
                                  : 'bg-slate-400'
                              }`}
                            />
                            <span className="font-semibold text-slate-800">
                              {ing.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {ing.isAllergen && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-50 text-rose-800 border border-rose-300 font-bold uppercase">
                                {ing.allergenType}
                              </span>
                            )}
                            {ing.removable && (
                              <span className="text-[10px] text-emerald-700 font-medium">
                                Removable
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cooking Oils & Cross-Contamination */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1">
                      <div className="flex items-center gap-1.5 text-amber-900 text-xs font-black uppercase tracking-wider">
                        <Droplets className="w-3.5 h-3.5 text-amber-600" />
                        <span>Cooking Oils / Fats</span>
                      </div>
                      <p className="text-xs font-semibold text-amber-950">
                        {dish.cookingOils.join(', ')}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-900 text-xs font-black uppercase tracking-wider">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Cross-Contamination Protocol</span>
                      </div>
                      <p className="text-xs font-semibold text-emerald-950">
                        {dish.crossContaminationRisk}: {dish.crossContaminationDetails}
                      </p>
                    </div>
                  </div>

                  {/* Nutritional Facts with Portion Scaler */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-500">
                        <Activity className="w-3.5 h-3.5 text-amber-600" />
                        <span>Nutritional Profile</span>
                      </div>

                      {/* Scaler buttons */}
                      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200">
                        <span className="text-slate-500 px-1 text-[11px]">Portion:</span>
                        {[1, 1.5, 2].map(multiplier => (
                          <button
                            key={multiplier}
                            onClick={() => setPortionMultiplier(multiplier)}
                            className={`px-2 py-0.5 rounded-lg text-xs transition-colors ${
                              portionMultiplier === multiplier
                                ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            {multiplier}x
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] text-slate-500 block font-semibold">Calories</span>
                        <strong className="text-sm font-extrabold text-slate-900 font-mono">
                          {scaledNutrition.calories}
                        </strong>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] text-slate-500 block font-semibold">Protein</span>
                        <strong className="text-sm font-extrabold text-emerald-700 font-mono">
                          {scaledNutrition.proteinG}g
                        </strong>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] text-slate-500 block font-semibold">Carbs</span>
                        <strong className="text-sm font-extrabold text-amber-700 font-mono">
                          {scaledNutrition.carbsG}g
                        </strong>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] text-slate-500 block font-semibold">Fat</span>
                        <strong className="text-sm font-extrabold text-slate-900 font-mono">
                          {scaledNutrition.fatG}g
                        </strong>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] text-slate-500 block font-semibold">Sodium</span>
                        <strong className="text-sm font-extrabold text-slate-900 font-mono">
                          {scaledNutrition.sodiumMg}mg
                        </strong>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-[10px] text-slate-500 block font-semibold">Fiber</span>
                        <strong className="text-sm font-extrabold text-slate-900 font-mono">
                          {scaledNutrition.fiberG}g
                        </strong>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors touch-target-accessible text-center"
            >
              Close
            </button>

            <div className="w-full sm:w-auto flex items-center gap-2">
              {onDirectAddToCart && (
                <button
                  onClick={() => {
                    onDirectAddToCart(dish);
                    onClose();
                  }}
                  className="flex-1 sm:flex-none px-4 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 transition-colors touch-target-accessible shadow-sm"
                >
                  <Plus className="w-4 h-4 text-emerald-600" />
                  <span>Quick Add</span>
                </button>
              )}

              <button
                onClick={() => {
                  onClose();
                  onCustomize(dish);
                }}
                className="flex-1 sm:flex-none px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-sm shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition-transform active:scale-95 touch-target-accessible"
              >
                <Sliders className="w-4 h-4 text-slate-950" />
                <span>Customize & Add</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

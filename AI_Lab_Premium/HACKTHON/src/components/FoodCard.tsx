import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Star,
  Clock,
  AlertTriangle,
  Volume2,
  Sparkles,
  Plus,
  Minus,
  Sliders,
  ShieldCheck,
  Droplets,
  Flame,
  MapPin
} from 'lucide-react';
import { Dish, AllergenType } from '../types';
import { DietaryBadge } from './DietaryBadge';
import { useAccessibility } from '../context/AccessibilityContext';
import { useCartAndOrder } from '../context/CartAndOrderContext';

interface FoodCardProps {
  dish: Dish;
  isFavorite: boolean;
  onToggleFavorite: (dishId: string) => void;
  onInspectDetails: (dish: Dish) => void;
  onOpenCustomizer: (dish: Dish) => void;
  conflictingAllergens: AllergenType[];
  isAvailableAtCurrentLocation?: boolean;
  selectedLocationName?: string;
}

export const FoodCard: React.FC<FoodCardProps> = ({
  dish,
  isFavorite,
  onToggleFavorite,
  onInspectDetails,
  onOpenCustomizer,
  conflictingAllergens,
  isAvailableAtCurrentLocation = true,
  selectedLocationName
}) => {
  const { speak } = useAccessibility();
  const { cartItems, updateQuantity, addToCart } = useCartAndOrder();
  const [isHovered, setIsHovered] = useState(false);

  const hasConflict = conflictingAllergens.length > 0;

  // Find if this dish is already in the cart
  const cartItem = cartItems.find(item => item.dish.id === dish.id);
  const cartQuantity = cartItem ? cartItem.quantity : 0;

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (dish.customizations && dish.customizations.length > 0) {
      onOpenCustomizer(dish);
    } else {
      const dummyRest = {
        id: dish.restaurantId || 'rest-1',
        name: dish.restaurant,
        cuisine: dish.cuisine,
        address: selectedLocationName || 'Bengaluru, India',
        rating: dish.rating,
        reviewCount: dish.reviewCount,
        prepTimeMin: dish.prepTimeMins,
        prepTimeMax: dish.prepTimeMins + 10,
        baseDeliveryFee: 35,
        minimumOrder: 150,
        oilCommitment: dish.cookingOils.join(', '),
        dishes: [dish],
        allergenAuditCertified: true,
        segregatedCookingAreas: true,
        satvikJainDedicatedHandi: true,
      };
      addToCart(dish, dummyRest, 1, [], '', 'easy-open');
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartItem) {
      updateQuantity(cartItem.cartItemId, cartItem.quantity + 1);
    } else {
      handleAddClick(e);
    }
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cartItem) {
      updateQuantity(cartItem.cartItemId, cartItem.quantity - 1);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative rounded-3xl overflow-hidden bg-white border transition-all flex flex-col justify-between shadow-sm hover:shadow-xl ${
        hasConflict
          ? 'border-amber-400 ring-2 ring-amber-300/40'
          : 'border-slate-200/90 hover:border-amber-400/80'
      }`}
    >
      <div>
        {/* Card Image Container */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
            onClick={() => onInspectDetails(dish)}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />

          {/* Top Badges: Veg/Non-Veg & Bestseller */}
          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
            <DietaryBadge dish={dish} />

            {dish.rating >= 4.85 && (
              <span className="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow-md">
                ★ Bestseller
              </span>
            )}
          </div>

          {/* Favorite Heart Button */}
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={e => {
              e.stopPropagation();
              onToggleFavorite(dish.id);
            }}
            aria-label={isFavorite ? `Remove ${dish.name} from favorites` : `Add ${dish.name} to favorites`}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-colors z-10 shadow-sm"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-500'
              }`}
            />
          </motion.button>

          {/* Conflict Alert Banner Over Image */}
          {hasConflict && (
            <div className="absolute bottom-2 left-2 right-2 bg-amber-500 text-slate-950 px-2.5 py-1 rounded-xl font-black text-[11px] flex items-center gap-1.5 shadow-lg z-10">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>Allergen Shield: Contains {conflictingAllergens.join(', ')}</span>
            </div>
          )}

          {/* Distance & Prep Time Pill Over Image Bottom */}
          {!hasConflict && (
            <div className="absolute bottom-2.5 left-3 flex items-center gap-1.5 text-[11px] font-bold text-white z-10">
              <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/20 font-mono">
                ⚡ {dish.prepTimeMins} mins
              </span>
              <span className="bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/20">
                {dish.region}
              </span>
            </div>
          )}

          {/* SWIGGY SIGNATURE OVERLAPPING ADD / STEPPER BUTTON */}
          <div className="absolute -bottom-3.5 right-4 z-20">
            {cartQuantity === 0 ? (
              <div className="flex flex-col items-center">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddClick}
                  className="px-5 py-2 rounded-xl bg-white border-2 border-emerald-600 hover:bg-emerald-600 text-emerald-700 hover:text-white font-black text-xs shadow-lg transition-all flex items-center gap-1.5 uppercase tracking-wider"
                  aria-label={`Add ${dish.name} to cart`}
                >
                  <span>ADD</span>
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                </motion.button>
                {dish.customizations && dish.customizations.length > 0 && (
                  <span className="text-[9px] font-bold text-slate-500 mt-0.5 uppercase tracking-tighter">
                    Customisable
                  </span>
                )}
              </div>
            ) : (
              <div className="flex items-center bg-emerald-600 border-2 border-emerald-500 rounded-xl p-0.5 shadow-xl text-white">
                <button
                  onClick={handleDecrement}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-emerald-700 text-white transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5 stroke-[3]" />
                </button>
                <span className="w-6 text-center font-mono font-black text-xs text-white">
                  {cartQuantity}
                </span>
                <button
                  onClick={handleIncrement}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-emerald-700 text-white transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[3]" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Card Body Content */}
        <div className="p-4 sm:p-5 pt-5 space-y-3">
          <div className="space-y-1">
            <div className="flex items-start justify-between gap-2">
              <h3
                onClick={() => onInspectDetails(dish)}
                className="text-base sm:text-lg font-black text-slate-900 leading-snug group-hover:text-amber-600 transition-colors cursor-pointer"
              >
                {dish.name}
              </h3>
              <span className="text-lg font-black text-slate-900 font-mono shrink-0">
                ₹{dish.price}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="truncate font-semibold">{dish.restaurant}</span>
              <span className="flex items-center gap-1 text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span>{dish.rating} ({dish.reviewCount})</span>
              </span>
            </div>
          </div>

          {/* Description Preview */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">
            {dish.description}
          </p>

          {/* Rasoi Hygiene & Oil Disclosure Chips in Light Mode */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>99/100 Rasoi Audit</span>
            </span>

            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 truncate max-w-[170px]">
              <Droplets className="w-3 h-3 text-amber-600 shrink-0" />
              <span className="truncate">{dish.cookingOils[0]}</span>
            </span>
          </div>

          {/* Location Delivery Indicator */}
          {selectedLocationName && (
            <div className="text-[10px] font-medium text-slate-500 flex items-center gap-1 pt-0.5">
              <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
              <span className="truncate">Delivering from kitchen near {selectedLocationName.split(',')[0]} (1.4 km)</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Actions Bottom */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 flex items-center justify-between gap-2 border-t border-slate-100 mt-2">
        <button
          onClick={() => onInspectDetails(dish)}
          className="flex-1 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200 transition-colors text-center shadow-sm"
        >
          View Ingredients
        </button>

        <button
          onClick={() => onOpenCustomizer(dish)}
          className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300 transition-colors flex items-center gap-1 shadow-sm"
        >
          <Sliders className="w-3.5 h-3.5 text-amber-600" />
          <span>Customize</span>
        </button>
      </div>
    </motion.article>
  );
};

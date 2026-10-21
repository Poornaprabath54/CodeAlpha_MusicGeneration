import React from 'react';
import { Heart, ShoppingBag, Sliders, Star, Clock } from 'lucide-react';
import { Dish } from '../types';
import { DietaryBadge } from './DietaryBadge';

interface FavoritesViewProps {
  favoriteDishes: Dish[];
  onSelectDishForDetails: (dish: Dish) => void;
  onSelectDishForCustomize: (dish: Dish) => void;
  onToggleFavorite: (dishId: string) => void;
  onExploreDishes: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favoriteDishes,
  onSelectDishForDetails,
  onSelectDishForCustomize,
  onToggleFavorite,
  onExploreDishes
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 sm:pb-8 text-slate-900">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Heart className="w-6 h-6 fill-rose-500 text-rose-500" />
            <span>Your Favorite Dishes</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Quick access to your preferred safe regional Indian meals ({favoriteDishes.length})
          </p>
        </div>
      </div>

      {favoriteDishes.length === 0 ? (
        <div className="text-center py-20 space-y-4 rounded-3xl bg-white border border-slate-200 shadow-sm p-8">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500">
            <Heart className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">
              No favorites saved yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Tap the heart icon on any dish card across North, South, East, and West India to save it here for instant one-tap reordering.
            </p>
          </div>
          <button
            onClick={onExploreDishes}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-xs shadow-lg transition-transform hover:scale-105"
          >
            Explore Regional Menu
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {favoriteDishes.map(dish => (
            <div
              key={dish.id}
              className="p-4 rounded-3xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm flex gap-4 transition-all"
            >
              <img
                src={dish.image}
                alt={dish.name}
                onClick={() => onSelectDishForDetails(dish)}
                className="w-24 h-24 rounded-2xl object-cover shrink-0 cursor-pointer border border-slate-100"
              />

              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-1">
                    <h3
                      onClick={() => onSelectDishForDetails(dish)}
                      className="text-sm font-black text-slate-900 hover:text-amber-700 cursor-pointer truncate"
                    >
                      {dish.name}
                    </h3>

                    <button
                      onClick={() => onToggleFavorite(dish.id)}
                      aria-label="Remove from favorites"
                      className="p-1 text-rose-500 hover:scale-110 transition-transform"
                    >
                      <Heart className="w-4 h-4 fill-rose-500" />
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-500 truncate">
                    {dish.restaurant} • {dish.region}
                  </p>

                  <div className="flex items-center gap-1.5 pt-0.5">
                    <DietaryBadge dish={dish} />
                    <span className="text-xs font-mono font-black text-amber-600">
                      ₹{dish.price}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => onSelectDishForDetails(dish)}
                    className="flex-1 py-2 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-colors text-center"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => onSelectDishForCustomize(dish)}
                    className="py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Customize</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

import React from 'react';
import {
  Star,
  Clock,
  MapPin,
  ShieldCheck,
  Tag,
  ArrowRight,
  Flame,
  Award,
  Sparkles,
  Utensils
} from 'lucide-react';
import { Restaurant } from '../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onViewMenu: (restaurant: Restaurant) => void;
  isCurrentFilter?: boolean;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onViewMenu,
  isCurrentFilter = false,
}) => {
  return (
    <div
      onClick={() => onViewMenu(restaurant)}
      className={`group relative overflow-hidden rounded-3xl bg-white border transition-all duration-300 hover:shadow-xl cursor-pointer flex flex-col justify-between ${
        isCurrentFilter
          ? 'border-amber-500 ring-2 ring-amber-500/50 shadow-md'
          : 'border-slate-200 hover:border-amber-400'
      }`}
    >
      <div>
        {/* Cover Photo & Badges */}
        <div className="relative h-44 w-full overflow-hidden bg-slate-100">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

          {/* Top Left: Pure Veg / Jain / Heritage Badge */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {restaurant.isPureVeg && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white shadow-sm flex items-center gap-1">
                <span>🟢</span>
                <span>Pure Veg</span>
              </span>
            )}
            {restaurant.hasJainKitchen && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow-sm flex items-center gap-1">
                <span>🟡</span>
                <span>Jain Handi</span>
              </span>
            )}
            {!restaurant.isPureVeg && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-900/80 backdrop-blur-sm text-amber-300 border border-amber-500/30 shadow-sm">
                Heritage Kitchen
              </span>
            )}
          </div>

          {/* Top Right: Rating Pill */}
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-white/95 backdrop-blur-sm text-slate-900 text-xs font-black shadow-md flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span>{restaurant.rating}</span>
            <span className="text-[10px] text-slate-500 font-normal">({restaurant.reviewCount})</span>
          </div>

          {/* Bottom Left: Discount Tag Banner */}
          {restaurant.discountTag && (
            <div className="absolute bottom-2.5 left-3 px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 text-[11px] font-black tracking-wide flex items-center gap-1 shadow-sm">
              <Tag className="w-3 h-3" />
              <span>{restaurant.discountTag}</span>
            </div>
          )}

          {/* Bottom Right: Delivery Time */}
          <div className="absolute bottom-2.5 right-3 px-2 py-0.5 rounded-lg bg-slate-950/80 text-white text-[11px] font-bold flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>{restaurant.prepTime}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-3">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                {restaurant.name}
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">
              {restaurant.cuisine}
            </p>
          </div>

          {/* Telemetry: Location, Distance, Price for Two */}
          <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold pt-1 border-t border-slate-100 flex-wrap">
            <div className="flex items-center gap-1 text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="truncate max-w-[130px]">{restaurant.area}</span>
            </div>
            <span>•</span>
            <span className="text-emerald-700 font-bold">{restaurant.distanceKm} km away</span>
            <span>•</span>
            <span className="text-slate-500">₹{restaurant.priceForTwo} for two</span>
          </div>

          {/* Allergen & Kitchen Commitment */}
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Safety & Hygiene Certified</span>
              <span className="ml-auto px-1.5 py-0.2 rounded text-[10px] font-black bg-emerald-100 text-emerald-800">
                FSSAI {restaurant.hygieneScore}/5 ⭐
              </span>
            </div>
            {restaurant.oilCommitment && (
              <p className="text-[10px] text-slate-500 truncate">
                🫒 <strong className="text-slate-700">Cooking Oil:</strong> {restaurant.oilCommitment}
              </p>
            )}
          </div>

          {/* Featured Dishes Chips */}
          {restaurant.featuredDishes && restaurant.featuredDishes.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Popular Dishes:
              </span>
              <div className="flex flex-wrap gap-1">
                {restaurant.featuredDishes.slice(0, 3).map((dishName, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-medium"
                  >
                    {dishName}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-4 pt-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewMenu(restaurant);
          }}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-sm ${
            isCurrentFilter
              ? 'bg-amber-600 text-white'
              : 'bg-slate-900 hover:bg-amber-500 text-white hover:text-slate-950'
          }`}
        >
          <Utensils className="w-3.5 h-3.5" />
          <span>{isCurrentFilter ? 'Filtered: View Menu' : 'View Menu & Dishes'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

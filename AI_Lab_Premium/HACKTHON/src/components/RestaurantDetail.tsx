import React, { useState } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Clock,
  MapPin,
  Droplets,
  AlertTriangle,
  Volume2,
  CheckCircle2,
  Search
} from 'lucide-react';
import { Restaurant, Dish } from '../types';
import { useAccessibility } from '../context/AccessibilityContext';
import { useCartAndOrder } from '../context/CartAndOrderContext';
import { useLanguage } from '../context/LanguageContext';

interface RestaurantDetailProps {
  restaurant: Restaurant;
  onBack: () => void;
  onSelectDishForDetails: (dish: Dish) => void;
  onSelectDishForCustomize: (dish: Dish) => void;
}

export const RestaurantDetail: React.FC<RestaurantDetailProps> = ({
  restaurant,
  onBack,
  onSelectDishForDetails,
  onSelectDishForCustomize
}) => {
  const { speak } = useAccessibility();
  const { hasAllergenConflict } = useCartAndOrder();
  const { t } = useLanguage();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dishSearch, setDishSearch] = useState('');

  const categories = ['all', ...Array.from(new Set(restaurant.dishes.map(d => d.category)))];

  const filteredDishes = restaurant.dishes.filter(dish => {
    const matchesCategory = selectedCategory === 'all' || dish.category === selectedCategory;
    const matchesSearch =
      dish.name.toLowerCase().includes(dishSearch.toLowerCase()) ||
      dish.description.toLowerCase().includes(dishSearch.toLowerCase()) ||
      dish.ingredients.some(i => i.name.toLowerCase().includes(dishSearch.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Back button & Breadcrumb */}
      <div>
        <button
          onClick={onBack}
          aria-label={t('back_to_rasois')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 font-semibold text-sm shadow-sm touch-target-accessible"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t('back_to_rasois')}</span>
        </button>
      </div>

      {/* Restaurant Transparency Header Banner */}
      <section
        aria-labelledby="restaurant-name"
        className="bg-white/95 dark:bg-slate-800/90 rounded-3xl border-2 border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-md space-y-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                {restaurant.cuisine}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
                ★ {restaurant.rating} ({restaurant.reviewCount} reviews)
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                {restaurant.distanceKm} km away
              </span>
            </div>

            <h1 id="restaurant-name" className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              {restaurant.name}
            </h1>

            <p className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300">
              {restaurant.tagline}
            </p>

            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>{restaurant.address}</span>
            </div>
          </div>

          {/* Transparent Timing & Pricing Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-sm space-y-2 min-w-[260px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">{t('prep_time')}:</span>
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                {restaurant.prepTimeMin}-{restaurant.prepTimeMax} mins
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">{t('delivery')}:</span>
              <span className="font-bold text-slate-900 dark:text-white font-mono">
                ₹{restaurant.baseDeliveryFee}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t('exact_price_match')}</span>
            </div>
          </div>
        </div>

        {/* Safety & Oil Disclosures */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
            <h2 className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verified Food Safety Certifications</span>
            </h2>
            <ul className="text-xs text-emerald-950 dark:text-emerald-200 space-y-1">
              {restaurant.allergenCertifications.map((cert, idx) => (
                <li key={idx} className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{cert}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
            <h2 className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-amber-600" />
              <span>Desi Ghee & Cooking Oil Transparency</span>
            </h2>
            <p className="text-xs text-amber-950 dark:text-amber-200 font-medium">
              {restaurant.oilCommitment}
            </p>
            <div className="mt-2 text-[11px] text-amber-800 dark:text-amber-400">
              Zero sneaky unlisted palm oil, vegetable hydrogenated fats, or Dalda.
            </div>
          </div>
        </div>
      </section>

      {/* Menu Filter & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none" role="tablist">
            {categories.map(cat => (
              <button
                key={cat}
                role="tab"
                aria-selected={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold capitalize whitespace-nowrap transition-colors touch-target-accessible ${
                  selectedCategory === cat
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                {cat === 'all' ? 'Full Rasoi Menu' : cat}
              </button>
            ))}
          </div>

          <div className="relative sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={dishSearch}
              onChange={e => setDishSearch(e.target.value)}
              placeholder="Search dish, Dal, Biryani..."
              aria-label="Filter dishes in this restaurant"
              className="w-full pl-10 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-amber-600 focus:ring-0"
            />
          </div>
        </div>
      </div>

      {/* Dishes Feed */}
      <section aria-label="Indian dishes list" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDishes.map(dish => {
            const conflicts = hasAllergenConflict(dish);
            const hasConflict = conflicts.length > 0;

            return (
              <article
                key={dish.id}
                className={`group bg-white/95 dark:bg-slate-800/90 rounded-3xl border-2 overflow-hidden shadow-md hover:shadow-xl transition-all flex flex-col justify-between ${
                  hasConflict
                    ? 'border-amber-400 dark:border-amber-500/80 ring-2 ring-amber-400/30'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <div>
                  {/* Photo & Allergen Conflict Banner */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />

                    {/* Conflict Badge Over Image */}
                    {hasConflict && (
                      <div className="absolute top-3 left-3 right-3 bg-amber-500 text-slate-950 px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>
                          {t('allergen_alert')}: {t('contains')} {conflicts.join(', ')} (Modifiable)
                        </span>
                      </div>
                    )}

                    {/* Calories & Prep Time */}
                    <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-semibold">
                      {dish.nutrition.calories} kcal • {dish.prepTimeMins}m prep
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                          {dish.name}
                        </h3>
                        <span className="text-xs font-semibold text-slate-500">
                          {dish.category}
                        </span>
                      </div>
                      <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
                        ₹{dish.price}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                      {dish.description}
                    </p>

                    {/* Dietary Badges */}
                    <div className="flex flex-wrap gap-1.5">
                      {dish.dietaryTags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200 dark:border-emerald-800"
                        >
                          {tag}
                        </span>
                      ))}
                      {dish.allergens.length > 0 ? (
                        dish.allergens.map(allergen => (
                          <span
                            key={allergen}
                            className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${
                              hasAllergenConflict(dish).includes(allergen)
                                ? 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950 dark:text-rose-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-700 dark:text-slate-300'
                            }`}
                          >
                            Contains {allergen}
                          </span>
                        ))
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 text-[11px] font-bold border border-sky-200">
                          Top 9 Allergen-Free
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-5 pt-0 sm:p-6 sm:pt-0 space-y-2">
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => speak(dish.readAloudDescription)}
                      aria-label={`Read aloud details for ${dish.name}`}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 hover:text-amber-600 transition-colors touch-target-accessible flex items-center gap-1.5 text-xs font-semibold"
                    >
                      <Volume2 className="w-4 h-4 text-amber-600" />
                      <span className="hidden sm:inline">{t('listen')}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectDishForDetails(dish)}
                        aria-label={`View complete ingredients and nutrition for ${dish.name}`}
                        className="px-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 text-xs font-bold touch-target-accessible"
                      >
                        {t('ingredients_safety')}
                      </button>

                      <button
                        onClick={() => onSelectDishForCustomize(dish)}
                        aria-label={`Customize and add ${dish.name} to cart`}
                        className={`px-4 py-2.5 rounded-xl text-white font-bold text-xs sm:text-sm shadow-md transition-all touch-target-accessible ${
                          hasConflict
                            ? 'bg-amber-600 hover:bg-amber-700'
                            : 'bg-emerald-600 hover:bg-emerald-700'
                        }`}
                      >
                        {hasConflict ? t('modify_safe') : t('customize_add')}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};

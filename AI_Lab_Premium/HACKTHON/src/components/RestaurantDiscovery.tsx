import React, { useState } from 'react';
import {
  Search,
  Clock,
  MapPin,
  ShieldCheck,
  Award,
  Sparkles,
  Droplets,
  LayoutGrid,
  List,
  CheckCircle2,
  ChevronRight,
  Flame,
  Leaf
} from 'lucide-react';
import { Restaurant, DietaryPreference } from '../types';
import { MOCK_RESTAURANTS, DIETARY_LIST } from '../data/mockData';
import { useAccessibility } from '../context/AccessibilityContext';
import { useCartAndOrder } from '../context/CartAndOrderContext';
import { useLanguage } from '../context/LanguageContext';

interface RestaurantDiscoveryProps {
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onOpenAllergenProfile: () => void;
}

export const RestaurantDiscovery: React.FC<RestaurantDiscoveryProps> = ({
  onSelectRestaurant,
  onOpenAllergenProfile
}) => {
  const { sensoryFriendly } = useAccessibility();
  const { profile } = useCartAndOrder();
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDietaryFilter, setSelectedDietaryFilter] = useState<DietaryPreference | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'readable-list'>(sensoryFriendly ? 'readable-list' : 'grid');
  const [showPureGheeOnly, setShowPureGheeOnly] = useState(false);

  // Filter restaurants
  const filteredRestaurants = MOCK_RESTAURANTS.filter(restaurant => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.oilCommitment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.dishes.some(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

    if (!matchesSearch) return false;

    if (selectedDietaryFilter !== 'all') {
      const hasDishWithDiet = restaurant.dishes.some(d => d.dietaryTags.includes(selectedDietaryFilter));
      if (!hasDishWithDiet) return false;
    }

    if (showPureGheeOnly && !restaurant.oilCommitment.toLowerCase().includes('desi ghee')) {
      return false;
    }

    return true;
  });

  return (
    <section aria-labelledby="discovery-heading" className="space-y-8">
      {/* Hero Welcome & Value Proposition with Indian Aesthetic */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-emerald-950 text-white p-6 sm:p-10 shadow-2xl border-2 border-amber-600/30">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-semibold">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Accessible, Allergen-Safe Indian Food Ordering</span>
          </div>

          <h1 id="discovery-heading" className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            {t('hero_title')}
          </h1>

          <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
            {t('hero_subtitle')}
          </p>

          {/* Active Allergen Shield Banner */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAllergenProfile}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm shadow-lg transition-all active:scale-95 touch-target-accessible"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>
                {profile.allergies.length > 0
                  ? `Shield Active: ${profile.allergies.join(', ')}`
                  : 'Configure Allergen Shield (Kaju, Hing, Ghee)'}
              </span>
            </button>

            <span className="text-xs text-amber-200/80">
              {profile.allergies.length > 0 ? '✓ Conflicting Indian dishes are highlighted across all rasois' : 'Click to customize allergen safety'}
            </span>
          </div>
        </div>

        {/* Decorative soft glow */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Search & Accessibility Filters Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Accessible Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t('search_placeholder')}
              aria-label="Search Indian restaurants, cuisines, and dishes"
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm sm:text-base focus:border-amber-600 focus:ring-0 shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* View Mode Toggle (Grid vs High-Readability List) */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              aria-pressed={viewMode === 'grid'}
              aria-label="Switch to Grid View"
              className={`p-2.5 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">{t('visual_cards')}</span>
            </button>
            <button
              onClick={() => setViewMode('readable-list')}
              aria-pressed={viewMode === 'readable-list'}
              aria-label="Switch to High Readability List View"
              className={`p-2.5 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'readable-list'
                  ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">{t('high_readability')}</span>
            </button>
          </div>
        </div>

        {/* Dietary & Oil Quick Filters Horizontal Scroll */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedDietaryFilter('all')}
            aria-pressed={selectedDietaryFilter === 'all'}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition-colors touch-target-accessible ${
              selectedDietaryFilter === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            {t('all_kitchens')}
          </button>

          <button
            onClick={() => setShowPureGheeOnly(!showPureGheeOnly)}
            aria-pressed={showPureGheeOnly}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 border flex items-center gap-1.5 transition-colors touch-target-accessible ${
              showPureGheeOnly
                ? 'bg-amber-500 text-slate-950 border-amber-600 font-bold'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            }`}
          >
            <Droplets className="w-3.5 h-3.5 text-amber-600" />
            <span>{t('pure_ghee_only')}</span>
          </button>

          {DIETARY_LIST.map(diet => {
            const isSelected = selectedDietaryFilter === diet.id;
            return (
              <button
                key={diet.id}
                onClick={() => setSelectedDietaryFilter(isSelected ? 'all' : diet.id)}
                aria-pressed={isSelected}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 border flex items-center gap-1.5 transition-colors touch-target-accessible ${
                  isSelected
                    ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{diet.icon}</span>
                <span>{diet.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Discovery Results Count & Status */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Certified Indian Kitchens & Rasois ({filteredRestaurants.length})
        </h2>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {t('exact_price_match')}
        </span>
      </div>

      {/* Restaurants Display (Grid or High Readability List) */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRestaurants.map(restaurant => (
            <article
              key={restaurant.id}
              className="group bg-white/95 dark:bg-slate-800/90 rounded-3xl border-2 border-slate-200 dark:border-slate-700/80 overflow-hidden shadow-md hover:shadow-2xl hover:border-amber-500/60 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Hero Photo & Badges */}
                <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-100">
                  <img
                    src={restaurant.heroImage}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />

                  {/* Certified Badges Overlay */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {restaurant.safetyBadges.slice(0, 2).map(b => (
                      <span
                        key={b.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/85 backdrop-blur-md text-amber-300 text-xs font-bold border border-amber-400/40"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                        <span>{b.name}</span>
                      </span>
                    ))}
                  </div>

                  {/* Rating & Distance */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
                    <span className="bg-slate-900/85 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                      ★ {restaurant.rating} ({restaurant.reviewCount} verified reviews)
                    </span>
                    <span className="bg-slate-900/85 px-2.5 py-1 rounded-lg backdrop-blur-sm flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{restaurant.distanceKm} km</span>
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 sm:p-6 space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                        {restaurant.name}
                      </h3>
                      <span className="font-mono text-sm font-semibold text-slate-500">
                        {restaurant.priceRange}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-amber-700 dark:text-amber-400 mt-0.5">
                      {restaurant.tagline}
                    </p>
                  </div>

                  {/* Transparent Oil Commitment Card */}
                  <div className="p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-2">
                    <Droplets className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold text-amber-900 dark:text-amber-300 block">
                        Ghee, Oil & Fat Transparency:
                      </span>
                      <span className="text-xs text-amber-800 dark:text-amber-400">
                        {restaurant.oilCommitment}
                      </span>
                    </div>
                  </div>

                  {/* Accessibility Highlights */}
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                      Accessibility & Packaging:
                    </span>
                    <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-0.5">
                      {restaurant.accessibilityHighlights.slice(0, 2).map((item, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bottom Transparent Pricing & Discovery CTA */}
              <div className="p-5 pt-0 sm:p-6 sm:pt-0">
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
                  <div className="text-xs">
                    <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {t('prep_time')}: <strong>{restaurant.prepTimeMin}-{restaurant.prepTimeMax} min</strong>
                      </span>
                    </div>
                    <div className="text-slate-900 dark:text-slate-100 font-semibold mt-0.5">
                      {t('delivery')}: <strong>₹{restaurant.baseDeliveryFee}</strong> (Exact, zero markup)
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectRestaurant(restaurant)}
                    aria-label={`View menu for ${restaurant.name}`}
                    className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md flex items-center gap-1.5 group-hover:translate-x-1 transition-all touch-target-accessible"
                  >
                    <span>{t('inspect_menu')}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* High-Readability Accessible List View */
        <div className="space-y-4">
          {filteredRestaurants.map(restaurant => (
            <article
              key={restaurant.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 hover:border-amber-600 transition-colors shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                      {restaurant.name}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold">
                      {restaurant.cuisine}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold">
                      ★ {restaurant.rating}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                    {restaurant.tagline}
                  </p>

                  <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <strong>Oil & Fat Disclosure:</strong> {restaurant.oilCommitment}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {restaurant.safetyBadges.map(b => (
                      <span
                        key={b.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 text-xs font-medium"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                        <span>{b.name}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700 pt-3 md:pt-0 md:pl-6 gap-3">
                  <div className="text-left md:text-right">
                    <div className="text-xs text-slate-500">
                      {t('prep_time')}: <strong>{restaurant.prepTimeMin}-{restaurant.prepTimeMax} mins</strong>
                    </div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {t('delivery')}: ₹{restaurant.baseDeliveryFee}
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectRestaurant(restaurant)}
                    aria-label={`Inspect full menu and safety certificates for ${restaurant.name}`}
                    className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md touch-target-accessible"
                  >
                    {t('inspect_menu')}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

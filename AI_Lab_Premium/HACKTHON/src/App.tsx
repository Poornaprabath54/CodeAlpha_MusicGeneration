import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
  ShieldAlert,
  ShoppingBag,
  Bot,
  Heart,
  ChevronRight,
  Filter,
  RotateCcw,
  Check,
  Compass,
  ArrowRight,
  Satellite,
  Building2,
  Utensils,
  Radio,
  Navigation
} from 'lucide-react';
import { Header } from './components/Header';
import { FoodCard } from './components/FoodCard';
import { CuisineCard } from './components/CuisineCard';
import { RestaurantCard } from './components/RestaurantCard';
import { BottomNavigation, NavTab } from './components/BottomNavigation';
import { DishDetailModal } from './components/DishDetailModal';
import { CustomizationModal } from './components/CustomizationModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { AllergenProfileModal } from './components/AllergenProfileModal';
import { A11yToolbarModal } from './components/A11yToolbarModal';
import { AiVoiceAssistant } from './components/AiVoiceAssistant';
import { GpsSatelliteModal } from './components/GpsSatelliteModal';
import { FilterSheet } from './components/FilterSheet';
import { FavoritesView } from './components/FavoritesView';
import { ProfileView } from './components/ProfileView';
import { WhatsOnYourMind } from './components/WhatsOnYourMind';
import { OffersCarousel } from './components/OffersCarousel';
import { StickyBottomCart } from './components/StickyBottomCart';
import { SuperiorityBanner } from './components/SuperiorityBanner';
import { MobileDeviceFrame } from './components/MobileDeviceFrame';
import { useAccessibility } from './context/AccessibilityContext';
import { useCartAndOrder } from './context/CartAndOrderContext';
import { useLanguage } from './context/LanguageContext';
import { Dish, RegionType, DietaryPreference, SpiceLevel, Restaurant } from './types';
import { MOCK_DISHES, REGIONAL_CUISINES, DIETARY_FILTERS, DELIVERY_LOCATIONS, MOCK_RESTAURANTS, SUPPORTED_CITIES } from './data/mockData';

export const App: React.FC = () => {
  const { sensoryFriendly, reduceMotion } = useAccessibility();
  const { cartItems, profile, hasAllergenConflict, activeOrder, addToCart } = useCartAndOrder();
  const { t } = useLanguage();

  // Navigation tab state ('home' | 'explore' | 'orders' | 'favorites' | 'profile')
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  // Filter & Search state
  const [selectedLocation, setSelectedLocation] = useState<string>('Indiranagar, Bengaluru');

  const getCityFromLocation = (locName: string): string => {
    const hub = DELIVERY_LOCATIONS.find(l => l.name === locName);
    if (hub) return hub.city;
    if (locName.toLowerCase().includes('delhi')) return 'New Delhi';
    if (locName.toLowerCase().includes('mumbai')) return 'Mumbai';
    if (locName.toLowerCase().includes('hyderabad')) return 'Hyderabad';
    if (locName.toLowerCase().includes('kolkata')) return 'Kolkata';
    return 'Bengaluru';
  };

  const [selectedCity, setSelectedCity] = useState<string>(() => getCityFromLocation(selectedLocation));
  const [catalogViewMode, setCatalogViewMode] = useState<'dishes' | 'restaurants'>('dishes');
  const [filteredRestaurantName, setFilteredRestaurantName] = useState<string | null>(null);
  const [restaurantTypeFilter, setRestaurantTypeFilter] = useState<'all' | 'pure-veg' | 'jain' | 'high-rated'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<RegionType>('All');
  const [selectedDietary, setSelectedDietary] = useState<DietaryPreference[]>([]);
  const [selectedSpice, setSelectedSpice] = useState<SpiceLevel | 'All'>('All');
  const [selectedCraving, setSelectedCraving] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'rating' | 'prepTime' | 'priceAsc' | 'priceDesc'>('featured');

  // Favorites state
  const [favoriteDishIds, setFavoriteDishIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('foodaccess_favorites');
    return saved ? JSON.parse(saved) : ['dish-1', 'dish-2', 'dish-6'];
  });

  useEffect(() => {
    localStorage.setItem('foodaccess_favorites', JSON.stringify(favoriteDishIds));
  }, [favoriteDishIds]);

  const toggleFavorite = (dishId: string) => {
    setFavoriteDishIds(prev => {
      const exists = prev.includes(dishId);
      const updated = exists ? prev.filter(id => id !== dishId) : [...prev, dishId];
      triggerToast(exists ? 'Removed from favorites' : 'Added to favorites ❤️');
      return updated;
    });
  };

  // Modals state
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isA11yOpen, setIsA11yOpen] = useState(false);
  const [isAllergenProfileOpen, setIsAllergenProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  // Selected dish for modals
  const [selectedDishForDetails, setSelectedDishForDetails] = useState<Dish | null>(null);
  const [selectedDishForCustomize, setSelectedDishForCustomize] = useState<Dish | null>(null);

  // Mobile Device Frame toggle for desktop users
  const [isMobileDeviceView, setIsMobileDeviceView] = useState(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Quick Dietary Filter Toggle
  const handleToggleDietary = (pref: DietaryPreference) => {
    setSelectedDietary(prev => {
      const exists = prev.includes(pref);
      return exists ? prev.filter(p => p !== pref) : [...prev, pref];
    });
  };

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedRegion('All');
    setSelectedDietary([]);
    setSelectedSpice('All');
    setSelectedCraving('');
    setSortBy('featured');
    triggerToast('All filters reset');
  };

  // Direct quick add to cart
  const handleDirectAddToCart = (dish: Dish) => {
    const dummyRestaurant = {
      id: dish.restaurantId || 'rest-1',
      name: dish.restaurant,
      cuisine: dish.cuisine,
      address: selectedLocation,
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

    addToCart(
      dish,
      dummyRestaurant,
      1,
      [],
      '',
      'easy-open'
    );
    triggerToast(`Added ${dish.name} to cart! 🛍️`);
  };

  // Filter Dishes Engine
  const filteredDishes = MOCK_DISHES.filter(dish => {
    // Location Availability Filter
    if (dish.availableLocations && dish.availableLocations.length > 0) {
      if (!dish.availableLocations.includes(selectedLocation)) {
        return false;
      }
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matches =
        dish.name.toLowerCase().includes(q) ||
        dish.description.toLowerCase().includes(q) ||
        dish.cuisine.toLowerCase().includes(q) ||
        dish.region.toLowerCase().includes(q) ||
        dish.restaurant.toLowerCase().includes(q) ||
        dish.ingredients.some(i => i.name.toLowerCase().includes(q));
      if (!matches) return false;
    }

    // Craving Filter (What's on your mind)
    if (selectedCraving) {
      const c = selectedCraving.toLowerCase();
      const matchesCraving =
        dish.name.toLowerCase().includes(c) ||
        dish.cuisine.toLowerCase().includes(c) ||
        dish.category.toLowerCase().includes(c) ||
        dish.description.toLowerCase().includes(c);
      if (!matchesCraving) return false;
    }

    // Regional Filter
    if (selectedRegion !== 'All' && dish.region !== selectedRegion) {
      return false;
    }

    // Spice Level Filter
    if (selectedSpice !== 'All' && dish.spiceLevel !== selectedSpice) {
      return false;
    }

    // Dietary Preferences (Multi-select)
    if (selectedDietary.length > 0) {
      for (const filter of selectedDietary) {
        if (filter === 'veg' && !dish.isVegetarian) return false;
        if (filter === 'non-veg' && !dish.isNonVeg) return false;
        if (filter === 'vegan' && !dish.isVegan) return false;
        if (filter === 'jain' && !dish.isJain) return false;
        if (filter === 'gluten-free' && dish.containsGluten) return false;
        if (filter === 'dairy-free' && dish.containsDairy) return false;
        if (filter === 'eggless' && dish.containsEgg) return false;
        if (filter === 'low-spice' && dish.spiceLevel !== 'Mild') return false;
        if (filter === 'high-protein' && dish.nutrition.proteinG < 15) return false;
      }
    }

    // Filter by specific restaurant if selected
    if (filteredRestaurantName && dish.restaurant !== filteredRestaurantName) {
      return false;
    }

    return true;
  });

  // Sort Dishes
  const sortedDishes = [...filteredDishes].sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'prepTime') return a.prepTimeMins - b.prepTimeMins;
    if (sortBy === 'priceAsc') return a.price - b.price;
    if (sortBy === 'priceDesc') return b.price - a.price;
    return 0; // 'featured' retains catalog order
  });

  // Restaurants in Selected City Engine
  const cityRestaurants = MOCK_RESTAURANTS.filter(r => r.city === selectedCity);
  const filteredRestaurants = cityRestaurants.filter(r => {
    if (restaurantTypeFilter === 'pure-veg' && !r.isPureVeg) return false;
    if (restaurantTypeFilter === 'jain' && !r.hasJainKitchen) return false;
    if (restaurantTypeFilter === 'high-rated' && r.rating < 4.93) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        r.name.toLowerCase().includes(q) ||
        r.cuisine.toLowerCase().includes(q) ||
        r.area.toLowerCase().includes(q) ||
        (r.featuredDishes && r.featuredDishes.some(d => d.toLowerCase().includes(q)));
      if (!match) return false;
    }
    return true;
  });

  const favoriteDishes = MOCK_DISHES.filter(d => favoriteDishIds.includes(d.id));

  // The Primary Application Interface
  const appBody = (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between overflow-x-hidden selection:bg-amber-500 selection:text-white">
      {/* Ambient Subtle Warm Backdrop Glows */}
      {!sensoryFriendly && !reduceMotion && (
        <div className="pointer-events-none fixed inset-0 overflow-hidden z-0 opacity-10">
          <div className="ambient-orb-1 absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-gradient-to-br from-amber-400 via-orange-400 to-rose-400 blur-[140px]" />
          <div className="ambient-orb-2 absolute top-1/3 -right-32 w-[480px] h-[480px] rounded-full bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-500 blur-[150px]" />
          <div className="ambient-orb-3 absolute -bottom-36 left-1/4 w-[520px] h-[520px] rounded-full bg-gradient-to-tr from-amber-400 via-indigo-400 to-emerald-400 blur-[150px]" />
        </div>
      )}

      {/* Top Header */}
      <Header
        selectedLocation={selectedLocation}
        onLocationChange={loc => {
          setSelectedLocation(loc);
          setSelectedCity(getCityFromLocation(loc));
          setFilteredRestaurantName(null);
        }}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onOpenA11y={() => setIsA11yOpen(true)}
        onOpenAllergenProfile={() => setIsAllergenProfileOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracker={() => setIsTrackerOpen(true)}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        isMobileDeviceView={isMobileDeviceView}
        setIsMobileDeviceView={setIsMobileDeviceView}
        activeTab={activeTab}
        onTabChange={tab => setActiveTab(tab)}
      />

      {/* Main Content Landmark */}
      <main id="main-content" tabIndex={-1} className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* VIEW 1: HOME TAB */}
        {activeTab === 'home' && (
          <div className="space-y-8 pb-20 md:pb-8">
            {/* HERO SECTION */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-50 via-orange-50/70 to-emerald-50 border border-amber-200/80 p-6 sm:p-10 shadow-sm text-slate-900">
              {/* Decorative Subtle Background Flourish */}
              <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-amber-400/15 blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>FoodAccess • Good Food. For Everyone.</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-slate-900 drop-shadow-sm">
                  Discover India, One Plate at a Time.
                </h1>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl font-normal">
                  Authentic regional flavors with clear ingredients, verified allergens, and customized dietary choices for everyone.
                </p>

                {/* Animated Search Bar */}
                <div className="pt-2">
                  <div className="relative max-w-2xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search dishes, cuisines, ingredients (e.g. Butter Chicken, Dosa, Paneer, Momos)..."
                      aria-label="Search dishes, cuisines, ingredients"
                      className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 text-sm sm:text-base focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/15 shadow-md transition-all"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        aria-label="Clear search query"
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-slate-700 transition-colors"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Allergen Shield Pill Status */}
                <div className="pt-1 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setIsAllergenProfileOpen(true)}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors shadow-sm"
                  >
                    {profile.allergies.length > 0 ? (
                      <>
                        <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                        <span>Shield Active: <strong className="text-amber-800">{profile.allergies.join(', ')}</strong></span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Set Allergen Shield</span>
                      </>
                    )}
                  </button>

                  <span className="text-[11px] text-slate-500">
                    {profile.allergies.length > 0
                      ? 'Dishes containing your allergens are highlighted with a shield warning'
                      : 'Customize allergens to filter safely across all 28 states'}
                  </span>
                </div>
              </div>
            </section>

            {/* SWIGGY-STYLE OFFERS CAROUSEL */}
            <OffersCarousel onApplyCouponToast={code => triggerToast(`Applied coupon ${code}! 🎉`)} />

            {/* WHAT'S ON YOUR MIND (CIRCULAR CRAVING REEL) */}
            <WhatsOnYourMind
              selectedCraving={selectedCraving}
              onSelectCraving={keyword => {
                setSelectedCraving(keyword);
                if (keyword) triggerToast(`Filtered for ${keyword}`);
              }}
            />

            {/* LOCATION AVAILABILITY & GPS SATELLITE HUB BANNER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
                  <MapPin className="w-6 h-6 text-amber-600" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                      Live Delivery Hub • {selectedCity}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Hub Online
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                    <span>{selectedLocation}</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    <strong className="text-slate-800 font-bold">{cityRestaurants.length} Verified Restaurants</strong> in {selectedCity} •{' '}
                    <strong className="text-slate-800 font-bold">{sortedDishes.length} Dishes</strong> available
                  </p>
                </div>
              </div>

              {/* Action buttons: GPS Satellite Trigger + Neighborhood Switch */}
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <button
                  onClick={() => setIsLocationModalOpen(true)}
                  className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-black text-xs flex items-center gap-2 shadow-sm transition-transform active:scale-95 shrink-0"
                >
                  <Satellite className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span>GPS Satellite / Change City</span>
                </button>

                <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
                  {DELIVERY_LOCATIONS.filter(l => l.city === selectedCity).map(loc => (
                    <button
                      key={loc.id}
                      onClick={() => {
                        setSelectedLocation(loc.name);
                        setFilteredRestaurantName(null);
                        triggerToast(`Switched hub to ${loc.area}! 📍`);
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        selectedLocation === loc.name
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {loc.area}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* QUICK FILTER CHIPS BAR */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Quick Dietary Filters
                </span>

                <button
                  onClick={() => setIsFilterSheetOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-amber-400 text-xs font-bold text-slate-800 hover:text-amber-600 transition-colors shadow-sm"
                >
                  <Filter className="w-3.5 h-3.5 text-amber-600" />
                  <span>All Filters {selectedDietary.length > 0 && `(${selectedDietary.length})`}</span>
                </button>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {/* Reset all button if any active */}
                {(selectedDietary.length > 0 || selectedRegion !== 'All' || searchQuery) && (
                  <button
                    onClick={resetAllFilters}
                    className="shrink-0 px-3 py-2 rounded-2xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1 hover:bg-rose-100 transition-colors shadow-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                )}

                {/* Filter Pills */}
                {DIETARY_FILTERS.map(filter => {
                  const isSelected = selectedDietary.includes(filter.id);
                  return (
                    <button
                      key={filter.id}
                      onClick={() => handleToggleDietary(filter.id)}
                      className={`shrink-0 px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50 text-amber-900 ring-1 ring-amber-500/50 shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 shadow-sm'
                      }`}
                    >
                      <span>{filter.icon}</span>
                      <span>{filter.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 ml-0.5" />}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* "EXPLORE INDIA" REGIONAL CUISINES CAROUSEL */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                    <Compass className="w-5 h-5 text-amber-600" />
                    <span>Explore India</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Discover authentic heritage cuisines from across the country
                  </p>
                </div>

                {selectedRegion !== 'All' && (
                  <button
                    onClick={() => setSelectedRegion('All')}
                    className="text-xs text-amber-600 hover:text-amber-700 font-bold"
                  >
                    View All India
                  </button>
                )}
              </div>

              {/* Horizontal Scroll Carousel */}
              <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 scrollbar-none">
                {REGIONAL_CUISINES.map(cuis => (
                  <CuisineCard
                    key={cuis.id}
                    cuisine={cuis}
                    isSelected={selectedRegion === cuis.id}
                    onSelect={reg => setSelectedRegion(reg)}
                  />
                ))}
              </div>
            </section>

            {/* WHY FOODACCESS IS MORE THAN SWIGGY BANNER */}
            <SuperiorityBanner />

            {/* VIEW SWITCHER: DISHES VS RESTAURANTS IN SELECTED CITY */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
                <button
                  onClick={() => {
                    setCatalogViewMode('dishes');
                    setFilteredRestaurantName(null);
                  }}
                  className={`px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2 ${
                    catalogViewMode === 'dishes'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Browse Dishes ({sortedDishes.length})</span>
                </button>

                <button
                  onClick={() => setCatalogViewMode('restaurants')}
                  className={`px-4 py-2 rounded-lg text-xs font-black transition-all flex items-center gap-2 ${
                    catalogViewMode === 'restaurants'
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-600 hover:text-slate-950'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Restaurants in {selectedCity} ({filteredRestaurants.length})</span>
                </button>
              </div>

              <div className="flex items-center gap-2 px-2 text-xs text-slate-500 font-medium">
                <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Hub: <strong className="text-slate-700">{selectedLocation}</strong></span>
              </div>
            </div>

            {/* Active Restaurant Filter Pill (if viewing single restaurant menu) */}
            {filteredRestaurantName && (
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs font-bold shadow-sm animate-in fade-in">
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>
                    Viewing menu from <strong className="text-amber-900">{filteredRestaurantName}</strong> ({sortedDishes.length} dishes available)
                  </span>
                </div>
                <button
                  onClick={() => setFilteredRestaurantName(null)}
                  className="px-3 py-1 rounded-xl bg-white border border-amber-300 text-amber-800 hover:bg-amber-100 text-xs font-black shadow-xs transition-colors"
                >
                  Show All Restaurants ✕
                </button>
              </div>
            )}

            {/* VIEW MODE A: ALL RESTAURANTS IN SELECTED CITY */}
            {catalogViewMode === 'restaurants' && (
              <section className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-amber-600" />
                      <span>Verified Restaurants & Rasois in {selectedCity}</span>
                    </h2>
                    <p className="text-xs text-slate-500">
                      Showing {filteredRestaurants.length} heritage dining kitchens serving {selectedLocation} with strict allergen segregation & pure oil commitments
                    </p>
                  </div>

                  {/* Restaurant Filter Chips */}
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1 sm:pt-0">
                    <button
                      onClick={() => setRestaurantTypeFilter('all')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        restaurantTypeFilter === 'all'
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      All ({cityRestaurants.length})
                    </button>
                    <button
                      onClick={() => setRestaurantTypeFilter('pure-veg')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        restaurantTypeFilter === 'pure-veg'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      🟢 Pure Veg ({cityRestaurants.filter(r => r.isPureVeg).length})
                    </button>
                    <button
                      onClick={() => setRestaurantTypeFilter('jain')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        restaurantTypeFilter === 'jain'
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      🟡 Jain Handi ({cityRestaurants.filter(r => r.hasJainKitchen).length})
                    </button>
                    <button
                      onClick={() => setRestaurantTypeFilter('high-rated')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        restaurantTypeFilter === 'high-rated'
                          ? 'bg-amber-500 text-slate-950 shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      ⭐ 4.9+ Rated
                    </button>
                  </div>
                </div>

                {/* Restaurants Grid */}
                {filteredRestaurants.length === 0 ? (
                  <div className="text-center py-16 rounded-3xl bg-white border border-slate-200 p-8 space-y-4 shadow-sm">
                    <div className="w-16 h-16 mx-auto rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400">
                      <Building2 className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-slate-900">No restaurants match your filters in {selectedCity}</h3>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Try resetting your restaurant filter or switching to another city via GPS satellite navigation.
                      </p>
                    </div>
                    <button
                      onClick={() => setRestaurantTypeFilter('all')}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors shadow-sm"
                    >
                      Show All {selectedCity} Restaurants
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredRestaurants.map(rest => (
                      <RestaurantCard
                        key={rest.id}
                        restaurant={rest}
                        isCurrentFilter={filteredRestaurantName === rest.name}
                        onViewMenu={r => {
                          setFilteredRestaurantName(r.name);
                          setCatalogViewMode('dishes');
                          triggerToast(`Viewing verified dishes from ${r.name} 🍽️`);
                        }}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* VIEW MODE B: DISHES CATALOG GRID */}
            {catalogViewMode === 'dishes' && (
              <section className="space-y-4">
                {/* Horizontal Featured Restaurants Reel in Selected City */}
                {!filteredRestaurantName && cityRestaurants.length > 0 && (
                  <div className="space-y-2 pt-1 pb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-amber-600" />
                        <span>Restaurants in {selectedCity}:</span>
                      </span>
                      <button
                        onClick={() => setCatalogViewMode('restaurants')}
                        className="text-xs font-bold text-amber-600 hover:text-amber-700"
                      >
                        View All ({cityRestaurants.length}) →
                      </button>
                    </div>

                    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                      {cityRestaurants.map(r => (
                        <div
                          key={r.id}
                          onClick={() => {
                            setFilteredRestaurantName(r.name);
                            triggerToast(`Filtered for ${r.name} dishes 🍽️`);
                          }}
                          className="shrink-0 w-64 p-3 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 shadow-xs hover:shadow-sm cursor-pointer transition-all flex items-center gap-3 group"
                        >
                          <img
                            src={r.image}
                            alt={r.name}
                            className="w-12 h-12 rounded-xl object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="text-xs font-black text-slate-900 group-hover:text-amber-600 truncate">
                              {r.name}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate">
                              {r.cuisine}
                            </div>
                            <div className="text-[10px] text-emerald-700 font-bold">
                              ★ {r.rating} • {r.distanceKm} km away
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900">
                      {filteredRestaurantName
                        ? `${filteredRestaurantName} Menu`
                        : selectedRegion === 'All'
                        ? 'All Regional Dishes'
                        : `${selectedRegion} Specialties`}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Showing {sortedDishes.length} dishes available at <span className="font-semibold text-slate-800">{selectedLocation}</span> ({selectedCity})
                    </p>
                  </div>

                  {/* Sort dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-medium">Sort:</span>
                    <select
                      value={sortBy}
                      onChange={e => setSortBy(e.target.value as any)}
                      className="bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-amber-500 shadow-sm"
                    >
                      <option value="featured">Featured & Popular</option>
                      <option value="rating">Highest Rated (4.8+)</option>
                      <option value="prepTime">Fastest Prep Time</option>
                      <option value="priceAsc">Price: Low to High</option>
                      <option value="priceDesc">Price: High to Low</option>
                    </select>
                  </div>
                </div>

                {/* Dishes Grid */}
                {sortedDishes.length === 0 ? (
                  <div className="text-center py-16 rounded-3xl bg-white border border-slate-200 p-8 space-y-4 shadow-sm">
                    <div className="w-16 h-16 mx-auto rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400">
                      <Search className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-slate-900">No dishes match your filters for {selectedLocation}</h3>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Try relaxing your dietary filters, clearing your search term, or switching delivery locations.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        resetAllFilters();
                        setFilteredRestaurantName(null);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors shadow-sm"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {sortedDishes.map(dish => (
                      <FoodCard
                        key={dish.id}
                        dish={dish}
                        isFavorite={favoriteDishIds.includes(dish.id)}
                        onToggleFavorite={toggleFavorite}
                        onInspectDetails={d => setSelectedDishForDetails(d)}
                        onOpenCustomizer={d => setSelectedDishForCustomize(d)}
                        conflictingAllergens={hasAllergenConflict(dish)}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>
        )}

        {/* VIEW 2: EXPLORE TAB */}
        {activeTab === 'explore' && (
          <div className="space-y-6 pb-20 md:pb-8">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                Explore Regional Indian Flavors
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Delve into regional spices, traditional cooking oils, and unique recipes from across 28 states
              </p>
            </div>

            {/* Regional Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {REGIONAL_CUISINES.filter(c => c.id !== 'All').map(c => (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedRegion(c.id);
                    setActiveTab('home');
                  }}
                  className="group relative overflow-hidden rounded-3xl bg-white border border-slate-200 hover:border-amber-400 p-5 shadow-sm hover:shadow-md cursor-pointer transition-all hover:scale-[1.02]"
                >
                  <img
                    src={c.image}
                    alt={c.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />

                  <div className="relative z-10 space-y-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-50 text-amber-900 border border-amber-300">
                      {c.dishCount} Dishes
                    </span>
                    <h3 className="text-xl font-black text-slate-900">{c.name}</h3>
                    <p className="text-xs text-slate-600 font-medium">{c.subtitle}</p>

                    <div className="pt-2 flex items-center text-xs font-bold text-amber-600 gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Explore {c.name} Menu</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="max-w-2xl mx-auto space-y-6 pb-20 md:pb-8 text-slate-900">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Your Orders & Live Tracking
            </h1>

            {activeOrder ? (
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-xs text-emerald-700 font-bold uppercase tracking-wider flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      Active Live Order
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 mt-0.5">{activeOrder.restaurant.name}</h2>
                    <span className="text-xs text-slate-500">Order #{activeOrder.orderId}</span>
                  </div>

                  <button
                    onClick={() => setIsTrackerOpen(true)}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors shadow-sm"
                  >
                    Open Live Tracker
                  </button>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Status:</span>
                    <span className="text-amber-700 font-bold">
                      {activeOrder.steps[activeOrder.statusStepIndex]?.title}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">ETA:</span>
                    <span className="font-mono text-slate-900 font-bold">{activeOrder.etaMinutes} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Paid:</span>
                    <span className="font-mono text-amber-700 font-black text-sm">₹{activeOrder.total}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 rounded-3xl bg-white border border-slate-200 p-8 space-y-4 shadow-sm">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400">
                  <Clock className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">No active orders</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                    When you place an order with accessible delivery options, you can track its live progress here.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('home')}
                  className="px-6 py-3 rounded-2xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-colors shadow-sm"
                >
                  Order Food Now
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: FAVORITES TAB */}
        {activeTab === 'favorites' && (
          <FavoritesView
            favoriteDishes={favoriteDishes}
            onSelectDishForDetails={d => setSelectedDishForDetails(d)}
            onSelectDishForCustomize={d => setSelectedDishForCustomize(d)}
            onToggleFavorite={toggleFavorite}
            onExploreDishes={() => setActiveTab('home')}
          />
        )}

        {/* VIEW 5: PROFILE TAB */}
        {activeTab === 'profile' && (
          <ProfileView
            onOpenA11y={() => setIsA11yOpen(true)}
            onOpenAllergenProfile={() => setIsAllergenProfileOpen(true)}
            onOpenTracker={() => setIsTrackerOpen(true)}
            onNavigateTab={t => setActiveTab(t)}
          />
        )}
      </main>

      {/* Floating Buttons (Cart & AI Assistant) */}
      <div className="fixed bottom-20 md:bottom-8 right-4 sm:right-8 z-40 flex flex-col gap-3">
        {/* Floating Cart CTA */}
        {totalCartCount > 0 && !isCartOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsCartOpen(true)}
            aria-label={`View Cart: ${totalCartCount} items`}
            className="flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-white border border-slate-200 text-slate-900 font-black text-sm shadow-xl hover:scale-105 active:scale-95 transition-transform touch-target-accessible"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-amber-600" />
              <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-mono text-[9px] font-black flex items-center justify-center">
                {totalCartCount}
              </span>
            </div>
            <span>Cart</span>
          </motion.button>
        )}

        {/* AI Voice Assistant Trigger */}
        <button
          onClick={() => setIsAiAssistantOpen(true)}
          aria-label="Open FoodAccess AI Voice and Dietary Assistant"
          className="group flex items-center gap-2.5 px-4 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 touch-target-accessible transition-all hover:scale-105 active:scale-95"
        >
          <div className="w-6 h-6 rounded-full bg-slate-950 text-amber-400 flex items-center justify-center">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <span className="hidden sm:inline">Ask AI Concierge</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-950 text-white font-mono">
            Voice
          </span>
        </button>
      </div>

      {/* Swiggy-Style Floating Bottom Mini Cart */}
      <StickyBottomCart
        onOpenCart={() => setIsCartOpen(true)}
        isCartOpen={isCartOpen}
      />

      {/* Mobile Bottom Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={tab => setActiveTab(tab)}
        ordersBadgeCount={activeOrder ? 1 : 0}
        favoritesCount={favoriteDishIds.length}
      />

      {/* Footer (Desktop) */}
      <footer className="relative z-10 border-t border-slate-200 bg-white py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 hidden md:block">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">FoodAccess</span>
            <span>•</span>
            <span>Good Food. For Everyone. • WCAG AAA Accessible Design</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsA11yOpen(true)}
              className="hover:text-slate-900 underline font-medium"
            >
              Accessibility Settings
            </button>
            <button
              onClick={() => setIsAllergenProfileOpen(true)}
              className="hover:text-slate-900 underline font-medium"
            >
              Allergen Shield
            </button>
            <button
              onClick={() => setIsAiAssistantOpen(true)}
              className="hover:text-slate-900 underline font-medium"
            >
              AI Voice Concierge
            </button>
          </div>
        </div>
      </footer>

      {/* Interactive Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-slate-800 border border-slate-700 text-white font-bold text-xs shadow-2xl shadow-black/50 flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ALL MODALS */}
      <DishDetailModal
        dish={selectedDishForDetails}
        onClose={() => setSelectedDishForDetails(null)}
        onCustomize={d => setSelectedDishForCustomize(d)}
        onDirectAddToCart={handleDirectAddToCart}
      />

      <CustomizationModal
        dish={selectedDishForCustomize}
        isOpen={Boolean(selectedDishForCustomize)}
        onClose={() => setSelectedDishForCustomize(null)}
        onSuccessAddToCart={() => triggerToast('Customized dish added to cart! 🛍️')}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={() => {
          setIsTrackerOpen(true);
          triggerToast('Order placed successfully! 🎉');
        }}
      />

      <OrderTrackerModal
        isOpen={isTrackerOpen}
        onClose={() => setIsTrackerOpen(false)}
      />

      <AllergenProfileModal
        isOpen={isAllergenProfileOpen}
        onClose={() => setIsAllergenProfileOpen(false)}
      />

      <A11yToolbarModal
        isOpen={isA11yOpen}
        onClose={() => setIsA11yOpen(false)}
      />

      <AiVoiceAssistant
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        onSelectDish={d => setSelectedDishForDetails(d)}
      />

      <GpsSatelliteModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        selectedLocation={selectedLocation}
        onSelectLocation={(locName, city) => {
          setSelectedLocation(locName);
          setSelectedCity(city);
          setFilteredRestaurantName(null);
          triggerToast(`Updated delivery hub to ${locName}! 📍`);
        }}
      />

      <FilterSheet
        isOpen={isFilterSheetOpen}
        onClose={() => setIsFilterSheetOpen(false)}
        selectedDietary={selectedDietary}
        onToggleDietary={handleToggleDietary}
        selectedRegion={selectedRegion}
        onSelectRegion={setSelectedRegion}
        selectedSpice={selectedSpice}
        onSelectSpice={setSelectedSpice}
        sortBy={sortBy}
        onSelectSort={setSortBy}
        onResetFilters={resetAllFilters}
        totalResultsCount={sortedDishes.length}
      />
    </div>
  );

  return isMobileDeviceView ? (
    <MobileDeviceFrame
      isSimulated={true}
      onToggleSimulated={() => setIsMobileDeviceView(false)}
    >
      {appBody}
    </MobileDeviceFrame>
  ) : (
    appBody
  );
};

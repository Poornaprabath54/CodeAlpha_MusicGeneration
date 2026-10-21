import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Clock,
  Smartphone,
  Monitor,
  Eye,
  VolumeX,
  Sparkles,
  Bot,
  Globe,
  ChevronDown,
  MapPin,
  Heart,
  Compass,
  User,
  Search,
  Satellite
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import { useCartAndOrder } from '../context/CartAndOrderContext';
import { useLanguage } from '../context/LanguageContext';
import { DELIVERY_LOCATIONS } from '../data/mockData';

interface HeaderProps {
  onOpenA11y: () => void;
  onOpenAllergenProfile: () => void;
  onOpenCart: () => void;
  onOpenTracker: () => void;
  onOpenAiAssistant: () => void;
  isMobileDeviceView: boolean;
  setIsMobileDeviceView: (val: boolean) => void;
  activeTab?: string;
  onTabChange?: (tab: 'home' | 'explore' | 'orders' | 'favorites' | 'profile') => void;
  selectedLocation: string;
  onLocationChange: (loc: string) => void;
  onOpenLocationModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenA11y,
  onOpenAllergenProfile,
  onOpenCart,
  onOpenTracker,
  onOpenAiAssistant,
  isMobileDeviceView,
  setIsMobileDeviceView,
  activeTab = 'home',
  onTabChange,
  selectedLocation,
  onLocationChange,
  onOpenLocationModal
}) => {
  const { textScale, isSpeaking, stopSpeaking } = useAccessibility();
  const { profile, cartItems, activeOrder } = useCartAndOrder();
  const { currentLanguage, setLanguage, languageOptions, t } = useLanguage();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const activeLangOption = languageOptions.find(l => l.code === currentLanguage) || languageOptions[0];

  return (
    <>
      {/* Skip to Main Content Link for WCAG AAA Keyboard Navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-amber-500 focus:text-slate-950 focus:font-bold focus:rounded-xl focus:shadow-xl focus:ring-4 focus:ring-amber-500"
      >
        Skip directly to main menu and content
      </a>

      <header
        role="banner"
        className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/90 text-slate-900 transition-colors shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-3">
            {/* Left: Brand Logo & Tagline */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => onTabChange && onTabChange('home')}
                className="flex items-center gap-3 group text-left rounded-2xl p-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
                aria-label="FoodAccess Home - Good Food. For Everyone."
              >
                {/* Glowing Logo Icon */}
                <div className="relative">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-amber-500/25 group-hover:scale-105 transition-transform duration-300">
                    <Sparkles className="w-6 h-6 text-white" aria-hidden="true" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xl sm:text-2xl tracking-tight text-slate-900">
                      Food<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-600 to-emerald-600">Access</span>
                    </span>
                    <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-300">
                      Inclusive
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-500 hidden sm:block">
                    Good Food. For Everyone.
                  </p>
                </div>
              </button>

              {/* Location Selector Dropdown & GPS Button */}
              <div className="relative hidden md:flex items-center gap-1.5 ml-2">
                <button
                  onClick={() => onOpenLocationModal ? onOpenLocationModal() : setIsLocationOpen(!isLocationOpen)}
                  aria-label={`Current delivery location: ${selectedLocation}. Click to change via Satellite GPS or list`}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-500 text-slate-800 hover:text-slate-950 text-xs font-bold transition-all shadow-sm group"
                >
                  <MapPin className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
                  <span className="max-w-[140px] truncate">{selectedLocation}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {onOpenLocationModal && (
                  <button
                    onClick={onOpenLocationModal}
                    title="Acquire live GPS Satellite lock"
                    className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition-colors shadow-sm flex items-center gap-1"
                  >
                    <Satellite className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                    <span className="hidden xl:inline text-[11px]">GPS Fix</span>
                  </button>
                )}

                {isLocationOpen && !onOpenLocationModal && (
                  <div
                    className="absolute left-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                    role="menu"
                  >
                    <div className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Select Delivery Location
                    </div>
                    {DELIVERY_LOCATIONS.map(loc => (
                      <button
                        key={loc.id}
                        onClick={() => {
                          onLocationChange(loc.name);
                          setIsLocationOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex flex-col gap-0.5 transition-colors ${
                          selectedLocation === loc.name
                            ? 'bg-amber-50 text-amber-950 font-bold border border-amber-300'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold">{loc.name}</span>
                          {selectedLocation === loc.name && <span className="text-amber-600 text-xs">✓ Active</span>}
                        </div>
                        <span className="text-[10px] text-slate-400">{loc.landmark}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Center Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200">
              <button
                onClick={() => onTabChange && onTabChange('home')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'home'
                    ? 'bg-white text-slate-950 shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => onTabChange && onTabChange('explore')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'explore'
                    ? 'bg-white text-slate-950 shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-amber-600" />
                <span>Explore India</span>
              </button>
              <button
                onClick={() => onTabChange && onTabChange('favorites')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'favorites'
                    ? 'bg-white text-slate-950 shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                <span>Favorites</span>
              </button>
              <button
                onClick={() => onTabChange && onTabChange('orders')}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'orders'
                    ? 'bg-white text-slate-950 shadow-sm border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Orders</span>
                {activeOrder && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                )}
              </button>
            </nav>

            {/* Right Action Icons & Controls */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Allergen Shield Pill */}
              <button
                onClick={onOpenAllergenProfile}
                aria-label={`Allergen Shield: ${profile.allergies.length} allergies active. Click to manage.`}
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-950 transition-colors text-xs font-bold touch-target-accessible shadow-sm"
              >
                {profile.allergies.length > 0 ? (
                  <>
                    <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Shield ({profile.allergies.length})</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Shield</span>
                  </>
                )}
              </button>

              {/* Active Order Live Tracker Pill */}
              {activeOrder && (
                <button
                  onClick={onOpenTracker}
                  aria-label="View Active Order Live Status"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md animate-pulse touch-target-accessible"
                >
                  <Clock className="w-4 h-4" />
                  <span className="hidden sm:inline">Track Order</span>
                  <span>({activeOrder.etaMinutes}m)</span>
                </button>
              )}

              {/* AI Voice Assistant Trigger */}
              <button
                onClick={onOpenAiAssistant}
                aria-label="Open FoodAccess AI Voice and Dietary Assistant"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-xs font-bold transition-colors touch-target-accessible shadow-sm"
              >
                <Bot className="w-4 h-4 text-indigo-600" />
                <span className="hidden sm:inline">AI Concierge</span>
              </button>

              {/* A11y Toolbar Button */}
              <button
                onClick={onOpenA11y}
                aria-label="Open Universal Accessibility Preferences (contrast, font size, sound)"
                className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors touch-target-accessible shadow-sm"
                title="Universal Accessibility Toolbar"
              >
                <Eye className="w-4 h-4 text-amber-600" />
              </button>

              {/* Multilingual Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  aria-label={`Language translation switcher. Currently: ${activeLangOption.label}`}
                  className="flex items-center gap-1 px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-xs font-bold touch-target-accessible shadow-sm"
                >
                  <span className="text-sm">{activeLangOption.flag}</span>
                  <span className="hidden md:inline">{activeLangOption.label}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {isLangOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 rounded-2xl bg-white border border-slate-200 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                    role="menu"
                  >
                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Choose Language
                    </div>
                    {languageOptions.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-amber-50 transition-colors ${
                          currentLanguage === lang.code
                            ? 'font-bold text-amber-600 bg-amber-50/50'
                            : 'text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.label}</span>
                        </div>
                        <span className="text-xs text-slate-400 font-serif">
                          {lang.nativeLabel}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Device Frame Toggle */}
              <button
                onClick={() => setIsMobileDeviceView(!isMobileDeviceView)}
                aria-label={
                  isMobileDeviceView
                    ? 'Switch back to standard responsive desktop view'
                    : 'Switch to simulated mobile device frame (390px iPhone)'
                }
                title={
                  isMobileDeviceView
                    ? 'Standard view'
                    : 'Mobile phone preview'
                }
                className="hidden lg:flex p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors touch-target-accessible shadow-sm"
              >
                {isMobileDeviceView ? (
                  <Monitor className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Smartphone className="w-4 h-4 text-slate-600" />
                )}
              </button>

              {/* Cart Button */}
              <button
                onClick={onOpenCart}
                aria-label={`View Cart: ${totalCartCount} items`}
                className="relative flex items-center justify-center p-2.5 sm:px-4 sm:py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 hover:scale-105 active:scale-95 transition-transform touch-target-accessible"
              >
                <ShoppingBag className="w-5 h-5 text-slate-950" />
                <span className="hidden sm:inline ml-2 font-mono">
                  {totalCartCount > 0 ? `(${totalCartCount})` : 'Cart'}
                </span>
                {totalCartCount > 0 && (
                  <span className="sm:hidden absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-950 text-white font-mono text-[10px] font-black flex items-center justify-center">
                    {totalCartCount}
                  </span>
                )}
              </button>

              {/* Profile Avatar Button */}
              <button
                onClick={() => onTabChange && onTabChange('profile')}
                aria-label="User Profile & Preferences"
                className="hidden md:flex w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 items-center justify-center text-slate-700 hover:text-slate-950 hover:border-amber-500 transition-colors shadow-sm"
              >
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

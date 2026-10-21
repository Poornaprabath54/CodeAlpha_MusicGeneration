import React from 'react';
import {
  User,
  ShieldCheck,
  ShieldAlert,
  Eye,
  Type,
  Volume2,
  Clock,
  Sparkles,
  MapPin,
  ChevronRight,
  Bell,
  Heart
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import { useCartAndOrder } from '../context/CartAndOrderContext';
import { ALLERGEN_LIST, DIETARY_FILTERS } from '../data/mockData';
import { AllergenType, DietaryPreference } from '../types';

interface ProfileViewProps {
  onOpenA11y: () => void;
  onOpenAllergenProfile: () => void;
  onOpenTracker?: () => void;
  onNavigateTab: (tab: 'home' | 'explore' | 'orders' | 'favorites') => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  onOpenA11y,
  onOpenAllergenProfile,
  onOpenTracker,
  onNavigateTab
}) => {
  const {
    highContrast,
    toggleHighContrast,
    textScale,
    cycleTextScale,
    voiceGuidance,
    toggleVoiceGuidance,
    reduceMotion,
    toggleReduceMotion
  } = useAccessibility();

  const {
    profile,
    toggleAllergy,
    toggleDietaryPreference,
    activeOrder
  } = useCartAndOrder();

  const MOCK_PAST_ORDERS = [
    {
      id: 'FA-IN-839210',
      date: 'Yesterday, 8:30 PM',
      restaurant: 'Moti Mahal Delux Heritage',
      items: 'Old Delhi Butter Chicken, Tandoori Butter Roti x2',
      total: 445,
      status: 'Delivered to Accessible Porch Table'
    },
    {
      id: 'FA-IN-726194',
      date: '28 Sep 2026',
      restaurant: 'Saffron & Clay Pure Rasoi',
      items: 'Jain Dal Makhani Handi, Garlic-Free Jeera Rice',
      total: 395,
      status: 'Delivered with Contactless Photo'
    }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 sm:pb-8 text-slate-900">
      {/* Profile Header Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-500 to-emerald-500 flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-amber-500/20">
            AP
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">
            ✓
          </div>
        </div>

        <div className="flex-1 space-y-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <h1 className="text-2xl font-black text-slate-900">
              Ananya Patel
            </h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
              Gold Allergen Verified
            </span>
          </div>
          <p className="text-xs text-slate-500">
            ananya.patel@foodaccess.org • +91 98451 23456
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1 justify-center sm:justify-start">
            <span className="text-[11px] px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-600" />
              Indiranagar, Bengaluru
            </span>
            <span className="text-[11px] px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              {profile.allergies.length} Protected Allergens
            </span>
          </div>
        </div>
      </div>

      {/* Active Order Banner if exists */}
      {activeOrder && (
        <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Clock className="w-5 h-5 animate-spin" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                Active Order Live Tracking
              </span>
              <strong className="text-sm font-extrabold text-slate-900">
                {activeOrder.restaurant.name} (ETA: {activeOrder.etaMinutes} mins)
              </strong>
            </div>
          </div>

          <button
            onClick={onOpenTracker}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-md"
          >
            Track Now
          </button>
        </div>
      )}

      {/* 1. Dietary Preferences & Allergen Shield */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Allergen Shield & Dietary Filters
              </h2>
              <p className="text-xs text-slate-500">
                Dishes with your active allergies will show a warning banner automatically
              </p>
            </div>
          </div>

          <button
            onClick={onOpenAllergenProfile}
            className="text-xs text-amber-700 hover:text-amber-800 font-bold"
          >
            Manage All
          </button>
        </div>

        {/* Allergen Chips */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Saved Allergens (Tap to toggle)
          </span>
          <div className="flex flex-wrap gap-2">
            {ALLERGEN_LIST.map(item => {
              const isActive = profile.allergies.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggleAllergy(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-rose-50 text-rose-800 border border-rose-300 shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                  {isActive && <span className="text-rose-600 ml-1">✕</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Universal Accessibility Quick Toggles */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Universal Accessibility Controls
              </h2>
              <p className="text-xs text-slate-500">
                Designed with WCAG AAA principles for high readability
              </p>
            </div>
          </div>

          <button
            onClick={onOpenA11y}
            className="text-xs text-amber-700 hover:text-amber-800 font-bold"
          >
            A11y Hub
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* High Contrast */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <strong className="text-xs font-bold text-slate-900 block">High Contrast Mode</strong>
              <span className="text-[11px] text-slate-500">Enhanced visual borders & text</span>
            </div>
            <button
              onClick={toggleHighContrast}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                highContrast ? 'bg-amber-500' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  highContrast ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Text Size Scale */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <strong className="text-xs font-bold text-slate-900 block">Font Scale ({textScale})</strong>
              <span className="text-[11px] text-slate-500">Scale typography up to 150%</span>
            </div>
            <button
              onClick={cycleTextScale}
              className="px-2.5 py-1 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs font-mono font-bold text-slate-800 transition-colors"
            >
              Change
            </button>
          </div>

          {/* Voice Guidance */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <strong className="text-xs font-bold text-slate-900 block">Speech Synthesis</strong>
              <span className="text-[11px] text-slate-500">Audio readouts of dishes</span>
            </div>
            <button
              onClick={toggleVoiceGuidance}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                voiceGuidance ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  voiceGuidance ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Reduce Motion */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <strong className="text-xs font-bold text-slate-900 block">Reduce Motion</strong>
              <span className="text-[11px] text-slate-500">Disable floating orbs & spins</span>
            </div>
            <button
              onClick={toggleReduceMotion}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                reduceMotion ? 'bg-amber-500' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  reduceMotion ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Past Orders Summary */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Past Order History
              </h2>
              <p className="text-xs text-slate-500">
                100% transparent fee receipts & courier drop-off logs
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {MOCK_PAST_ORDERS.map(order => (
            <div
              key={order.id}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2 text-xs"
            >
              <div className="flex justify-between items-start">
                <div>
                  <strong className="text-sm font-bold text-slate-900 block">{order.restaurant}</strong>
                  <span className="text-slate-500 text-[11px]">{order.date} • #{order.id}</span>
                </div>
                <span className="font-mono text-amber-600 font-extrabold text-sm">
                  ₹{order.total}
                </span>
              </div>

              <p className="text-slate-600 text-[11px]">
                {order.items}
              </p>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {order.status}
                </span>

                <button
                  onClick={() => onNavigateTab('home')}
                  className="text-amber-700 hover:text-amber-800 font-bold"
                >
                  Reorder Same
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

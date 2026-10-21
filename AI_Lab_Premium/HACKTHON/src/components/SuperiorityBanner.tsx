import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Check, X, Sparkles, Droplets, HeartHandshake, Eye, Award } from 'lucide-react';

export const SuperiorityBanner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const COMPARISONS = [
    {
      feature: 'Cooking Oil & Fat Disclosure',
      foodAccess: '100% Disclosed (Pure A2 Desi Ghee, Zero Palm Oil)',
      swiggy: 'Hidden / Undisclosed commercial oil blends',
      icon: Droplets
    },
    {
      feature: 'Severe Allergen & Celiac Shield',
      foodAccess: 'Real-time cross-contact warnings (Hing wheat, nuts, dairy)',
      swiggy: 'Zero allergen filters or cookware guarantees',
      icon: ShieldCheck
    },
    {
      feature: 'In-Store Price Match Guarantee',
      foodAccess: 'Honest menu pricing + transparent ₹15 rasoi audit fee',
      swiggy: 'Hidden markups (15-30%) + surge + platform fee',
      icon: Award
    },
    {
      feature: 'Universal Accessibility (WCAG AAA)',
      foodAccess: 'Voice concierge, font scaler, waist-height table delivery',
      swiggy: 'Basic mobile app with limited accessibility features',
      icon: Eye
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-3xl bg-white border border-emerald-300/80 p-5 sm:p-6 shadow-md text-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white font-black shadow-md shadow-emerald-500/25 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300">
                Beyond Standard Delivery
              </span>
              <span className="text-xs text-slate-500 hidden sm:inline">The FoodAccess Standard</span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
              Why FoodAccess is more transparent than Swiggy & Zomato
            </h3>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 border border-slate-300 transition-colors shadow-sm"
        >
          {isOpen ? 'Hide Comparison' : 'Compare Features ➔'}
        </button>
      </div>

      {/* Expandable Comparison Matrix */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="pt-5 mt-5 border-t border-slate-200 space-y-3"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {COMPARISONS.map((c, idx) => {
                const Icon = c.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
                  >
                    <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900">
                      <Icon className="w-4 h-4 text-emerald-600" />
                      <span>{c.feature}</span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-300 flex items-start gap-2 text-emerald-900">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-[10px] text-emerald-800 uppercase font-black">FoodAccess:</strong>
                          <span>{c.foodAccess}</span>
                        </div>
                      </div>

                      <div className="p-2 rounded-xl bg-rose-50/70 border border-rose-200 flex items-start gap-2 text-slate-700">
                        <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block text-[10px] text-rose-700 uppercase font-black">Other Platforms:</strong>
                          <span>{c.swiggy}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

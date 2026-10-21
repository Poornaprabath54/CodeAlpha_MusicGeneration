import React from 'react';
import { motion } from 'framer-motion';
import { Tag, Sparkles, ShieldCheck, Flame, ArrowRight, Copy, Check } from 'lucide-react';
import { useCartAndOrder } from '../context/CartAndOrderContext';

export const OffersCarousel: React.FC<{ onApplyCouponToast: (code: string) => void }> = ({
  onApplyCouponToast
}) => {
  const { applyCoupon, appliedCoupon } = useCartAndOrder();

  const OFFERS = [
    {
      code: 'FOODPASS',
      title: 'FLAT ₹60 OFF',
      subtitle: 'On delicious regional orders above ₹200',
      badge: 'POPULAR DEAL',
      gradient: 'from-amber-600 via-orange-600 to-amber-700',
      tagIcon: Flame
    },
    {
      code: 'ALLERGYSAFE',
      title: 'FREE DELIVERY & AUDIT',
      subtitle: '100% Delivery + Kitchen Safety fee waived',
      badge: 'ALLERGEN CARE',
      gradient: 'from-emerald-600 via-teal-600 to-emerald-800',
      tagIcon: ShieldCheck
    },
    {
      code: 'TASTEINDIA',
      title: '15% EXTRA OFF',
      subtitle: 'Celebrate authentic flavors from 28 states',
      badge: 'REGIONAL SPECIAL',
      gradient: 'from-indigo-600 via-purple-600 to-indigo-800',
      tagIcon: Sparkles
    },
    {
      code: 'FIRSTSAFE',
      title: 'FLAT ₹100 OFF',
      subtitle: 'Welcome gift for first-time inclusive eaters',
      badge: 'NEW USER',
      gradient: 'from-rose-600 via-pink-600 to-rose-800',
      tagIcon: Tag
    },
  ];

  const handleApply = (code: string) => {
    const res = applyCoupon(code);
    onApplyCouponToast(code);
  };

  return (
    <section aria-labelledby="offers-heading" className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 id="offers-heading" className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
            <Tag className="w-5 h-5 text-amber-600" />
            <span>Deals & Allergen Pass Offers</span>
          </h2>
          <p className="text-xs text-slate-500">
            Transparent discounts without hidden platform surge
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        {OFFERS.map(offer => {
          const Icon = offer.tagIcon;
          const isApplied = appliedCoupon === offer.code;

          return (
            <motion.div
              key={offer.code}
              whileHover={{ y: -2 }}
              className={`shrink-0 w-72 sm:w-80 p-4 rounded-3xl bg-gradient-to-r ${offer.gradient} text-white shadow-xl relative overflow-hidden flex flex-col justify-between`}
            >
              {/* Background Glow */}
              <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />

              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-md text-amber-200 border border-white/20">
                    {offer.badge}
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>

                <h3 className="text-xl font-black mt-2 leading-tight">
                  {offer.title}
                </h3>
                <p className="text-xs text-white/80 mt-0.5 line-clamp-1">
                  {offer.subtitle}
                </p>
              </div>

              {/* Coupon action button */}
              <div className="pt-3 flex items-center justify-between border-t border-white/20 mt-3">
                <div className="flex items-center gap-1.5 font-mono text-xs font-black bg-black/40 px-2.5 py-1 rounded-xl border border-white/20">
                  <span>{offer.code}</span>
                </div>

                <button
                  onClick={() => handleApply(offer.code)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1 ${
                    isApplied
                      ? 'bg-white text-slate-950 font-black'
                      : 'bg-white/20 hover:bg-white text-white hover:text-slate-950'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                      <span>Applied</span>
                    </>
                  ) : (
                    <span>Apply</span>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

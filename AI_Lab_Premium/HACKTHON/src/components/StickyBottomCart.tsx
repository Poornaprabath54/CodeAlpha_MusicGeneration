import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCartAndOrder } from '../context/CartAndOrderContext';

interface StickyBottomCartProps {
  onOpenCart: () => void;
  isCartOpen: boolean;
}

export const StickyBottomCart: React.FC<StickyBottomCartProps> = ({
  onOpenCart,
  isCartOpen
}) => {
  const { cartItems, grandTotal, currentRestaurant } = useCartAndOrder();
  const totalCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  if (totalCount === 0 || isCartOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bottom-18 md:bottom-6 left-4 right-4 max-w-xl mx-auto z-40"
      >
        <button
          onClick={onOpenCart}
          aria-label={`View Cart: ${totalCount} items, total ₹${grandTotal}. Click to view details.`}
          className="w-full p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 text-white shadow-2xl shadow-emerald-500/30 border border-white/20 flex items-center justify-between hover:scale-[1.01] active:scale-[0.98] transition-transform touch-target-accessible group"
        >
          {/* Left item counter and price */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black/30 backdrop-blur-md flex items-center justify-center font-black">
              <ShoppingBag className="w-5 h-5 text-amber-300" />
            </div>

            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full text-white">
                  {totalCount} {totalCount === 1 ? 'ITEM' : 'ITEMS'}
                </span>
                <span className="font-mono text-base font-black text-amber-200">
                  ₹{grandTotal}
                </span>
              </div>
              <p className="text-[11px] text-white/90 truncate max-w-[180px] sm:max-w-xs mt-0.5">
                {currentRestaurant ? currentRestaurant.name : 'FoodAccess Rasoi'}
              </p>
            </div>
          </div>

          {/* Right View Cart CTA */}
          <div className="flex items-center gap-1.5 font-black text-xs sm:text-sm bg-black/30 hover:bg-black/40 px-3.5 py-2 rounded-xl border border-white/20 transition-colors">
            <span>VIEW CART</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ShieldCheck,
  ArrowRight,
  AlertTriangle,
  Info,
  Tag,
  Check,
  Percent,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartAndOrder } from '../context/CartAndOrderContext';
import { useLanguage } from '../context/LanguageContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout
}) => {
  const {
    cartItems,
    currentRestaurant,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    deliveryFee,
    serviceFee,
    taxes,
    grandTotal,
    profile,
    appliedCoupon,
    discountAmount,
    applyCoupon,
    removeCoupon
  } = useCartAndOrder();
  const { t } = useLanguage();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<string | null>(null);

  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleApplyCoupon = (code: string) => {
    const res = applyCoupon(code);
    setCouponFeedback(res.message);
    if (res.success) {
      setCouponInput('');
    }
    setTimeout(() => setCouponFeedback(null), 3500);
  };

  const SUGGESTED_COUPONS = [
    { code: 'FOODPASS', desc: 'Flat ₹60 OFF' },
    { code: 'ALLERGYSAFE', desc: 'Free Delivery (Save ₹50)' },
    { code: 'TASTEINDIA', desc: '15% Off' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
    >
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          ref={drawerRef}
          className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between text-slate-900"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 id="cart-title" className="text-lg font-black text-slate-900">
                  Your Cart
                </h2>
                {currentRestaurant ? (
                  <p className="text-xs text-amber-700 font-medium truncate max-w-[200px]">
                    From: {currentRestaurant.name}
                  </p>
                ) : (
                  <p className="text-xs text-slate-500">0 items</p>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close cart drawer"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors touch-target-accessible"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 bg-slate-50/60">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Your cart is empty
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                    Discover India's vibrant regional cuisines with complete ingredient clarity and transparent pricing.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 transition-colors shadow-sm"
                >
                  Explore Dishes
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Food Preferences Review Banner */}
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                    <Info className="w-4 h-4 text-amber-600" />
                    <span>Review your food preferences before checkout.</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {profile.allergies.length > 0 ? (
                      <>Active Allergen Shield: <strong className="text-amber-800">{profile.allergies.join(', ')}</strong>. Kitchen will use dedicated cookware.</>
                    ) : (
                      'All dietary preferences and allergies are verified during cooking.'
                    )}
                  </p>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  {cartItems.map(item => (
                    <div
                      key={item.cartItemId}
                      className="p-3.5 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-3"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={item.dish.image}
                          alt={item.dish.name}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-100"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="font-bold text-sm text-slate-900 truncate">
                              {item.dish.name}
                            </h4>
                            <button
                              onClick={() => removeFromCart(item.cartItemId)}
                              aria-label={`Remove ${item.dish.name} from cart`}
                              className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="font-mono text-xs font-extrabold text-amber-600 mt-0.5">
                            ₹{item.itemPriceTotal}
                          </div>

                          {/* Customizations summary */}
                          {item.selectedCustomizations.length > 0 && (
                            <div className="text-[11px] text-slate-500 space-y-0.5 mt-1.5 pt-1.5 border-t border-slate-100">
                              {item.selectedCustomizations.map((c, i) => (
                                <div key={i} className="flex justify-between items-center text-[10px]">
                                  <span>• {c.name}</span>
                                  {c.priceDelta > 0 && (
                                    <span className="font-mono font-bold text-amber-600">+₹{c.priceDelta}</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {item.specialInstructions && (
                            <p className="text-[10px] text-slate-500 italic mt-1 line-clamp-1">
                              Note: {item.specialInstructions}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500">Quantity</span>
                        <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl p-0.5">
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                            aria-label="Decrease quantity"
                            className="p-1 rounded-lg hover:bg-white text-slate-600 hover:text-slate-900 shadow-sm transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-6 text-center font-bold text-xs font-mono text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                            aria-label="Increase quantity"
                            className="p-1 rounded-lg hover:bg-white text-slate-600 hover:text-slate-900 shadow-sm transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* SWIGGY-STYLE COUPONS & PROMO SECTION */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-amber-600" />
                      <span>Coupons & Savings</span>
                    </span>
                    {appliedCoupon && (
                      <button
                        onClick={removeCoupon}
                        className="text-[11px] text-rose-600 hover:underline font-bold"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Coupon Input Form */}
                  {!appliedCoupon ? (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={couponInput}
                          onChange={e => setCouponInput(e.target.value.toUpperCase())}
                          placeholder="Enter coupon code (e.g. FOODPASS)"
                          className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
                        />
                        <button
                          onClick={() => handleApplyCoupon(couponInput)}
                          disabled={!couponInput.trim()}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white font-black text-xs transition-colors"
                        >
                          Apply
                        </button>
                      </div>

                      {/* Quick Coupon Chips */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {SUGGESTED_COUPONS.map(c => (
                          <button
                            key={c.code}
                            onClick={() => handleApplyCoupon(c.code)}
                            className="text-[10px] font-bold px-2 py-1 rounded-lg bg-slate-100 hover:bg-amber-50 border border-slate-200 text-slate-700 hover:text-amber-800 flex items-center gap-1 transition-colors"
                          >
                            <span>{c.code}</span>
                            <span className="text-slate-400">({c.desc})</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800 font-bold">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Code '{appliedCoupon}' Applied!</span>
                      </div>
                      <span className="font-mono text-emerald-700">-₹{discountAmount}</span>
                    </div>
                  )}

                  {couponFeedback && (
                    <p className="text-[11px] font-medium text-amber-700 animate-in fade-in">
                      {couponFeedback}
                    </p>
                  )}
                </div>

                <button
                  onClick={clearCart}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold py-1 block ml-auto transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </div>

          {/* Transparent Order Summary Footer */}
          {cartItems.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-slate-200 bg-white space-y-4 shadow-lg">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold text-slate-900">₹{subtotal}</span>
                </div>

                <div className="flex justify-between">
                  <span>Transparent Delivery Fee</span>
                  <span className="font-mono font-semibold text-slate-900">₹{deliveryFee}</span>
                </div>

                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    <span>Kitchen Safety & Verification Fee</span>
                    <span
                      title="100% covers kitchen allergen swab testing and tamper-evident packaging"
                      className="cursor-help text-amber-600 font-bold"
                    >
                      ⓘ
                    </span>
                  </span>
                  <span className="font-mono font-semibold text-slate-900">₹{serviceFee}</span>
                </div>

                <div className="flex justify-between">
                  <span>GST (5% Restaurant Tax)</span>
                  <span className="font-mono font-semibold text-slate-900">₹{taxes}</span>
                </div>

                {/* Discount Line if applied */}
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Coupon Savings ({appliedCoupon})</span>
                    <span className="font-mono">-₹{discountAmount}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-bold text-sm text-slate-900">
                  <span>Total Payable</span>
                  <span className="font-mono text-xl font-black text-amber-600">
                    ₹{grandTotal}
                  </span>
                </div>

                {/* Savings Confetti Pill */}
                {discountAmount > 0 && (
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 font-extrabold text-[11px] text-center flex items-center justify-center gap-1.5 border border-emerald-200">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>🎉 You are saving ₹{discountAmount} on this order!</span>
                  </div>
                )}

                <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Exact In-Store Price Match Guarantee</span>
                </div>
              </div>

              {/* Continue to Checkout CTA */}
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-transform active:scale-95 touch-target-accessible"
              >
                <span>Continue to Checkout • ₹{grandTotal}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

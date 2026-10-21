import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  ShieldCheck,
  MapPin,
  BellOff,
  MessageSquare,
  CreditCard,
  Smartphone,
  Banknote,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Info,
  Clock,
  HeartHandshake
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartAndOrder } from '../context/CartAndOrderContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderSuccess
}) => {
  const {
    currentRestaurant,
    cartItems,
    subtotal,
    deliveryFee,
    serviceFee,
    tipAmount,
    setTipAmount,
    taxes,
    grandTotal,
    deliveryPreferences,
    setDeliveryPreferences,
    placeOrder,
    profile
  } = useCartAndOrder();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedAddress, setSelectedAddress] = useState<string>('Home: Flat 402, Shanti Vihar, Indiranagar 100ft Road, Bengaluru');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [specialInstructions, setSpecialInstructions] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !currentRestaurant) return null;

  const handleConfirmOrder = () => {
    placeOrder();
    onClose();
    onOrderSuccess();
  };

  const tipOptions = [20, 30, 50, 80];

  const SAVED_ADDRESSES = [
    'Home: Flat 402, Shanti Vihar, Indiranagar 100ft Road, Bengaluru',
    'Office: WeWork Galaxy, 43 Residency Road, Bengaluru',
    'Parent’s House: 12th Main, 4th Block, Koramangala, Bengaluru',
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        ref={modalRef}
        className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-5 sm:p-7 my-6 max-h-[92vh] overflow-y-auto space-y-6 text-slate-900"
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                Transparent Checkout
              </span>
              <span className="text-xs text-slate-500 font-medium">Mock / Demo Payment</span>
            </div>
            <h2 id="checkout-title" className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Complete Your Order
            </h2>
            <p className="text-xs text-slate-500">
              Kitchen: <strong className="text-slate-800">{currentRestaurant.name}</strong> • {cartItems.length} dish{cartItems.length > 1 ? 'es' : ''}
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Cancel checkout"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors touch-target-accessible"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
          <div
            className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 ${
              currentStep >= 1
                ? 'border-amber-300 bg-amber-50 text-amber-900'
                : 'border-slate-200 bg-slate-50 text-slate-400'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center text-[10px] font-mono">1</span>
            <span>Address</span>
          </div>

          <div
            className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 ${
              currentStep >= 2
                ? 'border-amber-300 bg-amber-50 text-amber-900'
                : 'border-slate-200 bg-slate-50 text-slate-400'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center text-[10px] font-mono">2</span>
            <span>Preferences</span>
          </div>

          <div
            className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 ${
              currentStep >= 3
                ? 'border-amber-300 bg-amber-50 text-amber-900'
                : 'border-slate-200 bg-slate-50 text-slate-400'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center text-[10px] font-mono">3</span>
            <span>Payment</span>
          </div>
        </div>

        {/* SECTION 1: Delivery Address */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>1. Delivery Address</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsEditingAddress(!isEditingAddress)}
              className="text-xs text-amber-700 hover:text-amber-800 font-semibold"
            >
              {isEditingAddress ? 'Done' : 'Change Address'}
            </button>
          </div>

          {isEditingAddress ? (
            <div className="space-y-2">
              {SAVED_ADDRESSES.map((addr, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedAddress(addr);
                    setIsEditingAddress(false);
                  }}
                  className={`w-full p-3 rounded-2xl border text-left text-xs transition-colors ${
                    selectedAddress === addr
                      ? 'border-amber-500 bg-amber-50 text-slate-900 font-bold'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {addr}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
              <span className="text-slate-800">{selectedAddress}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase shrink-0 ml-2">
                Deliver Here
              </span>
            </div>
          )}
        </section>

        {/* SECTION 2: Order Items Summary */}
        <section className="space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>2. Order Items ({cartItems.length})</span>
          </h3>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {cartItems.map(item => (
              <div
                key={item.cartItemId}
                className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={item.dish.image}
                    alt={item.dish.name}
                    className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <strong className="text-slate-900 font-semibold block">{item.dish.name}</strong>
                    <span className="text-[11px] text-slate-500">Qty: {item.quantity}</span>
                  </div>
                </div>

                <span className="font-mono font-bold text-amber-600 text-sm">
                  ₹{item.itemPriceTotal}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: Dietary Preferences & Accessibility Drop-off */}
        <section className="space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>3. Dietary & Accessible Delivery Preferences</span>
          </h3>

          {/* Active Allergen Tag Info */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
            <span className="text-slate-500">Allergen Shield:</span>
            <span className="text-amber-800 font-bold">
              {profile.allergies.length > 0 ? profile.allergies.join(', ') : 'No restrictions set'}
            </span>
          </div>

          {/* Drop-off Placement */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setDeliveryPreferences(p => ({ ...p, dropOffLocation: 'accessible-table-height' }))}
              className={`p-3 rounded-2xl border text-left transition-all ${
                deliveryPreferences.dropOffLocation === 'accessible-table-height'
                  ? 'border-amber-500 bg-amber-50 text-slate-900 font-bold'
                  : 'border-slate-200 bg-slate-50 text-slate-700'
              }`}
            >
              <div className="font-bold text-slate-900">Accessible Table / Bench</div>
              <p className="text-[10px] text-slate-500 mt-0.5">Waist height, avoid ground bending</p>
            </button>

            <button
              type="button"
              onClick={() => setDeliveryPreferences(p => ({ ...p, dropOffLocation: 'leave-at-door' }))}
              className={`p-3 rounded-2xl border text-left transition-all ${
                deliveryPreferences.dropOffLocation === 'leave-at-door'
                  ? 'border-amber-500 bg-amber-50 text-slate-900 font-bold'
                  : 'border-slate-200 bg-slate-50 text-slate-700'
              }`}
            >
              <div className="font-bold text-slate-900">Leave at Flat Doorstep</div>
              <p className="text-[10px] text-slate-500 mt-0.5">Contactless drop</p>
            </button>
          </div>

          {/* Sensory Sound Preference */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setDeliveryPreferences(p => ({ ...p, soundPreference: 'do-not-ring-bell' }))}
              className={`p-3 rounded-2xl border text-left transition-all ${
                deliveryPreferences.soundPreference === 'do-not-ring-bell'
                  ? 'border-amber-500 bg-amber-50 text-slate-900 font-bold'
                  : 'border-slate-200 bg-slate-50 text-slate-700'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5 text-slate-900">
                <BellOff className="w-3.5 h-3.5 text-amber-600" />
                <span>Do Not Ring Bell</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">Silent delivery (elderly / sleep)</p>
            </button>

            <button
              type="button"
              onClick={() => setDeliveryPreferences(p => ({ ...p, soundPreference: 'knock-firmly' }))}
              className={`p-3 rounded-2xl border text-left transition-all ${
                deliveryPreferences.soundPreference === 'knock-firmly'
                  ? 'border-amber-500 bg-amber-50 text-slate-900 font-bold'
                  : 'border-slate-200 bg-slate-50 text-slate-700'
              }`}
            >
              <div className="font-bold text-slate-900">Knock Firmly on Door</div>
              <p className="text-[10px] text-slate-500 mt-0.5">For hard of hearing</p>
            </button>
          </div>
        </section>

        {/* SECTION 4: Payment Method (Mock Only for Hackathon Demo) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>4. Payment Method</span>
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">
              Hackathon Mock Flow
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => setPaymentMethod('upi')}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 text-center transition-all ${
                paymentMethod === 'upi'
                  ? 'border-emerald-600 bg-emerald-50 text-slate-900 ring-2 ring-emerald-500/40 font-bold'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
              }`}
            >
              <Smartphone className="w-5 h-5 text-emerald-600" />
              <span className="text-xs font-bold text-slate-900">UPI (Mock)</span>
              <span className="text-[10px] text-slate-500">GPay / PhonePe</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 text-center transition-all ${
                paymentMethod === 'card'
                  ? 'border-emerald-600 bg-emerald-50 text-slate-900 ring-2 ring-emerald-500/40 font-bold'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
              }`}
            >
              <CreditCard className="w-5 h-5 text-amber-600" />
              <span className="text-xs font-bold text-slate-900">Card (Mock)</span>
              <span className="text-[10px] text-slate-500">Visa / RuPay</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('cod')}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1 text-center transition-all ${
                paymentMethod === 'cod'
                  ? 'border-emerald-600 bg-emerald-50 text-slate-900 ring-2 ring-emerald-500/40 font-bold'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
              }`}
            >
              <Banknote className="w-5 h-5 text-amber-600" />
              <span className="text-xs font-bold text-slate-900">Cash on Delivery</span>
              <span className="text-[10px] text-slate-500">Pay at door</span>
            </button>
          </div>
        </section>

        {/* Courier Tip Selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span className="flex items-center gap-1">
              <HeartHandshake className="w-3.5 h-3.5 text-amber-600" />
              <span>Tip Your Accessibility-Trained Courier</span>
            </span>
            <span className="text-amber-700 font-mono">₹{tipAmount} added</span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {tipOptions.map(amount => (
              <button
                key={amount}
                type="button"
                onClick={() => setTipAmount(tipAmount === amount ? 0 : amount)}
                className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                  tipAmount === amount
                    ? 'border-amber-500 bg-amber-100 text-amber-900 font-mono'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                ₹{amount}
              </button>
            ))}
          </div>
        </div>

        {/* SECTION 5: Order Summary & Total */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Food Subtotal:</span>
            <span className="font-mono font-semibold text-slate-900">₹{subtotal}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Delivery Fee:</span>
            <span className="font-mono font-semibold text-slate-900">₹{deliveryFee}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Kitchen Safety Verification Fee:</span>
            <span className="font-mono font-semibold text-slate-900">₹{serviceFee}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>GST (5% Restaurant Service Tax):</span>
            <span className="font-mono font-semibold text-slate-900">₹{taxes}</span>
          </div>
          {tipAmount > 0 && (
            <div className="flex justify-between text-amber-700 font-semibold">
              <span>Courier Care Tip:</span>
              <span className="font-mono">₹{tipAmount}</span>
            </div>
          )}

          <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-bold text-sm text-slate-900">
            <span>Grand Total:</span>
            <span className="font-mono text-xl font-black text-amber-600">
              ₹{grandTotal}
            </span>
          </div>
        </div>

        {/* Bottom Place Order CTA */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors text-center"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirmOrder}
            className="w-full sm:w-auto flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-transform active:scale-95 touch-target-accessible"
          >
            <Sparkles className="w-5 h-5 text-white" />
            <span>Place Order (Mock Demo) • ₹{grandTotal}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

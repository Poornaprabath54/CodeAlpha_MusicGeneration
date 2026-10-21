import React, { useEffect, useRef } from 'react';
import {
  X,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Phone,
  MessageSquare,
  Volume2,
  Play,
  RotateCcw,
  Sparkles,
  Bike,
  ChefHat,
  PackageCheck,
  Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccessibility } from '../context/AccessibilityContext';
import { useCartAndOrder } from '../context/CartAndOrderContext';
import { LiveRouteMap } from './LiveRouteMap';

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({ isOpen, onClose }) => {
  const { speak } = useAccessibility();
  const { activeOrder, advanceOrderStep, resetOrder } = useCartAndOrder();
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

  if (!isOpen || !activeOrder) return null;

  // 4 Hackathon stages
  const STAGES = [
    { title: 'Confirmed', icon: CheckCircle2, desc: 'Chef verified order & allergen audit passed' },
    { title: 'Preparing', icon: ChefHat, desc: 'Cooking in dedicated cookware with certified ghee/oil' },
    { title: 'Out for Delivery', icon: Bike, desc: 'Courier on Ather EV en route with thermal bag' },
    { title: 'Delivered', icon: Home, desc: 'Placed safely at waist-height table drop-off' },
  ];

  // Map statusStepIndex (0..4 in context) to 0..3 for 4 stages
  const stageIndex = Math.min(3, Math.max(0, activeOrder.statusStepIndex));
  const currentStage = STAGES[stageIndex];

  const handleAnnounceStatus = () => {
    const speech = `Order ${activeOrder.orderId} from ${activeOrder.restaurant.name}. Current status: ${currentStage.title}. ${currentStage.desc}. Estimated arrival in ${activeOrder.etaMinutes} minutes.`;
    speak(speech);
  };

  const progressPercentage = (stageIndex / (STAGES.length - 1)) * 100;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tracker-title"
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
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Live Tracking
              </span>
              <span className="font-mono text-xs text-slate-500 font-semibold">
                #{activeOrder.orderId}
              </span>
            </div>
            <h2 id="tracker-title" className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {activeOrder.restaurant.name}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleAnnounceStatus}
              aria-label="Announce current order status using voice synthesis"
              className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1.5 border border-amber-200 transition-colors touch-target-accessible shadow-sm"
            >
              <Volume2 className="w-4 h-4 text-amber-700" />
              <span>Announce</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Close order tracker"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors touch-target-accessible"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live ETA Card */}
        <div className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-600 text-white shadow-xl shadow-amber-500/10">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-amber-100 uppercase tracking-wider block">
                Estimated Delivery Window
              </span>
              <div className="text-2xl sm:text-3xl font-black font-mono mt-1">
                {stageIndex === 3 ? '🎉 Delivered safely!' : `${activeOrder.etaMinutes} mins remaining`}
              </div>
              <span className="text-xs text-amber-100 mt-1 block">
                Expected arrival: {activeOrder.estimatedDeliveryTime}
              </span>
            </div>

            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Live Vector GPS Route Map (More than Swiggy!) */}
        <LiveRouteMap
          stageIndex={stageIndex}
          courierName={activeOrder.courierName}
          courierVehicle={activeOrder.courierVehicle}
          restaurantName={activeOrder.restaurant.name}
          deliveryAddress={activeOrder.deliveryPreferences.mobilityInstructions || 'Accessible Drop-off Table'}
        />

        {/* 4-Stage Animated Progress Line with Moving Scooter Indicator */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
            <span>Order Progress</span>
            <span className="text-amber-700">Stage {stageIndex + 1} of 4: {currentStage.title}</span>
          </div>

          {/* Animated Progress Bar */}
          <div className="relative pt-6 pb-2">
            {/* Background line */}
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              />
            </div>

            {/* Moving Courier Scooter Icon Indicator */}
            <motion.div
              className="absolute top-0 -translate-x-1/2 flex flex-col items-center"
              initial={false}
              animate={{ left: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/40">
                <Bike className="w-4 h-4 animate-bounce" />
              </div>
            </motion.div>

            {/* 4 Stage Dot Markers */}
            <div className="flex justify-between mt-3 text-center">
              {STAGES.map((s, idx) => {
                const IconComponent = s.icon;
                const isPassed = idx < stageIndex;
                const isCurrent = idx === stageIndex;

                return (
                  <div key={idx} className="flex flex-col items-center max-w-[80px]">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 transition-all ${
                        isCurrent
                          ? 'bg-amber-500 text-white ring-4 ring-amber-200 font-black'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-400 border border-slate-200'
                      }`}
                    >
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                    <span
                      className={`text-[11px] font-bold ${
                        isCurrent
                          ? 'text-amber-800'
                          : isPassed
                          ? 'text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {s.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current Stage Description Banner */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">
                Current Status: {currentStage.title}
              </div>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                {currentStage.desc}
              </p>
            </div>
          </div>
        </div>

        {/* Courier Details */}
        <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-slate-200 flex items-center justify-center text-amber-800 font-black text-lg">
              RK
            </div>
            <div>
              <strong className="text-sm font-extrabold text-slate-900 block">
                {activeOrder.courierName}
              </strong>
              <span className="text-xs text-slate-500">
                {activeOrder.courierVehicle}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${activeOrder.courierPhone}`}
              className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors shadow-sm"
              title="Call courier"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={() => alert(`WhatsApp SMS sent to courier: "Please leave on porch table at waist height."`)}
              className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors shadow-sm"
              title="Message instructions"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hackathon Demo Flow Simulator Controls */}
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5 text-indigo-600" />
              <span>Judge Demo Simulator</span>
            </span>
            <span className="text-[10px] text-indigo-600 font-medium">Advance order step live</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={advanceOrderStep}
              className="flex-1 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors touch-target-accessible shadow-sm"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Advance Status ({stageIndex + 1}/4)</span>
            </button>

            <button
              onClick={resetOrder}
              className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 transition-colors touch-target-accessible shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Order Items & Fee Summary */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
          <div className="font-bold text-slate-600 uppercase tracking-wider text-[11px]">
            Items Ordered ({activeOrder.items.length})
          </div>
          {activeOrder.items.map(item => (
            <div key={item.cartItemId} className="flex justify-between items-center text-slate-700">
              <span>{item.quantity}x {item.dish.name}</span>
              <span className="font-mono font-bold text-slate-900">₹{item.itemPriceTotal}</span>
            </div>
          ))}

          <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-bold text-slate-900">
            <span>Total Paid (Transparent):</span>
            <span className="font-mono text-base font-black text-amber-600">
              ₹{activeOrder.total}
            </span>
          </div>
        </div>

        {/* Footer Close */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-colors touch-target-accessible shadow-sm"
          >
            Close Tracker
          </button>
        </div>
      </motion.div>
    </div>
  );
};

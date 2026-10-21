import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Bike, Home, CheckCircle2, ShieldCheck } from 'lucide-react';

interface LiveRouteMapProps {
  stageIndex: number; // 0: Confirmed, 1: Preparing, 2: Out for Delivery, 3: Delivered
  courierName: string;
  courierVehicle: string;
  restaurantName: string;
  deliveryAddress: string;
}

export const LiveRouteMap: React.FC<LiveRouteMapProps> = ({
  stageIndex,
  courierName,
  courierVehicle,
  restaurantName,
  deliveryAddress
}) => {
  // Positions along simulated road (percentage 0..100)
  // 0: At Restaurant (0%)
  // 1: Still cooking (5%)
  // 2: Out for Delivery (55% or moving)
  // 3: At destination (100%)
  const courierProgress = stageIndex === 0 ? 5 : stageIndex === 1 ? 15 : stageIndex === 2 ? 65 : 100;

  return (
    <div className="relative w-full h-56 sm:h-64 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-md p-4 flex flex-col justify-between">
      {/* Background Stylized Light Map Grid */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#94A3B8" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Simulated Road Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 200" preserveAspectRatio="none">
        {/* Secondary roads */}
        <path d="M 0,80 Q 150,140 280,60 T 400,120" fill="none" stroke="#E2E8F0" strokeWidth="7" strokeLinecap="round" />
        <path d="M 120,0 Q 200,90 220,200" fill="none" stroke="#E2E8F0" strokeWidth="6" strokeLinecap="round" />

        {/* Main Delivery Route Highway */}
        <path
          d="M 50,140 Q 140,50 250,130 T 350,70"
          fill="none"
          stroke="#CBD5E1"
          strokeWidth="11"
          strokeLinecap="round"
        />
        {/* Glowing Traveled Path */}
        <path
          d="M 50,140 Q 140,50 250,130 T 350,70"
          fill="none"
          stroke="url(#route-gradient)"
          strokeWidth="6"
          strokeDasharray="6 4"
          className="animate-pulse"
        />

        <defs>
          <linearGradient id="route-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#0284C7" />
          </linearGradient>
        </defs>
      </svg>

      {/* Map Top Indicators */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 text-xs font-bold text-slate-800 shadow-sm">
          <Navigation className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
          <span>Live GPS Telemetry</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping ml-1" />
        </div>

        <div className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 text-amber-700 shadow-sm">
          {stageIndex === 3 ? 'Arrived at Destination' : stageIndex === 2 ? '1.2 km away (6 mins)' : 'Kitchen Dispatched Soon'}
        </div>
      </div>

      {/* Map Nodes (Restaurant & Home) */}
      <div className="relative z-10 w-full flex items-center justify-between px-4 sm:px-8 my-auto">
        {/* Origin: Restaurant Pin */}
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border-2 border-amber-500 text-amber-700 flex items-center justify-center shadow-md">
            <MapPin className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold text-slate-800 mt-1 bg-white/95 px-2 py-0.5 rounded-full border border-slate-200 shadow-sm max-w-[100px] truncate text-center">
            {restaurantName}
          </span>
        </div>

        {/* Courier Moving Marker */}
        <motion.div
          className="flex flex-col items-center -mt-6"
          initial={false}
          animate={{
            x: courierProgress < 20 ? -40 : courierProgress < 80 ? 0 : 40,
            scale: stageIndex === 2 ? [1, 1.1, 1] : 1
          }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg ring-4 ring-emerald-300">
            <Bike className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-[9px] font-black text-white mt-1 bg-emerald-700 px-2 py-0.5 rounded-full shadow">
            {courierName.split(' ')[0]} (Ather EV)
          </span>
        </motion.div>

        {/* Destination: Customer Home Pin */}
        <div className="flex flex-col items-center">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-md ${
            stageIndex === 3
              ? 'bg-emerald-100 border-2 border-emerald-500 text-emerald-800 shadow-emerald-500/20'
              : 'bg-white border-2 border-slate-300 text-slate-700'
          }`}>
            <Home className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold text-slate-800 mt-1 bg-white/95 px-2 py-0.5 rounded-full border border-slate-200 shadow-sm max-w-[100px] truncate text-center">
            Your Address
          </span>
        </div>
      </div>

      {/* Map Bottom Status Banner */}
      <div className="relative z-10 p-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 text-xs flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-slate-700 text-[11px] truncate max-w-[240px] sm:max-w-md">
            Courier briefed on accessible waist-height table drop-off instructions
          </span>
        </div>

        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider shrink-0 hidden sm:inline">
          Thermal Bag Sealed
        </span>
      </div>
    </div>
  );
};

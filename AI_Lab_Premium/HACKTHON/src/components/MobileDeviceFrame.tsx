import React from 'react';
import { Wifi, Battery, Signal, Smartphone, Monitor } from 'lucide-react';

interface MobileDeviceFrameProps {
  isMobileDeviceView: boolean;
  onToggleView: () => void;
  children: React.ReactNode;
}

export const MobileDeviceFrame: React.FC<MobileDeviceFrameProps> = ({
  isMobileDeviceView,
  onToggleView,
  children
}) => {
  if (!isMobileDeviceView) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-900 py-6 px-2 sm:px-4 flex flex-col items-center justify-center">
      {/* Top Banner Control */}
      <div className="mb-4 flex items-center justify-between max-w-sm w-full text-white text-xs px-2">
        <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
          <Smartphone className="w-4 h-4" />
          <span>Mobile Device Viewport Mode</span>
        </div>
        <button
          onClick={onToggleView}
          className="text-slate-300 hover:text-white underline text-xs font-medium"
        >
          Exit to Full Desktop
        </button>
      </div>

      {/* Phone Hardware Mockup */}
      <div className="relative w-full max-w-[420px] bg-black rounded-[50px] p-3 shadow-[0_0_60px_rgba(0,0,0,0.8)] border-[6px] border-slate-700 overflow-hidden">
        {/* Hardware Notch / Dynamic Island */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-full z-50 flex items-center justify-between px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
        </div>

        {/* Screen Bezel and Inner Window */}
        <div className="relative bg-slate-50 dark:bg-slate-900 rounded-[40px] overflow-hidden flex flex-col h-[820px]">
          {/* Status Bar */}
          <div className="pt-2 px-6 pb-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md flex items-center justify-between text-[11px] font-bold text-slate-800 dark:text-slate-200 z-40 border-b border-slate-100 dark:border-slate-800">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Phone Scrollable App Container */}
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>

          {/* Bottom Virtual Home Indicator Bar */}
          <div className="py-2 flex justify-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
            <div className="w-32 h-1 bg-slate-400 dark:bg-slate-600 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

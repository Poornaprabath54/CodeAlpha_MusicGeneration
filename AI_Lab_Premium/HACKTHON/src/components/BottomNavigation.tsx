import React from 'react';
import { motion } from 'framer-motion';
import { Home, Compass, Clock, Heart, User } from 'lucide-react';

export type NavTab = 'home' | 'explore' | 'orders' | 'favorites' | 'profile';

interface BottomNavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  ordersBadgeCount?: number;
  favoritesCount?: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  ordersBadgeCount = 0,
  favoritesCount = 0,
}) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    { id: 'explore' as NavTab, label: 'Explore', icon: Compass },
    { id: 'orders' as NavTab, label: 'Orders', icon: Clock, badge: ordersBadgeCount },
    { id: 'favorites' as NavTab, label: 'Favorites', icon: Heart, badge: favoritesCount },
    { id: 'profile' as NavTab, label: 'Profile', icon: User },
  ];

  return (
    <nav
      aria-label="Mobile bottom navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200 md:hidden pb-safe-area shadow-lg"
    >
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              aria-label={tab.label}
              className="relative flex flex-col items-center justify-center w-14 h-full py-1 text-xs font-semibold touch-target-accessible"
            >
              {/* Active Tab Glow Indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute -top-[1px] w-8 h-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 shadow-sm"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}

              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-amber-600' : 'text-slate-400 hover:text-slate-600'
                  }`}
                />
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center shadow-sm">
                    {tab.badge}
                  </span>
                ) : null}
              </div>

              <span
                className={`text-[10px] mt-1 transition-colors ${
                  isActive ? 'font-black text-amber-600' : 'text-slate-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

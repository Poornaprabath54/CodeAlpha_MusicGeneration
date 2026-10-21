import React from 'react';
import { motion } from 'framer-motion';
import { CuisineCategory, RegionType } from '../types';

interface CuisineCardProps {
  cuisine: CuisineCategory;
  isSelected: boolean;
  onSelect: (regionId: RegionType) => void;
}

export const CuisineCard: React.FC<CuisineCardProps> = ({ cuisine, isSelected, onSelect }) => {
  return (
    <motion.button
      whileHover={{ y: -3, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(cuisine.id)}
      role="tab"
      aria-selected={isSelected}
      aria-label={`Filter by ${cuisine.name}, ${cuisine.dishCount} dishes available`}
      className={`relative shrink-0 w-36 sm:w-44 h-24 sm:h-28 rounded-2xl overflow-hidden text-left p-3 flex flex-col justify-end transition-all border-2 touch-target-accessible shadow-sm ${
        isSelected
          ? 'border-amber-500 ring-2 ring-amber-400/50 shadow-md'
          : 'border-slate-200 hover:border-amber-400 bg-white'
      }`}
    >
      {/* Background Image with Dark Vignette for contrast */}
      <img
        src={cuisine.image}
        alt={cuisine.name}
        className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-300 group-hover:scale-110"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

      {/* Tag badge */}
      <span className="absolute top-2 left-2 text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-slate-900 border border-slate-200 shadow-sm">
        {cuisine.dishCount} dishes
      </span>

      {/* Content */}
      <div className="relative z-10 space-y-0.5">
        <h4 className="text-xs sm:text-sm font-black text-white leading-tight drop-shadow-sm">
          {cuisine.name}
        </h4>
        <p className="text-[10px] text-amber-200 font-semibold truncate">
          {cuisine.tag}
        </p>
      </div>
    </motion.button>
  );
};

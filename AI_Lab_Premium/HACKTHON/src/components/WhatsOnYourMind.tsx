import React from 'react';
import { motion } from 'framer-motion';

interface CravingItem {
  id: string;
  name: string;
  image: string;
  keyword: string;
}

const CRAVING_ITEMS: CravingItem[] = [
  {
    id: 'crav-1',
    name: 'Biryani',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=300&q=80',
    keyword: 'Biryani'
  },
  {
    id: 'crav-2',
    name: 'Crispy Dosa',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=300&q=80',
    keyword: 'Dosa'
  },
  {
    id: 'crav-3',
    name: 'Butter Chicken',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=300&q=80',
    keyword: 'Butter Chicken'
  },
  {
    id: 'crav-4',
    name: 'Royal Thali',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=300&q=80',
    keyword: 'Thali'
  },
  {
    id: 'crav-5',
    name: 'Street Chaat',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=300&q=80',
    keyword: 'Puri'
  },
  {
    id: 'crav-6',
    name: 'Paneer Tikka',
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=300&q=80',
    keyword: 'Paneer'
  },
  {
    id: 'crav-7',
    name: 'Pav Bhaji',
    image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=300&q=80',
    keyword: 'Pav Bhaji'
  },
  {
    id: 'crav-8',
    name: 'Momos',
    image: 'https://images.unsplash.com/photo-1625398407796-82650a8c135f?auto=format&fit=crop&w=300&q=80',
    keyword: 'Momos'
  },
  {
    id: 'crav-9',
    name: 'Mithai & Sweets',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=300&q=80',
    keyword: 'Jamun'
  },
  {
    id: 'crav-10',
    name: 'Idli & Vada',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=300&q=80',
    keyword: 'Idli'
  },
];

interface WhatsOnYourMindProps {
  selectedCraving: string;
  onSelectCraving: (keyword: string) => void;
}

export const WhatsOnYourMind: React.FC<WhatsOnYourMindProps> = ({
  selectedCraving,
  onSelectCraving
}) => {
  return (
    <section aria-labelledby="cravings-heading" className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 id="cravings-heading" className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
            <span>What’s on your mind?</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold hidden sm:inline">
              Instant Craving
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Tap any dish to quickly filter certified kitchens
          </p>
        </div>

        {selectedCraving && (
          <button
            onClick={() => onSelectCraving('')}
            className="text-xs text-amber-700 hover:text-amber-800 font-bold underline"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Horizontal Story Reel Carousel */}
      <div className="flex items-center gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none">
        {CRAVING_ITEMS.map(item => {
          const isSelected = selectedCraving === item.keyword;

          return (
            <motion.button
              key={item.id}
              whileHover={{ y: -3, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectCraving(isSelected ? '' : item.keyword)}
              className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none touch-target-accessible"
              aria-label={`Filter by ${item.name}`}
            >
              <div
                className={`relative w-18 h-18 sm:w-20 sm:h-20 rounded-full p-0.5 transition-all shadow-sm ${
                  isSelected
                    ? 'ring-4 ring-amber-500 shadow-md scale-105'
                    : 'ring-2 ring-slate-200 group-hover:ring-amber-400'
                }`}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full rounded-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
                {isSelected && (
                  <div className="absolute inset-0 rounded-full bg-amber-500/20 border-2 border-amber-500" />
                )}
              </div>

              <span
                className={`text-xs font-bold text-center transition-colors max-w-[80px] truncate ${
                  isSelected ? 'text-amber-700 font-black' : 'text-slate-700 group-hover:text-slate-900'
                }`}
              >
                {item.name}
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
};

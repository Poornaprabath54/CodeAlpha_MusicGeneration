import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Plus,
  Minus,
  Check,
  AlertTriangle,
  ShieldCheck,
  Flame,
  Layers,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dish, Restaurant, CartCustomizationSelection, CustomizationOption, SpiceLevel } from '../types';
import { useCartAndOrder } from '../context/CartAndOrderContext';

interface CustomizationModalProps {
  dish: Dish | null;
  restaurant?: Restaurant | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccessAddToCart: () => void;
}

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  dish,
  restaurant,
  isOpen,
  onClose,
  onSuccessAddToCart
}) => {
  const { addToCart, hasAllergenConflict } = useCartAndOrder();

  const [portion, setPortion] = useState<'Regular' | 'Large'>('Regular');
  const [portionPriceDelta, setPortionPriceDelta] = useState<number>(0);
  const [spiceLevel, setSpiceLevel] = useState<SpiceLevel>('Medium');
  const [selectedAddOns, setSelectedAddOns] = useState<CustomizationOption[]>([]);
  const [selectedRemovals, setSelectedRemovals] = useState<string[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [packagingPreference, setPackagingPreference] = useState('easy-open');
  const [quantity, setQuantity] = useState(1);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dish) {
      setQuantity(1);
      setPortion('Regular');
      setPortionPriceDelta(0);
      setSpiceLevel(dish.spiceLevel || 'Medium');
      setSelectedAddOns([]);
      setSelectedRemovals([]);
      setSpecialInstructions('');

      // Auto-flag allergen-safe options
      const conflicts = hasAllergenConflict(dish);
      if (conflicts.length > 0) {
        const autoRemovals: string[] = [];
        conflicts.forEach(c => {
          if (c === 'dairy') autoRemovals.push('No Butter / Fresh Cream');
          if (c === 'tree-nuts') autoRemovals.push('No Cashew Nut Paste');
          if (c === 'gluten') autoRemovals.push('Gluten-Free Hing / No Maida');
        });
        setSelectedRemovals(autoRemovals);
      }
    }
  }, [dish]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !dish) return null;

  const conflicts = hasAllergenConflict(dish);
  const hasConflict = conflicts.length > 0;

  // Add-on options tailored to Indian dishes
  const availableAddOns: CustomizationOption[] = [
    { id: 'add-paneer', name: 'Extra Malai Paneer Cubes (60g)', category: 'add-ons', priceDelta: 60 },
    { id: 'add-ghee', name: 'Top with A2 Gir Cow Desi Ghee Dollop', category: 'add-ons', priceDelta: 35 },
    { id: 'add-rice', name: 'Extra Fragrant Basmati Jeera Rice', category: 'add-ons', priceDelta: 65 },
    { id: 'add-raita', name: 'Fresh Mint & Roasted Cumin Boondi Raita', category: 'add-ons', priceDelta: 45 },
    { id: 'add-kulcha', name: 'Add 1 Crisp Tandoori Butter Roti', category: 'add-ons', priceDelta: 35 },
  ];

  // Common Indian Ingredient Removals
  const availableRemovals: string[] = [
    'No Onion & No Garlic (Jain Prep)',
    'No Fresh Coriander / Cilantro Leaves',
    'No Green Chillies in Garnish',
    'No Cashew Paste (Nut-Free Gravy)',
    'No Butter / Dairy Cream (Dairy-Free)',
    'Ultra Low Sodium (Sendha Namak)',
  ];

  const SPICE_OPTIONS: { level: SpiceLevel; label: string; icon: string; desc: string }[] = [
    { level: 'Mild', label: 'Mild', icon: '🍃', desc: 'Aromatic spices with very low heat' },
    { level: 'Medium', label: 'Medium', icon: '🌶️', desc: 'Balanced authentic regional heat' },
    { level: 'Spicy', label: 'Spicy', icon: '🌶️🌶️', desc: 'Zesty Indian street chili kick' },
    { level: 'Extra Spicy', label: 'Extra Spicy', icon: '🔥', desc: 'Fiery Guntur / Kolhapuri heat' },
  ];

  const handleToggleAddOn = (addon: CustomizationOption) => {
    setSelectedAddOns(prev => {
      const exists = prev.some(a => a.id === addon.id);
      return exists ? prev.filter(a => a.id !== addon.id) : [...prev, addon];
    });
  };

  const handleToggleRemoval = (item: string) => {
    setSelectedRemovals(prev => {
      const exists = prev.includes(item);
      return exists ? prev.filter(i => i !== item) : [...prev, item];
    });
  };

  const handleSelectPortion = (size: 'Regular' | 'Large', delta: number) => {
    setPortion(size);
    setPortionPriceDelta(delta);
  };

  // Kitchen Safety Chips
  const safetyChips = [
    '⚠️ Severe Allergy: Sterilize kadai & ladles',
    '🙏 Strict Satvik (Prepared in dedicated handi)',
    '✂️ Cut into 4 small bite-sized pieces (Easy to chew)',
    '🏷️ Label container with high-contrast bold marker',
    '📦 Double seal with tamper-evident band',
  ];

  const handleAddSafetyChip = (chip: string) => {
    if (!specialInstructions.includes(chip)) {
      setSpecialInstructions(prev => (prev ? `${prev}\n• ${chip}` : `• ${chip}`));
    }
  };

  // Price calculations
  const addOnsTotal = selectedAddOns.reduce((acc, opt) => acc + opt.priceDelta, 0);
  const singleUnitPrice = dish.price + portionPriceDelta + addOnsTotal;
  const finalItemTotal = singleUnitPrice * quantity;

  const handleAddToCart = () => {
    // Format selections for cart
    const formattedSelections: CartCustomizationSelection[] = [
      { optionId: `portion-${portion}`, name: `Portion: ${portion}`, category: 'portion', priceDelta: portionPriceDelta },
      { optionId: `spice-${spiceLevel}`, name: `Spice: ${spiceLevel}`, category: 'spice', priceDelta: 0 },
      ...selectedAddOns.map(a => ({
        optionId: a.id,
        name: a.name,
        category: a.category,
        priceDelta: a.priceDelta,
      })),
      ...selectedRemovals.map((r, i) => ({
        optionId: `rem-${i}`,
        name: `Excluded: ${r}`,
        category: 'removals' as const,
        priceDelta: 0,
      })),
    ];

    // Dummy fallback restaurant if none passed
    const activeRest = restaurant || {
      id: dish.restaurantId || 'rest-1',
      name: dish.restaurant,
      cuisine: dish.cuisine,
      address: 'Bengaluru, India',
      rating: dish.rating,
      reviewCount: dish.reviewCount,
      prepTimeMin: dish.prepTimeMins,
      prepTimeMax: dish.prepTimeMins + 10,
      baseDeliveryFee: 35,
      minimumOrder: 150,
      oilCommitment: dish.cookingOils.join(', '),
      dishes: [dish],
      allergenAuditCertified: true,
      segregatedCookingAreas: true,
      satvikJainDedicatedHandi: true,
    };

    addToCart(
      dish,
      activeRest,
      quantity,
      formattedSelections,
      specialInstructions,
      packagingPreference
    );

    onClose();
    onSuccessAddToCart();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="customize-title"
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
                Customization Flow
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Base ₹{dish.price}
              </span>
            </div>
            <h2 id="customize-title" className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Customize {dish.name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Kitchen: <strong className="text-slate-800">{dish.restaurant}</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Cancel customization"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors touch-target-accessible"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Allergen Warning Banner if applicable */}
        {hasConflict && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2.5 text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-amber-800">Allergen Shield Alert:</strong> Contains {conflicts.join(', ')}. Use the ingredient removals below to customize safely.
            </div>
          </div>
        )}

        {/* 1. Choose Portion */}
        <section className="space-y-3">
          <label className="text-sm font-extrabold text-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-600" />
              <span>1. Choose Portion Size</span>
            </div>
            <span className="text-xs text-slate-500 font-normal">Select one</span>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSelectPortion('Regular', 0)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                portion === 'Regular'
                  ? 'border-amber-500 bg-amber-50 text-slate-900 ring-2 ring-amber-400/40 font-bold'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-extrabold">Regular Portion</span>
                <span className="text-xs font-mono text-emerald-700 font-bold">Included</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Standard serving ({dish.servingSize})</p>
            </button>

            <button
              type="button"
              onClick={() => handleSelectPortion('Large', 60)}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                portion === 'Large'
                  ? 'border-amber-500 bg-amber-50 text-slate-900 ring-2 ring-amber-400/40 font-bold'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-extrabold">Large (+50%)</span>
                <span className="text-xs font-mono text-amber-700 font-bold">+₹60</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Extra portion for hearty appetites</p>
            </button>
          </div>
        </section>

        {/* 2. Choose Spice Level */}
        <section className="space-y-3">
          <label className="text-sm font-extrabold text-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>2. Choose Spice Level</span>
            </div>
            <span className="text-xs text-slate-500 font-normal">Custom heat</span>
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {SPICE_OPTIONS.map(opt => (
              <button
                key={opt.level}
                type="button"
                onClick={() => setSpiceLevel(opt.level)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  spiceLevel === opt.level
                    ? 'border-amber-500 bg-amber-50 text-slate-900 ring-2 ring-amber-400/40 font-bold'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 text-sm font-bold">
                  <span>{opt.icon}</span>
                  <span>{opt.label}</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{opt.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* 3. Add-ons with Dynamic Pricing */}
        <section className="space-y-3">
          <label className="text-sm font-extrabold text-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>3. Optional Add-ons</span>
            </div>
            <span className="text-xs text-slate-500 font-normal">Enhance your meal</span>
          </label>

          <div className="space-y-2">
            {availableAddOns.map(addon => {
              const isSelected = selectedAddOns.some(a => a.id === addon.id);
              return (
                <button
                  key={addon.id}
                  type="button"
                  onClick={() => handleToggleAddOn(addon)}
                  className={`w-full p-3 rounded-2xl border flex items-center justify-between text-left transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50 text-slate-900 ring-1 ring-emerald-400 font-bold'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center border ${
                        isSelected
                          ? 'bg-emerald-600 border-emerald-600 text-white font-black'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span className="text-xs sm:text-sm font-semibold">{addon.name}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-amber-600">
                    +₹{addon.priceDelta}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 4. Remove Ingredients (Allergen & Preference Safety) */}
        <section className="space-y-3">
          <label className="text-sm font-extrabold text-slate-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Minus className="w-4 h-4 text-rose-500" />
              <span>4. Remove Ingredients (Exclusions)</span>
            </div>
            <span className="text-xs text-slate-500 font-normal">Kitchen will exclude</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {availableRemovals.map(removal => {
              const isExcluded = selectedRemovals.includes(removal);
              return (
                <button
                  key={removal}
                  type="button"
                  onClick={() => handleToggleRemoval(removal)}
                  className={`p-3 rounded-2xl border flex items-center justify-between text-left transition-all ${
                    isExcluded
                      ? 'border-rose-400 bg-rose-50 text-rose-900 ring-1 ring-rose-300 font-bold'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs font-medium">{removal}</span>
                  <div
                    className={`w-5 h-5 rounded-lg flex items-center justify-center border shrink-0 ${
                      isExcluded
                        ? 'bg-rose-600 border-rose-600 text-white font-black'
                        : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isExcluded ? '✕' : '+'}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 5. Kitchen & Sensory Instructions */}
        <section className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label htmlFor="kitchen-notes" className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Kitchen Safety & Texture Notes
            </label>
            <span className="text-[11px] text-slate-500">Tap to add quick instruction</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {safetyChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAddSafetyChip(chip)}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[11px] text-slate-700 font-medium transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          <textarea
            id="kitchen-notes"
            value={specialInstructions}
            onChange={e => setSpecialInstructions(e.target.value)}
            rows={2}
            placeholder="E.g., Please cook in sanitized pan without cross-contact, leave sauce on side..."
            className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm focus:border-amber-500 focus:bg-white focus:ring-0 resize-none transition-colors"
          />
        </section>

        {/* Dynamic Price Summary & Quantity Drawer */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>Base Dish Price:</span>
            <span className="font-mono font-bold text-slate-900">₹{dish.price}</span>
          </div>
          {portionPriceDelta > 0 && (
            <div className="flex items-center justify-between text-xs text-amber-700">
              <span>Large Portion Upgrade:</span>
              <span className="font-mono font-bold">+₹{portionPriceDelta}</span>
            </div>
          )}
          {addOnsTotal > 0 && (
            <div className="flex items-center justify-between text-xs text-emerald-700">
              <span>Add-ons ({selectedAddOns.length}):</span>
              <span className="font-mono font-bold">+₹{addOnsTotal}</span>
            </div>
          )}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-bold text-sm text-slate-900">
            <span>Unit Price:</span>
            <span className="font-mono text-base font-black text-amber-600">₹{singleUnitPrice}</span>
          </div>
        </div>

        {/* Bottom CTA with Quantity Controls */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Quantity Stepper */}
          <div className="flex items-center gap-3 bg-slate-100 border border-slate-200 rounded-2xl p-1.5">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              aria-label="Decrease quantity"
              className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-700 shadow-sm transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-mono font-black text-base text-slate-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              aria-label="Increase quantity"
              className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-700 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to Cart CTA */}
          <button
            onClick={handleAddToCart}
            className="w-full sm:w-auto flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-transform active:scale-95 touch-target-accessible"
          >
            <ShoppingBag className="w-5 h-5 text-white" />
            <span>Add to Cart • ₹{finalItemTotal}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

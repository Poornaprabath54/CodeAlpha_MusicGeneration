import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CartItem,
  CartCustomizationSelection,
  Dish,
  Restaurant,
  UserAllergenProfile,
  DeliveryPreferences,
  ActiveOrder,
  AllergenType,
  DietaryPreference,
  OrderProgressStep
} from '../types';

interface CartAndOrderContextType {
  profile: UserAllergenProfile;
  toggleAllergy: (allergen: AllergenType) => void;
  toggleDietaryPreference: (pref: DietaryPreference) => void;
  clearAllergensAndDiet: () => void;
  setRequireDedicatedKitchen: (req: boolean) => void;
  hasAllergenConflict: (dish: Dish) => AllergenType[];

  // Cart
  cartItems: CartItem[];
  currentRestaurant: Restaurant | null;
  addToCart: (
    dish: Dish,
    restaurant: Restaurant,
    quantity: number,
    customizations: CartCustomizationSelection[],
    specialInstructions: string,
    packagingPreference: string
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQty: number) => void;
  clearCart: () => void;

  // Transparent calculations in INR (₹)
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  tipAmount: number;
  setTipAmount: (amount: number) => void;
  taxes: number; // 5% GST
  appliedCoupon: string | null;
  discountAmount: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  grandTotal: number;

  // Delivery Preferences
  deliveryPreferences: DeliveryPreferences;
  setDeliveryPreferences: React.Dispatch<React.SetStateAction<DeliveryPreferences>>;

  // Active Order & Simulation
  activeOrder: ActiveOrder | null;
  placeOrder: () => void;
  advanceOrderStep: () => void;
  resetOrder: () => void;
}

const DEFAULT_PROFILE: UserAllergenProfile = {
  allergies: ['tree-nuts', 'gluten'], // Cashews & Wheat (Hing/Maida) - popular flags in Indian context
  dietaryPreferences: ['pure-veg'],
  severeAllergyAlertsEnabled: true,
  requireDedicatedKitchenArea: true,
};

const DEFAULT_DELIVERY_PREFERENCES: DeliveryPreferences = {
  dropOffLocation: 'accessible-table-height',
  soundPreference: 'do-not-ring-bell',
  communicationPreference: 'sms-text-only',
  mobilityInstructions: 'Please leave on porch table next to the front door at waist height. Do not place on ground.',
  easyOpenPackaging: true,
  brailleHighContrastLabel: true,
};

const CartAndOrderContext = createContext<CartAndOrderContextType | undefined>(undefined);

export const CartAndOrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserAllergenProfile>(() => {
    const saved = localStorage.getItem('cb_allergen_profile_in');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cb_cart_in');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentRestaurant, setCurrentRestaurant] = useState<Restaurant | null>(() => {
    const saved = localStorage.getItem('cb_current_restaurant_in');
    return saved ? JSON.parse(saved) : null;
  });

  const [deliveryPreferences, setDeliveryPreferences] = useState<DeliveryPreferences>(() => {
    const saved = localStorage.getItem('cb_delivery_pref_in');
    return saved ? JSON.parse(saved) : DEFAULT_DELIVERY_PREFERENCES;
  });

  const [tipAmount, setTipAmount] = useState<number>(30); // ₹30 default
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(() => {
    const saved = localStorage.getItem('cb_active_order_in');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('cb_allergen_profile_in', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('cb_cart_in', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('cb_current_restaurant_in', JSON.stringify(currentRestaurant));
  }, [currentRestaurant]);

  useEffect(() => {
    localStorage.setItem('cb_delivery_pref_in', JSON.stringify(deliveryPreferences));
  }, [deliveryPreferences]);

  useEffect(() => {
    localStorage.setItem('cb_active_order_in', JSON.stringify(activeOrder));
  }, [activeOrder]);

  const toggleAllergy = (allergen: AllergenType) => {
    setProfile(prev => {
      const exists = prev.allergies.includes(allergen);
      return {
        ...prev,
        allergies: exists ? prev.allergies.filter(a => a !== allergen) : [...prev.allergies, allergen]
      };
    });
  };

  const toggleDietaryPreference = (pref: DietaryPreference) => {
    setProfile(prev => {
      const exists = prev.dietaryPreferences.includes(pref);
      return {
        ...prev,
        dietaryPreferences: exists ? prev.dietaryPreferences.filter(p => p !== pref) : [...prev.dietaryPreferences, pref]
      };
    });
  };

  const clearAllergensAndDiet = () => {
    setProfile(prev => ({
      ...prev,
      allergies: [],
      dietaryPreferences: []
    }));
  };

  const setRequireDedicatedKitchen = (req: boolean) => {
    setProfile(prev => ({ ...prev, requireDedicatedKitchenArea: req }));
  };

  const hasAllergenConflict = (dish: Dish): AllergenType[] => {
    if (!profile.allergies || profile.allergies.length === 0) return [];
    return dish.allergens.filter(a => profile.allergies.includes(a));
  };

  // Cart operations
  const addToCart = (
    dish: Dish,
    restaurant: Restaurant,
    quantity: number,
    customizations: CartCustomizationSelection[],
    specialInstructions: string,
    packagingPreference: string
  ) => {
    setCurrentRestaurant(restaurant);

    const customizationSum = customizations.reduce((acc, c) => acc + c.priceDelta, 0);
    const unitPrice = dish.price + customizationSum;
    const itemPriceTotal = Math.round(unitPrice * quantity);
    const conflicting = hasAllergenConflict(dish);

    const newItem: CartItem = {
      cartItemId: `${dish.id}-${Date.now()}`,
      dish,
      quantity,
      selectedCustomizations: customizations,
      specialInstructions,
      packagingPreference,
      itemPriceTotal,
      conflictingAllergens: conflicting
    };

    setCartItems(prev => [...prev, newItem]);
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems(prev => {
      const updated = prev.filter(item => item.cartItemId !== cartItemId);
      if (updated.length === 0) {
        setCurrentRestaurant(null);
      }
      return updated;
    });
  };

  const updateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems(prev =>
      prev.map(item => {
        if (item.cartItemId === cartItemId) {
          const singleUnit = item.itemPriceTotal / item.quantity;
          return {
            ...item,
            quantity: newQty,
            itemPriceTotal: Math.round(singleUnit * newQty)
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setCurrentRestaurant(null);
  };

  // 100% Transparent Financial Calculations in INR (₹)
  const subtotal = Math.round(cartItems.reduce((acc, i) => acc + i.itemPriceTotal, 0));
  const deliveryFee = currentRestaurant ? currentRestaurant.baseDeliveryFee : 35;
  const serviceFee = subtotal > 0 ? 15 : 0; // Honest ₹15 platform & safety verification fee
  const taxes = Math.round(subtotal * 0.05); // 5% GST on Restaurant Services

  // Coupon Discounts
  let discountAmount = 0;
  if (appliedCoupon === 'FOODPASS') {
    discountAmount = Math.min(60, Math.round(subtotal * 0.2));
  } else if (appliedCoupon === 'ALLERGYSAFE') {
    discountAmount = deliveryFee + serviceFee; // Free delivery & fee waived
  } else if (appliedCoupon === 'TASTEINDIA') {
    discountAmount = Math.min(100, Math.round(subtotal * 0.15));
  } else if (appliedCoupon === 'FIRSTSAFE') {
    discountAmount = 100;
  }

  const grandTotal = Math.max(0, Math.round(subtotal + (subtotal > 0 ? deliveryFee + serviceFee + tipAmount + taxes - discountAmount : 0)));

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const VALID_COUPONS = ['FOODPASS', 'ALLERGYSAFE', 'TASTEINDIA', 'FIRSTSAFE'];
    if (VALID_COUPONS.includes(cleanCode)) {
      setAppliedCoupon(cleanCode);
      return { success: true, message: `Coupon ${cleanCode} applied successfully!` };
    }
    return { success: false, message: 'Invalid coupon code. Try FOODPASS, ALLERGYSAFE, or TASTEINDIA.' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Order Placement and Lifecycle
  const placeOrder = () => {
    if (!currentRestaurant || cartItems.length === 0) return;

    const initialSteps: OrderProgressStep[] = [
      {
        title: 'Order Confirmed & Rasoi Allergen Audit Passed',
        description: 'Chef verified allergy preferences and prepared sanitized cookware.',
        timestamp: 'Just now',
        status: 'completed',
        safetyCheckpoint: 'Allergen Shield Cross-Checked'
      },
      {
        title: 'Dedicated Handi / Kadai Preparation',
        description: `Cooking in dedicated cookware with ${currentRestaurant.oilCommitment}.`,
        timestamp: 'In progress',
        status: 'current',
        safetyCheckpoint: 'Clean Equipment & Pure Ghee Protocol'
      },
      {
        title: 'Inspection & Tamper-Evident Safety Seal',
        description: 'Packaged in accessibility-friendly easy-grip bio boxes with high-contrast label.',
        timestamp: 'Estimated in 8 mins',
        status: 'upcoming',
        safetyCheckpoint: 'Packaging Sealed & Inspected'
      },
      {
        title: 'Courier En Route with Care',
        description: 'Courier briefed on silent/accessible delivery guidelines (Waist height table drop-off).',
        timestamp: 'Estimated in 18 mins',
        status: 'upcoming',
        safetyCheckpoint: 'Contactless Thermal Transport'
      },
      {
        title: 'Accessible Drop-Off Complete',
        description: 'Placed at waist height with photo and SMS confirmation sent.',
        timestamp: 'Estimated in 25 mins',
        status: 'upcoming',
        safetyCheckpoint: 'Confirmed At Destination'
      }
    ];

    const newOrder: ActiveOrder = {
      orderId: `CB-IN-${Math.floor(100000 + Math.random() * 900000)}`,
      restaurant: currentRestaurant,
      items: [...cartItems],
      subtotal,
      priceMatchGuarantee: true,
      deliveryFee,
      servicePlatformFee: serviceFee,
      serviceFeeExplanation: '100% of this ₹15 fee directly covers regular kitchen allergen swab testing & 24/7 care relay.',
      tipAmount,
      taxes,
      total: grandTotal,
      deliveryPreferences,
      statusStepIndex: 1,
      steps: initialSteps,
      etaMinutes: currentRestaurant.prepTimeMin + 8,
      estimatedDeliveryTime: new Date(Date.now() + (currentRestaurant.prepTimeMin + 8) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      courierName: 'Rajesh Kumar (Accessibility Trained Courier)',
      courierPhone: '+91 98450 12894',
      courierVehicle: 'Silver Ather 450X EV (#KA-04-EA-7890)'
    };

    setActiveOrder(newOrder);
    clearCart();
  };

  const advanceOrderStep = () => {
    setActiveOrder(prev => {
      if (!prev) return null;
      const nextIndex = Math.min(prev.statusStepIndex + 1, prev.steps.length - 1);
      const updatedSteps = prev.steps.map((step, idx) => {
        if (idx < nextIndex) return { ...step, status: 'completed' as const, timestamp: 'Completed' };
        if (idx === nextIndex) return { ...step, status: 'current' as const, timestamp: 'In progress' };
        return { ...step, status: 'upcoming' as const };
      });

      const updatedEta = Math.max(0, prev.etaMinutes - 6);

      return {
        ...prev,
        statusStepIndex: nextIndex,
        steps: updatedSteps,
        etaMinutes: updatedEta
      };
    });
  };

  const resetOrder = () => {
    setActiveOrder(null);
  };

  return (
    <CartAndOrderContext.Provider
      value={{
        profile,
        toggleAllergy,
        toggleDietaryPreference,
        clearAllergensAndDiet,
        setRequireDedicatedKitchen,
        hasAllergenConflict,

        cartItems,
        currentRestaurant,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,

        subtotal,
        deliveryFee,
        serviceFee,
        tipAmount,
        setTipAmount,
        taxes,
        appliedCoupon,
        discountAmount,
        applyCoupon,
        removeCoupon,
        grandTotal,

        deliveryPreferences,
        setDeliveryPreferences,

        activeOrder,
        placeOrder,
        advanceOrderStep,
        resetOrder,
      }}
    >
      {children}
    </CartAndOrderContext.Provider>
  );
};

export const useCartAndOrder = (): CartAndOrderContextType => {
  const context = useContext(CartAndOrderContext);
  if (!context) {
    throw new Error('useCartAndOrder must be used within a CartAndOrderProvider');
  }
  return context;
};

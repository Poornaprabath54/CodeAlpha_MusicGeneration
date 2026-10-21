// Core Types for FoodAccess — "Good Food. For Everyone."

export type AllergenType =
  | 'peanuts'
  | 'tree-nuts' // Cashews, Almonds
  | 'dairy'     // Ghee, Paneer, Malai, Cream, Curd
  | 'gluten'    // Wheat Atta, Maida, Wheat-Compounded Hing
  | 'mustard'   // Sarson Oil, Mustard Seeds
  | 'soy'       // Soya Protein
  | 'sesame'    // Til
  | 'eggs'
  | 'fish'
  | 'shellfish';

export type DietaryPreference =
  | 'veg'
  | 'non-veg'
  | 'vegan'
  | 'jain'
  | 'eggless'
  | 'gluten-free'
  | 'dairy-free'
  | 'low-spice'
  | 'high-protein';

export type SpiceLevel = 'Mild' | 'Medium' | 'Spicy' | 'Extra Spicy';

export type RegionType =
  | 'All'
  | 'North India'
  | 'South India'
  | 'East India'
  | 'West India'
  | 'Rajasthani'
  | 'Northeast'
  | 'Street Food'
  | 'Desserts';

export interface IngredientItem {
  name: string;
  isPrimary: boolean;
  isAllergen: boolean;
  allergenType?: AllergenType;
  removable: boolean;
  organic?: boolean;
}

export interface NutritionFacts {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  sodiumMg: number;
  fiberG: number;
}

export interface CustomizationOption {
  id: string;
  name: string;
  category: 'portion' | 'spice' | 'add-ons' | 'removals';
  priceDelta: number; // in INR (₹)
  allergenSafe?: boolean;
  defaultSelected?: boolean;
}

export interface Dish {
  id: string;
  name: string;
  restaurant: string;
  restaurantId: string;
  region: RegionType;
  cuisine: string;
  category: string;
  price: number; // in INR (₹)
  image: string;
  description: string;
  isVegetarian: boolean;
  isNonVeg: boolean;
  isVegan: boolean;
  isJain: boolean;
  containsEgg: boolean;
  containsDairy: boolean;
  containsGluten: boolean;
  allergens: AllergenType[];
  spiceLevel: SpiceLevel;
  servingSize: string;
  ingredients: IngredientItem[];
  cookingOils: string[];
  crossContaminationRisk: 'None - Dedicated Equipment' | 'Low Risk' | 'Shared Kitchen Station';
  crossContaminationDetails: string;
  nutrition: NutritionFacts;
  rating: number;
  reviewCount: number;
  prepTimeMins: number;
  customizations: CustomizationOption[];
  readAloudDescription: string;
  bestseller?: boolean;
  discountText?: string;
  distanceKm?: number;
  hygieneScore?: number;
  availableLocations?: string[];
}

export interface CuisineCategory {
  id: RegionType;
  name: string;
  subtitle: string;
  image: string;
  tag: string;
  dishCount: number;
}

export interface CartCustomization {
  portion: 'Regular' | 'Large';
  portionPriceDelta: number;
  spiceLevel: SpiceLevel;
  addOns: { id: string; name: string; price: number }[];
  removals: string[];
  specialInstructions: string;
  packagingPreference: 'easy-open' | 'spill-proof';
}

export interface CartItem {
  cartItemId: string;
  dish: Dish;
  quantity: number;
  customization: CartCustomization;
  itemPriceTotal: number;
}

export type OrderStatus = 'Confirmed' | 'Preparing' | 'Out for Delivery' | 'Delivered';

export interface OrderProgressStep {
  status: OrderStatus;
  title: string;
  description: string;
  time: string;
  isCurrent: boolean;
  isCompleted: boolean;
}

export interface DeliveryPreferences {
  dropOffLocation: 'accessible-table-height' | 'leave-at-door' | 'hand-to-me' | 'leave-with-security-guard';
  soundPreference: 'do-not-ring-bell' | 'knock-firmly' | 'ring-bell' | 'quiet-drop';
  communicationPreference: 'sms-text-only' | 'whatsapp-update' | 'standard-call';
  mobilityInstructions: string;
  easyOpenPackaging: boolean;
  highContrastLabel: boolean;
}

export interface ActiveOrder {
  orderId: string;
  restaurant: string;
  items: CartItem[];
  subtotal: number;
  customizationTotal: number;
  deliveryFee: number;
  taxes: number; // 5% GST
  tipAmount: number;
  total: number;
  deliveryPreferences: DeliveryPreferences;
  status: OrderStatus;
  steps: OrderProgressStep[];
  etaMinutes: number;
  orderTime: string;
  deliveryAddress: string;
  paymentMethod: string;
  courierName: string;
  courierVehicle: string;
  courierPhone: string;
}

export interface UserPreferences {
  dietaryFilters: DietaryPreference[];
  allergens: AllergenType[];
  favoriteDishIds: string[];
  currentLocation: string;
  isHighContrast: boolean;
  fontScale: '100%' | '115%' | '130%' | '150%';
  reduceMotion: boolean;
  screenReaderVoice: boolean;
}

export interface UserAllergenProfile {
  allergies: AllergenType[];
  dietaryPreferences: string[];
  severeAllergyAlertsEnabled: boolean;
  requireDedicatedKitchenArea: boolean;
}

export interface CartCustomizationSelection {
  id: string;
  name: string;
  price: number;
  category?: string;
  allergenSafe?: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  cuisine: string;
  city: string;
  area: string;
  landmark?: string;
  address: string;
  rating: number;
  reviewCount: number;
  deliveryFee: number;
  prepTime: string;
  distanceKm: number;
  priceForTwo: number;
  isPureVeg: boolean;
  hasJainKitchen: boolean;
  allergenCertified: boolean;
  hygieneScore: number; // out of 5
  discountTag?: string;
  featuredDishes?: string[];
  lat?: number;
  lng?: number;
  dishes?: Dish[];
  oilCommitment?: string;
  allergenAuditCertified?: boolean;
  segregatedCookingAreas?: boolean;
  satvikJainDedicatedHandi?: boolean;
}

export interface CityLocation {
  id: string;
  name: string;
  city: string;
  state: string;
  area: string;
  landmark: string;
  lat: number;
  lng: number;
  pincode: string;
  popularSpots?: string[];
}


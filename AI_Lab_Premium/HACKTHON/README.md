# ClarityBites — Accessible & Transparent Food Ordering Experience

> **Hackathon Submission**: Accessible and Transparent Food Ordering Experience  
> **Industry**: Food Technology / E-commerce  
> **Platform & Tech**: Responsive Web / Mobile UI Frame / React 19 / Vite / Tailwind CSS / WCAG 2.2 AAA  
> **Scope**: Food Discovery / Ordering / Accessibility / Ingredient Transparency / Price Honesty  

---

## 🌟 Executive Summary

**ClarityBites** is an inclusive, human-centered food discovery and ordering web platform designed for users with diverse accessibility, cognitive, dietary, and sensory needs. Traditional food delivery apps hide ingredients, obscure service fees, and bury allergen warnings. ClarityBites redesigns the entire food ordering journey from the ground up:

1. **Complete Ingredient & Cooking Oil Transparency**: Every dish discloses 100% of its ingredients, cooking oils used (e.g. 100% cold-pressed olive or avocado oil, zero seed oils), and kitchen cross-contamination protocols.
2. **Personal Allergen Shield**: Automatically alerts users with high-contrast warning badges whenever a menu item conflicts with their saved allergens, offering 1-click safe substitutions.
3. **Universal Accessibility Engine (WCAG 2.2 AAA)**: Built-in text scaling (up to 150%), OpenDyslexic font support, High Contrast Dark/Light modes, Colorblind vision accommodation filters (Protanopia, Deuteranopia, Tritanopia, Monochrome), Sensory / Low-Distraction Mode, and browser-native Text-to-Speech audio voiceovers.
4. **100% Transparent Fee Guarantee**: Zero hidden fees. In-store menu price match guarantee, exact delivery formula, platform fee purpose breakdown, and 100% tip pass-through to couriers.
5. **Accessible Delivery & Multi-Sensory Tracking**: Waist-height drop-off requests (eliminating ground bending), sensory-friendly silent delivery (no doorbell ringing), SMS-only courier communication for the Deaf/Hard-of-Hearing, and 5-stage allergen-verified order tracking with spoken updates.

---

## 🚀 Key Deliverables Implemented

### 1. Restaurant Discovery
- **Dietary & Lifestyle Filters**: Quick filter by Gluten-Free (Celiac Safe), 100% Plant-Based Vegan, Nut-Free Facility, Halal Certified, Kosher, Low Sodium, Diabetic-Friendly, and Seed-Oil Free.
- **Safety Credentials**: Verified certifications displayed upfront (GFCO Level 3, FARE Certified, ISO 22000).
- **Dual View Modes**:
  - *Visual Cards*: Full visual photography with badges, oil disclosures, and prep times.
  - *High-Readability Accessible List*: Enlarged typography, high-contrast rows, ideal for screen magnification and keyboard users.
- **Sensory-Friendly Mode**: Automatically removes high-saturation colors and suppresses motion.

### 2. Menu Interface
- Minimum 48x48px touch targets adhering to WCAG AAA standards.
- Distinct shape and color combinations for allergen indicators (never relying on color alone).
- Instant audio preview button on each dish item with speech synthesis.

### 3. Ingredient Information & Nutritional Panel
- **Disclosed Components**: Segregated into primary ingredients, seasonings, and dressings.
- **Cooking Oils**: Explicit disclosure of oils used for cooking and sautéing.
- **Cross-Contamination Disclosures**: Specific details regarding dedicated fryers, cutting boards, and sanitization cycles.
- **Interactive Nutritional Facts**: Dynamic portion scaler (1x, 1.5x, 2x) recalculating calories, protein, carbs, fats, sodium, fiber, and sugar in real-time.

### 4. Dietary & Allergen Shield
- User configuration modal supporting the 11 major food allergens (Gluten, Dairy, Peanuts, Tree Nuts, Eggs, Soy, Shellfish, Fish, Sesame, Mustard, Sulfites).
- Real-time conflict banners across dish cards and inside the customizer.
- Preset configurations: Celiac Safe, Anaphylactic Nut Allergy, Plant-Based / Dairy-Free, and Diabetic / Low Sodium Care.

### 5. Food Customization Flow
- Step-by-step customizer with clear +/- dollar amounts for all options.
- $0.00 allergen-safe substitutions and removals.
- **Pre-filled Kitchen Safety Chips**:
  - *"⚠️ Severe Allergy - Sterilize prep area & utensils"*
  - *"🧂 No Added Salt / Ultra Low Sodium"*
  - *"✂️ Cut into 4 small bite-sized pieces (Easy to chew/motor friendly)"*
  - *"🥄 Include adaptive easy-grip cutlery set"*
  - *"🏷️ Label container with high-contrast marker"*
- **Accessible Packaging**: Choice between Easy-Open Pull Tabs (low-grip strength) and Spill-Proof Thermal Lock.

### 6. Cart & Checkout Transparency
- Itemized price breakdown with zero unexpected markups:
  - *Food Subtotal*
  - *In-Store Price Match Guarantee*
  - *Transparent Delivery Fee*
  - *Safety Audit & Platform Fee ($1.50 with explanation tooltip)*
  - *Courier Tip (100% to driver with customizable presets)*
  - *Taxes*
- **Accessible Delivery Preferences**:
  - Drop-off placement: Accessible table/bench (waist height) vs. front door vs. hand-off.
  - Sound preference: Do not ring doorbell (sensory/service dog friendly) vs. knock firmly vs. silent drop.
  - Communication protocol: SMS text only (Deaf friendly) vs. TTY relay vs. standard call.
  - Custom mobility and gate instructions.

### 7. Multi-Sensory Order Tracking
- Real-time 5-stage timeline with safety checkpoint validation:
  1. *Order Confirmed & Allergen Audit Passed*
  2. *Dedicated Station Preparation (Clean equipment protocol)*
  3. *Inspection & Tamper-Evident Safety Seal*
  4. *Courier En Route with Care (Contactless thermal transport)*
  5. *Accessible Drop-Off Complete (Waist height with SMS confirmation)*
- **Spoken Status Announcements**: Web Speech API announces current stage and estimated time.
- **Direct 1-Tap Driver Chat Chips**: Pre-composed accessibility reminders.
- **Interactive Stage Simulator**: Allows evaluators and users to advance through order lifecycle steps with one click.

### 8. Accessible UI Toolkit & Mobile Device Mockup
- **Floating A11y Hub**:
  - Text Size Scaler (100%, 115%, 130%, 150%)
  - Theme Contrast (Standard, High Contrast Dark, High Contrast Light)
  - OpenDyslexic Font toggle
  - SVG Color Matrix Colorblind Filters (Deuteranopia, Protanopia, Tritanopia, Monochrome)
  - Sensory / Low-Distraction Mode toggle
  - Audio Voiceover test
- **Mobile Device Frame Toggle**: Evaluators can toggle between a full responsive desktop view and a native iPhone hardware frame with dynamic island and status bar at any time.

---

## 💻 Tech Stack & Architecture

- **Frontend Core**: React 18 / 19, TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS with custom WCAG AAA contrast palettes and focus ring utilities
- **Icons**: Lucide React
- **Typography**: Inter, Lexend, and OpenDyslexic
- **APIs**: Web Speech API (`SpeechSynthesis`), HTML5 ARIA semantics, SVG Color Matrices (`<feColorMatrix>`)

---

## 🛠️ How to Run Locally

1. **Install Dependencies** (already installed in workspace):
   ```bash
   npm.cmd install
   ```

2. **Start Development Server**:
   ```bash
   npm.cmd run dev
   ```
   Open `http://localhost:3000` in your web browser.

3. **Build for Production**:
   ```bash
   npm.cmd run build
   ```

4. **Preview Production Build**:
   ```bash
   npm.cmd run preview
   ```

---

## ♿ Accessibility Compliance Summary (WCAG 2.2 AAA)

| Feature | WCAG Success Criterion | Implementation in ClarityBites |
| :--- | :--- | :--- |
| **Contrast (Enhanced)** | 1.4.6 (Level AAA) | High-contrast dark and light modes with 7:1+ contrast ratios and high-visibility yellow focus indicators |
| **Resize Text** | 1.4.4 (Level AA) & 1.4.12 | Root font scaling from 100% to 150% without clipping or layout breaking |
| **Non-Text Contrast** | 1.4.11 (Level AA) | 3px emerald focus outlines on all interactive elements; 4px yellow in high-contrast mode |
| **Target Size** | 2.5.5 (Level AAA) | Minimum touch target size of 48px x 48px on all primary interactive buttons |
| **Use of Color** | 1.4.1 (Level A) | Allergens and dietary tags pair distinct icons and text labels alongside color |
| **Bypass Blocks** | 2.4.1 (Level A) | Prominent Skip-to-Content keyboard link at the very top of the DOM |
| **Audio Descriptions** | 1.2.5 (Level AAA) | Integrated Web Speech API reads complete dish profiles, ingredients, and order tracking aloud |
| **Sensory / Motion** | 2.2.2 & 2.3.3 | Sensory-friendly mode disables all CSS animations, transitions, and pulsing indicators |

---

*Designed and engineered with care for all diners.*

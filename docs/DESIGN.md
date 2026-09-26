# VAJRA (वज्र) — Design System & Architecture Specification

## 1. Brand Identity & Market Positioning
- **Brand Name**: **VAJRA (वज्र) // INDIA**
- **Etymology**: In Sanskrit and Indian engineering tradition, *Vajra* symbolizes indestructible diamond precision and electrical power.
- **Product Scope**: **Specialized Destination for Precision Consumer Electronics & Smart Lifestyle Gear**:
  1. **Personal Audio**: Reference-grade planar magnetic headphones, spatial sound monitors, and ANC earphones.
  2. **Smart Wearables**: Grade-5 titanium biometric smartwatches, clinical telemetry health rings.
  3. **Desk & Computing**: Gasket-mounted mechanical keyboards, milled magnesium 4000Hz mice.
  4. **Smart Workspace**: Full-spectrum SunLike 98+ CRI circadian desk light bars.
  5. **Modular Carry**: Weatherproof Cordura ballistic commuter backpacks with Fidlock magnetic closures.

---

## 2. Aesthetic System (Anti-AI-Slop, Bright & Light Theme)
- **Theme**: Crisp, luminous editorial light theme.
- **Backgrounds**:
  - Base: `#f8fafc` (Slate 50 / Pearl White)
  - Card & Surfaces: `#ffffff` (Pure White) with subtle inner borders `#f1f5f9`
- **Architectural Dividers & Borders**: `#e2e8f0` (Fine 1px structural lines)
- **Typographic Scale & Contrast**:
  - Headings: Deep Obsidian Black `#09090b` (`font-bold`, `tracking-tight`, `text-wrap: balance`)
  - Body Text: Charcoal Zinc `#27272a` (high legibility, WCAG AAA ≥ 7:1)
  - Muted Text: Slate `#71717a`
- **Color Palette & Accents**:
  - Primary Accent: **Royal Saffron / Electric Amber** (`#ea580c` / `#c2410c`)
  - Secondary Accent: **Deep Indigo / Midnight Cobalt** (`#0f172a` / `#1e3a8a`)
  - Indian Compliance Badges: **Emerald Green** (`#16a34a`)
  - Pricing & Live Badges: Bold Indian Rupee fonts in `#ea580c` and `#09090b`

---

## 3. Motion & Physics
- **Smooth Scroll**: Powered by **Lenis** (`lenis`) with exponential easing (`t => Math.min(1, 1.001 - Math.pow(2, -10 * t))`), hardware acceleration, and touch damping.
- **Micro-Interactions**:
  - `.double-bezel`: Outer shell with soft ambient shadow and concentric inner border
  - `.btn-nested`: Nested button architecture with circular trailing icon that shifts on hover
  - `active:scale-[0.98]` tactile press physics on all interactive buttons

---

## 4. Indian Localization & Commerce Protocol
- **Currency**: **₹ (INR)** with Indian numbering convention (`formatINR(29999)` → `₹29,999`).
- **Free Shipping Threshold**: Free pan-India courier delivery on all orders over **₹999**.
- **Delivery PIN Code Telemetry**:
  - Serviceable across 19,000+ Indian PIN codes via BlueDart & Delhivery Express.
  - Dedicated API endpoint `/api/pincode?code=XXXXXX` returning live delivery estimates.
- **No-Cost EMI**: 3-month and 6-month EMI calculated on product pages and cards.
- **Tax & GST**: All retail prices inclusive of 18% GST. Business customers can toggle the **GSTIN** option to claim Input Tax Credit (ITC).
- **Payment Protocols**:
  - UPI / QR (Google Pay, PhonePe, Paytm, BHIM, UPI ID)
  - Credit & Debit Cards (RuPay, Visa, Mastercard)
  - Net Banking (HDFC, ICICI, SBI, Axis, Kotak)
  - Cash on Delivery (COD) across pan-India PIN codes.

---

## 5. Architectural Component Topology
- `components/SmoothScroll.tsx`: Global Lenis smooth scroll provider
- `components/Navbar.tsx`: Light-theme header with pan-India banner, brand badge, and live cart indicator
- `components/CartDrawer.tsx`: Slide-over cart drawer with ₹999 free delivery meter and coupon codes (`FESTIVE10`, `UPI100`, `VAJRAVIP`)
- `components/ProductCard.tsx`: Light-theme double-bezel product card with EMI and BIS badges
- `components/AIChatModal.tsx`: **Vajra Mitra** AI shopping advisor with inline recommendation cards
- `components/Footer.tsx`: Studio locations (Bengaluru, Gurugram), Indian compliance, and pan-India trust guarantees
- `app/walkthrough/page.tsx`: Interactive full feature inspection tour
- `app/admin/page.tsx`: Studio inventory and BlueDart / Delhivery dispatch console

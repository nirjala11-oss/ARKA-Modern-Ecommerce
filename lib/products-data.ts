import { Product, Review } from '@/types'

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'vajra-01',
    name: 'Vajra Aetheris Pro Planar ANC Headphones',
    subtitle: 'Reference-grade spatial audio with magnetic planar transducers',
    description: 'Precision-machined from aerospace 6063 aluminum and soft lambskin. Featuring custom 40mm planar magnetic drivers, adaptive hybrid noise cancellation with 8 beamforming mics, LDAC lossless wireless, and 48 hours of battery playback.',
    price: 29999,
    originalPrice: 34999,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1200&auto=format&fit=crop&q=80',
    ],
    category: 'Audio',
    tags: ['headphones', 'audiophile', 'planar', 'wireless', 'anc'],
    stock: 28,
    rating: 4.9,
    reviewCount: 312,
    badge: 'Bestseller',
    features: [
      'Custom 40mm planar magnetic drivers engineered for zero acoustic distortion',
      'Hybrid Active Noise Cancellation with ambient awareness transparency mode',
      'Lossless 24-bit/96kHz LDAC and aptX Adaptive codec support',
      'Multipoint dual-device Bluetooth 5.4 with instantaneous handover',
      '1-Year Pan-India Doorstep Replacement Warranty with BIS Certification'
    ],
    specs: {
      'Driver Architecture': '40mm Planar Magnetic Array',
      'Frequency Response': '5Hz - 45,000Hz Ultra-Wide',
      'Battery Endurance': '48 hours (ANC off) / 38 hours (ANC on)',
      'Fast Charging': 'USB-C SuperCharge (10 min charge = 6 hours)',
      'Chassis Material': 'Aero-grade 6063 Bead-blasted Aluminum',
      'Certification': 'BIS Certified (R-41009823), Hi-Res Audio Wireless'
    }
  },
  {
    id: 'vajra-02',
    name: 'Vajra Chronos Horizon Kinetic Smartwatch',
    subtitle: 'Grade-5 titanium monocoque with dual-layer AMOLED and sapphire dome',
    description: 'Sculpted from a solid block of grade-5 titanium with a double-domed scratch-proof sapphire crystal face. Features continuous optical PPG biometrics, SpO2 tracking, GPS navigation, and 14 days of endurance on a single charge.',
    price: 34999,
    originalPrice: 39999,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=1200&auto=format&fit=crop&q=80',
    ],
    category: 'Wearables',
    tags: ['smartwatch', 'titanium', 'fitness', 'sapphire', 'health'],
    stock: 19,
    rating: 4.85,
    reviewCount: 184,
    badge: 'Featured',
    features: [
      'Grade 5 aerospace titanium case with diamond-like carbon (DLC) scratch resistance',
      '1.43-inch Ultra-Retina LTPO AMOLED display with 1000 nits outdoor peak brightness',
      'Continuous HRV, VO2 Max, ECG heart rate, and circadian sleep telemetry',
      '50-meter water resistance with automated swim tracking',
      'Works with iOS and Android via encrypted Vajra Sync App'
    ],
    specs: {
      'Case Diameter': '42mm Grade-5 Titanium',
      'Glass Shield': 'Double-domed anti-reflective Sapphire Crystal',
      'Water Rating': '5 ATM / 50 meters water resistant',
      'Battery Runtime': 'Up to 14 days standard / 40 hours continuous GPS',
      'Sensors': 'Optical PPG 8-channel, 6-axis Gyroscope, Altimeter'
    }
  },
  {
    id: 'vajra-03',
    name: 'Vajra Nocturne 65 Gasket Mechanical Keyboard',
    subtitle: 'Machined aluminum chassis with bespoke pre-lubed tactile switches',
    description: 'A tactile masterpiece built for software architects and typists. Featuring a poly-carbonate plate with poron foam isolation gaskets, factory-lubed custom 45g linear switches, double-shot PBT keycaps, and hot-swap PCB.',
    price: 16999,
    originalPrice: 19999,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=1200&auto=format&fit=crop&q=80',
    ],
    category: 'Computing',
    tags: ['keyboard', 'mechanical', 'gasket', 'wireless', 'desksetup'],
    stock: 42,
    rating: 4.95,
    reviewCount: 428,
    badge: 'Bestseller',
    features: [
      'Solid CNC-milled 6063 aluminum body with brass acoustic weight',
      'Poron foam sandwich gasket dampening for a deep, satisfying acoustic thock',
      'Pre-lubed custom Kailh linear switches with POM self-lubricating stems',
      'Tri-mode connection: 2.4GHz 1000Hz hyper-polling dongle, Bluetooth 5.3, USB-C',
      'Mac and Windows interchangeable layout with programmable VIA open-source firmware'
    ],
    specs: {
      'Layout': '65% Compact (68 keys with brass rotary volume encoder)',
      'Mount Type': 'Gasket Mount with silicone isolation socks',
      'Polling Frequency': '1000Hz (Wired & 2.4G) / 125Hz (Bluetooth)',
      'Battery Capacity': '4000mAh (Up to 240 hours usage with backlight off)',
      'Weight': '1.35 kg'
    }
  },
  {
    id: 'vajra-04',
    name: 'Vajra Kinesis 53g Ultralight Magnesium Mouse',
    subtitle: 'Milled magnesium alloy exoskeleton with 4000Hz polling rate',
    description: 'Milled from magnesium alloy for exceptional structural rigidity and ventilation at just 53 grams. Equipped with the PixArt PAW3395 optical sensor with 26,000 DPI and optical micro-switches rated for 100 million clicks.',
    price: 8999,
    originalPrice: 10999,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=1200&auto=format&fit=crop&q=80',
    ],
    category: 'Computing',
    tags: ['mouse', 'magnesium', 'ultralight', 'wireless', 'gaming'],
    stock: 55,
    rating: 4.88,
    reviewCount: 240,
    badge: 'Bestseller',
    features: [
      'Featherweight 53g magnesium alloy skeleton with open palm ventilation',
      'PixArt PAW3395 flagship sensor: 26,000 DPI and 650 IPS tracking accuracy',
      'Hyper-polling 4000Hz nano wireless receiver for sub-millisecond response',
      'Light-speed optical switches with instantaneous zero-debounce actuation',
      'Pure virgin PTFE curved glide skates'
    ],
    specs: {
      'Sensor': 'PixArt PAW3395 (26,000 DPI, 50G acceleration)',
      'Total Weight': '53 grams (± 1g)',
      'Battery Life': 'Up to 90 hours at 1000Hz / 45 hours at 4000Hz',
      'Switches': 'Omron Optical 100M actuations'
    }
  },
  {
    id: 'vajra-05',
    name: 'Vajra Pulse Zero Smart Biometric Health Ring',
    subtitle: 'Under 4 grams of grade-5 titanium with clinical physiological telemetry',
    description: 'Designed to be forgotten on your finger while providing medical-grade sleep phase analysis, recovery strain metrics, skin temperature trend monitoring, and continuous pulse wave velocity without screens or distractions.',
    price: 19999,
    originalPrice: 22999,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1200&auto=format&fit=crop&q=80',
    ],
    category: 'Wearables',
    tags: ['ring', 'smartring', 'health', 'sleep', 'biometrics'],
    stock: 31,
    rating: 4.8,
    reviewCount: 165,
    badge: 'New',
    features: [
      'Grade 5 titanium outer shell with hypoallergenic medical-grade resin inner ring',
      'Up to 8 days battery runtime on a single 30-minute wireless charging cradle',
      'Continuous blood oxygen, PPG heart rate variability, and circadian body temperature',
      'Water resistant to 100 meters (safe for swimming and diving)',
      'Zero subscription fees — lifetime full app telemetry included'
    ],
    specs: {
      'Weight': '3.2 - 3.8 grams (depending on ring size)',
      'Profile': '7.9 mm width x 2.5 mm thickness',
      'Available Sizes': 'US 6 through 13 with free sizing kit delivered',
      'Water Resistance': '100 meters / 10 ATM'
    }
  },
  {
    id: 'vajra-06',
    name: 'Vajra Helios Halo Circadian Desk Light',
    subtitle: 'SunLike 98+ CRI optical light bar with automated circadian color shifting',
    description: 'Simulates the natural spectrum of morning and evening sunlight to eliminate digital eye fatigue and synchronize your circadian rhythm. Features stepless rotary touch dimming and asymmetrical monitor illumination.',
    price: 11999,
    originalPrice: 13999,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1200&auto=format&fit=crop&q=80',
    ],
    category: 'Workspace',
    tags: ['lighting', 'circadian', 'workspace', 'desklight'],
    stock: 36,
    rating: 4.86,
    reviewCount: 142,
    badge: 'New',
    features: [
      'Full-spectrum SunLike LEDs with CRI > 98 for absolute visual color fidelity',
      'Automated circadian mode smoothly tuning temperature from 2700K warm to 6500K focus',
      'Patented asymmetrical optical reflector ensuring zero monitor screen reflection',
      'Weighted cast zinc alloy base with integrated 15W Qi wireless phone charger'
    ],
    specs: {
      'Color Temperature': '2700K - 6500K stepless dynamic',
      'Illuminance': '1200 Lux at 45cm distance',
      'Color Fidelity': 'Ra > 98, R9 > 95',
      'Power Input': 'USB-C PD 30W'
    }
  },
  {
    id: 'vajra-07',
    name: 'Vajra Aura SoundSphere Spatial Hi-Fi Monitor',
    subtitle: 'Cast polymer-concrete acoustic sphere with 360° uncolored soundstage',
    description: 'An acoustic marvel that doubles as a minimalist room sculpture. Hand-cast from ultra-dense polymer-modified concrete to completely eliminate cabinet resonance, housing dual opposed passive radiators and an upward titanium driver.',
    price: 24999,
    originalPrice: 28999,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1200&auto=format&fit=crop&q=80',
    ],
    category: 'Audio',
    tags: ['speaker', 'hifi', 'spatial', 'bluetooth', 'audio'],
    stock: 14,
    rating: 4.92,
    reviewCount: 88,
    badge: 'Limited',
    features: [
      'Acoustically dead cast architectural concrete enclosure for zero cabinet coloring',
      'DSP-calibrated dual 4-inch Kevlar woofers with dual side passive radiators',
      'AirPlay 2, Spotify Connect, and Wi-Fi lossless 24-bit streaming support',
      'Room-acoustic calibration via onboard MEMS measurement microphones'
    ],
    specs: {
      'Amplification': 'Class-D 90W RMS bi-amplified output',
      'Frequency Band': '38Hz - 22kHz (-3dB)',
      'Dimensions': '220mm spherical diameter',
      'Weight': '4.2 kg'
    }
  },
  {
    id: 'vajra-08',
    name: 'Vajra Vanguard Modular Commuter Pack 24L',
    subtitle: 'Weatherproof 1000D Cordura ballistic pack with magnetic Fidlock closures',
    description: 'Engineered for tech commuters and digital nomads. Built from 1000D recycled Cordura with seam-sealed Aquaguard YKK zippers, suspended padded cradle fitting up to 16” laptops, and breathable 3D airflow back panel.',
    price: 12499,
    originalPrice: 14999,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&auto=format&fit=crop&q=80',
    ],
    category: 'Lifestyle',
    tags: ['backpack', 'commuter', 'techpack', 'cordura', 'waterproof'],
    stock: 22,
    rating: 4.78,
    reviewCount: 114,
    badge: 'Eco',
    features: [
      '1000D recycled Cordura eco-nylon with durable water repellent (DWR) finish',
      'Floating suspended laptop pocket with ultra-soft microfleece lining',
      'German Fidlock magnetic V-buckles for one-handed instant operation',
      'Luggage handle pass-through and hidden passport / AirTag security pocket'
    ],
    specs: {
      'Internal Volume': '24 Liters',
      'Tare Weight': '1.18 kg',
      'Device Compatibility': 'Up to 16-inch MacBook Pro / ThinkPad',
      'Hardware': 'YKK AquaGuard weather-sealed zippers'
    }
  },
  {
    id: 'vajra-09',
    name: 'Vajra Elysium Automatic Tourbillon Skeleton Watch',
    subtitle: 'High-complication open-heart movement with 316L mirror-polished case',
    description: 'An ode to classical horology made modern. Featuring a 28,800 vph high-beat automatic movement with skeletonized mainspring barrel, blued steel screws, and sapphire crystal exhibition caseback with 80 hours power reserve.',
    price: 89999,
    originalPrice: 99999,
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&auto=format&fit=crop&q=80',
    ],
    category: 'Timepieces & Jewelry',
    tags: ['watch', 'luxury', 'tourbillon', 'mechanical', 'horology'],
    stock: 8,
    rating: 4.97,
    reviewCount: 62,
    badge: 'Limited',
    features: [
      'Bespoke in-house skeleton automatic caliber with 28,800 beats per hour',
      'Double-domed anti-reflective scratch-proof sapphire crystal front and back',
      'Hand-stitched Italian alligator grain calfskin strap with deployant clasp',
      'Water resistance to 50 meters (5 ATM) with engraved limited serial number'
    ],
    specs: {
      'Diameter': '40.5mm',
      'Power Reserve': '80 Hours Extended',
      'Case': '316L Medical Grade Stainless Steel',
      'Warranty': '5-Year International Atelier Certificate'
    }
  },
  {
    id: 'vajra-10',
    name: 'Vajra Horizon 16 Pro 4K OLED Portable Monitor',
    subtitle: 'Calibrated DCI-P3 100% OLED panel with dual USB-C Thunderbolt 4 input',
    description: 'The ultimate secondary monitor for creators and engineers on the go. Ultra-slim 4.9mm CNC aluminum unibody weighing only 680g, delivering true blacks with infinite contrast and 500 nits HDR peak brightness.',
    price: 44999,
    originalPrice: 49999,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1200&auto=format&fit=crop&q=80',
    ],
    category: 'Computing',
    tags: ['monitor', 'oled', '4k', 'portable', 'creator'],
    stock: 25,
    rating: 4.91,
    reviewCount: 95,
    badge: 'Featured',
    features: [
      '15.6-inch 3840x2160 Pure OLED panel with 10-bit color depth (1.07 billion colors)',
      '100% DCI-P3 and AdobeRGB factory color calibration (Delta E < 1.0)',
      'Dual full-function Thunderbolt / Type-C with passthrough reverse power delivery',
      'Integrated magnetic origami stand and protective alcantara leather sleeve'
    ],
    specs: {
      'Resolution': '3840 x 2160 UHD 4K @ 60Hz',
      'Contrast Ratio': '100,000:1 True Black',
      'Weight': '680 grams',
      'Ports': '2x USB-C (Thunderbolt), 1x Mini HDMI 2.0, 3.5mm Headphone'
    }
  },
  {
    id: 'vajra-11',
    name: 'Vajra Serenade Open-Back Studio Reference Planar',
    subtitle: 'Zero-compression open acoustic chamber with pure silver balanced cable',
    description: 'Engineered for audio mastering engineers who require hyper-detailed transient response and wide holographic soundstaging. Featuring 50mm nano-scale planar membranes and solid walnut wood acoustic grilles.',
    price: 42999,
    originalPrice: 47999,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1200&auto=format&fit=crop&q=80',
    ],
    category: 'Audio',
    tags: ['audiophile', 'openback', 'studio', 'planar', 'reference'],
    stock: 16,
    rating: 4.98,
    reviewCount: 79,
    badge: 'Bestseller',
    features: [
      '50mm sub-micron planar diaphragm with neodymium symmetric push-pull array',
      'Acoustically open resonance-free walnut ear-cups machined in Kashmir',
      'Detachable 8-core OCC monocrystalline pure silver-plated 4.4mm balanced cable',
      'Memory foam hybrid velour and perforated protein leather cushions'
    ],
    specs: {
      'Impedance': '32 Ohms (Easy to drive via phone or dedicated DAC)',
      'Sensitivity': '102 dB/mW',
      'Frequency Range': '4Hz - 52,000Hz',
      'Connector': '4.4mm Balanced + 3.5mm / 6.35mm Gold Adapters'
    }
  },
  {
    id: 'vajra-12',
    name: 'Vajra Tuscan Handcrafted Full-Grain Leather Holdall 45L',
    subtitle: 'Vegetable-tanned full-grain leather with antique solid brass hardware',
    description: 'Meticulously crafted from certified Italian vegetable-tanned full-grain leather that patinas beautifully over decades. Features an independent ventilated shoe compartment, padded tablet sleeve, and YKK Excella antique zippers.',
    price: 21999,
    originalPrice: 25999,
    image: 'https://images.unsplash.com/photo-1473445730015-841f29a9490b?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1473445730015-841f29a9490b?w=1200&auto=format&fit=crop&q=80',
    ],
    category: 'Lifestyle',
    tags: ['leather', 'duffle', 'holdall', 'travel', 'handcrafted'],
    stock: 12,
    rating: 4.89,
    reviewCount: 104,
    badge: 'New',
    features: [
      'Hand-selected 2.2mm full-grain Tuscan vegetable-tanned hide',
      'Separate side-loading ventilated shoe or wet-gym compartment',
      'Heavy-duty hand-cast solid brass buckle rivets and hardware',
      'Cabin approved for domestic and international flight overhead compartments'
    ],
    specs: {
      'Volume': '45 Liters',
      'Dimensions': '52cm x 28cm x 30cm',
      'Lining': '100% Water-resistant waxed herringbone cotton',
      'Origin': 'Hand-stitched in Florence atelier'
    }
  },
  {
    id: 'vajra-13',
    name: 'Vajra Apex Ergonomic Aeron-Alloy Executive Chair',
    subtitle: 'Adaptive lumbar matrix with breathable Italian elastomeric mesh',
    description: 'Designed for high-intensity 12-hour desk work. Featuring a cast aluminum structural skeleton, 4D magnetic armrests, pneumatic multi-tilt synchronization, and self-adjusting lumbar support to ensure zero spine compression.',
    price: 49999,
    originalPrice: 59999,
    image: 'https://images.unsplash.com/photo-1580481077195-c3a821a58875?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1580481077195-c3a821a58875?w=1200&auto=format&fit=crop&q=80',
    ],
    category: 'Workspace',
    tags: ['chair', 'ergonomic', 'workspace', 'mesh', 'executive'],
    stock: 11,
    rating: 4.94,
    reviewCount: 133,
    badge: 'Featured',
    features: [
      'Self-calibrating dynamic lumbar spine curve support',
      'Ultra-breathable Italian polyamide mesh with zero thermal heat accumulation',
      'Class-4 KGS heavy-duty explosion-proof nitrogen gas lift',
      'Silent polyurethane rollerblade casters safe for all hardwood and marble floors'
    ],
    specs: {
      'Weight Capacity': '160 kg certified (BIFMA X5.1)',
      'Recline Angle': '90° to 135° with 4-stage lock',
      'Chassis': 'Pressure Die-Cast Aerospace 6063 Aluminum',
      'Warranty': '10-Year Comprehensive Doorstep Frame Guarantee'
    }
  },
  {
    id: 'vajra-14',
    name: 'Vajra Quantum 140W GaN SuperCluster Power Hub',
    subtitle: 'Gallium Nitride 5-port simultaneous high-density desktop charging station',
    description: 'Replaces all desk power bricks with a sleek CNC anodized aluminum tower. Equipped with 3x USB-C PD 3.1 140W ports, 2x USB-A QC 4.0 ports, and real-time OLED power wattage telemetry display.',
    price: 9499,
    originalPrice: 11999,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=1200&auto=format&fit=crop&q=80',
    ],
    category: 'Computing',
    tags: ['charger', 'gan', 'power', 'usbc', 'desksetup'],
    stock: 64,
    rating: 4.87,
    reviewCount: 290,
    badge: 'Bestseller',
    features: [
      'Next-gen Navitas GaNFast III semiconductors for 95% thermal power efficiency',
      'Charges 2 MacBooks and 2 iPhones simultaneously at maximum speed',
      'Live dynamic OLED screen showing voltage, amperage, and port wattage',
      '10-stage ActiveShield 3.0 temperature and surge protection'
    ],
    specs: {
      'Total Output': '140W Max Dynamic Allocation',
      'Input Voltage': '100-240V ~ 50/60Hz Global Universal',
      'Dimensions': '85 x 65 x 38 mm',
      'Safety': 'BIS Certified (R-41189021)'
    }
  },
  {
    id: 'vajra-15',
    name: 'Vajra Aeroflex Merino Wool Tailored Overcoat',
    subtitle: 'Water-repellent 100% Australian 19.5-micron extra-fine Merino wool',
    description: 'Architectural tailoring meets functional performance. Spun from double-faced 19.5-micron virgin merino wool with a subtle nanotech lotus-leaf water-repellent finish, horn buttons, and internal passport security pocket.',
    price: 27999,
    originalPrice: 32999,
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&auto=format&fit=crop&q=80',
    ],
    category: 'Designer Fashion',
    tags: ['fashion', 'merino', 'overcoat', 'tailoring', 'luxury'],
    stock: 18,
    rating: 4.88,
    reviewCount: 73,
    badge: 'New',
    features: [
      '100% extrafine 19.5-micron Australian Merino wool with natural thermoregulation',
      'Eco-friendly PFC-free water-resistant coating sheds light rain and snow',
      'Natural horn buttons from sustainable regenerative ranching',
      'Concealed RFID-blocking travel pocket for passport and credit cards'
    ],
    specs: {
      'Fit': 'Contemporary Tailored Fit (True to Indian sizes)',
      'Lining': '100% Bemberg Cupro breathable cupro silk',
      'Origin': 'Artisanal tailoring in Biella, Italy'
    }
  },
  {
    id: 'vajra-16',
    name: 'Vajra Vesper Pure Parfum Extrait 100ml',
    subtitle: 'Niche artisanal extract: Smoked Cardamom, Kashmiri Saffron & Aged Oud',
    description: 'An intoxicating oriental woody composition formulated at 32% high perfume concentration. Opens with wild green cardamom and sun-dried Kashmiri saffron, deepening into royal Assamese oud, benzoin resin, and dark bourbon vanilla.',
    price: 18500,
    originalPrice: 21000,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200&auto=format&fit=crop&q=80',
    ],
    category: 'Beauty & Fragrances',
    tags: ['perfume', 'niche', 'oud', 'saffron', 'luxury'],
    stock: 20,
    rating: 4.96,
    reviewCount: 148,
    badge: 'Limited',
    features: [
      'High-concentration 32% Extrait de Parfum for 16+ hours of projection',
      'Sourced directly from ethically harvested wild Assamese Aquilaria oud trees',
      'Mouth-blown heavy crystal flacon with magnetic brass cap',
      'Hand-numbered atelier batch release with perfumer wax seal'
    ],
    specs: {
      'Volume': '100 ml / 3.4 fl. oz.',
      'Sillage': 'Enormous & Long-lasting',
      'Top Notes': 'Green Cardamom, Kashmiri Saffron, Bergamot',
      'Heart Notes': 'Black Rose, Assamese Oud, Incense',
      'Base Notes': 'Ambergris, Bourbon Vanilla, Smoked Birch'
    }
  },
  {
    id: 'vajra-17',
    name: 'Vajra Echo Pods Audiophile True Wireless IEMs',
    subtitle: 'Dual-driver hybrid dynamic + balanced armature with active bone conduction',
    description: 'Audiophile acoustic mastery packed into ergonomic ceramic shells. Features a custom 10mm DLC dynamic woofer and Knowles balanced armature tweeter, providing studio clarity with punchy sub-bass and bone-conduction vocal pickup.',
    price: 15999,
    originalPrice: 18999,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1200&auto=format&fit=crop&q=80',
    ],
    category: 'Audio',
    tags: ['earbuds', 'iem', 'wireless', 'audiophile', 'bluetooth'],
    stock: 45,
    rating: 4.86,
    reviewCount: 198,
    badge: 'Bestseller',
    features: [
      'Hybrid dual-driver system (10mm DLC Dynamic + Knowles Balanced Armature)',
      'Active Bone-Conduction microphone array for crystal-clear calls even in traffic',
      'Qi wireless fast-charging case crafted from brushed zinc alloy',
      'IPX5 water and sweat resistance for intense workouts'
    ],
    specs: {
      'Playtime': '10 hours per bud / 40 hours with charging case',
      'Codecs': 'LDAC, aptX Lossless, AAC, SBC',
      'Latency': '38ms Ultra-Low Gaming Mode',
      'Weight': '5.2g per earbud'
    }
  },
  {
    id: 'vajra-18',
    name: 'Vajra Monolith Solid Walnut MagSafe Wireless Dock',
    subtitle: 'Carved from single-block Appalachian black walnut with brass weighting',
    description: 'Elevate your bedside or executive desk with organic warmth and high-speed induction. Fast-charges iPhone, Apple Watch, and AirPods simultaneously with official 15W Qi2 certified magnetic charging modules.',
    price: 6800,
    originalPrice: 7999,
    image: 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=1200&auto=format&fit=crop&q=80',
    ],
    category: 'Workspace',
    tags: ['dock', 'magsafe', 'walnut', 'charging', 'desksetup'],
    stock: 50,
    rating: 4.84,
    reviewCount: 112,
    badge: 'Eco',
    features: [
      'Carved from sustainably harvested solid black walnut finished with natural organic oils',
      'Heavy 450g brass internal base ensures effortless one-handed detachment',
      '3-in-1 simultaneous Qi2 15W MagSafe charging architecture',
      'Braided 2-meter USB-C cable with silicone cable routing groove'
    ],
    specs: {
      'Compatibility': 'iPhone 12 through 16, Apple Watch, AirPods Pro',
      'Input': 'USB-C 30W+ PD',
      'Finish': 'Natural Matte Walnut Oil',
      'Weight': '580g'
    }
  }
]

export const SAMPLE_REVIEWS: Review[] = [
  {
    id: 'rev-in-1',
    productId: 'vajra-01',
    userName: 'Karthik Narayanan (Bengaluru)',
    rating: 5,
    title: 'Audiophile planar perfection delivered in 2 days to Indiranagar',
    comment: 'The planar drivers make complex classical Carnatic violin and electronic synth bass separation unbelievable. Super comfortable lambskin pads even in Indian humid weather. Truly world-class quality from an Indian hardware studio.',
    date: '2 days ago',
    verified: true,
    helpfulCount: 88
  },
  {
    id: 'rev-in-2',
    productId: 'vajra-03',
    userName: 'Rhea Sen (Mumbai)',
    rating: 5,
    title: 'The acoustic thock is unbeatable for coding',
    comment: 'I write code 8 hours a day. The gasket flex and pre-lubed switches are buttery smooth. Delivered with prompt GST invoice for my company input tax credit.',
    date: '5 days ago',
    verified: true,
    helpfulCount: 52
  },
  {
    id: 'rev-in-3',
    productId: 'vajra-02',
    userName: 'Vikramaditya Rao (New Delhi)',
    rating: 5,
    title: 'Brushed titanium case feels like a ₹1.5L luxury Swiss watch',
    comment: 'Grade 5 titanium feels premium yet remarkably light on the wrist. Battery easily lasts 12-14 days without battery anxiety. Great step and health tracking.',
    date: '1 week ago',
    verified: true,
    helpfulCount: 64
  },
  {
    id: 'rev-in-4',
    productId: 'vajra-09',
    userName: 'Samarth Kapoor (Gurugram)',
    rating: 5,
    title: 'Skeleton tourbillon precision at a fraction of Swiss markups',
    comment: 'The finishing on the bridge bevels and blued screws is mesmerizing under direct sunlight. Wore it to an executive gala and received countless compliments.',
    date: '3 days ago',
    verified: true,
    helpfulCount: 41
  },
  {
    id: 'rev-in-5',
    productId: 'vajra-14',
    userName: 'Ananya Deshmukh (Pune)',
    rating: 5,
    title: 'Best charging hub I have ever owned',
    comment: 'Powers my M3 Max MacBook Pro at full 140W while charging my iPad and phones without breaking a sweat. The OLED power display is super slick.',
    date: '4 days ago',
    verified: true,
    helpfulCount: 29
  }
]

export const CATEGORIES = [
  { id: 'all', name: 'All Departments', count: 18 },
  { id: 'Audio', name: 'Planar & Hi-Fi Audio', count: 4 },
  { id: 'Wearables', name: 'Smart Wearables', count: 2 },
  { id: 'Computing', name: 'Desk & Computing', count: 4 },
  { id: 'Workspace', name: 'Smart Workspace', count: 3 },
  { id: 'Lifestyle', name: 'Modular Carry & Bags', count: 2 },
  { id: 'Timepieces & Jewelry', name: 'Timepieces & Jewelry', count: 1 },
  { id: 'Designer Fashion', name: 'Designer Fashion', count: 1 },
  { id: 'Beauty & Fragrances', name: 'Beauty & Fragrances', count: 1 },
]

export const INDIAN_PINCODES: Record<string, { city: string; state: string; days: number }> = {
  '560001': { city: 'Bengaluru', state: 'Karnataka', days: 1 },
  '560034': { city: 'Bengaluru (Koramangala)', state: 'Karnataka', days: 1 },
  '560038': { city: 'Bengaluru (Indiranagar)', state: 'Karnataka', days: 1 },
  '110001': { city: 'New Delhi', state: 'Delhi', days: 1 },
  '110020': { city: 'New Delhi (Okhla)', state: 'Delhi', days: 1 },
  '400001': { city: 'Mumbai', state: 'Maharashtra', days: 1 },
  '400050': { city: 'Mumbai (Bandra)', state: 'Maharashtra', days: 1 },
  '500001': { city: 'Hyderabad', state: 'Telangana', days: 2 },
  '600001': { city: 'Chennai', state: 'Tamil Nadu', days: 2 },
  '700001': { city: 'Kolkata', state: 'West Bengal', days: 2 },
  '411001': { city: 'Pune', state: 'Maharashtra', days: 1 },
  '380001': { city: 'Ahmedabad', state: 'Gujarat', days: 2 },
  '122001': { city: 'Gurugram', state: 'Haryana', days: 1 },
  '201301': { city: 'Noida', state: 'Uttar Pradesh', days: 1 },
}

import { Wine, Martini, Beer, CupSoda, GlassWater } from 'lucide-react';

const isTestPath = typeof window !== 'undefined' && window.location.pathname === '/test';

export const INGREDIENTS = isTestPath ? {
  pump1: "Vodka",
  pump2: "Triple Sec",
  pump3: "Cranberry Juice",
  pump4: "Lemon Juice"
} : {
  pump1: "Sprite",
  pump2: "Orange Juice",
  pump3: "Grenadine",
  pump4: "Lemon Juice"
};

export const PREDEFINED_COCKTAILS = isTestPath ? [
  {
    id: 'cosmopolitan',
    name: 'Cosmopolitan',
    icon: Martini,
    recipe: { pump1: 45, pump2: 15, pump3: 30, pump4: 15 }
  },
  {
    id: 'kamikaze',
    name: 'Kamikaze',
    icon: GlassWater,
    recipe: { pump1: 30, pump2: 30, pump3: 0, pump4: 30 }
  },
  {
    id: 'cape_codder',
    name: 'Cape Codder',
    icon: CupSoda,
    recipe: { pump1: 50, pump2: 0, pump3: 150, pump4: 0 }
  },
  {
    id: 'lemon_drop',
    name: 'Lemon Drop',
    icon: Martini,
    recipe: { pump1: 50, pump2: 20, pump3: 0, pump4: 30 }
  },
  {
    id: 'cranberry_sour',
    name: 'Cranberry Sour',
    icon: Wine,
    recipe: { pump1: 50, pump2: 0, pump3: 50, pump4: 20 }
  }
] : [
  {
    id: 'virgin_sunrise',
    name: 'Virgin Sunrise',
    icon: GlassWater,
    recipe: { pump1: 0, pump2: 120, pump3: 20, pump4: 0 }
  },
  {
    id: 'classic_lemonade',
    name: 'Classic Lemonade',
    icon: CupSoda,
    recipe: { pump1: 150, pump2: 0, pump3: 0, pump4: 30 }
  },
  {
    id: 'pink_lemonade',
    name: 'Pink Lemonade',
    icon: Wine,
    recipe: { pump1: 130, pump2: 0, pump3: 20, pump4: 30 }
  },
  {
    id: 'citrus_mix',
    name: 'Citrus Mix',
    icon: Martini,
    recipe: { pump1: 80, pump2: 80, pump3: 0, pump4: 20 }
  },
  {
    id: 'sunrise_spritz',
    name: 'Sunrise Spritz',
    icon: CupSoda,
    recipe: { pump1: 60, pump2: 60, pump3: 15, pump4: 15 }
  }
];
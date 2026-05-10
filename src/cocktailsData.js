import { Wine, Martini, Beer, CupSoda, GlassWater } from 'lucide-react';

export const INGREDIENTS = {
  pump1: "Vodka",
  pump2: "Triple Sec",
  pump3: "Cranberry Juice",
  pump4: "Lemon Juice"
};

export const PREDEFINED_COCKTAILS = [
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
];
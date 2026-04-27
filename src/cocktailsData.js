import { Wine, Martini, Beer, CupSoda, GlassWater } from 'lucide-react';

export const INGREDIENTS = {
  pump1: "Горілка",
  pump2: "Спрайт",
  pump3: "Ром",
  pump4: "Кола"
};

export const PREDEFINED_COCKTAILS = [
  {
    id: 'vodka_sprite',
    name: 'Vodka Sprite',
    desc: 'Класика: Горілка з лимонадом',
    icon: Martini,
    recipe: { pump1: 50, pump2: 150, pump3: 0, pump4: 0 }
  },
  {
    id: 'rum_cola',
    name: 'Rum Cola',
    desc: 'Ром з колою',
    icon: Wine,
    recipe: { pump1: 0, pump2: 0, pump3: 50, pump4: 150 }
  },
  {
    id: 'citrus_mix',
    name: 'Citrus Mix',
    desc: 'Освіжаючий цитрусовий мікс',
    icon: CupSoda,
    recipe: { pump1: 30, pump2: 100, pump3: 30, pump4: 100 }
  },
  {
    id: 'strong_shot',
    name: 'Strong Shot',
    desc: 'Міцний шот',
    icon: Beer,
    recipe: { pump1: 40, pump2: 0, pump3: 40, pump4: 0 }
  }
];

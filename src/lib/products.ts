export type Variant = {
  id: string;
  name: string;
  flavor: string;
  tagline: string;
  price: number;
  size: string;
  /** Carton body colour */
  body: string;
  /** Primary ink printed on the carton */
  ink: string;
  /** Accent band colour */
  accent: string;
  ingredients: { name: string; note: string }[];
  nutrition: { label: string; value: string; pct?: number }[];
};

export const VARIANTS: Variant[] = [
  {
    id: "original",
    name: "Original",
    flavor: "Pure young coconut",
    tagline: "One coconut. One carton. Nothing else.",
    price: 4.5,
    size: "330 ml",
    body: "#fbfaf6",
    ink: "#3b2415",
    accent: "#ffd21a",
    ingredients: [
      { name: "Young coconut water", note: "100% · Nam Hom, Ratchaburi" },
    ],
    nutrition: [
      { label: "Energy", value: "62 kcal", pct: 3 },
      { label: "Sugars (natural)", value: "12 g", pct: 13 },
      { label: "Potassium", value: "620 mg", pct: 31 },
      { label: "Sodium", value: "40 mg", pct: 2 },
      { label: "Magnesium", value: "24 mg", pct: 6 },
    ],
  },
  {
    id: "pineapple",
    name: "Pineapple",
    flavor: "Coconut & ripe pineapple",
    tagline: "Sunshine, pressed and poured.",
    price: 4.9,
    size: "330 ml",
    body: "#ffd21a",
    ink: "#3b2415",
    accent: "#fbfaf6",
    ingredients: [
      { name: "Young coconut water", note: "92% · Ratchaburi" },
      { name: "Pineapple juice", note: "8% · Phetchaburi, cold pressed" },
    ],
    nutrition: [
      { label: "Energy", value: "74 kcal", pct: 4 },
      { label: "Sugars (natural)", value: "15 g", pct: 17 },
      { label: "Potassium", value: "560 mg", pct: 28 },
      { label: "Sodium", value: "36 mg", pct: 2 },
      { label: "Vitamin C", value: "18 mg", pct: 22 },
    ],
  },
  {
    id: "cacao",
    name: "Cacao",
    flavor: "Coconut & raw cacao",
    tagline: "Dark, silky, still just coconut.",
    price: 5.2,
    size: "330 ml",
    body: "#3b2415",
    ink: "#fbfaf6",
    accent: "#ffd21a",
    ingredients: [
      { name: "Young coconut water", note: "94% · Ratchaburi" },
      { name: "Raw cacao", note: "5% · Chanthaburi, fermented" },
      { name: "Coconut blossom nectar", note: "1%" },
    ],
    nutrition: [
      { label: "Energy", value: "88 kcal", pct: 4 },
      { label: "Sugars (natural)", value: "16 g", pct: 18 },
      { label: "Potassium", value: "640 mg", pct: 32 },
      { label: "Magnesium", value: "46 mg", pct: 12 },
      { label: "Iron", value: "1.4 mg", pct: 10 },
    ],
  },
  {
    id: "sparkling",
    name: "Sparkling",
    flavor: "Lightly sparkling coconut",
    tagline: "The same coconut, with a little fizz.",
    price: 4.9,
    size: "330 ml",
    body: "#8a5a36",
    ink: "#fbfaf6",
    accent: "#ffd21a",
    ingredients: [
      { name: "Young coconut water", note: "99% · Ratchaburi" },
      { name: "Natural carbonation", note: "1%" },
    ],
    nutrition: [
      { label: "Energy", value: "58 kcal", pct: 3 },
      { label: "Sugars (natural)", value: "11 g", pct: 12 },
      { label: "Potassium", value: "600 mg", pct: 30 },
      { label: "Sodium", value: "38 mg", pct: 2 },
      { label: "Magnesium", value: "22 mg", pct: 6 },
    ],
  },
];

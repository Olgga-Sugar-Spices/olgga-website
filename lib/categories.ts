export const CATEGORIES = [
  "spices",
  "sugar",
  "spice-blends",
  "herbs",
  "salt",
  "gift-boxes",
] as const;

export type Category = (typeof CATEGORIES)[number];

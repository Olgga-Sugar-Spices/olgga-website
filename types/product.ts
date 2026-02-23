export type Product = {
  id: string;
  name: string;
  description: string;
  category: string;

  price: number;
  mrp: number;
  discount: number;
  original_price: number;

  weight: string;
  rating: number;
  reviews: number;
  image: string;

  isOrganic: boolean;
  isBestseller: boolean;
  isFeatured: boolean;
};

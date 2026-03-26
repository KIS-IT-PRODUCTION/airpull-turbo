export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  order: number;
  productId: string;
}

export interface ProductSpec {
  id: string;
  key: string;
  value: string;
  order: number;
  productId: string;
}

export interface Product {
  oldPrice: boolean;
  slug?: string;
  brand: any;
  category: any;
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  images?: ProductImage[];
  ice: number;           
  sweet: number;          
  sour: number;
  specifications?: ProductSpec[];
  createdAt: string;
  updatedAt: string;
}
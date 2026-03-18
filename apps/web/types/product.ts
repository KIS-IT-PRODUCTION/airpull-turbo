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
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  images?: ProductImage[];
  specifications?: ProductSpec[];
  createdAt: string;
  updatedAt: string;
}
// Core marketplace types

export interface Profile {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  address?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  is_seller: boolean;
  profile?: Profile;
}



export interface Address {
  id: string
  user_id: string
  full_name: string
  street: string
  city: string
  state: string
  postal_code: string
  country: string
  is_default: boolean
}

export interface Category {
  id: string
  name: string
  slug: string
  image: string
  product_count: number
}

export interface ProductImage {
  id: number;
  image: string; // URL
  is_feature: boolean;
}

export interface ProductVariant {
  id: number;
  type: string;
  value: string; 
  size?: string;  
  color?: string; 
  additional_price: number | string;
  stock: number;
}

export interface ProductAttribute {
  name: string;
  value: string;
}

export interface Review {
  id: string
  user_id: string
  user_name: string
  rating: number
  comment: string
  created_at: string
}


export interface Product {
  id: number;
  slug: string;
  vendor_id: string;
  title: string; 
  name?: string;      
  description: string;
  base_price: number | string;
  category_name: string;
  category_id: string;
  store_name?: string;  
  vendor_name?: string;
  stock: number;
  average_rating: number;
  review_count: number;
  images: ProductImage[];
  image?: string;
  variants: ProductVariant[];
  attributes: ProductAttribute[];
  reviews?: Review[]; // <-- BU SATIRI EKLE (Review interface'in zaten yukarıda tanımlı)
  is_active: boolean;
  created_at: string;
}

export interface CartItem {
  id: string
  product: Product
  variant?: ProductVariant
  quantity: number
}

export interface OrderStatus {
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  label: string
  color: string
}

export interface OrderItem {
  id: string
  product_id: string
  product_name: string
  product_image: string
  variant_name?: string
  quantity: number
  unit_price: number
  total_price: number
  status: OrderStatus["status"]
  tracking_number?: string
  carrier_company?: string
  vendor_id: string
  vendor_name: string
}

export interface Order {
  id: string
  user_id: string
  items: OrderItem[]
  shipping_address: Address
  subtotal: number
  shipping_cost: number
  total: number
  status: OrderStatus["status"]
  created_at: string
  updated_at: string
}

export interface WishlistItem {
  id: string
  product: Product
  added_at: string
}

export interface VendorStats {
  total_products: number
  total_orders: number
  total_revenue: number
  pending_orders: number
}

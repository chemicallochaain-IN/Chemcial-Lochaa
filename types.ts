import React from 'react';

export type DietaryType = 'veg' | 'non-veg' | 'both';

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number | string; // string for "250 / 270" format
  type: DietaryType;
  icons?: string[]; // e.g., 'dairy', 'nut', 'chilli'
  isNew?: boolean;
}

export interface MenuCategory {
  id: string;
  title: string;
  items: MenuItem[];
  note?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: React.ReactNode;
}

export interface CartItem extends MenuItem {
  cartId: string;
  selectedVariant?: string;
  finalPrice: number;
  quantity: number;
}

export interface User {
  id: string; // Added ID for admin matching
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  address?: string;
  loyaltyPoints: number; // 1 stamp per order
  isAdmin?: boolean; // New Admin Flag
}

export interface Order {
  id: string;
  created_at: string;
  user_id: string;
  guest_info: any;
  items: CartItem[];
  total_amount: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
}

export interface ContactMessage {
  id: string;
  created_at: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  phone?: string;
}

export interface BlogPost {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  content: string;
  cover_image_url?: string;
  status: 'draft' | 'published';
  author_id?: string;
}

export interface Reward {
  id: string;
  title: string;
  description?: string;
  points_required: number;
  image_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface MerchItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  stock: number;
  is_active: boolean;
  created_at: string;
}

export interface EventItem {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  location?: string;
  image_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface Franchise {
  id: string;
  owner_name: string;
  email?: string;
  phone?: string;
  location: string;
  status: 'inquiry' | 'approved' | 'active' | 'inactive';
  notes?: string;
  created_at: string;
}
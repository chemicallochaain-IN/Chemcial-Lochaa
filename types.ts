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
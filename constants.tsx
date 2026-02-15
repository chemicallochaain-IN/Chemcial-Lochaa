import { MenuCategory } from './types';
import { Leaf, Drumstick, Wheat, Milk, Nut, Flame } from 'lucide-react';

export const DIETARY_ICONS = [
  { name: 'Vegetarian', icon: <Leaf className="w-4 h-4 text-green-600" /> },
  { name: 'Non-Veg', icon: <Drumstick className="w-4 h-4 text-red-600" /> },
  { name: 'Dairy', icon: <Milk className="w-4 h-4 text-brand-teal" /> },
  { name: 'Nuts', icon: <Nut className="w-4 h-4 text-brand-teal" /> },
  { name: 'Spicy', icon: <Flame className="w-4 h-4 text-brand-yellow" /> },
];

export const MENU_DATA: MenuCategory[] = [
  {
    id: 'burgers',
    title: 'Burgers',
    note: '(Served with fries)',
    items: [
      { id: 'b1', name: 'Mix Veggie Burger', price: 110, type: 'veg', icons: ['wheat'] },
      { id: 'b2', name: 'Paneer Burger', price: 170, type: 'veg', icons: ['wheat', 'dairy'] },
      { id: 'b3', name: 'Classic Fried Chicken Burger', price: 200, type: 'non-veg', icons: ['wheat'] },
      { id: 'b4', name: 'Korean Fried Chicken Burger', price: 230, type: 'non-veg', icons: ['wheat', 'chilli'] },
      { id: 'b5', name: 'Smash Chicken Burger', price: 230, type: 'non-veg', icons: ['wheat'] },
      { id: 'b6', name: 'Makhni Chicken Burger', price: 210, type: 'non-veg', icons: ['wheat', 'dairy'] },
      { id: 'b7', name: 'Make it better with Cheese', price: 20, type: 'veg', icons: ['dairy'] },
    ]
  },
  {
    id: 'sandwiches',
    title: 'Sandwich',
    note: '(Served with fries)',
    items: [
      { id: 's1', name: 'Masala Sandwich', price: 130, type: 'veg', icons: ['wheat'] },
      { id: 's2', name: 'Veggie Grilled Cheese Sandwich', price: 150, type: 'veg', icons: ['wheat', 'dairy'] },
    ]
  },
  {
    id: 'pasta',
    title: 'Pasta',
    items: [
      { id: 'p1', name: 'Arrabiata Pasta (Red Sauce)', price: 210, type: 'veg', icons: ['wheat', 'chilli'] },
      { id: 'p2', name: 'Béchamel Pasta (White Sauce)', price: 230, type: 'veg', icons: ['wheat', 'dairy'] },
      { id: 'p3', name: 'Makhni Sauce Pasta', price: 230, type: 'veg', icons: ['wheat', 'dairy'] },
      { id: 'p4', name: 'Pasta Mamaroso (Mixed Sauce)', price: 230, type: 'veg', icons: ['wheat', 'dairy'] },
    ]
  },
  {
    id: 'house-specials',
    title: 'House Specials',
    items: [
      { id: 'hs1', name: 'Ramen Khow Suey', price: '250 / 270', type: 'both', icons: ['wheat', 'dairy', 'egg'] },
      { id: 'hs2', name: 'Korean Ecstasy', price: '250 / 270', type: 'both', icons: ['wheat', 'chilli'] },
      { id: 'hs3', name: 'Desi Chinese', price: '250 / 270', type: 'both', icons: ['wheat'] },
    ]
  },
  {
    id: 'wraps',
    title: 'Wraps',
    note: '(Served with fries)',
    items: [
      { id: 'w1', name: 'Desi Paneer Wrap', price: 210, type: 'veg', icons: ['wheat', 'dairy'] },
      { id: 'w2', name: 'Desi Chicken Wrap', price: 210, type: 'non-veg', icons: ['wheat', 'egg'] },
      { id: 'w3', name: 'Make it better with Cheese', price: 20, type: 'veg', icons: ['dairy'] },
    ]
  },
  {
    id: 'momos',
    title: 'Momo',
    items: [
      { id: 'm1', name: 'Steamed Momo', price: '110 / 130', type: 'both', icons: ['wheat'] },
      { id: 'm2', name: 'Fried Momo', price: '120 / 140', type: 'both', icons: ['wheat'] },
      { id: 'm3', name: 'Makhni Fried Momo', price: '160 / 190', type: 'both', icons: ['wheat', 'dairy'] },
      { id: 'm4', name: 'Béchamel Fried Momo', price: '160 / 190', type: 'both', icons: ['wheat', 'dairy'] },
    ]
  },
  {
    id: 'fried-chicken',
    title: 'Fried Chicken',
    items: [
      { id: 'fc1', name: 'Classic Fried Chicken', price: 210, type: 'non-veg', icons: ['wheat'] },
      { id: 'fc2', name: 'Korean Fried Chicken', price: 245, type: 'non-veg', icons: ['wheat', 'chilli'] },
      { id: 'fc3', name: 'Peri-Peri Fried Chicken', price: 245, type: 'non-veg', icons: ['wheat', 'chilli'] },
    ]
  },
  {
    id: 'fries',
    title: 'Fries',
    items: [
      { id: 'f1', name: 'Classic Salted', price: '100 / 120', type: 'veg', description: 'R / L' },
      { id: 'f2', name: 'Peri-Peri Fries', price: '120 / 150', type: 'veg', description: 'R / L' },
      { id: 'f3', name: 'Honey Chilly Potato', price: 230, type: 'veg', icons: ['chilli'] },
      { id: 'f4', name: 'Loaded Fries', price: 230, type: 'non-veg', description: 'with chopped fried chicken' },
    ]
  },
  {
    id: 'beverages',
    title: 'Beverages',
    items: [
      { id: 'bev1', name: 'Masala Chai', price: 150, type: 'veg', description: '350ml (Serves 4)' },
      { id: 'bev2', name: 'Hot Coffee', price: 60, type: 'veg', icons: ['dairy'] },
      { id: 'bev3', name: 'Cold Coffee', price: 150, type: 'veg', icons: ['dairy'] },
      { id: 'bev4', name: 'Hazelnut Cold Coffee', price: 170, type: 'veg', icons: ['dairy'] },
      { id: 'bev5', name: 'Virgin Mojito', price: 140, type: 'veg' },
      { id: 'bev6', name: 'Iced Tea', price: 130, type: 'veg' },
    ]
  }
];

export const CONTACT_INFO = {
  address: "Shop number-28, Sector-1, Main Market, Ambala City - 134003",
  phone: "+91 72068 79847",
  website: "chemicallochaa.in",
  socials: {
    instagram: "chemicallochaa.in",
    zomato: "https://www.zomato.com",
    swiggy: "https://www.swiggy.com"
  }
};
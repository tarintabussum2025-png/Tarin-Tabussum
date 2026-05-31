/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Category = 'Men' | 'Women' | 'Kids';

export interface Product {
  id: string;
  name: string;
  originalPrice: number;
  price: number;
  discount: number;
  category: Category;
  image: string;
  description: string;
  createdAt: string;
}

export interface Seller {
  id: string;
  companyName: string;
  country: string;
  email: string;
  logoUrl?: string;
  isApproved: boolean;
  registeredAt: string;
}

export interface Buyer {
  id: string;
  fullName: string;
  country: string;
  email: string;
  registeredAt: string;
}

export type ShipmentStatus = 'Pending' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';

export interface Order {
  id: string;
  trackingNumber: string;
  buyerName: string;
  country: string;
  details: string;
  productName: string;
  price: number;
  status: ShipmentStatus;
  orderedAt: string;
}

export interface Meeting {
  id: string;
  topic: string;
  meetLink: string;
  date: string;
  createdAt: string;
}

export interface Advertisement {
  id: string;
  text: string;
  isActive: boolean;
}

export type SupportedLanguage = 'English' | 'Bengali' | 'Arabic' | 'French' | 'Chinese';

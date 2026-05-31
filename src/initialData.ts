/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, Order, Seller, Buyer, Meeting } from './types';

export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    name: "Men's Premium Shirt",
    originalPrice: 50,
    price: 35,
    discount: 30,
    category: 'Men',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
    description: '100% fine cotton structural weave premium shirt suitable for formal meetings and high stakes operations.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-2',
    name: "Women's Fashion Dress",
    originalPrice: 80,
    price: 55,
    discount: 25,
    category: 'Women',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80',
    description: 'Charming evening gown stitched with exquisite lace details and soft natural linen finish.',
    createdAt: new Date().toISOString()
  },
  {
    id: 'prod-3',
    name: "Kids Premium Dungarees",
    originalPrice: 25,
    price: 18,
    discount: 20,
    category: 'Kids',
    image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=600&q=80',
    description: 'Durable, stretchable denim dungarees designed to withstand ultimate kid energy levels and high play times.',
    createdAt: new Date().toISOString()
  }
];

export const initialSellers: Seller[] = [
  {
    id: 'sel-1',
    companyName: 'Regal Stitches Ltd',
    country: 'Bangladesh',
    email: 'info@regalstitches.com',
    isApproved: true,
    registeredAt: '2026-05-15T10:00:00Z'
  },
  {
    id: 'sel-2',
    companyName: 'Paris Alpine Atelier',
    country: 'France',
    email: 'contact@parisatelier.fr',
    isApproved: true,
    registeredAt: '2026-05-20T14:30:00Z'
  }
];

export const initialBuyers: Buyer[] = [
  {
    id: 'buy-1',
    fullName: 'Alexander Wright',
    country: 'United Kingdom',
    email: 'alex.wright@gmail.com',
    registeredAt: '2026-05-25T08:15:00Z'
  }
];

export const initialOrders: Order[] = [
  {
    id: 'ord-1',
    trackingNumber: 'TRK-5893-X',
    buyerName: 'Alexander Wright',
    country: 'United Kingdom',
    details: 'M Size, Expedited shipping request',
    productName: "Men's Premium Shirt",
    price: 35,
    status: 'Shipped',
    orderedAt: '2026-05-28T09:00:00Z'
  },
  {
    id: 'ord-2',
    trackingNumber: 'TRK-1024-F',
    buyerName: 'Fatima Al-Sudairy',
    country: 'Saudi Arabia',
    details: 'L Size, Wrap with blue silk ribbon',
    productName: "Women's Fashion Dress",
    price: 55,
    status: 'Processing',
    orderedAt: '2026-05-30T11:45:00Z'
  }
];

export const initialMeetings: Meeting[] = [
  {
    id: 'meet-1',
    topic: 'Sustainable Linen Supply Alignment',
    meetLink: 'https://meet.google.com/abc-defg-hij',
    date: '2026-06-05',
    createdAt: '2026-05-30T16:00:00Z'
  }
];

/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from 'react';
import { Product, Order, Seller, Buyer, ShipmentStatus, Category } from '../types';
import {
  Settings,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Truck,
  Building,
  Users,
  Megaphone,
  ShoppingBag,
  RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  sellers: Seller[];
  buyers: Buyer[];
  onAddProduct: (prod: Omit<Product, 'id' | 'createdAt' | 'discount'>) => void;
  onEditProduct: (id: string, updated: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateOrderStatus: (id: string, newStatus: ShipmentStatus) => void;
  onApproveSeller: (id: string, approved: boolean) => void;
  onPublishAd: (text: string) => void;
  activeAd: string;
  t: (key: string) => string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  orders,
  sellers,
  buyers,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onApproveSeller,
  onPublishAd,
  activeAd,
  t,
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'sellers' | 'buyers' | 'promo'>('products');

  // New product form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<Category>('Men');
  const [newPrice, setNewPrice] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newImg, setNewImg] = useState('');

  // Promo form
  const [promoText, setPromoText] = useState(activeAd);

  // Editing state for products
  const [editingProdId, setEditingProdId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editTitle, setEditTitle] = useState('');

  const submitAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(newPrice);
    if (!newTitle || isNaN(priceNum) || priceNum <= 0) return;

    onAddProduct({
      name: newTitle,
      category: newCategory,
      price: priceNum,
      originalPrice: priceNum * 1.3, // auto mark original higher
      image: newImg.trim() || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80',
      description: newDesc,
    });

    setNewTitle('');
    setNewPrice('');
    setNewDesc('');
    setNewImg('');
  };

  const handleEditClick = (prod: Product) => {
    setEditingProdId(prod.id);
    setEditPrice(prod.price.toString());
    setEditTitle(prod.name);
  };

  const saveProductEdit = (id: string) => {
    const val = parseFloat(editPrice);
    if (isNaN(val) || val <= 0 || !editTitle) return;
    onEditProduct(id, { name: editTitle, price: val });
    setEditingProdId(null);
  };

  const handleAdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPublishAd(promoText);
  };

  const shipmentStatuses: ShipmentStatus[] = [
    'Pending',
    'Processing',
    'Shipped',
    'Out for Delivery',
    'Delivered',
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8 admin transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-5 mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="text-indigo-600">⚙️</span>
            {t('adminDashboard')}
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Secure admin clearance to update freight state, grant seller licensing approval, manage inventories, and schedule public ads.
          </p>
        </div>

        {/* Inner subtabs for modular admin controls */}
        <div className="flex flex-wrap gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
          {[
            { id: 'products', label: 'Inventory', icon: ShoppingBag },
            { id: 'orders', label: 'Orders', icon: Truck },
            { id: 'sellers', label: 'Sellers', icon: Building },
            { id: 'buyers', label: 'Buyers', icon: Users },
            { id: 'promo', label: 'Ads/Promo', icon: Megaphone },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-white text-indigo-600 border border-slate-200 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 border border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* PRODUCTS INVENTORY SUBTAB */}
        {activeTab === 'products' && (
          <motion.div
            key="products"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6 animate-fadeIn"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Insert product quickform */}
              <div className="bg-slate-50/50 border border-slate-200 p-5 rounded-xl">
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-indigo-600" />
                  Quick Catalog Expansion
                </h3>
                <form onSubmit={submitAddProduct} className="space-y-3.5 text-xs text-slate-700">
                  <div>
                    <label className="text-[10px] text-slate-555 font-bold uppercase tracking-wider block mb-1.5">
                      Apparel Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Silk Windsor Cravat"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-indigo-505"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-555 font-bold uppercase tracking-wider block mb-1.5">
                        Category
                      </label>
                      <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value as Category)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium cursor-pointer focus:outline-none focus:border-indigo-505"
                      >
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="Kids">Kids</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-555 font-bold uppercase tracking-wider block mb-1.5">
                        Price (USD)
                      </label>
                      <input
                        type="number"
                        required
                        placeholder="e.g. 45"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-medium focus:outline-none focus:border-indigo-505"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-555 font-bold uppercase tracking-wider block mb-1.5">
                      Image URL (Unsplash or any URL)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. https://images.unsplash.com/..."
                      value={newImg}
                      onChange={(e) => setNewImg(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-mono focus:outline-none focus:border-indigo-505"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-555 font-bold uppercase tracking-wider block mb-1.5">
                      Brief Design Desc
                    </label>
                    <textarea
                      placeholder="Enter fabric composition/stitches"
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 h-16 resize-none focus:outline-none focus:border-indigo-505"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg transition-colors cursor-pointer shadow-sm active:translate-y-[0.5px]"
                  >
                    Publish to Catalog
                  </button>
                </form>
              </div>

              {/* Editable Product Table List */}
              <div className="lg:col-span-2 bg-slate-50/50 border border-slate-200 p-5 rounded-xl">
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center justify-between">
                  <span>Current Marketplace Inventory ({products.length})</span>
                  <span className="text-[10px] text-slate-500 capitalize italic">Realtime Database Sync active</span>
                </h3>

                <div className="overflow-x-auto max-h-[350px] overflow-y-auto">
                  <table className="w-full text-xs text-left text-slate-700">
                    <thead className="text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200 bg-slate-50">
                      <tr>
                        <th className="py-2.5 px-3">Title & Category</th>
                        <th className="py-2.5 px-3">Catalogue Price</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/60">
                      {products.map((prod) => (
                        <tr key={prod.id} className="hover:bg-white transition-colors">
                          <td className="py-3 px-3">
                            {editingProdId === prod.id ? (
                              <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="bg-white border border-slate-200 text-slate-800 px-2 py-1 rounded text-xs focus:outline-none"
                              />
                            ) : (
                              <div>
                                <span className="font-bold text-slate-800 block">{prod.name}</span>
                                <span className="text-[10px] bg-white text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 mt-1 inline-block font-semibold">
                                  {prod.category}
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-3 font-mono font-bold text-slate-800">
                            {editingProdId === prod.id ? (
                              <div className="relative w-24">
                                <span className="absolute left-1.5 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                                <input
                                  type="number"
                                  value={editPrice}
                                  onChange={(e) => setEditPrice(e.target.value)}
                                  className="w-full pl-4 pr-1 py-1 bg-white border border-slate-200 text-slate-800 rounded text-xs focus:outline-none"
                                />
                              </div>
                            ) : (
                              <span className="text-slate-800 font-bold">${prod.price.toFixed(2)}</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {editingProdId === prod.id ? (
                                <button
                                  onClick={() => saveProductEdit(prod.id)}
                                  className="text-emerald-700 hover:text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-250 cursor-pointer"
                                >
                                  Save
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleEditClick(prod)}
                                  className="text-indigo-600 hover:text-indigo-800 p-1.5 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors cursor-pointer shadow-sm"
                                  title="Edit Title and Price"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                onClick={() => onDeleteProduct(prod.id)}
                                className="text-rose-600 hover:text-rose-800 p-1.5 bg-white hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors cursor-pointer shadow-sm"
                                title="Remove from store"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ORDERS MANAGEMENT SUBTAB */}
        {activeTab === 'orders' && (
          <motion.div
            key="orders"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-50/50 border border-slate-200 p-5 rounded-xl space-y-4"
          >
            <h3 className="text-sm font-bold text-slate-800 mb-4">
              Consolidated Global Orders ({orders.length})
            </h3>

            {orders.length === 0 ? (
              <p className="text-xs text-slate-500 italic text-center py-6">No merchant orders placed in this session yet.</p>
            ) : (
              <div className="divide-y divide-slate-200 max-h-[350px] overflow-y-auto pr-1">
                {orders.map((ord) => (
                  <div key={ord.id} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 text-sm">{ord.buyerName}</span>
                        <span className="text-[10px] font-mono bg-white text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                          {ord.trackingNumber}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Purchased product: <span className="font-bold text-slate-700">{ord.productName}</span> for ${ord.price.toFixed(2)} ({ord.country})
                      </div>
                      <div className="text-[10px] text-slate-500 italic mt-0.5">
                        Notes: {ord.details || 'Standard fit'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Change Status:</span>
                      <select
                        value={ord.status}
                        onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as ShipmentStatus)}
                        className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 cursor-pointer focus:border-indigo-500"
                      >
                        {shipmentStatuses.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* SELLERS HUB SUBTAB */}
        {activeTab === 'sellers' && (
          <motion.div
            key="sellers"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-50/50 border border-slate-200 p-5 rounded-xl space-y-4"
          >
            <h3 className="text-sm font-bold text-slate-800">
              Approved & Pending Seller Registrations ({sellers.length})
            </h3>

            {sellers.length === 0 ? (
              <p className="text-xs text-slate-500 italic text-center py-6">No merchant sellers registered currently.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sellers.map((sel) => (
                  <div key={sel.id} className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-150 text-indigo-600 font-bold flex items-center justify-center shrink-0">
                        {sel.companyName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 leading-normal">{sel.companyName}</h4>
                        <p className="text-[10px] text-slate-500">{sel.email} • {sel.country}</p>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold mt-1 inline-block ${
                          sel.isApproved
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {sel.isApproved ? 'Licensed Active' : 'Under Assessment'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onApproveSeller(sel.id, !sel.isApproved)}
                      className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all shrink-0 cursor-pointer ${
                        sel.isApproved
                          ? 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100/10'
                          : 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100/10'
                      }`}
                    >
                      {sel.isApproved ? 'Revoke License' : 'Grant License'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* BUYERS AUDIT SUBTAB */}
        {activeTab === 'buyers' && (
          <motion.div
            key="buyers"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-50/50 border border-slate-200 p-5 rounded-xl space-y-4"
          >
            <h3 className="text-sm font-bold text-slate-800">
              Registered Buyer Registry ({buyers.length})
            </h3>

            {buyers.length === 0 ? (
              <p className="text-xs text-slate-500 italic text-center py-6">No buyers registered in this session yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto">
                {buyers.map((buy) => (
                  <div key={buy.id} className="p-3 bg-white border border-slate-200 rounded-lg flex flex-col justify-between shadow-sm">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">{buy.fullName}</span>
                      <span className="text-[11px] text-slate-505 block mt-1 font-medium">{buy.email}</span>
                      <span className="text-[10px] text-slate-500 mt-0.5 block font-bold">Country Focus: {buy.country}</span>
                    </div>
                    <span className="text-[9px] text-slate-400 block mt-3 font-mono">ID: {buy.id}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* PROMOTION ADS SUBTAB */}
        {activeTab === 'promo' && (
          <motion.div
            key="promo"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-50/50 border border-slate-200 p-5 rounded-xl space-y-4"
          >
            <h3 className="text-sm font-bold text-slate-800">
              Marketplace Broadcast Banner
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Publish customized promotional ticker statements visible as scrolling alerts across the global marketplace portal home.
            </p>

            <form onSubmit={handleAdSubmit} className="flex gap-2 max-w-xl">
              <input
                type="text"
                placeholder="e.g. 🎉 SPECIAL OFFER: Use code TAILOR55 to get custom stitching modifications free today!"
                value={promoText}
                onChange={(e) => setPromoText(e.target.value)}
                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-slate-800 text-xs focus:outline-none focus:border-indigo-505 focus:ring-1 focus:ring-indigo-100 font-medium"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-4 rounded-xl transition-all cursor-pointer shadow-sm"
              >
                Broadcast
              </button>
            </form>

            {activeAd && (
              <div className="p-3 bg-amber-50 border border-amber-205 text-amber-800 text-xs rounded-lg flex items-center gap-2 font-medium">
                <Megaphone className="w-4 h-4 shrink-0 text-amber-600" />
                <span>
                  <strong>Current Broadcast:</strong> &quot;{activeAd}&quot;
                </span>
                <button
                  onClick={() => {
                    onPublishAd('');
                    setPromoText('');
                  }}
                  className="ml-auto text-[10px] font-bold text-red-655 hover:text-red-700 uppercase px-2 py-0.5 cursor-pointer"
                >
                  Clear
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

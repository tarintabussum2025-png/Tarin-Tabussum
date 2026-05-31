/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Seller, Buyer, Product, Category } from '../types';
import { Building2, UserPlus, Image, FilePlus, Globe, Mail, DollarSign, PenTool } from 'lucide-react';
import { motion } from 'motion/react';

interface RegistrationFormsProps {
  onRegisterSeller: (company: string, country: string, email: string, logoUrl?: string) => void;
  onRegisterBuyer: (name: string, country: string, email: string) => void;
  onUploadProduct: (product: Omit<Product, 'id' | 'createdAt' | 'discount'>) => void;
  t: (key: string) => string;
}

export const RegistrationForms: React.FC<RegistrationFormsProps> = ({
  onRegisterSeller,
  onRegisterBuyer,
  onUploadProduct,
  t,
}) => {
  // Seller State
  const [selCompany, setSelCompany] = useState('');
  const [selCountry, setSelCountry] = useState('');
  const [selEmail, setSelEmail] = useState('');
  const [selLogo, setSelLogo] = useState<string>('');

  // Buyer State
  const [buyName, setBuyName] = useState('');
  const [buyCountry, setBuyCountry] = useState('');
  const [buyEmail, setBuyEmail] = useState('');

  // Product State
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<Category>('Men');
  const [prodPrice, setProdPrice] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodImage, setProdImage] = useState<string>('');

  // Logo file upload handler
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Mock logo or create object URL
      const url = URL.createObjectURL(file);
      setSelLogo(url);
    }
  };

  // Product image file upload handler
  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProdImage(url);
    }
  };

  const handleSellerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selCompany || !selCountry || !selEmail) return;
    onRegisterSeller(selCompany, selCountry, selEmail, selLogo || undefined);
    setSelCompany('');
    setSelCountry('');
    setSelEmail('');
    setSelLogo('');
  };

  const handleBuyerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyName || !buyCountry || !buyEmail) return;
    onRegisterBuyer(buyName, buyCountry, buyEmail);
    setBuyName('');
    setBuyCountry('');
    setBuyEmail('');
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(prodPrice);
    if (!prodName || isNaN(priceNum) || priceNum <= 0) return;

    // Use a lovely Unsplash random fashion photo if none was uploaded
    const fallbackImage = prodCategory === 'Men' 
      ? 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80'
      : prodCategory === 'Women'
      ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80'
      : 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=600&q=80';

    onUploadProduct({
      name: prodName,
      category: prodCategory,
      price: priceNum,
      originalPrice: priceNum * 1.25, // Make an automatic catalog discount!
      image: prodImage || fallbackImage,
      description: prodDesc,
    });

    setProdName('');
    setProdPrice('');
    setProdDesc('');
    setProdImage('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      {/* Seller Registration */}
      <motion.div
        whileHover={{ translateY: -2 }}
        className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-slate-350 transition-all duration-300"
      >
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4 border-b border-slate-150 pb-3">
            <Building2 className="w-5 h-5 text-indigo-600" />
            {t('sellerReg')}
          </h2>
          <form onSubmit={handleSellerSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-slate-500 mb-1 block font-semibold">Company Legal Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder={t('companyName')}
                  value={selCompany}
                  onChange={(e) => setSelCompany(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:border-indigo-505 focus:outline-none focus:ring-1 focus:ring-indigo-100 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-500 mb-1 block font-semibold">Headquarters Country</label>
                <input
                  type="text"
                  required
                  placeholder={t('country')}
                  value={selCountry}
                  onChange={(e) => setSelCountry(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:border-indigo-505 focus:outline-none focus:ring-1 focus:ring-indigo-100 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-slate-550 mb-1 block font-semibold">Contact Email</label>
                <input
                  type="email"
                  required
                  placeholder={t('email')}
                  value={selEmail}
                  onChange={(e) => setSelEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:border-indigo-505 focus:outline-none focus:ring-1 focus:ring-indigo-100 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-500 mb-1 block font-semibold font-medium">Upload Company Logo / License</label>
              <div className="flex items-center gap-3">
                <div className="flex-1 relative cursor-pointer group bg-slate-50 hover:bg-slate-100/60 p-3 rounded-xl border border-dashed border-slate-305 transition-all text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center gap-1">
                    <Image className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                    <span className="text-[11px] text-slate-400 font-semibold group-hover:text-slate-200">
                      Choose profile file
                    </span>
                  </div>
                </div>
                {selLogo && (
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                    <img src={selLogo} alt="Logo preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/10 active:scale-[0.98] cursor-pointer"
            >
              {t('registerSeller')}
            </button>
          </form>
        </div>
      </motion.div>

      {/* Buyer Registration */}
      <motion.div
        whileHover={{ translateY: -2 }}
        className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-slate-350 transition-all duration-300"
      >
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4 border-b border-slate-150 pb-3">
            <UserPlus className="w-5 h-5 text-emerald-600" />
            {t('buyerReg')}
          </h2>
          <form onSubmit={handleBuyerSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-slate-500 mb-1 block font-semibold">Full Name</label>
              <input
                type="text"
                required
                placeholder={t('fullName')}
                value={buyName}
                onChange={(e) => setBuyName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-100 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs text-slate-500 mb-1 block font-semibold">Shipping Country</label>
              <input
                type="text"
                required
                placeholder={t('country')}
                value={buyCountry}
                onChange={(e) => setBuyCountry(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-100 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs text-slate-550 mb-1 block font-semibold">Contact Email</label>
              <input
                type="email"
                required
                placeholder={t('email')}
                value={buyEmail}
                onChange={(e) => setBuyEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-100 transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-850 text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-md shadow-emerald-500/10 active:scale-[0.98] cursor-pointer"
            >
              {t('registerBuyer')}
            </button>
          </form>
        </div>
      </motion.div>

      {/* Product Upload / Publish */}
      <motion.div
        whileHover={{ translateY: -2 }}
        className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:border-slate-350 transition-all duration-300"
      >
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4 border-b border-slate-150 pb-3">
            <FilePlus className="w-5 h-5 text-amber-650" />
            {t('uploadProduct')}
          </h2>
          <form onSubmit={handleProductSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-500 mb-1 block font-semibold">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder={t('productName')}
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 text-sm focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-100 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 mb-1 block font-semibold">Category</label>
                <select
                  value={prodCategory}
                  onChange={(e) => setProdCategory(e.target.value as Category)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 text-sm focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-200 transition-colors cursor-pointer"
                >
                  <option value="Men">{t('men')}</option>
                  <option value="Women">{t('women')}</option>
                  <option value="Kids">{t('kids')}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-505 mb-1 block font-semibold">Price (USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                  <input
                    type="number"
                    required
                    placeholder={t('price')}
                    value={prodPrice}
                    onChange={(e) => setProdPrice(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-7 pr-3 py-2.5 text-slate-800 text-sm focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-100 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block font-medium flex items-center justify-between">
                  Picture <span>(Optional)</span>
                </label>
                <div className="flex items-center gap-2">
                <div className="flex-1 relative cursor-pointer group bg-slate-50 p-2.5 rounded-xl border border-dashed border-slate-200 hover:bg-slate-100 transition-all text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProductImageUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <span className="text-[10px] text-slate-400 font-semibold truncate block">
                      {prodImage ? 'Image Loaded' : 'Upload file'}
                    </span>
                  </div>
                  {prodImage && (
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                      <img src={prodImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-500 mb-1 block font-semibold">Suit/Dress Description</label>
              <textarea
                placeholder={t('description')}
                value={prodDesc}
                onChange={(e) => setProdDesc(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-slate-800 text-sm focus:border-amber-500/50 focus:outline-none h-16 resize-none focus:ring-1 focus:ring-amber-50"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-md shadow-amber-550/10 active:scale-[0.98] cursor-pointer"
            >
              {t('publishProduct')}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

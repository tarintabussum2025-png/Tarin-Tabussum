/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Product } from '../types';
import { ShoppingCart, RefreshCw, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  onUpdatePrice: (id: string, newPrice: number) => void;
  onOrderNow: (product: Product) => void;
  t: (key: string) => string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onUpdatePrice,
  onOrderNow,
  t,
}) => {
  const [inputPrice, setInputPrice] = useState<string>(product.price.toString());
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleUpdate = () => {
    const val = parseFloat(inputPrice);
    if (isNaN(val) || val <= 0) {
      setErrorMsg('Invalid price');
      return;
    }
    setErrorMsg('');
    onUpdatePrice(product.id, val);
  };

  // Re-sync local state if prop price changes dynamically (e.g. edited elsewhere in admin)
  React.useEffect(() => {
    setInputPrice(product.price.toString());
  }, [product.price]);

  const discountPercent = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-350 transition-all duration-300 shadow-sm flex flex-col h-full"
    >
      <div className="relative group overflow-hidden bg-slate-100 aspect-[4/3] w-full">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80'}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 bg-rose-500 text-white font-extrabold text-xs px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm shadow-md animate-pulse">
            {discountPercent}% OFF
          </div>
        )}
        <div className="absolute bottom-3 right-3 bg-white/90 text-slate-700 text-[10px] px-2 py-0.5 rounded-md backdrop-blur-sm border border-slate-200">
          {product.category}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 tracking-tight mb-2 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 min-h-[2rem] leading-relaxed mb-4">
            {product.description || 'No fashion details provided.'}
          </p>

          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-extrabold text-indigo-650">
              ${product.price ? product.price.toFixed(2) : '35.00'}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-sm line-through text-slate-400">
                ${product.originalPrice}
              </span>
            )}
          </div>
        </div>

        <div>
          {/* Price update direct input requested by HTML spec */}
          <div className="flex gap-2 mb-3 bg-slate-50 p-1.5 rounded-xl border border-slate-200">
            <div className="relative flex-1">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs">$</span>
              <input
                type="number"
                value={inputPrice}
                onChange={(e) => setInputPrice(e.target.value)}
                className="w-full bg-transparent pl-5 pr-1.5 py-1 text-slate-800 text-xs focus:outline-none border-none font-semibold"
                placeholder="Price"
              />
            </div>
            <button
              onClick={handleUpdate}
              className="flex items-center gap-1 bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-700 text-[11px] font-bold px-3 py-1 rounded-lg transition-colors border border-slate-200"
            >
              <RefreshCw className="w-3 h-3 text-indigo-600" />
              {t('updatePrice')}
            </button>
          </div>

          {errorMsg && (
            <p className="text-[10px] text-rose-400 flex items-center gap-1 mb-2">
              <AlertTriangle className="w-3 h-3" /> {errorMsg}
            </p>
          )}

          <button
            onClick={() => onOrderNow(product)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-sm active:translate-y-[1px] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            {t('orderNow')}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Users, Truck, Globe, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface StatsCardProps {
  buyersCount: number;
  sellersCount: number;
  countriesCount: number;
  productsCount: number;
  t: (key: string) => string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  buyersCount,
  sellersCount,
  countriesCount,
  productsCount,
  t,
}) => {
  const stats = [
    {
      label: t('buyersCount').split(' ')[1] || 'Buyers',
      value: buyersCount.toLocaleString() + '+',
      desc: 'Active Fashion Seekers',
      icon: Users,
      color: 'from-indigo-50/50 to-indigo-50/50 border-indigo-100',
      iconColor: 'text-indigo-600',
    },
    {
      label: t('sellersCount').split(' ')[1] || 'Sellers',
      value: sellersCount.toLocaleString() + '+',
      desc: 'Local Artisans & Tailors',
      icon: ShieldCheck,
      color: 'from-emerald-50/50 to-emerald-50/50 border-emerald-100',
      iconColor: 'text-emerald-700',
    },
    {
      label: t('countriesCount').split(' ')[1] || 'Countries',
      value: countriesCount.toLocaleString() + '+',
      desc: 'Global Coverage Network',
      icon: Globe,
      color: 'from-amber-50/50 to-amber-50/50 border-amber-100',
      iconColor: 'text-amber-700',
    },
    {
      label: t('productsCount').split(' ')[1] || 'Products',
      value: productsCount.toLocaleString() + '+',
      desc: 'Stitched Masterpieces',
      icon: Truck,
      color: 'from-rose-50/50 to-rose-50/50 border-rose-100',
      iconColor: 'text-rose-600',
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8">
      <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
        <span className="text-indigo-600">📊</span> {t('statsTitle')}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              whileHover={{ scale: 1.02, translateY: -2 }}
              className={`p-6 bg-gradient-to-br ${stat.color} rounded-2xl border flex items-center justify-between shadow-sm transition-all duration-300`}
            >
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  {stat.label}
                </span>
                <span className="text-3xl font-black text-slate-900 tracking-tight block">
                  {stat.value}
                </span>
                <span className="text-xs text-slate-500 mt-1 block">
                  {stat.desc}
                </span>
              </div>
              <div className={`p-3 bg-white border border-slate-200/50 rounded-xl ${stat.iconColor} shadow-sm`}>
                <Icon className="w-6 h-6" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

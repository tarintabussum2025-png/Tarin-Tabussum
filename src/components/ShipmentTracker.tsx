/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Order, ShipmentStatus } from '../types';
import { Search, MapPin, Calendar, Clock, PackageCheck, Truck, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ShipmentTrackerProps {
  orders: Order[];
  t: (key: string) => string;
}

const STATUS_STEPS: { status: ShipmentStatus; label: string; desc: string }[] = [
  { status: 'Pending', label: 'Order Placed', desc: 'Securely registered in marketplace system' },
  { status: 'Processing', label: 'Processing', desc: 'Fabric collection & tailoring precision check' },
  { status: 'Shipped', label: 'Shipped', desc: 'En route with global freight couriers' },
  { status: 'Out for Delivery', label: 'Out for Delivery', desc: 'Local courier dispatch assignment confirmed' },
  { status: 'Delivered', label: 'Delivered', desc: 'Arrived safe at shipping address' },
];

export const ShipmentTracker: React.FC<ShipmentTrackerProps> = ({ orders, t }) => {
  const [trackQuery, setTrackQuery] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const queryTerm = trackQuery.trim().toUpperCase();
    const found = orders.find((o) => o.trackingNumber.toUpperCase() === queryTerm);
    setSearchedOrder(found || null);
    setHasSearched(true);
  };

  const selectQuickTrack = (num: string) => {
    setTrackQuery(num);
    const found = orders.find((o) => o.trackingNumber === num);
    setSearchedOrder(found || null);
    setHasSearched(true);
  };

  const getStepIndex = (status: ShipmentStatus) => {
    return STATUS_STEPS.findIndex((s) => s.status === status);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8">
      <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
        <span className="text-indigo-600">🚚</span>
        {t('shipmentTracking')}
      </h2>

      <p className="text-xs text-slate-550 mb-6 font-medium">
        Enter your global parcel tracking code to inspect real-time tailoring phases, cargo transitions, and localized custom handovers.
      </p>

      <form onSubmit={handleTrackSubmit} className="flex gap-2 max-w-xl mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder={t('trackingNumber') + " (e.g. TRK-5893-X)"}
            value={trackQuery}
            onChange={(e) => setTrackQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-slate-800 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-100 transition-colors font-mono"
          />
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        </div>
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-805 text-white font-bold text-sm px-6 rounded-xl shadow-sm transition-all shrink-0 cursor-pointer"
        >
          {t('trackShipment')}
        </button>
      </form>

      {/* Quick click badges for testing */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs text-slate-550 font-bold">Quick Track:</span>
        {orders.length === 0 ? (
          <span className="text-xs text-slate-450 italic">No orders yet. Place some above.</span>
        ) : (
          orders.map((ord) => (
            <button
              key={ord.id}
              onClick={() => selectQuickTrack(ord.trackingNumber)}
              className="text-[11px] font-mono font-bold bg-slate-50 hover:bg-slate-100 text-indigo-600 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors cursor-pointer"
            >
              {ord.trackingNumber}
            </button>
          ))
        )}
      </div>

      <AnimatePresence mode="wait">
        {hasSearched && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {searchedOrder ? (
              <div className="bg-slate-50/50 border border-slate-200 rounded-xl p-5 md:p-6 mt-2">
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-4 mb-6 gap-4">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold mb-1">
                      {t('trackResultTitle')}
                    </span>
                    <h3 className="text-lg font-mono font-black text-slate-900 flex items-center gap-2">
                      {searchedOrder.trackingNumber}
                      <span className="text-xs font-sans bg-indigo-50 text-indigo-1000 px-2.5 py-0.5 rounded border border-indigo-100 font-bold">
                        {searchedOrder.status}
                      </span>
                    </h3>
                  </div>

                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-bold mb-1">
                      Deliver To
                    </span>
                    <span className="text-sm font-semibold text-slate-700 block flex items-center md:justify-end gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      {searchedOrder.buyerName} ({searchedOrder.country})
                    </span>
                  </div>
                </div>

                {/* Stepper tracker */}
                <div className="relative flex flex-col md:flex-row md:justify-between items-start md:items-center mt-6 mb-4 gap-8 md:gap-0 font-sans">
                  {/* Progress Line */}
                  <div className="hidden md:block absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[3px] bg-slate-200 -z-10 rounded">
                    <div
                      className="h-full bg-indigo-600 rounded transition-all duration-500"
                      style={{
                        width: `${(getStepIndex(searchedOrder.status) / (STATUS_STEPS.length - 1)) * 100}%`,
                      }}
                    />
                  </div>

                  {STATUS_STEPS.map((step, idx) => {
                    const currentIdx = getStepIndex(searchedOrder.status);
                    const isCompleted = idx <= currentIdx;
                    const isActive = idx === currentIdx;

                    return (
                      <div key={idx} className="flex md:flex-col items-center gap-4 md:gap-2 text-left md:text-center flex-1 relative px-2">
                        {/* Circle node indicator */}
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center border font-mono font-bold text-xs ring-4 transition-all duration-300 ${
                            isActive
                              ? 'bg-indigo-600 border-indigo-400 text-white ring-indigo-500/15 shadow-lg shadow-indigo-650/10 font-black'
                              : isCompleted
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-700 ring-emerald-50'
                              : 'bg-slate-50 border-slate-200 text-slate-400 ring-transparent'
                          }`}
                        >
                          {isCompleted ? '✓' : idx + 1}
                        </div>

                        <div>
                          <span
                            className={`text-xs font-bold block ${
                              isActive ? 'text-indigo-600' : isCompleted ? 'text-slate-800' : 'text-slate-405'
                            }`}
                          >
                            {step.label}
                          </span>
                          <span className="text-[10px] text-slate-500 block max-w-[130px] md:mx-auto mt-0.5">
                            {step.desc}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-slate-200 mt-6 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-0.5 font-semibold">Ordered Apparel</span>
                    <span className="text-slate-800 font-bold">{searchedOrder.productName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-0.5 font-semibold">Transaction Price</span>
                    <span className="text-slate-800 font-bold">${searchedOrder.price.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-0.5 font-semibold">Ordered Frame</span>
                    <span className="text-slate-800 flex items-center gap-1 font-bold">
                      <Calendar className="w-3.5 h-3.5 text-indigo-505" />
                      {new Date(searchedOrder.orderedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block mb-0.5 font-semibold">Logistics Notes</span>
                    <span className="text-slate-700 italic truncate block">{searchedOrder.details || 'Standard transit clearance'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
                <ShieldAlert className="w-8 h-8 text-rose-500" />
                <p className="text-sm font-semibold text-slate-800">Shipment Code Not Found</p>
                <p className="text-xs">
                  We could not find cargo matches for <strong className="font-mono text-slate-900">{trackQuery}</strong>. Please confirm the parcel code or use the quick tags above.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

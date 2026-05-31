/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Meeting } from '../types';
import { Video, Calendar, PlusCircle, MessageSquare, Send, ExternalLink, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface GoogleMeetSchedulerProps {
  meetings: Meeting[];
  onScheduleMeeting: (topic: string, link: string, date: string) => void;
  t: (key: string) => string;
}

export const GoogleMeetScheduler: React.FC<GoogleMeetSchedulerProps> = ({
  meetings,
  onScheduleMeeting,
  t,
}) => {
  // Meet State
  const [topic, setTopic] = useState('');
  const [meetLink, setMeetLink] = useState('');
  const [meetDate, setMeetDate] = useState('');

  // WhatsApp State
  const [waMessage, setWaMessage] = useState('');

  const handleMeetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !meetDate) return;

    // Auto-generate Google Meet URL code if left blank for comfortable sandboxing
    let link = meetLink.trim();
    if (!link) {
      const code = Math.random().toString(36).substring(2, 5) + '-' +
                   Math.random().toString(36).substring(2, 6) + '-' +
                   Math.random().toString(36).substring(2, 5);
      link = `https://meet.google.com/${code}`;
    }

    onScheduleMeeting(topic, link, meetDate);
    setTopic('');
    setMeetLink('');
    setMeetDate('');
  };

  // Prepares the WhatsApp API encoded query string
  const getWhatsAppHref = () => {
    const baseNumber = '8801756806144'; // Dedicated support number in request
    const fallbackText = 'Hello, I would like to get customization support for TAILOR Ready Made Dress.';
    const textTerm = waMessage.trim() ? encodeURIComponent(waMessage) : encodeURIComponent(fallbackText);
    return `https://wa.me/${baseNumber}?text=${textTerm}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      {/* Google Meet Component */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
          <span className="text-rose-500">🎥</span>
          {t('googleMeet')}
        </h2>

        <p className="text-xs text-slate-550 mb-6 font-medium leading-relaxed">
          Schedule private virtual appointments directly with master tailors and stitching coordinators to negotiate bulk orders, bespoke fittings, and style requests.
        </p>

        <form onSubmit={handleMeetSubmit} className="space-y-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-500 mb-1.5 block font-bold">Discussion Topic</label>
              <input
                type="text"
                required
                placeholder="e.g. Autumn Bespoke fitting"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-100 transition-colors font-medium"
              />
            </div>

            <div>
              <label className="text-xs text-slate-500 mb-1.5 block font-bold">Appointment Date</label>
              <input
                type="date"
                required
                value={meetDate}
                onChange={(e) => setMeetDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-100 transition-colors font-mono cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-500 mb-1.5 block font-bold flex items-center justify-between">
              Google Meet URL <span>(Leave empty to auto-generate code)</span>
            </label>
            <input
              type="text"
              placeholder={t('meetLink') + " (e.g. https://meet.google.com/abc-defg-hij)"}
              value={meetLink}
              onChange={(e) => setMeetLink(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-xs focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-100 transition-colors font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-805 text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-sm active:translate-y-[1px] flex items-center justify-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            {t('scheduleMeeting')}
          </button>
        </form>

        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Upcoming Fitting Consultations ({meetings.length})
        </h3>

        {meetings.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center italic text-slate-450 text-xs font-medium">
            No active fitting sessions scheduled currently.
          </div>
        ) : (
          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {meetings.map((meet) => (
              <div
                key={meet.id}
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4 shadow-sm"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{meet.topic}</h4>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 font-bold">
                      <Calendar className="w-3 h-3 text-indigo-500" />
                      {meet.date}
                    </span>
                    <span className="truncate font-mono font-bold max-w-[150px] text-slate-450">
                      {meet.meetLink}
                    </span>
                  </div>
                </div>

                <a
                  href={meet.meetLink}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/20 px-3 py-1.5 rounded-lg text-indigo-600 text-xs font-bold transition-all flex items-center gap-1 shadow-sm shrink-0"
                >
                  Join
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* WhatsApp Support Component */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-4">
            <span className="text-emerald-500">💬</span>
            {t('whatsappSupport')}
          </h2>

          <p className="text-xs text-slate-550 mb-6 font-medium leading-relaxed">
            Need urgent assistance, sample fabrics inspection, or tracking changes? Connect directly to the dedicated, official TAILOR support operator instantly via Encoded WhatsApp Messaging.
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-500 mb-1.5 block font-bold flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-indigo-505" />
                Write Custom Requirements
              </label>
              <textarea
                placeholder="e.g. Hi Tailor support! I placed order-TRK and would love to customize my sleeve length of the Men's Premium Shirt..."
                value={waMessage}
                onChange={(e) => setWaMessage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-xs focus:border-indigo-505 focus:outline-none focus:ring-1 focus:ring-indigo-100 transition-colors h-28 resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-150 pt-6">
          <a
            href={getWhatsAppHref()}
            target="_blank"
            rel="noreferrer"
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm py-3 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 group cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            {t('contactWhatsapp')}
            <Send className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { DollarSign, Save, Zap, CheckCircle } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export default function BoostPricing() {
  const { boostPricing, setBoostPricing } = usePlatform();
  const [day3, setDay3] = useState(boostPricing.day3);
  const [day7, setDay7] = useState(boostPricing.day7);
  const [day15, setDay15] = useState(boostPricing.day15);
  const [day30, setDay30] = useState(boostPricing.day30);
  const [customPerDay, setCustomPerDay] = useState(boostPricing.customPerDay);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setBoostPricing({
      day3: Number(day3),
      day7: Number(day7),
      day15: Number(day15),
      day30: Number(day30),
      customPerDay: Number(customPerDay)
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-brand-navy text-white rounded-3xl p-8 border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 fill-current" />
            Website Management Control
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Featured Job Boost Pricing</h1>
          <p className="text-xs text-slate-300">Configure duration package rates for boosted postings across the platform.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-brand-navy">Configurable Boost Package Prices</h3>
          {saved && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Boost Rates Updated!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1">3 Days Boost Package ($ USD)</label>
            <input
              type="number"
              value={day3}
              onChange={(e) => setDay3(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 font-bold text-brand-navy"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1">7 Days Boost Package ($ USD)</label>
            <input
              type="number"
              value={day7}
              onChange={(e) => setDay7(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 font-bold text-brand-navy"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1">15 Days Boost Package ($ USD)</label>
            <input
              type="number"
              value={day15}
              onChange={(e) => setDay15(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 font-bold text-brand-navy"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1">30 Days Boost Package ($ USD)</label>
            <input
              type="number"
              value={day30}
              onChange={(e) => setDay30(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 font-bold text-brand-navy"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-brand-navy mb-1">Custom Duration Rate ($ USD / day)</label>
          <input
            type="number"
            value={customPerDay}
            onChange={(e) => setCustomPerDay(e.target.value)}
            className="w-full p-3 text-xs rounded-xl border border-slate-200 font-bold text-brand-navy"
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-brand-navy hover:bg-brand-navyDark text-white font-bold text-xs shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Pricing Rates</span>
          </button>
        </div>
      </form>
    </div>
  );
}

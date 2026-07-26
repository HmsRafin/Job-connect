import React, { useState } from 'react';
import { DollarSign, Save, Megaphone, CheckCircle } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export default function AdPricing() {
  const { adPricing, setAdPricing } = usePlatform();
  const [perDay, setPerDay] = useState(adPricing.perDay);
  const [minimumDays, setMinimumDays] = useState(adPricing.minimumDays);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setAdPricing({
      perDay: Number(perDay),
      minimumDays: Number(minimumDays)
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-brand-navy text-white rounded-3xl p-8 border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-brand-teal uppercase tracking-widest flex items-center gap-1.5">
            <Megaphone className="w-3.5 h-3.5" />
            Website Management Control
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Company Advertisement Pricing</h1>
          <p className="text-xs text-slate-300">Configure daily display rates for independent company brand advertisements.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-brand-navy">Configurable Advertisement Rates</h3>
          {saved && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Ad Rates Saved!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1">Daily Display Rate ($ USD / day)</label>
            <input
              type="number"
              value={perDay}
              onChange={(e) => setPerDay(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 font-bold text-brand-navy"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1">Minimum Display Days</label>
            <input
              type="number"
              value={minimumDays}
              onChange={(e) => setMinimumDays(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 font-bold text-brand-navy"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-brand-navy hover:bg-brand-navyDark text-white font-bold text-xs shadow-md flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Ad Rates</span>
          </button>
        </div>
      </form>
    </div>
  );
}

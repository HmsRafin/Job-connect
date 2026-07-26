import React from 'react';
import { Megaphone, ExternalLink, CheckCircle, Trash2 } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export default function AdminAdvertisements() {
  const { advertisements } = usePlatform();

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-brand-navy text-white rounded-3xl p-8 border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-brand-teal uppercase tracking-widest flex items-center gap-1.5">
            <Megaphone className="w-3.5 h-3.5" />
            Website Management Oversight
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Platform Advertisements Moderation</h1>
          <p className="text-xs text-slate-300">Oversee active company brand advertisement campaigns across the site.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
        <h3 className="text-lg font-bold text-brand-navy border-b border-slate-100 pb-4">Active Platform Advertisements</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {advertisements.map((ad) => (
            <div key={ad.id} className="p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <img src={ad.bannerUrl} alt={ad.title} className="w-full h-36 rounded-xl object-cover" />
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-brand-navy">{ad.company}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {ad.status} ({ad.days} Days)
                  </span>
                </div>
                <h4 className="text-base font-bold text-brand-navy mt-1">{ad.title}</h4>
                <p className="text-xs text-slate-600 mt-1">{ad.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Revenue: <strong className="text-brand-accent">${ad.cost} USD</strong></span>
                <a href={ad.websiteUrl} target="_blank" rel="noreferrer" className="text-brand-accent hover:underline flex items-center gap-1 font-bold">
                  <span>Target Link</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

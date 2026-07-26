import React, { useState } from 'react';
import { Zap, Plus, ArrowUpRight, CheckCircle, Clock, Calendar } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import BoostModal from '../../components/common/BoostModal';

export default function BoostedPosts() {
  const { listings } = usePlatform();
  const [selectedItem, setSelectedItem] = useState(null);
  const [showBoostModal, setShowBoostModal] = useState(false);

  const boostedItems = listings.filter(l => l.featured);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-brand-navy text-white rounded-3xl p-8 border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 fill-current" />
            Featured Post Exposure Manager
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Boosted Job & Internship Listings</h1>
          <p className="text-xs text-slate-300">Boosted posts display at the top of candidate search results with glowing badges.</p>
        </div>

        <button
          onClick={() => {
            setSelectedItem(listings[0] || null);
            setShowBoostModal(true);
          }}
          className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-brand-navy font-bold text-xs shadow-md flex items-center gap-2"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>Boost a Listing</span>
        </button>
      </div>

      {/* Boosted Listings Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
        <h3 className="text-lg font-bold text-brand-navy border-b border-slate-100 pb-4">Active Featured Boosts</h3>

        {boostedItems.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No active boosted posts. Click "Boost a Listing" to elevate position visibility.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {boostedItems.map((item) => (
              <div key={item.id} className="p-6 rounded-2xl border-2 border-brand-accent bg-blue-50/20 shadow-md space-y-4 relative">
                <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-amber-400 text-brand-navy font-black text-[10px] uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3 h-3 fill-current" />
                  FEATURED ACTIVE
                </span>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{item.company}</span>
                  <h4 className="text-base font-bold text-brand-navy">{item.title}</h4>
                  <p className="text-xs text-slate-500">{item.location} • {item.salary}</p>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-accent" /> Boost Expiry:
                  </span>
                  <span className="font-bold text-brand-navy">{item.boostExpiry || '2026-08-25'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BoostModal
        isOpen={showBoostModal}
        onClose={() => setShowBoostModal(false)}
        itemTitle={selectedItem?.title || 'Senior Frontend Engineer'}
        itemId={selectedItem?.id}
      />
    </div>
  );
}

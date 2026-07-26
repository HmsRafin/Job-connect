import React from 'react';
import { CreditCard, ShieldCheck, Lock, CheckCircle, Download } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export default function AdminPayments() {
  const { payments } = usePlatform();

  const totalRevenue = payments.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-brand-navy text-white rounded-3xl p-8 border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Website Management Platform Control
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Platform Payment Ledger</h1>
          <p className="text-xs text-slate-300">Complete administrative ledger of all job boost and company advertisement transactions.</p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 block font-semibold">Total Revenue Collected</span>
          <span className="text-3xl font-black text-emerald-400">
            ${totalRevenue} <span className="text-xs font-normal text-slate-300">USD</span>
          </span>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
        <h3 className="text-lg font-bold text-brand-navy border-b border-slate-100 pb-4">All Platform Transactions</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                <th className="pb-3 px-2">Tx ID</th>
                <th className="pb-3 px-2">Company</th>
                <th className="pb-3 px-2">Subscription Type</th>
                <th className="pb-3 px-2">Item Title</th>
                <th className="pb-3 px-2">Payment Details</th>
                <th className="pb-3 px-2">Date</th>
                <th className="pb-3 px-2 text-right">Amount</th>
                <th className="pb-3 px-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="py-4 px-2 font-mono text-brand-navy font-bold">{p.id}</td>
                  <td className="py-4 px-2 font-bold text-slate-800">{p.company}</td>
                  <td className="py-4 px-2 font-bold text-brand-accent">{p.itemType}</td>
                  <td className="py-4 px-2 text-slate-700 max-w-xs truncate">{p.itemTitle}</td>
                  <td className="py-4 px-2 text-slate-500 font-mono">•••• {p.cardLast4} ({p.cardholder})</td>
                  <td className="py-4 px-2 text-slate-500">{p.date}</td>
                  <td className="py-4 px-2 text-right font-black text-brand-navy">${p.amount} USD</td>
                  <td className="py-4 px-2 text-right">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

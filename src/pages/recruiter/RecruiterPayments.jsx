import React from 'react';
import { CreditCard, Lock, ShieldCheck, CheckCircle, Clock, Download } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';

export default function RecruiterPayments() {
  const { payments } = usePlatform();

  // Filter payments for this company (e.g. Stripe Global)
  const companyPayments = payments.filter(p => p.company === 'Stripe Global');

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="bg-brand-navy text-white rounded-3xl p-8 border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            Company Confidential Financial Ledger
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Payment Transactions & History</h1>
          <p className="text-xs text-slate-300">View boost subscriptions, advertisement campaigns, and transaction receipts.</p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 block font-semibold">Total Subscriptions Paid</span>
          <span className="text-3xl font-black text-emerald-400">
            ${companyPayments.reduce((acc, curr) => acc + curr.amount, 0)} <span className="text-xs font-normal text-slate-300">USD</span>
          </span>
        </div>
      </div>

      {/* Security Access Control Notice */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3 text-amber-900 text-xs">
        <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
        <span>
          <strong>Role Authorization Enforcement:</strong> Payment records and submitted card transaction details are protected under end-to-end security protocols and strictly visible <strong>only to Stripe Global HR & Website Management</strong>.
        </span>
      </div>

      {/* Payment Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
        <h3 className="text-lg font-bold text-brand-navy border-b border-slate-100 pb-4">Completed Payment History</h3>

        {companyPayments.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No payment history found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="pb-3 px-2">Transaction ID</th>
                  <th className="pb-3 px-2">Subscription Type</th>
                  <th className="pb-3 px-2">Item Target</th>
                  <th className="pb-3 px-2">Card Details</th>
                  <th className="pb-3 px-2">Date</th>
                  <th className="pb-3 px-2 text-right">Amount (USD)</th>
                  <th className="pb-3 px-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {companyPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-4 px-2 font-mono text-brand-navy font-bold">{p.id}</td>
                    <td className="py-4 px-2 font-bold text-brand-accent">{p.itemType}</td>
                    <td className="py-4 px-2 text-slate-700 max-w-xs truncate">{p.itemTitle}</td>
                    <td className="py-4 px-2 text-slate-500 font-mono">•••• {p.cardLast4} ({p.cardholder})</td>
                    <td className="py-4 px-2 text-slate-500">{p.date}</td>
                    <td className="py-4 px-2 text-right font-black text-brand-navy">${p.amount}</td>
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
        )}
      </div>
    </div>
  );
}

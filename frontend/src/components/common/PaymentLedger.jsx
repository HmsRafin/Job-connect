import React from 'react';
import { usePlatform } from '../../context/PlatformContext';

export default function PaymentLedger({ admin = false }) {
  const { payments } = usePlatform();
  return <div className="space-y-6 pb-12">
    <header className="bg-brand-navy text-white rounded-3xl p-8">
      <h1 className="text-2xl font-bold">{admin ? 'Platform' : 'Company'} Demo Transaction Ledger</h1>
      <p className="text-sm mt-2">Course demonstration only. No money is charged and no card details are collected.</p>
      <p className="mt-4">Simulated total: ${payments.reduce((sum, payment) => sum + Number(payment.amount), 0).toFixed(2)} USD</p>
    </header>
    <div className="bg-white rounded-3xl p-6 border border-slate-200 overflow-x-auto">
      {payments.length === 0 ? <p>No demo transactions recorded yet.</p> : <table className="w-full text-left text-sm">
        <thead><tr>{['Transaction', 'Service', 'Item', ...(admin ? ['Account'] : []), 'Date', 'Simulated amount', 'Status'].map(label => <th key={label} className="p-3">{label}</th>)}</tr></thead>
        <tbody>{payments.map(payment => <tr key={payment.id} className="border-t border-slate-100">
          <td className="p-3 font-mono text-xs">{payment.transaction_id || payment.id}</td>
          <td className="p-3">{payment.itemType}</td><td className="p-3">{payment.itemTitle}</td>
          {admin && <td className="p-3">{payment.user?.name || 'Deleted account'}</td>}
          <td className="p-3">{payment.date}</td><td className="p-3">${Number(payment.amount).toFixed(2)}</td>
          <td className="p-3">{payment.status}</td>
        </tr>)}</tbody>
      </table>}
    </div>
  </div>;
}

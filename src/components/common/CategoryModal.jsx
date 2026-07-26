import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Grid } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CategoryModal({ category, isOpen, onClose, onSave }) {
  const [name, setName] = useState('');
  const [count, setCount] = useState('0 Jobs');
  const [icon, setIcon] = useState('Code');

  useEffect(() => {
    if (category) {
      setName(category.name || '');
      setCount(category.count || '0 Jobs');
      setIcon(category.icon || 'Code');
    } else {
      setName('');
      setCount('0 Jobs');
      setIcon('Code');
    }
  }, [category, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: category ? category.id : `cat-${Date.now()}`,
      name,
      count,
      icon,
      bg: 'bg-blue-50 text-blue-600'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-navy/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200"
      >
        <div className="bg-brand-navy text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Admin Category Manager</span>
          <h3 className="text-xl font-bold text-white mt-1">
            {category ? 'Edit Category' : 'Create New Category'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1">Category Title</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Cloud Infrastructure"
              className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-600/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1">Initial Job Count String</label>
            <input
              type="text"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              placeholder="e.g. 150 Jobs"
              className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-purple-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-brand-navy mb-1">Select Icon Symbol</label>
            <select
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-purple-600"
            >
              <option value="Code">Code / Engineering</option>
              <option value="Palette">Palette / UI UX</option>
              <option value="TrendingUp">TrendingUp / Finance</option>
              <option value="Megaphone">Megaphone / Marketing</option>
              <option value="Cpu">Cpu / AI Data Science</option>
              <option value="Briefcase">Briefcase / Management</option>
              <option value="Target">Target / Sales</option>
              <option value="Users">Users / HR</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Category</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

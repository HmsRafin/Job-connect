import React, { useState } from 'react';
import { Grid, Plus, Edit2, Trash2, Code, Palette, TrendingUp, Megaphone, Cpu, Briefcase, Target, Users } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import CategoryModal from '../../components/common/CategoryModal';

export default function CategoryManagement() {
  const { categories, saveCategory, deleteCategory } = usePlatform();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Code': return Code;
      case 'Palette': return Palette;
      case 'TrendingUp': return TrendingUp;
      case 'Megaphone': return Megaphone;
      case 'Cpu': return Cpu;
      case 'Briefcase': return Briefcase;
      case 'Target': return Target;
      case 'Users': return Users;
      default: return Briefcase;
    }
  };

  const handleSave = async category => { await saveCategory(category); };
  const handleDelete = async id => {
    if (!window.confirm('Delete this category?')) return;
    try { await deleteCategory(id); } catch { /* Shared error banner. */ }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-brand-navy text-white rounded-3xl p-8 border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Platform Taxonomies</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Category Management</h1>
          <p className="text-xs text-slate-300">Create, modify, or remove job category channels.</p>
        </div>

        <button
          onClick={() => { setSelectedCategory(null); setIsModalOpen(true); }}
          className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => {
          const IconComp = getCategoryIcon(cat.icon);
          return (
            <div key={cat.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-card flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-2xl ${cat.bg} flex items-center justify-center`}>
                  <IconComp className="w-6 h-6" />
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => { setSelectedCategory(cat); setIsModalOpen(true); }}
                    className="p-2 text-slate-400 hover:text-purple-600 rounded-xl hover:bg-slate-100"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-slate-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-brand-navy">{cat.name}</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{cat.count}</p>
              </div>
            </div>
          );
        })}
      </div>

      <CategoryModal
        category={selectedCategory}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}

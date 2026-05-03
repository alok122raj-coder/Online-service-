import React, { useState, useEffect } from 'react';
import { X, Plus, Info } from 'lucide-react';
import { GovLink, Category, CATEGORIES } from '../types';
import { db, auth, OperationType, handleFirestoreError } from '../lib/firebase';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';

interface GovLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  linkToEdit: GovLink | null;
}

export default function GovLinkModal({ isOpen, onClose, linkToEdit }: GovLinkModalProps) {
  const [formData, setFormData] = useState<Partial<GovLink>>({
    title: '',
    org: '',
    description: '',
    url: '',
    category: 'jobs',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (linkToEdit) {
      setFormData(linkToEdit);
    } else {
      setFormData({
        title: '',
        org: '',
        description: '',
        url: '',
        category: 'jobs',
        tags: []
      });
    }
  }, [linkToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    try {
      if (linkToEdit) {
        await updateDoc(doc(db, 'links', linkToEdit.id), {
          ...formData,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, 'links'), {
          ...formData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          createdBy: auth.currentUser.uid,
        });
      }
      onClose();
    } catch (error) {
      handleFirestoreError(error, linkToEdit ? OperationType.UPDATE : OperationType.CREATE, 'links');
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim().toUpperCase())) {
      setFormData({ ...formData, tags: [...(formData.tags || []), tagInput.trim().toUpperCase()] });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: (formData.tags || []).filter(t => t !== tag) });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 z-50 flex items-end md:items-center justify-center p-0 md:p-4 backdrop-blur-[2px]">
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          className="bg-white w-full max-w-lg rounded-t-2xl md:rounded-2xl overflow-hidden shadow-2xl overflow-y-auto max-h-[90vh]"
        >
          <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
            <div>
              <h2 className="text-lg font-serif font-bold text-[#000080]">{linkToEdit ? 'Edit Link' : 'नया Link जोड़ें'}</h2>
              <p className="text-[10px] text-gray-400 mt-1">Sarkari Portal Database</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">TITLE (हिंदी या English)</label>
              <input
                required
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. SSC CGL 2025 Application Form"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#000080] focus:border-transparent outline-none transition-all text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">ORGANIZATION</label>
                <input
                  required
                  type="text"
                  value={formData.org}
                  onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                  placeholder="e.g. UPSC, SSC, CBSE"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#000080] focus:border-transparent outline-none transition-all text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">CATEGORY</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#000080] focus:border-transparent outline-none transition-all text-sm"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">OFFICIAL URL (APPLY LINK)</label>
              <input
                required
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://official-website.gov.in"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#000080] focus:border-transparent outline-none transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">NOTIFICATION PDF URL (DOWNLOAD LINK)</label>
              <input
                type="url"
                value={formData.notificationUrl || ''}
                onChange={(e) => setFormData({ ...formData, notificationUrl: e.target.value })}
                placeholder="https://official.gov.in/notification.pdf"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#000080] focus:border-transparent outline-none transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">SUMMARY / DESCRIPTION</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Briefly explain what this link is for..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#000080] focus:border-transparent outline-none transition-all text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">TAGS (e.g. NEW, EXTENDED)</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                  placeholder="Type tag and press enter"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="bg-gray-100 p-3 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {formData.tags?.map(tag => (
                  <span key={tag} className="bg-[#000080]/5 text-[#000080] px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}><X size={10} /></button>
                  </span>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#000080] text-white py-4 rounded-xl text-sm font-bold shadow-xl shadow-[#000080]/20 hover:bg-[#FF6B00] transition-colors mt-4"
            >
              {linkToEdit ? 'UPDATE DATABASE' : 'ADD TO LIST'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

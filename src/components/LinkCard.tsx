import React from 'react';
import { ExternalLink, Edit2, Trash2, FileDown } from 'lucide-react';
import { GovLink, Category } from '../types';
import { motion } from 'motion/react';

interface LinkCardProps {
  link: GovLink;
  isAdmin: boolean;
  onEdit: (link: GovLink) => void;
  onDelete: (id: string) => void | Promise<void>;
}

const CATEGORY_COLORS: Record<Category, string> = {
  jobs: 'border-orange-500',
  results: 'border-green-600',
  admit: 'border-blue-600',
  admission: 'border-purple-500',
  scheme: 'border-yellow-600',
  cert: 'border-cyan-600',
  state: 'border-red-600',
  central: 'border-emerald-600',
};

const CATEGORY_BADGE: Record<Category, string> = {
  jobs: 'bg-orange-100 text-orange-700',
  results: 'bg-green-100 text-green-700',
  admit: 'bg-blue-100 text-blue-700',
  admission: 'bg-purple-100 text-purple-700',
  scheme: 'bg-yellow-100 text-yellow-700',
  cert: 'bg-cyan-100 text-cyan-700',
  state: 'bg-red-100 text-red-700',
  central: 'bg-emerald-100 text-emerald-700',
};

export default function LinkCard({ link, isAdmin, onEdit, onDelete }: LinkCardProps) {
  const getButtonText = (category: Category) => {
    switch(category) {
      case 'jobs': return 'Apply Now';
      case 'results': return 'Check Score';
      case 'admit': return 'Download';
      case 'admission': return 'Apply Admission';
      default: return 'Visit Official';
    }
  };

  const getButtonColor = (category: Category) => {
    switch(category) {
      case 'results': return 'bg-green-600 hover:bg-green-700';
      case 'admit': return 'bg-slate-800 hover:bg-slate-900';
      default: return 'bg-[#000080] hover:bg-blue-800';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`bg-white p-5 rounded-xl border-l-[6px] ${CATEGORY_COLORS[link.category]} shadow-sm flex flex-col md:flex-row justify-between md:items-center group hover:shadow-md transition-shadow gap-4`}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${CATEGORY_BADGE[link.category]}`}>
            {link.category}
          </span>
          {link.tags?.map((tag, i) => (
            <span 
              key={i} 
              className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase"
            >
              {tag}
            </span>
          ))}
        </div>
        <h4 className="text-lg font-bold text-slate-800 mt-1 hover:text-blue-700 cursor-pointer transition-colors">{link.title}</h4>
        <p className="text-xs text-slate-500 mt-1 font-mono uppercase tracking-tight">
          {link.org} • {link.description.slice(0, 80)}{link.description.length > 80 ? '...' : ''}
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {link.notificationUrl && (
          <a 
            href={link.notificationUrl}
            target="_blank"
            referrerPolicy="no-referrer"
            className="bg-slate-100 text-slate-700 px-4 py-2.5 rounded-lg font-bold text-sm shadow-sm transition-all flex items-center gap-2 hover:bg-slate-200"
            title="Download Notification PDF"
          >
            <FileDown size={16} />
            <span className="hidden sm:inline">PDF</span>
          </a>
        )}
        
        <a 
          href={link.url}
          target="_blank"
          referrerPolicy="no-referrer"
          className={`text-white px-5 py-2.5 rounded-lg font-bold text-sm shadow-sm transition-all active:scale-95 ${getButtonColor(link.category)}`}
        >
          {getButtonText(link.category)}
        </a>

        {isAdmin && (
          <div className="flex gap-1">
            <button 
              onClick={() => onEdit(link)}
              className="bg-blue-50 text-blue-600 p-2.5 rounded-lg border border-blue-100 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
            >
              <Edit2 size={14} />
            </button>
            <button 
              onClick={() => onDelete(link.id)}
              className="bg-red-50 text-red-600 p-2.5 rounded-lg border border-red-100 hover:bg-red-600 hover:text-white transition-all shadow-sm"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

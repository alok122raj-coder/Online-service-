import { CATEGORIES, Category } from '../types';

interface TabsProps {
  activeTab: Category;
  setActiveTab: (tab: Category) => void;
}

export default function Tabs({ activeTab, setActiveTab }: TabsProps) {
  return (
    <div className="bg-white shrink-0 overflow-x-auto no-scrollbar flex border-b border-slate-200 px-2 md:px-6">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setActiveTab(cat.id)}
          className={`
            px-4 md:px-6 py-4 text-[11px] md:text-sm font-bold whitespace-nowrap transition-all border-b-4 flex items-center gap-2
            ${activeTab === cat.id 
              ? 'text-blue-700 bg-blue-50/50 border-blue-700' 
              : 'text-slate-500 border-transparent hover:text-slate-800 hover:bg-slate-50'
            }
          `}
        >
          <span className="text-lg">{cat.icon}</span>
          <span className="uppercase tracking-tight">{cat.label}</span>
        </button>
      ))}
    </div>
  );
}

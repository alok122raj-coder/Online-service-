import { Search } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  return (
    <div className="bg-slate-100 px-4 py-4 md:px-8 shrink-0">
      <div className="relative max-w-2xl mx-auto">
        <input
          type="search"
          placeholder="खोजें — नौकरी, Result, Scheme..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 md:py-4 rounded-2xl border-none shadow-lg focus:ring-2 focus:ring-blue-600 outline-none text-base md:text-lg bg-white"
        />
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl md:text-2xl opacity-40 pointer-events-none">🔍</span>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  group?: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({ options, value, onChange, placeholder = "Arama..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const groupedOptions = options.reduce((acc, option) => {
    const group = option.group || 'Diğer';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(option);
    return acc;
  }, {} as Record<string, Option[]>);

  const filteredGroups = Object.keys(groupedOptions).reduce((acc, groupName) => {
    const filtered = groupedOptions[groupName].filter(opt =>
      opt.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[groupName] = filtered;
    }
    return acc;
  }, {} as Record<string, Option[]>);


  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        className="w-full bg-stone-50 border border-stone-300 text-stone-800 text-lg rounded-lg focus:ring-amber-500 focus:border-amber-500 block p-3 text-left flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown size={20} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-stone-200 max-h-72 overflow-y-auto">
          <div className="p-2 sticky top-0 bg-white border-b border-stone-100">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder={placeholder}
                className="w-full bg-stone-100 border-transparent focus:ring-amber-500 focus:border-amber-500 rounded-md pl-10 pr-3 py-2 text-sm"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <ul className="py-1">
            {Object.keys(filteredGroups).length > 0 ? (
                Object.entries(filteredGroups).map(([groupName, groupOptions]) => (
                    <div key={groupName}>
                        <li className="px-3 py-2 text-xs font-bold text-stone-400 uppercase tracking-wider">{groupName}</li>
                        {groupOptions.map(option => (
                             <li
                                key={option.value}
                                className={`px-5 py-2.5 text-sm cursor-pointer hover:bg-amber-50 ${option.value === value ? 'bg-amber-100 text-amber-800 font-bold' : 'text-stone-700'}`}
                                onClick={() => handleSelect(option.value)}
                            >
                                {option.label}
                            </li>
                        ))}
                    </div>
                ))
            ) : (
              <li className="px-3 py-2 text-sm text-stone-500 text-center">Sonuç bulunamadı.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;

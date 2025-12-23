import React, { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  error?: string;
  helperText?: string;
}

export const AddressAutocomplete: React.FC<Props> = ({ label, value, onChange, required, placeholder, error, helperText }) => {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  // Use a ref to track if the change is coming from user typing
  const isTypingRef = useRef(false);

  // Sync internal state if parent updates value externally
  useEffect(() => {
    if (value !== query) {
        setQuery(value);
    }
  }, [value]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const fetchSuggestions = async (searchText: string) => {
    if (searchText.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      // Using ArcGIS World Geocoding Service (Suggest Endpoint)
      // This is generally more accurate for US addresses and supports strict country filtering.
      const response = await fetch(
        `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest?f=json&text=${encodeURIComponent(searchText)}&countryCode=USA&maxSuggestions=10`
      );
      
      if (!response.ok) {
        console.warn("Address service unavailable:", response.statusText);
        return; 
      }
      
      const data = await response.json();
      
      if (data.suggestions) {
          const mappedSuggestions = data.suggestions.map((s: any) => ({
              display_name: s.text,
              magicKey: s.magicKey
          }));
          setSuggestions(mappedSuggestions);
          if (mappedSuggestions.length > 0) setIsOpen(true);
      }
    } catch (e) {
      console.error("Address fetch error", e);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce logic
  useEffect(() => {
    if (!isTypingRef.current) return;

    const timer = setTimeout(() => {
      if (query.length > 2) {
          fetchSuggestions(query);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (item: any) => {
    isTypingRef.current = false;
    const fullAddress = item.display_name;
    setQuery(fullAddress);
    onChange(fullAddress);
    setSuggestions([]);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    isTypingRef.current = true;
    const val = e.target.value;
    setQuery(val);
    onChange(val);
    if (val.length < 3) {
        setSuggestions([]);
        setIsOpen(false);
    }
  };

  return (
    <div className="w-full relative" ref={wrapperRef}>
       <label className="block text-sm font-semibold text-slate-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
            type="text"
            className={`w-full px-4 py-2.5 pl-10 rounded-lg border bg-white focus:ring-2 focus:ring-nyc-blue focus:border-nyc-blue transition-all duration-200 outline-none
            ${error ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 hover:border-slate-400'}
            `}
            value={query}
            onChange={handleInputChange}
            placeholder={placeholder}
            autoComplete="off"
            onFocus={() => { if(suggestions.length > 0) setIsOpen(true); }}
        />
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 text-slate-400">
          <MapPin size={18} />
        </div>
        {isLoading && (
            <div className="absolute inset-y-0 right-0 flex items-center px-3">
                 <div className="animate-spin h-4 w-4 border-2 border-nyc-blue border-t-transparent rounded-full"></div>
            </div>
        )}
      </div>
      
      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-auto">
            {suggestions.map((item, index) => (
                <li 
                    key={index}
                    onClick={() => handleSelect(item)}
                    className="px-4 py-3 hover:bg-nyc-lightBlue cursor-pointer text-sm border-b border-slate-50 last:border-0 text-slate-700 flex items-start gap-2"
                >
                    <MapPin size={14} className="mt-0.5 text-slate-400 flex-shrink-0" />
                    <span>{item.display_name}</span>
                </li>
            ))}
        </ul>
      )}
       {helperText && !error && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
       {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
};
import { useState, useRef, useEffect } from 'react';

interface Option {
    label: string;
    value: string;
}

interface SearchableSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    dropUp?: boolean;
}

export default function SearchableSelect({
    options,
    value,
    onChange,
    placeholder = 'Select...',
    disabled = false,
    className = '',
    dropUp = false,
}: SearchableSelectProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const selected = options.find(o => o.value === value);

    const filtered = options.filter(o =>
        o.label.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        setHighlightedIndex(0);
    }, [query]);

    useEffect(() => {
        if (open) {
            setQuery('');
            setHighlightedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [open]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex(prev => (prev + 1) % filtered.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex(prev => (prev - 1 + filtered.length) % filtered.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (filtered[highlightedIndex]) {
                onChange(filtered[highlightedIndex].value);
                setOpen(false);
            }
        } else if (e.key === 'Escape') {
            setOpen(false);
        } else if (e.key === 'Backspace' && query === '') {
            onChange('');
        }
    };

    const baseClass = "w-full px-3 py-2 text-sm bg-[#FDFDFC] dark:bg-[#0a0a0a] border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-lg text-[#1b1b18] dark:text-[#EDEDEC] placeholder-[#706f6c] dark:placeholder-[#A1A09A] focus:outline-none focus:ring-2 focus:ring-[#f53003]/50 focus:border-[#f53003] transition-colors";

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Trigger */}
            <button
                type="button"
                disabled={disabled}
                onClick={() => !disabled && setOpen(!open)}
                className={`${baseClass} text-left flex items-center justify-between gap-2 ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
            >
                <span className={selected ? '' : 'text-[#706f6c] dark:text-[#A1A09A]'}>
                    {selected ? selected.label : placeholder}
                </span>
                <svg className={`w-4 h-4 flex-shrink-0 text-[#706f6c] dark:text-[#A1A09A] transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </button>

            {/* Dropdown */}
            {open && (
                <div className={`absolute z-50 w-full bg-white dark:bg-[#161615] border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-lg shadow-lg overflow-hidden ${dropUp ? 'bottom-full mb-1' : 'mt-1'}`}>
                    {/* Search input */}
                    <div className="p-2 border-b border-[#e3e3e0] dark:border-[#3E3E3A]">
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type to search..."
                            className="w-full px-2 py-1.5 text-sm bg-[#FDFDFC] dark:bg-[#0a0a0a] border border-[#e3e3e0] dark:border-[#3E3E3A] rounded-md text-[#1b1b18] dark:text-[#EDEDEC] placeholder-[#706f6c] dark:placeholder-[#A1A09A] focus:outline-none focus:ring-1 focus:ring-[#f53003]/50"
                        />
                    </div>

                    {/* Options */}
                    <div className="max-h-48 overflow-y-auto">
                        {filtered.length === 0 ? (
                            <div className="px-3 py-4 text-sm text-center text-[#706f6c] dark:text-[#A1A09A]">
                                No results found
                            </div>
                        ) : (
                            filtered.map((option, index) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value);
                                        setOpen(false);
                                    }}
                                    onMouseEnter={() => setHighlightedIndex(index)}
                                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                                        option.value === value
                                            ? 'bg-[#f53003]/10 text-[#f53003] font-medium'
                                            : highlightedIndex === index
                                                ? 'bg-[#e3e3e0]/50 dark:bg-[#3E3E3A]/50 text-[#1b1b18] dark:text-[#EDEDEC]'
                                                : 'text-[#1b1b18] dark:text-[#EDEDEC] hover:bg-[#e3e3e0]/30 dark:hover:bg-[#3E3E3A]/30'
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

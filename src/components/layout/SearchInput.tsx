import { Search } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export function SearchInput({ value, onChange, placeholder }: SearchInputProps) {
  return (
    <div className="relative max-[640px]:w-full">
      <Search
        size={13}
        strokeWidth={1.6}
        className="pointer-events-none absolute top-1/2 left-[11px] -translate-y-1/2 text-text-3"
      />
      <input
        className="w-[260px] rounded-[9px] border border-white/56 bg-glass-card py-2 pr-3 pl-[34px] font-sans text-[13.5px] text-text-1 outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-text-3 focus:border-accent-mid focus:shadow-[0_0_0_3px_rgba(26,86,219,0.07)] max-[640px]:w-full"
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

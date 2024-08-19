// components/SearchInput.tsx
import React from "react";
import { SearchIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ className, ...props }) => {
  return (
    <div className="relative flex items-center w-full">
      <input
        type="text"
        className={cn(
          "pr-10 pl-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent w-full",
          className
        )}
        {...props}
      />
      <SearchIcon className="absolute right-3 h-5 w-5 text-gray-400" />
    </div>
  );
};

export default SearchInput;

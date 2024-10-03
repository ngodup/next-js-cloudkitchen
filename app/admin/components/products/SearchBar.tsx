import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: () => void;
}

const SearchBar = ({
  searchTerm,
  setSearchTerm,
  handleSearch,
}: SearchBarProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Input
        type="text"
        placeholder="Search for food item name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-79 md:w-96"
      />
      <Button onClick={handleSearch}>
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </div>
  );
};

export default SearchBar;

import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  handleSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  setSearchTerm,
  handleSearch,
}) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Search for order ID, username, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-79 md:w-96"
        />
        <Button onClick={handleSearch}>
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
      <Button variant="outline" className="md:flex hidden">
        <Filter className="h-4 w-4 mr-2" />
        Filters
      </Button>
    </div>
  );
};

export default SearchBar;

"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface ProjectSearchProps {
  onSearch: (searchTerm: string) => void;
  disabled: boolean;
}

export default function ProjectSearch({
  onSearch,
  disabled,
}: ProjectSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term);
  };

  return (
    <div className="relative">
      <Search
        className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
        size={20}
      />
      <Input
        disabled={disabled}
        type="text"
        placeholder="Search projects..."
        value={searchTerm}
        onChange={handleSearch}
        className="pl-10 pr-4 py-2 w-full"
      />
    </div>
  );
}

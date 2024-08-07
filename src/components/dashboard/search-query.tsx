"use client";
import { useState } from "react";

interface SearchBarProps {
    onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [query, setQuery] = useState("");

    const handleSearch = () => {
        onSearch(query);
    };

    return (
        <div className="flex items-center p-2 bg-gray-800 rounded-md max-w-md w-full">
            <input
                type="text"
                className="flex-grow p-2 bg-gray-700 text-white rounded-md"
                placeholder="Search Repositories and Projects..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <button
                className="ml-2 p-2 bg-blue-600 text-white rounded-md"
                onClick={handleSearch}
            >
                Search
            </button>
        </div>
    );
}
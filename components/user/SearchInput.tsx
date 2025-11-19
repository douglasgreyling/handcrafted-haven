// components/SearchInput.tsx
"use client";
import {Input} from "@nextui-org/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";



import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export function SearchInput() {
  const [query, setQuery] = useState("");

  const handleSearch = useDebouncedCallback((term) => {
    // Logic to update URL or fetch data based on 'term'
    console.log("Searching for:", term);
  }, 300);

  return (
    <div className="p-4  justify-center">
    <Input className="w-96" endContent={ <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />}
      type="search"
      placeholder="Search..."
      value={query}
      onChange={(e) => {
        setQuery(e.target.value);
        handleSearch(e.target.value);
      }}
      
    />
    </div>
  );
}
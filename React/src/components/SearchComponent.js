// src/components/SearchComponent.js
import React, { useState, useEffect } from "react";
import debounce from 'lodash.debounce';

function SearchComponent({ data, onSearch }) {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const debouncedSearch = debounce(() => {
      onSearch(searchQuery);
    }, 300);

    debouncedSearch();

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchQuery, onSearch]);

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search places..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={() => onSearch(searchQuery)}>
        <i className="fa fa-search"></i>
      </button>
    </div>
  );
}

export default SearchComponent;
import React from "react";
import { Search } from "lucide-react";

const FilterUnified = ({
  searchQuery,
  selectedLocation,
  selectedCategory,
  onSearchQueryChange,
  onLocationChange,
  onCategoryChange,
  onSearch,
}) => {
  // Placeholder for dynamic location and category options
  // In a real app, these could be fetched from an API or derived from data
  const locations = ["All", "Lagos", "Abuja", "Kano", "Ibadan"];
  const categories = [
    "All",
    "textile-apparel",
    "fashion-clothing",
    "agriculture-farming",
    "Uncategorized",
    "Technology",
    "Healthcare",
    "Education",
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Filter Results
      </h2>

      {/* Search Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Search
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            placeholder="Search by name, profession, category..."
            className="w-full p-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            onClick={onSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-600">
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* Location Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Location (State, LGA, Area)
        </label>
        <select
          value={selectedLocation}
          onChange={(e) => {
            onLocationChange(e.target.value);
            onSearch();
          }}
          className="w-full p-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      {/* Category Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Category/Profession
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => {
            onCategoryChange(e.target.value);
            onSearch();
          }}
          className="w-full p-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Apply Filters Button */}
      <button
        onClick={onSearch}
        className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors">
        Apply Filters
      </button>
    </div>
  );
};

export default FilterUnified;

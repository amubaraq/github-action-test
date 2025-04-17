import React, { useState, useEffect, useMemo } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { FilterBusiness } from "../components/Cards/BrowseComponent";
import BusinessCard from "../components/Cards/BusinessCard";
import backendURL from "../config";

const SearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  // State initialization with URL parameters
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(
    queryParams.get("query") || ""
  );
  const [selectedLocation, setSelectedLocation] = useState(
    queryParams.get("location") || "All"
  );
  const [selectedCategory, setSelectedCategory] = useState(
    queryParams.get("category") || "All"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const businessesPerPage = 9;

  // Sync state with URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchQuery(params.get("query") || "");
    setSelectedLocation(params.get("location") || "All");
    setSelectedCategory(params.get("category") || "All");
  }, [location.search]);

  // Fetch business data from API
  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${backendURL}/api/lists/business`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("API Response:", data); // Debug: Log the full response
        if (data.status === "success" && Array.isArray(data.data)) {
          // Normalize business data to ensure consistency
          const normalizedBusinesses = data.data.map((business) => ({
            id: business.id || Math.random().toString(36).substr(2, 9),
            name: business.business_name || "Unnamed Business",
            slug: business.slug || "undefined",
            address: business.business_address || "Not specified",
            category: business.category_slug || "Uncategorized",
            location: business.state || "Not Available", // Assuming 'state' is used as location
            owner: {
              email: business.business_email || "Not provided",
              phone: business.contact_person_number || "Not available",
            },
            sinceDate: business.date_of_establishment || "N/A",
            rating: business.rating || 0,
            reviews: business.reviews || 0,
            views: business.views || 0,
            image:
              business.business_photos && business.business_photos.length > 0
                ? business.business_photos[0].photo_path
                : null,
          }));
          setBusinesses(normalizedBusinesses);
        } else {
          throw new Error("Invalid data format or failed to fetch businesses");
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching businesses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("query", searchQuery);
    if (selectedLocation !== "All") params.set("location", selectedLocation);
    if (selectedCategory !== "All") params.set("category", selectedCategory);
    navigate(`/searchPage?${params.toString()}`);
  };

  // Memoized filtered businesses
  const filteredBusinesses = useMemo(() => {
    return businesses.filter((business) => {
      const name = (business.name || "").toLowerCase();
      const address = (business.address || "").toLowerCase();
      const category = (business.category || "").toLowerCase();
      const location = (business.location || "").toLowerCase();

      const matchesSearch =
        name.includes(searchQuery.toLowerCase()) ||
        address.includes(searchQuery.toLowerCase()) ||
        category.includes(searchQuery.toLowerCase()) ||
        location.includes(searchQuery.toLowerCase());

      const matchesLocation =
        selectedLocation === "All" ||
        location === selectedLocation.toLowerCase();
      const matchesCategory =
        selectedCategory === "All" ||
        category === selectedCategory.toLowerCase();

      return matchesSearch && matchesLocation && matchesCategory;
    });
  }, [businesses, searchQuery, selectedLocation, selectedCategory]);

  // Memoized pagination
  const indexOfLastBusiness = useMemo(
    () => currentPage * businessesPerPage,
    [currentPage, businessesPerPage]
  );
  const indexOfFirstBusiness = useMemo(
    () => indexOfLastBusiness - businessesPerPage,
    [indexOfLastBusiness, businessesPerPage]
  );
  const currentBusinesses = useMemo(
    () => filteredBusinesses.slice(indexOfFirstBusiness, indexOfLastBusiness),
    [filteredBusinesses, indexOfFirstBusiness, indexOfLastBusiness]
  );
  const totalPages = useMemo(
    () => Math.ceil(filteredBusinesses.length / businessesPerPage),
    [filteredBusinesses, businessesPerPage]
  );

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Memoized pagination range
  const generatePaginationRange = useMemo(() => {
    const range = [];
    const maxVisiblePages = 5;
    const ellipsis = "...";

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      range.push(1);
      if (currentPage > 3) {
        range.push(ellipsis);
      }
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        range.push(i);
      }
      if (currentPage < totalPages - 2) {
        range.push(ellipsis);
      }
      range.push(totalPages);
    }

    return range;
  }, [currentPage, totalPages]);

  return (
    <>
      {/* Search Results Header */}
      <div className="text-gray-600 text-center my-5 px-3 border-gray-200 p-2 border sm:w-[50%] mx-auto bg-gray-50 rounded-lg shadow-sm">
        <span>
          <h1 className="text-xl font-semibold">Search Results</h1>
        </span>
        <span className="text-sm">
          Showing {filteredBusinesses.length} results for "{searchQuery}"
        </span>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className=" contain flex flex-col lg:flex-row gap-8">
          {/* Business Listings */}
          <div className="flex-1">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                <p className="ml-4 text-gray-500">Loading businesses...</p>
              </div>
            )}

            {error && !loading && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                <p className="font-medium">Failed to load businesses</p>
                <p className="text-sm">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 text-sm text-red-600 hover:text-red-800 underline">
                  Try again
                </button>
              </div>
            )}

            {!loading && !error && filteredBusinesses.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {currentBusinesses.map((business) => (
                  <BusinessCard key={business.id} business={business} />
                ))}
              </div>
            )}

            {!loading && !error && filteredBusinesses.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg shadow-md">
                <p className="text-gray-500 text-lg mb-4">
                  No results found for "{searchQuery}".
                </p>
                <p className="text-gray-500 mb-6">
                  Try refining your search or check your spelling for better
                  results.
                </p>
                <Link to="/">
                  <button className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                    Return to Home
                  </button>
                </Link>
              </div>
            )}

            {/* Modern Pagination */}
            {!loading && !error && totalPages > 1 && (
              <div className="flex justify-center items-center mt-8 space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-full transition-colors ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}>
                  <ChevronLeft size={18} />
                </button>

                {generatePaginationRange().map((page, index) =>
                  page === "..." ? (
                    <span
                      key={index}
                      className="px-4 py-2 text-gray-600 cursor-default">
                      {page}
                    </span>
                  ) : (
                    <button
                      key={index}
                      onClick={() => handlePageChange(page)}
                      className={`px-4 py-2 rounded-full transition-colors ${
                        currentPage === page
                          ? "bg-red-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}>
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-full transition-colors ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}>
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Filter Sidebar */}
        <section className="w-full">
          <FilterBusiness
            showSearch={false}
            searchQuery={searchQuery}
            selectedLocation={selectedLocation}
            selectedCategory={selectedCategory}
            onLocationChange={setSelectedLocation}
            onCategoryChange={setSelectedCategory}
            onSearch={handleSearch}
          />
        </section>
      </div>
    </>
  );
};

export default SearchPage;

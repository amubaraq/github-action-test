import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  MapPin,
  Briefcase,
  Filter,
  Grid,
  List,
  Loader,
  Star,
} from "lucide-react";
import BusinessCard from "../components/Cards/BusinessCard";
import businessImage from "../assets/images/E-business.png";
import backendURL from "../config";

const AllBusinessesPage = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [businessesPerPage] = useState(12);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendURL}/api/lists/business`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      if (data.status === "success") {
        setBusinesses(Array.isArray(data.data) ? data.data : [data.data]);
      } else {
        throw new Error("Failed to fetch businesses");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching businesses:", err);
    } finally {
      setLoading(false);
    }
  };

  const states = useMemo(() => {
    if (!Array.isArray(businesses)) return ["All States"];
    const uniqueStates = [
      ...new Set(
        businesses
          .map((item) => {
            const business = item.business || item;
            return business.state || "Not Specified";
          })
          .filter((state) => state && state !== "Not Specified")
      ),
    ].sort();
    return ["All States", ...uniqueStates];
  }, [businesses]);

  const categories = useMemo(() => {
    if (!Array.isArray(businesses)) return ["All Categories"];
    const uniqueCategories = [
      ...new Set(
        businesses
          .map((item) => {
            const business = item.business || item;
            return business.category_slug || "Uncategorized";
          })
          .filter((category) => category && category !== "Uncategorized")
      ),
    ].sort();
    return ["All Categories", ...uniqueCategories];
  }, [businesses]);

  const filteredBusinesses = useMemo(() => {
    return businesses
      .filter((item) => {
        const business = item.business || item;
        const name = (business.business_name || "").toLowerCase();
        const address = (business.business_address || "").toLowerCase();
        const category = (business.category_slug || "").toLowerCase();
        const state = (business.state || "").toLowerCase();

        const matchesSearch =
          searchQuery === "" ||
          name.includes(searchQuery.toLowerCase()) ||
          address.includes(searchQuery.toLowerCase()) ||
          category.includes(searchQuery.toLowerCase());

        const matchesState =
          selectedState === "All States" ||
          state === selectedState.toLowerCase();

        const matchesCategory =
          selectedCategory === "All Categories" ||
          category === selectedCategory.toLowerCase();

        return matchesSearch && matchesState && matchesCategory;
      })
      .sort((a, b) => {
        const businessA = a.business || a;
        const businessB = b.business || b;
        const multiplier = sortOrder === "asc" ? 1 : -1;

        switch (sortBy) {
          case "name":
            return (
              (businessA.business_name || "").localeCompare(
                businessB.business_name || ""
              ) * multiplier
            );
          case "rating":
            return (
              ((b.average_rating || 0) - (a.average_rating || 0)) * multiplier
            );
          case "views":
            return (
              ((businessB.views || 0) - (businessA.views || 0)) * multiplier
            );
          default:
            return 0;
        }
      });
  }, [
    businesses,
    searchQuery,
    selectedState,
    selectedCategory,
    sortBy,
    sortOrder,
  ]);

  // Pagination logic
  const totalPages = Math.ceil(filteredBusinesses.length / businessesPerPage);
  const currentBusinesses = useMemo(() => {
    const indexOfLastBusiness = currentPage * businessesPerPage;
    const indexOfFirstBusiness = indexOfLastBusiness - businessesPerPage;
    return filteredBusinesses.slice(indexOfFirstBusiness, indexOfLastBusiness);
  }, [currentPage, filteredBusinesses, businessesPerPage]);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedState, selectedCategory, sortBy, sortOrder]);

  const formatBusinessForCard = (business) => {
    const biz = business.business || business;
    return {
      id: biz.id || Math.random().toString(36).substr(2, 9),
      name: biz.business_name || "Unnamed Business",
      phone: biz.contact_person_number || "No Contact",
      email: biz.contact_person_email || "No Email",
      slug: biz.slug || "undefined",
      address: biz.business_address || "Not specified",
      category: biz.category_slug || "Uncategorized",
      state: biz.state || "Not Available",
      sinceDate: biz.date_of_establishment || "N/A",
      rating: business.average_rating || 0,
      reviews: business.total_reviews || 0,
      views: biz.views || 0,
      image:
        biz.business_photos && biz.business_photos.length > 0
          ? Array.isArray(biz.business_photos)
            ? biz.business_photos[0].photo_path
            : biz.business_photos[0]
          : null,
      operationHours: biz.operation_hours || "Not specified",
      verified: biz.verification_percentage > 50,
      socialMedia: biz.social_media || {},
      staffCount: biz.number_of_staff || 0,
    };
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[60vh] bg-gradient-to-b from-gray-900 to-gray-700 flex items-center justify-center text-center px-4 sm:px-6 lg:px-8">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${businessImage})` }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
            Discover Top Businesses
          </h1>
          <p className="text-base sm:text-lg text-gray-200 mb-6 max-w-2xl mx-auto">
            Find trusted businesses by location, category, and ratings—connect
            with the best today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-red-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-red-700 transition-colors duration-300 shadow-md">
              Start Exploring
            </button>
            <Link
              to="/people"
              className="bg-transparent border-2 border-white text-white px-6 py-2.5 rounded-full font-medium hover:bg-white hover:text-gray-900 transition-colors duration-300 shadow-md">
              Browse Professionals
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row">
        <div className="flex-1">
          {/* Filters */}
          <div className="mb-8 space-y-4">
            <div className="relative max-w-xl">
              <input
                type="text"
                placeholder="Search businesses by name, location, or category..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              {/* State Filter */}
              <div className="relative w-full sm:w-48">
                <select
                  className="appearance-none bg-white border rounded-lg px-4 py-2 pr-8 w-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                <MapPin
                  className="absolute right-3 top-2.5 text-gray-400 pointer-events-none"
                  size={16}
                />
              </div>

              {/* Category Filter */}
              <div className="relative w-full sm:w-48">
                <select
                  className="appearance-none bg-white border rounded-lg px-4 py-2 pr-8 w-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <Briefcase
                  className="absolute right-3 top-2.5 text-gray-400 pointer-events-none"
                  size={16}
                />
              </div>

              <div className="flex items-center space-x-2 ml-auto">
                <label className="text-sm text-gray-600">Sort by:</label>
                <select
                  className="bg-white border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}>
                  <option value="name">Name</option>
                  <option value="rating">Rating</option>
                  <option value="views">Views</option>
                </select>
                <button
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  className="p-2 hover:bg-gray-100 rounded-lg">
                  {sortOrder === "asc" ? "↑" : "↓"}
                </button>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-red-100" : "hover:bg-gray-50"}`}>
                  <Grid
                    size={20}
                    className={
                      viewMode === "grid" ? "text-red-600" : "text-gray-600"
                    }
                  />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg ${viewMode === "list" ? "bg-red-100" : "hover:bg-gray-50"} hidden sm:block`}>
                  <List
                    size={20}
                    className={
                      viewMode === "list" ? "text-red-600" : "text-gray-600"
                    }
                  />
                </button>
              </div>
            </div>

            <div className="text-sm text-gray-600">
              Showing {filteredBusinesses.length} results
              <button
                onClick={fetchBusinesses}
                className="ml-4 text-red-600 hover:text-red-700"
                disabled={loading}>
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>

          {/* Loading/Error/Empty States */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader className="animate-spin h-10 w-10 text-red-600 mb-4" />
              <p className="text-gray-500">Loading businesses...</p>
            </div>
          )}

          {error && !loading && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              <p className="font-medium">Failed to load businesses</p>
              <p className="text-sm">{error}</p>
              <button
                onClick={fetchBusinesses}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline">
                Try again
              </button>
            </div>
          )}

          {!loading && !error && filteredBusinesses.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Briefcase size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No businesses found
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your filters or search terms.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedState("All States");
                  setSelectedCategory("All Categories");
                }}
                className="text-red-600 hover:text-red-700 font-medium inline-flex items-center">
                <Filter size={16} className="mr-2" />
                Clear all filters
              </button>
            </div>
          )}

          {/* Business Listings */}
          {!loading && !error && filteredBusinesses.length > 0 && (
            <>
              <div
                className={`gap-6 ${
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : "space-y-6 max-w-md"
                }`}>
                {currentBusinesses.map((business) => (
                  <BusinessCard
                    key={business.id}
                    business={formatBusinessForCard(business)}
                  />
                ))}
              </div>

              {/* Pagination */}
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

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                  )
                  .map((page, index, array) => {
                    const prevPage = array[index - 1];
                    const showEllipsisBefore =
                      index > 0 && prevPage !== page - 1;

                    return (
                      <React.Fragment key={page}>
                        {showEllipsisBefore && (
                          <span className="px-3 py-2 text-gray-400">...</span>
                        )}
                        <button
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-full transition-colors ${
                            currentPage === page
                              ? "bg-red-600 text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}>
                          {page}
                        </button>
                      </React.Fragment>
                    );
                  })}

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
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block w-[16rem] ml-8 space-y-6">
          <div className="bg-gray-100 rounded-xl p-4 h-96">
            <span className="text-sm text-gray-500">Advertisement</span>
            <div className="mt-4 h-full flex items-center justify-center">
              <span className="text-gray-400">Ad Space 300x600</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AllBusinessesPage;

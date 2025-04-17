import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  MapPin,
  User,
  Briefcase,
  Filter,
  Grid,
  List,
  Loader,
} from "lucide-react";
import debounce from "lodash/debounce";
import PeopleCard from "../components/Cards/PeopleCard";
import foundersImage from "../assets/images/foundersImage.jpg";
import backendURL from "../config";

const FoundersPage = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [profilesPerPage] = useState(12);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedQualification, setSelectedQualification] =
    useState("All Qualifications");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendURL}/api/profiles`);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch profiles: ${response.status} ${response.statusText}`
        );
      }
      const data = await response.json();
      if (data.status === "success") {
        setProfiles(data.contacts);
      } else {
        throw new Error(data.message || "Unexpected response format");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching profiles:", err);
    } finally {
      setLoading(false);
    }
  };

  const states = useMemo(() => {
    const uniqueStates = [
      ...new Set(profiles.map((p) => p.contact.state).filter(Boolean)),
    ];
    return ["All States", ...uniqueStates];
  }, [profiles]);

  const qualifications = useMemo(() => {
    const uniqueQualifications = [
      ...new Set(profiles.map((p) => p.contact.qualification).filter(Boolean)),
    ];
    return ["All Qualifications", ...uniqueQualifications];
  }, [profiles]);

  const filteredProfiles = useMemo(() => {
    return profiles
      .filter((profile) => {
        const { contact } = profile;
        // Filter for founders (users with total_businesses > 0)
        const isFounder = profile.total_businesses > 0;
        const fullName = `${contact.first_name || ""} ${
          contact.middle_name || ""
        } ${contact.last_name || ""}`.toLowerCase();
        const matchesSearch =
          fullName.includes(searchQuery.toLowerCase()) ||
          (contact.current_place_of_work || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (contact.state || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (contact.city || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesState =
          selectedState === "All States" ||
          (contact.state || "").toLowerCase() === selectedState.toLowerCase();
        const matchesQualification =
          selectedQualification === "All Qualifications" ||
          (contact.qualification || "").toLowerCase() ===
            selectedQualification.toLowerCase();
        return (
          isFounder && matchesSearch && matchesState && matchesQualification
        );
      })
      .sort((a, b) => {
        const multiplier = sortOrder === "asc" ? 1 : -1;
        switch (sortBy) {
          case "name":
            return (
              (a.contact.first_name || "").localeCompare(
                b.contact.first_name || ""
              ) * multiplier
            );
          case "date":
            return (
              (new Date(b.contact.created_at) -
                new Date(a.contact.created_at)) *
              multiplier
            );
          default:
            return 0;
        }
      });
  }, [
    profiles,
    searchQuery,
    selectedState,
    selectedQualification,
    sortBy,
    sortOrder,
  ]);

  const indexOfLastProfile = currentPage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = filteredProfiles.slice(
    indexOfFirstProfile,
    indexOfLastProfile
  );
  const totalPages = Math.ceil(filteredProfiles.length / profilesPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedState, selectedQualification, sortBy, sortOrder]);

  const debouncedSetSearchQuery = useCallback(
    debounce((value) => setSearchQuery(value), 300),
    []
  );

  const formatProfileForCard = (profile) => {
    const { contact, userPhoto } = profile;
    return {
      id: contact.id,
      slug:
        contact.slug ||
        `${contact.first_name}-${contact.last_name}-${contact.id}`.toLowerCase(),
      views: contact.views || 0,
      name: `${contact.first_name || ""} ${contact.middle_name || ""} ${
        contact.last_name || ""
      }`.trim(),
      profession: contact.profession || "Not specified",
      verification_percentage: contact.verification_percentage || 0,
      location:
        contact.city && contact.state
          ? `${contact.city}, ${contact.state}`
          : contact.state || contact.city || "Not specified",
      email: contact.email || "Not available",
      phone: contact.phone || "Not available",
      skills: contact.qualification || "Not specified",
      image: userPhoto || foundersImage, // Fallback to founders-specific image
      totalBusinesses: profile.total_businesses || 0, // Add this for potential display
    };
  };

  const renderPagination = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    const halfRange = Math.floor(maxPagesToShow / 2);
    let startPage = Math.max(1, currentPage - halfRange);
    let endPage = Math.min(totalPages, currentPage + halfRange);

    if (endPage - startPage + 1 < maxPagesToShow) {
      if (currentPage <= halfRange + 1) {
        endPage = Math.min(maxPagesToShow, totalPages);
      } else {
        startPage = Math.max(1, totalPages - maxPagesToShow + 1);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
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

        {startPage > 1 && (
          <>
            <button
              onClick={() => handlePageChange(1)}
              className={`px-4 py-2 rounded-full transition-colors ${
                currentPage === 1
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}>
              1
            </button>
            {startPage > 2 && (
              <span className="px-3 py-2 text-gray-400">...</span>
            )}
          </>
        )}

        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`px-4 py-2 rounded-full transition-colors ${
              currentPage === page
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}>
            {page}
          </button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="px-3 py-2 text-gray-400">...</span>
            )}
            <button
              onClick={() => handlePageChange(totalPages)}
              className={`px-4 py-2 rounded-full transition-colors ${
                currentPage === totalPages
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}>
              {totalPages}
            </button>
          </>
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
    );
  };

  return (
    <>
      {/* Hero Section for Founders */}
      <div className="relative h-[60vh] bg-gradient-to-b from-gray-900 to-gray-700 flex items-center justify-center text-center px-4 sm:px-6 lg:px-8">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${foundersImage})` }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
            Discover Visionary Business Founders
          </h1>
          <p className="text-base sm:text-lg text-gray-200 mb-6 max-w-2xl mx-auto">
            Meet the entrepreneurs shaping industries—connect with founders,
            explore their ventures, and unlock new opportunities.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-red-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-red-700 transition-colors duration-300 shadow-md">
              Explore Founders
            </button>
            <Link
              to="/businesses"
              className="bg-transparent border-2 border-white text-white px-6 py-2.5 rounded-full font-medium hover:bg-white hover:text-gray-900 transition-colors duration-300 shadow-md">
              View All Businesses
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row">
        <div className="flex-1">
          <div className="mb-8 space-y-4">
            <div className="relative max-w-xl">
              <input
                type="text"
                placeholder="Search founders by name, location, or expertise..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                onChange={(e) => debouncedSetSearchQuery(e.target.value)}
              />
              <Search
                className="absolute left-3 top-2.5 text-gray-400"
                size={18}
              />
            </div>

            <div className="flex flex-wrap gap-4 items-center">
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
                  className="absolute right-[2rem] top-2.5 text-gray-400 pointer-events-none"
                  size={16}
                />
              </div>

              <div className="relative w-full sm:w-48">
                <select
                  className="appearance-none bg-white border rounded-lg px-4 py-2 pr-8 w-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={selectedQualification}
                  onChange={(e) => setSelectedQualification(e.target.value)}>
                  {qualifications.map((qualification) => (
                    <option key={qualification} value={qualification}>
                      {qualification.charAt(0).toUpperCase() +
                        qualification.slice(1)}
                    </option>
                  ))}
                </select>
                <Briefcase
                  className="absolute right-[2rem] top-2.5 text-gray-400 pointer-events-none"
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
                  <option value="date">Newest</option>
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
                  className={`p-2 rounded-lg ${
                    viewMode === "grid" ? "bg-red-100" : "hover:bg-gray-50"
                  }`}>
                  <Grid
                    size={20}
                    className={
                      viewMode === "grid" ? "text-red-600" : "text-gray-600"
                    }
                  />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg ${
                    viewMode === "list" ? "bg-red-100" : "hover:bg-gray-50"
                  } hidden sm:block`}>
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
              Showing {filteredProfiles.length} founders
              <button
                onClick={fetchProfiles}
                className="ml-4 text-red-600 hover:text-red-700 flex items-center"
                disabled={loading}>
                {loading ? (
                  <>
                    <Loader className="animate-spin h-4 w-4 mr-2" />
                    Refreshing...
                  </>
                ) : (
                  "Refresh"
                )}
              </button>
            </div>
          </div>

          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader className="animate-spin h-10 w-10 text-red-600 mb-4" />
              <p className="text-gray-500">Loading founders...</p>
            </div>
          )}

          {error && !loading && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              <p className="font-medium">Failed to load founders</p>
              <p className="text-sm">{error}</p>
              <button
                onClick={fetchProfiles}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline">
                Try again
              </button>
            </div>
          )}

          {!loading && !error && filteredProfiles.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <User size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No founders found
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your filters or search terms to find more
                founders.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedState("All States");
                  setSelectedQualification("All Qualifications");
                }}
                className="text-red-600 hover:text-red-700 font-medium inline-flex items-center">
                <Filter size={16} className="mr-2" />
                Clear all filters
              </button>
            </div>
          )}

          {!loading && !error && filteredProfiles.length > 0 && (
            <div
              className={`gap-6 ${
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "space-y-6"
              }`}>
              {currentProfiles.map((profile) => (
                <PeopleCard
                  key={profile.contact.id}
                  person={formatProfileForCard(profile)}
                />
              ))}
            </div>
          )}

          {!loading && !error && totalPages > 1 && renderPagination()}
        </div>

        <div className="hidden lg:block w-[16rem] ml-8 space-y-6">
          <div className="bg-gray-100 rounded-xl p-4 h-96">
            <span className="text-sm text-gray-500">Advertisement</span>
            <div className="mt-4 h-full flex items-center justify-center">
              <span className="text-gray-400">Ad Space 300x600</span>
            </div>
          </div>
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

export default FoundersPage;

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
// import { FilterPeople } from "../components/Cards/BrowseComponent";
import PeopleCard from "../components/Cards/PeopleCard";
import axios from "axios";
import backendURL from "../config";

const PeopleSearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  // State initialization
  const [searchQuery, setSearchQuery] = useState(
    queryParams.get("query") || ""
  );
  const [selectedLocation, setSelectedLocation] = useState(
    queryParams.get("location") || "All"
  );
  const [selectedProfession, setSelectedProfession] = useState(
    queryParams.get("profession") || "All"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [peopleData, setPeopleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const peoplePerPage = 9;

  // Fetch people data from the API
  const fetchPeopleData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendURL}/api/profiles`);
      if (response.data.status === "success") {
        // Transform the data to match the expected format for the UI
        const transformedData = response.data.contacts.map((contact) => ({
          id: contact.id,
          name: `${contact.first_name} ${contact.middle_name} ${contact.last_name}`.trim(),
          profession: contact.profession || "Not specified",
          skills: contact.qualification || "",
          location: `${contact.city}, ${contact.state}`,
          email: "", // Email not provided in the API
          phone: contact.phone || "Not available",
          slug: contact.slug,
          address: contact.address,
          social_media_links: contact.social_media_links,
          viewCount: Math.floor(Math.random() * 100), // Placeholder for view count
          gender: contact.gender,
          religion: contact.religion,
          qualification: contact.qualification,
          marital_status: contact.marital_status,
          last_place_of_work: contact.last_place_of_work,
          views: contact.views || 0,
        }));
        setPeopleData(transformedData);
        console.log(transformedData, "transformedData");
        console.log(response, "response");
      } else {
        setError("Failed to fetch data");
      }
    } catch (err) {
      setError("Error connecting to the server");
      console.error("API fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPeopleData();
  }, [fetchPeopleData]);

  // Sync state with URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchQuery(params.get("query") || "");
    setSelectedLocation(params.get("location") || "All");
    setSelectedProfession(params.get("profession") || "All");
  }, [location.search]);

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("query", searchQuery);
    if (selectedLocation !== "All") params.set("location", selectedLocation);
    if (selectedProfession !== "All")
      params.set("profession", selectedProfession);
    navigate(`/searchPage/people?${params.toString()}`);
  }, [searchQuery, selectedLocation, selectedProfession, navigate]);

  const filteredPeople = useMemo(() => {
    return peopleData.filter((person) => {
      const matchesSearch =
        person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.profession?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        person.skills?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLocation =
        selectedLocation === "All" ||
        person.location.toLowerCase().includes(selectedLocation.toLowerCase());

      const matchesProfession =
        selectedProfession === "All" ||
        person.profession
          .toLowerCase()
          .includes(selectedProfession.toLowerCase());

      return matchesSearch && matchesLocation && matchesProfession;
    });
  }, [peopleData, searchQuery, selectedLocation, selectedProfession]);

  // Pagination
  const { currentPeople, totalPages } = useMemo(() => {
    const indexOfLastPerson = currentPage * peoplePerPage;
    const indexOfFirstPerson = indexOfLastPerson - peoplePerPage;
    const currentPeople = filteredPeople.slice(
      indexOfFirstPerson,
      indexOfLastPerson
    );
    const totalPages = Math.ceil(filteredPeople.length / peoplePerPage);

    return { currentPeople, totalPages };
  }, [filteredPeople, currentPage, peoplePerPage]);

  const handlePageChange = useCallback(
    (pageNumber) => {
      if (pageNumber < 1 || pageNumber > totalPages) return;
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [totalPages]
  );

  // Pagination range generator
  const paginationRange = useMemo(() => {
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
      if (totalPages > 1) {
        range.push(totalPages);
      }
    }

    return range;
  }, [totalPages, currentPage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl text-red-600 mb-4">{error}</h2>
        <button
          onClick={fetchPeopleData}
          className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="text-gray-600 text-center my-5 px-3 border-gray-200 p-2 border sm:w-[50%] mx-auto bg-gray-50">
        <span>
          <h1>People Search Results</h1>
        </span>
        <span className="text-sm">
          Showing {filteredPeople.length} results{" "}
          {searchQuery && `for "${searchQuery}"`}
        </span>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex">
        <div className="flex-1">
          {/* People Listings */}
          {filteredPeople.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {currentPeople.map((person) => (
                <PeopleCard key={person.id} person={person} />
              ))}
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-500 text-lg mb-4">
                No results found {searchQuery && `for "${searchQuery}"`}.
              </p>
              <p className="text-gray-500 mb-6">
                Try refining your search or check your spelling for better
                results.
              </p>
              <Link to={"/"}>
                <button className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                  Return to Home
                </button>
              </Link>
            </div>
          )}

          {/* Modern Pagination */}
          {totalPages > 1 && (
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

              {paginationRange.map((page, index) =>
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
      {/* <section className="max-w-5xl mx-auto mb-16">
        <FilterPeople showSearch={false} />
      </section> */}
    </>
  );
};

export default React.memo(PeopleSearchPage);

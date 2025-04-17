import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Mail,
  ExternalLink,
  Share2,
  Star,
  Phone,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import BusinessCard from "../Cards/BusinessCard";
import LoaddingSpinner from "../tools/LoaddingSpinner";
import backendURL from "../../config";

// Format business data to match BusinessCard expected props
const formatBusinessForCard = (businessItem) => {
  const business = businessItem.business || businessItem;

  return {
    id: business.id || Math.random().toString(36).substr(2, 9),
    name: business.business_name || "Unnamed Business",
    slug: business.slug || "undefined",
    address: business.business_address || "Not specified",
    category:
      business.category_slug || business.business_line || "Uncategorized",
    state: business.state || "Not Available",
    city: business.city || "",
    phone: business.contact_person_number || "No Contact",
    email: business.contact_person_email || "No Email",
    sinceDate: business.date_of_establishment || "N/A",
    rating: businessItem.average_rating || 0,
    reviews: businessItem.total_reviews || 0,
    views: business.views || 0,
    image: business.business_photos?.[0]?.photo_path || null,
    operationHours: business.operation_hours || "Not specified",
    verificationPercentage: business.verification_percentage || 0,
    branches: businessItem.total_branches || 0,
    awards: businessItem.total_awards || 0,
  };
};

const RecommendedBusinesses = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [businessesPerPage] = useState(6);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // const fetchBusinesses = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await fetch(`${backendURL}/api/lists/business`);
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }
  //     const data = await response.json();

  //     // Format each business before setting state
  //     const formattedBusinesses = (data.data || []).map(formatBusinessForCard);
  //     setBusinesses(formattedBusinesses);
  //   } catch (err) {
  //     setError(err.message);
  //     console.error("Error fetching businesses:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendURL}/api/lists/business`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      // Format and sort businesses by views (highest first), then limit to 20
      const formattedBusinesses = (data.data || [])
        .map(formatBusinessForCard)
        .sort((a, b) => (b.views || 0) - (a.views || 0)) // Sort by views descending
        .slice(0, 20); // Limit to top 20

      setBusinesses(formattedBusinesses);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching businesses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  // Use formatted businesses directly (no additional filtering needed)
  const filteredBusinesses = businesses;

  // Pagination logic
  const indexOfLastBusiness = currentPage * businessesPerPage;
  const indexOfFirstBusiness = indexOfLastBusiness - businessesPerPage;
  const currentBusinesses = filteredBusinesses.slice(
    indexOfFirstBusiness,
    indexOfLastBusiness
  );

  const totalPages = Math.ceil(filteredBusinesses.length / businessesPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleShare = (business) => {
    if (navigator.share) {
      navigator
        .share({
          title: business.name,
          text: `Check out ${business.name} on our platform!`,
          url: `https://edirect.ng/business/${business.slug}`,
        })
        .catch(console.error);
    } else {
      navigator.clipboard
        .writeText(`https://edirect.ng/business/${business.slug}`)
        .then(() => alert("Business link copied to clipboard!"));
    }
  };

  // Function to generate pagination range with ellipses
  const generatePaginationRange = () => {
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
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 max-w-2lg">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="animate-pulse rounded-lg shadow-md p-4 bg-white">
            <div className="h-40 bg-gray-300 rounded-md mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[200px] bg-gray-100">
        <div className="text-red-500">{error}</div>
        <button
          onClick={fetchBusinesses}
          className="ml-4 text-red-600 hover:text-red-800 underline">
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex">
      <div className="flex-1">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Recommended Businesses
          </h2>
          <Link
            to="/business"
            className="text-red-600 hover:text-red-700 font-medium flex items-center">
            View All
            <ExternalLink size={16} className="ml-1.5" />
          </Link>
        </div>

        {filteredBusinesses.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No recommended businesses found</p>
            <button
              onClick={fetchBusinesses}
              className="mt-4 text-red-600 hover:text-red-800 underline">
              Refresh
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {currentBusinesses.map((business) => (
                <BusinessCard
                  key={business.id}
                  business={business}
                  onShare={() => handleShare(business)}
                />
              ))}
            </div>

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
          </>
        )}
      </div>
      {/* Side Advertisements */}
      <div className="w-1/4 ml-4 Nlg:hidden">
        <div className="mt-8">
          <img
            src="https://via.placeholder.com/300x200"
            alt="Advertisement 1"
            className="w-full"
          />
        </div>
        <div className="mt-8">
          <img
            src="https://via.placeholder.com/300x200"
            alt="Advertisement 2"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default RecommendedBusinesses;

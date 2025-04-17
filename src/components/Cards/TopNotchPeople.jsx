import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ExternalLink, User, Briefcase } from "lucide-react";
import PeopleCard from "./PeopleCard";
import ADS from "../../assets/images/ads.jpg";
import backendURL from "../../config";

const TopNotchPeople = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch top profiles based on views
  const fetchTopNotchPeople = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendURL}/api/profiles`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data, "top notch people data");

      if (data.status === "success") {
        // Sort profiles by views in descending order and take the top 3
        const sortedProfiles = [...data.contacts]
          .sort((a, b) => (b.contact.views || 0) - (a.contact.views || 0))
          .slice(0, 6);
        setProfiles(sortedProfiles.map(formatProfileForCard));
      } else {
        throw new Error("Failed to fetch profiles");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching top-notch people:", err);
    } finally {
      setLoading(false);
    }
  };

  // Format profile data for PeopleCard
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
      verification_percentage: contact.verification_percentage || "0",
      location:
        contact.city && contact.state
          ? `${contact.city}, ${contact.state}`
          : contact.state || contact.city || "Not specified",
      email: contact.email || "",
      phone: contact.phone || "Not available",
      skills: contact.qualification || "",
      image: userPhoto || null,
    };
  };

  useEffect(() => {
    fetchTopNotchPeople();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header with View More Button */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Top Professionals
        </h2>
        <Link
          to="/people"
          className="text-red-600 hover:text-red-700 font-medium flex items-center mid:text-sm">
          View More
          <ExternalLink size={16} className="ml-1.5" />
        </Link>
      </div>

      {/* Main Content with Sidebar */}
      <div className="grid lg:grid-cols-[1fr,300px] gap-6 sm:gap-8">
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="font-medium">Error loading professionals</p>
              <p className="text-sm">{error}</p>
              <button
                onClick={fetchTopNotchPeople}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline">
                Try again
              </button>
            </div>
          ) : profiles.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <div className="text-gray-400 mb-4">
                <User size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No top professionals found
              </h3>
              <p className="text-gray-500">
                Currently no professionals available.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles.map((person) => (
                <PeopleCard key={person.id} person={person} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar for Ads */}
        <div className="hidden lg:block">
          <div className="sticky top-6">
            <img
              src={ADS}
              alt="Advertisement"
              className="rounded-lg border border-gray-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNotchPeople;

import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import backendURL from "../config";
import {
  Calendar,
  MapPin,
  Briefcase,
  Award,
  BookOpen,
  ArrowLeft,
  Share2,
  Loader,
  User,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { FacebookShareButton, TwitterShareButton } from "react-share";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { motion } from "framer-motion";

const SingleProminentPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedPeople, setRelatedPeople] = useState([]);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [copied, setCopied] = useState(false);
  const currentUrl = window.location.href;

  useEffect(() => {
    const fetchPersonDetails = async () => {
      try {
        setLoading(true);
        // Fetch the person's details
        const personResponse = await axios.get(
          `${backendURL}/api/prominent-people/${slug}`
        );
        const personData = personResponse.data.data;
        setPerson(personData);

        // Fetch related people by the same occupation
        if (personData?.occupation) {
          const relatedResponse = await axios.get(
            `${backendURL}/api/prominent-people`,
            {
              params: {
                occupation: personData.occupation, // Pass occupation as a query parameter
                limit: 4, // Limit to 4 results
              },
            }
          );

          // Filter out the current person (by slug) and limit to 3 related people
          const filteredRelated = relatedResponse.data.data
            .filter((p) => p.slug !== slug) // Exclude the current person
            .slice(0, 3); // Limit to 3 related people
          setRelatedPeople(filteredRelated);
          console.log("Related people:", filteredRelated); // Debug log
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to fetch person details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPersonDetails();
  }, [slug]);

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    try {
      return format(parseISO(dateString), "MMMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  const calculateAge = (birthDate, deathDate) => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const end = deathDate ? new Date(deathDate) : new Date();
    let age = end.getFullYear() - birth.getFullYear();
    const monthDiff = end.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader className="animate-spin h-12 w-12 text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center">
          {error}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="mr-2" size={16} />
          Back to previous page
        </button>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="py-12 text-gray-500">Person not found</div>
        <button
          onClick={() => navigate("/prominent-people")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          Browse Prominent People
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back button */}
      <motion.button
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}>
        <ArrowLeft className="mr-2" size={18} />
        Back to list
      </motion.button>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Hero section with image and basic info */}
        <div className="relative">
          <div className="h-72 md:h-96 lg:h-[32rem] bg-gray-100 overflow-hidden">
            {person.image_url ? (
              <img
                src={person.image_url}
                alt={person.name}
                className="w-full h-full  object-contain"
                loading="eager"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                <User className="h-24 w-24 text-gray-400" />
              </div>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 to-transparent p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-3 tracking-tight">
                  {person.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-white/90 text-lg">
                  {person.occupation && (
                    <span className="inline-flex items-center">
                      <Briefcase className="mr-2 h-5 w-5" />
                      {person.occupation}
                    </span>
                  )}
                  {person.nationality && (
                    <span className="inline-flex items-center">
                      <MapPin className="mr-2 h-5 w-5" />
                      {person.nationality}
                    </span>
                  )}
                  <span className="inline-flex items-center">
                    <Calendar className="mr-2 h-5 w-5" />
                    {person.birth_date &&
                      new Date(person.birth_date).getFullYear()}
                    {person.death_date &&
                      ` - ${new Date(person.death_date).getFullYear()}`}
                  </span>
                </div>
              </div>
              {/* Share button */}
              <div className="relative mt-4 md:mt-0">
                <motion.button
                  onClick={() => setShowShareOptions(!showShareOptions)}
                  className="p-3 bg-white/90 rounded-full shadow-lg hover:bg-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}>
                  <Share2 className="h-6 w-6 text-gray-800" />
                </motion.button>
                {showShareOptions && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-14 bg-white rounded-lg shadow-xl p-4 w-56 z-10 border border-gray-100">
                    <FacebookShareButton
                      url={currentUrl}
                      quote={`Learn about ${person.name}`}
                      className="w-full">
                      <div className="flex items-center px-3 py-2 hover:bg-gray-100 rounded text-sm font-medium text-gray-700">
                        Share on Facebook
                      </div>
                    </FacebookShareButton>
                    <TwitterShareButton
                      url={currentUrl}
                      title={`${person.name} - Prominent People`}
                      className="w-full">
                      <div className="flex items-center px-3 py-2 hover:bg-gray-100 rounded text-sm font-medium text-gray-700">
                        Share on Twitter
                      </div>
                    </TwitterShareButton>
                    <CopyToClipboard text={currentUrl} onCopy={handleCopy}>
                      <button className="w-full text-left flex items-center px-3 py-2 hover:bg-gray-100 rounded text-sm font-medium text-gray-700">
                        {copied ? "Copied!" : "Copy link"}
                      </button>
                    </CopyToClipboard>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed information */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 md:p-10">
          {/* Main content column */}
          <div className="lg:col-span-2">
            {/* Biography */}
            <section className="mb-10">
              <h2 className="text-3xl font-semibold text-gray-900 mb-5 flex items-center">
                <BookOpen className="mr-3 h-6 w-6 text-blue-600" />
                Biography
              </h2>
              <div
                className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: person.biography }}
              />
            </section>

            {/* Achievements */}
            {person.achievements && person.achievements.length > 0 && (
              <section className="mb-10">
                <h2 className="text-3xl font-semibold text-gray-900 mb-5 flex items-center">
                  <Award className="mr-3 h-6 w-6 text-blue-600" />
                  Notable Achievements
                </h2>
                <ul className="space-y-4">
                  {person.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-3 mt-1">•</span>
                      <span className="text-gray-700">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Sidebar with facts */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-xl p-6 sticky top-6 shadow-md">
              <h3 className="text-2xl font-semibold text-gray-900 mb-5">
                Quick Facts
              </h3>
              <div className="space-y-6">
                {/* Lifespan */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Lifespan
                  </h4>
                  <div className="flex items-center text-gray-700">
                    <Calendar className="mr-2 h-5 w-5 text-gray-500" />
                    {person.birth_date ? (
                      <>
                        {formatDate(person.birth_date)}
                        {person.death_date ? (
                          <>
                            {" - "}
                            {formatDate(person.death_date)}
                            <span className="ml-2 text-sm text-gray-500">
                              (Age{" "}
                              {calculateAge(
                                person.birth_date,
                                person.death_date
                              )}
                              )
                            </span>
                          </>
                        ) : (
                          <span className="ml-2 text-sm text-gray-500">
                            (Age {calculateAge(person.birth_date, null)})
                          </span>
                        )}
                      </>
                    ) : (
                      "Unknown"
                    )}
                  </div>
                </div>

                {/* Nationality */}
                {person.nationality && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      Nationality
                    </h4>
                    <div className="flex items-center text-gray-700">
                      <MapPin className="mr-2 h-5 w-5 text-gray-500" />
                      {person.nationality}
                    </div>
                  </div>
                )}

                {/* Occupation */}
                {person.occupation && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">
                      Primary Occupation
                    </h4>
                    <div className="flex items-center text-gray-700">
                      <Briefcase className="mr-2 h-5 w-5 text-gray-500" />
                      {person.occupation}
                    </div>
                  </div>
                )}

                {/* Status */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Status
                  </h4>
                  <div className="flex items-center">
                    <span
                      className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                        person.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                      {person.status === "approved"
                        ? "Verified"
                        : "Pending Review"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Related People */}
      {relatedPeople.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">
            {/* Other {person.occupation}s */}
            Other Related People
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedPeople.map((person) => (
              <Link
                key={person.slug}
                to={`/prominent-people/${person.slug}`}
                className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="h-40 bg-gray-100 overflow-hidden">
                  {person.image_url ? (
                    <img
                      src={person.image_url}
                      alt={person.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <User className="h-10 w-10 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-base text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {person.name}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                    {person.occupation}
                  </p>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span className="line-clamp-1">
                      {person.nationality || "N/A"}
                    </span>
                    <span>
                      {person.birth_date &&
                        new Date(person.birth_date).getFullYear()}
                      {person.death_date &&
                        ` - ${new Date(person.death_date).getFullYear()}`}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SingleProminentPage;

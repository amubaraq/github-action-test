// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import { useLocation, Link, useNavigate } from "react-router-dom";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import PeopleCardForSearch from "../components/Cards/PeopleCardForSearch";
// import BusinessCard from "../components/Cards/BusinessCard";
// import backendURL from "../config";
// import FilterUnified from "../components/FilterUnified";

// const UnifiedSearchPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const queryParams = new URLSearchParams(location.search);

//   // State initialization
//   const [searchQuery, setSearchQuery] = useState(
//     queryParams.get("query") || ""
//   );
//   const [selectedLocation, setSelectedLocation] = useState(
//     queryParams.get("location") || "All"
//   );
//   const [selectedCategory, setSelectedCategory] = useState(
//     queryParams.get("category") || "All"
//   );
//   const [sortOption, setSortOption] = useState("relevance");
//   const [data, setData] = useState({ people: [], businesses: [] });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 9;

//   // Fetch both people and business data
//   // Inside UnifiedSearchPage
//   const fetchData = useCallback(async () => {
//     setLoading(true);
//     try {
//       // Fetch people
//       const peopleResponse = await fetch(`${backendURL}/api/profiles`);
//       if (!peopleResponse.ok) throw new Error("Failed to fetch people data");
//       const peopleData = await peopleResponse.json();
//       console.log("People API Response:", peopleData);
//       let transformedPeople = [];
//       if (
//         peopleData.status === "success" &&
//         Array.isArray(peopleData.contacts)
//       ) {
//         transformedPeople = peopleData.contacts.map((entry) => {
//           const contact = entry.contact; // Access the nested contact object
//           return {
//             type: "people",
//             id: contact.id,
//             name:
//               `${contact.first_name || ""} ${contact.middle_name || ""} ${contact.last_name || ""}`.trim() ||
//               "Unnamed Person",
//             profession: contact.profession || "Not specified",
//             skills: contact.qualification || "",
//             location: {
//               state: contact.state || "",
//               city: contact.city || "",
//               area: "", // No area field in API
//               full:
//                 `${contact.city || ""}${contact.city && contact.state ? ", " : ""}${contact.state || ""}` ||
//                 "Not specified",
//             },
//             email: "", // Not provided by API
//             phone: contact.phone || "Not available",
//             slug: contact.slug || "undefined",
//             address: contact.address || "Not specified",
//             social_media_links: contact.social_media_links || {},
//             views: contact.views || 0,
//             gender: contact.gender || "",
//             religion: contact.religion || "",
//             qualification: contact.qualification || "",
//             marital_status: contact.marital_status || "",
//             last_place_of_work: contact.last_place_of_work || "",
//             verification_percentage: contact.verification_percentage || 0,
//             image:
//               entry.userPhoto && entry.userPhoto !== "No photo available"
//                 ? entry.userPhoto
//                 : null,
//           };
//         });
//       } else {
//         console.warn("People data is empty or malformed:", peopleData);
//       }

//       // Fetch businesses (unchanged)
//       const businessResponse = await fetch(`${backendURL}/api/lists/business`);
//       if (!businessResponse.ok)
//         throw new Error("Failed to fetch business data");
//       const businessData = await businessResponse.json();
//       console.log("Business API Response:", businessData);

//       // Inside the fetchData function
//       let transformedBusinesses = [];
//       if (
//         businessData.status === "success" &&
//         Array.isArray(businessData.data)
//       ) {
//         transformedBusinesses = businessData.data.map((item) => {
//           const business = item.business || item; // Handle nested structure
//           const socialMedia =
//             typeof business.social_media === "string"
//               ? JSON.parse(business.social_media || "{}")
//               : business.social_media || {};

//           return {
//             type: "business",
//             id: business.id,
//             name: business.business_name || "Unnamed Business",
//             slug: business.slug || "undefined",
//             phone: business.contact_person_number || "No Contact",
//             address: business.business_address || "Not specified",
//             category: business.business_line || "Uncategorized",
//             location: {
//               state: business.state || "",
//               city: business.city || "",
//               area: business.area || "",
//               full: `${business.city || ""}${business.city && business.state ? ", " : ""}${business.state || ""}`,
//             },
//             owner: {
//               email: business.business_email || "Not provided",
//               phone: business.contact_person_number || "Not available",
//               name: business.contact_person || "Not available",
//             },
//             sinceDate: business.date_of_establishment || "N/A",
//             rating: item.average_rating || 0,
//             reviews: item.total_reviews || 0,
//             views: business.views || 0,
//             image:
//               business.business_photos?.[0]?.photo_path ||
//               (Array.isArray(business.business_photos) &&
//                 business.business_photos[0]) ||
//               null,
//             operationHours: business.operation_hours || "Not specified",
//             socialMedia: socialMedia,
//             staffCount: business.number_of_staff || 0,
//             branches: item.total_branches || 0,
//             awards: item.total_awards || 0,
//             verificationPercentage: business.verification_percentage || 0,
//           };
//         });
//       } else {
//         console.warn("Business data is empty or malformed:", businessData);
//       }

//       setData({ people: transformedPeople, businesses: transformedBusinesses });
//       console.log("Transformed People:", transformedPeople);
//       console.log("Transformed Businesses:", transformedBusinesses);
//     } catch (err) {
//       setError(err.message);
//       console.error("Error fetching data:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   // Sync state with URL parameters
//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     setSearchQuery(params.get("query") || "");
//     setSelectedLocation(params.get("location") || "All");
//     setSelectedCategory(params.get("category") || "All");
//     setSortOption(params.get("sort") || "relevance");
//     setCurrentPage(1);
//   }, [location.search]);

//   const handleSearch = useCallback(() => {
//     const params = new URLSearchParams();
//     if (searchQuery) params.set("query", searchQuery);
//     if (selectedLocation !== "All") params.set("location", selectedLocation);
//     if (selectedCategory !== "All") params.set("category", selectedCategory);
//     if (sortOption !== "relevance") params.set("sort", sortOption);
//     navigate(`/searchPage?${params.toString()}`);
//   }, [searchQuery, selectedLocation, selectedCategory, sortOption, navigate]);

//   const filteredData = useMemo(() => {
//     const allItems = [
//       ...data.people.map((item) => ({ ...item, type: "people" })),
//       ...data.businesses.map((item) => ({ ...item, type: "business" })),
//     ];

//     return allItems.filter((item) => {
//       const query = searchQuery.toLowerCase();
//       const matchesSearch =
//         (item.name || "").toLowerCase().includes(query) ||
//         (item.profession || "").toLowerCase().includes(query) ||
//         (item.skills || "").toLowerCase().includes(query) ||
//         (item.address || "").toLowerCase().includes(query) ||
//         (item.category || "").toLowerCase().includes(query) ||
//         (item.location?.state || "").toLowerCase().includes(query) ||
//         (item.location?.city || "").toLowerCase().includes(query) ||
//         (item.location?.area || "").toLowerCase().includes(query) ||
//         (item.business_line || "").toLowerCase().includes(query);

//       const matchesLocation =
//         selectedLocation === "All" ||
//         (item.location?.state || "")
//           .toLowerCase()
//           .includes(selectedLocation.toLowerCase()) ||
//         (item.location?.city || "")
//           .toLowerCase()
//           .includes(selectedLocation.toLowerCase()) ||
//         (item.location?.area || "")
//           .toLowerCase()
//           .includes(selectedLocation.toLowerCase());

//       const matchesCategory =
//         selectedCategory === "All" ||
//         (item.category || item.profession || "")
//           .toLowerCase()
//           .includes(selectedCategory.toLowerCase());

//       return matchesSearch && matchesLocation && matchesCategory;
//     });
//   }, [data, searchQuery, selectedLocation, selectedCategory]);
//   // Sort data
//   const sortedData = useMemo(() => {
//     const sorted = [...filteredData];
//     if (sortOption === "views") {
//       sorted.sort((a, b) => b.views - a.views);
//     } else if (sortOption === "rating") {
//       sorted.sort((a, b) => {
//         // For businesses, use average_rating
//         const aRating = a.type === "business" ? a.rating : 0;
//         const bRating = b.type === "business" ? b.rating : 0;
//         return bRating - aRating;
//       });
//     } else if (sortOption === "relevance") {
//       // Default sorting - keep original order or implement relevance algorithm
//     }
//     return sorted;
//   }, [filteredData, sortOption]);

//   // Pagination
//   const { currentItems, totalPages } = useMemo(() => {
//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
//     const totalPages = Math.ceil(sortedData.length / itemsPerPage);
//     return { currentItems, totalPages };
//   }, [sortedData, currentPage, itemsPerPage]);

//   const handlePageChange = useCallback(
//     (pageNumber) => {
//       if (pageNumber < 1 || pageNumber > totalPages) return;
//       setCurrentPage(pageNumber);
//       window.scrollTo({ top: 0, behavior: "smooth" });
//     },
//     [totalPages]
//   );

//   // Pagination range
//   const paginationRange = useMemo(() => {
//     const range = [];
//     const maxVisiblePages = 5;
//     const ellipsis = "...";

//     if (totalPages <= maxVisiblePages) {
//       for (let i = 1; i <= totalPages; i++) range.push(i);
//     } else {
//       range.push(1);
//       if (currentPage > 3) range.push(ellipsis);
//       const start = Math.max(2, currentPage - 1);
//       const end = Math.min(totalPages - 1, currentPage + 1);
//       for (let i = start; i <= end; i++) range.push(i);
//       if (currentPage < totalPages - 2) range.push(ellipsis);
//       range.push(totalPages);
//     }
//     return range;
//   }, [totalPages, currentPage]);

//   return (
//     <>
//       <div className="text-gray-600 text-center my-5 px-3 border-gray-200 p-2 border sm:w-[50%] mx-auto bg-gray-50 rounded-lg shadow-sm">
//         <h1 className="text-xl font-semibold">Search Results</h1>
//         <span className="text-sm">
//           Showing {filteredData.length} results{" "}
//           {searchQuery && `for "${searchQuery}"`}
//         </span>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="flex flex-col lg:flex-row gap-8">
//           <div className="flex-1">
//             {loading && (
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//                 {[...Array(6)].map((_, index) => (
//                   <div
//                     key={index}
//                     className="bg-gray-100 rounded-lg p-4 animate-pulse">
//                     <div className="h-20 w-20 rounded-full bg-gray-300 mb-4 mx-auto"></div>
//                     <div className="h-4 bg-gray-300 rounded mb-2"></div>
//                     <div className="h-4 bg-gray-300 rounded mb-2"></div>
//                     <div className="h-4 bg-gray-300 rounded"></div>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {error && !loading && (
//               <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
//                 <p className="font-medium">Failed to load data</p>
//                 <p className="text-sm">{error}</p>
//                 <button
//                   onClick={() => fetchData()}
//                   className="mt-2 text-sm text-red-600 hover:text-red-800 underline">
//                   Try again
//                 </button>
//               </div>
//             )}

//             {!loading && !error && filteredData.length > 0 && (
//               <>
//                 <div className="flex justify-end mb-4">
//                   <select
//                     value={sortOption}
//                     onChange={(e) => {
//                       setSortOption(e.target.value);
//                       handleSearch();
//                     }}
//                     className="border border-gray-200 px-3 py-2 rounded-md text-sm text-gray-600 focus:outline-none">
//                     <option value="relevance">Sort by: Relevance</option>
//                     <option value="views">Sort by: Most Viewed</option>
//                     <option value="rating">
//                       Sort by: Highest Rated (Businesses)
//                     </option>
//                   </select>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//                   {currentItems.map((item) => (
//                     <div key={item.id} className="relative">
//                       {item.type === "people" ? (
//                         <PeopleCardForSearch person={item} />
//                       ) : (
//                         <BusinessCard business={item} />
//                       )}
//                       <span className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-full">
//                         {item.type === "people" ? "People" : "Business"}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </>
//             )}

//             {!loading && !error && filteredData.length === 0 && (
//               <div className="text-center py-12 bg-gray-50 rounded-lg shadow-md">
//                 <p className="text-gray-500 text-lg mb-4">
//                   No results found {searchQuery && `for "${searchQuery}"`}.
//                 </p>
//                 <p className="text-gray-500 mb-6">
//                   Try refining your search or check your spelling for better
//                   results.
//                 </p>
//                 <Link to="/">
//                   <button className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
//                     Return to Home
//                   </button>
//                 </Link>
//               </div>
//             )}

//             {!loading && !error && totalPages > 1 && (
//               <div className="flex justify-center items-center mt-8 space-x-2">
//                 <button
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   className={`p-2 rounded-full transition-colors ${
//                     currentPage === 1
//                       ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//                       : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                   }`}>
//                   <ChevronLeft size={18} />
//                 </button>

//                 {paginationRange.map((page, index) =>
//                   page === "..." ? (
//                     <span
//                       key={index}
//                       className="px-4 py-2 text-gray-600 cursor-default">
//                       {page}
//                     </span>
//                   ) : (
//                     <button
//                       key={index}
//                       onClick={() => handlePageChange(page)}
//                       className={`px-4 py-2 rounded-full transition-colors ${
//                         currentPage === page
//                           ? "bg-red-600 text-white"
//                           : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                       }`}>
//                       {page}
//                     </button>
//                   )
//                 )}

//                 <button
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                   className={`p-2 rounded-full transition-colors ${
//                     currentPage === totalPages
//                       ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//                       : "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                   }`}>
//                   <ChevronRight size={18} />
//                 </button>
//               </div>
//             )}
//           </div>

//           <div className="w-full lg:w-64">
//             <FilterUnified
//               searchQuery={searchQuery}
//               selectedLocation={selectedLocation}
//               selectedCategory={selectedCategory}
//               onSearchQueryChange={setSearchQuery}
//               onLocationChange={setSelectedLocation}
//               onCategoryChange={setSelectedCategory}
//               onSearch={handleSearch}
//             />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default UnifiedSearchPage;

// import React, { useState, useEffect, useMemo, useCallback } from "react";
// import { useLocation, Link, useNavigate } from "react-router-dom";
// import { ChevronLeft, ChevronRight, Search } from "lucide-react";
// import PeopleCardForSearch from "../components/Cards/PeopleCardForSearch";
// import BusinessCard from "../components/Cards/BusinessCard";
// import backendURL from "../config";
// import FilterUnified from "../components/FilterUnified";

// const UnifiedSearchPage = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const queryParams = new URLSearchParams(location.search);

//   // State initialization
//   const [searchQuery, setSearchQuery] = useState(
//     queryParams.get("query") || ""
//   );
//   const [selectedLocation, setSelectedLocation] = useState(
//     queryParams.get("location") || "All"
//   );
//   const [selectedCategory, setSelectedCategory] = useState(
//     queryParams.get("category") || "All"
//   );
//   const [sortOption, setSortOption] = useState(
//     queryParams.get("sort") || "relevance"
//   );
//   const [data, setData] = useState({ people: [], businesses: [] });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 9;

//   // Memoized data fetching
//   const fetchData = useCallback(async () => {
//     setLoading(true);
//     try {
//       // Parallel fetching for better performance
//       const [peopleResponse, businessResponse] = await Promise.all([
//         fetch(`${backendURL}/api/profiles`),
//         fetch(`${backendURL}/api/lists/business`),
//       ]);

//       if (!peopleResponse.ok || !businessResponse.ok) {
//         throw new Error("Failed to fetch data");
//       }

//       const [peopleData, businessData] = await Promise.all([
//         peopleResponse.json(),
//         businessResponse.json(),
//       ]);

//       // Transform people data
//       const transformedPeople =
//         peopleData.status === "success" && Array.isArray(peopleData.contacts)
//           ? peopleData.contacts.map(({ contact, userPhoto }) => ({
//               type: "people",
//               id: contact.id,
//               name:
//                 `${contact.first_name || ""} ${contact.middle_name || ""} ${contact.last_name || ""}`.trim() ||
//                 "Unnamed Person",
//               profession: contact.profession || "Not specified",
//               skills: contact.qualification || "",
//               location: {
//                 state: contact.state || "",
//                 city: contact.city || "",
//                 lga: contact.lga || "",
//                 full: `${contact.city || ""}${contact.city && contact.state ? ", " : ""}${contact.state || ""}`,
//               },
//               phone: contact.phone || "Not available",
//               slug: contact.slug || "undefined",
//               views: contact.views || 0,
//               verification_percentage: contact.verification_percentage || 0,
//               image:
//                 userPhoto && userPhoto !== "No photo available"
//                   ? userPhoto
//                   : null,
//             }))
//           : [];

//       // Transform business data
//       const transformedBusinesses =
//         businessData.status === "success" && Array.isArray(businessData.data)
//           ? businessData.data.map((item) => {
//               const business = item.business || item;
//               const socialMedia =
//                 typeof business.social_media === "string"
//                   ? JSON.parse(business.social_media || "{}")
//                   : business.social_media || {};

//               return {
//                 type: "business",
//                 id: business.id,
//                 name: business.business_name || "Unnamed Business",
//                 slug: business.slug || "undefined",
//                 phone: business.contact_person_number || "No Contact",
//                 address: business.business_address || "Not specified",
//                 category:
//                   business.business_line ||
//                   business.category_slug ||
//                   "Uncategorized",
//                 location: {
//                   state: business.state || "",
//                   city: business.city || "",
//                   lga: business.lga || "",
//                   full: `${business.city || ""}${business.city && business.state ? ", " : ""}${business.state || ""}`,
//                 },
//                 rating: item.average_rating || 0,
//                 reviews: item.total_reviews || 0,
//                 views: business.views || 0,
//                 image: business.business_photos?.[0]?.photo_path || null,
//                 verification_percentage: business.verification_percentage || 0,
//               };
//             })
//           : [];

//       setData({
//         people: transformedPeople,
//         businesses: transformedBusinesses,
//       });
//     } catch (err) {
//       setError(err.message);
//       console.error("Error fetching data:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   // Extract unique locations and categories for filters
//   const { locations, categories } = useMemo(() => {
//     const allLocations = new Set();
//     const allCategories = new Set();

//     data.people.forEach((person) => {
//       if (person.location.state) allLocations.add(person.location.state);
//       if (person.location.city) allLocations.add(person.location.city);
//       if (person.location.lga) allLocations.add(person.location.lga);
//       if (person.profession) allCategories.add(person.profession);
//     });

//     data.businesses.forEach((business) => {
//       if (business.location.state) allLocations.add(business.location.state);
//       if (business.location.city) allLocations.add(business.location.city);
//       if (business.location.lga) allLocations.add(business.location.lga);
//       if (business.category) allCategories.add(business.category);
//     });

//     return {
//       locations: ["All", ...Array.from(allLocations).sort()],
//       categories: ["All", ...Array.from(allCategories).sort()],
//     };
//   }, [data]);

//   // Handle search and filter updates
//   const updateSearchParams = useCallback(() => {
//     const params = new URLSearchParams();
//     if (searchQuery) params.set("query", searchQuery);
//     if (selectedLocation !== "All") params.set("location", selectedLocation);
//     if (selectedCategory !== "All") params.set("category", selectedCategory);
//     if (sortOption !== "relevance") params.set("sort", sortOption);
//     navigate(`/searchPage?${params.toString()}`, { replace: true });
//   }, [searchQuery, selectedLocation, selectedCategory, sortOption, navigate]);

//   // Debounced search effect
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       updateSearchParams();
//     }, 300);

//     return () => clearTimeout(timer);
//   }, [searchQuery, updateSearchParams]);

//   // Immediate filter/sort updates
//   useEffect(() => {
//     updateSearchParams();
//   }, [selectedLocation, selectedCategory, sortOption, updateSearchParams]);

//   // Filter and sort data
//   const { filteredData, sortedData } = useMemo(() => {
//     // Filtering
//     const filtered = [...data.people, ...data.businesses].filter((item) => {
//       const query = searchQuery.toLowerCase();
//       const matchesSearch =
//         query === "" ||
//         [
//           item.name,
//           item.profession || item.category,
//           item.skills || "",
//           item.address || "",
//           item.location.state,
//           item.location.city,
//           item.location.lga,
//         ].some((field) => field?.toLowerCase().includes(query));

//       const matchesLocation =
//         selectedLocation === "All" ||
//         [item.location.state, item.location.city, item.location.lga].some(
//           (field) => field?.toLowerCase() === selectedLocation.toLowerCase()
//         );

//       const matchesCategory =
//         selectedCategory === "All" ||
//         (item.type === "people"
//           ? item.profession?.toLowerCase() === selectedCategory.toLowerCase()
//           : item.category?.toLowerCase() === selectedCategory.toLowerCase());

//       return matchesSearch && matchesLocation && matchesCategory;
//     });

//     // Sorting
//     const sorted = [...filtered];
//     if (sortOption === "views") {
//       sorted.sort((a, b) => b.views - a.views);
//     } else if (sortOption === "rating") {
//       sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
//     } else if (sortOption === "relevance" && searchQuery) {
//       // Basic relevance sorting - prioritize matches in name over other fields
//       sorted.sort((a, b) => {
//         const aNameMatch = a.name
//           .toLowerCase()
//           .includes(searchQuery.toLowerCase());
//         const bNameMatch = b.name
//           .toLowerCase()
//           .includes(searchQuery.toLowerCase());
//         if (aNameMatch && !bNameMatch) return -1;
//         if (!aNameMatch && bNameMatch) return 1;
//         return 0;
//       });
//     }

//     return { filteredData: filtered, sortedData: sorted };
//   }, [data, searchQuery, selectedLocation, selectedCategory, sortOption]);

//   // Pagination
//   const { currentItems, totalPages } = useMemo(() => {
//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     return {
//       currentItems: sortedData.slice(indexOfFirstItem, indexOfLastItem),
//       totalPages: Math.ceil(sortedData.length / itemsPerPage),
//     };
//   }, [sortedData, currentPage, itemsPerPage]);

//   const handlePageChange = useCallback((page) => {
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }, []);

//   // Optimized pagination range calculation
//   const paginationRange = useMemo(() => {
//     const range = [];
//     const maxVisible = 5;
//     const ellipsis = "...";

//     if (totalPages <= maxVisible) {
//       for (let i = 1; i <= totalPages; i++) range.push(i);
//     } else {
//       const start = Math.max(2, currentPage - 1);
//       const end = Math.min(totalPages - 1, currentPage + 1);

//       range.push(1);
//       if (start > 2) range.push(ellipsis);
//       for (let i = start; i <= end; i++) range.push(i);
//       if (end < totalPages - 1) range.push(ellipsis);
//       range.push(totalPages);
//     }
//     return range;
//   }, [totalPages, currentPage]);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Search Header */}
//       <div className="bg-white shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <h1 className="text-2xl font-bold text-gray-900">
//               {searchQuery
//                 ? `Results for "${searchQuery}"`
//                 : "Browse Directory"}
//             </h1>
//             <div className="relative w-full md:w-96">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Search className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm"
//                 placeholder="Search people or businesses..."
//                 value={searchQuery}
//                 onChange={(e) => {
//                   setSearchQuery(e.target.value);
//                   setCurrentPage(1);
//                 }}
//               />
//             </div>
//           </div>
//           <div className="mt-4 text-sm text-gray-600">
//             Showing {sortedData.length} results
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Results Section */}
//           <div className="flex-1">
//             {/* Loading State */}
//             {loading && (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {[...Array(itemsPerPage)].map((_, i) => (
//                   <div
//                     key={i}
//                     className="bg-white rounded-lg shadow p-4 animate-pulse">
//                     <div className="h-40 bg-gray-200 rounded mb-4"></div>
//                     <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
//                     <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* Error State */}
//             {error && !loading && (
//               <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
//                 <div className="flex">
//                   <div className="flex-shrink-0">
//                     <svg
//                       className="h-5 w-5 text-red-400"
//                       fill="currentColor"
//                       viewBox="0 0 20 20">
//                       <path
//                         fillRule="evenodd"
//                         d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                   </div>
//                   <div className="ml-3">
//                     <p className="text-sm text-red-700">
//                       Error loading data: {error}.{" "}
//                       <button
//                         onClick={fetchData}
//                         className="font-medium underline hover:text-red-600">
//                         Try again
//                       </button>
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Results Grid */}
//             {!loading && !error && (
//               <>
//                 {sortedData.length > 0 ? (
//                   <>
//                     <div className="flex justify-between items-center mb-6">
//                       <div className="text-sm text-gray-500">
//                         Page {currentPage} of {totalPages}
//                       </div>
//                       <div className="flex items-center space-x-2">
//                         <label htmlFor="sort" className="text-sm text-gray-600">
//                           Sort by:
//                         </label>
//                         <select
//                           id="sort"
//                           value={sortOption}
//                           onChange={(e) => setSortOption(e.target.value)}
//                           className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
//                           <option value="relevance">Relevance</option>
//                           <option value="views">Most Viewed</option>
//                           <option value="rating">Highest Rated</option>
//                         </select>
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                       {currentItems.map((item) => (
//                         <div
//                           key={`${item.type}-${item.id}`}
//                           className="relative">
//                           {item.type === "people" ? (
//                             <PeopleCardForSearch person={item} />
//                           ) : (
//                             <BusinessCard business={item} />
//                           )}
//                           <span className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-full">
//                             {item.type === "people" ? "Person" : "Business"}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </>
//                 ) : (
//                   <div className="text-center py-12 bg-white rounded-lg shadow">
//                     <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
//                       <Search className="w-full h-full" />
//                     </div>
//                     <h3 className="text-lg font-medium text-gray-900 mb-2">
//                       No results found
//                     </h3>
//                     <p className="text-gray-500 mb-6">
//                       Try adjusting your search or filters to find what you're
//                       looking for.
//                     </p>
//                     <button
//                       onClick={() => {
//                         setSearchQuery("");
//                         setSelectedLocation("All");
//                         setSelectedCategory("All");
//                       }}
//                       className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
//                       Clear all filters
//                     </button>
//                   </div>
//                 )}
//               </>
//             )}

//             {/* Pagination */}
//             {!loading && totalPages > 1 && (
//               <div className="mt-8 flex items-center justify-between">
//                 <div className="flex-1 flex justify-between sm:hidden">
//                   <button
//                     onClick={() => handlePageChange(currentPage - 1)}
//                     disabled={currentPage === 1}
//                     className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
//                     Previous
//                   </button>
//                   <button
//                     onClick={() => handlePageChange(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                     className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
//                     Next
//                   </button>
//                 </div>
//                 <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center">
//                   <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
//                     <button
//                       onClick={() => handlePageChange(currentPage - 1)}
//                       disabled={currentPage === 1}
//                       className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
//                       <ChevronLeft className="h-5 w-5" />
//                     </button>
//                     {paginationRange.map((page, index) =>
//                       page === "..." ? (
//                         <span
//                           key={`ellipsis-${index}`}
//                           className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
//                           ...
//                         </span>
//                       ) : (
//                         <button
//                           key={page}
//                           onClick={() => handlePageChange(page)}
//                           className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                             currentPage === page
//                               ? "z-10 bg-red-50 border-red-500 text-red-600"
//                               : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
//                           }`}>
//                           {page}
//                         </button>
//                       )
//                     )}
//                     <button
//                       onClick={() => handlePageChange(currentPage + 1)}
//                       disabled={currentPage === totalPages}
//                       className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
//                       <ChevronRight className="h-5 w-5" />
//                     </button>
//                   </nav>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Filters Sidebar */}
//           <div className="lg:w-80">
//             <FilterUnified
//               searchQuery={searchQuery}
//               selectedLocation={selectedLocation}
//               selectedCategory={selectedCategory}
//               locations={locations}
//               categories={categories}
//               onSearchQueryChange={setSearchQuery}
//               onLocationChange={(location) => {
//                 setSelectedLocation(location);
//                 setCurrentPage(1);
//               }}
//               onCategoryChange={(category) => {
//                 setSelectedCategory(category);
//                 setCurrentPage(1);
//               }}
//               onClearFilters={() => {
//                 setSearchQuery("");
//                 setSelectedLocation("All");
//                 setSelectedCategory("All");
//                 setCurrentPage(1);
//               }}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UnifiedSearchPage;
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import PeopleCardForSearch from "../components/Cards/PeopleCardForSearch";
import BusinessCard from "../components/Cards/BusinessCard";
import backendURL from "../config";
import FilterUnified from "../components/FilterUnified";

const UnifiedSearchPage = () => {
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
  const [selectedCategory, setSelectedCategory] = useState(
    queryParams.get("category") || "All"
  );
  const [sortOption, setSortOption] = useState(
    queryParams.get("sort") || "relevance"
  );
  const [data, setData] = useState({ people: [], businesses: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Normalization function for consistent comparison
  const normalizeString = (str) => {
    if (!str) return "";
    return str
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");
  };

  // Fetch data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [peopleResponse, businessResponse] = await Promise.all([
        fetch(`${backendURL}/api/profiles`),
        fetch(`${backendURL}/api/lists/business`),
      ]);

      if (!peopleResponse.ok || !businessResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const [peopleData, businessData] = await Promise.all([
        peopleResponse.json(),
        businessResponse.json(),
      ]);

      // Transform people data
      const transformedPeople =
        peopleData.status === "success" && Array.isArray(peopleData.contacts)
          ? peopleData.contacts.map(({ contact, userPhoto }) => ({
              type: "people",
              id: contact.id,
              name:
                `${contact.first_name || ""} ${contact.middle_name || ""} ${contact.last_name || ""}`.trim() ||
                "Unnamed Person",
              profession: contact.profession || "Not specified",
              skills: contact.qualification || "",
              location: {
                state: contact.state || "",
                city: contact.city || "",
                lga: contact.lga || "",
                full: `${contact.city || ""}${contact.city && contact.state ? ", " : ""}${contact.state || ""}`,
              },
              phone: contact.phone || "Not available",
              slug: contact.slug || "undefined",
              views: contact.views || 0,
              verification_percentage: contact.verification_percentage || 0,
              image:
                userPhoto && userPhoto !== "No photo available"
                  ? userPhoto
                  : null,
            }))
          : [];

      // Transform business data with proper category_slug handling
      const transformedBusinesses =
        businessData.status === "success" && Array.isArray(businessData.data)
          ? businessData.data.map((item) => {
              const business = item.business || item;
              const socialMedia =
                typeof business.social_media === "string"
                  ? JSON.parse(business.social_media || "{}")
                  : business.social_media || {};

              return {
                type: "business",
                id: business.id,
                name: business.business_name || "Unnamed Business",
                slug: business.slug || "undefined",
                phone: business.contact_person_number || "No Contact",
                email: business.contact_person_email || "No Email",
                address: business.business_address || "Not specified",
                category: business.category_slug || "uncategorized", // Using category_slug as primary
                business_line: business.business_line || "", // Keep business_line for display
                location: {
                  state: business.state || "",
                  city: business.city || "",
                  lga: business.lga || "",
                  full: `${business.city || ""}${business.city && business.state ? ", " : ""}${business.state || ""}`,
                },
                rating: item.average_rating || 0,
                reviews: item.total_reviews || 0,
                views: business.views || 0,
                image: business.business_photos?.[0]?.photo_path || null,
                verification_percentage: business.verification_percentage || 0,
              };
            })
          : [];

      setData({
        people: transformedPeople,
        businesses: transformedBusinesses,
      });
    } catch (err) {
      setError(err.message);
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Extract unique locations and categories for filters
  const { locations, categories } = useMemo(() => {
    const allLocations = new Set();
    const allCategories = new Set();

    // Add people professions
    data.people.forEach((person) => {
      if (person.location.state) allLocations.add(person.location.state);
      if (person.location.city) allLocations.add(person.location.city);
      if (person.location.lga) allLocations.add(person.location.lga);
      if (person.profession)
        allCategories.add(normalizeString(person.profession));
    });

    // Add business categories (using category_slug)
    data.businesses.forEach((business) => {
      if (business.location.state) allLocations.add(business.location.state);
      if (business.location.city) allLocations.add(business.location.city);
      if (business.location.lga) allLocations.add(business.location.lga);
      if (business.category)
        allCategories.add(normalizeString(business.category));
    });

    return {
      locations: ["All", ...Array.from(allLocations).sort()],
      categories: ["All", ...Array.from(allCategories).sort()],
    };
  }, [data]);

  // Update URL parameters
  const updateSearchParams = useCallback(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("query", searchQuery);
    if (selectedLocation !== "All") params.set("location", selectedLocation);
    if (selectedCategory !== "All") params.set("category", selectedCategory);
    if (sortOption !== "relevance") params.set("sort", sortOption);
    navigate(`/searchPage?${params.toString()}`, { replace: true });
  }, [searchQuery, selectedLocation, selectedCategory, sortOption, navigate]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      updateSearchParams();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, updateSearchParams]);

  // Immediate filter/sort updates
  useEffect(() => {
    updateSearchParams();
  }, [selectedLocation, selectedCategory, sortOption, updateSearchParams]);

  // Filter and sort data
  const { filteredData, sortedData } = useMemo(() => {
    // Filtering
    const filtered = [...data.people, ...data.businesses].filter((item) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        query === "" ||
        [
          item.name,
          item.profession || item.business_line || item.category,
          item.skills || "",
          item.address || "",
          item.location.state,
          item.location.city,
          item.location.lga,
        ].some((field) => field?.toLowerCase().includes(query));

      const matchesLocation =
        selectedLocation === "All" ||
        [item.location.state, item.location.city, item.location.lga].some(
          (field) => field?.toLowerCase() === selectedLocation.toLowerCase()
        );

      // Category matching using normalized values
      const matchesCategory =
        selectedCategory === "All" ||
        (item.type === "people"
          ? normalizeString(item.profession) ===
            normalizeString(selectedCategory)
          : normalizeString(item.category) ===
            normalizeString(selectedCategory));

      return matchesSearch && matchesLocation && matchesCategory;
    });

    // Sorting
    const sorted = [...filtered];
    if (sortOption === "views") {
      sorted.sort((a, b) => b.views - a.views);
    } else if (sortOption === "rating") {
      sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortOption === "relevance" && searchQuery) {
      // Basic relevance sorting
      sorted.sort((a, b) => {
        const aNameMatch = a.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const bNameMatch = b.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        if (aNameMatch && !bNameMatch) return -1;
        if (!aNameMatch && bNameMatch) return 1;
        return 0;
      });
    }

    return { filteredData: filtered, sortedData: sorted };
  }, [data, searchQuery, selectedLocation, selectedCategory, sortOption]);

  // Pagination
  const { currentItems, totalPages } = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return {
      currentItems: sortedData.slice(indexOfFirstItem, indexOfLastItem),
      totalPages: Math.ceil(sortedData.length / itemsPerPage),
    };
  }, [sortedData, currentPage, itemsPerPage]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Pagination range
  const paginationRange = useMemo(() => {
    const range = [];
    const maxVisible = 5;
    const ellipsis = "...";

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) range.push(i);
    } else {
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      range.push(1);
      if (start > 2) range.push(ellipsis);
      for (let i = start; i <= end; i++) range.push(i);
      if (end < totalPages - 1) range.push(ellipsis);
      range.push(totalPages);
    }
    return range;
  }, [totalPages, currentPage]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {searchQuery
                ? `Results for "${searchQuery}"`
                : "Browse Directory"}
            </h1>
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                placeholder="Search people or businesses..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Showing {sortedData.length} results
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Results Section */}
          <div className="flex-1">
            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(itemsPerPage)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg shadow p-4 animate-pulse">
                    <div className="h-40 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      fill="currentColor"
                      viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      Error loading data: {error}.{" "}
                      <button
                        onClick={fetchData}
                        className="font-medium underline hover:text-red-600">
                        Try again
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Results Grid */}
            {!loading && !error && (
              <>
                {sortedData.length > 0 ? (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <div className="text-sm text-gray-500">
                        Page {currentPage} of {totalPages}
                      </div>
                      <div className="flex items-center space-x-2">
                        <label htmlFor="sort" className="text-sm text-gray-600">
                          Sort by:
                        </label>
                        <select
                          id="sort"
                          value={sortOption}
                          onChange={(e) => setSortOption(e.target.value)}
                          className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-500">
                          <option value="relevance">Relevance</option>
                          <option value="views">Most Viewed</option>
                          <option value="rating">Highest Rated</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {currentItems.map((item) => (
                        <div
                          key={`${item.type}-${item.id}`}
                          className="relative">
                          {item.type === "people" ? (
                            <PeopleCardForSearch person={item} />
                          ) : (
                            <BusinessCard
                              business={{
                                ...item,
                                // For display purposes, show business_line if available, otherwise category
                                displayCategory:
                                  item.business_line || item.category,
                              }}
                            />
                          )}
                          <span className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded-full">
                            {item.type === "people" ? "Person" : "Business"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 bg-white rounded-lg shadow">
                    <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                      <Search className="w-full h-full" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No results found
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Try adjusting your search or filters to find what you're
                      looking for.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedLocation("All");
                        setSelectedCategory("All");
                      }}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                      Clear all filters
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Previous
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-center">
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    {paginationRange.map((page, index) =>
                      page === "..." ? (
                        <span
                          key={`ellipsis-${index}`}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                          ...
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === page
                              ? "z-10 bg-red-50 border-red-500 text-red-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}>
                          {page}
                        </button>
                      )
                    )}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            )}
          </div>

          {/* Filters Sidebar */}
          <div className="lg:w-80">
            <FilterUnified
              searchQuery={searchQuery}
              selectedLocation={selectedLocation}
              selectedCategory={selectedCategory}
              locations={locations}
              categories={categories}
              onSearchQueryChange={setSearchQuery}
              onLocationChange={(location) => {
                setSelectedLocation(location);
                setCurrentPage(1);
              }}
              onCategoryChange={(category) => {
                setSelectedCategory(category);
                setCurrentPage(1);
              }}
              onClearFilters={() => {
                setSearchQuery("");
                setSelectedLocation("All");
                setSelectedCategory("All");
                setCurrentPage(1);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnifiedSearchPage;

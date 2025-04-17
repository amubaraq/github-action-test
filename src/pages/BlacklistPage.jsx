// import React, { useState, useEffect } from "react";
// import { ChevronLeft, ChevronRight, Search, AlertTriangle } from "lucide-react";
// import {
//   PeopleBlacklistCard,
//   BusinessBlacklistCard,
// } from "../components/Cards/blackListCard";
// import backendURL from "../config";
// import blacklistImage from "../assets/images/blacklist.jpg";

// const BlacklistPage = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(12);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [viewType, setViewType] = useState("businesses");
//   const [blacklistedPeople, setBlacklistedPeople] = useState([]);
//   const [blacklistedBusinesses, setBlacklistedBusinesses] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchBlacklistData = async () => {
//       try {
//         setError(null);
//         let response, data;

//         if (viewType === "businesses") {
//           response = await fetch(`${backendURL}/api/lists/business`);
//           if (!response.ok) throw new Error("Failed to fetch businesses");
//           data = await response.json();
//           setBlacklistedBusinesses(
//             data.data.filter((b) => b.status === "blacklisted") || []
//           );
//           setBlacklistedPeople([]); // Clear people data when switching
//         } else {
//           response = await fetch(`${backendURL}/api/profiles`);
//           if (!response.ok) throw new Error("Failed to fetch profiles");
//           data = await response.json();
//           setBlacklistedPeople(
//             data.contacts?.filter((c) => c.contact.status === "blacklisted") ||
//               []
//           );
//           setBlacklistedBusinesses([]); // Clear business data when switching
//         }
//       } catch (err) {
//         setError(err.message);
//         setBlacklistedPeople([]);
//         setBlacklistedBusinesses([]);
//       }
//     };

//     fetchBlacklistData();
//     setCurrentPage(1);
//   }, [viewType]);

//   const currentData =
//     viewType === "businesses" ? blacklistedBusinesses : blacklistedPeople;

//   const filteredEntities = currentData.filter((entity) => {
//     const name =
//       viewType === "businesses"
//         ? entity.business_name
//         : `${entity.contact?.first_name} ${entity.contact?.last_name || ""}`.trim();
//     return name?.toLowerCase().includes(searchQuery.toLowerCase());
//   });

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredEntities.slice(
//     indexOfFirstItem,
//     indexOfLastItem
//   );
//   const totalPages = Math.ceil(filteredEntities.length / itemsPerPage);

//   const handlePageChange = (pageNumber) => {
//     if (pageNumber < 1 || pageNumber > totalPages) return;
//     setCurrentPage(pageNumber);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const generatePaginationRange = () => {
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
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="relative h-96">
//         <div
//           className="absolute inset-0 bg-contain bg-center filter blur-sm"
//           style={{ backgroundImage: `url(${blacklistImage})` }}>
//           <div className="absolute inset-0 bg-black/50" />
//         </div>

//         <div className="absolute inset-0 flex items-center justify-center">
//           <div className="text-center text-white max-w-4xl px-4">
//             <AlertTriangle className="h-16 w-16 mx-auto mb-6 text-red-500" />
//             <h1 className="text-4xl md:text-5xl font-bold mb-4">
//               Blacklist Registry
//             </h1>
//             <p className="text-lg md:text-xl mb-8">
//               Official registry of blacklisted entities
//             </p>
//             <div className="bg-red-100/20 p-4 rounded-lg">
//               <p className="text-sm">
//                 Last updated: {new Date().toLocaleDateString()} | Total entries:{" "}
//                 {filteredEntities.length}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="mb-8 bg-white rounded-xl p-6 shadow-sm">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//             <div className="relative">
//               <input
//                 type="text"
//                 placeholder={`Search blacklisted ${viewType}...`}
//                 className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//               />
//               <Search className="absolute left-4 top-3.5 text-gray-400" />
//             </div>
//             <div className="flex space-x-4">
//               <button
//                 onClick={() => setViewType("businesses")}
//                 className={`flex-1 py-3 rounded-lg ${
//                   viewType === "businesses"
//                     ? "bg-red-600 text-white"
//                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                 }`}>
//                 Businesses
//               </button>
//               <button
//                 onClick={() => setViewType("people")}
//                 className={`flex-1 py-3 rounded-lg ${
//                   viewType === "people"
//                     ? "bg-red-600 text-white"
//                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                 }`}>
//                 People
//               </button>
//             </div>
//           </div>
//           {error && <p className="text-red-500 text-center">{error}</p>}
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
//           {currentItems.length > 0 ? (
//             currentItems.map((entity) =>
//               viewType === "businesses" ? (
//                 <BusinessBlacklistCard key={entity.id} business={entity} />
//               ) : (
//                 <PeopleBlacklistCard
//                   key={entity.contact?.id}
//                   person={entity.contact}
//                 />
//               )
//             )
//           ) : (
//             <div className="col-span-full text-center py-8 text-gray-600">
//               No blacklisted {viewType} found
//             </div>
//           )}
//         </div>

//         {totalPages > 1 && currentItems.length > 0 && (
//           <div className="bg-white p-6 rounded-xl shadow-sm">
//             <div className="flex justify-center items-center space-x-2">
//               <button
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className={`p-2 rounded-full ${
//                   currentPage === 1
//                     ? "bg-gray-100 text-gray-400"
//                     : "bg-red-50 text-red-600 hover:bg-red-100"
//                 }`}>
//                 <ChevronLeft size={20} />
//               </button>
//               {generatePaginationRange().map((page, index) =>
//                 page === "..." ? (
//                   <span key={index} className="px-4 py-2 text-gray-500">
//                     •••
//                   </span>
//                 ) : (
//                   <button
//                     key={index}
//                     onClick={() => handlePageChange(page)}
//                     className={`px-4 py-2 rounded-full ${
//                       currentPage === page
//                         ? "bg-red-600 text-white"
//                         : "bg-red-50 text-red-600 hover:bg-red-100"
//                     }`}>
//                     {page}
//                   </button>
//                 )
//               )}
//               <button
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className={`p-2 rounded-full ${
//                   currentPage === totalPages
//                     ? "bg-gray-100 text-gray-400"
//                     : "bg-red-50 text-red-600 hover:bg-red-100"
//                 }`}>
//                 <ChevronRight size={20} />
//               </button>
//             </div>
//           </div>
//         )}

//         <div className="mt-8 p-6 bg-red-50 rounded-xl text-center text-sm text-red-700">
//           <p>
//             This blacklist is maintained for consumer protection purposes.
//             Listings are updated daily from verified sources.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BlacklistPage;
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight, Search, AlertTriangle } from "lucide-react";
import {
  PeopleBlacklistCard,
  BusinessBlacklistCard,
} from "../components/Cards/blackListCard";
import backendURL from "../config";
import blacklistImage from "../assets/images/blacklist.jpg";

const BlacklistPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewType, setViewType] = useState("businesses");
  const [blacklistedPeople, setBlacklistedPeople] = useState([]);
  const [blacklistedBusinesses, setBlacklistedBusinesses] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch data only once on component mount
  useEffect(() => {
    const fetchBlacklistData = async () => {
      setIsLoading(true);
      try {
        setError(null);

        // Fetch businesses
        const businessResponse = await fetch(
          `${backendURL}/api/lists/business`
        );
        if (!businessResponse.ok) throw new Error("Failed to fetch businesses");
        const businessData = await businessResponse.json();
        setBlacklistedBusinesses(
          businessData.data.filter((b) => b.status === "blacklisted") || []
        );

        // Fetch people
        const peopleResponse = await fetch(`${backendURL}/api/profiles`);
        if (!peopleResponse.ok) throw new Error("Failed to fetch profiles");
        const peopleData = await peopleResponse.json();
        setBlacklistedPeople(
          peopleData.contacts?.filter(
            (c) => c.contact.status === "blacklisted"
          ) || []
        );
      } catch (err) {
        setError(err.message);
        setBlacklistedPeople([]);
        setBlacklistedBusinesses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlacklistData();
  }, []); // Empty dependency array means it runs only once on mount

  // Memoize the current data based on viewType
  const currentData = useMemo(() => {
    return viewType === "businesses"
      ? blacklistedBusinesses
      : blacklistedPeople;
  }, [viewType, blacklistedBusinesses, blacklistedPeople]);

  // Debounced search handler
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    const timeoutId = setTimeout(() => {
      setSearchQuery(value);
      setCurrentPage(1); // Reset to first page on search
    }, 300); // 300ms debounce
    return () => clearTimeout(timeoutId); // Cleanup
  }, []);

  // Memoize filtered entities
  const filteredEntities = useMemo(() => {
    return currentData.filter((entity) => {
      const name =
        viewType === "businesses"
          ? entity.business_name
          : `${entity.contact?.first_name} ${entity.contact?.last_name || ""}`.trim();
      return name?.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [currentData, searchQuery, viewType]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = useMemo(() => {
    return filteredEntities.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredEntities, indexOfFirstItem, indexOfLastItem]);
  const totalPages = Math.ceil(filteredEntities.length / itemsPerPage);

  const handlePageChange = useCallback(
    (pageNumber) => {
      if (pageNumber < 1 || pageNumber > totalPages) return;
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [totalPages]
  );

  const generatePaginationRange = useCallback(() => {
    const range = [];
    const maxVisiblePages = 5;
    const ellipsis = "...";

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) range.push(i);
    } else {
      range.push(1);
      if (currentPage > 3) range.push(ellipsis);
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) range.push(i);
      if (currentPage < totalPages - 2) range.push(ellipsis);
      range.push(totalPages);
    }
    return range;
  }, [currentPage, totalPages]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-96">
        <div
          className="absolute inset-0 bg-contain bg-center filter blur-sm"
          style={{ backgroundImage: `url(${blacklistImage})` }}>
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-4">
            <AlertTriangle className="h-16 w-16 mx-auto mb-6 text-red-500" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Blacklist Registry
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Official registry of blacklisted entities
            </p>
            <div className="bg-red-100/20 p-4 rounded-lg">
              <p className="text-sm">
                Last updated: {new Date().toLocaleDateString()} | Total entries:{" "}
                {filteredEntities.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 bg-white rounded-xl p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder={`Search blacklisted ${viewType}...`}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                onChange={handleSearchChange}
              />
              <Search className="absolute left-4 top-3.5 text-gray-400" />
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setViewType("businesses")}
                className={`flex-1 py-3 rounded-lg ${
                  viewType === "businesses"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}>
                Businesses
              </button>
              <button
                onClick={() => setViewType("people")}
                className={`flex-1 py-3 rounded-lg ${
                  viewType === "people"
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}>
                People
              </button>
            </div>
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {isLoading && <p className="text-center text-gray-600">Loading...</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {currentItems.length > 0 ? (
            currentItems.map((entity) =>
              viewType === "businesses" ? (
                <BusinessBlacklistCard key={entity.id} business={entity} />
              ) : (
                <PeopleBlacklistCard
                  key={entity.contact?.id}
                  person={entity.contact}
                />
              )
            )
          ) : (
            <div className="col-span-full text-center py-8 text-gray-600">
              No blacklisted {viewType} found
            </div>
          )}
        </div>

        {totalPages > 1 && currentItems.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-full ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400"
                    : "bg-red-50 text-red-600 hover:bg-red-100"
                }`}>
                <ChevronLeft size={20} />
              </button>
              {generatePaginationRange().map((page, index) =>
                page === "..." ? (
                  <span key={index} className="px-4 py-2 text-gray-500">
                    •••
                  </span>
                ) : (
                  <button
                    key={index}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 rounded-full ${
                      currentPage === page
                        ? "bg-red-600 text-white"
                        : "bg-red-50 text-red-600 hover:bg-red-100"
                    }`}>
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-full ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400"
                    : "bg-red-50 text-red-600 hover:bg-red-100"
                }`}>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 p-6 bg-red-50 rounded-xl text-center text-sm text-red-700">
          <p>
            This blacklist is maintained for consumer protection purposes.
            Listings are updated daily from verified sources.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlacklistPage;

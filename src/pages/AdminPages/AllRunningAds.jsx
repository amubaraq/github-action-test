// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { useSelector } from "react-redux";
// import {
//   FaSearch,
//   FaChevronLeft,
//   FaChevronRight,
//   FaFilter,
//   FaAd,
//   FaClock,
//   FaMoneyBillWave,
// } from "react-icons/fa";
// import { Alert, AlertDescription } from "../../components/tools/Alert";
// import backendURL from "../../config";

// const AllRunningAds = () => {
//   const [ads, setAds] = useState([]);
//   const [filteredAds, setFilteredAds] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [typeFilter, setTypeFilter] = useState("all");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [showAlert, setShowAlert] = useState(false);
//   const { token } = useSelector((state) => state.auth);

//   const [alertConfig, setAlertConfig] = useState({
//     variant: "default",
//     message: "",
//   });

//   // Fetch running ads from API
//   useEffect(() => {
//     const fetchRunningAds = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await fetch(
//           `${backendURL}/api/ads/running?page=${currentPage}`,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         const data = await response.json();

//         if (data.status === "success") {
//           setAds(data.data);
//           setFilteredAds(data.data);
//           setTotalPages(Math.ceil(data.data.length / 10)); // Assuming 10 ads per page; adjust if API provides pagination data
//         } else {
//           setError(data.message || "Failed to fetch running ads");
//         }
//       } catch (err) {
//         setError("An error occurred while fetching running ads");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRunningAds();
//   }, [currentPage, token]);

//   // Search and filter functionality
//   useEffect(() => {
//     let result = [...ads];
//     if (searchTerm) {
//       result = result.filter(
//         (ad) =>
//           ad.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           (ad.business_slug &&
//             ad.business_slug
//               .toLowerCase()
//               .includes(searchTerm.toLowerCase())) ||
//           ad.ad_types.some((type) =>
//             type.toLowerCase().includes(searchTerm.toLowerCase())
//           )
//       );
//     }
//     if (typeFilter !== "all") {
//       result = result.filter((ad) => ad.type === typeFilter);
//     }
//     setFilteredAds(result);
//   }, [searchTerm, typeFilter, ads]);

//   // Sorting state and function
//   const [sortConfig, setSortConfig] = useState({
//     key: null,
//     direction: "ascending",
//   });

//   const handleSort = (key) => {
//     let direction = "ascending";
//     if (sortConfig.key === key && sortConfig.direction === "ascending") {
//       direction = "descending";
//     }
//     setSortConfig({ key, direction });
//     const sortedAds = [...filteredAds].sort((a, b) => {
//       if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
//       if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
//       return 0;
//     });
//     setFilteredAds(sortedAds);
//   };

//   // Pagination handlers
//   const handlePreviousPage = () => {
//     if (currentPage > 1) setCurrentPage(currentPage - 1);
//   };

//   const handleNextPage = () => {
//     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
//   };

//   // Alert function
//   const showAlertMessage = (message, variant = "default") => {
//     setAlertConfig({ message, variant });
//     setShowAlert(true);
//   };

//   // Error handling
//   useEffect(() => {
//     if (error) {
//       showAlertMessage(error, "destructive");
//     }
//   }, [error]);

//   return (
//     <div className="min-h-screen p-6 bg-blue-50 text-[#1D3557]">
//       {/* Alert Component */}
//       {showAlert && (
//         <Alert
//           variant={alertConfig.variant}
//           show={showAlert}
//           onClose={() => setShowAlert(false)}
//           autoClose={true}
//           autoCloseTime={5000}>
//           <AlertDescription>{alertConfig.message}</AlertDescription>
//         </Alert>
//       )}

//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="mb-8">
//         <h1 className="text-4xl font-extrabold text-center mb-4">
//           Running Ads Management
//         </h1>
//         <p className="text-center text-lg text-[#6B7280]">
//           Monitor and manage all currently running ads for businesses and
//           branches.
//         </p>
//       </motion.div>

//       {/* Stats Summary */}
//       <motion.div
//         className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.2, duration: 0.5 }}>
//         <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-[#E63946]">
//           <h3 className="text-lg font-semibold text-[#1D3557]">
//             Total Running Ads
//           </h3>
//           <p className="text-3xl font-bold text-[#E63946]">{ads.length}</p>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-[#457B9D]">
//           <h3 className="text-lg font-semibold text-[#1D3557]">Business Ads</h3>
//           <p className="text-3xl font-bold text-[#457B9D]">
//             {ads.filter((ad) => ad.type === "business").length}
//           </p>
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-[#1D3557]">
//           <h3 className="text-lg font-semibold text-[#1D3557]">Branch Ads</h3>
//           <p className="text-3xl font-bold text-[#1D3557]">
//             {ads.filter((ad) => ad.type === "branch").length}
//           </p>
//         </div>
//       </motion.div>

//       {/* Search and Filter */}
//       <motion.div
//         className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.3, duration: 0.5 }}>
//         <div className="flex items-center w-full sm:w-auto">
//           <FaSearch className="text-[#6B7280] mr-2" />
//           <input
//             type="text"
//             placeholder="Search by slug, business slug, or ad type..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="border rounded-lg p-2 w-full bg-white border-[#E63946] border-opacity-20 focus:ring-2 focus:ring-[#E63946] focus:outline-none"
//           />
//         </div>
//         <div className="flex items-center w-full sm:w-auto">
//           <FaFilter className="text-[#6B7280] mr-2" />
//           <select
//             value={typeFilter}
//             onChange={(e) => setTypeFilter(e.target.value)}
//             className="border rounded-lg p-2 w-full bg-white border-[#E63946] border-opacity-20 focus:ring-2 focus:ring-[#E63946] focus:outline-none">
//             <option value="all">All Types</option>
//             <option value="business">Business</option>
//             <option value="branch">Branch</option>
//           </select>
//         </div>
//       </motion.div>

//       {/* Ads Table */}
//       <motion.div
//         className="bg-white rounded-lg shadow-md p-6"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.4, duration: 0.5 }}>
//         <h2 className="text-2xl font-bold mb-4 text-[#1D3557]">
//           Running Ads List
//         </h2>
//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#E63946]"></div>
//           </div>
//         ) : error ? (
//           <div className="text-center text-[#E63946]">{error}</div>
//         ) : (
//           <>
//             <div className="overflow-x-auto">
//               <table className="min-w-full bg-white">
//                 <thead>
//                   <tr className="bg-[#F1FAEE]">
//                     {[
//                       "Type",
//                       "Slug",
//                       "Business Slug",
//                       "Ad Types",
//                       "Duration (Days)",
//                       "Amount",
//                       "Expiry Date",
//                     ].map((header) => (
//                       <th
//                         key={header}
//                         className="py-3 px-4 text-left text-[#1D3557] cursor-pointer hover:bg-[#E63946] hover:bg-opacity-10"
//                         onClick={() =>
//                           handleSort(
//                             header
//                               .toLowerCase()
//                               .replace(" (days)", "")
//                               .replace(" ", "_")
//                           )
//                         }>
//                         {header}
//                         {sortConfig.key ===
//                           header
//                             .toLowerCase()
//                             .replace(" (days)", "")
//                             .replace(" ", "_") && (
//                           <span>
//                             {sortConfig.direction === "ascending" ? " ↑" : " ↓"}
//                           </span>
//                         )}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredAds
//                     .slice((currentPage - 1) * 10, currentPage * 10)
//                     .map((ad, index) => (
//                       <tr
//                         key={index}
//                         className="hover:bg-[#F1FAEE] transition-colors duration-200 even:bg-white">
//                         <td className="py-2 px-4 border-b first-letter:uppercase">
//                           {ad.type}
//                         </td>
//                         <td className="py-2 px-4 border-b">{ad.slug}</td>
//                         <td className="py-2 px-4 border-b">
//                           {ad.business_slug || "N/A"}
//                         </td>
//                         <td className="py-2 px-4 border-b">
//                           {ad.ad_types.join(", ")}
//                         </td>
//                         <td className="py-2 px-4 border-b">{ad.duration}</td>
//                         <td className="py-2 px-4 border-b">
//                           {/* ${ad.amount.toFixed(2)} */}${ad.amount}
//                         </td>
//                         <td className="py-2 px-4 border-b">
//                           {new Date(ad.expiry_date).toLocaleString()}
//                         </td>
//                       </tr>
//                     ))}
//                 </tbody>
//               </table>
//             </div>
//             {/* Pagination */}
//             <div className="flex justify-center items-center mt-6 space-x-4">
//               <button
//                 onClick={handlePreviousPage}
//                 disabled={currentPage === 1}
//                 className={`flex items-center px-4 py-2 rounded-full ${
//                   currentPage === 1
//                     ? "bg-[#6B7280] text-white cursor-not-allowed"
//                     : "bg-[#E63946] text-white hover:bg-[#D62828]"
//                 } transition-colors duration-200`}>
//                 <FaChevronLeft className="mr-2" /> Previous
//               </button>
//               <span className="text-lg text-[#1D3557]">
//                 {currentPage} of {totalPages}
//               </span>
//               <button
//                 onClick={handleNextPage}
//                 disabled={currentPage === totalPages}
//                 className={`flex items-center px-4 py-2 rounded-full ${
//                   currentPage === totalPages
//                     ? "bg-[#6B7280] text-white cursor-not-allowed"
//                     : "bg-[#E63946] text-white hover:bg-[#D62828]"
//                 } transition-colors duration-200`}>
//                 Next <FaChevronRight className="ml-2" />
//               </button>
//             </div>
//           </>
//         )}
//       </motion.div>
//     </div>
//   );
// };

// export default AllRunningAds;

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import {
  FaSearch,
  FaFilter,
  FaAd,
  FaClock,
  FaMoneyBillWave,
} from "react-icons/fa";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import backendURL from "../../config";
import { format } from "date-fns";

const AllRunningAds = () => {
  const [ads, setAds] = useState([]);
  const [filteredAds, setFilteredAds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const { token } = useSelector((state) => state.auth);

  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });

  const adsPerPage = 10; // Number of ads per page

  // Fetch running ads from API
  useEffect(() => {
    const fetchRunningAds = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${backendURL}/api/ads/running?page=${currentPage}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (data.status === "success") {
          setAds(data.data);
          setFilteredAds(data.data);
          setTotalPages(Math.ceil(data.data.length / adsPerPage)); // Calculate total pages based on adsPerPage
        } else {
          setError(data.message || "Failed to fetch running ads");
        }
      } catch (err) {
        setError("An error occurred while fetching running ads");
      } finally {
        setLoading(false);
      }
    };

    fetchRunningAds();
  }, [currentPage, token]);

  // Search and filter functionality
  useEffect(() => {
    let result = [...ads];
    if (searchTerm) {
      result = result.filter(
        (ad) =>
          ad.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (ad.business_slug &&
            ad.business_slug
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) ||
          ad.ad_types.some((type) =>
            type.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }
    if (typeFilter !== "all") {
      result = result.filter((ad) => ad.type === typeFilter);
    }
    setFilteredAds(result);
    setTotalPages(Math.ceil(result.length / adsPerPage)); // Recalculate total pages after filtering
    setCurrentPage(1); // Reset to first page after filtering
  }, [searchTerm, typeFilter, ads]);

  // Sorting state and function
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    const sortedAds = [...filteredAds].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
      return 0;
    });
    setFilteredAds(sortedAds);
  };

  // Pagination logic for page numbers
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Show up to 5 page numbers at a time
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  // Enhanced Pagination Component
  const PaginationControls = () => (
    <div className="flex justify-center items-center space-x-2 mt-8 flex-wrap">
      <button
        onClick={() => setCurrentPage(1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md text-sm bg-white border border-blue-500 border-opacity-20 hover:bg-blue-700 hover:bg-opacity-10 disabled:opacity-50 disabled:cursor-not-allowed text-[#1D3557]">
        First
      </button>
      <button
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md text-sm bg-white border border-blue-500 border-opacity-20 hover:bg-blue-700 hover:bg-opacity-10 disabled:opacity-50 disabled:cursor-not-allowed text-[#1D3557]">
        Previous
      </button>
      <div className="flex items-center space-x-1">
        {getPageNumbers().map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => setCurrentPage(pageNum)}
            className={`px-3 py-1 rounded-md text-sm ${
              currentPage === pageNum
                ? "bg-blue-500 text-white"
                : "bg-white border border-blue-500 border-opacity-20 hover:bg-blue-700 hover:bg-opacity-10 text-[#1D3557]"
            }`}>
            {pageNum}
          </button>
        ))}
      </div>
      <button
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md text-sm bg-white border border-blue-500 border-opacity-20 hover:bg-blue-700 hover:bg-opacity-10 disabled:opacity-50 disabled:cursor-not-allowed text-[#1D3557]">
        Next
      </button>
      <button
        onClick={() => setCurrentPage(totalPages)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md text-sm bg-white border border-blue-500 border-opacity-20 hover:bg-blue-700 hover:bg-opacity-10 disabled:opacity-50 disabled:cursor-not-allowed text-[#1D3557]">
        Last
      </button>
    </div>
  );

  // Alert function
  const showAlertMessage = (message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
  };

  // Error handling
  useEffect(() => {
    if (error) {
      showAlertMessage(error, "destructive");
    }
  }, [error]);

  return (
    <div className="min-h-screen p-6 mid:p-0 mid:mt-14 bg-blue-50 text-[#1D3557]">
      {/* Alert Component */}
      {showAlert && (
        <Alert
          variant={alertConfig.variant}
          show={showAlert}
          onClose={() => setShowAlert(false)}
          autoClose={true}
          autoCloseTime={5000}>
          <AlertDescription>{alertConfig.message}</AlertDescription>
        </Alert>
      )}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8">
        <h1 className="text-4xl font-extrabold text-center mb-4">
          Running Ads Management
        </h1>
        <p className="text-center text-lg text-[#6B7280]">
          Monitor and manage all currently running ads for businesses and
          branches.
        </p>
      </motion.div>

      {/* Stats Summary */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-[#E63946]">
          <h3 className="text-lg font-semibold text-[#1D3557]">
            Total Running Ads
          </h3>
          <p className="text-3xl font-bold text-[#E63946]">{ads.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-[#457B9D]">
          <h3 className="text-lg font-semibold text-[#1D3557]">Business Ads</h3>
          <p className="text-3xl font-bold text-[#457B9D]">
            {ads.filter((ad) => ad.type === "business").length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-[#1D3557]">
          <h3 className="text-lg font-semibold text-[#1D3557]">Branch Ads</h3>
          <p className="text-3xl font-bold text-[#1D3557]">
            {ads.filter((ad) => ad.type === "branch").length}
          </p>
        </div>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}>
        <div className="flex items-center w-full sm:w-auto">
          <FaSearch className="text-[#6B7280] mr-2" />
          <input
            type="text"
            placeholder="Search by slug, business slug, or ad type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-lg p-2 w-full bg-white border-[#E63946] border-opacity-20 focus:ring-2 focus:ring-[#E63946] focus:outline-none"
          />
        </div>
        <div className="flex items-center w-full sm:w-auto">
          <FaFilter className="text-[#6B7280] mr-2" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border rounded-lg p-2 w-full bg-white border-[#E63946] border-opacity-20 focus:ring-2 focus:ring-[#E63946] focus:outline-none">
            <option value="all">All Types</option>
            <option value="business">Business</option>
            <option value="branch">Branch</option>
          </select>
        </div>
      </motion.div>

      {/* Ads Table */}
      <motion.div
        className="bg-white rounded-lg shadow-md p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}>
        <h2 className="text-2xl font-bold mb-4 text-[#1D3557]">
          Running Ads List
        </h2>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#E63946]"></div>
          </div>
        ) : error ? (
          <div className="text-center text-[#E63946]">{error}</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-[#F1FAEE]">
                    {[
                      "Type",
                      "Slug",
                      "Business Slug",
                      "Ad Types",
                      "Duration (Days)",
                      "Amount",
                      "Expiry Date",
                    ].map((header) => (
                      <th
                        key={header}
                        className="py-3 px-4 text-left text-[#1D3557] cursor-pointer hover:bg-[#E63946] hover:bg-opacity-10"
                        onClick={() =>
                          handleSort(
                            header
                              .toLowerCase()
                              .replace(" (days)", "")
                              .replace(" ", "_")
                          )
                        }>
                        {header}
                        {sortConfig.key ===
                          header
                            .toLowerCase()
                            .replace(" (days)", "")
                            .replace(" ", "_") && (
                          <span>
                            {sortConfig.direction === "ascending" ? " ↑" : " ↓"}
                          </span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredAds
                    .slice(
                      (currentPage - 1) * adsPerPage,
                      currentPage * adsPerPage
                    )
                    .map((ad, index) => (
                      <tr
                        key={index}
                        className="hover:bg-[#F1FAEE] transition-colors duration-200 even:bg-white">
                        <td className="py-2 px-4 border-b first-letter:uppercase">
                          {ad.type}
                        </td>
                        <td className="py-2 px-4 border-b">{ad.slug}</td>
                        <td className="py-2 px-4 border-b">
                          {ad.business_slug || "N/A"}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {ad.ad_types.join(", ")}
                        </td>
                        <td className="py-2 px-4 border-b">{ad.duration}</td>
                        <td className="py-2 px-4 border-b">
                          {/* ${ad.amount.toFixed(2)} */}#{ad.amount}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {format(
                            new Date(ad.expiry_date),
                            "MMMM dd, yyyy HH:mm:ss"
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {/* Enhanced Pagination */}
            <PaginationControls />
          </>
        )}
      </motion.div>
    </div>
  );
};

export default AllRunningAds;

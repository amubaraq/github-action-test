import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { FaSearch, FaFilter } from "react-icons/fa";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import backendURL from "../../config";

const ListBusinessesBranches = () => {
  const [businesses, setBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);
  const [searchBusiness, setSearchBusiness] = useState("");
  const [searchBranch, setSearchBranch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });

  const { token } = useSelector((state) => state.auth);
  const itemsPerPage = 10;

  // Fetch businesses and branches
  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          page: currentPage,
          per_page: itemsPerPage,
          ...(searchBusiness && { business_name: searchBusiness }),
          ...(searchBranch && { branch_name: searchBranch }),
        }).toString();

        const response = await fetch(
          `${backendURL}/api/list/all/businesses?${query}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || `HTTP error! status: ${response.status}`
          );
        }

        const data = await response.json();
        if (data.status === "success") {
          setBusinesses(data.data);
          setFilteredBusinesses(data.data);
          setCurrentPage(data.pagination.current_page);
          setTotalPages(data.pagination.last_page);
        }
      } catch (error) {
        showAlertMessage(
          error.message || "Failed to fetch businesses and branches",
          "destructive"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [currentPage, searchBusiness, searchBranch, token]);

  // Alert function
  const showAlertMessage = (message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  // Pagination page numbers
  const getPageNumbers = () => {
    const maxPagesToShow = 5;
    const pages = [];
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  // Pagination Controls Component
  const PaginationControls = () => (
    <div className="flex justify-center items-center space-x-2 mt-8 flex-wrap">
      <button
        onClick={() => setCurrentPage(1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md text-sm bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50">
        First
      </button>
      <button
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md text-sm bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50">
        Previous
      </button>
      <div className="flex items-center space-x-1">
        {getPageNumbers().map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => setCurrentPage(pageNum)}
            className={`px-3 py-1 rounded-md text-sm ${
              currentPage === pageNum
                ? "bg-[#00c469] text-white"
                : "bg-white border border-gray-300 hover:bg-gray-50"
            }`}>
            {pageNum}
          </button>
        ))}
      </div>
      <button
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md text-sm bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50">
        Next
      </button>
      <button
        onClick={() => setCurrentPage(totalPages)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md text-sm bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50">
        Last
      </button>
    </div>
  );

  // No Results UI
  const NoResults = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center p-10 bg-white rounded-xl shadow-md">
      <h3 className="text-2xl font-semibold text-gray-700 mb-4">
        No Results Found
      </h3>
      <p className="text-gray-500 mb-6">
        No businesses or branches match your search criteria. Try adjusting your
        filters.
      </p>
      <button
        onClick={() => {
          setSearchBusiness("");
          setSearchBranch("");
          setCurrentPage(1);
        }}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        Reset Filters
      </button>
    </motion.div>
  );

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-100 to-purple-50 text-gray-800">
      {showAlert && (
        <Alert
          variant={alertConfig.variant}
          show={showAlert}
          onClose={() => setShowAlert(false)}
          autoClose
          autoCloseTime={5000}>
          <AlertDescription>{alertConfig.message}</AlertDescription>
        </Alert>
      )}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-4">
          Businesses & Branches
        </h1>
        <p className="text-center text-lg text-gray-600">
          Manage and review all businesses and their branches
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}>
        <div className="flex items-center w-full sm:w-auto">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search by Business Name..."
            value={searchBusiness}
            onChange={(e) => setSearchBusiness(e.target.value)}
            className="border rounded-lg p-2 w-full bg-white border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center w-full sm:w-auto">
          <FaFilter className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search by Branch Name..."
            value={searchBranch}
            onChange={(e) => setSearchBranch(e.target.value)}
            className="border rounded-lg p-2 w-full bg-white border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </motion.div>

      {/* Businesses Table */}
      <motion.div
        className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Business List</h2>
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="animate-pulse flex space-x-4 p-4 rounded-lg bg-gray-50">
                <div className="h-6 bg-gray-200 rounded w-12"></div>
                <div className="h-6 bg-gray-200 rounded w-24"></div>
                <div className="h-6 bg-gray-200 rounded w-32"></div>
                <div className="h-6 bg-gray-200 rounded w-24"></div>
                <div className="h-6 bg-gray-200 rounded w-32"></div>
              </div>
            ))}
          </div>
        ) : filteredBusinesses.length === 0 ? (
          <NoResults />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-indigo-100 to-purple-100">
                  <tr>
                    {[
                      "ID",
                      "Business Name",
                      "User ID",
                      "Branch Count",
                      "Branches",
                      "Created At",
                    ].map((header) => (
                      <th
                        key={header}
                        className="py-3 px-4 text-left text-gray-700 font-semibold">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <AnimatePresence>
                    {filteredBusinesses.map((business) => (
                      <motion.tr
                        key={business.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="py-3 px-4 text-gray-800">
                          {business.id}
                        </td>
                        <td className="py-3 px-4 text-gray-800">
                          {business.business_name}
                        </td>
                        <td className="py-3 px-4 text-gray-800">
                          {business.user_id}
                        </td>
                        <td className="py-3 px-4 text-gray-800">
                          {business.branch_count}
                        </td>
                        <td className="py-3 px-4 text-gray-800">
                          {business.branches.map((branch) => (
                            <div key={branch.id} className="mb-1">
                              {branch.branch_name} (ID: {branch.id})
                            </div>
                          ))}
                        </td>
                        <td className="py-3 px-4 text-gray-800">
                          {new Date(business.created_at).toLocaleDateString()}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            <PaginationControls />
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ListBusinessesBranches;

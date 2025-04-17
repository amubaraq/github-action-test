import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import {
  FaSearch,
  FaFilter,
  FaCheck,
  FaTimes,
  FaEye,
  FaDownload,
} from "react-icons/fa";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import backendURL from "../../config";

const DocumentVerifications = () => {
  const [verifications, setVerifications] = useState([]);
  const [filteredVerifications, setFilteredVerifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewIsPdf, setPreviewIsPdf] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionData, setActionData] = useState({
    id: null,
    status: "",
    description: "",
  });

  const { token } = useSelector((state) => state.auth);
  const itemsPerPage = 10;

  // Fetch verifications with backend pagination
  useEffect(() => {
    const fetchVerifications = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams({
          page: currentPage,
          per_page: itemsPerPage,
          ...(statusFilter !== "all" && { status: statusFilter }),
          ...(typeFilter !== "all" && { verification_type: typeFilter }),
          ...(searchTerm && { user_id: searchTerm }),
        }).toString();

        const response = await fetch(
          `${backendURL}/api/lists/user/verify/documents?${query}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.status === "success") {
          const { document_verifications } = data;
          setVerifications(document_verifications.data);
          console.log(
            document_verifications.data,
            "document_verifications.data"
          );
          setFilteredVerifications(document_verifications.data);
          setCurrentPage(document_verifications.current_page);
          setTotalPages(document_verifications.last_page);
        }
      } catch (error) {
        showAlertMessage(
          error.message || "Failed to fetch verifications",
          "destructive"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchVerifications();
  }, [currentPage, statusFilter, typeFilter, searchTerm, token]);

  // Filter verifications locally (on top of paginated data)
  useEffect(() => {
    let result = [...verifications];
    if (searchTerm) {
      result = result.filter((v) => v.user_id.toString().includes(searchTerm));
    }
    setFilteredVerifications(result);
  }, [searchTerm, verifications]);

  // Handle verification update
  const updateVerification = async (id, status, description = "") => {
    try {
      const response = await fetch(
        `${backendURL}/api/update/user/document/status/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status, description }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update verification");
      }

      const data = await response.json();
      console.log(data, "update response"); // Log the full response
      console.log(id, "document ID being updated"); // Log the ID being used
      const updatedVerification = data.verification || data.data; // Adjust based on API response structure
      setVerifications((prev) =>
        prev.map((v) => (v.id === id ? updatedVerification : v))
      );
      setFilteredVerifications((prev) =>
        prev.map((v) => (v.id === id ? updatedVerification : v))
      );
      showAlertMessage(
        data.message || "Verification updated successfully",
        "success"
      );
    } catch (error) {
      showAlertMessage(error.message, "destructive");
    } finally {
      setShowConfirmModal(false);
    }
  };

  // Alert function
  const showAlertMessage = (message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  // Handle preview
  const handlePreview = (url) => {
    const isPdf = url.toLowerCase().endsWith(".pdf");
    setPreviewUrl(url);
    setPreviewIsPdf(isPdf);
    setShowPreview(true);
  };

  // Handle download
  const handleDownload = async (url, id) => {
    setDownloadLoading(id);
    try {
      const proxyUrl = `${backendURL}/api/proxy/download?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const blob = await response.blob();
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = url.split("/").pop();
      if (contentDisposition && contentDisposition.includes("filename=")) {
        filename = contentDisposition.split("filename=")[1].replace(/"/g, "");
      }
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      showAlertMessage("Document downloaded successfully", "success");
    } catch (error) {
      showAlertMessage(
        `Failed to download document: ${error.message}. Check authentication or contact support.`,
        "destructive"
      );
    } finally {
      setDownloadLoading(null);
    }
  };

  // Handle action confirmation
  const handleActionConfirm = (id, status, description) => {
    setActionData({ id, status, description });
    setShowConfirmModal(true);
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

  // Enhanced Pagination Component
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
        No document verifications match your search or filter criteria. Try
        adjusting your filters or search term.
      </p>
      <button
        onClick={() => {
          setSearchTerm("");
          setStatusFilter("all");
          setTypeFilter("all");
          setCurrentPage(1); // Reset page to 1 when clearing filters
        }}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        Reset Filters
      </button>
    </motion.div>
  );

  // Preview Modal
  const PreviewModal = () => (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white p-6 rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="text-2xl font-bold text-gray-800">Document Preview</h3>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleDownload(previewUrl, "preview")}
              disabled={downloadLoading === "preview"}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              {downloadLoading === "preview" ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                    />
                  </svg>
                  Downloading...
                </span>
              ) : (
                <>
                  <FaDownload className="mr-2" /> Download
                </>
              )}
            </button>
            <button
              onClick={() => setShowPreview(false)}
              className="text-gray-600 hover:text-gray-800">
              <FaTimes size={24} />
            </button>
          </div>
        </div>
        {previewIsPdf ? (
          <iframe
            src={previewUrl}
            title="PDF Preview"
            className="w-full h-[60vh] rounded-lg border border-gray-300"
          />
        ) : (
          <img
            src={previewUrl}
            alt="Document Preview"
            className="w-full h-auto rounded-lg object-contain"
          />
        )}
      </motion.div>
    </div>
  );

  // Confirmation Modal
  const ConfirmationModal = () => (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Confirm {actionData.status === "verified" ? "Accept" : "Reject"}
        </h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to{" "}
          {actionData.status === "verified" ? "accept" : "reject"} this document
          verification?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setShowConfirmModal(false)}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
            Cancel
          </button>
          <button
            onClick={() =>
              updateVerification(
                actionData.id,
                actionData.status,
                actionData.description
              )
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Confirm
          </button>
        </div>
      </motion.div>
    </div>
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

      {showPreview && <PreviewModal />}
      {showConfirmModal && <ConfirmationModal />}

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-4">
          Document Verifications
        </h1>
        <p className="text-center text-lg text-gray-600">
          Review and manage user document verifications with ease
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
            placeholder="Search by User ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-lg p-2 w-full bg-white border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center w-full sm:w-auto">
          <FaFilter className="text-gray-500 mr-2" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg p-2 w-full bg-white border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div className="flex items-center w-full sm:w-auto">
          <FaFilter className="text-gray-500 mr-2" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border rounded-lg p-2 w-full bg-white border-gray-200 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
            <option value="all">All Types</option>
            <option value="dob">Date of Birth</option>
            <option value="address">Address</option>
            <option value="name">Name</option>
            <option value="recent_jobs">Recent Jobs</option>
            <option value="education">Education</option>
            <option value="nin">National Identification Number (NIN)</option>
            <option value="resume">Resume</option>
            <option value="medical">Medical</option>
          </select>
        </div>
      </motion.div>

      {/* Verifications Table */}
      <motion.div
        className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Verification List
        </h2>
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
                <div className="h-6 bg-gray-200 rounded w-40"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-6 bg-gray-200 rounded w-24"></div>
              </div>
            ))}
          </div>
        ) : filteredVerifications.length === 0 ? (
          <NoResults />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-indigo-100 to-purple-100">
                  <tr>
                    {[
                      "ID",
                      "User ID",
                      "Type",
                      "Status",
                      "Created At",
                      "Description",
                      "Preview",
                      "Download",
                      "Actions",
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
                    {filteredVerifications.map((verification) => (
                      <motion.tr
                        key={verification.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="hover:bg-gray-50 transition-colors duration-200">
                        <td className="py-3 px-4 text-gray-800">
                          {verification.id}
                        </td>
                        <td className="py-3 px-4 text-gray-800">
                          {verification.user_id}
                        </td>
                        <td className="py-3 px-4 first-letter:uppercase text-gray-800">
                          {verification.verification_type}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                              verification.status === "verified"
                                ? "bg-green-100 text-green-700"
                                : verification.status === "rejected"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                            }`}>
                            {verification.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-800">
                          {new Date(
                            verification.created_at
                          ).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-gray-800">
                          {verification.description || "N/A"}
                        </td>
                        <td className="py-3 px-4">
                          {verification.document_url && (
                            <button
                              onClick={() =>
                                handlePreview(verification.document_url)
                              }
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                              title="Preview Document">
                              <FaEye size={16} />
                            </button>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {verification.document_url && (
                            <button
                              onClick={() =>
                                handleDownload(
                                  verification.document_url,
                                  verification.id
                                )
                              }
                              disabled={downloadLoading === verification.id}
                              className="text-green-600 hover:text-green-800 transition-colors"
                              title="Download Document">
                              {downloadLoading === verification.id ? (
                                <svg
                                  className="animate-spin h-5 w-5 text-green-600"
                                  viewBox="0 0 24 24">
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  />
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                                  />
                                </svg>
                              ) : (
                                <FaDownload size={16} />
                              )}
                            </button>
                          )}
                        </td>
                        <td className="py-2 px-4 flex space-x-2">
                          {verification.status === "pending" && (
                            <>
                              <button
                                onClick={() =>
                                  handleActionConfirm(
                                    verification.id,
                                    "verified",
                                    "Verified by admin"
                                  )
                                }
                                className="text-green-500 hover:text-green-700 px-2 py-1 rounded bg-green-100 hover:bg-green-200"
                                title="Accept Verification">
                                Accept
                              </button>
                              <button
                                onClick={() =>
                                  handleActionConfirm(
                                    verification.id,
                                    "rejected",
                                    "Rejected by admin"
                                  )
                                }
                                className="text-red-500 hover:text-red-700 px-2 py-1 rounded bg-red-100 hover:bg-red-200"
                                title="Reject Verification">
                                Reject
                              </button>
                            </>
                          )}
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

export default DocumentVerifications;

// src/pages/agent/SubscriptionsPage.js
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaEye, FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import backendURL from "../../config";

const AgentSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await fetch(
          `${backendURL}/api/agent/subscription-data`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        if (data.status === "success") {
          // Flatten the data structure
          const flattened = data.data.referred_users.flatMap((user) =>
            user.subscriptions.map((sub) => ({
              ...sub,
              user: {
                id: user.user_id,
                name: user.name,
                email: user.email,
                phone: user.phone,
              },
            }))
          );
          setSubscriptions(flattened);
        }
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, [token]);

  // Filter subscriptions based on search term
  const filteredSubscriptions = subscriptions.filter(
    (sub) =>
      sub.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.plan_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSubscriptions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredSubscriptions.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gray-50 sm:p-6 mid:mt-16 p-2">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Subscriptions</h1>
          <button
            onClick={() => navigate("/agent/dashboard")}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 transition-colors">
            Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full sm:w-64">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search subscriptions..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
              />
            </div>
            <div className="text-sm text-gray-500">
              Showing {indexOfFirstItem + 1}-
              {Math.min(indexOfLastItem, filteredSubscriptions.length)} of{" "}
              {filteredSubscriptions.length} subscriptions
            </div>
          </div>

          {loading ? (
            <div className="p-8 flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expiry Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.length > 0 ? (
                    currentItems.map((sub) => (
                      <tr
                        key={sub.subscription_id}
                        className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="ml-2">
                              <div className="font-medium text-gray-900">
                                {sub.user.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {sub.user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {sub.plan_type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          ${sub.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(sub.start_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(sub.expiry_date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              new Date(sub.expiry_date) > new Date()
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}>
                            {new Date(sub.expiry_date) > new Date()
                              ? "Active"
                              : "Expired"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => navigate(`/profile/${sub.user.id}`)}
                            className="text-blue-600 hover:text-blue-900 flex items-center">
                            <FaEye className="mr-1" /> View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-4 text-center text-sm text-gray-500">
                        {searchTerm
                          ? "No matching subscriptions found"
                          : "No subscriptions available"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {filteredSubscriptions.length > itemsPerPage && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md ${currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>
                <FaChevronLeft className="inline mr-1" /> Previous
              </button>
              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (number) => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`px-3 py-1 rounded-md ${currentPage === number ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>
                      {number}
                    </button>
                  )
                )}
              </div>
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md ${currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>
                Next <FaChevronRight className="inline ml-1" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentSubscriptions;

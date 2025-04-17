import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "../../components/tools/Alert";
// import { Spinner } from "../../components/tools/Spinner";
import LoaddingSpinner from "../../components/tools/LoaddingSpinner";
import backendURL from "../../config";

const SuperAdminSubscriptionsData = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [formData, setFormData] = useState({
    price: "",
    duration_days: "",
    description: "",
    is_active: true,
  });

  const { userInfo, token } = useSelector((state) => state.auth);
  const isAdmin =
    userInfo?.role === "admin" || userInfo?.role === "super_admin";

  // Memoized alert function
  const showAlertMessage = useCallback((message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  }, []);

  // Fetch all subscription plans
  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${backendURL}/api/subscriptions/price/list`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          cache: "no-cache",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      if (data.status === "success") {
        setSubscriptions(data.data);
      } else {
        throw new Error(data.message || "Failed to fetch subscription plans.");
      }
    } catch (err) {
      setError(err.message);
      showAlertMessage(err.message, "destructive");
    } finally {
      setLoading(false);
    }
  }, [token, showAlertMessage]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  // Fetch plan details for editing
  const handleEditClick = async (planId) => {
    if (!isAdmin) {
      showAlertMessage(
        "Unauthorized, admin or super_admin role required",
        "destructive"
      );
      return;
    }

    try {
      const response = await fetch(
        `${backendURL}/api/subscriptions/price/${planId}/edit`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "success") {
        setSelectedPlan(data.data);
        setFormData({
          price: data.data.price,
          name: data.data.name,
          duration_days: data.data.duration_days,
          description: data.data.description,
          is_active: data.data.is_active,
        });
        setEditModalOpen(true);
      } else {
        throw new Error(data.message || "Failed to fetch plan details.");
      }
    } catch (err) {
      showAlertMessage(err.message, "destructive");
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle form submission to update the plan
  const handleUpdatePlan = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const response = await fetch(
        `${backendURL}/api/subscriptions/price/${selectedPlan.id}/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            price: parseFloat(formData.price),
            name: parseFloat(formData.name),
            duration_days: parseInt(formData.duration_days, 10),
            description: formData.description,
            is_active: formData.is_active,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "success") {
        setSubscriptions((prev) =>
          prev.map((plan) => (plan.id === selectedPlan.id ? data.data : plan))
        );
        setEditModalOpen(false);
        showAlertMessage("Plan updated successfully!", "success");
      } else {
        throw new Error(data.message || "Failed to update the plan.");
      }
    } catch (err) {
      showAlertMessage(err.message, "destructive");
    } finally {
      setUpdating(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoaddingSpinner size="lg" />
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 p-6 rounded-lg max-w-md text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Error loading subscriptions
          </h3>
          <p className="text-sm text-red-700 mb-4">{error}</p>
          <button
            onClick={fetchSubscriptions}
            className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gray-50 text-gray-900">
      {/* Alert Component */}
      <div className="fixed top-4 right-4 z-50 w-full max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: showAlert ? 1 : 0, y: showAlert ? 0 : -20 }}
          transition={{ duration: 0.3 }}>
          {showAlert && (
            <Alert variant={alertConfig.variant}>
              <AlertDescription>{alertConfig.message}</AlertDescription>
            </Alert>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">
          Subscription Plans Management
        </h1>
        <p className="text-center text-gray-600">
          View and manage all subscription plans
        </p>
      </motion.div>

      {/* Subscriptions Table */}
      <motion.div
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h2 className="text-xl font-semibold">Subscription Plans</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={fetchSubscriptions}
              className="flex items-center text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price (₦)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subscriptions.map((plan) => (
                <tr key={plan.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {plan.id}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                    {plan.name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    ₦{parseFloat(plan.price).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {plan.duration_days} days
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        plan.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                      {plan.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    <button
                      onClick={() => handleEditClick(plan.id)}
                      className={`text-sm px-3 py-1 rounded-md ${
                        isAdmin
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "bg-gray-300 text-gray-600 cursor-not-allowed"
                      } transition`}
                      disabled={!isAdmin}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Edit Subscription Plan
                </h2>
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleUpdatePlan}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₦)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                      step="0.01"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (Days)
                    </label>
                    <input
                      type="number"
                      name="duration_days"
                      value={formData.duration_days}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                      required
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Active Plan
                    </label>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={updating}>
                    {updating ? (
                      <span className="flex items-center justify-center">
                        <LoaddingSpinner size="sm" className="mr-2" />
                        Updating...
                      </span>
                    ) : (
                      "Update Plan"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminSubscriptionsData;

import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import { Trash2, Edit, Plus } from "lucide-react";
import LoadingSpinner2 from "../../components/tools/loadingSpinner2";
import backendURL from "../../config";

// Hardcode the backend URL (assuming it matches your config)

const BACKEND_URL = backendURL;

// Improved BusinessCard Component
const BusinessCard = ({ business, onEdit, onDelete }) => {
  return (
    <div className="flex flex-col bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 h-full">
      {/* Business Logo */}
      <div className="flex justify-center p-4 bg-gray-50">
        {business.business_photos?.[0]?.photo_path ? (
          <img
            src={business.business_photos[0].photo_path}
            alt={`${business.business_name} logo`}
            className="w-20 h-20 rounded-full object-cover border-2 border-blue-200 shadow-sm"
            loading="lazy"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-medium shadow-sm">
            No Logo
          </div>
        )}
      </div>

      {/* Business Details */}
      <div className="flex-grow p-4 space-y-3">
        <h2 className="text-xl font-semibold text-gray-800 text-center">
          {business.business_name || "Unnamed Business"}
        </h2>
        <div className="text-sm text-gray-700 text-center">
          <p>
            <span className="font-medium text-blue-600">Type:</span>{" "}
            {business.business_line || "N/A"}
          </p>
          <p>
            <span className="font-medium text-blue-600">Category:</span>{" "}
            {business.category_slug || "N/A"}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 p-4">
        <button
          onClick={() => onEdit(business.slug)}
          className="flex items-center justify-center py-2 bg-gradient-to-r from-blue-500 to-blue-800 text-white text-sm font-medium rounded-md hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm">
          <Edit size={14} className="mr-2" /> Edit
        </button>
        <button
          onClick={() => onDelete(business)}
          className="flex items-center justify-center py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-md hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm">
          <Trash2 size={14} className="mr-2" /> Delete
        </button>
      </div>
    </div>
  );
};

const UserBusinesses = () => {
  const { userInfo, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [businessToDelete, setBusinessToDelete] = useState(null);

  const showAlertMessage = useCallback((message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  }, []);

  const fetchBusinesses = useCallback(async () => {
    try {
      if (!userInfo?.slug) {
        throw new Error("User slug not available");
      }
      setLoading(true);
      const userResponse = await fetch(
        `${BACKEND_URL}/api/user/${userInfo.slug}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!userResponse.ok) {
        const errorData = await userResponse.json();
        throw new Error(errorData.message || "Failed to fetch user data");
      }
      const userData = await userResponse.json();
      const contactSlug = userData?.data?.user?.contact?.slug;

      const response = await fetch(
        `${BACKEND_URL}/api/profile/${contactSlug}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to fetch business profile"
        );
      }
      const data = await response.json();

      // Set all businesses for the user
      setBusinesses(data.businesses || []);
      console.log(data.businesses, "All businesses fetched");
    } catch (error) {
      showAlertMessage(error.message, "destructive");
    } finally {
      setLoading(false);
    }
  }, [token, userInfo?.slug, showAlertMessage]);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  const handleEdit = (slug) => {
    navigate(`/user/business/${slug}`);
  };

  const handleDeleteConfirm = async () => {
    if (!businessToDelete) return;
    try {
      setLoading(true);
      const response = await fetch(
        `${BACKEND_URL}/api/business/${businessToDelete.slug}/delete`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete business");
      }
      const data = await response.json();
      setBusinesses(businesses.filter((b) => b.slug !== businessToDelete.slug));
      showAlertMessage(
        data.message ||
          "Business profile and all associated data deleted successfully",
        "success"
      );
    } catch (error) {
      showAlertMessage(error.message, "destructive");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setBusinessToDelete(null);
    }
  };

  const openDeleteModal = (business) => {
    setBusinessToDelete(business);
    setShowDeleteModal(true);
  };

  const handleCreateBusiness = () => {
    navigate("/user/business");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 mid:mt-14">
      <div className="flex mid:flex-col justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Registered Business
        </h1>
        {businesses.length === 0 ? (
          <button
            onClick={handleCreateBusiness}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transition-all duration-200">
            <Plus size={16} className="mr-2" /> Create a Business
          </button>
        ) : (
          <button
            onClick={handleCreateBusiness}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-blue-700 transition-all duration-200">
            <Plus size={16} className="mr-2" /> Add More Business
          </button>
        )}
      </div>

      {loading ? (
        <LoadingSpinner2 />
      ) : businesses.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-600 text-lg">
            No businesses registered yet. Start by creating one!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business) => (
            <BusinessCard
              key={business.id}
              business={business}
              onEdit={handleEdit}
              onDelete={openDeleteModal}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Confirm Deletion
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete "
              <span className="font-semibold">
                {businessToDelete?.business_name}
              </span>
              "? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-300 transition-colors duration-200">
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-md hover:from-red-600 hover:to-red-700 transition-colors duration-200"
                disabled={loading}>
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default UserBusinesses;

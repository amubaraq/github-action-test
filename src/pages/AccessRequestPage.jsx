import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import backendURL from "../config";
import { Alert, AlertDescription } from "../components/tools/Alert";
import { Shield, Check, X, ArrowLeft, Loader2 } from "lucide-react"; // Importing lucide-react icons

const AccessRequestPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [requestDetails, setRequestDetails] = useState(null);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });

  const queryParams = new URLSearchParams(location.search);
  const requestId = queryParams.get("request_id");

  useEffect(() => {
    if (requestId) {
      fetchRequestDetails();
    }
  }, [requestId]);

  const fetchRequestDetails = async () => {
    try {
      const response = await axios.get(
        `${backendURL}/api/profile/request-details/${requestId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.status === "success") {
        setRequestDetails(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching request details:", error);
    }
  };

  const showAlertMessage = (message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
  };

  const handleApprove = async () => {
    if (!requestId) {
      showAlertMessage("Invalid request ID", "destructive");
      return;
    }

    setAcceptLoading(true);
    try {
      const response = await axios.post(
        `${backendURL}/api/profile/approve-request/${requestId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = response.data;
      if (data.status === "success") {
        showAlertMessage(
          data.message || "Profile access has been granted",
          "success"
        );
        setTimeout(() => navigate("/people"), 1500);
      } else {
        showAlertMessage(
          data.message || "Failed to approve request",
          "destructive"
        );
      }
    } catch (err) {
      showAlertMessage(
        err.response?.data?.message || "Error approving request",
        "destructive"
      );
    } finally {
      setAcceptLoading(false);
    }
  };

  const handleDeny = async () => {
    if (!requestId) {
      showAlertMessage("Invalid request ID", "destructive");
      return;
    }

    setRejectLoading(true);
    try {
      const response = await axios.post(
        `${backendURL}/api/profile/deny-request/${requestId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = response.data;
      if (data.status === "success") {
        showAlertMessage(
          data.message || "Profile access has been denied",
          "success"
        );
        setTimeout(() => navigate("/people"), 1500);
      } else {
        showAlertMessage(
          data.message || "Failed to deny request",
          "destructive"
        );
      }
    } catch (err) {
      showAlertMessage(
        err.response?.data?.message || "Error denying request",
        "destructive"
      );
    } finally {
      setRejectLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-100 p-4">
      <div className="relative bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full text-center overflow-hidden">
        {/* Background decoration with blended colors */}
        <div className="absolute -top-16 -right-16 w-40 h-40 bg-indigo-100 rounded-full "></div>
        <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-pink-100 rounded-full "></div>
        <div className="absolute top-1/2 left-0 w-2 h-24 bg-gradient-to-b from-indigo-800 to-purple-500 transform -translate-y-1/2 "></div>

        <div className="relative z-10">
          <div className="mb-8 relative">
            <span className="inline-block w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-4 text-white flex items-center justify-center shadow-md">
              <Shield className="h-8 w-8" />{" "}
              {/* Replaced SVG with Shield icon */}
            </span>
            <h1 className="text-3xl font-bold bg-purple bg-clip-text text-transparent">
              Profile Access Request
            </h1>
            <p className="text-gray-900 mt-2 max-w-md mx-auto">
              Please review this request for profile access. Your decision will
              be communicated to the requester.
            </p>
          </div>

          {requestDetails && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-700">Request from:</h3>
              <p className="text-gray-800">
                {requestDetails.requesterName || "Unknown User"}
              </p>
              {requestDetails.requestDate && (
                <p className="text-sm text-gray-500 mt-1">
                  Requested on{" "}
                  {new Date(requestDetails.requestDate).toLocaleDateString()}
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <button
              onClick={handleApprove}
              disabled={acceptLoading || rejectLoading}
              className="relative overflow-hidden px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-900 text-white font-medium rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:transform-none disabled:hover:shadow-none hover:font-bold">
              <span className="relative z-10 flex items-center justify-center">
                {acceptLoading ? (
                  <Loader2 className="animate-spin h-5 w-5 mr-2" /> // Replaced SVG with Loader2
                ) : (
                  <Check className="w-5 h-5 mr-2" /> // Replaced SVG with Check icon
                )}
                Accept Request
              </span>
            </button>
            <button
              onClick={handleDeny}
              disabled={rejectLoading || acceptLoading}
              className="relative overflow-hidden px-6 py-4 bg-gradient-to-r from-red-500 to-pink-600 text-white font-medium rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:transform-none disabled:hover:shadow-none hover:font-bold">
              <span className="relative z-10 flex items-center justify-center">
                {rejectLoading ? (
                  <Loader2 className="animate-spin h-5 w-5 mr-2" /> // Replaced SVG with Loader2
                ) : (
                  <X className="w-5 h-5 mr-2" /> // Replaced SVG with X icon
                )}
                Reject Request
              </span>
            </button>
          </div>

          <button
            onClick={() => navigate("/people")}
            className="mt-8 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-300 flex items-center justify-center mx-auto">
            <ArrowLeft className="w-5 h-5 mr-2" />{" "}
            {/* Replaced SVG with ArrowLeft icon */}
            Back to People
          </button>
        </div>
      </div>

      {showAlert && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in-down">
          <Alert
            variant={alertConfig.variant}
            show={showAlert}
            onClose={() => setShowAlert(false)}
            autoClose={true}
            autoCloseTime={5000}>
            <AlertDescription>{alertConfig.message}</AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
};

export default AccessRequestPage;

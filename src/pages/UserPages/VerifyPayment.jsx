import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import backendURL from "../../config";
import PaymentSuccess from "../../components/Payments/PaymentSuccess";
import PaymentError from "../../components/Payments/PaymentError";

const VerifyPayment = () => {
  const { token } = useSelector((state) => state.auth);
  const [verificationStatus, setVerificationStatus] = useState({
    loading: true,
    error: null,
    success: null,
    paymentDetails: null,
  });

  // Function to get query parameters from the URL
  const getQueryParam = (param) => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  };

  // Verify payment
  const verifyPayment = useCallback(async () => {
    try {
      // Get payment details from localStorage
      const paymentDetails = JSON.parse(localStorage.getItem("paymentDetails"));
      if (!paymentDetails) {
        throw new Error("Payment details not found");
      }

      const { business_slug, branch_slug, reference } = paymentDetails;

      if (!business_slug || !reference) {
        throw new Error("Missing required payment details");
      }

      // Get the reference from the URL query parameters (Paystack redirect)
      const urlReference = getQueryParam("reference") || reference;

      // Construct the verification URL
      const url = branch_slug
        ? `${backendURL}/api/ads/payment/verify/${business_slug}/${branch_slug}?reference=${urlReference}`
        : `${backendURL}/api/ads/payment/verify/${business_slug}?reference=${urlReference}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      console.log("Verify Payment Response:", result);

      if (!response.ok || result.status !== "success") {
        throw new Error(result.message || "Payment verification failed");
      }

      setVerificationStatus({
        loading: false,
        error: null,
        success: true,
        paymentDetails: result.data,
      });

      // Clear payment details from localStorage
      localStorage.removeItem("paymentDetails");
    } catch (error) {
      console.error("Payment Verification Error:", error);
      setVerificationStatus({
        loading: false,
        error: error.message,
        success: false,
        paymentDetails: null,
      });
    }
  }, [token]);

  useEffect(() => {
    verifyPayment();
  }, [verifyPayment]);

  if (verificationStatus.loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-3 md:p-5">
        <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full text-center">
          <h1 className="text-xl font-bold text-gray-800 mb-2">
            Verifying Payment...
          </h1>
          <p className="text-sm text-gray-600">Please wait a moment.</p>
        </div>
      </div>
    );
  }

  return verificationStatus.success ? (
    <PaymentSuccess paymentDetails={verificationStatus.paymentDetails} />
  ) : (
    <PaymentError errorMessage={verificationStatus.error} />
  );
};

export default VerifyPayment;

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoaddingSpinner from "../../components/tools/LoaddingSpinner";
import backendURL from "../../config";

const VerifySubscription = () => {
  const navigate = useNavigate();
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
  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get payment details from localStorage
        const paymentDetails = JSON.parse(
          localStorage.getItem("subscriptionPaymentDetails")
        );
        if (!paymentDetails) {
          throw new Error("Payment details not found");
        }

        const { reference } = paymentDetails;

        if (!reference) {
          throw new Error("Missing payment reference");
        }

        // Get the reference from the URL query parameters (Paystack redirect)
        const urlReference = getQueryParam("reference") || reference;

        // Verify the payment
        const response = await fetch(`${backendURL}/api/subscription/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            reference: urlReference,
          }),
        });

        const result = await response.json();

        if (result.status === "success") {
          setVerificationStatus({
            loading: false,
            error: null,
            success: true,
            paymentDetails: result.data,
          });
          localStorage.removeItem("subscriptionPaymentDetails"); // Clear payment details
        } else {
          throw new Error(
            result.message ||
              "Payment verification failed. Please contact support."
          );
        }
      } catch (error) {
        setVerificationStatus({
          loading: false,
          error: error.message,
          success: false,
          paymentDetails: null,
        });
      }
    };

    verifyPayment();
  }, [token]);

  // Redirect based on verification status
  useEffect(() => {
    if (!verificationStatus.loading) {
      if (verificationStatus.success) {
        navigate("/payment-success", {
          state: { paymentDetails: verificationStatus.paymentDetails },
        });
      } else {
        navigate("/payment-error", {
          state: { errorMessage: verificationStatus.error },
        });
      }
    }
  }, [verificationStatus, navigate]);

  if (verificationStatus.loading) {
    return <LoaddingSpinner />;
  }

  return null; // The component will redirect, so no need to render anything
};

export default VerifySubscription;

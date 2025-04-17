import React from "react";
import { XCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const PaymentError = () => {
  const location = useLocation();
  const errorMessage =
    location.state?.errorMessage || "An unknown error occurred.";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-3 md:p-5">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Failed
        </h1>
        <p className="text-sm text-gray-600 mb-4">{errorMessage}</p>
        <Link
          to="/packages"
          className="mt-6 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Try Again
        </Link>
      </div>
    </div>
  );
};

export default PaymentError;

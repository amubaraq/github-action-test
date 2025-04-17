import React from "react";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const PaymentSuccess = ({ paymentDetails }) => {
  const { business_slug, branch_slug, ad_types, duration } =
    paymentDetails || {};

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-3 md:p-5">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Successful!
        </h1>
        <p className="text-sm text-gray-600 mb-4">
          Your ad campaign has been successfully created.
        </p>
        <div className="text-left space-y-2">
          <p>
            <strong>Business:</strong> {business_slug}
          </p>
          {branch_slug && (
            <p>
              <strong>Branch:</strong> {branch_slug}
            </p>
          )}
          <p>
            <strong>Ad Types:</strong> {ad_types?.join(", ")}
          </p>
          <p>
            <strong>Duration:</strong> {duration} days
          </p>
        </div>
        <Link
          to="/user/MyDashBoad"
          className="mt-6 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccess;

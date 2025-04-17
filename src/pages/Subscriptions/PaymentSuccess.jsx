import React from "react";
import { CheckCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const PaymentSuccess = () => {
  const location = useLocation();
  const paymentDetails = location.state?.paymentDetails || {};

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-3 md:p-5">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Successful!
        </h1>
        <p className="text-sm text-gray-600 mb-4">
          Your subscription has been successfully activated.
        </p>
        <div className="text-left space-y-2">
          <p>
            <strong>Plan:</strong> {paymentDetails.plan_type}
          </p>
          <p>
            <strong>Amount Paid:</strong> ₦
            {paymentDetails.amount_paid?.toLocaleString()}
          </p>
          <p>
            <strong>Expiry Date:</strong>{" "}
            {new Date(paymentDetails.expiry_date).toLocaleDateString()}
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

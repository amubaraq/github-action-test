import React from "react";

const EdirectBanner = () => {
  return (
    <div className="flex flex-col items-center text-center py-12 px-4 max-w-5xl mx-auto">
      <div className="mb-4">
        <h1 className="text-5xl mod:text-4xl font-bold text-red-600">
          E-DIRECT
        </h1>
        <p className="text-gray-600 italic mt-2">A part of Essential Group.</p>
      </div>

      <div className="mt-46">
        <h2 className="text-4xl font-medium text-gray-800 mb-6">
          Welcome to Essential-Direct. We are now registering users and
          businesses around Nigeria.
        </h2>

        <p className="text-xl text-gray-700 mb-10">
          Nigeria's Largest Online and Telephone Business Directory where you
          can search for people, businesses, hotels, jobs and many more.
        </p>
      </div>

      <div className="mt-0 animate-pulse">
        <h3 className="text-3xl font-semibold text-gray-800">Active Now!</h3>
      </div>

      <div className="mt-4 mb-4">
        <h3 className="text-2xl font-medium text-gray-800">
          Register your business now!
        </h3>
      </div>

      <p className="text-lg text-gray-700 mb-4">
        A business with "no sign" is a sign of no business
      </p>

      <p className="text-lg text-gray-700">
        For enquiries call{" "}
        <a href="tel:07000555666" className="text-blue-600 hover:underline">
          07000555666
        </a>
        . Stay tuned for further updates.
      </p>
    </div>
  );
};

export default EdirectBanner;

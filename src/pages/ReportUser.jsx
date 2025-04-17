// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { useSelector } from "react-redux";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import { Alert, AlertDescription } from "../components/tools/Alert";
// import { IoArrowForwardCircleOutline } from "react-icons/io5";
// import backendURL from "../config";

// // Validation schema for the report form
// const schema = yup.object().shape({
//   reason: yup
//     .string()
//     .required("Please provide a reason for reporting")
//     .min(10, "Reason must be at least 10 characters long"),
// });

// const ReportUser = () => {
//   const { token } = useSelector((state) => state.auth);
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const slug = searchParams.get("slug"); // Extract slug from URL query params

//   const [showAlert, setShowAlert] = useState(false);
//   const [alertConfig, setAlertConfig] = useState({
//     variant: "default",
//     message: "",
//   });
//   const [isPrivateProfile, setIsPrivateProfile] = useState(false);
//   const [accessRequestStatus, setAccessRequestStatus] = useState(null);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm({
//     resolver: yupResolver(schema),
//   });

//   // Show alert message
//   const showAlertMessage = (message, variant = "default") => {
//     setAlertConfig({ message, variant });
//     setShowAlert(true);
//     setTimeout(() => setShowAlert(false), 5000);
//   };

//   // Handle form submission to report the user
//   const onSubmit = async (data) => {
//     if (!slug || !token) {
//       showAlertMessage("User slug or token is missing", "destructive");
//       return;
//     }

//     try {
//       const response = await fetch(
//         `${backendURL}/api/report/user/account/${slug}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ reason: data.reason }),
//         }
//       );

//       const result = await response.json();

//       if (response.status === 401 || response.status === 400) {
//         showAlertMessage(result.message, "warning");
//         // setTimeout(() => navigate("/login"), 3000);
//         return;
//       }

//       if (response.status === 500) {
//         showAlertMessage(result.message, "destructive");
//         return;
//       }

//       if (result.status === "success") {
//         showAlertMessage(result.message, "success");
//         reset();
//         setTimeout(() => navigate(`/profile/${slug}`), 3000); // Redirect to profile
//       }
//     } catch (error) {
//       showAlertMessage("Error submitting report", "destructive");
//     }
//   };

//   // Form field component
//   const FormField = ({ label, error, children }) => (
//     <div className="flex flex-col space-y-1">
//       <label className="text-sm font-medium">{label}</label>
//       {children}
//       {error && <p className="text-red-500 text-sm">{error.message}</p>}
//     </div>
//   );

//   // If the profile is private and access request is pending, show a message
//   if (isPrivateProfile && accessRequestStatus?.status === "pending") {
//     return (
//       <div className="max-w-4xl mx-auto p-6 pb-[6rem]">
//         <h1 className="text-3xl font-bold mb-4">Profile Access Required</h1>
//         <p className="text-gray-600 mb-4">
//           This profile is private. An access request has been sent to the
//           profile owner.
//         </p>
//         <p className="text-gray-600">
//           Request ID: {accessRequestStatus.request_id}
//         </p>
//         {showAlert && (
//           <Alert
//             variant={alertConfig.variant}
//             className="mt-4"
//             onClose={() => setShowAlert(false)}>
//             <AlertDescription>{alertConfig.message}</AlertDescription>
//           </Alert>
//         )}
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6 pb-[6rem]">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold mb-4">Report a User</h1>
//         <p className="text-gray-600">
//           If you have encountered inappropriate behavior or content from this
//           user, please report it to us. Your input helps us maintain a safe
//           community.
//         </p>
//         {slug ? (
//           <p className="text-gray-600 mt-2">
//             Reporting user with slug: <strong>{slug}</strong>
//           </p>
//         ) : (
//           <p className="text-red-500 mt-2">Error: User slug not provided.</p>
//         )}
//       </div>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//         <div className="space-y-4">
//           <FormField label="Reason for Reporting" error={errors.reason}>
//             <textarea
//               {...register("reason")}
//               rows={5}
//               placeholder="Describe the reason for reporting this user (e.g., inappropriate content, spam, etc.)"
//               className={`w-full p-2 border rounded-md ${
//                 errors.reason ? "border-red-500" : "border-gray-300"
//               }`}
//             />
//           </FormField>
//         </div>

//         <button
//           type="submit"
//           className="relative flex items-center justify-center rounded-full bg-[#FF4400] text-white hover:text-white px-3 py-2 overflow-hidden transition-all duration-300 hover:rotate-1 hover:bg-red-700 hover:ring-2 hover:ring-white ring-2 ring-red-400">
//           Submit Report
//           <IoArrowForwardCircleOutline className="ml-2" />
//         </button>
//       </form>

//       {showAlert && (
//         <Alert
//           variant={alertConfig.variant}
//           className="mt-4"
//           onClose={() => setShowAlert(false)}>
//           <AlertDescription>{alertConfig.message}</AlertDescription>
//         </Alert>
//       )}
//     </div>
//   );
// };

// export default ReportUser;

import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "../components/tools/Alert";
import {
  IoArrowForwardCircleOutline,
  IoArrowBackCircleOutline,
} from "react-icons/io5";
import backendURL from "../config";

// Validation schema for the report form
const schema = yup.object().shape({
  reason: yup
    .string()
    .required("Please provide a reason for reporting")
    .min(10, "Reason must be at least 10 characters long"),
});

const ReportUser = () => {
  const { token } = useSelector((state) => state.auth);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const slug = searchParams.get("slug"); // Extract slug from URL query params

  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // Track form submission state

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Show alert message
  const showAlertMessage = useCallback((message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  }, []);

  // Handle back button click
  const handleBack = useCallback(() => {
    if (slug) {
      navigate(`/profile/${slug}`);
    } else {
      navigate(-1); // Fallback to previous page if slug is missing
    }
  }, [slug, navigate]);

  // Handle form submission to report the user
  const onSubmit = useCallback(
    async (data) => {
      if (!slug || !token) {
        showAlertMessage("User slug or token is missing", "destructive");
        return;
      }

      setIsSubmitting(true);
      try {
        const response = await fetch(
          `${backendURL}/api/report/user/account/${slug}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ reason: data.reason }),
          }
        );

        const result = await response.json();

        if (response.status === 401 || response.status === 400) {
          showAlertMessage(result.message, "warning");
          setTimeout(() => navigate(`/profile/${slug}`), 3000);
          return;
        }

        if (response.status === 500) {
          showAlertMessage(result.message, "destructive");
          return;
        }

        if (result.status === "success") {
          showAlertMessage(result.message, "success");
          reset();
          setTimeout(() => navigate(`/profile/${slug}`), 3000);
        }
      } catch (error) {
        showAlertMessage("Error submitting report", "destructive");
      } finally {
        setIsSubmitting(false);
      }
    },
    [slug, token, navigate, showAlertMessage, reset]
  );

  // Form field component
  const FormField = ({ label, error, children }) => (
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-medium">{label}</label>
      {children}
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 pb-[6rem]">
      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={handleBack}
          className="flex items-center underline text-gray-600 hover:text-gray-800 transition-colors"
          disabled={!slug}>
          <IoArrowBackCircleOutline className="w-6 h-6 mr-2" />
          Back to Profile
        </button>
      </div>

      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Report a User</h1>
        <p className="text-gray-600">
          If you have encountered inappropriate behavior or content from this
          user, please report it to us. Your input helps us maintain a safe
          community.
        </p>
        {slug ? (
          <p className="text-gray-600 mt-2">
            Reporting user with slug: <strong>{slug}</strong>
          </p>
        ) : (
          <p className="text-red-500 mt-2">Error: User slug not provided.</p>
        )}
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField label="Reason for Reporting" error={errors.reason}>
            <textarea
              {...register("reason")}
              rows={5}
              placeholder="Describe the reason for reporting this user (e.g., inappropriate content, spam, etc.)"
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.reason ? "border-red-500" : "border-gray-300"
              }`}
            />
          </FormField>
        </div>

        {/* Submit Button with Loading Spinner */}
        <button
          type="submit"
          disabled={isSubmitting || !slug}
          className="relative flex items-center justify-center rounded-full bg-[#FF4400] text-white px-3 py-2 transition-all duration-300 hover:bg-red-700 hover:ring-2 hover:ring-white ring-2 ring-red-400 disabled:opacity-50 disabled:cursor-not-allowed">
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Submitting...
            </>
          ) : (
            <>
              Submit Report
              <IoArrowForwardCircleOutline className="ml-2" />
            </>
          )}
        </button>
      </form>

      {/* Alert Section */}
      {showAlert && (
        <Alert
          variant={alertConfig.variant}
          className="mt-4"
          onClose={() => setShowAlert(false)}>
          <AlertDescription>{alertConfig.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ReportUser;

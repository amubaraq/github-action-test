// import React, { useState } from "react";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { Alert, AlertDescription } from "../components/tools/Alert";
// import { Upload } from "lucide-react";
// import { IoArrowForwardCircleOutline } from "react-icons/io5";

// const schema = yup.object().shape({
//   fullName: yup.string().required("Your name is required"),
//   email: yup
//     .string()
//     .email("Invalid email format")
//     .required("Email is required"),
//   phone: yup
//     .string()
//     .matches(/^[0-9+\-\s()]*$/, "Invalid phone number")
//     .required("Phone number is required"),
//   businessName: yup.string().required("Business name is required"),
//   scamDetails: yup
//     .string()
//     .required("Please provide details about the scam or fraud")
//     .min(20, "Please provide more detailed information"),
//   evidence: yup
//     .mixed()
//     .test("fileSize", "File size too large", function (value) {
//       if (!value || !value.length) return true;
//       return Array.from(value).every((file) => file.size <= 5 * 1024 * 1024); // 5MB
//     })
//     .test("fileType", "Unsupported file type", function (value) {
//       if (!value || !value.length) return true;
//       return Array.from(value).every((file) =>
//         [
//           "image/jpeg",
//           "image/png",
//           "application/pdf",
//           "application/msword",
//           "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//         ].includes(file.type)
//       );
//     }),
// });

// const ReportBusiness = () => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm({
//     resolver: yupResolver(schema),
//   });

//   const [showAlert, setShowAlert] = useState(false);
//   const [alertConfig, setAlertConfig] = useState({
//     variant: "default",
//     message: "",
//   });

//   const onSubmit = async (data) => {
//     try {
//       console.log("Form data:", data);
//       showAlertMessage("Report submitted successfully", "success");
//       reset();
//     } catch (error) {
//       showAlertMessage("Error submitting report", "destructive");
//     }
//   };

//   const showAlertMessage = (message, variant = "default") => {
//     setAlertConfig({ message, variant });
//     setShowAlert(true);
//   };

//   const FormField = ({ label, error, children }) => (
//     <div className="flex flex-col space-y-1">
//       <label className="text-sm font-medium">{label}</label>
//       {children}
//       {error && <p className="text-red-500 text-sm">{error.message}</p>}
//     </div>
//   );

//   return (
//     <div className="max-w-4xl mx-auto p-6 pb-[6rem]">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold mb-4">Report a Business Scam</h1>
//         <p className="text-gray-600">
//           If you have encountered a business scam or fraudulent activity, please
//           report it to us. Your input helps us protect others and take necessary
//           actions against unethical practices.
//         </p>
//       </div>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//         <div className="space-y-6">
//           {/* Reporter Information Section */}
//           <div>
//             <h2 className="text-xl font-semibold mb-4">Your Information</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <FormField label="Your Name" error={errors.fullName}>
//                 <input
//                   type="text"
//                   {...register("fullName")}
//                   className={`w-full p-2 border rounded-md ${errors.fullName ? "border-red-500" : "border-gray-300"}`}
//                 />
//               </FormField>

//               <FormField label="Your Email Address" error={errors.email}>
//                 <input
//                   type="email"
//                   {...register("email")}
//                   className={`w-full p-2 border rounded-md ${errors.email ? "border-red-500" : "border-gray-300"}`}
//                 />
//               </FormField>

//               <FormField label="Your Phone Number" error={errors.phone}>
//                 <input
//                   type="tel"
//                   {...register("phone")}
//                   className={`w-full p-2 border rounded-md ${errors.phone ? "border-red-500" : "border-gray-300"}`}
//                 />
//               </FormField>
//             </div>
//           </div>

//           {/* Business Information Section */}
//           <div>
//             <h2 className="text-xl font-semibold mb-4">Business Information</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <FormField label="Business Name" error={errors.businessName}>
//                 <input
//                   type="text"
//                   {...register("businessName")}
//                   className={`w-full p-2 border rounded-md ${errors.businessName ? "border-red-500" : "border-gray-300"}`}
//                 />
//               </FormField>

//               <FormField label="Website URL" error={errors.businessWebsite}>
//                 <input
//                   type="url"
//                   {...register("businessWebsite")}
//                   placeholder="https://"
//                   className={`w-full p-2 border rounded-md ${errors.businessWebsite ? "border-red-500" : "border-gray-300"}`}
//                 />
//               </FormField>

//               <FormField
//                 label="Business ID on Our Website"
//                 error={errors.businessId}>
//                 <input
//                   type="text"
//                   {...register("businessId")}
//                   className="w-full p-2 border rounded-md border-gray-300"
//                 />
//               </FormField>
//             </div>
//           </div>

//           {/* Scam Details Section */}
//           <div>
//             <h2 className="text-xl font-semibold mb-4">Scam Details</h2>
//             <div className="space-y-4">
//               <FormField
//                 label="Details of the Scam or Fraud"
//                 error={errors.scamDetails}>
//                 <textarea
//                   {...register("scamDetails")}
//                   rows={5}
//                   className={`w-full p-2 border rounded-md ${errors.scamDetails ? "border-red-500" : "border-gray-300"}`}
//                 />
//               </FormField>

//               <FormField
//                 label="Attach Evidence (optional)"
//                 error={errors.evidence}>
//                 <input
//                   type="file"
//                   multiple
//                   {...register("evidence")}
//                   accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
//                   className="w-full p-2 border rounded-md border-gray-300"
//                 />
//                 <p className="text-sm text-gray-500 mt-1">
//                   You can upload screenshots, documents, or other relevant
//                   files.
//                 </p>
//               </FormField>
//             </div>
//           </div>
//         </div>

//         <button className="relative flex items-center justify-center rounded-full bg-[#FF4400] text-white hover:text-white px-3 py-2 overflow-hidden transition-all duration-300 hover:rotate-1 hover:bg-red-700 hover:ring-2 hover:ring-white ring-2 ring-red-400">
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

// export default ReportBusiness;

import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Alert, AlertDescription } from "../components/tools/Alert";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import backendURL from "../config";
import { useDispatch, useSelector } from "react-redux";

// Validation schema for the simplified form
const schema = yup.object().shape({
  reason: yup
    .string()
    .required("Please provide a reason for reporting")
    .min(10, "Reason must be at least 10 characters long"),
});

const ReportBusiness = () => {
  const { userInfo, token } = useSelector((state) => state.auth);
  const [searchParams] = useSearchParams(); // Use useSearchParams to get URL query parameters
  const slug = searchParams.get("slug"); // Extract slug from query parameters

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  // Function to show alert messages
  const showAlertMessage = (message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
  };

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (!token) {
        throw new Error("You must be logged in to report a business.");
      }

      if (!slug) {
        throw new Error("Business identifier is missing.");
      }

      // Make API request to report the business
      const response = await fetch(
        `${backendURL}/api/report/business/${slug}`,
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

      if (response.ok && result.status === "success") {
        showAlertMessage("Business reported successfully.", "success");
        reset(); // Reset the form on success
      } else {
        throw new Error(result.message || "Failed to report the business.");
      }
    } catch (error) {
      if (error.message.includes("own Business")) {
        showAlertMessage(
          "You cannot report your own Business or Branch.",
          "destructive"
        );
      } else if (error.message.includes("not found")) {
        showAlertMessage(
          "Business or Branch Profile not found.",
          "destructive"
        );
      } else {
        showAlertMessage(
          error.message || "Error submitting report.",
          "destructive"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Form field component for reusability
  const FormField = ({ label, error, children }) => (
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-medium">{label}</label>
      {children}
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 pb-[6rem]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">
          Reporting a Business or Branch for:
        </h1>
        <h2 className="text-lg first-letter:uppercase font-bold">{slug}</h2>
        <p className="text-gray-600">
          If you believe this business or branch is engaging in inappropriate or
          fraudulent activity, please report it to us. Provide a clear reason
          for your report, and we will review it promptly.
        </p>
      </div>

      {!slug && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>
            No business identifier found. Please make sure the URL includes a
            "slug" parameter.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Reason Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Reason for Reporting</h2>
          <FormField
            label="Describe the reason for reporting this business or branch"
            error={errors.reason}>
            <textarea
              {...register("reason")}
              rows={5}
              placeholder="E.g., Spam content, fraudulent activity, inappropriate behavior, etc."
              className={`w-full p-2 border rounded-md ${
                errors.reason ? "border-red-500" : "border-gray-300"
              }`}
            />
          </FormField>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !slug}
          className={`relative flex items-center justify-center rounded-full bg-[#FF4400] text-white hover:text-white px-3 py-2 overflow-hidden transition-all duration-300 hover:rotate-1 hover:bg-red-700 hover:ring-2 hover:ring-white ring-2 ring-red-400 ${
            loading || !slug ? "opacity-50 cursor-not-allowed" : ""
          }`}>
          {loading ? "Submitting..." : "Submit Report"}
          {!loading && <IoArrowForwardCircleOutline className="ml-2" />}
        </button>
      </form>

      {/* Alert for Success/Error Messages */}
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

export default ReportBusiness;

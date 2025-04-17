// import React, { useState, useCallback, useRef } from "react";
// import { Check, Upload, X } from "lucide-react";
// import { useSelector } from "react-redux";
// import { Alert, AlertDescription } from "../../components/tools/Alert";
// import backendURL from "../../config";
// import LoadingSpinner from "../../components/tools/LoaddingSpinner";

// const VerifyDocuments = () => {
//   const { userInfo, token } = useSelector((state) => state.auth);
//   const [verificationType, setVerificationType] = useState("");
//   const [documentFile, setDocumentFile] = useState(null);
//   const [description, setDescription] = useState("");
//   const [formStatus, setFormStatus] = useState({
//     loading: false,
//     error: null,
//     success: false, // Changed to boolean for simplicity
//   });
//   const [showAlert, setShowAlert] = useState(false);
//   const [alertConfig, setAlertConfig] = useState({
//     variant: "default",
//     message: "",
//   });
//   const fileInputRef = useRef(null);

//   const verificationOptions = [
//     { value: "", label: "Select Verification Type" },
//     { value: "dob", label: "Date of Birth" },
//     { value: "address", label: "Address" },
//     { value: "name", label: "Name" },
//     { value: "recent_jobs", label: "Recent Jobs" },
//     { value: "education", label: "Education" },
//     { value: "nin", label: "National Identification Number (NIN)" },
//     { value: "resume", label: "Resume" },
//     { value: "medical", label: "Medical" },
//     { value: "photo_of_reseidence", label: "Photo Of Your Residence" },
//   ];

//   const showAlertMessage = useCallback((message, variant = "default") => {
//     setAlertConfig({ message, variant });
//     setShowAlert(true);
//     setTimeout(() => setShowAlert(false), 5000);
//   }, []);

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const validTypes = [
//         "image/jpeg",
//         "image/jpg",
//         "image/png",
//         "application/pdf",
//       ];
//       const maxSize = 10 * 1024 * 1024; // 10MB
//       if (!validTypes.includes(file.type)) {
//         showAlertMessage("File must be JPG, JPEG, PNG, or PDF", "destructive");
//         setDocumentFile(null);
//         if (fileInputRef.current) fileInputRef.current.value = "";
//       } else if (file.size > maxSize) {
//         showAlertMessage("File size must not exceed 10MB", "destructive");
//         setDocumentFile(null);
//         if (fileInputRef.current) fileInputRef.current.value = "";
//       } else {
//         setDocumentFile(file);
//         showAlertMessage("File selected successfully", "success");
//       }
//     }
//   };

//   const handleSubmit = useCallback(
//     async (e) => {
//       e.preventDefault();
//       if (!verificationType) {
//         showAlertMessage("Please select a verification type", "destructive");
//         return;
//       }
//       if (!documentFile) {
//         showAlertMessage("Please upload a document", "destructive");
//         return;
//       }
//       if (!description.trim()) {
//         showAlertMessage("Please provide a description", "destructive");
//         return;
//       }

//       const formData = new FormData();
//       formData.append("verification_type", verificationType);
//       formData.append("document", documentFile);
//       formData.append("description", description);

//       try {
//         setFormStatus({ loading: true, error: null, success: false });
//         const response = await fetch(`${backendURL}/api/verify/documents`, {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           body: formData,
//         });

//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.message || "Failed to submit document");
//         }

//         const result = await response.json();
//         console.log(result.pending_documents, "result");
//         console.log(result.pending_documents, "pending_documents is an array");
//         console.log(
//           result.submitted_documents,
//           "submitted_documents is an array"
//         );
//         showAlertMessage(result.message, "success");
//         setFormStatus({ loading: false, error: null, success: true });
//         setVerificationType("");
//         setDocumentFile(null);
//         setDescription("");
//         if (fileInputRef.current) fileInputRef.current.value = "";

//         // Auto-close the success modal after 5 seconds
//         setTimeout(() => {
//           setFormStatus((prev) => ({ ...prev, success: false }));
//         }, 5000);
//       } catch (error) {
//         showAlertMessage(error.message, "destructive");
//         setFormStatus({ loading: false, error: error.message, success: false });
//       }
//     },
//     [verificationType, documentFile, description, token, showAlertMessage]
//   );

//   const handleRemoveFile = () => {
//     setDocumentFile(null);
//     if (fileInputRef.current) fileInputRef.current.value = "";
//     showAlertMessage("Document removed", "warning");
//   };

//   const handleCloseSuccessModal = () => {
//     setFormStatus((prev) => ({ ...prev, success: false }));
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col p-3 md:p-5 mid:mt-16">
//       <main className="flex-1 bg-white shadow-md rounded-lg p-5 max-w-2xl mx-auto">
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-gray-800">Verify Documents</h1>
//           <p className="text-sm text-gray-600 mt-1">
//             Upload a document to verify your details. Accepted formats: JPG,
//             PNG, PDF (max 10MB).
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Verification Type Selection */}
//           <div>
//             <label className="block mb-1 text-sm font-medium text-gray-700">
//               Verification Type <span className="text-red-500">*</span>
//             </label>
//             <select
//               value={verificationType}
//               onChange={(e) => setVerificationType(e.target.value)}
//               className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300 border-gray-200">
//               {verificationOptions.map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Description Input */}
//           <div>
//             <label className="block mb-1 text-sm font-medium text-gray-700">
//               Description <span className="text-red-500">*</span>
//             </label>
//             <textarea
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="Enter a brief description of the document"
//               className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300 border-gray-200 resize-y min-h-[100px]"
//               required
//             />
//           </div>

//           {/* Document Upload */}
//           <div>
//             <label className="block mb-1 text-sm font-medium text-gray-700">
//               Upload Document <span className="text-red-500">*</span>
//             </label>
//             <div className="flex items-center gap-3">
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 onChange={handleFileChange}
//                 accept=".jpg,.jpeg,.png,.pdf"
//                 className="hidden"
//                 id="document-upload"
//               />
//               <label
//                 htmlFor="document-upload"
//                 className="flex-1 p-2 text-sm border rounded-md border-gray-200 hover:border-blue-300 cursor-pointer flex items-center justify-between bg-white">
//                 {documentFile ? documentFile.name : "Choose a file"}
//                 <Upload size={18} className="text-gray-500" />
//               </label>
//               {documentFile && (
//                 <button
//                   type="button"
//                   onClick={handleRemoveFile}
//                   className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200">
//                   <X size={18} />
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Submit Button */}
//           <div className="flex justify-end">
//             <button
//               type="submit"
//               disabled={formStatus.loading}
//               className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 flex items-center">
//               {formStatus.loading ? (
//                 <span className="flex items-center">
//                   {/* Tailwind CSS spinner */}
//                   <svg
//                     className="animate-spin h-5 w-5 mr-2 text-white"
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 24 24">
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     />

//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8v8H4z"
//                     />
//                   </svg>
//                   Submitting...
//                 </span>
//               ) : (
//                 <>
//                   Submit Document
//                   <Upload size={18} className="ml-2" />
//                 </>
//               )}
//             </button>
//           </div>
//         </form>

//         {/* Success Modal */}
//         {formStatus.success && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 max-w-md w-full text-center">
//               <div className="flex justify-end">
//                 <button
//                   onClick={handleCloseSuccessModal}
//                   className="text-gray-500 hover:text-gray-700">
//                   <X size={20} />
//                 </button>
//               </div>
//               <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500 text-white">
//                 <Check size={24} strokeWidth={2} />
//               </div>
//               <h2 className="text-lg font-semibold text-gray-800 mt-2">
//                 Document Submitted
//               </h2>
//               <p className="text-sm text-gray-600 mt-2">
//                 Your document is pending review. You’ll be notified once it’s
//                 processed.
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Alert Component */}
//         {showAlert && (
//           <Alert
//             variant={alertConfig.variant}
//             show={showAlert}
//             onClose={() => setShowAlert(false)}
//             autoClose={true}
//             autoCloseTime={5000}>
//             <AlertDescription>{alertConfig.message}</AlertDescription>
//           </Alert>
//         )}
//       </main>
//     </div>
//   );
// };

// export default VerifyDocuments;

import React, { useState, useCallback, useRef } from "react";
import { Check, Upload, X } from "lucide-react";
import { useSelector } from "react-redux";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import backendURL from "../../config";

const VerifyDocuments = () => {
  const { userInfo, token } = useSelector((state) => state.auth);
  const [verificationType, setVerificationType] = useState("");
  const [documentFile, setDocumentFile] = useState(null);
  const [description, setDescription] = useState("");
  const [formStatus, setFormStatus] = useState({
    loading: false,
    error: null,
    success: false,
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });
  const [pendingDocuments, setPendingDocuments] = useState([]);
  const [submittedDocuments, setSubmittedDocuments] = useState([]);
  const fileInputRef = useRef(null);

  const verificationOptions = [
    { value: "", label: "Select Verification Type" },
    { value: "dob", label: "Date of Birth" },
    { value: "address", label: "Address" },
    { value: "name", label: "Name" },
    { value: "recent_jobs", label: "Recent Jobs" },
    { value: "education", label: "Education" },
    { value: "nin", label: "National Identification Number (NIN)" },
    { value: "resume", label: "Resume" },
    { value: "medical", label: "Medical" },
    { value: "photo_of_reseidence", label: "Photo Of Your Residence" },
  ];

  const showAlertMessage = useCallback((message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "application/pdf",
      ];
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (!validTypes.includes(file.type)) {
        showAlertMessage("File must be JPG, JPEG, PNG, or PDF", "destructive");
        setDocumentFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else if (file.size > maxSize) {
        showAlertMessage("File size must not exceed 10MB", "destructive");
        setDocumentFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        setDocumentFile(file);
        showAlertMessage("File selected successfully", "success");
      }
    }
  };

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!verificationType) {
        showAlertMessage("Please select a verification type", "destructive");
        return;
      }
      if (!documentFile) {
        showAlertMessage("Please upload a document", "destructive");
        return;
      }
      if (!description.trim()) {
        showAlertMessage("Please provide a description", "destructive");
        return;
      }

      const formData = new FormData();
      formData.append("verification_type", verificationType);
      formData.append("document", documentFile);
      formData.append("description", description);

      try {
        setFormStatus({ loading: true, error: null, success: false });
        const response = await fetch(`${backendURL}/api/verify/documents`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to submit document");
        }

        const result = await response.json();
        // Extract values from pending_documents object
        setPendingDocuments(
          Object.values(result.pending_documents || {}).length > 0
            ? Object.values(result.pending_documents)
            : []
        );
        console.log("Pending Documents:", pendingDocuments); // Debug
        console.log("Result pending_documents:", result.pending_documents); // Debug
        // Handle submitted_documents as an array or object values
        setSubmittedDocuments(
          Array.isArray(result.submitted_documents)
            ? result.submitted_documents
            : Object.values(result.submitted_documents || {}).length > 0
              ? Object.values(result.submitted_documents)
              : []
        );
        console.log("Submitted Documents:", submittedDocuments); // Debug
        showAlertMessage(result.message, "success");
        setFormStatus({ loading: false, error: null, success: true });
        setVerificationType("");
        setDocumentFile(null);
        setDescription("");
        if (fileInputRef.current) fileInputRef.current.value = "";
      } catch (error) {
        showAlertMessage(error.message, "destructive");
        setFormStatus({ loading: false, error: error.message, success: false });
      }
    },
    [
      verificationType,
      documentFile,
      description,
      token,
      showAlertMessage,
      pendingDocuments,
      submittedDocuments,
    ]
  );

  const handleRemoveFile = () => {
    setDocumentFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    showAlertMessage("Document removed", "warning");
  };

  const handleCloseSuccessModal = () => {
    setFormStatus((prev) => ({ ...prev, success: false }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-3 md:p-5 mid:mt-16">
      <main className="flex-1 bg-white shadow-md rounded-lg p-5 max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Verify Documents</h1>
          <p className="text-sm text-gray-600 mt-1">
            Upload a document to verify your details. Accepted formats: JPG,
            PNG, PDF (max 10MB).
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Verification Type Selection */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Verification Type <span className="text-red-500">*</span>
            </label>
            <select
              value={verificationType}
              onChange={(e) => setVerificationType(e.target.value)}
              className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300 border-gray-200">
              {verificationOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description Input */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a brief description of the document"
              className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-blue-300 border-gray-200 resize-y min-h-[100px]"
              required
            />
          </div>

          {/* Document Upload */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Upload Document <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.pdf"
                className="hidden"
                id="document-upload"
              />
              <label
                htmlFor="document-upload"
                className="flex-1 p-2 text-sm border rounded-md border-gray-200 hover:border-blue-300 cursor-pointer flex items-center justify-between bg-white">
                {documentFile ? documentFile.name : "Choose a file"}
                <Upload size={18} className="text-gray-500" />
              </label>
              {documentFile && (
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200">
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={formStatus.loading}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 flex items-center">
              {formStatus.loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
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
                </span>
              ) : (
                <>
                  Submit Document
                  <Upload size={18} className="ml-2" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Success Modal */}
        {formStatus.success && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full text-center max-h-[90vh] overflow-y-auto">
              {/* Close Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleCloseSuccessModal}
                  className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>

              {/* Success Icon and Message */}
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500 text-white mb-4">
                <Check size={24} strokeWidth={2} />
              </div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">
                Document Submitted Successfully
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Your document is pending review. You’ll be notified once it’s
                processed.
              </p>

              {/* Pending Documents */}
              <div className="mb-6">
                <h3 className="text-base font-medium text-gray-700 mb-2">
                  Pending Documents
                </h3>
                {pendingDocuments.length > 0 ? (
                  <ul className="text-sm text-gray-600 space-y-2 max-h-40 overflow-y-auto">
                    {pendingDocuments.map((doc, index) => (
                      <li
                        key={index}
                        className="p-2 bg-gray-100 rounded-md flex justify-between items-center">
                        <span>
                          {verificationOptions.find((opt) => opt.value === doc)
                            ?.label || doc}
                        </span>
                        <span className="text-yellow-500 font-medium">
                          Pending
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No pending documents.</p>
                )}
              </div>

              {/* Submitted Documents */}
              <div>
                <h3 className="text-base font-medium text-gray-700 mb-2">
                  Submitted Documents
                </h3>
                {submittedDocuments.length > 0 ? (
                  <ul className="text-sm text-gray-600 space-y-2 max-h-40 overflow-y-auto">
                    {submittedDocuments.map((doc, index) => (
                      <li
                        key={index}
                        className="p-2 bg-gray-100 rounded-md flex justify-between items-center">
                        <span>
                          {verificationOptions.find((opt) => opt.value === doc)
                            ?.label || doc}
                        </span>
                        <span className="text-green-500 font-medium">
                          Submitted
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">
                    No submitted documents.
                  </p>
                )}
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
      </main>
    </div>
  );
};

export default VerifyDocuments;

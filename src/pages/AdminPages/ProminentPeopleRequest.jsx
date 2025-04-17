// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import backendURL from "../../config";

// const ProminentPeopleRequest = () => {
// const { token } = useSelector((state) => state.auth);
// const [submissions, setSubmissions] = useState([]);
// const [loading, setLoading] = useState(true);
// const [error, setError] = useState(null);
// const [selectedSubmission, setSelectedSubmission] = useState(null);
// const [reviewStatus, setReviewStatus] = useState("approved");
// const [rejectionReason, setRejectionReason] = useState("");
// const [isProcessing, setIsProcessing] = useState(false);

// useEffect(() => {
//     const fetchPendingSubmissions = async () => {
//     try {
//         setLoading(true);
//         const response = await axios.get(
//         `${backendURL}/api/admin/prominent-people/pending`,
//         {
//             headers: {
//             Authorization: `Bearer ${token}`,
//             },
//         }
//         );
//         setSubmissions(response.data.data);
//     } catch (err) {
//         setError(err.response?.data?.message || "Failed to fetch submissions");
//     } finally {
//         setLoading(false);
//     }
//     };

//     fetchPendingSubmissions();
// }, [token]);

// const handleReview = async () => {
//     if (!selectedSubmission) return;
//     if (reviewStatus === "rejected" && !rejectionReason.trim()) {
//     setError("Please provide a rejection reason");
//     return;
//     }

//     setIsProcessing(true);
//     setError(null);

//     try {
//     const response = await axios.post(
//         `${backendURL}/api/admin/prominent-people/${selectedSubmission.id}/review`,
//         {
//         status: reviewStatus,
//         rejection_reason:
//             reviewStatus === "rejected" ? rejectionReason : null,
//         },
//         {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//         }
//     );

//     // Remove the reviewed submission from the list
//     setSubmissions(
//         submissions.filter((sub) => sub.id !== selectedSubmission.id)
//     );
//     setSelectedSubmission(null);
//     setRejectionReason("");
//     } catch (err) {
//     setError(
//         err.response?.data?.message || "Review failed. Please try again."
//     );
//     } finally {
//     setIsProcessing(false);
//     }
// };

// if (loading) {
//     return (
//     <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//     </div>
//     );
// }

// if (error) {
//     return (
//     <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center">
//         {error}
//     </div>
//     );
// }

// return (
//     <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md">
//     <h2 className="text-2xl font-bold mb-6 text-gray-800">
//         Pending Prominent People Submissions
//     </h2>

//     {submissions.length === 0 ? (
//         <div className="text-center py-8 text-gray-500">
//         No pending submissions at this time.
//         </div>
//     ) : (
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Submission Table */}
//         <div className="lg:col-span-1">
//             <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//                 <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     ID
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Name
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Submitted By
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Submitted At
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                 </th>
//                 </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//                 {submissions.map((submission) => (
//                 <tr
//                     key={submission.id}
//                     className={
//                     selectedSubmission?.id === submission.id
//                         ? "bg-blue-50"
//                         : ""
//                     }>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                     {submission.id}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                     {submission.name}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                     {submission.submitted_by.name}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                     {new Date(submission.submitted_at).toLocaleDateString()}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                     <button
//                         onClick={() => setSelectedSubmission(submission)}
//                         className="text-blue-600 hover:text-blue-900">
//                         View Details
//                     </button>
//                     </td>
//                 </tr>
//                 ))}
//             </tbody>
//             </table>
//         </div>

//         {/* Submission Details and Review */}
//         {selectedSubmission && (
//             <div className="lg:col-span-2">
//             <div className="bg-gray-50 p-6 rounded-lg">
//                 <h3 className="text-xl font-bold mb-4">
//                 {selectedSubmission.name}
//                 </h3>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//                 <div>
//                     <p className="text-sm text-gray-500">Birth Date</p>
//                     <p className="font-medium">
//                     {selectedSubmission.birth_date || "N/A"}
//                     </p>
//                 </div>
//                 <div>
//                     <p className="text-sm text-gray-500">Death Date</p>
//                     <p className="font-medium">
//                     {selectedSubmission.death_date || "N/A"}
//                     </p>
//                 </div>
//                 <div>
//                     <p className="text-sm text-gray-500">Nationality</p>
//                     <p className="font-medium">
//                     {selectedSubmission.nationality || "N/A"}
//                     </p>
//                 </div>
//                 <div>
//                     <p className="text-sm text-gray-500">Occupation</p>
//                     <p className="font-medium">
//                     {selectedSubmission.occupation || "N/A"}
//                     </p>
//                 </div>
//                 </div>

//                 <div className="mb-6">
//                 <p className="text-sm text-gray-500 mb-1">Biography</p>
//                 <div
//                     className="whitespace-pre-line p-3 bg-white rounded-md"
//                     dangerouslySetInnerHTML={{
//                     __html: selectedSubmission.biography,
//                     }}
//                 />
//                 </div>

//                 {selectedSubmission.achievements &&
//                 selectedSubmission.achievements.length > 0 && (
//                     <div className="mb-6">
//                     <p className="text-sm text-gray-500 mb-1">Achievements</p>
//                     <ul className="list-disc pl-5 bg-white p-3 rounded-md">
//                         {selectedSubmission.achievements.map(
//                         (achievement, index) => (
//                             <li key={index} className="mb-1">
//                             {achievement}
//                             </li>
//                         )
//                         )}
//                     </ul>
//                     </div>
//                 )}

//                 <div className="mb-6">
//                 <p className="text-sm text-gray-500 mb-2">Submitted by</p>
//                 <div className="bg-white p-3 rounded-md">
//                     <p className="font-medium">
//                     {selectedSubmission.submitted_by.name}
//                     </p>
//                     <p className="text-gray-600">
//                     {selectedSubmission.submitted_by.email}
//                     </p>
//                 </div>
//                 </div>

//                 {/* Review Form */}
//                 <div className="mt-8 pt-6 border-t border-gray-200">
//                 <h4 className="text-lg font-medium mb-4">
//                     Review Submission
//                 </h4>

//                 <div className="space-y-4">
//                     <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Status
//                     </label>
//                     <select
//                         value={reviewStatus}
//                         onChange={(e) => setReviewStatus(e.target.value)}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
//                         <option value="approved">Approve</option>
//                         <option value="rejected">Reject</option>
//                     </select>
//                     </div>

//                     {reviewStatus === "rejected" && (
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                         Rejection Reason *
//                         </label>
//                         <textarea
//                         value={rejectionReason}
//                         onChange={(e) => setRejectionReason(e.target.value)}
//                         rows={3}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         placeholder="Provide a reason for rejection..."
//                         />
//                     </div>
//                     )}

//                     <div className="flex justify-end space-x-3">
//                     <button
//                         onClick={() => {
//                         setSelectedSubmission(null);
//                         setRejectionReason("");
//                         }}
//                         className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
//                         Cancel
//                     </button>
//                     <button
//                         onClick={handleReview}
//                         disabled={
//                         isProcessing ||
//                         (reviewStatus === "rejected" &&
//                             !rejectionReason.trim())
//                         }
//                         className={`px-4 py-2 rounded-md text-white ${
//                         reviewStatus === "approved"
//                             ? "bg-green-600 hover:bg-green-700"
//                             : "bg-red-600 hover:bg-red-700"
//                         } disabled:opacity-50 disabled:cursor-not-allowed`}>
//                         {isProcessing
//                         ? "Processing..."
//                         : reviewStatus === "approved"
//                             ? "Approve"
//                             : "Reject"}
//                     </button>
//                     </div>
//                 </div>
//                 </div>
//             </div>
//             </div>
//         )}
//         </div>
//     )}
//     </div>
// );
// };

// export default ProminentPeopleRequest;
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import backendURL from "../../config";

const ProminentPeopleRequest = () => {
  const { token } = useSelector((state) => state.auth);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [reviewStatus, setReviewStatus] = useState("approved");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPendingSubmissions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${backendURL}/api/admin/prominent-people/pending`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSubmissions(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch submissions");
      } finally {
        setLoading(false);
      }
    };

    fetchPendingSubmissions();
  }, [token]);

  const handleReview = async () => {
    if (!selectedSubmission) return;
    if (reviewStatus === "rejected" && !rejectionReason.trim()) {
      setError("Please provide a rejection reason");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const response = await axios.post(
        `${backendURL}/api/admin/prominent-people/${selectedSubmission.id}/review`,
        {
          status: reviewStatus,
          rejection_reason:
            reviewStatus === "rejected" ? rejectionReason : null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove the reviewed submission from the list
      setSubmissions(
        submissions.filter((sub) => sub.id !== selectedSubmission.id)
      );
      closeModal();
    } catch (err) {
      setError(
        err.response?.data?.message || "Review failed. Please try again."
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const openModal = (submission) => {
    setSelectedSubmission(submission);
    setReviewStatus("approved");
    setRejectionReason("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSubmission(null);
    setRejectionReason("");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">
        Pending Prominent People Submissions
      </h2>

      {submissions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No pending submissions at this time.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted By
                </th>
                <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted At
                </th>
                <th className="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap">
                    {submission.id}
                  </td>
                  <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap">
                    {submission.name}
                  </td>
                  <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap">
                    {submission.submitted_by.name}
                  </td>
                  <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap">
                    {new Date(submission.submitted_at).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2 sm:px-6 sm:py-4 whitespace-nowrap">
                    <button
                      onClick={() => openModal(submission)}
                      className="text-blue-600 hover:text-blue-900 text-sm sm:text-base">
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for submission details and review */}
      {isModalOpen && selectedSubmission && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
              onClick={closeModal}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            {/* Modal container */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-bold mb-4 text-gray-800">
                  Review Submission: {selectedSubmission.name}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Birth Date</p>
                    <p className="font-medium">
                      {selectedSubmission.birth_date || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Death Date</p>
                    <p className="font-medium">
                      {selectedSubmission.death_date || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Nationality</p>
                    <p className="font-medium">
                      {selectedSubmission.nationality || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Occupation</p>
                    <p className="font-medium">
                      {selectedSubmission.occupation || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Biography</p>
                  <div
                    className="whitespace-pre-line p-3 bg-gray-50 rounded-md max-h-40 overflow-y-auto"
                    dangerouslySetInnerHTML={{
                      __html: selectedSubmission.biography,
                    }}
                  />
                </div>

                {selectedSubmission.achievements &&
                  selectedSubmission.achievements.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">Achievements</p>
                      <ul className="list-disc pl-5 bg-gray-50 p-3 rounded-md max-h-40 overflow-y-auto">
                        {selectedSubmission.achievements.map(
                          (achievement, index) => (
                            <li key={index} className="mb-1">
                              {achievement}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-1">Submitted by</p>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="font-medium">
                      {selectedSubmission.submitted_by.name}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {selectedSubmission.submitted_by.email}
                    </p>
                  </div>
                </div>

                {/* Review Form */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={reviewStatus}
                        onChange={(e) => setReviewStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                        <option value="approved">Approve</option>
                        <option value="rejected">Reject</option>
                      </select>
                    </div>

                    {reviewStatus === "rejected" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Rejection Reason *
                        </label>
                        <textarea
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          placeholder="Provide a reason for rejection..."
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  onClick={handleReview}
                  disabled={
                    isProcessing ||
                    (reviewStatus === "rejected" && !rejectionReason.trim())
                  }
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm ${
                    reviewStatus === "approved"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-600 hover:bg-red-700"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}>
                  {isProcessing
                    ? "Processing..."
                    : reviewStatus === "approved"
                      ? "Approve"
                      : "Reject"}
                </button>
                <button
                  onClick={closeModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProminentPeopleRequest;

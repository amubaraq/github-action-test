// import React, { useCallback, useEffect, useState, useRef } from "react";
// import { useSelector } from "react-redux";
// import { useFormik } from "formik";
// import { Alert, AlertDescription } from "../components/tools/Alert";
// import backendURL from "../config";
// import { Send, Star, X } from "lucide-react";
// import Modal from "react-modal";

// // Bind modal to app root for accessibility
// Modal.setAppElement("#root");

// const BusinessReview = ({ businessSlug }) => {
//   const { userInfo, token } = useSelector((state) => state.auth);
//   const [formStatus, setFormStatus] = useState({
//     loading: false,
//     error: null,
//     success: null,
//   });
//   const [reviews, setReviews] = useState([]);
//   const [loadingReviews, setLoadingReviews] = useState(true);
//   const [errorReviews, setErrorReviews] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [currentPage, setCurrentPage] = useState(0);
//   const carouselRef = useRef(null);

//   useEffect(() => {
//     if (isModalOpen) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "auto";
//     }
//     return () => {
//       document.body.style.overflow = "auto";
//     };
//   }, [isModalOpen]);

//   const reviewsPerPage = 4;
//   const totalPages = Math.ceil(reviews.length / reviewsPerPage);

//   const averageRating =
//     reviews.length > 0
//       ? (
//           reviews.reduce((sum, review) => sum + review.rating, 0) /
//           reviews.length
//         ).toFixed(1)
//       : 0;

//   const showAlert = (message, variant = "default") => {
//     setFormStatus((prev) => ({
//       ...prev,
//       error: message,
//       success: variant === "success",
//     }));
//     setTimeout(
//       () => setFormStatus((prev) => ({ ...prev, error: null, success: null })),
//       5000
//     );
//   };

//   const fetchReviews = useCallback(async () => {
//     setLoadingReviews(true);
//     try {
//       // Adjust this endpoint if there's a specific GET endpoint for business reviews
//       const response = await fetch(
//         `${backendURL}/api/business/${businessSlug}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       const data = await response.json();
//       console.log(data);
//       if (data.status === "success" && data.data) {
//         setReviews(data.data.reviews || []);
//       } else {
//         setErrorReviews("No reviews found for this business");
//       }
//     } catch (err) {
//       setErrorReviews("Error fetching business reviews");
//     } finally {
//       setLoadingReviews(false);
//     }
//   }, [businessSlug, token]);

//   useEffect(() => {
//     fetchReviews();
//   }, [fetchReviews]);

//   const handleSubmit = useCallback(
//     async (values, { resetForm }) => {
//       setFormStatus((prev) => ({ ...prev, loading: true }));
//       try {
//         const response = await fetch(`${backendURL}/api/review/business`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ business_slug: businessSlug, ...values }),
//         });
//         const result = await response.json();
//         if (!response.ok) {
//           throw new Error(result.message || "Failed to submit review");
//         }
//         showAlert("Business review submitted successfully!", "success");
//         setIsModalOpen(false);
//         resetForm();
//         fetchReviews();
//       } catch (error) {
//         showAlert(error.message, "destructive");
//       } finally {
//         setFormStatus((prev) => ({ ...prev, loading: false }));
//       }
//     },
//     [businessSlug, token, fetchReviews]
//   );

//   const formik = useFormik({
//     initialValues: { rating: 0, review: "" },
//     validate: (values) => {
//       const errors = {};
//       if (!values.rating) errors.rating = "Rating is required";
//       if (values.rating < 1 || values.rating > 5)
//         errors.rating = "Rating must be between 1 and 5";
//       if (values.review?.length > 1000) errors.review = "Max 1000 characters";
//       return errors;
//     },
//     onSubmit: handleSubmit,
//   });

//   const renderStars = () => (
//     <div className="flex gap-1">
//       {[1, 2, 3, 4, 5].map((star) => (
//         <Star
//           key={star}
//           size={24}
//           className={`cursor-pointer ${
//             star <= formik.values.rating
//               ? "text-yellow-400 fill-yellow-400"
//               : "text-gray-300"
//           }`}
//           onClick={() => formik.setFieldValue("rating", star)}
//         />
//       ))}
//       {formik.touched.rating && formik.errors.rating && (
//         <p className="text-xs text-red-500">{formik.errors.rating}</p>
//       )}
//     </div>
//   );

//   const renderAverageStars = (rating) => (
//     <div className="flex items-center gap-1">
//       {[...Array(5)].map((_, i) => (
//         <Star
//           key={i}
//           size={16}
//           className={
//             i < Math.round(rating)
//               ? "text-yellow-400 fill-yellow-400"
//               : "text-gray-300"
//           }
//         />
//       ))}
//     </div>
//   );

//   const nextPage = () => {
//     const next = Math.min(currentPage + 1, totalPages - 1);
//     setCurrentPage(next);
//     if (carouselRef.current) {
//       const cardWidth =
//         carouselRef.current.querySelector(".review-card")?.offsetWidth || 0;
//       const scrollPosition = next * reviewsPerPage * cardWidth;
//       carouselRef.current.scrollTo({
//         left: scrollPosition,
//         behavior: "smooth",
//       });
//     }
//   };

//   const prevPage = () => {
//     const prev = Math.max(currentPage - 1, 0);
//     setCurrentPage(prev);
//     if (carouselRef.current) {
//       const cardWidth =
//         carouselRef.current.querySelector(".review-card")?.offsetWidth || 0;
//       const scrollPosition = prev * reviewsPerPage * cardWidth;
//       carouselRef.current.scrollTo({
//         left: scrollPosition,
//         behavior: "smooth",
//       });
//     }
//   };

//   const handleScroll = () => {
//     if (carouselRef.current) {
//       const cardWidth =
//         carouselRef.current.querySelector(".review-card")?.offsetWidth || 0;
//       if (cardWidth === 0) return;
//       const scrollPosition = carouselRef.current.scrollLeft;
//       const newPage = Math.round(scrollPosition / (cardWidth * reviewsPerPage));
//       setCurrentPage(newPage);
//     }
//   };

//   const getInitials = (name) => {
//     if (!name) return "?";
//     return name
//       .split(" ")
//       .map((part) => part[0])
//       .join("")
//       .toUpperCase();
//   };

//   const getAvatarColor = (name) => {
//     if (!name) return "bg-blue-500";
//     const colors = [
//       "bg-blue-500",
//       "bg-green-500",
//       "bg-purple-500",
//       "bg-pink-500",
//       "bg-indigo-500",
//       "bg-rose-500",
//       "bg-amber-500",
//       "bg-emerald-500",
//       "bg-cyan-500",
//     ];
//     const hash = name
//       .split("")
//       .reduce((acc, char) => acc + char.charCodeAt(0), 0);
//     return colors[hash % colors.length];
//   };

//   return (
//     <div className="bg-white p-6 rounded-xl shadow-md">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-semibold flex items-center gap-2">
//           <span className="text-blue-500">★</span> Business Reviews
//         </h2>
//         {userInfo && token && (
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm">
//             Write a Review
//           </button>
//         )}
//       </div>

//       {loadingReviews ? (
//         <p className="text-center py-8 text-gray-600">Loading reviews...</p>
//       ) : errorReviews ? (
//         <p className="text-center py-8 text-gray-600">{errorReviews}</p>
//       ) : reviews.length === 0 ? (
//         <p className="text-center py-8 text-gray-600">No reviews yet!</p>
//       ) : (
//         <div>
//           <div className="mb-4">
//             <div className="flex items-center gap-2">
//               <span className="text-2xl font-bold text-gray-800">
//                 {averageRating}
//               </span>
//               {renderAverageStars(averageRating)}
//               <span className="text-sm text-gray-500">
//                 ({reviews.length} reviews)
//               </span>
//             </div>
//           </div>

//           <div
//             ref={carouselRef}
//             className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar"
//             onScroll={handleScroll}>
//             {reviews.map((review) => (
//               <div
//                 key={review.id}
//                 className="review-card snap-start flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2">
//                 <div className="bg-gray-50 p-4 rounded-lg shadow-sm items-center gap-3 hover:shadow-md transition-shadow duration-300">
//                   <div className="flex">
//                     <div
//                       className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-medium ${
//                         review.avatar_url
//                           ? ""
//                           : getAvatarColor(review.reviewer_name)
//                       }`}>
//                       {review.avatar_url ? (
//                         <img
//                           src={review.avatar_url}
//                           alt={review.reviewer_name || "Reviewer"}
//                           className="w-full h-full object-cover rounded-full"
//                         />
//                       ) : (
//                         <span>{getInitials(review.reviewer_name)}</span>
//                       )}
//                     </div>
//                     <div className="text-sm align-middle items-center mt-3 ml-2 font-semibold text-gray-800">
//                       {review.reviewer_name}
//                     </div>
//                   </div>
//                   <div className="flex-1">
//                     <div className="flex items-center gap-1 my-2">
//                       {[...Array(5)].map((_, i) => (
//                         <Star
//                           key={i}
//                           size={12}
//                           className={
//                             i < review.rating
//                               ? "text-yellow-400 fill-yellow-400"
//                               : "text-gray-300"
//                           }
//                         />
//                       ))}
//                     </div>
//                     <p className="text-sm text-gray-700 mb-1">
//                       "{review.review || "Great business!"}"
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       {new Date(review.created_at).toLocaleDateString()}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {totalPages > 1 && (
//             <div className="mt-4 flex justify-center gap-2">
//               <button
//                 onClick={prevPage}
//                 disabled={currentPage === 0}
//                 className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md disabled:opacity-50 hover:bg-gray-300 transition-colors duration-200">
//                 Previous
//               </button>
//               {Array.from({ length: totalPages }, (_, i) => i).map((number) => (
//                 <button
//                   key={number}
//                   onClick={() => {
//                     setCurrentPage(number);
//                     if (carouselRef.current) {
//                       const cardWidth =
//                         carouselRef.current.querySelector(".review-card")
//                           ?.offsetWidth || 0;
//                       const scrollPosition =
//                         number * reviewsPerPage * cardWidth;
//                       carouselRef.current.scrollTo({
//                         left: scrollPosition,
//                         behavior: "smooth",
//                       });
//                     }
//                   }}
//                   className={`px-3 py-1 rounded-md ${
//                     currentPage === number
//                       ? "bg-blue-500 text-white"
//                       : "bg-gray-200 text-gray-800 hover:bg-gray-300"
//                   } transition-colors duration-200`}>
//                   {number + 1}
//                 </button>
//               ))}
//               <button
//                 onClick={nextPage}
//                 disabled={currentPage === totalPages - 1}
//                 className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md disabled:opacity-50 hover:bg-gray-300 transition-colors duration-200">
//                 Next
//               </button>
//             </div>
//           )}
//         </div>
//       )}

//       {formStatus.error && (
//         <Alert
//           variant={formStatus.success ? "success" : "destructive"}
//           show={!!formStatus.error}
//           autoClose
//           autoCloseTime={5000}>
//           <AlertDescription>{formStatus.error}</AlertDescription>
//         </Alert>
//       )}

//       <Modal
//         isOpen={isModalOpen}
//         onRequestClose={() => setIsModalOpen(false)}
//         style={{
//           content: {
//             top: "50%",
//             left: "50%",
//             right: "auto",
//             bottom: "auto",
//             marginRight: "-50%",
//             transform: "translate(-50%, -50%)",
//             maxWidth: "28rem",
//             width: "90%",
//             padding: "1.5rem",
//             border: "2px solid #93c5fd",
//             borderRadius: "0.5rem",
//             boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
//           },
//           overlay: {
//             zIndex: 100,
//             backgroundColor: "rgba(0, 0, 0, 0.5)",
//           },
//         }}
//         contentLabel="Business Review Modal">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-lg font-semibold text-gray-800">
//             Submit a Business Review
//           </h2>
//           <button
//             onClick={() => setIsModalOpen(false)}
//             className="text-gray-500 hover:text-gray-700">
//             <X size={20} />
//           </button>
//         </div>
//         {!userInfo || !token ? (
//           <p className="text-sm text-gray-600">
//             Please log in to submit a review.
//           </p>
//         ) : (
//           <form onSubmit={formik.handleSubmit} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">
//                 Rating *
//               </label>
//               {renderStars()}
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-600 mb-1">
//                 Review (Optional)
//               </label>
//               <textarea
//                 name="review"
//                 value={formik.values.review}
//                 onChange={formik.handleChange}
//                 onBlur={formik.handleBlur}
//                 className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 resize-y"
//                 rows="4"
//                 placeholder="Write your review here (max 1000 characters)"
//               />
//               {formik.touched.review && formik.errors.review && (
//                 <p className="text-xs text-red-500">{formik.errors.review}</p>
//               )}
//             </div>
//             <div className="flex justify-end">
//               <button
//                 type="submit"
//                 disabled={formStatus.loading}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
//                 {formStatus.loading && <span className="animate-spin">◌</span>}
//                 {formStatus.loading ? "Submitting..." : "Submit Review"}
//                 {!formStatus.loading && <Send size={16} />}
//               </button>
//             </div>
//           </form>
//         )}
//       </Modal>

//       <style jsx global>{`
//         .hide-scrollbar::-webkit-scrollbar {
//           display: none;
//         }
//         .hide-scrollbar {
//           -ms-overflow-style: none;
//           scrollbar-width: none;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default BusinessReview;
import React, { useCallback, useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { Alert, AlertDescription } from "../components/tools/Alert";
import backendURL from "../config";
import { Send, Star, X } from "lucide-react";
import Modal from "react-modal";

// Bind modal to app root for accessibility
Modal.setAppElement("#root");

const BusinessReview = ({ businessSlug }) => {
  const { userInfo, token } = useSelector((state) => state.auth);
  const [formStatus, setFormStatus] = useState({
    loading: false,
    error: null,
    success: null,
  });
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [errorReviews, setErrorReviews] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [businessData, setBusinessData] = useState(null);
  const carouselRef = useRef(null);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  const reviewsPerPage = 4;
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const averageRating = businessData?.average_rating || 0;

  const showAlert = (message, variant = "default") => {
    setFormStatus((prev) => ({
      ...prev,
      error: message,
      success: variant === "success",
    }));
    setTimeout(
      () => setFormStatus((prev) => ({ ...prev, error: null, success: null })),
      5000
    );
  };

  const fetchReviews = useCallback(async () => {
    setLoadingReviews(true);
    try {
      const response = await fetch(
        `${backendURL}/api/business/${businessSlug}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (data.status === "success" && data.business) {
        setBusinessData(data.business);
        // Access reviews from business.details.reviews
        setReviews(data.business.details.reviews || []);
      } else {
        setErrorReviews(data.message || "No reviews found for this business");
      }
    } catch (err) {
      setErrorReviews("Error fetching business reviews");
    } finally {
      setLoadingReviews(false);
    }
  }, [businessSlug, token]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = useCallback(
    async (values, { resetForm }) => {
      setFormStatus((prev) => ({ ...prev, loading: true }));
      try {
        const response = await fetch(`${backendURL}/api/review/business`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ business_slug: businessSlug, ...values }),
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "Failed to submit review");
        }
        showAlert("Business review submitted successfully!", "success");
        setIsModalOpen(false);
        resetForm();
        fetchReviews();
      } catch (error) {
        showAlert(error.message, "destructive");
      } finally {
        setFormStatus((prev) => ({ ...prev, loading: false }));
      }
    },
    [businessSlug, token, fetchReviews]
  );

  const formik = useFormik({
    initialValues: { rating: 0, review: "" },
    validate: (values) => {
      const errors = {};
      if (!values.rating) errors.rating = "Rating is required";
      if (values.rating < 1 || values.rating > 5)
        errors.rating = "Rating must be between 1 and 5";
      if (values.review?.length > 1000) errors.review = "Max 1000 characters";
      return errors;
    },
    onSubmit: handleSubmit,
  });

  const renderStars = () => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={24}
          className={`cursor-pointer ${
            star <= formik.values.rating
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          }`}
          onClick={() => formik.setFieldValue("rating", star)}
        />
      ))}
      {formik.touched.rating && formik.errors.rating && (
        <p className="text-xs text-red-500">{formik.errors.rating}</p>
      )}
    </div>
  );

  const renderAverageStars = (rating) => (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={
            i < Math.round(rating)
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300"
          }
        />
      ))}
    </div>
  );

  const nextPage = () => {
    const next = Math.min(currentPage + 1, totalPages - 1);
    setCurrentPage(next);
    if (carouselRef.current) {
      const cardWidth =
        carouselRef.current.querySelector(".review-card")?.offsetWidth || 0;
      const scrollPosition = next * reviewsPerPage * cardWidth;
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  const prevPage = () => {
    const prev = Math.max(currentPage - 1, 0);
    setCurrentPage(prev);
    if (carouselRef.current) {
      const cardWidth =
        carouselRef.current.querySelector(".review-card")?.offsetWidth || 0;
      const scrollPosition = prev * reviewsPerPage * cardWidth;
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (carouselRef.current) {
      const cardWidth =
        carouselRef.current.querySelector(".review-card")?.offsetWidth || 0;
      if (cardWidth === 0) return;
      const scrollPosition = carouselRef.current.scrollLeft;
      const newPage = Math.round(scrollPosition / (cardWidth * reviewsPerPage));
      setCurrentPage(newPage);
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  const getAvatarColor = (name) => {
    if (!name) return "bg-blue-500";
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-rose-500",
      "bg-amber-500",
      "bg-emerald-500",
      "bg-cyan-500",
    ];
    const hash = name
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <span className="text-blue-500">★</span> Business Reviews
        </h2>
        {userInfo && token && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm">
            Write a Review
          </button>
        )}
      </div>

      {loadingReviews ? (
        <p className="text-center py-8 text-gray-600">Loading reviews...</p>
      ) : errorReviews ? (
        <p className="text-center py-8 text-gray-600">{errorReviews}</p>
      ) : reviews.length === 0 ? (
        <p className="text-center py-8 text-gray-600">No reviews yet!</p>
      ) : (
        <div>
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-800">
                {averageRating}
              </span>
              {renderAverageStars(averageRating)}
              <span className="text-sm text-gray-500">
                ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
              </span>
            </div>
          </div>

          <div
            ref={carouselRef}
            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar"
            onScroll={handleScroll}>
            {reviews.map((review) => (
              <div
                key={review.id}
                className="review-card snap-start flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 px-2">
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm items-center gap-3 hover:shadow-md transition-shadow duration-300">
                  <div className="flex">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-medium ${getAvatarColor(
                        "Anonymous"
                      )}`}>
                      <span>{getInitials("Anonymous")}</span>
                    </div>
                    <div className="text-sm align-middle items-center mt-3 ml-2 font-semibold text-gray-800">
                      Anonymous
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1 my-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={
                            i < review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-700 mb-1">
                      "{review.review}"
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(review.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 0}
                className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md disabled:opacity-50 hover:bg-gray-300 transition-colors duration-200">
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i).map((number) => (
                <button
                  key={number}
                  onClick={() => {
                    setCurrentPage(number);
                    if (carouselRef.current) {
                      const cardWidth =
                        carouselRef.current.querySelector(".review-card")
                          ?.offsetWidth || 0;
                      const scrollPosition =
                        number * reviewsPerPage * cardWidth;
                      carouselRef.current.scrollTo({
                        left: scrollPosition,
                        behavior: "smooth",
                      });
                    }
                  }}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === number
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  } transition-colors duration-200`}>
                  {number + 1}
                </button>
              ))}
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages - 1}
                className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md disabled:opacity-50 hover:bg-gray-300 transition-colors duration-200">
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {formStatus.error && (
        <Alert
          variant={formStatus.success ? "success" : "destructive"}
          show={!!formStatus.error}
          autoClose
          autoCloseTime={5000}>
          <AlertDescription>{formStatus.error}</AlertDescription>
        </Alert>
      )}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            maxWidth: "28rem",
            width: "90%",
            padding: "1.5rem",
            border: "2px solid #93c5fd",
            borderRadius: "0.5rem",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          },
          overlay: {
            zIndex: 100,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        }}
        contentLabel="Business Review Modal">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Submit a Business Review
          </h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        {!userInfo || !token ? (
          <p className="text-sm text-gray-600">
            Please log in to submit a review.
          </p>
        ) : (
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Rating *
              </label>
              {renderStars()}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Review (Optional)
              </label>
              <textarea
                name="review"
                value={formik.values.review}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 resize-y"
                rows="4"
                placeholder="Write your review here (max 1000 characters)"
              />
              {formik.touched.review && formik.errors.review && (
                <p className="text-xs text-red-500">{formik.errors.review}</p>
              )}
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={formStatus.loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
                {formStatus.loading && <span className="animate-spin">◌</span>}
                {formStatus.loading ? "Submitting..." : "Submit Review"}
                {!formStatus.loading && <Send size={16} />}
              </button>
            </div>
          </form>
        )}
      </Modal>

      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default BusinessReview;

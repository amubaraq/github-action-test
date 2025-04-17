// import React, { useState, useEffect } from "react";
// import {
//   MapPin,
//   Mail,
//   Share2,
//   Check,
//   Star,
//   ExternalLink,
//   Clock,
//   Eye,
//   Phone,
// } from "lucide-react";
// import { Link } from "react-router-dom";
// import ADS from "../../assets/images/ads.jpg";
// import backendURL from "../../config";

// const BusinessCard = ({ business }) => (
//   <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto">
//     <div className="flex flex-col sm:flex-row lg:flex-row">
//       {/* Image Section */}
//       <div className="relative w-full sm:w-1/3 lg:w-1/3 shrink-0">
//         <img
//           src={business.image}
//           alt={business.name}
//           className="w-full h-48 sm:h-56 md:h-64 lg:h-full object-cover"
//           onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
//         />
//         <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-black/70 backdrop-blur-sm text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs flex items-center">
//           <Clock size={12} className="mr-1 sm:mr-1.5" />
//           {business.since}
//         </div>
//         <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-white/90 backdrop-blur-lg text-gray-800 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs flex items-center gap-1 sm:gap-2">
//           <Eye size={12} className="text-gray-600" />
//           {business?.views?.count || 0} views
//         </div>
//       </div>

//       {/* Content Section */}
//       <div className="flex-1 p-4 sm:p-6">
//         <div className="space-y-3 sm:space-y-4">
//           {/* Header with Rating */}
//           <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0">
//             <div className="space-y-1 sm:space-y-2">
//               <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">
//                 {business.name}
//               </h3>
//               {/* Business Line */}
//               <div className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
//                 <span className="text-sm sm:text-sm truncate">
//                   {business?.businessLine || "Not available"}
//                 </span>
//               </div>
//               <div className="flex items-center gap-1 sm:gap-2">
//                 <div className="flex items-center">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <Star
//                       key={star}
//                       size={14}
//                       className="fill-yellow-400 stroke-yellow-400"
//                     />
//                   ))}
//                 </div>
//                 <span className="text-xs sm:text-sm text-gray-600">
//                   ({business.rating} reviews)
//                 </span>
//               </div>
//             </div>
//             <button
//               className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
//               aria-label="Share">
//               <Share2 size={16} className="text-gray-600" />
//             </button>
//           </div>

//           {/* Contact Info */}
//           <div className="space-y-1 sm:space-y-2">
//             <div className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
//               <MapPin size={16} className="mr-1 sm:mr-2" />
//               <span className="text-xs sm:text-sm truncate">
//                 {business.location}
//               </span>
//             </div>
//             <div className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
//               <Mail size={16} className="mr-1 sm:mr-2" />
//               <span className="text-xs sm:text-sm truncate">
//                 {business.email}
//               </span>
//             </div>
//             <div className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
//               <Phone size={16} sm:size={18} className="mr-1 sm:mr-2" />
//               <span className="text-xs sm:text-sm truncate">
//                 {business?.phone}
//               </span>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-3 sm:pt-4 border-t border-gray-100 gap-2 sm:gap-0">
//             <div
//               className={`flex items-center ${
//                 business.verifiedPercentage >= 80
//                   ? "text-green-600"
//                   : "text-amber-600"
//               }`}>
//               <Check size={16} className="mr-1 sm:mr-1.5" />
//               <span className="text-xs sm:text-sm font-medium">
//                 {business.verifiedPercentage}% Verified
//               </span>
//             </div>
//             <Link
//               to={`/SingleBusinessPage/${business.businessId}`} // Updated to match SingleBusinessPage route
//               className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-red-600 text-white transition-all duration-300 hover:bg-red-700 hover:scale-105 whitespace-nowrap">
//               View Details
//               <ExternalLink size={14} className="ml-1 sm:ml-1.5" />
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// );

// const TopNotchBusinesses = () => {
//   const [businesses, setBusinesses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchTopNotchBusinesses();
//   }, []);

//   const fetchTopNotchBusinesses = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${backendURL}/api/lists/business`);
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
//       const data = await response.json();
//       if (data.status === "success") {
//         const currentDate = new Date("2025-03-27"); // Current date as per instructions
//         const filteredBusinesses = data.data
//           .filter(
//             (business) =>
//               business.payment_status === "paid" &&
//               business.ads_expiry_date &&
//               new Date(business.ads_expiry_date) >= currentDate
//           )
//           .slice(0, 3); // Limit to 3 businesses as per original design
//         setBusinesses(filteredBusinesses.map(formatBusinessForCard));
//         console.log(filteredBusinesses, "filteredBusinesses");
//       } else {
//         throw new Error("Failed to fetch businesses");
//       }
//     } catch (err) {
//       setError(err.message);
//       console.error("Error fetching top-notch businesses:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatBusinessForCard = (business) => {
//     const sinceDate = business.date_of_establishment
//       ? new Date(business.date_of_establishment).toLocaleDateString("en-US", {
//           day: "2-digit",
//           month: "long",
//           year: "numeric",
//         })
//       : "N/A";
//     return {
//       businessId: business.slug, // Using slug for routing consistency with SingleBusinessPage
//       name: business.business_name || "Unnamed Business",
//       phone: business.contact_person_number || "No Contact",
//       businessLine: business.business_line,

//       services: business.services_rendered || "Not specified",
//       since: `Since ${sinceDate}`,
//       rating: business.reviews || "0", // Assuming reviews might be added later; adjust if available
//       location: `${business.business_address || "Not specified"}, ${
//         business.state || ""
//       }`.trim(),
//       email: business.business_email || "Not provided",
//       verifiedPercentage: business.verification_percentage || 0,
//       image:
//         business.business_photos && business.business_photos.length > 0
//           ? business.business_photos[0].photo_path
//           : "https://via.placeholder.com/150",
//       views: { count: business.views || 0 },
//     };
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       <div className="flex justify-between items-center mb-8">
//         <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
//           Top Notch Businesses in Nigeria
//         </h2>
//         <Link
//           to="/business"
//           className="text-red-600 hover:text-red-700 font-medium flex items-center mid:text-sm">
//           View All
//           <ExternalLink size={16} className="ml-1.5" />
//         </Link>
//       </div>

//       <div className="grid lg:grid-cols-[1fr,300px] gap-6 sm:gap-8">
//         <div className="space-y-6">
//           {loading ? (
//             <p className="text-gray-500 text-center">
//               Loading top businesses...
//             </p>
//           ) : error ? (
//             <p className="text-red-500 text-center">{error}</p>
//           ) : businesses.length === 0 ? (
//             <p className="text-gray-500 text-center">
//               No top-notch businesses found with active paid ads.
//             </p>
//           ) : (
//             businesses.map((business, index) => (
//               <BusinessCard key={index} business={business} />
//             ))
//           )}
//         </div>

//         <div className="hidden lg:block">
//           <div className="sticky top-6">
//             <h3 className="text-xl font-semibold text-gray-900 mb-6"></h3>
//             <img src={ADS} alt="Advertisement" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TopNotchBusinesses;

// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import {
//   MapPin,
//   Mail,
//   Share2,
//   Check,
//   Star,
//   ExternalLink,
//   Clock,
//   Eye,
//   Phone,
// } from "lucide-react";
// import { Link } from "react-router-dom";
// import { MessageCircle } from "lucide-react"; // WhatsApp icon (using MessageCircle as a placeholder; you can replace with an actual WhatsApp icon)
// import ADS from "../../assets/images/ads.jpg";
// import backendURL from "../../config";

// const ITEMS_PER_PAGE = 3;

// const BusinessCard = ({ business }) => {
//   const handleWhatsAppClick = () => {
//     const phoneNumber = business.phone.replace(/\D/g, ""); // Remove non-digits (e.g., spaces, +)
//     const whatsappUrl = `https://wa.me/${phoneNumber}`;
//     window.open(whatsappUrl, "_blank");
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto">
//       <div className="flex flex-col sm:flex-row lg:flex-row">
//         {/* Image Section */}
//         <div className="relative w-full sm:w-1/3 lg:w-1/3 shrink-0">
//           <img
//             src={business.image}
//             alt={business.name}
//             className="w-full h-48 sm:h-56 md:h-64 lg:h-full object-cover"
//             onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
//           />
//           <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-black/70 backdrop-blur-sm text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs flex items-center">
//             <Clock size={12} className="mr-1 sm:mr-1.5" />
//             {business.since}
//           </div>
//           <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-white/90 backdrop-blur-lg text-gray-800 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs flex items-center gap-1 sm:gap-2">
//             <Eye size={12} className="text-gray-600" />
//             {business?.views?.count || 0} views
//           </div>
//         </div>

//         {/* Content Section */}
//         <div className="flex-1 p-4 sm:p-6">
//           <div className="space-y-3 sm:space-y-4">
//             {/* Header with Rating */}
//             <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0">
//               <div className="space-y-1 sm:space-y-2">
//                 <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">
//                   {business.name}
//                 </h3>
//                 {/* Business Line */}
//                 <div className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
//                   <span className="text-sm sm:text-sm truncate">
//                     {business?.businessLine || "Not available"}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-1 sm:gap-2">
//                   <div className="flex items-center">
//                     {[1, 2, 3, 4, 5].map((star) => (
//                       <Star
//                         key={star}
//                         size={14}
//                         className="fill-yellow-400 stroke-yellow-400"
//                       />
//                     ))}
//                   </div>
//                   <span className="text-xs sm:text-sm text-gray-600">
//                     ({business.rating} reviews)
//                   </span>
//                 </div>
//               </div>
//               <button
//                 className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
//                 aria-label="Share">
//                 <Share2 size={16} className="text-gray-600" />
//               </button>
//             </div>

//             {/* Contact Info */}
//             <div className="space-y-1 sm:space-y-2">
//               <div className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
//                 <MapPin size={16} className="mr-1 sm:mr-2" />
//                 <span className="text-xs sm:text-sm truncate">
//                   {business.location}
//                 </span>
//               </div>
//               <div className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
//                 <Mail size={16} className="mr-1 sm:mr-2" />
//                 <span className="text-xs sm:text-sm truncate">
//                   {business.email}
//                 </span>
//               </div>
//               <div className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
//                 <Phone size={16} className="mr-1 sm:mr-2" />
//                 <span className="text-xs sm:text-sm truncate">
//                   {business?.phone}
//                 </span>
//               </div>
//               <div className="flex items-center text-gray-600 hover:text-green-600 transition-colors">
//                 <button
//                   onClick={handleWhatsAppClick}
//                   className="flex items-center"
//                   aria-label="Chat on WhatsApp">
//                   <MessageCircle
//                     size={16}
//                     className="mr-1 sm:mr-2 text-green-500"
//                   />
//                   <span className="text-xs sm:text-sm">Chat on WhatsApp</span>
//                 </button>
//               </div>
//             </div>

//             {/* Footer */}
//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-3 sm:pt-4 border-t border-gray-100 gap-2 sm:gap-0">
//               <div
//                 className={`flex items-center ${
//                   business.verifiedPercentage >= 80
//                     ? "text-green-600"
//                     : "text-amber-600"
//                 }`}>
//                 <Check size={16} className="mr-1 sm:mr-1.5" />
//                 <span className="text-xs sm:text-sm font-medium">
//                   {business.verifiedPercentage}% Verified
//                 </span>
//               </div>
//               <Link
//                 to={`/SingleBusinessPage/${business.businessId}`}
//                 className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-red-600 text-white transition-all duration-300 hover:bg-red-700 hover:scale-105 whitespace-nowrap">
//                 View Details
//                 <ExternalLink size={14} className="ml-1 sm:ml-1.5" />
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const TopNotchBusinesses = () => {
//   const [businesses, setBusinesses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);

//   const fetchTopNotchBusinesses = useCallback(async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${backendURL}/api/lists/business`);
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
//       const data = await response.json();
//       if (data.status === "success") {
//         const currentDate = new Date("2025-03-27"); // Current date as per instructions
//         const filteredBusinesses = data.data.filter(
//           (business) =>
//             business.payment_status === "paid" &&
//             business.ads_expiry_date &&
//             new Date(business.ads_expiry_date) >= currentDate
//         );
//         setBusinesses(filteredBusinesses.map(formatBusinessForCard));
//       } else {
//         throw new Error("Failed to fetch businesses");
//       }
//     } catch (err) {
//       setError(err.message);
//       console.error("Error fetching top-notch businesses:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchTopNotchBusinesses();
//   }, [fetchTopNotchBusinesses]);

//   const formatBusinessForCard = (business) => {
//     const sinceDate = business.date_of_establishment
//       ? new Date(business.date_of_establishment).toLocaleDateString("en-US", {
//           day: "2-digit",
//           month: "long",
//           year: "numeric",
//         })
//       : "N/A";
//     return {
//       businessId: business.slug,
//       name: business.business_name || "Unnamed Business",
//       phone: business.contact_person_number || "No Contact",
//       businessLine: business.business_line,
//       services: business.services_rendered || "Not specified",
//       since: `Since ${sinceDate}`,
//       rating: business.reviews || "0",
//       location: `${business.business_address || "Not specified"}, ${
//         business.state || ""
//       }`.trim(),
//       email: business.business_email || "Not provided",
//       verifiedPercentage: business.verification_percentage || 0,
//       image:
//         business.business_photos && business.business_photos.length > 0
//           ? business.business_photos[0].photo_path
//           : "https://via.placeholder.com/150",
//       views: { count: business.views || 0 },
//     };
//   };

//   // Pagination logic
//   const totalPages = Math.ceil(businesses.length / ITEMS_PER_PAGE);
//   const paginatedBusinesses = useMemo(() => {
//     const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//     return businesses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
//   }, [businesses, currentPage]);

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top on page change
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       <div className="flex justify-between items-center mb-8">
//         <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
//           Top Notch Businesses in Nigeria
//         </h2>
//         <Link
//           to="/business"
//           className="text-red-600 hover:text-red-700 font-medium flex items-center mid:text-sm">
//           View All
//           <ExternalLink size={16} className="ml-1.5" />
//         </Link>
//       </div>

//       <div className="grid lg:grid-cols-[1fr,300px] gap-6 sm:gap-8">
//         <div className="space-y-6">
//           {loading ? (
//             <p className="text-gray-500 text-center">
//               Loading top businesses...
//             </p>
//           ) : error ? (
//             <p className="text-red-500 text-center">{error}</p>
//           ) : businesses.length === 0 ? (
//             <p className="text-gray-500 text-center">
//               No top-notch businesses found with active paid ads.
//             </p>
//           ) : (
//             <>
//               {paginatedBusinesses.map((business, index) => (
//                 <BusinessCard key={business.businessId} business={business} />
//               ))}
//               {/* Pagination Controls */}
//               {totalPages > 1 && (
//                 <div className="flex justify-center items-center mt-8 space-x-2">
//                   <button
//                     onClick={() => handlePageChange(currentPage - 1)}
//                     disabled={currentPage === 1}
//                     className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50 hover:bg-gray-300 transition-colors">
//                     Previous
//                   </button>
//                   {Array.from({ length: totalPages }, (_, i) => i + 1).map(
//                     (page) => (
//                       <button
//                         key={page}
//                         onClick={() => handlePageChange(page)}
//                         className={`px-3 py-1 rounded-md ${
//                           currentPage === page
//                             ? "bg-red-600 text-white"
//                             : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                         } transition-colors`}>
//                         {page}
//                       </button>
//                     )
//                   )}
//                   <button
//                     onClick={() => handlePageChange(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                     className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50 hover:bg-gray-300 transition-colors">
//                     Next
//                   </button>
//                 </div>
//               )}
//             </>
//           )}
//         </div>

//         <div className="hidden lg:block">
//           <div className="sticky top-6">
//             <h3 className="text-xl font-semibold text-gray-900 mb-6"></h3>
//             <img src={ADS} alt="Advertisement" />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TopNotchBusinesses;

// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import {
//   MapPin,
//   Mail,
//   Share2,
//   Check,
//   Star,
//   ExternalLink,
//   Clock,
//   Eye,
//   Phone,
// } from "lucide-react";
// import { Link } from "react-router-dom";
// import { MessageCircle } from "lucide-react";
// import ADS from "../../assets/images/ads.jpg";
// import backendURL from "../../config";

// const ITEMS_PER_PAGE = 3;

// const BusinessCard = ({ business }) => {
//   const handleWhatsAppClick = () => {
//     const phoneNumber = business.phone.replace(/\D/g, "");
//     const whatsappUrl = `https://wa.me/${phoneNumber}`;
//     window.open(whatsappUrl, "_blank");
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto">
//       <div className="flex flex-col sm:flex-row lg:flex-row">
//         {/* Image Section */}
//         <div className="relative w-full sm:w-1/3 lg:w-1/3 shrink-0">
//           <img
//             src={business.image}
//             alt={business.name}
//             className="w-full h-48 sm:h-56 md:h-64 lg:h-full object-cover"
//             onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
//           />
//           <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-black/70 backdrop-blur-sm text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs flex items-center">
//             <Clock size={12} className="mr-1 sm:mr-1.5" />
//             {business.since}
//           </div>
//           <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-white/90 backdrop-blur-lg text-gray-800 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs flex items-center gap-1 sm:gap-2">
//             <Eye size={12} className="text-gray-600" />
//             {business.views || 0} views
//           </div>
//         </div>

//         {/* Content Section */}
//         <div className="flex-1 p-4 sm:p-6">
//           <div className="space-y-3 sm:space-y-4">
//             {/* Header with Rating */}
//             <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0">
//               <div className="space-y-1 sm:space-y-2">
//                 <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">
//                   {business.name}
//                 </h3>
//                 <div className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
//                   <span className="text-sm sm:text-sm truncate">
//                     {business.category || "Not available"}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-1 sm:gap-2">
//                   <div className="flex items-center">
//                     {[1, 2, 3, 4, 5].map((star) => (
//                       <Star
//                         key={star}
//                         size={14}
//                         fill={star <= business.rating ? "yellow" : "none"}
//                         className="stroke-yellow-400"
//                       />
//                     ))}
//                   </div>
//                   <span className="text-xs sm:text-sm text-gray-600">
//                     ({business.reviews || 0} reviews)
//                   </span>
//                 </div>
//               </div>
//               <button
//                 className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
//                 aria-label="Share">
//                 <Share2 size={16} className="text-gray-600" />
//               </button>
//             </div>

//             {/* Contact Info */}
//             <div className="space-y-1 sm:space-y-2">
//               <div className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
//                 <MapPin size={16} className="mr-1 sm:mr-2" />
//                 <span className="text-xs sm:text-sm truncate">
//                   {business.address}
//                 </span>
//               </div>
//               <div className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
//                 <Mail size={16} className="mr-1 sm:mr-2" />
//                 <span className="text-xs sm:text-sm truncate">
//                   {business.email}
//                 </span>
//               </div>
//               <div className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
//                 <Phone size={16} className="mr-1 sm:mr-2" />
//                 <span className="text-xs sm:text-sm truncate">
//                   {business.phone}
//                 </span>
//               </div>
//               <div className="flex items-center text-gray-600 hover:text-green-600 transition-colors">
//                 <button
//                   onClick={handleWhatsAppClick}
//                   className="flex items-center"
//                   aria-label="Chat on WhatsApp">
//                   <MessageCircle
//                     size={16}
//                     className="mr-1 sm:mr-2 text-green-500"
//                   />
//                   <span className="text-xs sm:text-sm">Chat on WhatsApp</span>
//                 </button>
//               </div>
//             </div>

//             {/* Footer */}
//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-3 sm:pt-4 border-t border-gray-100 gap-2 sm:gap-0">
//               <div
//                 className={`flex items-center ${
//                   business.verified ? "text-green-600" : "text-amber-600"
//                 }`}>
//                 <Check size={16} className="mr-1 sm:mr-1.5" />
//                 <span className="text-xs sm:text-sm font-medium">
//                   {business.verified ? "Verified" : "Not Verified"}
//                 </span>
//               </div>
//               <Link
//                 to={`/SingleBusinessPage/${business.slug}`}
//                 className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-red-600 text-white transition-all duration-300 hover:bg-red-700 hover:scale-105 whitespace-nowrap">
//                 View Details
//                 <ExternalLink size={14} className="ml-1 sm:ml-1.5" />
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const TopNotchBusinesses = () => {
//   const [businesses, setBusinesses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);

//   const fetchTopNotchBusinesses = useCallback(async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${backendURL}/api/lists/business`);
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
//       const data = await response.json();
//       console.log(data, "top notch data");

//       if (data.status === "success") {
//         // Handle both array and single business response
//         const businessData = Array.isArray(data.data) ? data.data : [data.data];
//         const currentDate = new Date();

//         // First try to get paid ads
//         let filteredBusinesses = businessData.filter((business) => {
//           const biz = business.business || business;
//           return (
//             biz.payment_status === "paid" &&
//             biz.ads_expiry_date &&
//             new Date(biz.ads_expiry_date) >= currentDate
//           );
//         });

//         // If no paid ads, fall back to top 3 businesses by views
//         if (filteredBusinesses.length === 0) {
//           console.log(
//             "No paid ads found, falling back to most viewed businesses"
//           );
//           filteredBusinesses = [...businessData]
//             .sort((a, b) => {
//               const bizA = a.business || a;
//               const bizB = b.business || b;
//               return (bizB.views || 0) - (bizA.views || 0);
//             })
//             .slice(0, 3); // Limit to top 3
//         }

//         setBusinesses(filteredBusinesses.map(formatBusinessForCard));
//       } else {
//         throw new Error("Failed to fetch businesses");
//       }
//     } catch (err) {
//       setError(err.message);
//       console.error("Error fetching top-notch businesses:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const formatBusinessForCard = (business) => {
//     const biz = business.business || business;
//     const sinceDate = biz.date_of_establishment
//       ? new Date(biz.date_of_establishment).toLocaleDateString("en-US", {
//           day: "2-digit",
//           month: "long",
//           year: "numeric",
//         })
//       : "N/A";

//     return {
//       businessId: biz.id,
//       slug: biz.slug,
//       name: biz.business_name || "Unnamed Business",
//       phone: biz.contact_person_number || "No Contact",
//       email: biz.contact_person_email || "No Email",
//       category: biz.category_slug || "Not specified",
//       since: `Since ${sinceDate}`,
//       rating: biz.average_rating || 0,
//       reviews: biz.total_reviews || 0,
//       address:
//         `${biz.business_address || "Not specified"}, ${biz.state || ""}`.trim(),
//       verified: biz.verification_percentage > 50,
//       image:
//         biz.business_photos && biz.business_photos.length > 0
//           ? Array.isArray(biz.business_photos)
//             ? biz.business_photos[0].photo_path
//             : biz.business_photos[0]
//           : "https://via.placeholder.com/150",
//       views: biz.views || 0,
//     };
//   };

//   // Pagination logic
//   const totalPages = Math.ceil(businesses.length / ITEMS_PER_PAGE);
//   const paginatedBusinesses = useMemo(() => {
//     const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//     return businesses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
//   }, [businesses, currentPage]);

//   const handlePageChange = (page) => {
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   useEffect(() => {
//     fetchTopNotchBusinesses();
//   }, [fetchTopNotchBusinesses]);

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       <div className="flex justify-between items-center mb-8">
//         <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
//           Top Notch Businesses in Nigeria
//         </h2>
//         <Link
//           to="/business"
//           className="text-red-600 hover:text-red-700 font-medium flex items-center mid:text-sm">
//           View All
//           <ExternalLink size={16} className="ml-1.5" />
//         </Link>
//       </div>

//       <div className="grid lg:grid-cols-[1fr,300px] gap-6 sm:gap-8">
//         <div className="space-y-6">
//           {loading ? (
//             <div className="flex justify-center items-center py-12">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
//             </div>
//           ) : error ? (
//             <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
//               <p className="font-medium">Error loading businesses</p>
//               <p className="text-sm">{error}</p>
//               <button
//                 onClick={fetchTopNotchBusinesses}
//                 className="mt-2 text-sm text-red-600 hover:text-red-800 underline">
//                 Try again
//               </button>
//             </div>
//           ) : businesses.length === 0 ? (
//             <div className="text-center py-12 bg-gray-50 rounded-lg">
//               <div className="text-gray-400 mb-4">
//                 <Briefcase size={48} className="mx-auto" />
//               </div>
//               <h3 className="text-lg font-medium text-gray-900 mb-2">
//                 No top-notch businesses found
//               </h3>
//               <p className="text-gray-500">
//                 Currently no businesses with active premium listings.
//               </p>
//             </div>
//           ) : (
//             <>
//               {paginatedBusinesses.map((business) => (
//                 <BusinessCard key={business.businessId} business={business} />
//               ))}

//               {totalPages > 1 && (
//                 <div className="flex justify-center items-center mt-8 space-x-2">
//                   <button
//                     onClick={() => handlePageChange(currentPage - 1)}
//                     disabled={currentPage === 1}
//                     className={`px-3 py-1 rounded-md ${
//                       currentPage === 1
//                         ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//                         : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                     } transition-colors`}>
//                     Previous
//                   </button>
//                   {Array.from({ length: totalPages }, (_, i) => i + 1)
//                     .filter(
//                       (page) =>
//                         page === 1 ||
//                         page === totalPages ||
//                         Math.abs(page - currentPage) <= 1
//                     )
//                     .map((page, i, array) => (
//                       <React.Fragment key={page}>
//                         {i > 0 && page - array[i - 1] > 1 && (
//                           <span className="px-2">...</span>
//                         )}
//                         <button
//                           onClick={() => handlePageChange(page)}
//                           className={`px-3 py-1 rounded-md ${
//                             currentPage === page
//                               ? "bg-red-600 text-white"
//                               : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                           } transition-colors`}>
//                           {page}
//                         </button>
//                       </React.Fragment>
//                     ))}
//                   <button
//                     onClick={() => handlePageChange(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                     className={`px-3 py-1 rounded-md ${
//                       currentPage === totalPages
//                         ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//                         : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                     } transition-colors`}>
//                     Next
//                   </button>
//                 </div>
//               )}
//             </>
//           )}
//         </div>

//         <div className="hidden lg:block">
//           <div className="sticky top-6">
//             <img
//               src={ADS}
//               alt="Advertisement"
//               className="rounded-lg border border-gray-200"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TopNotchBusinesses;

// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import {
//   MapPin,
//   Mail,
//   Share2,
//   Check,
//   Star,
//   ExternalLink,
//   Clock,
//   Eye,
//   Phone,
// } from "lucide-react";
// import { Link } from "react-router-dom";
// import { MessageCircle } from "lucide-react";
// import ADS from "../../assets/images/ads.jpg";
// import backendURL from "../../config";

// const ITEMS_PER_PAGE = 3;

// const BusinessCard = ({ business }) => {
//   const handleWhatsAppClick = () => {
//     const phoneNumber = business.phone.replace(/\D/g, "");
//     const whatsappUrl = `https://wa.me/${phoneNumber}`;
//     window.open(whatsappUrl, "_blank");
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto">
//       <div className="flex flex-col sm:flex-row lg:flex-row">
//         {/* Image Section */}
//         <div className="relative w-full sm:w-1/3 lg:w-1/3 shrink-0">
//           <img
//             src={business.image}
//             alt={business.name}
//             className="w-full h-48 sm:h-56 md:h-64 lg:h-full object-cover"
//             // onError={(e) => (e.target.src = "https://via.placeholder.com/150")}a
//           />
//           <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-black/70 backdrop-blur-sm text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs flex items-center">
//             <Clock size={12} className="mr-1 sm:mr-1.5" />
//             {business.since}
//           </div>
//           <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-white/90 backdrop-blur-lg text-gray-800 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs flex items-center gap-1 sm:gap-2">
//             <Eye size={12} className="text-gray-600" />
//             {business.views || 0} views
//           </div>
//         </div>

//         {/* Content Section */}
//         <div className="flex-1 p-4 sm:p-6">
//           <div className="space-y-3 sm:space-y-4">
//             {/* Header with Rating */}
//             <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0">
//               <div className="space-y-1 sm:space-y-2">
//                 <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">
//                   {business.name}
//                 </h3>
//                 <div className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
//                   <span className="text-sm sm:text-sm truncate">
//                     {business.category || "Not available"}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-1 sm:gap-2">
//                   <div className="flex items-center">
//                     {[1, 2, 3, 4, 5].map((star) => (
//                       <Star
//                         key={star}
//                         size={14}
//                         fill={star <= business.rating ? "yellow" : "none"}
//                         className="stroke-yellow-400"
//                       />
//                     ))}
//                   </div>
//                   <span className="text-xs sm:text-sm text-gray-600">
//                     ({business.reviews || 0} reviews)
//                   </span>
//                 </div>
//               </div>
//               <button
//                 className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
//                 aria-label=" Share">
//                 <Share2 size={16} className="text-gray-600" />
//               </button>
//             </div>

//             {/* Contact Info */}
//             <div className="space-y-1 sm:space-y-2">
//               <div className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
//                 <MapPin size={16} className="mr-1 sm:mr-2" />
//                 <span className="text-xs sm:text-sm truncate">
//                   {business.address}
//                 </span>
//               </div>
//               <div className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
//                 <Mail size={16} className="mr-1 sm:mr-2" />
//                 <span className="text-xs sm:text-sm truncate">
//                   {business.email}
//                 </span>
//               </div>
//               <div className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
//                 <Phone size={16} className="mr-1 sm:mr-2" />
//                 <span className="text-xs sm:text-sm truncate">
//                   {business.phone}
//                 </span>
//               </div>
//               <div className="flex items-center text-gray-600 hover:text-green-600 transition-colors">
//                 <button
//                   onClick={handleWhatsAppClick}
//                   className="flex items-center"
//                   aria-label="Chat on WhatsApp">
//                   <MessageCircle
//                     size={16}
//                     className="mr-1 sm:mr-2 text-green-500"
//                   />
//                   <span className="text-xs sm:text-sm">Chat on WhatsApp</span>
//                 </button>
//               </div>
//             </div>

//             {/* Footer */}
//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-3 sm:pt-4 border-t border-gray-100 gap-2 sm:gap-0">
//               <div
//                 className={`flex items-center ${
//                   business.verified ? "text-green-600" : "text-amber-600"
//                 }`}>
//                 <Check size={16} className="mr-1 sm:mr-1.5" />
//                 <span className="text-xs sm:text-sm font-medium">
//                   {business.verified ? "Verified" : "Not Verified"}
//                 </span>
//               </div>
//               <Link
//                 to={`/SingleBusinessPage/${business.slug}`}
//                 className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-red-600 text-white transition-all duration-300 hover:bg-red-700 hover:scale-105 whitespace-nowrap">
//                 View Details
//                 <ExternalLink size={14} className="ml-1 sm:ml-1.5" />
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const TopNotchBusinesses = () => {
//   const [businesses, setBusinesses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);

//   const fetchTopNotchBusinesses = useCallback(async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(`${backendURL}/api/lists/business`);
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
//       const data = await response.json();
//       console.log(data, "top notch data");

//       if (data.status === "success") {
//         const businessData = Array.isArray(data.data) ? data.data : [data.data];
//         const currentDate = new Date();

//         let filteredBusinesses = businessData.filter((business) => {
//           const biz = business.business || business;
//           return (
//             biz.payment_status === "paid" &&
//             biz.ads_expiry_date &&
//             new Date(biz.ads_expiry_date) >= currentDate
//           );
//         });

//         if (filteredBusinesses.length === 0) {
//           console.log(
//             "No paid ads found, falling back to most viewed businesses"
//           );
//           filteredBusinesses = [...businessData]
//             .sort((a, b) => {
//               const bizA = a.business || a;
//               const bizB = b.business || b;
//               return (bizB.views || 0) - (bizA.views || 0);
//             })
//             .slice(0, 3);
//         }

//         setBusinesses(filteredBusinesses.map(formatBusinessForCard));
//       } else {
//         throw new Error("Failed to fetch businesses");
//       }
//     } catch (err) {
//       setError(err.message);
//       console.error("Error fetching top-notch businesses:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const formatBusinessForCard = (business) => {
//     const biz = business.business || business;
//     const sinceDate = biz.date_of_establishment
//       ? new Date(biz.date_of_establishment).toLocaleDateString("en-US", {
//           day: "2-digit",
//           month: "long",
//           year: "numeric",
//         })
//       : "N/A";

//     return {
//       businessId: biz.id,
//       slug: biz.slug,
//       name: biz.business_name || "Unnamed Business",
//       phone: biz.contact_person_number || "No Contact",
//       email: biz.contact_person_email || "No Email",
//       category: biz.category_slug || "Not specified",
//       since: `Since ${sinceDate}`,
//       rating: biz.average_rating || 0,
//       reviews: biz.total_reviews || 0,
//       address:
//         `${biz.business_address || "Not specified"}, ${biz.state || ""}`.trim(),
//       verified: biz.verification_percentage > 50,
//       image:
//         biz.business_photos && biz.business_photos.length > 0
//           ? Array.isArray(biz.business_photos)
//             ? biz.business_photos[0].photo_path
//             : biz.business_photos[0]
//           : "https://via.placeholder.com/150",
//       views: biz.views || 0,
//     };
//   };

//   const totalPages = Math.ceil(businesses.length / ITEMS_PER_PAGE);
//   const paginatedBusinesses = useMemo(() => {
//     const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//     return businesses.slice(startIndex, startIndex + ITEMS_PER_PAGE);
//   }, [businesses, currentPage]);

//   const handlePageChange = (page) => {
//     if (page < 1 || page > totalPages) return; // Prevent invalid page changes
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   useEffect(() => {
//     fetchTopNotchBusinesses();
//   }, [fetchTopNotchBusinesses]);

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       <div className="flex justify-between items-center mb-8">
//         <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
//           Top Notch Businesses in Nigeria
//         </h2>
//         <Link
//           to="/business"
//           className="text-red-600 hover:text-red-700 font-medium flex items-center mid:text-sm">
//           View All
//           <ExternalLink size={16} className="ml-1.5" />
//         </Link>
//       </div>

//       <div className="grid lg:grid-cols-[1fr,300px] gap-6 sm:gap-8">
//         <div className="space-y-6">
//           {loading ? (
//             <div className="flex justify-center items-center py-12">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
//             </div>
//           ) : error ? (
//             <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
//               <p className="font-medium">Error loading businesses</p>
//               <p className="text-sm">{error}</p>
//               <button
//                 onClick={fetchTopNotchBusinesses}
//                 className="mt-2 text-sm text-red-600 hover:text-red-800 underline">
//                 Try again
//               </button>
//             </div>
//           ) : businesses.length === 0 ? (
//             <div className="text-center py-12 bg-gray-50 rounded-lg">
//               <div className="text-gray-400 mb-4">
//                 <Briefcase size={48} className="mx-auto" />
//               </div>
//               <h3 className="text-lg font-medium text-gray-900 mb-2">
//                 No top-notch businesses found
//               </h3>
//               <p className="text-gray-500">
//                 Currently no businesses with active premium listings.
//               </p>
//             </div>
//           ) : (
//             <>
//               {paginatedBusinesses.map((business) => (
//                 <BusinessCard key={business.businessId} business={business} />
//               ))}

//               {totalPages > 1 && (
//                 <div className="flex justify-center items-center mt-8 space-x-2">
//                   <button
//                     onClick={() => handlePageChange(currentPage - 1)}
//                     disabled={currentPage === 1}
//                     className={`px-3 py-1 rounded-md ${
//                       currentPage === 1
//                         ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//                         : "bg-gray -200 text-gray-700 hover:bg-gray-300"
//                     } transition-colors`}>
//                     Previous
//                   </button>
//                   {Array.from({ length: totalPages }, (_, i) => i + 1)
//                     .filter(
//                       (page) =>
//                         page === 1 ||
//                         page === totalPages ||
//                         Math.abs(page - currentPage) <= 1
//                     )
//                     .map((page, i, array) => (
//                       <React.Fragment key={page}>
//                         {i > 0 && page - array[i - 1] > 1 && (
//                           <span className="px-2">...</span>
//                         )}
//                         <button
//                           onClick={() => handlePageChange(page)}
//                           className={`px-3 py-1 rounded-md ${
//                             currentPage === page
//                               ? "bg-red-600 text-white"
//                               : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                           } transition-colors`}>
//                           {page}
//                         </button>
//                       </React.Fragment>
//                     ))}
//                   <button
//                     onClick={() => handlePageChange(currentPage + 1)}
//                     disabled={currentPage === totalPages}
//                     className={`px-3 py-1 rounded-md ${
//                       currentPage === totalPages
//                         ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//                         : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                     } transition-colors`}>
//                     Next
//                   </button>
//                 </div>
//               )}
//             </>
//           )}
//         </div>

//         <div className="hidden lg:block">
//           <div className="sticky top-6">
//             <img
//               src={ADS}
//               alt="Advertisement"
//               className="rounded-lg border border-gray-200"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TopNotchBusinesses;

import React, { useState, useEffect } from "react";
import {
  MapPin,
  Mail,
  Share2,
  Check,
  Star,
  ExternalLink,
  Clock,
  Eye,
  Phone,
  MessageCircle,
  Globe,
} from "lucide-react";
import { Link } from "react-router-dom";
import ADS from "../../assets/images/ads.jpg";
import backendURL from "../../config";
import { Briefcase } from "lucide-react";
import { WhatsApp } from "@mui/icons-material";

const ITEMS_PER_PAGE = 3;

const BusinessCard = ({ business }) => {
  const handleShare = () => {
    const shareUrl = `${window.location.origin}/business/${business.slug}`;
    if (navigator.share) {
      navigator
        .share({
          title: `${business.name} Business Profile`,
          text: `Check out ${business.name}`,
          url: shareUrl,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      navigator.clipboard
        .writeText(shareUrl)
        .then(() => alert("Business link copied to clipboard!"))
        .catch((err) => console.error("Could not copy text: ", err));
    }
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = (business?.phone || "").replace(/\D/g, "");
    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    window.open(whatsappUrl, "_blank");
  };

  const handlePhoneClick = () => {
    const phoneNumber = business?.phone || "";
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleEmailClick = () => {
    const email = business?.email || "";
    window.location.href = `mailto:${email}`;
  };

  const handleWebsiteClick = () => {
    const website = business?.business_website || "";
    if (website) {
      window.open(website, "_blank");
    }
  };

  const handleMapClick = () => {
    const address = encodeURIComponent(business?.address || "");
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${address}`;
    window.open(googleMapsUrl, "_blank");
  };

  const getRandomGradient = () => {
    const gradients = [
      "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)",
      "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
    ];
    return gradients[business.businessId % gradients.length];
  };

  const getFallbackInitials = () => {
    if (!business.name) return "NA";
    const words = business.name.trim().split(" ");
    const initials = words
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
    return initials || "NA";
  };

  const getYearsSinceEstablishment = () => {
    if (!business.sinceDate) return "N/A";
    const establishedYear = new Date(business.sinceDate).getFullYear();
    const currentYear = new Date().getFullYear();
    const years = currentYear - establishedYear;
    return years > 0 ? `${years} Years with us` : "Newly Established";
  };

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row lg:flex-row">
        {/* Image Section */}
        <div className="relative w-full sm:w-1/3 lg:w-1/3 shrink-0">
          <div
            style={{
              background: business.image ? "none" : getRandomGradient(),
            }}
            className="w-full h-48 sm:h-56 md:h-64 lg:h-full flex items-center justify-center overflow-hidden">
            {business.image ? (
              <img
                src={business.image}
                alt={business.name}
                className="w-full h-full object-cover"
                onError={(e) => (e.target.style.display = "none")}
              />
            ) : (
              <span className="text-4xl font-semibold text-gray-600">
                {getFallbackInitials()}
              </span>
            )}
          </div>
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-black/70 backdrop-blur-sm text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs flex items-center">
            <Clock size={12} className="mr-1 sm:mr-1.5" />
            {getYearsSinceEstablishment()}
          </div>
          <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-white/90 backdrop-blur-lg text-gray-800 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md text-xs flex items-center gap-1 sm:gap-2">
            <Eye size={12} className="text-gray-600" />
            {business.views || 0} views
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-4 sm:p-6">
          <div className="space-y-3 sm:space-y-4">
            {/* Header with Rating */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0">
              <div className="space-y-1 sm:space-y-2">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">
                  {business.name || "Unnamed Business"}
                </h3>
                <div className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                  <span className="text-sm sm:text-sm truncate">
                    {business.category || "Not available"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        size={14}
                        className={`${
                          index < Math.round(business.rating || 0)
                            ? "fill-yellow-400 stroke-yellow-400"
                            : "fill-none stroke-gray-400"
                        }`}
                      />
                    ))}
                    <span className="text-xs sm:text-sm text-gray-600 ml-1">
                      {business.rating?.toFixed(1) || "N/A"} (
                      {business.reviews || 0} reviews)
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleShare}
                className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Share this business">
                <Share2 size={16} className="text-gray-600" />
              </button>
            </div>

            {/* Contact Info */}
            <div className="space-y-1 sm:space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={handlePhoneClick}
                  className="flex items-center text-gray-600 hover:text-green-600 transition-colors text-xs sm:text-sm"
                  aria-label="Call the business">
                  <Phone
                    size={16}
                    className="mr-1 sm:mr-2 text-green-500 flex-shrink-0"
                  />
                  <span className="truncate">
                    {business.phone || "Not available"}
                  </span>
                </button>
                <button
                  onClick={handleEmailClick}
                  className="flex items-center text-gray-600 hover:text-blue-600 transition-colors text-xs sm:text-sm"
                  aria-label="Email the business">
                  <Mail
                    size={16}
                    className="mr-1 sm:mr-2 text-blue-500 flex-shrink-0"
                  />
                  <span className="truncate">
                    {business.email || "Not provided"}
                  </span>
                </button>
                <button
                  onClick={handleMapClick}
                  className="flex items-center text-gray-600 hover:text-red-600 transition-colors text-xs sm:text-sm"
                  aria-label="View on map">
                  <MapPin
                    size={16}
                    className="mr-1 sm:mr-2 text-red-500 flex-shrink-0"
                  />
                  <span className="truncate">
                    {business.address || "Not specified"}
                  </span>
                </button>
                {business.business_website && (
                  <button
                    onClick={handleWebsiteClick}
                    className="flex items-center text-gray-600 hover:text-purple-600 transition-colors text-xs sm:text-sm"
                    aria-label="Visit website">
                    <Globe
                      size={16}
                      className="mr-1 sm:mr-2 text-purple-500 flex-shrink-0"
                    />
                    <span className="truncate">Website</span>
                  </button>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-3 sm:pt-4 border-t border-gray-100 gap-2 sm:gap-0">
              <div
                className={`flex items-center ${
                  business.verified ? "text-green-600" : "text-amber-600"
                }`}>
                <Check size={16} className="mr-1 sm:mr-1.5" />
                <span className="text-xs sm:text-sm font-medium">
                  {business.verified ? "Verified" : "Not Verified"}
                </span>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/SingleBusinessPage/${business.slug}`}
                  className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-red-600 text-white transition-all duration-300 hover:bg-red-700 hover:scale-105 whitespace-nowrap">
                  View Profile
                  <ExternalLink size={14} className="ml-1 sm:ml-1.5" />
                </Link>
                <button
                  onClick={handleWhatsAppClick}
                  className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                  aria-label="Send enquiry via WhatsApp">
                  <WhatsApp size={14} className="mr-1 text-green-500" />
                  Send Enquiry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TopNotchBusinesses = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchTopNotchBusinesses = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendURL}/api/lists/business`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data, "top notch data");

      if (data.status === "success") {
        const businessData = Array.isArray(data.data) ? data.data : [data.data];
        const currentDate = new Date();

        let filteredBusinesses = businessData.filter((business) => {
          const biz = business.business || business;
          return (
            biz.payment_status === "paid" &&
            biz.ads_expiry_date &&
            new Date(biz.ads_expiry_date) >= currentDate
          );
        });

        if (filteredBusinesses.length === 0) {
          console.log(
            "No paid ads found, falling back to most viewed businesses"
          );
          filteredBusinesses = [...businessData]
            .sort((a, b) => {
              const bizA = a.business || a;
              const bizB = b.business || b;
              return (bizB.views || 0) - (bizA.views || 0);
            })
            .slice(0, 3);
        }

        setBusinesses(filteredBusinesses.map(formatBusinessForCard));
      } else {
        throw new Error("Failed to fetch businesses");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching top-notch businesses:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatBusinessForCard = (business) => {
    const biz = business.business || business;
    return {
      businessId: biz.id,
      slug: biz.slug,
      name: biz.business_name || "Unnamed Business",
      phone: biz.contact_person_number || "No Contact",
      email: biz.contact_person_email || "No Email",
      category: biz.category_slug || "Not specified",
      sinceDate: biz.date_of_establishment || "N/A",
      rating: biz.average_rating || 0,
      reviews: biz.total_reviews || 0,
      address:
        `${biz.business_address || "Not specified"}, ${biz.state || ""}`.trim(),
      verified: biz.verification_percentage > 50,
      image:
        biz.business_photos && biz.business_photos.length > 0
          ? Array.isArray(biz.business_photos)
            ? biz.business_photos[0].photo_path
            : biz.business_photos[0]
          : null,
      views: biz.views || 0,
      business_website: biz.business_website || null,
    };
  };

  const totalPages = Math.ceil(businesses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBusinesses = businesses.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    fetchTopNotchBusinesses();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Top Notch Businesses in Nigeria
        </h2>
        <Link
          to="/business"
          className="text-red-600 hover:text-red-700 font-medium flex items-center mid:text-sm">
          View All
          <ExternalLink size={16} className="ml-1.5" />
        </Link>
      </div>

      <div className="grid lg:grid-cols-[1fr,300px] gap-6 sm:gap-8">
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="font-medium">Error loading businesses</p>
              <p className="text-sm">{error}</p>
              <button
                onClick={fetchTopNotchBusinesses}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline">
                Try again
              </button>
            </div>
          ) : businesses.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <div className="text-gray-400 mb-4">
                <Briefcase size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No top-notch businesses found
              </h3>
              <p className="text-gray-500">
                Currently no businesses with active premium listings.
              </p>
            </div>
          ) : (
            <>
              {paginatedBusinesses.map((business) => (
                <BusinessCard key={business.businessId} business={business} />
              ))}

              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    } transition-colors`}>
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 1
                    )
                    .map((page, i, array) => (
                      <React.Fragment key={page}>
                        {i > 0 && page - array[i - 1] > 1 && (
                          <span className="px-2">...</span>
                        )}
                        <button
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 rounded-md ${
                            currentPage === page
                              ? "bg-red-600 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          } transition-colors`}>
                          {page}
                        </button>
                      </React.Fragment>
                    ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-1 rounded-md ${
                      currentPage === totalPages
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    } transition-colors`}>
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-6">
            <img
              src={ADS}
              alt="Advertisement"
              className="rounded-lg border border-gray-200"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNotchBusinesses;

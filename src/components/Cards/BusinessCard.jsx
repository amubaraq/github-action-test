// import React from "react";
// import { Link } from "react-router-dom";
// import {
//   MapPin,
//   Mail,
//   ExternalLink,
//   Share2,
//   Star,
//   Phone,
//   Clock,
//   Eye,
// } from "lucide-react";

// function BusinessCard({ business }) {
//   console.log(business, "Business");
//   const handleShare = () => {
//     const shareUrl = `${window.location.origin}/business/${business.slug}`;
//     if (navigator.share) {
//       navigator
//         .share({
//           title: `${business.name} Business Profile`,
//           text: `Check out ${business.name}`,
//           url: shareUrl,
//         })
//         .catch((error) => console.log("Error sharing", error));
//     } else {
//       navigator.clipboard
//         .writeText(shareUrl)
//         .then(() => alert("Business link copied to clipboard!"))
//         .catch((err) => console.error("Could not copy text: ", err));
//     }
//   };

//   const getRandomGradient = () => {
//     const gradients = [
//       "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
//       "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
//       "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
//       "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)",
//       "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
//     ];
//     return gradients[business.id % gradients.length];
//   };
//   // Generate a fallback image using the first letters of the business name
//   const getFallbackInitials = () => {
//     if (!business.name) return "NA"; // Default if no name
//     const words = business.name.trim().split(" ");
//     const initials = words
//       .slice(0, 2) // Take first two words
//       .map((word) => word.charAt(0).toUpperCase())
//       .join("");
//     return initials || "NA";
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md hover:shadow-xl hover:scale-105 hover:border hover:border-red-200 transition-all duration-300 overflow-hidden">
//       <div className="mid:flex mid:flex-row p-3 gap-3">
//         {/* Logo - Rounded and displayed on left side for all screen sizes */}
//         <div
//           style={{
//             background: business.image ? "none" : getRandomGradient(),
//             width: "80px",
//             height: "80px",
//           }}
//           className="rounded-full flex items-center justify-center overflow-hidden border border-gray-300">
//           {business.image ? (
//             <img
//               src={business.image}
//               alt={business.name}
//               className="w-full h-full object-cover"
//               onError={(e) => (e.target.style.display = "none")}
//             />
//           ) : (
//             <span className="text-3xl font-semibold text-gray-600">
//               {getFallbackInitials()}
//             </span>
//           )}
//         </div>

//         {/* Business Details - Always to the right of the logo */}
//         <div className="flex-1 min-w-0">
//           <div className="flex items-center justify-between mb-1">
//             <h3 className="text-base font-bold text-gray-900 truncate">
//               {business.name || "Unnamed Business"}
//             </h3>
//           </div>

//           {/* Rating and Reviews */}
//           <div className="flex justify-between items-center mb-2">
//             <div className="flex align-middle items-center">
//               <Star
//                 className="w-4 h-4 fill-yellow-400 stroke-yellow-400 mr-1"
//                 size={14}
//               />
//               <span className="text-sm font-medium">
//                 {business.rating?.toFixed(1) || "N/A"}
//               </span>
//               <span className="text-xs text-gray-500 ml-1">
//                 ({business.reviews || 0} reviews)
//               </span>
//             </div>
//             <div className="ml-3 flex items-center">
//               <Eye size={12} className="mr-1 text-gray-500" />
//               <span className="text-xs font-medium text-gray-600">
//                 {business.views?.toLocaleString() || 0}{" "}
//                 {business.views > 1 ? "Views" : "View"}
//               </span>
//             </div>
//           </div>

//           {/* Categories */}
//           {business.category && (
//             <div className="flex flex-wrap gap-1 mb-2">
//               {business.category
//                 .split(",")
//                 .slice(0, 2)
//                 .map((category, index) => (
//                   <span
//                     key={index}
//                     className="inline-block bg-red-50 text-red-700 text-xs px-2 py-0.5 rounded-full border border-red-100 truncate max-w-full">
//                     {category.trim()}
//                   </span>
//                 ))}
//               {business.category.split(",").length > 2 && (
//                 <span className="inline-block text-xs text-gray-500">
//                   +{business.category.split(",").length - 2} more
//                 </span>
//               )}
//             </div>
//           )}

//           {/* Contact Details */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1 gap-x-4 text-xs text-gray-600">
//             <div className="flex items-center truncate">
//               <MapPin size={14} className="mr-1.5 text-red-500 flex-shrink-0" />
//               <span className="truncate">
//                 {business.address || "Not specified"}
//               </span>
//             </div>
//             <div className="flex items-center truncate">
//               <Mail size={14} className="mr-1.5 text-blue-500 flex-shrink-0" />
//               <span className="truncate">
//                 {business.owner?.email || "Not provided"}
//               </span>
//             </div>
//             <div className="flex items-center truncate md:col-span-2">
//               <Phone
//                 size={14}
//                 className="mr-1.5 text-green-500 flex-shrink-0"
//               />
//               <span className="truncate">
//                 {business.owner?.phone || "Not available"}
//               </span>
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="mt-3 flex justify-between items-center">
//             <button
//               onClick={handleShare}
//               className="px-2 py-1 border bg-gray-50 text-xs flex items-center rounded-full hover:bg-gray-100 transition-colors"
//               aria-label="Share">
//               <Share2 size={12} className="text-blue-500 mr-1" /> Share
//             </button>
//             <Link
//               to={`/SingleBusinessPage/${business.slug}`}
//               className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-600 text-white hover:bg-red-700 transition-colors">
//               View Business
//               <ExternalLink size={12} className="ml-1" />
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default BusinessCard;

// import React from "react";
// import { Link } from "react-router-dom";
// import {
//   MapPin,
//   Mail,
//   ExternalLink,
//   Share2,
//   Star,
//   Phone,
//   Clock,
//   Eye,
//   MessageCircle, // Using MessageCircle as a placeholder for WhatsApp icon
// } from "lucide-react";
// import { WhatsApp } from "@mui/icons-material";

// function BusinessCard({ business }) {
//   const handleShare = () => {
//     const shareUrl = `${window.location.origin}/business/${business.slug}`;
//     if (navigator.share) {
//       navigator
//         .share({
//           title: `${business.name} Business Profile`,
//           text: `Check out ${business.name}`,
//           url: shareUrl,
//         })
//         .catch((error) => console.log("Error sharing", error));
//     } else {
//       navigator.clipboard
//         .writeText(shareUrl)
//         .then(() => alert("Business link copied to clipboard!"))
//         .catch((err) => console.error("Could not copy text: ", err));
//     }
//   };

//   const handleWhatsAppClick = () => {
//     const phoneNumber = (business?.phone || "").replace(/\D/g, ""); // Remove non-digits
//     const whatsappUrl = `https://wa.me/${phoneNumber}`;
//     window.open(whatsappUrl, "_blank");
//   };

//   const handlePhoneClick = () => {
//     const phoneNumber = business?.phone || "";
//     window.location.href = `tel:${phoneNumber}`;
//     console.log(business, "business");
//   };
//   const getRandomGradient = () => {
//     const gradients = [
//       "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
//       "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
//       "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
//       "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)",
//       "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
//     ];
//     return gradients[business.id % gradients.length];
//   };

//   const getFallbackInitials = () => {
//     if (!business.name) return "NA";
//     const words = business.name.trim().split(" ");
//     const initials = words
//       .slice(0, 2)
//       .map((word) => word.charAt(0).toUpperCase())
//       .join("");
//     return initials || "NA";
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-md hover:shadow-xl hover:scale-105 hover:border hover:border-red-200 transition-all duration-300 overflow-hidden">
//       <div className="mid:flex mid:flex-row p-3 gap-3">
//         {/* Logo - Rounded and displayed on left side for all screen sizes */}
//         <div
//           style={{
//             background: business.image ? "none" : getRandomGradient(),
//             width: "80px",
//             height: "80px",
//           }}
//           className="rounded-full flex items-center justify-center overflow-hidden border border-gray-300">
//           {business.image ? (
//             <img
//               src={business.image}
//               alt={business.name}
//               className="w-full h-full object-cover"
//               onError={(e) => (e.target.style.display = "none")}
//             />
//           ) : (
//             <span className="text-3xl font-semibold text-gray-600">
//               {getFallbackInitials()}
//             </span>
//           )}
//         </div>

//         {/* Business Details - Always to the right of the logo */}
//         <div className="flex-1 min-w-0">
//           <div className="flex items-center justify-between mb-1">
//             <h3 className="text-base font-bold text-gray-900 truncate">
//               {business.name || "Unnamed Business"}
//             </h3>
//           </div>

//           {/* Rating and Reviews */}
//           <div className="flex justify-between items-center mb-2">
//             <div className="flex align-middle items-center">
//               <Star
//                 className="w-4 h-4 fill-yellow-400 stroke-yellow-400 mr-1"
//                 size={14}
//               />
//               <span className="text-sm font-medium">
//                 {business.rating?.toFixed(1) || "N/A"}
//               </span>
//               <span className="text-xs text-gray-500 ml-1">
//                 ({business.reviews || 0} reviews)
//               </span>
//             </div>
//             <div className="ml-3 flex items-center">
//               <Eye size={12} className="mr-1 text-gray-500" />
//               <span className="text-xs font-medium text-gray-600">
//                 {business.views?.toLocaleString() || 0}{" "}
//                 {business.views > 1 ? "Views" : "View"}
//               </span>
//             </div>
//           </div>

//           {/* Categories */}
//           {business.category && (
//             <div className="flex flex-wrap gap-1 mb-2">
//               {business.category
//                 .split(",")
//                 .slice(0, 2)
//                 .map((category, index) => (
//                   <span
//                     key={index}
//                     className="inline-block bg-red-50 text-red-700 text-xs px-2 py-0.5 rounded-full border border-red-100 truncate max-w-full">
//                     {category.trim()}
//                   </span>
//                 ))}
//               {business.category.split(",").length > 2 && (
//                 <span className="inline-block text-xs text-gray-500">
//                   +{business.category.split(",").length - 2} more
//                 </span>
//               )}
//             </div>
//           )}

//           {/* Contact Details */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1 gap-x-4 text-xs text-gray-600">
//             <div className="flex items-center truncate">
//               <MapPin size={14} className="mr-1.5 text-red-500 flex-shrink-0" />
//               <span className="truncate">
//                 {business.address || "Not specified"}
//               </span>
//             </div>
//             <div className="flex items-center truncate">
//               <Mail size={14} className="mr-1.5 text-blue-500 flex-shrink-0" />
//               <span className="truncate">
//                 {business?.email || "Not provided"}
//               </span>
//             </div>
//             <div className="flex items-center truncate md:col-span-2">
//               <Phone
//                 size={14}
//                 className="mr-1.5 text-green-500 flex-shrink-0"
//               />
//               <button
//                 onClick={handlePhoneClick}
//                 className="truncate text-gray-600 hover:text-green-600 transition-colors">
//                 {business?.phone || "Not available"}
//               </button>
//             </div>
//             <div className="flex items-center truncate md:col-span-2">
//               <button
//                 onClick={handleWhatsAppClick}
//                 className="flex items-center text-gray-600 hover:text-green-600 transition-colors"
//                 aria-label="Chat on WhatsApp">
//                 <MessageCircle
//                   size={14}
//                   className="mr-1.5 text-green-500 flex-shrink-0 h-3 w-3"
//                 />
//                 <span className="truncate">Chat on WhatsApp</span>
//               </button>
//             </div>
//           </div>

//           {/* Actions */}
//           <div className="mt-3 flex justify-between items-center">
//             <button
//               onClick={handleShare}
//               className="px-2 py-1 border bg-gray-50 text-xs flex items-center rounded-full hover:bg-gray-100 transition-colors"
//               aria-label="Share">
//               <Share2 size={12} className="text-blue-500 mr-1" /> Share
//             </button>
//             <Link
//               to={`/SingleBusinessPage/${business.slug}`}
//               className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-600 text-white hover:bg-red-700 transition-colors">
//               View Business
//               <ExternalLink size={12} className="ml-1" />
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default BusinessCard;

import React from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Mail,
  ExternalLink,
  Share2,
  Star,
  Phone,
  Clock,
  Eye,
  MessageCircle,
  Globe,
} from "lucide-react";

function BusinessCard({ business }) {
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
    return gradients[business.id % gradients.length];
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
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden w-full max-w-md mx-auto">
      <div className=" flex-col sm:flex-row p-4 gap-4">
        {/* Logo Section */}
        <div className="flex-shrink-0">
          <div
            style={{
              background: business.image ? "none" : getRandomGradient(),
              width: "80px",
              height: "80px",
            }}
            className="rounded-full flex items-center justify-center overflow-hidden border border-gray-300 mx-auto sm:mx-0">
            {business.image ? (
              <img
                src={business.image}
                alt={business.name}
                className="w-full h-full object-cover"
                onError={(e) => (e.target.style.display = "none")}
              />
            ) : (
              <span className="text-3xl font-semibold text-gray-600">
                {getFallbackInitials()}
              </span>
            )}
          </div>
        </div>

        {/* Business Details */}
        <div className="flex-1 min-w-0">
          {/* Business Name and Verification */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-900 truncate">
              {business.name || "Unnamed Business"}
            </h3>
            <button
              onClick={handleShare}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Share">
              <Share2 size={16} className="text-gray-600" />
            </button>
          </div>

          {/* Address */}
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin size={16} className="mr-2 text-red-500 flex-shrink-0" />
            <span className="text-sm truncate">
              {business.address || "Not specified"}
            </span>
          </div>

          {/* Category and Years */}
          <div className="flex items-center gap-2 mb-2">
            {business.category && (
              <span className="inline-block bg-red-50 text-red-700 text-xs px-2 py-0.5 rounded-full border border-red-100">
                {business.category}
              </span>
            )}
            <span className="flex items-center text-xs text-gray-600">
              <Clock size={14} className="mr-1" />
              {getYearsSinceEstablishment()}
            </span>
          </div>

          {/* Rating and Views */}
          <div className="flex items-center gap-3 mb-3">
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
              <span className="text-xs text-gray-600 ml-1">
                {business.rating?.toFixed(1) || "N/A"}{" "}
                <span className="ml-3"> ({business.reviews || 0} Reviews)</span>
              </span>
            </div>
          </div>

          {/* Contact Options */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={handlePhoneClick}
              className="flex items-center text-gray-600 hover:text-green-600 transition-colors text-xs">
              <Phone size={16} className="mr-1 text-green-500 flex-shrink-0" />
              <span className="truncate">Call</span>
            </button>
            <button
              onClick={handleEmailClick}
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors text-xs">
              <Mail size={16} className="mr-1 text-blue-500 flex-shrink-0" />
              <span className="truncate">E-mail</span>
            </button>
            <button
              onClick={handleMapClick}
              className="flex items-center text-gray-600 hover:text-red-600 transition-colors text-xs">
              <MapPin size={16} className="mr-1 text-red-500 flex-shrink-0" />
              <span className="truncate">Map</span>
            </button>
            <button className="flex items-center text-gray-600 hover:text-red-600 transition-colors text-xs">
              <div className="flex items-center">
                <Eye size={14} className="text-gray-500 mr-1" />
                <span className="text-xs text-gray-600">
                  {business.views?.toLocaleString() || 0} Views
                </span>
              </div>
            </button>
            {business.business_website && (
              <button
                onClick={handleWebsiteClick}
                className="flex items-center text-gray-600 hover:text-purple-600 transition-colors text-xs">
                <Globe
                  size={16}
                  className="mr-1 text-purple-500 flex-shrink-0"
                />
                <span className="truncate">Website</span>
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Link
              to={`/SingleBusinessPage/${business.slug}`}
              className="flex-1 text-center px-3 py-1.5 rounded-full text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors">
              View Profile
            </Link>
            <button
              onClick={handleWhatsAppClick}
              className="flex-1 text-center px-3 py-1.5 rounded-full text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Send Enquiry via WhatsApp">
              Send Enquiry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusinessCard;

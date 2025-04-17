// import React from "react";
// import { Link } from "react-router-dom";
// import {
//   MapPin,
//   Mail,
//   ExternalLink,
//   Share2,
//   Phone,
//   User,
//   Briefcase,
//   Calendar,
//   Users,
//   EyeIcon,
//   Check,
// } from "lucide-react";

// function PeopleCard({ person }) {
//   const handleShare = () => {
//     if (navigator.share) {
//       navigator
//         .share({
//           title: `${person.name} Profile`,
//           text: `Check out ${person.name}'s profile`,
//           url: window.location.href + "/" + person.slug,
//         })
//         .catch((error) => console.log("Error sharing", error));
//     } else {
//       // Fallback - copy to clipboard
//       navigator.clipboard
//         .writeText(window.location.href + "/" + person.slug)
//         .then(() => alert("Profile link copied to clipboard!"))
//         .catch((err) => console.error("Could not copy text: ", err));
//     }
//   };

//   // Generate random color for profile background if no image
//   const getRandomGradient = () => {
//     const gradients = [
//       "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
//       "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
//       "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
//       "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)",
//       "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
//     ];
//     return gradients[person.id % gradients.length];
//   };

//   // Utility function to mask phone number
//   const maskPhoneNumber = (phone) => {
//     if (!phone || phone.length < 10) return phone; // Return original if invalid or too short
//     return `${phone.slice(0, 8)}****${phone.slice(-2)}`;
//   };

//   // Utility function to mask email
//   const maskEmail = (email) => {
//     if (!email || !email.includes("@")) return email;

//     const [localPart, domain] = email.split("@");
//     const visibleStart = localPart.slice(0, 3);
//     const masked = "*".repeat(localPart.length - 3);
//     return `${visibleStart}${masked}@${domain}`;
//   };

//   return (
//     <div className="bg-white rounded-lg shadow hover:shadow-lg border border-gray-400 transition-shadow duration-300 overflow-hidden relative">
//       <div className="flex flex-col mid:flex-row">
//         {/* Card Image/Placeholder (Top on Medium/Large, Left on Small) */}
//         <div className="relative w-full mid:w-1/3">
//           <div
//             style={{
//               background: getRandomGradient(),
//               height: "120px",
//             }}
//             className="w-full flex items-center justify-center">
//             {person.image ? (
//               <img
//                 src={person.image}
//                 alt={person.name}
//                 className="w-full h-full object-cover"
//                 onError={(e) => {
//                   e.target.style.display = "none";
//                 }}
//               />
//             ) : (
//               <User size={40} className="text-gray-400" />
//             )}
//           </div>

//           {/* Top Overlay */}
//           <div className="absolute mid:hidden top-0 left-0 right-0 p-2 flex justify-between items-start">
//             <div className="bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center">
//               <Briefcase size={10} className="mr-1" />
//               {person.profession}
//             </div>
//           </div>
//         </div>

//         {/* Personal Details (Bottom on Medium/Large, Right on Small) */}
//         <div className="p-3 w-full mid:w-2/3">
//           <div className="flex justify-between">
//             <div>
//               <h3 className="text-base font-bold text-gray-900 mb-1">
//                 {person.name}
//               </h3>
//             </div>
//             <div className="flex text-xs items-center ">
//               <EyeIcon size={14} className="mr-1" /> views {person.views || 0}
//             </div>
//           </div>

//           <div className="my-1">
//             {person.verification_percentage && (
//               <div
//                 className={`flex items-center ${
//                   person.verification_percentage >= 80
//                     ? "text-green-600"
//                     : "text-amber-600"
//                 }`}>
//                 <Check size={16} sm:size={18} className="mr-1 sm:mr-1.5" />
//                 <span className="text-xs sm:text-sm font-medium">
//                   {person.verification_percentage}% Verified
//                 </span>
//               </div>
//             )}
//           </div>

//           <div className="space-y-1.5 text-xs">
//             <div className="flex items-center text-gray-600">
//               <MapPin size={14} className="mr-1.5 text-red-500 flex-shrink-0" />
//               <span className="truncate">{person.location}</span>
//             </div>
//             <div className="flex items-center text-gray-600">
//               <Mail size={14} className="mr-1.5 text-blue-500 flex-shrink-0" />
//               <span className="truncate">
//                 {maskEmail(person.email) || "My email address"}
//               </span>
//             </div>
//             <div className="flex items-center text-gray-600">
//               <Phone
//                 size={14}
//                 className="mr-1.5 text-green-500 flex-shrink-0"
//               />
//               <span className="truncate">{maskPhoneNumber(person.phone)}</span>
//             </div>
//           </div>

//           <div className="mt-3 flex justify-between items-center">
//             <button
//               onClick={handleShare}
//               className="px-2 py-1 border bg-gray-50 text-xs flex items-center rounded-full transition-colors hover:bg-gray-100"
//               aria-label="Share">
//               <Share2 size={12} className="text-blue-500 mr-1" /> Share
//             </button>
//             <Link
//               to={`/profile/${person.slug}`}
//               className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-600 text-white hover:bg-red-700 transition-colors">
//               View Profile
//               <ExternalLink size={12} className="ml-1" />
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default PeopleCard;
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  MapPin,
  Mail,
  ExternalLink,
  Share2,
  Phone,
  User,
  Briefcase,
  Check,
  EyeIcon,
} from "lucide-react";
import LoginModal from "../../components/tools/LoginModal"; // Adjust the import path as needed

function PeopleCard({ person }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { userInfo } = useSelector((state) => state.auth); // Get user info from Redux

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${person.name} Profile`,
          text: `Check out ${person.name}'s profile`,
          url: window.location.href + "/" + person.slug,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard
        .writeText(window.location.href + "/" + person.slug)
        .then(() => alert("Profile link copied to clipboard!"))
        .catch((err) => console.error("Could not copy text: ", err));
    }
  };

  const handleViewProfile = (e) => {
    if (!userInfo) {
      e.preventDefault();
      setShowLoginModal(true);
    }
    // If user is logged in, the Link will handle navigation normally
  };

  // Generate random color for profile background if no image
  const getRandomGradient = () => {
    const gradients = [
      "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)",
      "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
    ];
    return gradients[person.id % gradients.length];
  };

  // Utility function to mask phone number
  const maskPhoneNumber = (phone) => {
    if (!phone || phone.length < 10) return phone; // Return original if invalid or too short
    return `${phone.slice(0, 8)}****${phone.slice(-2)}`;
  };

  // Utility function to mask email
  const maskEmail = (email) => {
    if (!email || !email.includes("@")) return email;

    const [localPart, domain] = email.split("@");
    const visibleStart = localPart.slice(0, 3);
    const masked = "*".repeat(localPart.length - 3);
    return `${visibleStart}${masked}@${domain}`;
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow hover:shadow-lg border border-gray-400 transition-shadow duration-300 overflow-hidden relative">
        <div className="flex flex-col mid:flex-row">
          {/* Card Image/Placeholder (Top on Medium/Large, Left on Small) */}
          <div className="relative w-full mid:w-1/3">
            <div
              style={{
                background: getRandomGradient(),
                height: "120px",
              }}
              className="w-full flex items-center justify-center">
              {person.image ? (
                <img
                  src={person.image}
                  alt={person.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <User size={40} className="text-gray-400" />
              )}
            </div>

            {/* Top Overlay */}
            <div className="absolute mid:hidden top-0 left-0 right-0 p-2 flex justify-between items-start">
              <div className="bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center">
                <Briefcase size={10} className="mr-1" />
                {person.profession}
              </div>
            </div>
          </div>

          {/* Personal Details (Bottom on Medium/Large, Right on Small) */}
          <div className="p-3 w-full mid:w-2/3">
            <div className="flex justify-between">
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-1">
                  {person.name}
                </h3>
              </div>
              <div className="flex text-xs items-center ">
                <EyeIcon size={14} className="mr-1" /> views {person.views || 0}
              </div>
            </div>

            <div className="my-1">
              {person.verification_percentage && (
                <div
                  className={`flex items-center ${
                    person.verification_percentage >= 80
                      ? "text-green-600"
                      : "text-amber-600"
                  }`}>
                  <Check size={16} sm:size={18} className="mr-1 sm:mr-1.5" />
                  <span className="text-xs sm:text-sm font-medium">
                    {person.verification_percentage}% Verified
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center text-gray-600">
                <MapPin
                  size={14}
                  className="mr-1.5 text-red-500 flex-shrink-0"
                />
                <span className="truncate">{person.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Mail
                  size={14}
                  className="mr-1.5 text-blue-500 flex-shrink-0"
                />
                <span className="truncate">
                  {maskEmail(person.email) || "My email address"}
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone
                  size={14}
                  className="mr-1.5 text-green-500 flex-shrink-0"
                />
                <span className="truncate">
                  {maskPhoneNumber(person.phone)}
                </span>
              </div>
            </div>

            <div className="mt-3 flex justify-between items-center">
              <button
                onClick={handleShare}
                className="px-2 py-1 border bg-gray-50 text-xs flex items-center rounded-full transition-colors hover:bg-gray-100"
                aria-label="Share">
                <Share2 size={12} className="text-blue-500 mr-1" /> Share
              </button>
              <Link
                to={`/profile/${person.slug}`}
                onClick={handleViewProfile}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-600 text-white hover:bg-red-700 transition-colors">
                View Profile
                <ExternalLink size={12} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          message="Please login to view this profile"
        />
      )}
    </>
  );
}

export default PeopleCard;

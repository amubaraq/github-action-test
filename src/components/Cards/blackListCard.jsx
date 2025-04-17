// import React from "react";
// import { AlertTriangle, Share, ExternalLink } from "lucide-react";

// export const PeopleBlacklistCard = ({ person }) => {
//   const fullName =
//     `${person?.first_name} ${person?.middle_name || ""} ${person?.last_name || ""}`.trim();
//   const location = `${person?.city || "N/A"}, ${person?.state || "N/A"}`;

//   return (
//     <div className="bg-white rounded-lg shadow border overflow-hidden">
//       {/* Category Badge */}
//       <div className="relative">
//         <div className="bg-red-600 text-white px-3 py-1 rounded-md absolute top-3 left-3 text-sm font-medium">
//           <span>Blacklisted</span>
//         </div>
//       </div>

//       {/* Profile Image or Placeholder */}
//       <div className="h-48 bg-gray-200 relative">
//         {person?.user_photo?.photo_path ? (
//           <img
//             src={person?.user_photo.photo_path}
//             alt={fullName}
//             className="w-full h-full object-cover"
//           />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center bg-gray-200">
//             <span className="text-6xl text-gray-500">
//               {(person?.first_name?.[0] || "") + (person?.last_name?.[0] || "")}
//             </span>
//           </div>
//         )}
//       </div>

//       {/* Details */}
//       <div className="p-4">
//         <h3 className="text-lg font-semibold text-gray-800">{fullName}</h3>
//         <p className="text-sm text-gray-600">{location}</p>

//         <div className="mt-3 space-y-2 text-sm">
//           <div className="flex justify-between">
//             <span className="text-gray-600">Profession:</span>
//             <span className="text-gray-800">{person?.profession || "N/A"}</span>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-gray-600">Status:</span>
//             <span className="text-red-600 font-medium">{person?.status}</span>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-gray-600">Listed Since:</span>
//             <span className="text-gray-800">
//               {new Date(person?.created_at).toLocaleDateString()}
//             </span>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-gray-600">Reports:</span>
//             <span className="text-gray-800">{person?.report_count || 0}</span>
//           </div>
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="border-t p-3 flex justify-between">
//         <button className="flex items-center text-sm  text-gray-500 underline px-1 py-0 rounded">
//           <ExternalLink className="h-3 w-3 mr-1" />
//           <span>View Reports</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// // export const BusinessBlacklistCard = ({ business }) => {
// //   return (
// //     <div className="bg-white rounded-lg shadow border overflow-hidden">
// //       {/* Category Badge */}
// //       <div className="relative">
// //         <div className="bg-red-600 text-white px-3 py-1 rounded-md absolute top-3 left-3 text-sm font-medium">
// //           <span>Blacklisted</span>
// //         </div>
// //       </div>

// //       {/* Business Image or Placeholder */}
// //       <div className="h-48 bg-gray-200 relative">
// //         {business.logo ? (
// //           <img
// //             src={business.logo}
// //             alt={business.name}
// //             className="w-full h-full object-cover"
// //           />
// //         ) : (
// //           <div className="w-full h-full flex items-center justify-center bg-gray-200">
// //             <span className="text-6xl text-gray-500">
// //               {business.name?.[0] || "B"}
// //             </span>
// //           </div>
// //         )}
// //       </div>

// //       {/* Details */}
// //       <div className="p-4">
// //         <h3 className="text-lg font-semibold text-gray-800">{business.name}</h3>
// //         <p className="text-sm text-gray-600">{business.location || "N/A"}</p>

// //         <div className="mt-3 space-y-2 text-sm">
// //           <div className="flex justify-between">
// //             <span className="text-gray-600">Industry:</span>
// //             <span className="text-gray-800">{business.industry || "N/A"}</span>
// //           </div>
// //           <div className="flex justify-between">
// //             <span className="text-gray-600">Status:</span>
// //             <span className="text-red-600 font-medium">{business.status}</span>
// //           </div>
// //           <div className="flex justify-between">
// //             <span className="text-gray-600">Listed Since:</span>
// //             <span className="text-gray-800">
// //               {new Date(business.created_at).toLocaleDateString()}
// //             </span>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Action Buttons */}
// //       <div className="border-t p-3 flex justify-between">
// //         <button className="flex items-center text-blue-600">
// //           <Share className="h-4 w-4 mr-1" />
// //           <span>Share</span>
// //         </button>

// //         <button className="flex items-center bg-red-600 text-white px-3 py-1 rounded">
// //           <ExternalLink className="h-4 w-4 mr-1" />
// //           <span>View Profile</span>
// //         </button>
// //       </div>
// //     </div>
// //   );
// // };

// export const BusinessBlacklistCard = ({ business }) => {
//   const location = `${business.city || "N/A"}, ${business.state || "N/A"}`;
//   const blacklistedDate = business.updated_at || business.created_at;

//   return (
//     <div className="bg-white rounded-lg shadow border overflow-hidden hover:shadow-lg transition-shadow">
//       {/* Status Badge */}
//       <div className="relative">
//         <div className="bg-red-600 text-white px-3 py-1 rounded-md absolute top-3 left-3 text-sm font-medium">
//           <span>Blacklisted</span>
//         </div>
//       </div>

//       {/* Business Image or Placeholder */}
//       <div className="h-48 bg-gray-200 relative">
//         {business.business_photos && business.business_photos.length > 0 ? (
//           <img
//             src={business.business_photos[0].photo_path}
//             alt={business.business_name}
//             className="w-full h-full object-cover"
//           />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center bg-gray-200">
//             <span className="text-6xl text-gray-500">
//               {business.business_name?.[0] || "B"}
//             </span>
//           </div>
//         )}
//       </div>

//       {/* Details */}
//       <div className="p-4">
//         <h3 className="text-lg font-semibold text-gray-800 truncate">
//           {business.business_name}
//         </h3>
//         <p className="text-sm text-gray-600">{location}</p>
//         <p className="text-sm text-gray-600 truncate">
//           {business.business_address}
//         </p>

//         <div className="mt-3 space-y-2 text-sm">
//           <div className="flex justify-between">
//             <span className="text-gray-600">Industry:</span>
//             <span className="text-gray-800">
//               {business.business_line || "N/A"}
//             </span>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-gray-600">Status:</span>
//             <span className="text-red-600 font-medium">{business.status}</span>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-gray-600">Blacklisted Since:</span>
//             <span className="text-gray-800">
//               {new Date(blacklistedDate).toLocaleDateString()}
//             </span>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-gray-600">Report Count:</span>
//             <span className="text-gray-800">{business.report_count || 0}</span>
//           </div>
//         </div>
//       </div>

//       {/* Action Buttons */}
//       <div className="border-t p-3 flex justify-between">
//         <button
//           onClick={() => window.open(`/business/${business.slug}`, "_blank")}
//           className="flex items-center text-sm text-gray-500 underline px-1 py-0 rounded hover:text-gray-700">
//           <ExternalLink className="h-3 w-3 mr-1" />
//           <span>View Profile</span>
//         </button>
//         <div className="flex items-center text-sm text-yellow-600">
//           <AlertTriangle className="h-4 w-4 mr-1" />
//           <span>{business.report_count || 0} Reports</span>
//         </div>
//       </div>
//     </div>
//   );
// };
import React from "react";
import { AlertTriangle, ExternalLink } from "lucide-react";

export const PeopleBlacklistCard = ({ person }) => {
  const fullName =
    `${person?.first_name} ${person?.middle_name || ""} ${person?.last_name || ""}`.trim();
  const location = `${person?.city || "N/A"}, ${person?.state || "N/A"}`;
  const blacklistedDate = person?.updated_at || person?.created_at;

  return (
    <div className="bg-white rounded-lg shadow border overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <div className="bg-red-600 text-white px-3 py-1 rounded-md absolute top-3 left-3 text-sm font-medium">
          <span>Blacklisted</span>
        </div>
      </div>

      <div className="h-48 bg-gray-200 relative">
        {person?.user_photo?.photo_path ? (
          <img
            src={person?.user_photo.photo_path}
            alt={fullName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-6xl text-gray-500">
              {(person?.first_name?.[0] || "") + (person?.last_name?.[0] || "")}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {fullName}
        </h3>
        <p className="text-sm text-gray-600">{location}</p>

        <div className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Profession:</span>
            <span className="text-gray-800">{person?.profession || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className="text-red-600 font-medium">{person?.status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Blacklisted Since:</span>
            <span className="text-gray-800">
              {blacklistedDate
                ? new Date(blacklistedDate).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Report Count:</span>
            <span className="text-gray-800">{person?.report_count || 0}</span>
          </div>
        </div>
      </div>

      <div className="border-t p-3 flex justify-between">
        <button
          onClick={() => window.open(`/profile/${person?.id}`, "_blank")}
          className="flex items-center text-sm text-gray-500 underline px-1 py-0 rounded hover:text-gray-700">
          <ExternalLink className="h-3 w-3 mr-1" />
          <span>View Profile</span>
        </button>
        <div className="flex items-center text-sm text-yellow-600">
          <AlertTriangle className="h-4 w-4 mr-1" />
          <span>{person?.report_count || 0} Reports</span>
        </div>
      </div>
    </div>
  );
};

export const BusinessBlacklistCard = ({ business }) => {
  const location = `${business.city || "N/A"}, ${business.state || "N/A"}`;
  const blacklistedDate = business.updated_at || business.created_at;

  return (
    <div className="bg-white rounded-lg shadow border overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <div className="bg-red-600 text-white px-3 py-1 rounded-md absolute top-3 left-3 text-sm font-medium">
          <span>Blacklisted</span>
        </div>
      </div>

      <div className="h-auto flex justify-center bg-gray-200 relative">
        {business.business_photos && business.business_photos.length > 0 ? (
          <img
            src={business.business_photos[0].photo_path}
            alt={business.business_name}
            className="w-24 h-24 rounded-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <span className="text-6xl text-gray-500">
              {business.business_name?.[0] || "B"}
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {business.business_name}
        </h3>
        <p className="text-sm text-gray-600">{location}</p>
        <p className="text-sm text-gray-600 truncate">
          {business.business_address}
        </p>

        <div className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Industry:</span>
            <span className="text-gray-800">
              {business.business_line || "N/A"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span className="text-red-600 font-medium">{business.status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Blacklisted Since:</span>
            <span className="text-gray-800">
              {blacklistedDate
                ? new Date(blacklistedDate).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Report Count:</span>
            <span className="text-gray-800">{business.report_count || 0}</span>
          </div>
        </div>
      </div>

      <div className="border-t p-3 flex justify-between">
        <button
          onClick={() => window.open(`/business/${business.slug}`, "_blank")}
          className="flex items-center text-sm text-gray-500 underline px-1 py-0 rounded hover:text-gray-700">
          <ExternalLink className="h-3 w-3 mr-1" />
          <span>View Profile</span>
        </button>
        <div className="flex items-center text-sm text-yellow-600">
          <AlertTriangle className="h-4 w-4 mr-1" />
          <span>{business.report_count || 0} Reports</span>
        </div>
      </div>
    </div>
  );
};

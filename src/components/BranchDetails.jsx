// import React from "react";
// import {
//   Building2,
//   MapPin,
//   Phone,
//   Mail,
//   Clock,
//   Users,
//   Calendar,
// } from "lucide-react";
// import { motion } from "framer-motion";

// // Animation variant for fade-in effect
// const fadeInUp = {
//   hidden: { opacity: 0, y: 20 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
// };

// const BranchDetails = ({ branches }) => {
//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return isNaN(date)
//       ? "Invalid"
//       : date.toLocaleDateString("en-US", {
//           month: "short",
//           day: "numeric",
//           year: "numeric",
//         });
//   };

//   return (
//     <div className="space-y-6">
//       <h2 className="text-lg font-semibold flex items-center gap-2 mb-2">
//         <Building2 size={18} className="text-blue-500" /> Branches
//       </h2>
//       {branches.length === 0 ? (
//         <p className="text-gray-500 text-sm">No branches available.</p>
//       ) : (
//         branches.map((branch) => (
//           <motion.div
//             key={branch.id}
//             className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200"
//             initial="hidden"
//             animate="visible"
//             variants={fadeInUp}>
//             <h3 className="text-md font-semibold text-gray-800 mb-2">
//               {branch.branch_name}
//             </h3>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
//               <div className="flex items-center gap-2">
//                 <MapPin size={14} className="text-red-500" />
//                 <span>
//                   {branch.branch_address}, {branch.city}, {branch.state}
//                 </span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Phone size={14} className="text-green-500" />
//                 <span>{branch.contact_number}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Mail size={14} className="text-blue-500" />
//                 <span>{branch.contact_email}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Users size={14} className="text-green-500" />
//                 <span>{branch.number_of_staff} Staff</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Clock size={14} className="text-blue-500" />
//                 <span>{branch.operation_hours}</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Calendar size={14} className="text-orange-500" />
//                 <span>Established: {formatDate(branch.date_established)}</span>
//               </div>
//             </div>
//           </motion.div>
//         ))
//       )}
//     </div>
//   );
// };

// export default BranchDetails;
import React from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Clock,
  Users,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";

// Animation variant for fade-in effect
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const BranchDetails = ({ branches }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date)
      ? "Invalid"
      : date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
  };

  // Function to create a URL-friendly slug
  const createSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w\-]+/g, "") // Remove all non-word chars
      .replace(/\-\-+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start of text
      .replace(/-+$/, ""); // Trim - from end of text
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-2">
        <Building2 size={18} className="text-blue-500" /> Branches
      </h2>
      {branches.length === 0 ? (
        <p className="text-gray-500 text-sm">No branches available.</p>
      ) : (
        branches.map((branch) => {
          const branchSlug = createSlug(branch.branch_name);
          return (
            <Link
              to={`/businessBranch/${branchSlug}`}
              key={branch.id}
              state={{ branchData: branch }} // Pass branch data via state
              className="block hover:no-underline">
              <motion.div
                className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}>
                <h3 className="text-md font-semibold text-gray-800 mb-2">
                  {branch.branch_name}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-red-500" />
                    <span>
                      {branch.branch_address}, {branch.city}, {branch.state}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-green-500" />
                    <span>{branch.contact_number}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-blue-500" />
                    <span>{branch.contact_email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-green-500" />
                    <span>{branch.number_of_staff} Staff</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-blue-500" />
                    <span>{branch.operation_hours}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-orange-500" />
                    <span>
                      Established: {formatDate(branch.date_established)}
                    </span>
                  </div>
                </div>
              </motion.div>
            </Link>
          );
        })
      )}
    </div>
  );
};

export default BranchDetails;

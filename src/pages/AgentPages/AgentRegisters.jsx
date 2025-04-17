// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { useSelector } from "react-redux";
// import {
//   FaSearch,
//   FaEye,
//   FaChevronLeft,
//   FaChevronRight,
//   FaFilter,
// } from "react-icons/fa";
// import { Alert, AlertDescription } from "../../components/tools/Alert";
// import backendURL from "../../config";
// import { useNavigate } from "react-router-dom";

// const AgentRegisters = () => {
//   const [users, setUsers] = useState([]);
//   const [filteredUsers, setFilteredUsers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showAlert, setShowAlert] = useState(false);
//   const { userInfo, token } = useSelector((state) => state.auth);
//   const navigate = useNavigate();

//   const [alertConfig, setAlertConfig] = useState({
//     variant: "default",
//     message: "",
//   });

//   // Fetch referred users from API
//   useEffect(() => {
//     if (!userInfo || userInfo.role !== "agent") {
//       navigate("/login"); // Redirect if not agent
//       return;
//     }

//     const fetchReferredUsers = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch(`${backendURL}/api/get/referred/users`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const data = await response.json();
//         console.log(data);

//         if (data.status === "success") {
//           setUsers(data.data);
//           setFilteredUsers(data.data);
//         } else {
//           showAlertMessage(
//             data.message || "Failed to fetch referred users",
//             "destructive"
//           );
//         }
//       } catch (err) {
//         showAlertMessage(
//           "An error occurred while fetching referred users",
//           "destructive"
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchReferredUsers();
//   }, [token, userInfo, navigate]);

//   // Search functionality
//   useEffect(() => {
//     let result = [...users];
//     if (searchTerm) {
//       result = result.filter(
//         (user) =>
//           (user.name &&
//             user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
//           (user.email &&
//             user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
//           (user.phone &&
//             user.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
//           (user.role &&
//             user.role.toLowerCase().includes(searchTerm.toLowerCase())) ||
//           (user.contact_profile?.first_name &&
//             user.contact_profile.first_name
//               .toLowerCase()
//               .includes(searchTerm.toLowerCase())) ||
//           (user.business_profile?.name &&
//             user.business_profile.name
//               .toLowerCase()
//               .includes(searchTerm.toLowerCase()))
//       );
//     }
//     setFilteredUsers(result);
//   }, [searchTerm, users]);

//   // Sorting state and function
//   const [sortConfig, setSortConfig] = useState({
//     key: null,
//     direction: "ascending",
//   });

//   const handleSort = (key) => {
//     let direction = "ascending";
//     if (sortConfig.key === key && sortConfig.direction === "ascending") {
//       direction = "descending";
//     }
//     setSortConfig({ key, direction });
//     const sortedUsers = [...filteredUsers].sort((a, b) => {
//       const aValue = a[key] || "";
//       const bValue = b[key] || "";
//       if (aValue < bValue) return direction === "ascending" ? -1 : 1;
//       if (aValue > bValue) return direction === "ascending" ? 1 : -1;
//       return 0;
//     });
//     setFilteredUsers(sortedUsers);
//   };

//   // Alert function
//   const showAlertMessage = (message, variant = "default") => {
//     setAlertConfig({ message, variant });
//     setShowAlert(true);
//   };

//   return (
//     <div className="min-h-screen p-6 bg-gradient-to-br from-blue-100 to-gray-100 text-gray-800">
//       {/* Alert Component */}
//       {showAlert && (
//         <Alert
//           variant={alertConfig.variant}
//           show={showAlert}
//           onClose={() => setShowAlert(false)}
//           autoClose={true}
//           autoCloseTime={5000}>
//           <AlertDescription>{alertConfig.message}</AlertDescription>
//         </Alert>
//       )}

//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="mb-8">
//         <h1 className="text-4xl font-extrabold text-center mb-4">
//           Referred Users
//         </h1>
//         <p className="text-center text-lg">
//           View and manage users referred by you.
//         </p>
//       </motion.div>

//       {/* Stats Summary */}
//       <motion.div
//         className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.2, duration: 0.5 }}>
//         <div className="bg-white/80 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-blue-500">
//           <h3 className="text-lg font-semibold">Total Referred Users</h3>
//           <p className="text-3xl font-bold text-blue-600">{users.length}</p>
//         </div>
//       </motion.div>

//       {/* Search */}
//       <motion.div
//         className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.3, duration: 0.5 }}>
//         <div className="flex items-center w-full sm:w-auto">
//           <FaSearch className="text-gray-500 mr-2" />
//           <input
//             type="text"
//             placeholder="Search by name, email, phone, or business..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="border rounded p-2 w-full bg-white border-gray-300"
//           />
//         </div>
//       </motion.div>

//       {/* Users Table */}
//       <motion.div
//         className="bg-white/80 rounded-lg shadow-lg p-6"
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.4, duration: 0.5 }}>
//         <h2 className="text-2xl font-bold mb-4">Referred Users List</h2>
//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
//           </div>
//         ) : (
//           <>
//             <div className="overflow-x-auto">
//               <table className="min-w-full bg-white/90">
//                 <thead>
//                   <tr className="bg-gray-200/50">
//                     {[
//                       "ID",
//                       "Name",
//                       "Email",
//                       "Phone",
//                       "Role",
//                       "Contact First Name",
//                       "Business Name",
//                       "Actions",
//                     ].map((header) => (
//                       <th
//                         key={header}
//                         className="py-3 px-4 text-left text-gray-700 cursor-pointer hover:bg-gray-300/50"
//                         onClick={() =>
//                           handleSort(header.toLowerCase().replace(" ", "_"))
//                         }>
//                         {header}
//                         {sortConfig.key ===
//                           header.toLowerCase().replace(" ", "_") && (
//                           <span>
//                             {sortConfig.direction === "ascending" ? " ↑" : " ↓"}
//                           </span>
//                         )}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredUsers.map((user) => (
//                     <tr
//                       key={user.id}
//                       className="hover:bg-gray-100/50 transition-colors duration-200 even:bg-gray-50/50">
//                       <td className="py-2 px-4 border-b">{user.id}</td>
//                       <td className="py-2 px-4 border-b">
//                         {user.name || "N/A"}
//                       </td>
//                       <td className="py-2 px-4 border-b">
//                         {user.email || "N/A"}
//                       </td>
//                       <td className="py-2 px-4 border-b">
//                         {user.phone || "N/A"}
//                       </td>
//                       <td className="py-2 px-4 border-b first-letter:uppercase">
//                         {user.role || "N/A"}
//                       </td>
//                       <td className="py-2 px-4 border-b">
//                         {user.contact_profile?.first_name || "N/A"}
//                       </td>
//                       <td className="py-2 px-4 border-b">
//                         {user.business_profile?.name || "N/A"}
//                       </td>
//                       <td className="py-2 px-4 border-b">
//                         <button
//                           onClick={() => navigate(`/agent/user/${user.id}`)}
//                           className="text-blue-500 hover:text-blue-700">
//                           <FaEye />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </>
//         )}
//       </motion.div>

//       {/* Back to Dashboard */}
//       <div className="text-center mt-6">
//         <p className="text-gray-600">
//           Back to{" "}
//           <a href="/agent/dashboard" className="text-blue-500 hover:underline">
//             Dashboard
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default AgentRegisters;
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import {
  FaSearch,
  FaEye,
  FaChevronLeft,
  FaChevronRight,
  FaFilter,
} from "react-icons/fa";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import backendURL from "../../config";
import { useNavigate } from "react-router-dom";
import { Link } from "lucide-react";

const AgentRegisters = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { userInfo, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });

  // Fetch referred users from API
  useEffect(() => {
    if (!userInfo || userInfo.role !== "agent") {
      navigate("/login"); // Redirect if not agent
      return;
    }

    const fetchReferredUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${backendURL}/api/get/referred/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        console.log(data, "data");

        if (data.status === "success") {
          setUsers(data.data);
          setFilteredUsers(data.data);
        } else {
          showAlertMessage(
            data.message || "Failed to fetch referred users",
            "destructive"
          );
        }
      } catch (err) {
        showAlertMessage(
          "An error occurred while fetching referred users",
          "destructive"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReferredUsers();
  }, [token, userInfo, navigate]);

  // Search functionality
  useEffect(() => {
    let result = [...users];
    if (searchTerm) {
      result = result.filter(
        (user) =>
          (user.name &&
            user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.email &&
            user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.phone &&
            user.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.role &&
            user.role.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (user.slug &&
            user.slug.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    setFilteredUsers(result);
  }, [searchTerm, users]);

  // Sorting state and function
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    const sortedUsers = [...filteredUsers].sort((a, b) => {
      let aValue, bValue;
      if (key === "business_count") {
        aValue = (a.business || []).length;
        bValue = (b.business || []).length;
      } else {
        aValue = a[key] || "";
        bValue = b[key] || "";
      }
      if (aValue < bValue) return direction === "ascending" ? -1 : 1;
      if (aValue > bValue) return direction === "ascending" ? 1 : -1;
      return 0;
    });
    setFilteredUsers(sortedUsers);
  };

  // Alert function
  const showAlertMessage = (message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
  };

  return (
    <div className="min-h-screen sm:p-6 bg-gradient-to-br from-blue-100 to-gray-100 text-gray-800  mid:mt-16">
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

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8">
        <h1 className="text-4xl font-extrabold text-center mb-4">
          Referred Users
        </h1>
        <p className="text-center text-lg">
          View and manage users referred by you.
        </p>
      </motion.div>

      {/* Stats Summary */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}>
        <div className="bg-white/80 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-blue-500">
          <h3 className="text-lg font-semibold">Total Referred Users</h3>
          <p className="text-3xl font-bold text-blue-600">{users.length}</p>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div
        className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}>
        <div className="flex items-center w-full sm:w-auto">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search by name, email, phone, or slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded p-2 w-full bg-white border-gray-300"
          />
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div
        className="bg-white/80 rounded-lg shadow-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}>
        <h2 className="text-2xl font-bold mb-4">Referred Users List</h2>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white/90">
                <thead>
                  <tr className="bg-gray-200/50">
                    {[
                      "ID",
                      "Name",
                      "Email",
                      "Phone",
                      "Role",
                      "Verification Status",
                      "Businesses",
                      "OTP",
                      "Actions",
                    ].map((header) => (
                      <th
                        key={header}
                        className="py-3 px-4 text-left text-gray-700 cursor-pointer hover:bg-gray-300/50"
                        onClick={() =>
                          handleSort(header.toLowerCase().replace(" ", "_"))
                        }>
                        {header}
                        {sortConfig.key ===
                          header.toLowerCase().replace(" ", "_") && (
                          <span>
                            {sortConfig.direction === "ascending" ? " ↑" : " ↓"}
                          </span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-100/50 transition-colors duration-200 even:bg-gray-50/50">
                      <td className="py-2 px-4 border-b">{user.id}</td>
                      <td className="py-2 px-4 border-b">
                        {user.name || "N/A"}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {user.email || "N/A"}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {user.phone || "N/A"}
                      </td>
                      <td className="py-2 px-4 border-b first-letter:uppercase">
                        {user.role || "N/A"}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {user.is_verified ? "Verified" : "Not Verified"}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {(user.business || []).length}
                      </td>
                      <td className="py-2 px-4 border-b">{user.otp}</td>
                      <td className="py-2 px-4 border-b">
                        <button
                          onClick={() => navigate(`/profile/${user.slug}`)}
                          className="text-blue-500 hover:text-blue-700">
                          <Link />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </motion.div>

      {/* Back to Dashboard */}
      <div className="text-center mt-6">
        <p className="text-gray-600">
          Back to{" "}
          <a href="/agent/dashboard" className="text-blue-500 hover:underline">
            Dashboard
          </a>
        </p>
      </div>
    </div>
  );
};

export default AgentRegisters;

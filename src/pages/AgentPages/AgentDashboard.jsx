// import React, { useState, useEffect } from "react";
// import { Bar, Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { FaUsers, FaMoneyBillWave, FaChartLine } from "react-icons/fa";
// import { CreditCard } from "lucide-react";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const AgentDashboard = () => {
//   const [stats, setStats] = useState({
//     totalEarnings: 0,
//     earningsThisMonth: 0,
//     totalRegisteredUsers: 0,
//     userBreakdown: { active: 0, inactive: 0 },
//     monthlyProgress: { newUsers: 0, earnings: 0, ads: 0 },
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       setStats({
//         totalEarnings: 2500,
//         earningsThisMonth: 900,
//         totalRegisteredUsers: 120,
//         userBreakdown: { active: 90, inactive: 30 },
//         monthlyProgress: { newUsers: 20, earnings: 900, ads: 5 },
//       });
//     };
//     fetchData();
//   }, []);

//   // Updated chart data to highlight current month (March - index 2)
//   const earningsOverTimeData = {
//     labels: [
//       "Jan",
//       "Feb",
//       "Mar",
//       "Apr",
//       "May",
//       "Jun",
//       "Jul",
//       "Aug",
//       "Sep",
//       "Oct",
//       "Nov",
//       "Dec",
//     ],
//     datasets: [
//       {
//         label: "Earnings ($)",
//         data: [200, 250, 300, 400, 350, 300, 320, 280, 310, 400, 450, 500],
//         backgroundColor: "rgba(230, 57, 70, 0.2)",
//         borderColor: "#E63946",
//         borderWidth: 2,
//         pointBackgroundColor: (context) =>
//           context.dataIndex === 2 ? "#E63946" : "rgba(230, 57, 70, 0.2)",
//         pointBorderColor: (context) =>
//           context.dataIndex === 2 ? "#E63946" : "#E63946",
//         pointRadius: (context) => (context.dataIndex === 2 ? 6 : 3),
//       },
//     ],
//   };

//   const userRegistrationGrowthData = {
//     labels: [
//       "Jan",
//       "Feb",
//       "Mar",
//       "Apr",
//       "May",
//       "Jun",
//       "Jul",
//       "Aug",
//       "Sep",
//       "Oct",
//       "Nov",
//       "Dec",
//     ],
//     datasets: [
//       {
//         label: "Registered Users",
//         data: [10, 15, 20, 25, 30, 20, 35, 40, 45, 50, 55, 60],
//         backgroundColor: "rgba(69, 123, 157, 0.2)",
//         borderColor: "#457B9D",
//         borderWidth: 2,
//         pointBackgroundColor: (context) =>
//           context.dataIndex === 2 ? "#457B9D" : "rgba(69, 123, 157, 0.2)",
//         pointBorderColor: (context) =>
//           context.dataIndex === 2 ? "#457B9D" : "#457B9D",
//         pointRadius: (context) => (context.dataIndex === 2 ? 6 : 3),
//       },
//     ],
//   };

//   const monthlyProgressData = {
//     labels: ["New Users", "Earnings ($)", "Ads"],
//     datasets: [
//       {
//         label: "March 2025",
//         data: [
//           stats.monthlyProgress.newUsers,
//           stats.monthlyProgress.earnings,
//           stats.monthlyProgress.ads,
//         ],
//         backgroundColor: "#E63946",
//       },
//     ],
//   };

//   const formattedEarnings = new Intl.NumberFormat("en-US", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   }).format(stats.totalEarnings);

//   return (
//     <div className="p-6 bg-[#F1FAEE] min-h-screen mid:mt-16">
//       {/* Stats Cards - Improved alignment and consistent height */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//         <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-[#E63946] flex flex-col h-48">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold text-[#1D3557]">
//               Total Earnings
//             </h3>
//             <CreditCard className="text-[#E63946] text-xl" />
//           </div>
//           <p className="text-3xl font-bold text-[#E63946] mt-2">
//             #{formattedEarnings}
//           </p>
//           <p className="text-sm text-[#6B7280] mt-2">
//             This Month: #{stats.earningsThisMonth.toFixed(2)}
//           </p>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-[#1D3557] flex flex-col h-48">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold text-[#1D3557]">
//               Registered Users
//             </h3>
//             <FaUsers className="text-[#1D3557] text-xl" />
//           </div>
//           <p className="text-3xl font-bold text-[#1D3557] mt-2">
//             {stats.totalRegisteredUsers}
//           </p>
//           <p className="text-sm text-[#6B7280] mt-2">
//             Active: {stats.userBreakdown.active} | Inactive:{" "}
//             {stats.userBreakdown.inactive}
//           </p>
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-[#E63946] flex flex-col h-48">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold text-[#1D3557]">
//               Monthly Progress
//             </h3>
//             <FaChartLine className="text-[#E63946] text-xl" />
//           </div>
//           <p className="text-sm text-[#6B7280] mt-2">
//             New Users: {stats.monthlyProgress.newUsers} <br />
//             Earnings: #{stats.monthlyProgress.earnings} <br />
//             Ads: {stats.monthlyProgress.ads}
//           </p>
//         </div>
//       </div>

//       {/* Charts Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h3 className="text-lg font-semibold text-[#1D3557] mb-4">
//             Earnings Over Time
//           </h3>
//           <Line
//             data={earningsOverTimeData}
//             options={{
//               responsive: true,
//               plugins: {
//                 legend: { position: "top" },
//                 title: {
//                   display: true,
//                   text: "Earnings Over Time - 2025",
//                 },
//               },
//             }}
//           />
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h3 className="text-lg font-semibold text-[#1D3557] mb-4">
//             User Registration Growth
//           </h3>
//           <Line
//             data={userRegistrationGrowthData}
//             options={{
//               responsive: true,
//               plugins: {
//                 legend: { position: "top" },
//                 title: {
//                   display: true,
//                   text: "User Registration Growth - 2025",
//                 },
//               },
//             }}
//           />
//         </div>

//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h3 className="text-lg font-semibold text-[#1D3557] mb-4">
//             Monthly Progress - March 2025
//           </h3>
//           <Bar
//             data={monthlyProgressData}
//             options={{
//               responsive: true,
//               plugins: {
//                 legend: { position: "top" },
//                 title: { display: true, text: "Monthly Progress - March 2025" },
//               },
//               scales: {
//                 x: { title: { display: true, text: "Metrics" } },
//                 y: { title: { display: true, text: "Value" } },
//               },
//             }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AgentDashboard;

// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { useSelector } from "react-redux";
// import {
//   FaSearch,
//   FaEye,
//   FaMoneyBillWave,
//   FaUsers,
//   FaChartLine,
// } from "react-icons/fa";
// import { Alert, AlertDescription } from "../../components/tools/Alert";
// import backendURL from "../../config";
// import { useNavigate } from "react-router-dom";

// const AgentDashboard = () => {
//   const [subscriptionData, setSubscriptionData] = useState(null);
//   const [commissions, setCommissions] = useState(null);
//   const [performance, setPerformance] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [showAlert, setShowAlert] = useState(false);
//   const { userInfo, token } = useSelector((state) => state.auth);
//   const navigate = useNavigate();

//   const [alertConfig, setAlertConfig] = useState({
//     variant: "default",
//     message: "",
//   });

//   // Fetch all data on mount
//   useEffect(() => {
//     if (!userInfo || userInfo.role !== "agent") {
//       navigate("/login");
//       return;
//     }

//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         // Fetch Subscription Data
//         const subResponse = await fetch(
//           `${backendURL}/api/agent/subscription-data`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         const subData = await subResponse.json();
//         if (subData.status === "success") setSubscriptionData(subData.data);

//         // Fetch Commissions
//         const commResponse = await fetch(
//           `${backendURL}/api/agent/commissions`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         const commData = await commResponse.json();
//         if (commData.status === "success") setCommissions(commData.data);

//         // Fetch Performance
//         const perfResponse = await fetch(
//           `${backendURL}/api/agent/performance`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         const perfData = await perfResponse.json();
//         if (perfData.status === "success") setPerformance(perfData.data);
//       } catch (err) {
//         showAlertMessage("Error fetching dashboard data", "destructive");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [token, userInfo, navigate]);

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

//       {/* Header */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="mb-8">
//         <h1 className="text-4xl font-extrabold text-center mb-2">
//           Agent Dashboard
//         </h1>
//         <p className="text-center text-lg">
//           Welcome, {userInfo?.name || "Agent"}! Manage your referrals and
//           earnings.
//         </p>
//       </motion.div>

//       {/* Overview Cards */}
//       {loading ? (
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
//         </div>
//       ) : (
//         <>
//           <motion.div
//             className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.2, duration: 0.5 }}>
//             <div className="bg-white/80 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-green-500">
//               <div className="flex items-center">
//                 <FaMoneyBillWave className="text-green-500 mr-2" />
//                 <h3 className="text-lg font-semibold">Total Earnings</h3>
//               </div>
//               <p className="text-3xl font-bold text-green-600">
//                 ${performance?.total_earnings || 0}
//               </p>
//             </div>
//             <div className="bg-white/80 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-blue-500">
//               <div className="flex items-center">
//                 <FaUsers className="text-blue-500 mr-2" />
//                 <h3 className="text-lg font-semibold">Referred Users</h3>
//               </div>
//               <p className="text-3xl font-bold text-blue-600">
//                 {performance?.total_referred_users || 0}
//               </p>
//             </div>
//             <div className="bg-white/80 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-purple-500">
//               <div className="flex items-center">
//                 <FaChartLine className="text-purple-500 mr-2" />
//                 <h3 className="text-lg font-semibold">Active Subscriptions</h3>
//               </div>
//               <p className="text-3xl font-bold text-purple-600">
//                 {performance?.active_subscriptions || 0}
//               </p>
//             </div>
//             <div className="bg-white/80 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-orange-500">
//               <div className="flex items-center">
//                 <FaChartLine className="text-orange-500 mr-2" />
//                 <h3 className="text-lg font-semibold">Conversion Rate</h3>
//               </div>
//               <p className="text-3xl font-bold text-orange-600">
//                 {performance?.conversion_rate || "0%"}
//               </p>
//             </div>
//           </motion.div>

//           {/* Subscription Data Table */}
//           <motion.div
//             className="bg-white/80 rounded-lg shadow-lg p-6 mb-8"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.4, duration: 0.5 }}>
//             <h2 className="text-2xl font-bold mb-4">Subscription Data</h2>
//             <div className="overflow-x-auto">
//               <table className="min-w-full bg-white/90">
//                 <thead>
//                   <tr className="bg-gray-200/50">
//                     <th className="py-3 px-4 text-left text-gray-700">
//                       User Name
//                     </th>
//                     <th className="py-3 px-4 text-left text-gray-700">Email</th>
//                     <th className="py-3 px-4 text-left text-gray-700">Phone</th>
//                     <th className="py-3 px-4 text-left text-gray-700">
//                       Businesses
//                     </th>
//                     <th className="py-3 px-4 text-left text-gray-700">
//                       Plan Type
//                     </th>
//                     <th className="py-3 px-4 text-left text-gray-700">
//                       Amount
//                     </th>
//                     <th className="py-3 px-4 text-left text-gray-700">
//                       Start Date
//                     </th>
//                     <th className="py-3 px-4 text-left text-gray-700">
//                       Expiry Date
//                     </th>
//                     <th className="py-3 px-4 text-left text-gray-700">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {subscriptionData?.referred_users?.map((user) =>
//                     user.subscriptions.map((sub, index) => (
//                       <tr
//                         key={`${user.user_id}-${sub.subscription_id}`}
//                         className="hover:bg-gray-100/50 transition-colors duration-200 even:bg-gray-50/50">
//                         {index === 0 ? (
//                           <>
//                             <td
//                               className="py-2 px-4 border-b"
//                               rowSpan={user.subscriptions.length}>
//                               {user.name || "N/A"}
//                             </td>
//                             <td
//                               className="py-2 px-4 border-b"
//                               rowSpan={user.subscriptions.length}>
//                               {user.email || "N/A"}
//                             </td>
//                             <td
//                               className="py-2 px-4 border-b"
//                               rowSpan={user.subscriptions.length}>
//                               {user.phone || "N/A"}
//                             </td>
//                             <td
//                               className="py-2 px-4 border-b"
//                               rowSpan={user.subscriptions.length}>
//                               {user.businesses.length}
//                             </td>
//                           </>
//                         ) : null}
//                         <td className="py-2 px-4 border-b">
//                           {sub.plan_type || "N/A"}
//                         </td>
//                         <td className="py-2 px-4 border-b">
//                           ${sub.amount || 0}
//                         </td>
//                         <td className="py-2 px-4 border-b">
//                           {sub.start_date
//                             ? new Date(sub.start_date).toLocaleDateString()
//                             : "N/A"}
//                         </td>
//                         <td className="py-2 px-4 border-b">
//                           {sub.expiry_date
//                             ? new Date(sub.expiry_date).toLocaleDateString()
//                             : "N/A"}
//                         </td>
//                         <td className="py-2 px-4 border-b">
//                           <button
//                             onClick={() => navigate(`/profile/${user.user_id}`)}
//                             className="text-blue-500 hover:text-blue-700">
//                             <FaEye />
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </motion.div>

//           {/* Commissions Table */}
//           <motion.div
//             className="bg-white/80 rounded-lg shadow-lg p-6"
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.6, duration: 0.5 }}>
//             <h2 className="text-2xl font-bold mb-4">Commissions</h2>
//             <div className="overflow-x-auto">
//               <table className="min-w-full bg-white/90">
//                 <thead>
//                   <tr className="bg-gray-200/50">
//                     <th className="py-3 px-4 text-left text-gray-700">
//                       Commission ID
//                     </th>
//                     <th className="py-3 px-4 text-left text-gray-700">Type</th>
//                     <th className="py-3 px-4 text-left text-gray-700">
//                       Amount
//                     </th>
//                     <th className="py-3 px-4 text-left text-gray-700">
//                       Status
//                     </th>
//                     <th className="py-3 px-4 text-left text-gray-700">
//                       Platform
//                     </th>
//                     <th className="py-3 px-4 text-left text-gray-700">
//                       Referred User
//                     </th>
//                     <th className="py-3 px-4 text-left text-gray-700">Date</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {commissions?.commissions?.map((commission) => (
//                     <tr
//                       key={commission.commission_id}
//                       className="hover:bg-gray-100/50 transition-colors duration-200 even:bg-gray-50/50">
//                       <td className="py-2 px-4 border-b">
//                         {commission.commission_id}
//                       </td>
//                       <td className="py-2 px-4 border-b first-letter:uppercase">
//                         {commission.type.replace("_", " ")}
//                       </td>
//                       <td className="py-2 px-4 border-b">
//                         ${commission.amount}
//                       </td>
//                       <td className="py-2 px-4 border-b first-letter:uppercase">
//                         {commission.status}
//                       </td>
//                       <td className="py-2 px-4 border-b first-letter:uppercase">
//                         {commission.platform || "N/A"}
//                       </td>
//                       <td className="py-2 px-4 border-b">
//                         {commission.referred_user.name || "N/A"}
//                       </td>
//                       <td className="py-2 px-4 border-b">
//                         {new Date(commission.created_at).toLocaleDateString()}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </motion.div>

//           {/* Navigation Links */}
//           <div className="text-center mt-6">
//             <p className="text-gray-600">
//               <a
//                 href="/agent/create-user"
//                 className="text-blue-500 hover:underline mr-4">
//                 Create New User
//               </a>
//               <a
//                 href="/agent/referred-users"
//                 className="text-blue-500 hover:underline">
//                 View Referred Users
//               </a>
//             </p>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default AgentDashboard;

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import {
  FaSearch,
  FaEye,
  FaMoneyBillWave,
  FaUsers,
  FaChartLine,
  FaArrowRight,
  FaCopy,
  FaUserTag,
} from "react-icons/fa";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import backendURL from "../../config";
import { useNavigate } from "react-router-dom";

const AgentDashboard = () => {
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [commissions, setCommissions] = useState(null);
  const [performance, setPerformance] = useState(null);
  const [agentDetails, setAgentDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { userInfo, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });

  // Constants for table limits
  const TABLE_LIMIT = 5;

  // Fetch all data on mount
  useEffect(() => {
    if (!userInfo || userInfo.role !== "agent") {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Subscription Data
        const subResponse = await fetch(
          `${backendURL}/api/agent/subscription-data`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const subData = await subResponse.json();
        if (subData.status === "success") {
          // Sort subscriptions by latest first
          const sortedData = {
            ...subData.data,
            referred_users: subData.data.referred_users
              .map((user) => ({
                ...user,
                subscriptions: user.subscriptions.sort(
                  (a, b) => new Date(b.start_date) - new Date(a.start_date)
                ),
              }))
              .sort(
                (a, b) =>
                  new Date(b.subscriptions[0]?.start_date) -
                  new Date(a.subscriptions[0]?.start_date)
              ),
          };
          setSubscriptionData(sortedData);
          setAgentDetails(sortedData.agent);
        }

        // Fetch Commissions
        const commResponse = await fetch(
          `${backendURL}/api/agent/commissions`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const commData = await commResponse.json();
        if (commData.status === "success") {
          // Sort commissions by latest first
          const sortedCommissions = {
            ...commData.data,
            commissions: commData.data.commissions.sort(
              (a, b) => new Date(b.created_at) - new Date(a.created_at)
            ),
          };
          setCommissions(sortedCommissions);
        }

        // Fetch Performance
        const perfResponse = await fetch(
          `${backendURL}/api/agent/performance`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const perfData = await perfResponse.json();
        if (perfData.status === "success") setPerformance(perfData.data);
      } catch (err) {
        showAlertMessage("Error fetching dashboard data", "destructive");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, userInfo, navigate]);

  // Alert function
  const showAlertMessage = (message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
  };

  // Copy agent code to clipboard
  const copyAgentCode = () => {
    if (agentDetails?.agent_code) {
      navigator.clipboard.writeText(agentDetails.agent_code);
      showAlertMessage("Agent code copied to clipboard!", "success");
    }
  };

  // copy Agent Link
  const copyAgentLink = () => {
    if (agentDetails?.agent_link) {
      navigator.clipboard.writeText(agentDetails.agent_link);
      showAlertMessage("Agent Link copied to clipboard!", "success");
    }
  };

  // Get limited subscription data
  const getLimitedSubscriptions = () => {
    if (!subscriptionData) return [];
    return subscriptionData.referred_users.slice(0, TABLE_LIMIT);
  };

  // Get limited commissions
  const getLimitedCommissions = () => {
    if (!commissions) return [];
    return commissions.commissions.slice(0, TABLE_LIMIT);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-gray-50 text-gray-800">
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

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2">Agent Dashboard</h1>
        <p className="text-center text-gray-600">
          Welcome back, {userInfo?.name || "Agent"}! Here's your performance
          overview.
        </p>

        {/* Agent Code Section */}
        <div className="lg:flex gap-5">
          <div>
            {agentDetails?.agent_code && (
              <div className="mt-4 flex justify-start">
                <div className="bg-white/90 p-3 rounded-lg shadow-sm border border-gray-200 flex items-center">
                  <div className="mr-3 p-2 bg-indigo-100 text-indigo-600 rounded-full">
                    <FaUserTag className="text-md" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500">
                      Your Agent Code
                    </p>
                    <div className="flex items-center">
                      <span className="font-mono text-sm font-bold text-gray-800 mr-2">
                        {agentDetails.agent_code}
                      </span>
                      <button
                        onClick={copyAgentCode}
                        className="text-indigo-600 hover:text-indigo-800 p-1 rounded-full hover:bg-indigo-50"
                        title="Copy to clipboard">
                        <FaCopy className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div>
            {agentDetails?.agent_link && (
              <div className="mt-4 flex justify-start">
                <div className="bg-white/90 p-3 rounded-lg shadow-sm border border-gray-200 flex items-center">
                  <div className="mr-3 p-2 bg-indigo-100 text-indigo-600 rounded-full">
                    <FaUserTag className="text-md" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500">
                      Your Referral Link
                    </p>
                    <div className="flex items-center">
                      <span className="font-mono text-xs font-bold text-gray-800 mr-2">
                        {agentDetails.agent_link}
                      </span>
                      <button
                        onClick={copyAgentLink}
                        className="text-indigo-600 hover:text-indigo-800 p-1 rounded-full hover:bg-indigo-50"
                        title="Copy to clipboard">
                        <FaCopy className="text-sm" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Overview Cards */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Total Earnings Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Earnings
                  </p>
                  <h3 className="text-2xl font-bold mt-1 text-gray-800">
                    NGN {agentDetails?.total_earnings?.toLocaleString() || "0"}
                  </h3>
                </div>
                <div className="p-3 rounded-lg bg-green-50 text-green-600">
                  <FaMoneyBillWave className="text-xl" />
                </div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Direct: NGN {agentDetails?.direct_earnings || "0"}</span>
                <span>
                  Indirect: NGN {agentDetails?.indirect_earnings || "0"}
                </span>
              </div>
            </motion.div>

            {/* Referred Users Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Referred Users
                  </p>
                  <h3 className="text-2xl font-bold mt-1 text-gray-800">
                    {agentDetails?.total_referred_users?.toLocaleString() ||
                      "0"}
                  </h3>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                  <FaUsers className="text-xl" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Total users referred</p>
            </motion.div>

            {/* Active Subscriptions Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Active Subs
                  </p>
                  <h3 className="text-2xl font-bold mt-1 text-gray-800">
                    {performance?.active_subscriptions?.toLocaleString() || "0"}
                  </h3>
                </div>
                <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
                  <FaChartLine className="text-xl" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Currently active</p>
            </motion.div>

            {/* Conversion Rate Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Conversion Rate
                  </p>
                  <h3 className="text-2xl font-bold mt-1 text-gray-800">
                    {performance?.conversion_rate || "0%"}
                  </h3>
                </div>
                <div className="p-3 rounded-lg bg-orange-50 text-orange-600">
                  <FaChartLine className="text-xl" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Signup to subscription
              </p>
            </motion.div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Subscription Data Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">
                  Recent Subscriptions
                </h2>
                <button
                  onClick={() => navigate("/agent/subscriptions")}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                  See All <FaArrowRight className="ml-1" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Plan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Expiry
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getLimitedSubscriptions().length > 0 ? (
                      getLimitedSubscriptions().map((user) =>
                        user.subscriptions.map((sub, index) => (
                          <tr
                            key={`${user.user_id}-${sub.subscription_id}`}
                            className="hover:bg-gray-50">
                            {index === 0 && (
                              <>
                                <td
                                  className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                                  rowSpan={user.subscriptions.length}>
                                  <div className="flex items-center">
                                    <div className="ml-2">
                                      <div className="font-medium text-gray-900">
                                        {user.name || "N/A"}
                                      </div>
                                      <div className="text-xs text-gray-500">
                                        {user.email || "N/A"}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </>
                            )}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                              {sub.plan_type || "N/A"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                              ${sub.amount || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(sub.expiry_date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() =>
                                  navigate(`/profile/${user.user_id}`)
                                }
                                className="text-blue-600 hover:text-blue-900 flex items-center">
                                <FaEye className="mr-1" /> View
                              </button>
                            </td>
                          </tr>
                        ))
                      )
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-6 py-4 text-center text-sm text-gray-500">
                          No subscription data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Commissions Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">
                  Recent Commissions
                </h2>
                <button
                  onClick={() => navigate("/agent/commissions")}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                  See All <FaArrowRight className="ml-1" />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getLimitedCommissions().length > 0 ? (
                      getLimitedCommissions().map((commission) => (
                        <tr
                          key={commission.commission_id}
                          className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                            {commission.type.replace("_", " ")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                            ${commission.amount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                commission.status === "paid"
                                  ? "bg-green-100 text-green-800"
                                  : commission.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}>
                              {commission.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(commission.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {commission.referred_user?.name || "N/A"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {commission.referred_user?.email || ""}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-6 py-4 text-center text-sm text-gray-500">
                          No commission data available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => navigate("/Agent/CreateUsers")}
                className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors">
                <div className="mr-3 p-2 bg-blue-100 text-blue-600 rounded-full">
                  <FaUsers className="text-lg" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-gray-800">Create New User</h3>
                  <p className="text-xs text-gray-500">Refer a new customer</p>
                </div>
              </button>
              <button
                onClick={() => navigate("/Agent/My_Reg_Users")}
                className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-200 transition-colors">
                <div className="mr-3 p-2 bg-purple-100 text-purple-600 rounded-full">
                  <FaUsers className="text-lg" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-gray-800">View Referrals</h3>
                  <p className="text-xs text-gray-500">
                    See all your referrals
                  </p>
                </div>
              </button>
              <button
                onClick={() => navigate("/Agent/commissions")}
                className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 transition-colors">
                <div className="mr-3 p-2 bg-green-100 text-green-600 rounded-full">
                  <FaMoneyBillWave className="text-lg" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-gray-800">Commissions</h3>
                  <p className="text-xs text-gray-500">View all earnings</p>
                </div>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default AgentDashboard;

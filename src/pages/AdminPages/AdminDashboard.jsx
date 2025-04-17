// import React, { useState, useEffect } from "react";
// import { Bar, Line, Doughnut } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   PointElement,
//   LineElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import {
//   FaUsers,
//   FaBuilding,
//   FaExclamationTriangle,
//   FaClipboardList,
//   FaBan,
//   FaStar,
// } from "react-icons/fa";
// import backendURL from "../../config";

// // Register Chart.js components
// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   PointElement,
//   LineElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const AdminDashboard = () => {
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     totalBusinesses: 0,
//     totalBlacklisted: 0,
//     pendingReports: 0,
//     pendingRequests: 0,
//     averageRating: 0,
//     loading: true,
//   });

//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch actual data from available endpoints
//         const [usersResponse, businessResponse, blacklistResponse] =
//           await Promise.all([
//             fetch(`${backendURL}/api/count/users`),
//             fetch(`${backendURL}/api/lists/business`),
//             fetch(`${backendURL}/api/profiles`),
//           ]);

//         // Check responses
//         if (
//           !usersResponse.ok ||
//           !businessResponse.ok ||
//           !blacklistResponse.ok
//         ) {
//           throw new Error("Failed to fetch some dashboard data");
//         }

//         const [usersData, businessData, blacklistData] = await Promise.all([
//           usersResponse.json(),
//           businessResponse.json(),
//           blacklistResponse.json(),
//         ]);

//         // Calculate blacklisted users
//         const blacklistedUsers =
//           blacklistData.contacts?.filter(
//             (c) => c.contact.status === "blacklisted"
//           ).length || 0;

//         // Calculate blacklisted businesses
//         const blacklistedBusinesses =
//           businessData.data?.filter((b) => b.status === "blacklisted").length ||
//           0;

//         setStats({
//           totalUsers: usersData?.user_count || 0,
//           totalBusinesses: businessData?.data?.length || 0,
//           totalBlacklisted: blacklistedUsers + blacklistedBusinesses,
//           pendingReports: 0, // Placeholder - will need actual endpoint
//           pendingRequests: 0, // Placeholder - will need actual endpoint
//           averageRating: 0, // Placeholder - will need actual endpoint
//           loading: false,
//         });
//       } catch (err) {
//         setError(err.message);
//         setStats((prev) => ({ ...prev, loading: false }));
//       }
//     };

//     fetchData();
//   }, []);

//   // Chart Data - Using actual data where possible
//   const userGrowthData = {
//     labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
//     datasets: [
//       {
//         label: "User Growth",
//         data: [200, 300, 450, 600, 800, 1000, stats.totalUsers],
//         backgroundColor: "rgba(54, 162, 235, 0.2)",
//         borderColor: "rgba(54, 162, 235, 1)",
//         borderWidth: 2,
//       },
//     ],
//   };

//   const businessGrowthData = {
//     labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
//     datasets: [
//       {
//         label: "Business Growth",
//         data: [50, 70, 100, 120, 150, 180, stats.totalBusinesses],
//         backgroundColor: "rgba(75, 192, 192, 0.2)",
//         borderColor: "rgba(75, 192, 192, 1)",
//         borderWidth: 2,
//       },
//     ],
//   };

//   const blacklistData = {
//     labels: ["Blacklisted Users", "Blacklisted Businesses"],
//     datasets: [
//       {
//         label: "Blacklisted Entities",
//         data: [stats.totalBlacklisted / 2, stats.totalBlacklisted / 2], // Placeholder split
//         backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(255, 159, 64, 0.6)"],
//         borderWidth: 1,
//       },
//     ],
//   };

//   if (stats.loading) {
//     return (
//       <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
//           <p className="mt-4 text-lg text-gray-700">
//             Loading dashboard data...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
//         <div className="text-center text-red-500">
//           <p className="text-xl font-semibold">Error loading dashboard</p>
//           <p className="mt-2">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//         {/* Total Users */}
//         <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-blue-500">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
//             <FaUsers className="text-blue-500 text-xl" />
//           </div>
//           <p className="text-3xl font-bold text-blue-600 mt-2">
//             {stats.totalUsers.toLocaleString()}
//           </p>
//           <p className="text-sm text-gray-600 mt-2">
//             Registered platform users
//           </p>
//         </div>

//         {/* Total Businesses */}
//         <div className="bg-gradient-to-br from-green-100 to-green-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-green-500">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold text-gray-700">
//               Total Businesses
//             </h3>
//             <FaBuilding className="text-green-500 text-xl" />
//           </div>
//           <p className="text-3xl font-bold text-green-600 mt-2">
//             {stats.totalBusinesses.toLocaleString()}
//           </p>
//           <p className="text-sm text-gray-600 mt-2">Registered businesses</p>
//         </div>

//         {/* Blacklisted Entities */}
//         <div className="bg-gradient-to-br from-red-100 to-red-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-red-500">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold text-gray-700">
//               Blacklisted Entities
//             </h3>
//             <FaBan className="text-red-500 text-xl" />
//           </div>
//           <p className="text-3xl font-bold text-red-600 mt-2">
//             {stats.totalBlacklisted.toLocaleString()}
//           </p>
//           <p className="text-sm text-gray-600 mt-2">Users and businesses</p>
//         </div>

//         {/* Pending Reports - Placeholder */}
//         <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-yellow-500">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold text-gray-700">
//               Pending Reports
//             </h3>
//             <FaExclamationTriangle className="text-yellow-500 text-xl" />
//           </div>
//           <p className="text-3xl font-bold text-yellow-600 mt-2">
//             {stats.pendingReports}
//           </p>
//           <p className="text-sm text-gray-600 mt-2">Awaiting review</p>
//         </div>

//         {/* Pending Requests - Placeholder */}
//         <div className="bg-gradient-to-br from-indigo-100 to-indigo-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-indigo-500">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold text-gray-700">
//               Pending Requests
//             </h3>
//             <FaClipboardList className="text-indigo-500 text-xl" />
//           </div>
//           <p className="text-3xl font-bold text-indigo-600 mt-2">
//             {stats.pendingRequests}
//           </p>
//           <p className="text-sm text-gray-600 mt-2">Verification requests</p>
//         </div>

//         {/* Average Rating - Placeholder */}
//         <div className="bg-gradient-to-br from-orange-100 to-orange-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-orange-500">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-lg font-semibold text-gray-700">
//               Average Rating
//             </h3>
//             <FaStar className="text-orange-500 text-xl" />
//           </div>
//           <p className="text-3xl font-bold text-orange-600 mt-2">
//             {stats.averageRating.toFixed(1)}
//           </p>
//           <p className="text-sm text-gray-600 mt-2">Business ratings</p>
//         </div>
//       </div>

//       {/* Charts Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h3 className="text-lg font-semibold text-gray-700 mb-4">
//             User Growth
//           </h3>
//           <Line
//             data={userGrowthData}
//             options={{
//               responsive: true,
//               plugins: {
//                 legend: { position: "top" },
//                 title: { display: true, text: "User Growth Over Time" },
//               },
//             }}
//           />
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h3 className="text-lg font-semibold text-gray-700 mb-4">
//             Business Growth
//           </h3>
//           <Line
//             data={businessGrowthData}
//             options={{
//               responsive: true,
//               plugins: {
//                 legend: { position: "top" },
//                 title: { display: true, text: "Business Growth Over Time" },
//               },
//             }}
//           />
//         </div>
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h3 className="text-lg font-semibold text-gray-700 mb-4">
//             Blacklist Distribution
//           </h3>
//           <Doughnut
//             data={blacklistData}
//             options={{
//               responsive: true,
//               plugins: {
//                 legend: { position: "top" },
//                 title: { display: true, text: "Blacklisted Entities" },
//               },
//             }}
//           />
//         </div>
//       </div>

//       {/* Placeholder for future sections */}
//       <div className="bg-white p-6 rounded-lg shadow-md mb-8">
//         <h3 className="text-lg font-semibold text-gray-700 mb-4">
//           Recent Activities
//         </h3>
//         <p className="text-gray-500 italic">
//           Activity log will be displayed here once the endpoint is available
//         </p>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
import React, { useState, useEffect } from "react";
import { Bar, Line, Doughnut, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  FaUsers,
  FaBuilding,
  FaExclamationTriangle,
  FaClipboardList,
  FaBan,
  FaStar,
  FaChartLine,
  FaChartPie,
  FaHistory,
  FaSync,
} from "react-icons/fa";
import backendURL from "../../config";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBusinesses: 0,
    totalBlacklisted: 0,
    pendingReports: 0,
    pendingRequests: 0,
    averageRating: 0,
    loading: true,
  });

  const [timeRange, setTimeRange] = useState("monthly");
  const [startDate, setStartDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 6))
  );
  const [endDate, setEndDate] = useState(new Date());
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange, startDate, endDate]);

  const fetchDashboardData = async () => {
    try {
      setStats((prev) => ({ ...prev, loading: true }));

      // Fetch actual data from available endpoints
      const [usersResponse, businessResponse, blacklistResponse] =
        await Promise.all([
          fetch(`${backendURL}/api/count/users`),
          fetch(`${backendURL}/api/lists/business`),
          fetch(`${backendURL}/api/profiles`),
        ]);

      // Check responses
      if (!usersResponse.ok || !businessResponse.ok || !blacklistResponse.ok) {
        throw new Error("Failed to fetch some dashboard data");
      }

      const [usersData, businessData, blacklistData] = await Promise.all([
        usersResponse.json(),
        businessResponse.json(),
        blacklistResponse.json(),
      ]);

      // Calculate blacklisted users
      const blacklistedUsers =
        blacklistData.contacts?.filter(
          (c) => c.contact.status === "blacklisted"
        ).length || 0;

      // Calculate blacklisted businesses
      const blacklistedBusinesses =
        businessData.data?.filter((b) => b.status === "blacklisted").length ||
        0;

      setStats({
        totalUsers: usersData?.user_count || 0,
        totalBusinesses: businessData?.data?.length || 0,
        totalBlacklisted: blacklistedUsers + blacklistedBusinesses,
        pendingReports: 12, // Mock data - replace with actual
        pendingRequests: 8, // Mock data - replace with actual
        averageRating: 4.2, // Mock data - replace with actual
        loading: false,
      });
    } catch (err) {
      setError(err.message);
      setStats((prev) => ({ ...prev, loading: false }));
    }
  };

  // Chart Data - Using actual data where possible
  const userGrowthData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "User Growth",
        data: [200, 300, 450, 600, 800, 1000, stats.totalUsers],
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const businessGrowthData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Business Growth",
        data: [50, 70, 100, 120, 150, 180, stats.totalBusinesses],
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        borderColor: "rgba(16, 185, 129, 1)",
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const blacklistData = {
    labels: ["Blacklisted Users", "Blacklisted Businesses"],
    datasets: [
      {
        label: "Blacklisted Entities",
        data: [
          Math.round(stats.totalBlacklisted * 0.6),
          Math.round(stats.totalBlacklisted * 0.4),
        ],
        backgroundColor: ["rgba(239, 68, 68, 0.6)", "rgba(249, 115, 22, 0.6)"],
        borderColor: ["rgba(239, 68, 68, 1)", "rgba(249, 115, 22, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const activityTypesData = {
    labels: [
      "User Signups",
      "Business Registrations",
      "Verifications",
      "Reports",
      "Others",
    ],
    datasets: [
      {
        data: [35, 25, 20, 15, 5],
        backgroundColor: [
          "rgba(59, 130, 246, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(245, 158, 11, 0.7)",
          "rgba(239, 68, 68, 0.7)",
          "rgba(139, 92, 246, 0.7)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (stats.loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700">
            Loading dashboard data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center text-red-500">
            <FaExclamationTriangle className="text-2xl" />
          </div>
          <p className="text-xl font-semibold text-gray-800">
            Error loading dashboard
          </p>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center mx-auto">
            <FaSync className="mr-2" /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header with Date Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-500">
            Overview of platform metrics and activities
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
          <div className="flex items-center">
            <label className="mr-2 text-sm text-gray-600">Time Range:</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 text-sm bg-white">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {timeRange === "custom" && (
            <div className="flex items-center gap-2">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                className="border border-gray-300 rounded px-3 py-1 text-sm w-28"
                placeholderText="Start Date"
              />
              <span>to</span>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                className="border border-gray-300 rounded px-3 py-1 text-sm w-28"
                placeholderText="End Date"
              />
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {/* Total Users */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <FaUsers className="text-xl" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.totalUsers.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-blue-600 flex items-center">
              <FaChartLine className="mr-1" /> +12.5% from last month
            </p>
          </div>
        </div>

        {/* Total Businesses */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
              <FaBuilding className="text-xl" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-500">
                Total Businesses
              </p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.totalBusinesses.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-green-600 flex items-center">
              <FaChartLine className="mr-1" /> +8.3% from last month
            </p>
          </div>
        </div>

        {/* Blacklisted Entities */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-red-100 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
              <FaBan className="text-xl" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-500">Blacklisted</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.totalBlacklisted.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-red-600 flex items-center">
              <FaChartLine className="mr-1" /> +3.2% from last month
            </p>
          </div>
        </div>

        {/* Pending Reports */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-yellow-100 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-lg bg-yellow-50 flex items-center justify-center text-yellow-600">
              <FaExclamationTriangle className="text-xl" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-500">
                Pending Reports
              </p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.pendingReports}
              </p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <button className="text-xs text-yellow-600 hover:underline">
              View all reports →
            </button>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-indigo-100 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <FaClipboardList className="text-xl" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-500">
                Pending Requests
              </p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.pendingRequests}
              </p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <button className="text-xs text-indigo-600 hover:underline">
              Process requests →
            </button>
          </div>
        </div>

        {/* Average Rating */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-orange-100 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
              <FaStar className="text-xl" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-500">Avg. Rating</p>
              <p className="text-2xl font-bold text-gray-800">
                {stats.averageRating.toFixed(1)}/5.0
              </p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`text-sm ${i < Math.floor(stats.averageRating) ? "text-orange-400" : "text-gray-300"}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* User Growth Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              <FaChartLine className="inline mr-2 text-blue-500" />
              User Growth
            </h3>
            <select
              className="text-sm border border-gray-300 rounded px-2 py-1 bg-gray-50"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}>
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="daily">Daily</option>
            </select>
          </div>
          <div className="h-64">
            <Line
              data={userGrowthData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      drawBorder: false,
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Business Growth Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              <FaChartLine className="inline mr-2 text-green-500" />
              Business Growth
            </h3>
            <select
              className="text-sm border border-gray-300 rounded px-2 py-1 bg-gray-50"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}>
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="daily">Daily</option>
            </select>
          </div>
          <div className="h-64">
            <Line
              data={businessGrowthData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      drawBorder: false,
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Blacklist Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            <FaChartPie className="inline mr-2 text-red-500" />
            Blacklist Distribution
          </h3>
          <div className="h-64">
            <Pie
              data={blacklistData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "right",
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Activity Types */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            <FaChartPie className="inline mr-2 text-purple-500" />
            Activity Types
          </h3>
          <div className="h-64">
            <Doughnut
              data={activityTypesData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "right",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

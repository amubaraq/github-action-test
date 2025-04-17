// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import { Bar, Line } from "react-chartjs-2";
// import { useSelector } from "react-redux";
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
// import {
//   ArrowUpIcon,
//   ArrowDownIcon,
//   ChartBarIcon,
//   RefreshIcon,
//   CheckCircleIcon,
//   ExclamationCircleIcon,
// } from "@heroicons/react/outline";
// import backendURL from "../../config";
// import LoaddingSpinner from "../../components/tools/LoaddingSpinner";

// // Register Chart.js components
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

// const UserDashboard = () => {
//   const [subscription, setSubscription] = useState(null);
//   const [profileStats, setProfileStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [timeFilter, setTimeFilter] = useState("month");
//   const [lastUpdated, setLastUpdated] = useState(null);
//   const { userInfo, token } = useSelector((state) => state.auth);

//   // Chart configuration
//   const chartOptions = useMemo(
//     () => ({
//       responsive: true,
//       maintainAspectRatio: false,
//       plugins: {
//         legend: { display: false },
//         tooltip: {
//           mode: "index",
//           intersect: false,
//           backgroundColor: "rgba(0,0,0,0.8)",
//           bodyFont: { size: 12 },
//           padding: 12,
//           callbacks: {
//             label: (context) => {
//               let label = context.dataset.label || "";
//               if (label) label += ": ";
//               if (context.parsed.y !== null) {
//                 label += context.parsed.y.toLocaleString();
//               }
//               return label;
//             },
//           },
//         },
//       },
//       interaction: {
//         mode: "nearest",
//         axis: "x",
//         intersect: false,
//       },
//       scales: {
//         y: {
//           beginAtZero: true,
//           grid: { drawBorder: false },
//           ticks: {
//             callback: (value) => value.toLocaleString(),
//           },
//         },
//         x: {
//           grid: { display: false },
//         },
//       },
//     }),
//     []
//   );

//   // Fetch profile data function
//   const fetchProfileData = useCallback(
//     async (controller) => {
//       try {
//         setLoading(true);
//         setError(null);

//         // Get user slug first
//         const slugResponse = await fetch(
//           `${backendURL}/api/user/${userInfo.slug}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//             signal: controller.signal,
//           }
//         );

//         if (!slugResponse.ok) {
//           throw new Error(
//             (await slugResponse.json()).message || "Failed to fetch user data"
//           );
//         }

//         const slugData = await slugResponse.json();
//         const slug = slugData?.data?.user?.contact?.slug;

//         if (!slug) {
//           throw new Error("User Profile or slug not found");
//         }

//         // Fetch profile stats using the slug
//         const profileResponse = await fetch(
//           `${backendURL}/api/profile/${slug}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//             signal: controller.signal,
//           }
//         );

//         if (!profileResponse.ok) {
//           throw new Error(
//             (await profileResponse.json()).message ||
//               "Failed to fetch profile stats"
//           );
//         }

//         const profileData = await profileResponse.json();
//         const businesses = profileData?.businesses || [];
//         const contact = profileData?.contact || {};

//         // Calculate stats
//         const totalViews =
//           (contact.views || 0) +
//           businesses.reduce((sum, business) => sum + (business.views || 0), 0);

//         const totalReviews =
//           (profileData.reviews?.length || 0) +
//           businesses.reduce(
//             (sum, business) => sum + (business.reviews?.length || 0),
//             0
//           );

//         const totalShares =
//           (contact.shares || 0) +
//           businesses.reduce((sum, business) => sum + (business.shares || 0), 0);

//         // Total engagements as sum of shares, views, and reviews
//         const totalEngagements = totalViews + totalReviews + totalShares;

//         const userVerificationStatus =
//           contact.verification_percentage >= 100
//             ? "Verified"
//             : `${contact.verification_percentage || 0}%`;

//         const businessVerificationStatus =
//           businesses.length > 0
//             ? Math.max(
//                 ...businesses.map((b) => b.verification_percentage || 0)
//               ) >= 100
//               ? "Verified"
//               : "Pending"
//             : "No Businesses";

//         // Helper function to group data by time period
//         const groupDataByTimePeriod = (items, field, period) => {
//           const grouped = {};
//           const now = new Date();

//           items.forEach((item) => {
//             const date = new Date(item.created_at);
//             let key;

//             if (period === "week") {
//               // Group by week
//               const weekStart = new Date(date);
//               weekStart.setDate(date.getDate() - date.getDay());
//               key = `${weekStart.getFullYear()}-W${Math.ceil(
//                 ((date - new Date(date.getFullYear(), 0, 1)) / 86400000 + 1) / 7
//               )}`;
//             } else if (period === "month") {
//               // Group by month
//               key = date.toLocaleString("default", {
//                 month: "short",
//                 year: "numeric",
//               });
//             } else {
//               // Group by year
//               key = date.getFullYear();
//             }

//             grouped[key] = (grouped[key] || 0) + (item[field] || 0);
//           });

//           return Object.entries(grouped)
//             .map(([key, value]) => ({ period: key, value }))
//             .sort((a, b) => {
//               // Sort by date
//               if (period === "week") {
//                 return a.period.localeCompare(b.period);
//               } else if (period === "month") {
//                 return new Date(a.period) - new Date(b.period);
//               } else {
//                 return a.period - b.period;
//               }
//             });
//         };

//         const stats = {
//           totalViews,
//           totalReviews,
//           totalEngagements,
//           totalShares,
//           userVerificationStatus,
//           businessVerificationStatus,
//           viewsOverTime: groupDataByTimePeriod(
//             [...businesses, contact],
//             "views",
//             timeFilter
//           ),
//           reviewsOverTime: groupDataByTimePeriod(
//             profileData.reviews || [],
//             "length",
//             timeFilter
//           ),
//           engagementsOverTime: groupDataByTimePeriod(
//             [...businesses, contact],
//             "shares",
//             timeFilter
//           ),
//         };

//         setProfileStats(stats);
//         setLastUpdated(new Date());
//         return stats;
//       } catch (err) {
//         if (err.name !== "AbortError") {
//           setError(err.message || "Error fetching profile data");
//           console.error("Profile data fetch error:", err);
//         }
//         return null;
//       } finally {
//         setLoading(false);
//       }
//     },
//     [userInfo?.slug, token, timeFilter]
//   );

//   // Fetch subscription data
//   const fetchSubscription = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await fetch(`${backendURL}/api/get/user/subscription`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const data = await response.json();

//       if (data.status === "success" && data.data) {
//         setSubscription(data.data);
//       } else {
//         throw new Error(data.message || "Failed to load subscription data");
//       }
//     } catch (err) {
//       setError(
//         "Error fetching subscription data: " + (err.message || "Unknown error")
//       );
//       console.error("Subscription fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, [token]);

//   // Fetch all data
//   useEffect(() => {
//     const controller = new AbortController();

//     const fetchData = async () => {
//       try {
//         await Promise.all([fetchProfileData(controller), fetchSubscription()]);
//       } catch (err) {
//         if (err.name !== "AbortError") {
//           setError("Failed to load dashboard data");
//         }
//       }
//     };

//     fetchData();

//     return () => controller.abort();
//   }, [fetchProfileData, fetchSubscription]);

//   // Refresh data
//   const handleRefresh = useCallback(() => {
//     const controller = new AbortController();
//     fetchProfileData(controller);
//     fetchSubscription();
//     return () => controller.abort();
//   }, [fetchProfileData, fetchSubscription]);

//   // Format chart data
//   const formatChartData = (data, label, backgroundColor, borderColor) => ({
//     labels: data?.map((item) => item.period) || ["No data"],
//     datasets: [
//       {
//         label,
//         data: data?.map((item) => item.value) || [0],
//         backgroundColor,
//         borderColor,
//         borderWidth: 2,
//         tension: 0.3,
//         fill: true,
//       },
//     ],
//   });

//   // Chart data
//   const viewsData = useMemo(
//     () =>
//       formatChartData(
//         profileStats?.viewsOverTime,
//         "Views",
//         "rgba(59, 130, 246, 0.2)",
//         "rgba(59, 130, 246, 1)"
//       ),
//     [profileStats?.viewsOverTime]
//   );

//   const reviewsData = useMemo(
//     () =>
//       formatChartData(
//         profileStats?.reviewsOverTime,
//         "Reviews",
//         "rgba(16, 185, 129, 0.2)",
//         "rgba(16, 185, 129, 1)"
//       ),
//     [profileStats?.reviewsOverTime]
//   );

//   const engagementsData = useMemo(
//     () =>
//       formatChartData(
//         profileStats?.engagementsOverTime,
//         "Engagements",
//         "rgba(139, 92, 246, 0.2)",
//         "rgba(139, 92, 246, 1)"
//       ),
//     [profileStats?.engagementsOverTime]
//   );

//   // Stats cards data
//   const stats = useMemo(
//     () => [
//       {
//         title: "Total Views",
//         value: profileStats?.totalViews.toLocaleString() || "0",
//         change: profileStats?.totalViews > 0 ? "+12%" : "0%",
//         icon: "👁️",
//         color: "bg-blue-100 text-blue-600",
//         border: "border-blue-200",
//       },
//       {
//         title: "Total Reviews",
//         value: profileStats?.totalReviews.toLocaleString() || "0",
//         change: profileStats?.totalReviews > 0 ? "+8%" : "0%",
//         icon: "⭐",
//         color: "bg-green-100 text-green-600",
//         border: "border-green-200",
//       },
//       {
//         title: "Engagements",
//         value: profileStats?.totalEngagements.toLocaleString() || "0",
//         change: profileStats?.totalEngagements > 0 ? "+15%" : "0%",
//         icon: "💬",
//         color: "bg-purple-100 text-purple-600",
//         border: "border-purple-200",
//       },
//       {
//         title: "User Verification",
//         value: profileStats?.userVerificationStatus || "0%",
//         change: "",
//         icon: profileStats?.userVerificationStatus === "Verified" ? "✅" : "🔄",
//         color:
//           profileStats?.userVerificationStatus === "Verified"
//             ? "bg-green-100 text-green-600"
//             : "bg-orange-100 text-orange-600",
//         border:
//           profileStats?.userVerificationStatus === "Verified"
//             ? "border-green-200"
//             : "border-orange-200",
//       },
//       {
//         title: "Business Verification",
//         value: profileStats?.businessVerificationStatus || "No Businesses",
//         change: "",
//         icon:
//           profileStats?.businessVerificationStatus === "Verified" ? "🏢" : "🏢",
//         color:
//           profileStats?.businessVerificationStatus === "Verified"
//             ? "bg-green-100 text-green-600"
//             : profileStats?.businessVerificationStatus === "No Businesses"
//               ? "bg-gray-100 text-gray-600"
//               : "bg-yellow-100 text-yellow-600",
//         border:
//           profileStats?.businessVerificationStatus === "Verified"
//             ? "border-green-200"
//             : profileStats?.businessVerificationStatus === "No Businesses"
//               ? "border-gray-200"
//               : "border-yellow-200",
//       },
//     ],
//     [profileStats]
//   );

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const options = { year: "numeric", month: "short", day: "numeric" };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   // Calculate days remaining in subscription
//   const calculateDaysRemaining = (expiryDate) => {
//     if (!expiryDate) return 0;
//     const today = new Date();
//     const expiry = new Date(expiryDate);
//     const diffTime = Math.max(0, expiry - today);
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays;
//   };

//   // Empty state component for charts
//   const ChartEmptyState = ({ message = "No data available" }) => (
//     <div className="h-full flex flex-col items-center justify-center p-4 text-gray-400">
//       <ChartBarIcon className="h-12 w-12 mb-2" />
//       <p className="text-center">{message}</p>
//     </div>
//   );

//   // Stats card component
//   const StatsCard = React.memo(
//     ({ title, value, change, icon, color, border }) => {
//       const isPositive = change?.startsWith("+");
//       const hasChange = change && change !== "0%";

//       return (
//         <div
//           className={`bg-white p-5 rounded-xl shadow-sm border ${border} hover:shadow-md transition-all`}>
//           <div className="flex justify-between items-start">
//             <div>
//               <h3 className="text-sm font-medium text-gray-500">{title}</h3>
//               <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
//             </div>
//             <div
//               className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-lg`}>
//               {icon}
//             </div>
//           </div>
//           {hasChange && (
//             <div className="flex items-center mt-3">
//               <span
//                 className={`text-sm ${
//                   isPositive ? "text-green-500" : "text-red-500"
//                 }`}>
//                 {change} from last period
//               </span>
//               {isPositive ? (
//                 <ArrowUpIcon className="h-4 w-4 text-green-500 ml-1" />
//               ) : (
//                 <ArrowDownIcon className="h-4 w-4 text-red-500 ml-1" />
//               )}
//             </div>
//           )}
//         </div>
//       );
//     }
//   );

//   // Time filter component
//   const TimeFilter = ({ activeFilter, onChange }) => {
//     const filters = [
//       { value: "week", label: "Weekly" },
//       { value: "month", label: "Monthly" },
//       { value: "year", label: "Yearly" },
//     ];

//     return (
//       <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
//         {filters.map((filter) => (
//           <button
//             key={filter.value}
//             onClick={() => onChange(filter.value)}
//             className={`px-3 py-1 text-sm rounded-md transition-colors ${
//               activeFilter === filter.value
//                 ? "bg-white shadow-sm text-blue-600"
//                 : "text-gray-600 hover:bg-gray-200"
//             }`}>
//             {filter.label}
//           </button>
//         ))}
//       </div>
//     );
//   };

//   // Render subscription content
//   const renderSubscriptionContent = () => {
//     if (loading && !subscription) {
//       return (
//         <div className="flex justify-center items-center py-8">
//           <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
//         </div>
//       );
//     }

//     if (error && !subscription) {
//       return (
//         <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center">
//           <p>{error}</p>
//           <button
//             onClick={handleRefresh}
//             className="mt-2 text-sm text-blue-600 hover:underline flex items-center justify-center mx-auto">
//             <RefreshIcon className="h-4 w-4 mr-1" />
//             Try Again
//           </button>
//         </div>
//       );
//     }

//     if (!subscription || !subscription.is_active) {
//       return (
//         <div className="text-center py-6">
//           <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
//             <span className="text-2xl">🔒</span>
//           </div>
//           <p className="text-lg text-gray-600 mb-2">No active subscription</p>
//           <p className="text-sm text-gray-500 mb-4">
//             Upgrade to access premium features
//           </p>
//           <button className="mt-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md">
//             Upgrade Now
//           </button>
//         </div>
//       );
//     }

//     const daysRemaining = calculateDaysRemaining(subscription.expiry_date);
//     const percentageRemaining = Math.round(
//       (daysRemaining / subscription.duration_days) * 100
//     );
//     const isExpiringSoon = daysRemaining <= 7;

//     return (
//       <div className="space-y-4">
//         <div className="flex justify-between items-center">
//           <div>
//             <h4 className="text-sm font-medium text-gray-500">CURRENT PLAN</h4>
//             <h3 className="text-xl font-bold text-gray-800">
//               {subscription.plan_type.charAt(0).toUpperCase() +
//                 subscription.plan_type.slice(1)}
//             </h3>
//           </div>
//           <div
//             className={`px-3 py-1 rounded-full text-xs font-semibold ${
//               subscription.is_active
//                 ? "bg-green-100 text-green-800"
//                 : "bg-red-100 text-red-800"
//             }`}>
//             {subscription.status.toUpperCase()}
//           </div>
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <div className="bg-gray-50 p-3 rounded-lg">
//             <p className="text-xs font-medium text-gray-500">START DATE</p>
//             <p className="font-medium">{formatDate(subscription.start_date)}</p>
//           </div>
//           <div className="bg-gray-50 p-3 rounded-lg">
//             <p className="text-xs font-medium text-gray-500">EXPIRY DATE</p>
//             <p className="font-medium">
//               {formatDate(subscription.expiry_date)}
//             </p>
//           </div>
//         </div>

//         <div className="bg-gray-50 p-3 rounded-lg">
//           <p className="text-xs font-medium text-gray-500">AMOUNT</p>
//           <p className="text-xl font-bold">${subscription.amount}</p>
//           <p className="text-xs text-gray-500 mt-1">
//             Payment Ref: {subscription.payment_reference}
//           </p>
//         </div>

//         <div className="pt-4">
//           <div className="flex justify-between items-center mb-1">
//             <span className="text-sm font-medium text-gray-600">
//               {isExpiringSoon ? "Expires in" : "Days remaining"}
//             </span>
//             <span
//               className={`text-sm font-bold ${
//                 isExpiringSoon ? "text-red-600" : "text-gray-800"
//               }`}>
//               {daysRemaining} {daysRemaining === 1 ? "day" : "days"}
//             </span>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-2">
//             <div
//               className={`h-2 rounded-full ${
//                 isExpiringSoon ? "bg-red-500" : "bg-blue-500"
//               }`}
//               style={{ width: `${percentageRemaining}%` }}></div>
//           </div>
//           {isExpiringSoon && (
//             <p className="text-xs text-red-500 mt-1">
//               Your subscription is expiring soon. Renew to avoid interruption.
//             </p>
//           )}
//         </div>

//         <div className="flex space-x-3 pt-2">
//           <button className="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition">
//             Manage Plan
//           </button>
//           <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
//             Renew Now
//           </button>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
//             My Dashboard
//           </h1>
//           <p className="text-gray-500">
//             Welcome back, {userInfo?.name || "User"}!
//           </p>
//         </div>
//         <div className="flex items-center space-x-4">
//           {lastUpdated && (
//             <p className="text-sm text-gray-500">
//               Last updated: {lastUpdated.toLocaleTimeString()}
//             </p>
//           )}
//           <button
//             onClick={handleRefresh}
//             className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
//             title="Refresh data">
//             <RefreshIcon className="h-5 w-5" />
//           </button>
//           <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full">
//             PUBLIC
//           </span>
//         </div>
//       </div>

//       {/* Loading state */}
//       {loading && (
//         <>
//           <LoaddingSpinner />
//         </>
//       )}

//       {/* Error state */}
//       {!loading && error && (
//         <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center mb-4">
//           <div className="flex items-center justify-center">
//             <ExclamationCircleIcon className="h-5 w-5 mr-2" />
//             <p>{error}</p>
//           </div>
//           <button
//             onClick={handleRefresh}
//             className="mt-2 text-sm text-blue-600 hover:underline flex items-center justify-center mx-auto">
//             <RefreshIcon className="h-4 w-4 mr-1" />
//             Refresh Data
//           </button>
//         </div>
//       )}

//       {/* Content */}
//       {profileStats && (
//         <>
//           {/* Stats Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
//             {stats.map((stat, index) => (
//               <StatsCard
//                 key={index}
//                 title={stat.title}
//                 value={stat.value}
//                 change={stat.change}
//                 icon={stat.icon}
//                 color={stat.color}
//                 border={stat.border}
//               />
//             ))}
//           </div>

//           {/* Main Content */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//             {/* Subscription Card */}
//             <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-1">
//               <div className="flex justify-between items-center mb-6">
//                 <h3 className="text-lg font-semibold text-gray-800">
//                   My Subscription
//                 </h3>
//                 <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
//                   {subscription?.plan_type || "Trial"}
//                 </span>
//               </div>
//               {renderSubscriptionContent()}
//             </div>

//             {/* Charts Section */}
//             <div className="lg:col-span-2 space-y-6">
//               {/* Monthly Views Chart */}
//               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-lg font-semibold text-gray-800">
//                     Views Over Time
//                   </h3>
//                   <TimeFilter
//                     activeFilter={timeFilter}
//                     onChange={setTimeFilter}
//                   />
//                 </div>
//                 <div className="h-64">
//                   {viewsData.datasets[0].data.length > 0 ? (
//                     <Line data={viewsData} options={chartOptions} />
//                   ) : (
//                     <ChartEmptyState message="No view data available" />
//                   )}
//                 </div>
//               </div>

//               {/* Bottom Row Charts */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Monthly Reviews Chart */}
//                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//                   <h3 className="text-lg font-semibold text-gray-800 mb-4">
//                     Reviews Over Time
//                   </h3>
//                   <div className="h-48">
//                     {reviewsData.datasets[0].data.length > 0 ? (
//                       <Bar data={reviewsData} options={chartOptions} />
//                     ) : (
//                       <ChartEmptyState message="No review data available" />
//                     )}
//                   </div>
//                 </div>

//                 {/* Monthly Engagements Chart */}
//                 <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
//                   <h3 className="text-lg font-semibold text-gray-800 mb-4">
//                     Engagements Over Time
//                   </h3>
//                   <div className="h-48">
//                     {engagementsData.datasets[0].data.length > 0 ? (
//                       <Line data={engagementsData} options={chartOptions} />
//                     ) : (
//                       <ChartEmptyState message="No engagement data available" />
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default UserDashboard;
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Bar, Line } from "react-chartjs-2";
import { useSelector } from "react-redux";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  ChartBarIcon,
  RefreshIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  UserCircleIcon,
} from "@heroicons/react/outline";
import backendURL from "../../config";
import LoaddingSpinner from "../../components/tools/LoaddingSpinner";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const UserDashboard = () => {
  const [subscription, setSubscription] = useState(null);
  const [profileStats, setProfileStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFilter, setTimeFilter] = useState("month");
  const [lastUpdated, setLastUpdated] = useState(null);
  const { userInfo, token } = useSelector((state) => state.auth);
  const [hasProfile, setHasProfile] = useState(true);

  // Chart configuration
  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          mode: "index",
          intersect: false,
          backgroundColor: "rgba(0,0,0,0.8)",
          bodyFont: { size: 12 },
          padding: 12,
          callbacks: {
            label: (context) => {
              let label = context.dataset.label || "";
              if (label) label += ": ";
              if (context.parsed.y !== null) {
                label += context.parsed.y.toLocaleString();
              }
              return label;
            },
          },
        },
      },
      interaction: {
        mode: "nearest",
        axis: "x",
        intersect: false,
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { drawBorder: false },
          ticks: {
            callback: (value) => value.toLocaleString(),
          },
        },
        x: {
          grid: { display: false },
        },
      },
    }),
    []
  );

  // Fetch profile data function
  const fetchProfileData = useCallback(
    async (controller) => {
      try {
        setLoading(true);
        setError(null);

        // Get user slug first
        const slugResponse = await fetch(
          `${backendURL}/api/user/${userInfo.slug}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            signal: controller.signal,
          }
        );

        if (!slugResponse.ok) {
          throw new Error(
            (await slugResponse.json()).message || "Failed to fetch user data"
          );
        }

        const slugData = await slugResponse.json();
        const slug = slugData?.data?.user?.contact?.slug;

        if (!slug) {
          setHasProfile(false);
          return null;
        }

        // Fetch profile stats using the slug
        const profileResponse = await fetch(
          `${backendURL}/api/profile/${slug}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            signal: controller.signal,
          }
        );

        if (!profileResponse.ok) {
          throw new Error(
            (await profileResponse.json()).message ||
              "Failed to fetch profile stats"
          );
        }

        const profileData = await profileResponse.json();
        const businesses = profileData?.businesses || [];
        const contact = profileData?.contact || {};

        // Calculate stats
        const totalViews =
          (contact.views || 0) +
          businesses.reduce((sum, business) => sum + (business.views || 0), 0);

        const totalReviews =
          (profileData.reviews?.length || 0) +
          businesses.reduce(
            (sum, business) => sum + (business.reviews?.length || 0),
            0
          );

        const totalShares =
          (contact.shares || 0) +
          businesses.reduce((sum, business) => sum + (business.shares || 0), 0);

        // Total engagements as sum of shares, views, and reviews
        const totalEngagements = totalViews + totalReviews + totalShares;

        const userVerificationStatus =
          contact.verification_percentage >= 100
            ? "Verified"
            : `${contact.verification_percentage || 0}%`;

        const businessVerificationStatus =
          businesses.length > 0
            ? Math.max(
                ...businesses.map((b) => b.verification_percentage || 0)
              ) >= 100
              ? "Verified"
              : "Pending"
            : "No Businesses";

        // Helper function to group data by time period
        const groupDataByTimePeriod = (items, field, period) => {
          const grouped = {};
          const now = new Date();

          items.forEach((item) => {
            const date = new Date(item.created_at);
            let key;

            if (period === "week") {
              // Group by week
              const weekStart = new Date(date);
              weekStart.setDate(date.getDate() - date.getDay());
              key = `${weekStart.getFullYear()}-W${Math.ceil(
                ((date - new Date(date.getFullYear(), 0, 1)) / 86400000 + 1) / 7
              )}`;
            } else if (period === "month") {
              // Group by month
              key = date.toLocaleString("default", {
                month: "short",
                year: "numeric",
              });
            } else {
              // Group by year
              key = date.getFullYear();
            }

            grouped[key] = (grouped[key] || 0) + (item[field] || 0);
          });

          return Object.entries(grouped)
            .map(([key, value]) => ({ period: key, value }))
            .sort((a, b) => {
              // Sort by date
              if (period === "week") {
                return a.period.localeCompare(b.period);
              } else if (period === "month") {
                return new Date(a.period) - new Date(b.period);
              } else {
                return a.period - b.period;
              }
            });
        };

        const stats = {
          totalViews,
          totalReviews,
          totalEngagements,
          totalShares,
          userVerificationStatus,
          businessVerificationStatus,
          viewsOverTime: groupDataByTimePeriod(
            [...businesses, contact],
            "views",
            timeFilter
          ),
          reviewsOverTime: groupDataByTimePeriod(
            profileData.reviews || [],
            "length",
            timeFilter
          ),
          engagementsOverTime: groupDataByTimePeriod(
            [...businesses, contact],
            "shares",
            timeFilter
          ),
        };

        setProfileStats(stats);
        setLastUpdated(new Date());
        setHasProfile(true);
        return stats;
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Error fetching profile data");
          console.error("Profile data fetch error:", err);
        }
        return null;
      } finally {
        setLoading(false);
      }
    },
    [userInfo?.slug, token, timeFilter]
  );

  // Fetch subscription data
  const fetchSubscription = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${backendURL}/api/get/user/subscription`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === "success" && data.data) {
        setSubscription(data.data);
      } else {
        throw new Error(data.message || "Failed to load subscription data");
      }
    } catch (err) {
      setError(
        "Error fetching subscription data: " + (err.message || "Unknown error")
      );
      console.error("Subscription fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Fetch all data
  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        await Promise.all([fetchProfileData(controller), fetchSubscription()]);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Failed to load dashboard data");
        }
      }
    };

    fetchData();

    return () => controller.abort();
  }, [fetchProfileData, fetchSubscription]);

  // Refresh data
  const handleRefresh = useCallback(() => {
    const controller = new AbortController();
    fetchProfileData(controller);
    fetchSubscription();
    return () => controller.abort();
  }, [fetchProfileData, fetchSubscription]);

  // Format chart data
  const formatChartData = (data, label, backgroundColor, borderColor) => ({
    labels: data?.map((item) => item.period) || ["No data"],
    datasets: [
      {
        label,
        data: data?.map((item) => item.value) || [0],
        backgroundColor,
        borderColor,
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      },
    ],
  });

  // Chart data
  const viewsData = useMemo(
    () =>
      formatChartData(
        profileStats?.viewsOverTime,
        "Views",
        "rgba(59, 130, 246, 0.2)",
        "rgba(59, 130, 246, 1)"
      ),
    [profileStats?.viewsOverTime]
  );

  const reviewsData = useMemo(
    () =>
      formatChartData(
        profileStats?.reviewsOverTime,
        "Reviews",
        "rgba(16, 185, 129, 0.2)",
        "rgba(16, 185, 129, 1)"
      ),
    [profileStats?.reviewsOverTime]
  );

  const engagementsData = useMemo(
    () =>
      formatChartData(
        profileStats?.engagementsOverTime,
        "Engagements",
        "rgba(139, 92, 246, 0.2)",
        "rgba(139, 92, 246, 1)"
      ),
    [profileStats?.engagementsOverTime]
  );

  // Stats cards data
  const stats = useMemo(
    () => [
      {
        title: "Total Views",
        value: profileStats?.totalViews?.toLocaleString() || "0",
        change: profileStats?.totalViews > 0 ? "+12%" : "0%",
        icon: "👁️",
        color: "bg-blue-100 text-blue-600",
        border: "border-blue-200",
      },
      {
        title: "Total Reviews",
        value: profileStats?.totalReviews?.toLocaleString() || "0",
        change: profileStats?.totalReviews > 0 ? "+8%" : "0%",
        icon: "⭐",
        color: "bg-green-100 text-green-600",
        border: "border-green-200",
      },
      {
        title: "Engagements",
        value: profileStats?.totalEngagements?.toLocaleString() || "0",
        change: profileStats?.totalEngagements > 0 ? "+15%" : "0%",
        icon: "💬",
        color: "bg-purple-100 text-purple-600",
        border: "border-purple-200",
      },
      {
        title: "User Verification",
        value: profileStats?.userVerificationStatus || "0%",
        change: "",
        icon: profileStats?.userVerificationStatus === "Verified" ? "✅" : "🔄",
        color:
          profileStats?.userVerificationStatus === "Verified"
            ? "bg-green-100 text-green-600"
            : "bg-orange-100 text-orange-600",
        border:
          profileStats?.userVerificationStatus === "Verified"
            ? "border-green-200"
            : "border-orange-200",
      },
      {
        title: "Business Verification",
        value: profileStats?.businessVerificationStatus || "No Businesses",
        change: "",
        icon:
          profileStats?.businessVerificationStatus === "Verified" ? "🏢" : "🏢",
        color:
          profileStats?.businessVerificationStatus === "Verified"
            ? "bg-green-100 text-green-600"
            : profileStats?.businessVerificationStatus === "No Businesses"
              ? "bg-gray-100 text-gray-600"
              : "bg-yellow-100 text-yellow-600",
        border:
          profileStats?.businessVerificationStatus === "Verified"
            ? "border-green-200"
            : profileStats?.businessVerificationStatus === "No Businesses"
              ? "border-gray-200"
              : "border-yellow-200",
      },
    ],
    [profileStats]
  );

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate days remaining in subscription
  const calculateDaysRemaining = (expiryDate) => {
    if (!expiryDate) return 0;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = Math.max(0, expiry - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Empty state component for charts
  const ChartEmptyState = ({ message = "No data available" }) => (
    <div className="h-full flex flex-col items-center justify-center p-4 text-gray-400">
      <ChartBarIcon className="h-12 w-12 mb-2" />
      <p className="text-center">{message}</p>
    </div>
  );

  // Stats card component
  const StatsCard = React.memo(
    ({ title, value, change, icon, color, border }) => {
      const isPositive = change?.startsWith("+");
      const hasChange = change && change !== "0%";

      return (
        <div
          className={`bg-white p-5 rounded-xl shadow-sm border ${border} hover:shadow-md transition-all`}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">{title}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            </div>
            <div
              className={`w-10 h-10 rounded-full ${color} flex items-center justify-center text-lg`}>
              {icon}
            </div>
          </div>
          {hasChange && (
            <div className="flex items-center mt-3">
              <span
                className={`text-sm ${
                  isPositive ? "text-green-500" : "text-red-500"
                }`}>
                {change} from last period
              </span>
              {isPositive ? (
                <ArrowUpIcon className="h-4 w-4 text-green-500 ml-1" />
              ) : (
                <ArrowDownIcon className="h-4 w-4 text-red-500 ml-1" />
              )}
            </div>
          )}
        </div>
      );
    }
  );

  // Time filter component
  const TimeFilter = ({ activeFilter, onChange }) => {
    const filters = [
      { value: "week", label: "Weekly" },
      { value: "month", label: "Monthly" },
      { value: "year", label: "Yearly" },
    ];

    return (
      <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onChange(filter.value)}
            className={`px-3 py-1 text-sm rounded-md transition-colors ${
              activeFilter === filter.value
                ? "bg-white shadow-sm text-blue-600"
                : "text-gray-600 hover:bg-gray-200"
            }`}>
            {filter.label}
          </button>
        ))}
      </div>
    );
  };

  // No Profile State Component
  const NoProfileState = () => (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
      <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <UserCircleIcon className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        No User Profile Found
      </h3>
      <p className="text-gray-500 mb-6">
        You haven't created a profile yet. Create one to start tracking your
        statistics and engagement.
      </p>
      <Link to={"/user/profile"}>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Create Profile
        </button>
      </Link>
    </div>
  );

  // Render subscription content
  const renderSubscriptionContent = () => {
    if (loading && !subscription) {
      return (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (error && !subscription) {
      return (
        <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center">
          <p>{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-2 text-sm text-blue-600 hover:underline flex items-center justify-center mx-auto">
            <RefreshIcon className="h-4 w-4 mr-1" />
            Try Again
          </button>
        </div>
      );
    }

    if (!subscription || !subscription.is_active) {
      return (
        <div className="text-center py-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">🔒</span>
          </div>
          <p className="text-lg text-gray-600 mb-2">No active subscription</p>
          <p className="text-sm text-gray-500 mb-4">
            Upgrade to access premium features
          </p>
          <button className="mt-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md">
            Upgrade Now
          </button>
        </div>
      );
    }

    const daysRemaining = calculateDaysRemaining(subscription.expiry_date);
    const percentageRemaining = Math.round(
      (daysRemaining / subscription.duration_days) * 100
    );
    const isExpiringSoon = daysRemaining <= 7;

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="text-sm font-medium text-gray-500">CURRENT PLAN</h4>
            <h3 className="text-xl font-bold text-gray-800">
              {subscription.plan_type.charAt(0).toUpperCase() +
                subscription.plan_type.slice(1)}
            </h3>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              subscription.is_active
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}>
            {subscription.status.toUpperCase()}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-gray-500">START DATE</p>
            <p className="font-medium">{formatDate(subscription.start_date)}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-gray-500">EXPIRY DATE</p>
            <p className="font-medium">
              {formatDate(subscription.expiry_date)}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <p className="text-xs font-medium text-gray-500">AMOUNT</p>
          <p className="text-xl font-bold">${subscription.amount}</p>
          <p className="text-xs text-gray-500 mt-1">
            Payment Ref: {subscription.payment_reference}
          </p>
        </div>

        <div className="pt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-600">
              {isExpiringSoon ? "Expires in" : "Days remaining"}
            </span>
            <span
              className={`text-sm font-bold ${
                isExpiringSoon ? "text-red-600" : "text-gray-800"
              }`}>
              {daysRemaining} {daysRemaining === 1 ? "day" : "days"}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                isExpiringSoon ? "bg-red-500" : "bg-blue-500"
              }`}
              style={{ width: `${percentageRemaining}%` }}></div>
          </div>
          {isExpiringSoon && (
            <p className="text-xs text-red-500 mt-1">
              Your subscription is expiring soon. Renew to avoid interruption.
            </p>
          )}
        </div>

        <div className="flex space-x-3 pt-2">
          <button className="flex-1 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition">
            Manage Plan
          </button>
          <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Renew Now
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            My Dashboard
          </h1>
          <p className="text-gray-500">
            Welcome back, {userInfo?.name || "User"}!
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {lastUpdated && (
            <p className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
          <button
            onClick={handleRefresh}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            title="Refresh data">
            <RefreshIcon className="h-5 w-5" />
          </button>
          <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full">
            PUBLIC
          </span>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <>
          <LoaddingSpinner />
        </>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center mb-4">
          <div className="flex items-center justify-center">
            <ExclamationCircleIcon className="h-5 w-5 mr-2" />
            <p>{error}</p>
          </div>
          <button
            onClick={handleRefresh}
            className="mt-2 text-sm text-blue-600 hover:underline flex items-center justify-center mx-auto">
            <RefreshIcon className="h-4 w-4 mr-1" />
            Refresh Data
          </button>
        </div>
      )}

      {/* Content */}
      {!loading && !error && (
        <>
          {!hasProfile ? (
            <NoProfileState />
          ) : (
            <>
              {/* Stats Cards */}
              {profileStats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
                  {stats.map((stat, index) => (
                    <StatsCard
                      key={index}
                      title={stat.title}
                      value={stat.value}
                      change={stat.change}
                      icon={stat.icon}
                      color={stat.color}
                      border={stat.border}
                    />
                  ))}
                </div>
              )}

              {/* Main Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Subscription Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-1">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">
                      My Subscription
                    </h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {subscription?.plan_type || "Trial"}
                    </span>
                  </div>
                  {renderSubscriptionContent()}
                </div>

                {/* Charts Section */}
                {hasProfile && (
                  <div className="lg:col-span-2 space-y-6">
                    {/* Monthly Views Chart */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                          Views Over Time
                        </h3>
                        <TimeFilter
                          activeFilter={timeFilter}
                          onChange={setTimeFilter}
                        />
                      </div>
                      <div className="h-64">
                        {viewsData.datasets[0].data.length > 0 ? (
                          <Line data={viewsData} options={chartOptions} />
                        ) : (
                          <ChartEmptyState message="No view data available" />
                        )}
                      </div>
                    </div>

                    {/* Bottom Row Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Monthly Reviews Chart */}
                      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                          Reviews Over Time
                        </h3>
                        <div className="h-48">
                          {reviewsData.datasets[0].data.length > 0 ? (
                            <Bar data={reviewsData} options={chartOptions} />
                          ) : (
                            <ChartEmptyState message="No review data available" />
                          )}
                        </div>
                      </div>

                      {/* Monthly Engagements Chart */}
                      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                          Engagements Over Time
                        </h3>
                        <div className="h-48">
                          {engagementsData.datasets[0].data.length > 0 ? (
                            <Line
                              data={engagementsData}
                              options={chartOptions}
                            />
                          ) : (
                            <ChartEmptyState message="No engagement data available" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default UserDashboard;

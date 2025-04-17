lets include the missing starts on the dashbord,including agentCode(with a copyText button)...below is the response for " `${backendURL}/api/agent/subscription-data`,"...."{
  "status": "success",
  "message": "Subscription data retrieved successfully.",
  "data": {
      "agent": {
          "id": 32,
          "name": "Agent Alhaji musa",
          "agent_code": "ENig-agent-alhaji-musa",
          "total_earnings": 0,
          "direct_earnings": 0,
          "indirect_earnings": 0,
          "total_referred_users": 2
      },
      "referred_users": [
          {
              "user_id": 33,
              "name": "Alhaji musa",
              "email": "N\/A",
              "phone": "+2348062123859",
              "role": "user",
              "contact": null,
              "businesses": [],
              "subscriptions": [],
              "referred_by_agent_code": "ENig-agent-alhaji-musa",
              "created_at": "2025-04-03 18:00:38"
          },
          {
              "user_id": 34,
              "name": "Alhaji musa",
              "email": "N\/A",
              "phone": "+2348062123810",
              "role": "user",
              "contact": null,
              "businesses": [],
              "subscriptions": [],
              "referred_by_agent_code": "ENig-agent-alhaji-musa",
              "created_at": "2025-04-04 03:38:10"
          }
      ]
  }
}".....below is the response for " `${backendURL}/api/agent/commissions`,"....."{
  "status": "success",
  "message": "Commission details retrieved successfully.",
  "data": {
      "total_earnings": 0,
      "commissions": []
  }
}"...........below is aslo the response for "     `${backendURL}/api/agent/performance`,"......"{
  "status": "success",
  "message": "Performance metrics retrieved successfully.",
  "data": {
      "total_referred_users": 2,
      "active_subscriptions": 0,
      "total_earnings": 0,
      "conversion_rate": "0%",
      "platform_breakdown": []
  }
}"......................................
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
} from "react-icons/fa";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import backendURL from "../../config";
import { useNavigate } from "react-router-dom";

const AgentDashboard = () => {
const [subscriptionData, setSubscriptionData] = useState(null);
const [commissions, setCommissions] = useState(null);
const [performance, setPerformance] = useState(null);
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
      setAgentCode(perfData?.data?.agent?.agent_code);
      console.log(perfData?.data?.agent?.agent_code, "AgentCode");
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
                  ${performance?.total_earnings?.toLocaleString() || "0"}
                </h3>
              </div>
              <div className="p-3 rounded-lg bg-green-50 text-green-600">
                <FaMoneyBillWave className="text-xl" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Lifetime commissions</p>
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
                  {performance?.total_referred_users?.toLocaleString() || "0"}
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
                onClick={() => navigate("/Agent/subscriptions")}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                See All <FaArrowRight className="ml-1" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expiry
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                            <td
                              className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900"
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
                          )}
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {sub.plan_type || "N/A"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            ${sub.amount || 0}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {sub.expiry_date
                              ? new Date(sub.expiry_date).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            <button
                              onClick={() =>
                                navigate(`/profile/${user.user_id}`)
                              }
                              className="text-blue-500 hover:text-blue-700">
                              <FaEye />
                            </button>
                          </td>
                        </tr>
                      ))
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-4 py-4 text-center text-sm text-gray-500">
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
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {commission.type.replace("_", " ")}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600">
                          ${commission.amount}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
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
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {new Date(
                            commission.created_at
                          ).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {commission.referred_user?.name?.split(" ")[0] ||
                            "N/A"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-4 py-4 text-center text-sm text-gray-500">
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

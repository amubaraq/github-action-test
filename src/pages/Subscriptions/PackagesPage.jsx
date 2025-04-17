// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import LoaddingSpinner from "../../components/tools/LoaddingSpinner";
// import backendURL from "../../config";
// import { Alert, AlertDescription } from "../../components/tools/Alert";
// import LoginModal from "../../components/tools/LoginModal";
// const FrontendUrl = import.meta.env.VITE_FRONTEND_URL;
// console.log(FrontendUrl);
// const PackagesPage = () => {
//   const [showAlert, setShowAlert] = useState(false);
//   const [alertConfig, setAlertConfig] = useState({
//     variant: "default",
//     message: "",
//   });

//   const showAlertMessage = (message, variant = "default") => {
//     setAlertConfig({ message, variant });
//     setShowAlert(true);
//   };

//   const navigate = useNavigate();
//   const { userInfo, token } = useSelector((state) => state.auth); // Get user info and token from Redux
//   const [packages, setPackages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showLoginModal, setShowLoginModal] = useState(false);

//   // Fetch subscription plans from the API
//   useEffect(() => {
//     const fetchPackages = async () => {
//       try {
//         const response = await fetch(
//           "https://edirectbackend.essential.com.ng/api/subscriptions/price/list"
//         );
//         const data = await response.json();

//         if (data.status === "success") {
//           setPackages(data.data);
//         } else {
//           setError("Failed to fetch subscription plans.");
//           showAlertMessage(
//             "Failed to fetch subscription plans.",
//             "destructive"
//           );
//         }
//       } catch (err) {
//         setError("An error occurred while fetching plans. Please try again.");
//         showAlertMessage(
//           "An error occurred while fetching plans. Please try again.",
//           "destructive"
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPackages();
//   }, []);

//   // Handle upgrade button click to initiate Paystack payment for non-trial plans
//   const handleUpgrade = async (plan) => {
//     try {
//       if (!userInfo) {
//         setShowLoginModal(true);
//       }
//       const response = await fetch(`${backendURL}/api/subscription/initiate`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`, // Add authentication token
//         },
//         body: JSON.stringify({
//           plan_type: plan.name,
//           email: userInfo?.email || "essential23@gmail.com", // Use authenticated user's email
//           callback_url: `${FrontendUrl}/callback`,
//         }),
//       });

//       const data = await response.json();

//       if (data.status === "success") {
//         // Store payment details in localStorage for verification
//         localStorage.setItem(
//           "subscriptionPaymentDetails",
//           JSON.stringify({
//             reference: data.data.reference,
//             subscription_id: data.data.subscription_id,
//           })
//         );
//         window.location.href = data.data.authorization_url; // Redirect to Paystack
//       } else {
//         showAlertMessage(
//           data.message || "Failed to initiate payment.",
//           "destructive"
//         );
//       }
//     } catch (err) {
//       showAlertMessage(
//         "An error occurred while initiating payment.",
//         "destructive"
//       );
//     }
//   };

//   // Handle free trial activation for the trial plan (id: 7)
//   const handleActivateFreePlan = async () => {
//     try {
//       const response = await fetch(`${backendURL}/api/activate/default/plan`, {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${token}`, // Add authentication token
//         },
//       });

//       const data = await response.json();

//       if (data.status === "success") {
//         showAlertMessage(
//           data.message || "Free trial activated successfully!",
//           "success"
//         );
//         navigate("/user/MyDashBoad"); // Redirect to dashboard
//       } else {
//         showAlertMessage(
//           data.message || "Failed to activate free trial",
//           "destructive"
//         );
//       }
//     } catch (err) {
//       showAlertMessage(
//         "An error occurred while activating the free trial.",
//         "destructive"
//       );
//     }
//   };

//   // Loading State
//   if (loading) {
//     return <LoaddingSpinner />;
//   }

//   // Error State
//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p className="text-red-500">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* Hero Section */}
//       <div className="bg-[#0d2042] py-24 px-4 shadow-sm">
//         <div className="max-w-6xl mx-auto text-center">
//           <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
//             Choose from any of our listing Packages that suit your business
//             needs
//           </h1>
//           <p className="text-lg text-blue-100 mb-4">
//             Select a package to get your business listed on our marketing page.
//           </p>
//           <p className="text-sm text-blue-200">
//             Your business visibility is enhanced based on your chosen package
//           </p>
//         </div>
//       </div>

//       {/* Packages Grid */}
//       <div className="max-w-7xl mx-auto px-6 py-12">
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
//           {packages.map((pkg) => {
//             const isTrial = pkg.id === 7; // Identify the trial plan by id: 7

//             return (
//               <div
//                 key={pkg.id}
//                 className={`bg-white rounded-lg p-6 shadow-md hover:shadow-2xl transition-all border border-gray-200 hover:border-red-500 transform hover:scale-105 ${
//                   isTrial ? "opacity-100" : ""
//                 }`}>
//                 <h3 className="text-2xl font-semibold text-gray-900 mb-3 first-letter:uppercase">
//                   {pkg.name}
//                 </h3>

//                 <p className="text-gray-600 text-sm min-h-[50px] mb-4">
//                   {pkg.description}
//                 </p>

//                 <div className="space-y-3">
//                   <p className="text-gray-800 text-lg font-bold">
//                     Price:{" "}
//                     <span className="text-red-500 text-2xl">
//                       ₦{parseFloat(pkg.price).toLocaleString()}
//                     </span>
//                   </p>
//                   <p className="text-gray-700">
//                     <span className="font-semibold">Validity:</span>{" "}
//                     {pkg.duration_days} days
//                   </p>
//                 </div>

//                 <button
//                   onClick={() =>
//                     isTrial ? handleActivateFreePlan() : handleUpgrade(pkg)
//                   }
//                   className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white py-2 rounded-md font-semibold text-lg transition-all duration-300 transform hover:scale-105"
//                   disabled={loading}>
//                   {isTrial ? "Activate Trial" : "Upgrade Now"}
//                 </button>
//               </div>
//             );
//           })}
//         </div>
//       </div>

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
//       {showLoginModal && (
//         <LoginModal onClose={() => setShowLoginModal(false)} />
//       )}
//     </div>
//   );
// };

// export default PackagesPage;
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoaddingSpinner from "../../components/tools/LoaddingSpinner";
import backendURL from "../../config";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import LoginModal from "../../components/tools/LoginModal";
const FrontendUrl = import.meta.env.VITE_FRONTEND_URL;

const PackagesPage = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [upgradeLoading, setUpgradeLoading] = useState({}); // Track loading state for each package

  const navigate = useNavigate();
  const { userInfo, token } = useSelector((state) => state.auth);

  const showAlertMessage = (message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
  };

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch(
          "https://edirectbackend.essential.com.ng/api/subscriptions/price/list"
        );
        const data = await response.json();

        if (data.status === "success") {
          setPackages(data.data);
        } else {
          setError("Failed to fetch subscription plans.");
          showAlertMessage(
            "Failed to fetch subscription plans.",
            "destructive"
          );
        }
      } catch (err) {
        setError("An error occurred while fetching plans. Please try again.");
        showAlertMessage(
          "An error occurred while fetching plans.",
          "destructive"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handleUpgrade = async (plan) => {
    if (!userInfo) {
      setShowLoginModal(true);
      return;
    }

    setUpgradeLoading((prev) => ({ ...prev, [plan.id]: true }));
    try {
      const response = await fetch(`${backendURL}/api/subscription/initiate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          plan_type: plan.name,
          email: userInfo.email,
          callback_url: `${FrontendUrl}/callback`,
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        localStorage.setItem(
          "subscriptionPaymentDetails",
          JSON.stringify({
            reference: data.data.reference,
            subscription_id: data.data.subscription_id,
          })
        );
        window.location.href = data.data.authorization_url;
      } else {
        showAlertMessage(
          data.message || "Failed to initiate payment.",
          "destructive"
        );
      }
    } catch (err) {
      showAlertMessage(
        "An error occurred while initiating payment.",
        "destructive"
      );
    } finally {
      setUpgradeLoading((prev) => ({ ...prev, [plan.id]: false }));
    }
  };

  const handleActivateFreePlan = async () => {
    if (!userInfo) {
      setShowLoginModal(true);
      return;
    }

    setUpgradeLoading((prev) => ({ ...prev, 7: true }));
    try {
      const response = await fetch(`${backendURL}/api/activate/default/plan`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.status === "success") {
        showAlertMessage(
          data.message || "Free trial activated successfully!",
          "success"
        );
        navigate("/user/MyDashBoad");
      } else {
        showAlertMessage(
          data.message || "Failed to activate free trial",
          "destructive"
        );
      }
    } catch (err) {
      showAlertMessage(
        "An error occurred while activating the free trial.",
        "destructive"
      );
    } finally {
      setUpgradeLoading((prev) => ({ ...prev, 7: false }));
    }
  };

  if (loading) {
    return <LoaddingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-[#0d2042] py-24 px-4 shadow-sm">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Choose from any of our listing Packages that suit your business
            needs
          </h1>
          <p className="text-lg text-blue-100 mb-4">
            Select a package to get your business listed on our marketing page.
          </p>
          <p className="text-sm text-blue-200">
            Your business visibility is enhanced based on your chosen package
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {packages.map((pkg) => {
            const isTrial = pkg.id === 7;
            const isButtonLoading = upgradeLoading[pkg.id] || false;

            return (
              <div
                key={pkg.id}
                className={`bg-white rounded-lg p-6 shadow-md hover:shadow-2xl transition-all border border-gray-200 hover:border-red-500 transform hover:scale-105 ${
                  isTrial ? "opacity-100" : ""
                }`}>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3 first-letter:uppercase">
                  {pkg.name}
                </h3>
                <p className="text-gray-600 text-sm min-h-[50px] mb-4">
                  {pkg.description}
                </p>
                <div className="space-y-3">
                  <p className="text-gray-800 text-lg font-bold">
                    Price:{" "}
                    <span className="text-red-500 text-2xl">
                      ₦{parseFloat(pkg.price).toLocaleString()}
                    </span>
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Validity:</span>{" "}
                    {pkg.duration_days} days
                  </p>
                </div>
                <button
                  onClick={() =>
                    isTrial ? handleActivateFreePlan() : handleUpgrade(pkg)
                  }
                  className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white py-2 rounded-md font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isButtonLoading}>
                  {isButtonLoading ? (
                    <span className="flex items-center justify-center">
                      Subscribing...
                    </span>
                  ) : isTrial ? (
                    "Activate Trial"
                  ) : (
                    "Upgrade Now"
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

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
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </div>
  );
};

export default PackagesPage;

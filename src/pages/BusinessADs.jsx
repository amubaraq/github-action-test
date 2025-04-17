import React, { useState, useCallback, useEffect, useMemo } from "react";
import backendURL from "../config";
import { Alert, AlertDescription } from "../components/tools/Alert";
import { DollarSign, Info, CheckCircle } from "lucide-react";
import LoginModal from "../components/tools/LoginModal";
import { useDispatch, useSelector } from "react-redux";

const BusinessADs = () => {
  const { token } = useSelector((state) => state.auth);
  const [selectedAdTypes, setSelectedAdTypes] = useState([]);
  const [selectedDuration, setSelectedDuration] = useState("");
  const [previewCost, setPreviewCost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });
  const { userInfo } = useSelector((state) => state.auth);

  // New handler for Start Advertising button
  const handleStartAdvertising = useCallback(() => {
    if (!userInfo) {
      setShowLoginModal(true); // Show login modal if no userInfo
    } else {
      window.location.href = "/user/topListing"; // Navigate if logged in
    }
  }, [userInfo]);

  const showAlertMessage = useCallback((message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  }, []);

  // Fetch preview cost
  const fetchPreviewCost = useCallback(async () => {
    if (selectedAdTypes.length === 0 || !selectedDuration) {
      setPreviewCost(null);
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${backendURL}/api/ads/preview`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ad_types: selectedAdTypes,
          duration: parseInt(selectedDuration),
        }),
      });
      if (!response.ok) throw new Error("Failed to preview ad cost");
      const data = await response.json();
      if (data.status === "success") {
        setPreviewCost(data.data);
      } else {
        throw new Error(data.message || "Failed to preview cost");
      }
    } catch (error) {
      showAlertMessage(error.message, "destructive");
      setPreviewCost(null);
    } finally {
      setLoading(false);
    }
  }, [selectedAdTypes, selectedDuration, token, showAlertMessage]);

  useEffect(() => {
    fetchPreviewCost();
  }, [fetchPreviewCost]);

  const handleAdTypeChange = (adType) => {
    setSelectedAdTypes((prev) =>
      prev.includes(adType)
        ? prev.filter((type) => type !== adType)
        : [...prev, adType]
    );
  };

  const adTypesOptions = [
    {
      value: "front_page",
      label: "Front Page",
      description: "Appear on our homepage for maximum visibility!",
    },
    {
      value: "location",
      label: "Location",
      description: "Show up in location-based searches near your business.",
    },
    {
      value: "featured",
      label: "Featured",
      description: "Get highlighted as a top pick in your category.",
    },
    {
      value: "search",
      label: "Search",
      description: "Boost your rank in search results.",
    },
  ];

  const durationOptions = [
    { value: "15", label: "15 Days" },
    { value: "30", label: "30 Days" },
    { value: "90", label: "90 Days" },
    { value: "180", label: "180 Days" },
    { value: "365", label: "365 Days" },
  ];

  const previewDisplay = useMemo(() => {
    if (!previewCost) return null;
    return (
      <div className="mt-6 p-4 bg-white rounded-lg shadow-md border border-blue-100">
        <h3 className="text-lg font-semibold text-blue-700 mb-2">
          Your Ad Cost Preview
        </h3>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex justify-between">
            <span className="font-medium">Ad Types:</span>
            <span className="text-blue-600 capitalize">
              {previewCost.ad_types.join(", ").replace("_", " ")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Duration:</span>
            <span>{previewCost.duration} Days</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Total Cost:</span>
            <span className="text-blue-600 font-semibold">
              ₦{previewCost.total_amount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    );
  }, [previewCost]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-3 md:p-5">
      <main className="flex-1 bg-white shadow-md rounded-lg p-2 md:p-5">
        {/* Header Section */}
        <div className="mb-8 rounded-xl bg-gradient-to-r from-blue-50 via-white to-blue-50 shadow-lg p-6 text-center">
          <h1 className="text-3xl font-bold text-blue-800 mb-4">
            Grow Easy with Our Ads
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Want more customers to find your business? Our ads make it simple!
            Choose where your ad shows up and how long it runs. It’s affordable,
            flexible, and designed to help you shine—no complicated stuff!
          </p>
        </div>

        {/* How It Works Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-4 shadow-md border border-blue-100">
              <CheckCircle className="h-8 w-8 text-blue-600 mb-2 mx-auto" />
              <h3 className="text-lg font-semibold text-blue-700 mb-2">
                Pick Your Ad
              </h3>
              <p className="text-sm text-gray-600">
                Choose from options like Front Page or Search to decide where
                people see your business.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md border border-blue-100">
              <CheckCircle className="h-8 w-8 text-blue-600 mb-2 mx-auto" />
              <h3 className="text-lg font-semibold text-blue-700 mb-2">
                Set Your Time
              </h3>
              <p className="text-sm text-gray-600">
                Decide how long your ad runs—15 days or up to a full year.
                You’re in control!
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-md border border-blue-100">
              <CheckCircle className="h-8 w-8 text-blue-600 mb-2 mx-auto" />
              <h3 className="text-lg font-semibold text-blue-700 mb-2">
                See the Cost
              </h3>
              <p className="text-sm text-gray-600">
                Preview your total cost instantly. No surprises—just clear,
                upfront pricing!
              </p>
            </div>
          </div>
        </section>

        {/* Ad Preview Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Try It Out: Preview Your Ad
          </h2>
          <div className="bg-gradient-to-r from-blue-50 via-white to-blue-50 rounded-xl p-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Ad Types Selection */}
              <div>
                <h3 className="text-lg font-semibold text-blue-700 mb-4">
                  Choose Your Ad Types
                </h3>
                <div className="space-y-3">
                  {adTypesOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-start gap-3 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        value={option.value}
                        checked={selectedAdTypes.includes(option.value)}
                        onChange={() => handleAdTypeChange(option.value)}
                        className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                      />
                      <div>
                        <span className="font-medium text-gray-700">
                          {option.label}
                        </span>
                        <p className="text-gray-500 text-xs">
                          {option.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Duration Selection */}
              <div>
                <h3 className="text-lg font-semibold text-blue-700 mb-4">
                  Pick a Duration
                </h3>
                <select
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                  className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 border-gray-200">
                  <option value="">Select Duration</option>
                  {durationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Cost Preview */}
            <div className="mt-6">
              {loading ? (
                <p className="text-center text-gray-600">Calculating cost...</p>
              ) : (
                previewDisplay
              )}
              {!loading &&
                selectedAdTypes.length > 0 &&
                selectedDuration &&
                !previewCost && (
                  <p className="text-center text-red-600">
                    Unable to preview cost. Please try again.
                  </p>
                )}
            </div>
          </div>
        </section>

        {/* Updated Call to Action  */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Ready to get started? Create your ad campaign now!
          </p>
          <button
            onClick={handleStartAdvertising}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors inline-flex items-center">
            Start Advertising <DollarSign size={16} className="ml-2" />
          </button>
        </div>

        {/* Login Modal */}
        {showLoginModal && (
          <LoginModal onClose={() => setShowLoginModal(false)} />
        )}

        {/* Alert */}
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
      </main>
    </div>
  );
};

export default BusinessADs;

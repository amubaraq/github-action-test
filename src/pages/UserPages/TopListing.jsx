import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import backendURL from "../../config";
import { Send, Clock, X, RefreshCw } from "lucide-react";
const TopListing = () => {
  const { userInfo, token } = useSelector((state) => state.auth);
  const [formStatus, setFormStatus] = useState({
    loading: false,
    error: null,
    success: null,
  });
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [businessBranches, setBusinessBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pricingData, setPricingData] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const showAlertMessage = useCallback((message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  }, []);

  const validate = (values) => {
    const errors = {};
    if (!values.business_slug)
      errors.business_slug = "Please select a business";
    if (!values.ad_types || values.ad_types.length === 0)
      errors.ad_types = "At least one ad type is required";
    if (!values.duration) errors.duration = "Duration is required";
    if (!values.email) errors.email = "Email is required";
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email))
      errors.email = "Invalid email address";
    return errors;
  };

  const initiatePayment = useCallback(
    async (values) => {
      try {
        setFormStatus({ loading: true, error: null, success: null });
        const response = await fetch(`${backendURL}/api/ads/payment/initiate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ad_types: values.ad_types,
            duration: values.duration,
            email: values.email,
            business_slug: values.business_slug,
            branch_slug: values.branch_slug || null,
          }),
        });
        const result = await response.json();
        if (result.status !== "success")
          throw new Error(result.message || "Payment initiation failed");
        setFormStatus({ loading: false, error: null, success: true });
        showAlertMessage("Payment initiated successfully!", "success");
        localStorage.setItem(
          "paymentDetails",
          JSON.stringify({
            business_slug: values.business_slug,
            branch_slug: values.branch_slug || null,
            reference: result.data.reference,
          })
        );
        window.location.href = result.data.authorization_url;
      } catch (error) {
        setFormStatus({ loading: false, error: error.message, success: null });
        showAlertMessage(error.message, "destructive");
      }
    },
    [token, showAlertMessage]
  );

  const formik = useFormik({
    initialValues: {
      business_slug: "",
      branch_slug: "",
      ad_types: [],
      duration: "",
      email: userInfo?.email || "",
    },
    validate,
    onSubmit: initiatePayment,
  });

  // New function to renew ad
  const renewAd = useCallback(async () => {
    if (!paymentDetails?.business_slug) {
      showAlertMessage("No business slug available for renewal", "destructive");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${backendURL}/ads/renew`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          business_slug: paymentDetails.business_slug,
          branch_slug: formik.values.branch_slug || null,
        }),
      });
      const result = await response.json();
      if (result.status !== "success") {
        throw new Error(result.message || "Failed to initiate renewal payment");
      }
      setShowModal(false); // Close modal on success
      showAlertMessage("Renewal payment initiated successfully!", "success");
      window.location.href = result.data.authorization_url;
    } catch (error) {
      showAlertMessage(error.message, "destructive");
    } finally {
      setLoading(false);
    }
  }, [paymentDetails, formik.values.branch_slug, token, showAlertMessage]);

  const fetchPricing = useCallback(async () => {
    try {
      const response = await fetch(`${backendURL}/api/ads/pricing`);
      if (!response.ok) throw new Error("Failed to fetch pricing data");
      const data = await response.json();
      setPricingData(data.data);
    } catch (error) {
      showAlertMessage(error.message, "destructive");
    }
  }, [showAlertMessage]);

  const fetchBusinesses = useCallback(async () => {
    try {
      if (!userInfo?.slug) throw new Error("User slug not available");
      setLoading(true);
      const userResponse = await fetch(
        `${backendURL}/api/user/${userInfo.slug}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!userResponse.ok) throw new Error("Failed to fetch user data");
      const userData = await userResponse.json();
      const contactSlug = userData?.data?.user?.contact?.slug;

      const response = await fetch(`${backendURL}/api/profile/${contactSlug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch business profile");
      const data = await response.json();
      setBusinesses(data.businesses || []);
    } catch (error) {
      showAlertMessage(error.message, "destructive");
    } finally {
      setLoading(false);
    }
  }, [token, userInfo?.slug, showAlertMessage]);

  const fetchBusinessBranches = useCallback(async () => {
    if (!selectedBusiness?.slug) {
      setBusinessBranches([]);
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(
        `${backendURL}/api/business/${selectedBusiness.slug}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch business branches");
      const data = await response.json();
      setBusinessBranches(data.branches || []);
    } catch (error) {
      showAlertMessage(error.message, "destructive");
    } finally {
      setLoading(false);
    }
  }, [selectedBusiness, token, showAlertMessage]);

  const GetBusinessAdStatus = useCallback(async () => {
    if (!selectedBusiness?.slug) {
      showAlertMessage("Please select a business first", "destructive");
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(
        `${backendURL}/api/ads/business/${selectedBusiness.slug}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok)
        throw new Error("Failed to fetch business payment details");
      const data = await response.json();
      if (data.status === "success") {
        setPaymentDetails(data.data);
        setShowModal(true);
      } else {
        showAlertMessage(
          data.message || "No payment details found",
          "destructive"
        );
      }
    } catch (error) {
      showAlertMessage(error.message, "destructive");
    } finally {
      setLoading(false);
    }
  }, [selectedBusiness, token, showAlertMessage]);

  useEffect(() => {
    fetchPricing();
    fetchBusinesses();
  }, [fetchPricing, fetchBusinesses]);

  useEffect(() => {
    fetchBusinessBranches();
  }, [fetchBusinessBranches]);

  const handleBusinessChange = (businessSlug) => {
    const selected = businesses.find(
      (business) => business.slug === businessSlug
    );
    setSelectedBusiness(selected);
    formik.setFieldValue("business_slug", selected?.slug || "");
    formik.setFieldValue("branch_slug", "");
  };

  const pricingDisplay = useMemo(() => {
    if (!pricingData) return null;
    const { ad_types, discounts } = pricingData;
    return (
      <div className="mb-8 rounded-xl bg-gradient-to-r from-blue-50 via-white to-blue-50 shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">
          Ad Pricing & Discounts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg p-4 shadow-md border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-700 mb-4 border-b border-blue-200 pb-2">
              Ad Types Pricing
            </h3>
            <ul className="space-y-3 text-sm">
              {Object.entries(ad_types).map(([type, price]) => (
                <li
                  key={type}
                  className="flex justify-between items-center text-gray-700 hover:bg-blue-50 p-2 rounded-md transition-colors">
                  <span className="font-medium capitalize">
                    {type.replace("_", " ")}
                  </span>
                  <span className="text-blue-600 font-semibold">
                    ₦{price.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md border border-green-100">
            <h3 className="text-lg font-semibold text-green-700 mb-4 border-b border-green-200 pb-2">
              Duration Discounts
            </h3>
            <ul className="space-y-3 text-sm">
              {Object.entries(discounts).map(([days, discount]) => {
                const discountPercent =
                  discount < 1 ? ((1 - discount) * 100).toFixed(1) : 0;
                return (
                  <li
                    key={days}
                    className="flex justify-between items-center text-gray-700 hover:bg-green-50 p-2 rounded-md transition-colors">
                    <span className="font-medium">{days} Days</span>
                    <span
                      className={`font-semibold ${discountPercent > 0 ? "text-green-600" : "text-gray-500"}`}>
                      {discountPercent > 0
                        ? `${discountPercent}% OFF`
                        : "No Discount"}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }, [pricingData]);

  const renderInput = (name, label, type = "text", props = {}) => (
    <div className="group">
      <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800">
        {label} {props.required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 ${
          formik.touched[name] && formik.errors[name]
            ? "border-red-400"
            : "border-gray-200"
        }`}
        {...props}
      />
      {formik.touched[name] && formik.errors[name] && (
        <p className="mt-1 text-xs text-red-500">{formik.errors[name]}</p>
      )}
    </div>
  );

  const renderSelect = (name, label, options, props = {}) => (
    <div className="group">
      <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800">
        {label} {props.required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={formik.values[name]}
        onChange={props.onChange || formik.handleChange}
        onBlur={formik.handleBlur}
        className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 ${
          formik.touched[name] && formik.errors[name]
            ? "border-red-400"
            : "border-gray-200"
        }`}
        {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {formik.touched[name] && formik.errors[name] && (
        <p className="mt-1 text-xs text-red-500">{formik.errors[name]}</p>
      )}
    </div>
  );

  const renderCheckboxGroup = (name, label, options) => (
    <div className="group">
      <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <label key={option.value} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name={name}
              value={option.value}
              checked={formik.values[name].includes(option.value)}
              onChange={(e) => {
                const newValue = [...formik.values[name]];
                if (e.target.checked) newValue.push(option.value);
                else newValue.splice(newValue.indexOf(option.value), 1);
                formik.setFieldValue(name, newValue);
              }}
              onBlur={formik.handleBlur}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            {option.label}
          </label>
        ))}
      </div>
      {formik.touched[name] && formik.errors[name] && (
        <p className="mt-1 text-xs text-red-500">{formik.errors[name]}</p>
      )}
    </div>
  );

  const paymentDetailsModal = useMemo(() => {
    if (!paymentDetails) return null;
    const {
      business_slug,
      ads_type,
      payment_status,
      ads_duration,
      ads_amount,
      ads_expiry_date,
    } = paymentDetails;
    const expiryDate = new Date(ads_expiry_date);
    const currentDate = new Date("2025-03-24"); // Hardcoded for March 24, 2025, as per system instructions
    const isExpired = expiryDate < currentDate;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 transform transition-all duration-300 scale-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Ad Payment Details
            </h2>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          <div className="space-y-4 text-sm text-gray-700">
            <div className="flex justify-between">
              <span className="font-medium">Business:</span>
              <span className="text-blue-600">{business_slug}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Ad Types:</span>
              <span className="text-blue-600 capitalize">
                {ads_type.join(", ").replace("_", " ")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Payment Status:</span>
              <span
                className={`font-semibold ${payment_status === "paid" ? "text-green-600" : "text-red-600"}`}>
                {payment_status.toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Duration:</span>
              <span>{ads_duration} Days</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Amount:</span>
              <span className="text-blue-600">
                ₦{parseFloat(ads_amount).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Expiry Date:</span>
              <span
                className={`${isExpired ? "text-red-600" : "text-gray-700"}`}>
                {expiryDate.toLocaleDateString()}
              </span>
            </div>
            {isExpired && (
              <div className="text-center py-2 bg-red-50 rounded-md">
                <p className="text-red-600 font-semibold">
                  This ad has expired!
                </p>
              </div>
            )}
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            {isExpired && (
              <button
                onClick={renewAd}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center">
                {loading ? "Renewing..." : "Renew Ad"}
                {!loading && <RefreshCw size={16} className="ml-2" />}
              </button>
            )}
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }, [paymentDetails, renewAd, loading]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-3 md:p-5 mid:mt-20">
      <main className="flex-1 bg-white shadow-md rounded-lg p-2 md:p-5">
        <h1 className="text-xl font-bold text-gray-800 mb-5">
          Create Ad Campaign
        </h1>
        {pricingData ? (
          pricingDisplay
        ) : (
          <p className="text-gray-600 mb-6">Loading pricing information...</p>
        )}
        {formStatus.error ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-red-200">
            <h2 className="text-lg font-bold text-red-600">Error</h2>
            <p className="text-sm text-gray-600 mt-2">{formStatus.error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              Retry
            </button>
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            {renderSelect(
              "business_slug",
              "Select Business",
              [
                { value: "", label: "Select a Business" },
                ...businesses.map((business) => ({
                  value: business.slug,
                  label: business.business_name || "Unnamed Business",
                })),
              ],
              {
                required: true,
                onChange: (e) => handleBusinessChange(e.target.value),
              }
            )}
            {businessBranches.length > 0 &&
              renderSelect("branch_slug", "Select Branch (Optional)", [
                { value: "", label: "No Branch" },
                ...businessBranches.map((branch) => ({
                  value: branch.slug,
                  label: branch.branch_name || "Unnamed Branch",
                })),
              ])}
            {renderCheckboxGroup("ad_types", "Ad Types", [
              { value: "front_page", label: "Front Page" },
              { value: "location", label: "Location" },
              { value: "featured", label: "Featured" },
              { value: "search", label: "Search" },
            ])}
            {renderSelect(
              "duration",
              "Duration",
              [
                { value: "", label: "Select Duration" },
                { value: "15", label: "15 Days" },
                { value: "30", label: "30 Days" },
                { value: "90", label: "90 Days" },
                { value: "180", label: "180 Days" },
                { value: "365", label: "365 Days" },
              ],
              { required: true }
            )}
            {renderInput("email", "Email", "email", {
              required: true,
              placeholder: "Enter your email",
            })}
            <div className="mt-6 flex justify-end space-x-4">
              <button
                type="button"
                onClick={GetBusinessAdStatus}
                disabled={loading || !selectedBusiness}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 flex items-center">
                {loading ? "Checking..." : "Check Ad Status"}
                {!loading && <Clock size={16} className="ml-2" />}
              </button>
              <button
                type="submit"
                disabled={formStatus.loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center">
                {formStatus.loading
                  ? "Initiating Payment..."
                  : "Proceed to Payment"}
                {!formStatus.loading && <Send size={16} className="ml-2" />}
              </button>
            </div>
          </form>
        )}
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
        {showModal && paymentDetailsModal}
      </main>
    </div>
  );
};

export default TopListing;

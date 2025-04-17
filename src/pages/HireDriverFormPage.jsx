import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  MapPin,
  Car,
  Shield,
  Calendar,
  Phone,
  Mail,
  ChevronLeft,
} from "lucide-react";
import { Alert, AlertDescription } from "../components/tools/Alert";
import backendURL from "../config";

const HireDriverFormPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service_type: "one_time",
    pickup_location: "",
    destination: "",
    preferred_date: "",
    preferred_time: "",
    interstate: false,
    permanent: false,
    accommodation: "",
    communication_options: [],
    end_date: "",
    days_of_week: [],
    service_duration: "",
    duration_unit: "days",
    vehicle_type: "",
    passengers_count: "",
    payment_method: "credit_card",
    budget: "",
    additional_requests: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });

  const showAlertMessage = (message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name === "communication_options") {
      setFormData((prev) => ({
        ...prev,
        communication_options: checked
          ? [...prev.communication_options, value]
          : prev.communication_options.filter((opt) => opt !== value),
      }));
    } else if (type === "checkbox" && name === "days_of_week") {
      setFormData((prev) => ({
        ...prev,
        days_of_week: checked
          ? [...prev.days_of_week, value]
          : prev.days_of_week.filter((day) => day !== value),
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${backendURL}/api/create/driver/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(response, "response");
      if (!response.ok) {
        throw new Error(data.message || "Failed to submit request");
      }
      showAlertMessage("Request Form Submitted successfully", "success");
      setSuccess(data.message);
      setFormData({
        name: "",
        email: "",
        phone: "",
        service_type: "one_time",
        pickup_location: "",
        destination: "",
        preferred_date: "",
        preferred_time: "",
        interstate: false,
        permanent: false,
        accommodation: "",
        communication_options: [],
        end_date: "",
        days_of_week: [],
        service_duration: "",
        duration_unit: "days",
        vehicle_type: "",
        passengers_count: "",
        payment_method: "credit_card",
        budget: "",
        additional_requests: "",
      });
    } catch (err) {
      showAlertMessage(
        "Failed to submit form. Please try again.",
        "destructive"
      );
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Banner Section */}
      <div className="relative bg-gradient-to-r from-blue-900 to-blue-500 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
          {/* Narrative */}
          <div className="md:w-1/2 text-center md:text-left text-white space-y-6">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-white hover:text-yellow-300 mb-4">
              <ChevronLeft size={20} className="mr-1" /> Back
            </button>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Hire a Driver with Ease
            </h1>
            <p className="text-lg mb-6 max-w-md">
              Need a professional driver? Whether it’s for an emergency, a
              special occasion, or daily commute, we’ve got you covered.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <Clock className="mr-2 text-yellow-300" size={20} />
                <span>Flexible Booking</span>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-2 text-green-300" size={20} />
                <span>Any Location</span>
              </div>
              <div className="flex items-center">
                <Car className="mr-2 text-red-300" size={20} />
                <span>Verified Drivers</span>
              </div>
              <div className="flex items-center">
                <Shield className="mr-2 text-purple-300" size={20} />
                <span>100% Safety</span>
              </div>
            </div>
          </div>
          {/* Image */}
          <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
              alt="Happy driver with client"
              className="w-full max-w-xs sm:max-w-sm md:max-w-md rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">
          Request a Driver
        </h2>
        {success && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow-lg">
          {/* Basic Info */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="johndoe@example.com"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+1234567890"
            />
          </div>

          {/* Service Type */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Service Type <span className="text-red-500">*</span>
            </label>
            <select
              name="service_type"
              value={formData.service_type}
              onChange={handleInputChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="one_time">One-Time</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {/* Locations */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Pickup Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="pickup_location"
              value={formData.pickup_location}
              onChange={handleInputChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="123 Main St, City"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Destination <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="destination"
              value={formData.destination}
              onChange={handleInputChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="456 Other St, City"
            />
          </div>

          {/* Date & Time */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Preferred Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="preferred_date"
              value={formData.preferred_date}
              onChange={handleInputChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Preferred Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              name="preferred_time"
              value={formData.preferred_time}
              onChange={handleInputChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Checkboxes */}
          <div className="flex gap-6">
            <label className="flex items-center text-gray-700">
              <input
                type="checkbox"
                name="interstate"
                checked={formData.interstate}
                onChange={handleInputChange}
                className="mr-2"
              />
              Interstate
            </label>
            <label className="flex items-center text-gray-700">
              <input
                type="checkbox"
                name="permanent"
                checked={formData.permanent}
                onChange={handleInputChange}
                className="mr-2"
              />
              Permanent
            </label>
          </div>

          {/* Conditional Fields */}
          {(formData.service_type === "weekly" ||
            formData.service_type === "custom") && (
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Days of Week
              </label>
              <div className="flex flex-wrap gap-4">
                {[
                  "monday",
                  "tuesday",
                  "wednesday",
                  "thursday",
                  "friday",
                  "saturday",
                  "sunday",
                ].map((day) => (
                  <label key={day} className="flex items-center">
                    <input
                      type="checkbox"
                      name="days_of_week"
                      value={day}
                      checked={formData.days_of_week.includes(day)}
                      onChange={handleInputChange}
                      className="mr-1"
                    />
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </label>
                ))}
              </div>
            </div>
          )}

          {(formData.service_type === "monthly" ||
            formData.service_type === "custom") && (
            <>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Service Duration
                </label>
                <input
                  type="number"
                  name="service_duration"
                  value={formData.service_duration}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 3"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">
                  Duration Unit
                </label>
                <select
                  name="duration_unit"
                  value={formData.duration_unit}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </>
          )}

          {(formData.service_type !== "one_time" || formData.permanent) && (
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                End Date
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Additional Options */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Vehicle Type
            </label>
            <select
              name="vehicle_type"
              value={formData.vehicle_type}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select (Optional)</option>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="van">Van</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Passengers Count
            </label>
            <input
              type="number"
              name="passengers_count"
              value={formData.passengers_count}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 4"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Accommodation (if needed)
            </label>
            <input
              type="text"
              name="accommodation"
              value={formData.accommodation}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Hotel near destination"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Communication Options
            </label>
            <div className="flex gap-4">
              {["email", "phone", "sms"].map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="checkbox"
                    name="communication_options"
                    value={option}
                    checked={formData.communication_options.includes(option)}
                    onChange={handleInputChange}
                    className="mr-1"
                  />
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Payment Method
            </label>
            <select
              name="payment_method"
              value={formData.payment_method}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="credit_card">Credit Card</option>
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Budget ($)
            </label>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 1000"
            />
          </div>

          {/* Additional Requests */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-semibold mb-1">
              Additional Requests
            </label>
            <textarea
              name="additional_requests"
              value={formData.additional_requests}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="e.g., Prefer a non-smoking vehicle"
            />
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className={`px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition-all duration-300 ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
              }`}>
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
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
    </div>
  );
};

export default HireDriverFormPage;

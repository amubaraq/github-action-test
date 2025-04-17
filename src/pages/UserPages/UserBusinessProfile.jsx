import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Save,
  Menu,
  X,
  AlertTriangle,
} from "lucide-react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import { useDispatch, useSelector } from "react-redux";
import statesAndLGAs from "../../assets/json/statesAndLGAs.json";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import backendURL from "../../config";
import { useNavigate, useParams } from "react-router-dom";
import CategoryFetcher from "../../components/tools/CategoryFetcher";
import LoadingSpinner2 from "../../components/tools/loadingSpinner2";
import { Navigate } from "react-router-dom";

const BACKEND_URL = backendURL;

const ProgressRing = ({ progress, size = 100, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center group">
      <svg height={size} width={size} className="transform -rotate-90">
        <circle
          r={radius}
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        <circle
          r={radius}
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          stroke="#3b82f6"
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500 ease-in-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold text-blue-600 group-hover:text-blue-700 transition-colors">
          {Math.round(progress)}%
        </span>
        <span className="text-xs text-gray-500">Complete</span>
      </div>
    </div>
  );
};

const LoadingSpinner = () => <LoadingSpinner2 />;

// Business Info Section
const BusinessInfo = ({ formik, categories = [] }) => {
  return (
    <section className="space-y-5">
      <h2 className="text-lg font-semibold text-gray-800">
        Business Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[
          {
            name: "business_name",
            label: "Business Name",
            required: true,
            placeholder: "e.g., John's Agricultural Services",
          },
          {
            name: "business_line",
            label: "Business Type",
            required: true,
            placeholder: "e.g., Crops and Harvesting",
          },
          {
            name: "category_slug",
            label: "Business Category",
            required: true,
            type: "select",
            options:
              categories.length > 0
                ? ["", ...categories.map((cat) => cat.slug)]
                : ["", "Loading..."],
            optionLabels:
              categories.length > 0
                ? ["Select Category", ...categories.map((cat) => cat.name)]
                : ["Select Category", "Loading..."],
          },
          {
            name: "date_of_establishment",
            label:
              "Date Established (choose the nearest remembered month/year)",
            type: "date",
            required: true,
            placeholder: "YYYY-MM-DD",
          },
          {
            name: "number_of_staff",
            label: "Number of Staff",
            type: "number",
            min: 0,
            placeholder: "e.g., 10",
          },
          {
            name: "property_status",
            label: "Property Status",
            type: "select",
            options: ["", "rented", "owned"],
            optionLabels: ["Select Status", "Rented", "Owned"],
          },
          {
            name: "business_reg_number",
            label: "Registration Number",
            placeholder: "e.g., BR123456",
          },
        ].map((field) => (
          <div key={field.name} className="group">
            <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            {field.type === "select" ? (
              <select
                name={field.name}
                value={formik.values[field.name] || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 ${formik.touched[field.name] && formik.errors[field.name] ? "border-red-400" : "border-gray-200"}`}>
                {field.options.map((option, idx) => (
                  <option key={option} value={option}>
                    {field.optionLabels[idx]}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type || "text"}
                name={field.name}
                value={formik.values[field.name] || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                min={field.min}
                placeholder={field.placeholder}
                className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 ${formik.touched[field.name] && formik.errors[field.name] ? "border-red-400" : "border-gray-200"}`}
                required={field.required}
              />
            )}
            {formik.touched[field.name] && formik.errors[field.name] && (
              <p className="mt-1 text-xs text-red-500">
                {formik.errors[field.name]}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

// Updated Contact Details Section (Removed Net Worth)
const ContactDetails = ({ formik }) => {
  const states = statesAndLGAs.statesAndLGAs.map((state) => ({
    id: state.id,
    name: state.name,
  }));
  const selectedState = statesAndLGAs.statesAndLGAs.find(
    (state) => state.name === formik.values.state
  );
  const lgas = selectedState ? selectedState.local_governments : [];

  return (
    <section className="space-y-5">
      <h2 className="text-lg font-semibold text-gray-800">Contact Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="group">
          <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
            Business Address <span className="text-red-500">*</span>
          </label>
          <textarea
            name="business_address"
            value={formik.values.business_address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 ${formik.touched.business_address && formik.errors.business_address ? "border-red-400" : "border-gray-200"}`}
            rows="3"
            required
          />
          {formik.touched.business_address &&
            formik.errors.business_address && (
              <p className="mt-1 text-xs text-red-500">
                {formik.errors.business_address}
              </p>
            )}
        </div>
        <div className="group">
          <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
            State <span className="text-red-500">*</span>
          </label>
          <select
            name="state"
            value={formik.values.state}
            onChange={(e) => {
              formik.handleChange(e);
              formik.setFieldValue("city", "");
            }}
            onBlur={formik.handleBlur}
            className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 ${formik.touched.state && formik.errors.state ? "border-red-400" : "border-gray-200"}`}>
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state.id} value={state.name}>
                {state.name}
              </option>
            ))}
          </select>
          {formik.touched.state && formik.errors.state && (
            <p className="mt-1 text-xs text-red-500">{formik.errors.state}</p>
          )}
        </div>
        <div className="group">
          <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
            City (LGA) <span className="text-red-500">*</span>
          </label>
          <select
            name="city"
            value={formik.values.city}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 ${formik.touched.city && formik.errors.city ? "border-red-400" : "border-gray-200"}`}
            disabled={!formik.values.state}>
            <option value="">Select City</option>
            {lgas.map((lga) => (
              <option key={lga.id} value={lga.name}>
                {lga.name}
              </option>
            ))}
          </select>
          {formik.touched.city && formik.errors.city && (
            <p className="mt-1 text-xs text-red-500">{formik.errors.city}</p>
          )}
        </div>
        <div className="group">
          <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
            Area (e.g Ikeja, Lekki) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="area"
            value={formik.values.area || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 ${formik.touched.area && formik.errors.area ? "border-red-400" : "border-gray-200"}`}
          />
          {formik.touched.area && formik.errors.area && (
            <p className="mt-1 text-xs text-red-500">{formik.errors.area}</p>
          )}
        </div>
        <div className="group">
          <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
            Business Phone Number (WhatsApp preferred){" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            placeholder="+234XXXXXXXXXX"
            type="tel"
            name="contact_person_number"
            value={formik.values.contact_person_number || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 ${formik.touched.contact_person_number && formik.errors.contact_person_number ? "border-red-400" : "border-gray-200"}`}
            required
          />
          {formik.touched.contact_person_number &&
            formik.errors.contact_person_number && (
              <p className="mt-1 text-xs text-red-500">
                {formik.errors.contact_person_number}
              </p>
            )}
        </div>
        {[
          { name: "business_email", label: "Business Email", type: "email" },
          {
            name: "contact_person_email",
            label: "Alternate Business Email",
            type: "email",
          },
          {
            name: "business_website",
            label: "Business Website (if any)",
            type: "url",
          },
          { name: "contact_person", label: "Contact Person" },
        ].map((field) => (
          <div key={field.name} className="group">
            <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
              {field.label}
            </label>
            <input
              type={field.type || "text"}
              name={field.name}
              value={formik.values[field.name]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 border-gray-200"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

// Additional Details Section
const AdditionalDetails = ({ formik, slug }) => {
  const addStaff = () => {
    const newStaff = [
      ...(formik.values.staff || []),
      { name: "", role: "", position: "" },
    ];
    formik.setFieldValue("staff", newStaff);
  };

  const removeStaff = (index) => {
    const updatedStaff = formik.values.staff.filter((_, i) => i !== index);
    formik.setFieldValue("staff", updatedStaff);
  };

  return (
    <section className="space-y-5">
      <h2 className="flex items-center justify-between text-lg font-semibold text-gray-800">
        <span>Additional Details</span>
        {!slug && (
          <span className="flex items-center text-xs italic text-red-600">
            <AlertTriangle className="w-4 h-4 mr-1" />
            Please save this step before uploading photos
          </span>
        )}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[
          {
            name: "nearest_bus_stop",
            label: "Nearest Bus Stop",
            placeholder: "e.g., Downtown Stop",
          },
          {
            name: "landmark",
            label: "Landmark",
            placeholder: "e.g., Near Park",
          },
          {
            name: "tin_number",
            label: "Tax ID Number",
            placeholder: "e.g., TIN123456789",
          },
          {
            name: "tax_reg_no",
            label: "Tax Registration Number",
            placeholder: "e.g., TAX123456",
          },
          {
            name: "services_rendered",
            label: "Services Offered",
            placeholder: "e.g., Delivery, Supply",
          },
          {
            name: "target_audience",
            label: "Target Audience",
            placeholder: "e.g., Farmers, Suppliers",
          },
          {
            name: "operation_hours",
            label: "Operation Hours",
            placeholder: "e.g., 9 AM - 5 PM",
          },
          {
            name: "expected_daily_income",
            label: "Expected Daily Income ($)",
            type: "number",
            min: 0,
            placeholder: "e.g., 1000",
          },
          {
            name: "social_media.facebook",
            label: "Facebook URL",
            placeholder: "e.g., https://facebook.com/example",
          },
          {
            name: "social_media.twitter",
            label: "Twitter URL",
            placeholder: "e.g., https://twitter.com/example",
          },
        ].map((field) => (
          <div key={field.name} className="group">
            <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
              {field.label}
            </label>
            <input
              type={field.type || "text"}
              name={field.name}
              value={
                field.name.includes("social_media")
                  ? formik.values.social_media[field.name.split(".")[1]] || ""
                  : formik.values[field.name] || ""
              }
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              min={field.min}
              placeholder={field.placeholder}
              className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 border-gray-200"
            />
          </div>
        ))}

        {/* netwoth */}
        <div className="group">
          <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
            Net Worth (#) <span className="text-red-500">*</span>
          </label>
          <input
            placeholder="Your business networth"
            type="number"
            name="net_worth"
            value={formik.values.net_worth || ""}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            min="0"
            className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 ${formik.touched.net_worth && formik.errors.net_worth ? "border-red-400" : "border-gray-200"}`}
            required
          />
          {formik.touched.net_worth && formik.errors.net_worth && (
            <p className="mt-1 text-xs text-red-500">
              {formik.errors.net_worth}
            </p>
          )}
        </div>
        <div className="md:col-span-2 group">
          <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
            Business Description
          </label>
          <ReactQuill
            theme="snow"
            value={formik.values.business_description}
            onChange={(value) =>
              formik.setFieldValue("business_description", value)
            }
            placeholder="e.g., We provide agricultural services."
            className="bg-white rounded-md border border-gray-200 hover:border-blue-300 transition-all duration-200"
            modules={{
              toolbar: [
                ["bold", "italic", "underline"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link"],
                ["clean"],
              ],
            }}
          />
        </div>
        <div className="md:col-span-2">
          <h3 className="text-base font-semibold text-gray-800 mb-2">Staff</h3>
          {Array.isArray(formik.values.staff) &&
          formik.values.staff.length > 0 ? (
            formik.values.staff.map((staffMember, index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3 items-end">
                <div className="group">
                  <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
                    Name
                  </label>
                  <input
                    type="text"
                    name={`staff[${index}].name`}
                    value={staffMember.name || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="e.g., John Doe"
                    className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 border-gray-200"
                  />
                </div>
                <div className="group">
                  <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
                    Role
                  </label>
                  <input
                    type="text"
                    name={`staff[${index}].role`}
                    value={staffMember.role || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="e.g., Manager"
                    className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 border-gray-200"
                  />
                </div>
                <div className="group">
                  <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
                    Position
                  </label>
                  <input
                    type="text"
                    name={`staff[${index}].position`}
                    value={staffMember.position || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="e.g., Lead"
                    className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 border-gray-200"
                  />
                </div>
                <div className="group">
                  <button
                    type="button"
                    onClick={() => removeStaff(index)}
                    className="w-full p-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200">
                    Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-600">No staff added yet.</p>
          )}
          <button
            type="button"
            onClick={addStaff}
            className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors duration-200">
            Add Staff
          </button>
        </div>
      </div>
    </section>
  );
};

const PhotoUpload = ({
  formik,
  businessId,
  slug,
  profile,
  setBusinessId,
  token,
  showAlertMessage,
  onPhotosUpdated,
}) => {
  const [logoFile, setLogoFile] = useState(null);
  const [productFiles, setProductFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState({
    logoLoading: false,
    productLoading: false,
    error: null,
    success: null,
  });
  const [uploadedLogo, setUploadedLogo] = useState(null);
  const [uploadedProductPhotos, setUploadedProductPhotos] = useState([]);

  const fetchUploadedImages = useCallback(async () => {
    if (!slug) return;
    try {
      const response = await fetch(`${BACKEND_URL}/api/business/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch images");
      const data = await response.json();

      const logo = data.business_photos?.[0] || null;
      setUploadedLogo(logo);

      // Parse product photos
      const productPhotosData = data?.business?.details?.product_photos || [];
      let productPhotos = [];
      if (productPhotosData.length > 0 && productPhotosData[0]?.photo_paths) {
        // Parse the JSON string in photo_paths
        productPhotos = JSON.parse(productPhotosData[0].photo_paths);
      }
      setUploadedProductPhotos(productPhotos);
    } catch (error) {
      console.error("Error fetching images:", error);
      showAlertMessage(
        "Failed to fetch images: " + error.message,
        "destructive"
      );
    }
  }, [slug, token, showAlertMessage]);

  useEffect(() => {
    fetchUploadedImages();
  }, [fetchUploadedImages]);

  const handleLogoUpload = useCallback(async () => {
    if (!logoFile || !businessId) return;
    const formData = new FormData();
    formData.append("business_id", businessId);
    formData.append("photos", logoFile);

    setUploadStatus((prev) => ({
      ...prev,
      logoLoading: true,
      error: null,
      success: null,
    }));
    try {
      const response = await fetch(`${BACKEND_URL}/api/upload/business/logo`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Logo upload failed");
      }
      const data = await response.json();
      setUploadStatus((prev) => ({
        ...prev,
        logoLoading: false,
        success: "Logo uploaded successfully!",
      }));
      showAlertMessage("Logo uploaded successfully!", "success");
      const newLogo = data.image_url || URL.createObjectURL(logoFile);
      setUploadedLogo(newLogo);
      setLogoFile(null);
      formik.setFieldValue("business_photos", [newLogo]);
      onPhotosUpdated({
        ...profile,
        business_photos: [newLogo],
      });
    } catch (error) {
      setUploadStatus((prev) => ({
        ...prev,
        logoLoading: false,
        error: error.message,
        success: null,
      }));
      showAlertMessage(error.message, "destructive");
    }
  }, [
    logoFile,
    businessId,
    token,
    showAlertMessage,
    profile,
    onPhotosUpdated,
    formik,
  ]);

  const handleProductPhotosUpload = useCallback(async () => {
    if (!productFiles.length || !businessId) return;
    const formData = new FormData();
    formData.append("business_id", businessId);
    productFiles.forEach((file) => formData.append("product_photos[]", file));

    setUploadStatus((prev) => ({
      ...prev,
      productLoading: true,
      error: null,
      success: null,
    }));
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/upload/business/product/images`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Product photos upload failed");
      }
      const data = await response.json();
      setUploadStatus((prev) => ({
        ...prev,
        productLoading: false,
        success: "Product photos uploaded successfully!",
      }));
      showAlertMessage("Product photos uploaded successfully!", "success");

      // Handle the API response
      let newPhotos = [];
      if (data.image_urls) {
        newPhotos = data.image_urls; // If the API returns an array of URLs
      } else if (data.photo_paths) {
        newPhotos = JSON.parse(data.photo_paths); // If the API returns a JSON string
      } else {
        newPhotos = productFiles.map((file) => URL.createObjectURL(file)); // Fallback to local URLs
      }

      setUploadedProductPhotos(newPhotos);
      setProductFiles([]);
      formik.setFieldValue("product_photos", newPhotos);
      onPhotosUpdated({
        ...profile,
        product_photos: newPhotos,
      });
    } catch (error) {
      setUploadStatus((prev) => ({
        ...prev,
        productLoading: false,
        error: error.message,
        success: null,
      }));
      showAlertMessage(error.message, "destructive");
    }
  }, [
    productFiles,
    businessId,
    token,
    showAlertMessage,
    profile,
    onPhotosUpdated,
    formik,
  ]);

  return (
    <section className="space-y-5">
      <h2 className="text-lg font-semibold text-gray-800">Business Photos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Logo Upload */}
        <div className="group">
          <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
            Business Logo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setLogoFile(e.target.files[0])}
            className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 border-gray-200"
            disabled={uploadStatus.logoLoading}
          />
          <button
            type="button"
            onClick={handleLogoUpload}
            disabled={!logoFile || uploadStatus.logoLoading || !businessId}
            className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 flex items-center justify-center min-w-[100px]">
            {uploadStatus.logoLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                  />
                </svg>
                Uploading...
              </>
            ) : profile?.business_photos?.length > 0 ? (
              "Update Logo"
            ) : (
              "Upload Logo"
            )}
          </button>
          {(uploadedLogo || profile?.business_photos?.length > 0) && (
            <div className="mt-2">
              <img
                src={uploadedLogo || profile.business_photos[0]}
                alt="Business Logo"
                loading="lazy"
                className="w-24 h-24 object-cover rounded-md border border-gray-200"
                // onError={(e) => (e.target.src = defaultBusinessLogo)}
              />
            </div>
          )}
        </div>

        {/* Product Photos Upload */}
        <div className="group">
          <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
            Product Photos (max 6)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) =>
              setProductFiles(Array.from(e.target.files).slice(0, 6))
            }
            className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 border-gray-200"
            disabled={uploadStatus.productLoading}
          />
          <button
            type="button"
            onClick={handleProductPhotosUpload}
            disabled={
              !productFiles.length || uploadStatus.productLoading || !businessId
            }
            className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 flex items-center justify-center min-w-[140px]">
            {uploadStatus.productLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                  />
                </svg>
                Uploading...
              </>
            ) : profile?.product_photos?.length > 0 ? (
              "Update Product Photos"
            ) : (
              "Upload Product Photos"
            )}
          </button>
          {(uploadedProductPhotos.length > 0 ||
            profile?.product_photos?.length > 0) && (
            <div className="mt-2 grid grid-cols-3 gap-2">
              {(uploadedProductPhotos.length > 0
                ? uploadedProductPhotos
                : profile.product_photos
              ).map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`Product Photo ${index + 1}`}
                  loading="lazy"
                  className="w-20 h-20 object-cover rounded-md border border-gray-200"
                  // onError={(e) => (e.target.src = defaultBusinessLogo)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {!businessId && (
        <p className="text-xs text-red-500">
          Please save the form first to upload photos.
        </p>
      )}
    </section>
  );
};
// Review & Submit Section
const ReviewSubmit = ({ formik, businessId }) => (
  <section className="space-y-5">
    <h2 className="text-lg font-semibold text-gray-800">Review & Submit</h2>
    <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <h3 className="text-base font-semibold text-gray-700 mb-3">
        Your Business Profile Summary
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
        <div>
          <h4 className="font-semibold text-blue-600 mb-2">
            Business Information
          </h4>
          <p>Name: {formik.values.business_name || "Not provided"}</p>
          <p>Type: {formik.values.business_line || "Not provided"}</p>
          <p>Category: {formik.values.category_slug || "Not provided"}</p>
          <p>
            Established: {formik.values.date_of_establishment || "Not provided"}
          </p>
          <p>Staff: {formik.values.number_of_staff || "0"}</p>
          <p>Property: {formik.values.property_status || "Not provided"}</p>
          <p>Reg No: {formik.values.business_reg_number || "Not provided"}</p>
        </div>
        <div>
          <h4 className="font-semibold text-blue-600 mb-2">Contact Details</h4>
          <p>Address: {formik.values.business_address || "Not provided"}</p>
          <p>
            Location: {formik.values.city || "Not provided"},{" "}
            {formik.values.state || "Not provided"},{" "}
            {formik.values.area || "Not provided"}
          </p>
          <p>Email: {formik.values.business_email || "Not provided"}</p>
          <p>Website: {formik.values.business_website || "Not provided"}</p>
          <p>Contact: {formik.values.contact_person || "Not provided"}</p>
          <p>Phone: {formik.values.contact_person_number || "Not provided"}</p>
          <p>
            Contact Email:{" "}
            {formik.values.contact_person_email || "Not provided"}
          </p>
        </div>
        <div className="md:col-span-2 mt-4">
          <h4 className="font-semibold text-blue-600 mb-2">
            Additional Details
          </h4>
          <p>Bus Stop: {formik.values.nearest_bus_stop || "Not provided"}</p>
          <p>Landmark: {formik.values.landmark || "Not provided"}</p>
          <p>TIN: {formik.values.tin_number || "Not provided"}</p>
          <p>Tax Reg: {formik.values.tax_reg_no || "Not provided"}</p>
          <p>Services: {formik.values.services_rendered || "Not provided"}</p>
          <p>Audience: {formik.values.target_audience || "Not provided"}</p>
          <p>Hours: {formik.values.operation_hours || "Not provided"}</p>
          <p>
            Expected Daily Income: ${formik.values.expected_daily_income || "0"}
          </p>
          <p>Net Worth: ${formik.values.net_worth || "Not provided"}</p>
          <p>
            Facebook: {formik.values.social_media.facebook || "Not provided"}
          </p>
          <p>Twitter: {formik.values.social_media.twitter || "Not provided"}</p>
          <div>
            <span>Description:</span>
            <div
              className="mt-1 text-gray-600 ql-editor"
              dangerouslySetInnerHTML={{
                __html: formik.values.business_description || "Not provided",
              }}
            />
          </div>
          <div>
            <span>Staff:</span>
            {Array.isArray(formik.values.staff) &&
            formik.values.staff.length > 0 ? (
              formik.values.staff.map((s, i) => (
                <p key={i}>
                  {s.name} - {s.role} ({s.position})
                </p>
              ))
            ) : (
              <p>Not provided</p>
            )}
          </div>
        </div>
      </div>
    </div>
  </section>
);

const BusinessProfile = () => {
  const dispatch = useDispatch();
  const { userInfo, token } = useSelector((state) => state.auth);
  const { slug } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [businessId, setBusinessId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });
  const [imageUploadProgress, setImageUploadProgress] = useState({
    logo: 0,
    product: 0,
  });

  const showAlertMessage = useCallback((message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  }, []);

  const [formStatus, setFormStatus] = useState({
    loading: false,
    error: null,
    success: null,
    isDraft: false,
  });
  const [completionData, setCompletionData] = useState({
    business: 0,
    contact: 0,
    additional: 0,
    photos: 0,
    overall: 0,
  });

  const validationSchema = Yup.object({
    business_name: Yup.string().required("Business name is required"),
    business_line: Yup.string().required("Business type is required"),
    category_slug: Yup.string().required("Category is required"),
    date_of_establishment: Yup.date().required(
      "Establishment date is required"
    ),
    business_address: Yup.string().required("Business address is required"),
    state: Yup.string().required("State is required"),
    city: Yup.string().required("City is required"),
    area: Yup.string().required("Area is required"),
    contact_person_number: Yup.string()
      .matches(
        /^\+234[0-9]{10}$/,
        "Phone number must start with +234 and be 14 digits long"
      )
      .required("Phone number is required"),
  });

  const initialFetchDone = useRef(false);
  const formik = useFormik({
    initialValues: {
      business_name: "",
      business_line: "",
      category_slug: "",
      date_of_establishment: "",
      number_of_staff: "",
      property_status: "",
      business_reg_number: "",
      expected_daily_income: "",
      business_email: "",
      business_website: "",
      business_address: "",
      state: "",
      city: "",
      area: "",
      nafdac: "",
      contact_person: "",
      contact_person_number: "",
      contact_person_email: "",
      nearest_bus_stop: "",
      net_worth: "",
      landmark: "",
      tin_number: "",
      tax_reg_no: "",
      services_rendered: "",
      target_audience: "",
      operation_hours: "",
      business_description: "",
      social_media: { facebook: "", twitter: "" },
      staff: [],
      business_photos: [],
      product_photos: [],
    },
    validationSchema,
    onSubmit: async (values) => await handleSubmit(values),
  });

  const handlePhotosUpdated = useCallback((updatedProfile) => {
    setProfile(updatedProfile);
  }, []);

  const steps = [
    {
      id: 1,
      title: "Business Info",
      component: (props) => <BusinessInfo {...props} categories={categories} />,
      weight: 30,
    },
    { id: 2, title: "Contact Details", component: ContactDetails, weight: 30 },
    {
      id: 3,
      title: "Additional Details",
      component: AdditionalDetails,
      weight: 20,
    },
    {
      id: 4,
      title: "Photos",
      component: (props) => (
        <PhotoUpload
          {...props}
          businessId={businessId}
          slug={slug}
          profile={profile}
          setBusinessId={setBusinessId}
          token={token}
          showAlertMessage={showAlertMessage}
          onPhotosUpdated={handlePhotosUpdated}
          setImageUploadProgress={setImageUploadProgress}
        />
      ),
      weight: 20,
    },
    {
      id: 5,
      title: "Review & Submit",
      component: (props) => <ReviewSubmit {...props} businessId={businessId} />,
      weight: 0,
    },
  ];

  const calculateCompletionStatus = useCallback(() => {
    const businessFields = [
      "business_name",
      "business_line",
      "category_slug",
      "date_of_establishment",
      "number_of_staff",
      "property_status",
      "business_reg_number",
    ];
    const businessComplete = businessFields.filter(
      (field) => formik.values[field]
    ).length;
    const businessPercentage = Math.min(
      100,
      Math.round((businessComplete / businessFields.length) * 100)
    );

    const contactFields = ["business_address", "state", "city", "area"];
    const contactComplete = contactFields.filter(
      (field) => formik.values[field]
    ).length;
    const contactPercentage = Math.min(
      100,
      Math.round((contactComplete / contactFields.length) * 100)
    );

    const additionalFields = [
      "services_rendered",
      "target_audience",
      "business_description",
    ];
    const additionalComplete = additionalFields.filter(
      (field) => formik.values[field]
    ).length;
    const additionalPercentage = Math.min(
      100,
      Math.round((additionalComplete / additionalFields.length) * 100)
    );

    // Photo section completion: 50% for business_photos, 50% for product_photos
    const hasBusinessPhotos =
      (profile?.business_photos?.length > 0 ||
        formik.values.business_photos.length > 0) &&
      imageUploadProgress.logo > 0;
    const hasProductPhotos =
      (profile?.product_photos?.length > 0 ||
        formik.values.product_photos.length > 0) &&
      imageUploadProgress.product > 0;
    const photosPercentage = Math.round(
      (hasBusinessPhotos ? 50 : 0) + (hasProductPhotos ? 50 : 0)
    );

    const totalWeight = 100;
    const overallPercentage = Math.round(
      (businessPercentage * 30 +
        contactPercentage * 30 +
        additionalPercentage * 20 +
        photosPercentage * 20) /
        totalWeight
    );

    setCompletionData({
      business: businessPercentage,
      contact: contactPercentage,
      additional: additionalPercentage,
      photos: photosPercentage,
      overall: overallPercentage,
    });
  }, [formik.values, profile, imageUploadProgress]);

  const fetchBusinessProfile = useCallback(async () => {
    if (!slug) return;
    try {
      setFormStatus((prev) => ({ ...prev, loading: true, error: null }));
      const response = await fetch(`${BACKEND_URL}/api/business/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to fetch business profile"
        );
      }
      const data = await response.json();

      if (data.business?.details) {
        // Parse product photos
        let productPhotos = [];
        const productPhotosData = data?.business?.details?.product_photos || [];
        if (productPhotosData.length > 0 && productPhotosData[0]?.photo_paths) {
          productPhotos = JSON.parse(productPhotosData[0].photo_paths);
        }

        // Map the fetched data to match formik.initialValues structure
        const businessData = {
          business_name: data.business.details.business_name || "",
          business_line: data.business.details.business_line || "",
          category_slug: data.business.details.category_slug || "",
          date_of_establishment:
            data.business.details.date_of_establishment || "",
          number_of_staff: data.business.details.number_of_staff || "",
          property_status: data.business.details.property_status || "",
          business_reg_number: data.business.details.business_reg_number || "",
          expected_daily_income:
            data.business.details.expected_daily_income || "",
          business_email: data.business.details.business_email || "",
          business_website: data.business.details.business_website || "",
          business_address: data.business.details.business_address || "",
          state: data.business.details.state || "",
          city: data.business.details.city || "",
          area: data.business.details.area || "",
          nafdac: data.business.details.nafdac || "",
          contact_person: data.business.details.contact_person || "",
          contact_person_number:
            data.business.details.contact_person_number || "",
          contact_person_email:
            data.business.details.contact_person_email || "",
          nearest_bus_stop: data.business.details.nearest_bus_stop || "",
          net_worth: data.business.details.net_worth || "",
          landmark: data.business.details.landmark || "",
          tin_number: data.business.details.tin_number || "",
          tax_reg_no: data.business.details.tax_reg_no || "",
          services_rendered: data.business.details.services_rendered || "",
          target_audience: data.business.details.target_audience || "",
          operation_hours: data.business.details.operation_hours || "",
          business_description:
            data.business.details.business_description || "",
          social_media: data.business.details.social_media
            ? typeof data.business.details.social_media === "string"
              ? JSON.parse(data.business.details.social_media)
              : data.business.details.social_media
            : { facebook: "", twitter: "" },
          staff: data.business.details.staff
            ? typeof data.business.details.staff === "string"
              ? JSON.parse(data.business.details.staff)
              : Array.isArray(data.business.details.staff)
                ? data.business.details.staff
                : []
            : [],
          business_photos: data.business?.business_photos || [],
          product_photos: productPhotos, // Use the parsed product photos
        };

        console.log(data?.business?.details?.product_photos, "product photos");

        setProfile(businessData);
        await formik.setValues(businessData);
        console.log("formik.values after setValues:", formik.values);
        setBusinessId(data.business.details.id);
        setImageUploadProgress({
          logo: data?.business_photos?.length > 0 ? 100 : 0,
          product: productPhotos.length > 0 ? 100 : 0, // Update based on parsed product photos
        });
      } else {
        console.error("No business details found in response:", data);
        showAlertMessage(
          "No business details found in the response",
          "destructive"
        );
      }
    } catch (error) {
      console.error("Error fetching business profile:", error);
      showAlertMessage(error.message, "destructive");
    } finally {
      setFormStatus((prev) => ({ ...prev, loading: false }));
    }
  }, [token, showAlertMessage, slug, formik]);

  useEffect(() => {
    if (slug && !initialFetchDone.current) {
      fetchBusinessProfile();
      initialFetchDone.current = true;
    }
  }, [slug, fetchBusinessProfile]); // Only depend on slug and fetchBusinessProfile

  useEffect(() => {
    calculateCompletionStatus();
  }, [
    formik.values,
    currentStep,
    calculateCompletionStatus,
    imageUploadProgress,
  ]);

  const handleApiCall = useCallback(
    async (url, method, data, isDraft = false) => {
      try {
        setFormStatus((prev) => ({
          ...prev,
          loading: true,
          error: null,
          success: null,
          isDraft,
        }));
        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...data, is_draft: isDraft }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Request failed");
        }
        const result = await response.json();
        const successMessage = isDraft
          ? "Draft saved successfully"
          : method === "POST"
            ? "Business profile created successfully!"
            : "Business profile updated successfully!";
        showAlertMessage(successMessage, "success");
        setFormStatus((prev) => ({
          ...prev,
          loading: false,
          success: true,
          isDraft,
        }));
        return result;
      } catch (error) {
        showAlertMessage(error.message, "destructive");
        setFormStatus((prev) => ({
          ...prev,
          loading: false,
          error: error.message,
          success: null,
          isDraft,
        }));
        throw error;
      }
    },
    [token, showAlertMessage]
  );

  const handleSubmit = useCallback(
    async (values) => {
      try {
        let result;
        if (slug) {
          result = await handleApiCall(
            `${BACKEND_URL}/api/business/edit/${slug}`,
            "PUT",
            values,
            false
          );
        } else {
          result = await handleApiCall(
            `${BACKEND_URL}/api/create/business/profile`,
            "POST",
            values,
            false
          );
          setBusinessId(result.data.id);
        }
        setCurrentStep(steps.length + 1);
      } catch (error) {
        console.error("Submission failed:", error);
      }
    },
    [handleApiCall, slug]
  );

  const saveDraft = useCallback(async () => {
    try {
      if (slug) {
        await handleApiCall(
          `${BACKEND_URL}/api/business/edit/${slug}`,
          "PUT",
          formik.values,
          true
        );
      } else {
        const result = await handleApiCall(
          `${BACKEND_URL}/api/create/business/profile`,
          "POST",
          formik.values,
          true
        );
        setBusinessId(result.data.id);
        navigate("/user/Allbusiness");
      }
    } catch (error) {
      console.error("Failed to save draft:", error);
    }
  }, [formik.values, handleApiCall, slug, navigate]);

  const handleNext = useCallback(() => {
    formik.validateForm().then((errors) => {
      const stepFields = {
        1: [
          "business_name",
          "business_line",
          "category_slug",
          "date_of_establishment",
          "number_of_staff",
          "property_status",
          "business_reg_number",
        ],
        2: ["business_address", "state", "city", "contact_person_number"],
        3: [],
        4: [],
        5: [],
      };
      const relevantErrors = Object.keys(errors).filter((key) =>
        stepFields[currentStep].includes(key)
      );
      if (relevantErrors.length === 0) {
        setCurrentStep((prev) => Math.min(prev + 1, steps.length));
      } else {
        formik.setTouched(
          relevantErrors.reduce((acc, key) => ({ ...acc, [key]: true }), {})
        );
        showAlertMessage(
          "Please fix the errors before proceeding",
          "destructive"
        );
      }
    });
  }, [currentStep, formik, showAlertMessage]);

  return (
    <div className="mid:mt-6">
      <CategoryFetcher onCategoriesLoaded={setCategories} />
      <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row p-3 md:p-5">
        <aside className="hidden lg:block w-64 bg-white shadow-md rounded-lg p-5 sticky top-5 h-[calc(100vh-2.5rem)]">
          <h2 className="text-xl font-bold text-gray-800 mb-5">
            Business Setup
          </h2>
          <div className="flex justify-center mb-5">
            <ProgressRing progress={completionData.overall} />
          </div>
          <nav className="space-y-2">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`w-full flex items-center p-2 rounded-md text-sm transition-all duration-200 ${currentStep === step.id ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"}`}>
                <span
                  className={`w-5 h-5 mr-2 flex items-center justify-center rounded-full text-xs ${currentStep > step.id ? "bg-green-500 text-white" : currentStep === step.id ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
                  {currentStep > step.id ? <Check size={12} /> : step.id}
                </span>
                {step.title}
                <span className="ml-auto text-xs font-medium">
                  {step.id === 1
                    ? `${completionData.business}%`
                    : step.id === 2
                      ? `${completionData.contact}%`
                      : step.id === 3
                        ? `${completionData.additional}%`
                        : step.id === 4
                          ? `${completionData.photos}%`
                          : ""}
                </span>
              </button>
            ))}
          </nav>
          <div>
            <hr className="h-2 mt-5 w-full" />
            <button
              onClick={() => navigate(`/user/business/${slug}/branches`)}
              className="flex items-center ml-2 bg-blue-500 hover:bg-blue-700 transition-colors duration-300 scale-105 p-1 rounded-md text-white px-4 mt-2">
              Business Branches
            </button>
          </div>
        </aside>

        <div
          className={`fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-300 ${isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          onClick={() => setIsSidebarOpen(false)}
        />
        <aside
          className={`fixed inset-y-0 left-0 w-64 bg-white shadow-md p-5 transition-transform duration-300 z-50 lg:hidden ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-bold text-gray-800">Business Setup</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="flex justify-center mb-5">
            <ProgressRing progress={completionData.overall} size={90} />
          </div>
          <nav className="space-y-2">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => {
                  setCurrentStep(step.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center p-2 rounded-md text-sm transition-all duration-200 ${currentStep === step.id ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"}`}>
                <span
                  className={`w-5 h-5 mr-2 flex items-center justify-center rounded-full text-xs ${currentStep > step.id ? "bg-green-500 text-white" : currentStep === step.id ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
                  {currentStep > step.id ? <Check size={12} /> : step.id}
                </span>
                {step.title}
                <span className="ml-auto text-xs font-medium">
                  {step.id === 1
                    ? `${completionData.business}%`
                    : step.id === 2
                      ? `${completionData.contact}%`
                      : step.id === 3
                        ? `${completionData.additional}%`
                        : step.id === 4
                          ? `${completionData.photos}%`
                          : ""}
                </span>
              </button>
            ))}
          </nav>
          <div>
            <hr className="h-2 mt-5 w-full" />
            <button
              onClick={() => navigate(`/user/business/${slug}/branches`)}
              className="flex items-center ml-2 bg-blue-500 hover:bg-blue-700 transition-colors duration-300 scale-105 p-1 rounded-md text-white px-4 mt-2">
              Business Branches
            </button>
          </div>
        </aside>

        <main className="flex-1 bg-white shadow-md rounded-lg p-2 md:p-2 lg:ml-5 mt-4 lg:mt-0">
          <div className="flex justify-between items-center my-5">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
              <Menu size={24} />
            </button>
            <h1 className="text-lg mid:text-sm font-bold text-gray-800">
              {currentStep <= steps.length
                ? `Step ${currentStep}: ${steps[currentStep - 1].title}`
                : "Business Profile Complete"}
            </h1>
          </div>

          <form onSubmit={formik.handleSubmit}>
            {currentStep <= steps.length ? (
              steps[currentStep - 1].component({ formik, categories })
            ) : (
              <div className="text-center space-y-5 py-12 bg-gray-50 rounded-lg border border-green shadow-sm max-w-xl mx-auto">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500 text-white mb-5 ring-2 ring-green">
                  <Check className="text-green" size={32} strokeWidth={2.5} />
                </div>
                <h2 className="text-lg font-bold text-green-600">
                  Business Profile Submitted Successfully
                </h2>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  Your business profile is now complete! View it or manage it
                  from your dashboard.
                </p>
                <button
                  type="button"
                  className="mt-6 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                  onClick={() => (window.location.href = `/user/Allbusiness`)}>
                  Dismiss
                </button>
              </div>
            )}

            {/* Navigation Buttons for Steps 1-4 */}
            {currentStep <= 4 && (
              <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between items-center">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((prev) => prev - 1)}
                    className="flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors duration-200">
                    <ChevronLeft size={18} className="mr-1" /> Previous
                  </button>
                ) : (
                  <div></div>
                )}
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={saveDraft}
                    disabled={formStatus.loading}
                    className="flex-1 sm:flex-initial px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 flex items-center justify-center">
                    {formStatus.loading && formStatus.isDraft ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 mr-2"
                          viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                          />
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} className="inline mr-1" /> Save Draft
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={formStatus.loading}
                    className="flex-1 sm:flex-initial px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50">
                    Next <ChevronRight size={18} className="inline ml-1" />
                  </button>
                </div>
              </div>
            )}

            {/* Submit Button for Step 5 */}
            {currentStep === 5 && (
              <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  className="flex items-center justify-center w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors duration-200">
                  <ChevronLeft size={18} className="mr-1" /> Previous
                </button>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={saveDraft}
                    disabled={formStatus.loading}
                    className="flex-1 sm:flex-initial px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50 flex items-center justify-center">
                    {formStatus.loading && formStatus.isDraft ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 mr-2"
                          viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                          />
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} className="inline mr-1" /> Save Draft
                      </>
                    )}
                  </button>
                  <button
                    type="submit"
                    disabled={formStatus.loading}
                    className="flex-1 sm:flex-initial px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 flex items-center justify-center">
                    {formStatus.loading && !formStatus.isDraft ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4 mr-2"
                          viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                          />
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit{" "}
                        <ChevronRight size={18} className="inline ml-1" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        </main>

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
    </div>
  );
};

export default BusinessProfile;

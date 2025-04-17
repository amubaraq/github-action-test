import React, { useState } from "react";
import {
  ChevronDown,
  FileText,
  Building2,
  Phone,
  Mail,
  Globe,
  Info,
  Upload,
  MessageSquare,
  X,
} from "lucide-react";
import { Alert, AlertDescription } from "../components/tools/Alert";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  fullName: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().matches(/^[0-9+\-\s()]*$/, "Invalid phone number"),
  organization: yup.string(),
  position: yup.string(),
  category: yup.string().required("Category is required"),
  requestDetails: yup
    .string()
    .required("Request details are required")
    .min(10, "Request details must be at least 10 characters"),
  businessName: yup.string(),
  businessAddress: yup.string(),
  businessPhone: yup
    .string()
    .matches(/^[0-9+\-\s()]*$/, "Invalid phone number"),
  businessEmail: yup.string().email("Invalid business email"),
  website: yup.string().url("Invalid URL"),
  industry: yup.string(),
  individualName: yup.string(),
  jobTitle: yup.string(),
  individualContactInfo: yup.string(),
  contactMethod: yup.string().oneOf(["email", "phone"]),
  urgencyLevel: yup.string().oneOf(["low", "normal", "high", "urgent"]),
  specialInstructions: yup.string(),
  agreesToTerms: yup
    .boolean()
    .oneOf([true], "You must agree to the terms and conditions"),
  supportingDocuments: yup.array().of(
    yup.mixed().test("fileSize", "File size is too large", (value) => {
      if (!value) return true;
      return value.size <= 5 * 1024 * 1024; // 5MB
    })
  ),
});

const RequestFormPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const email = userInfo?.email;
  const name = userInfo?.name;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: name,
      email: email,
      phone: "",
      organization: "",
      position: "",
      category: "",
      requestDetails: "",
      businessName: "",
      businessAddress: "",
      businessPhone: "",
      businessEmail: "",
      website: "",
      industry: "",
      individualName: "",
      jobTitle: "",
      individualContactInfo: "",
      contactMethod: "email",
      urgencyLevel: "normal",
      specialInstructions: "",
      agreesToTerms: false,
      supportingDocuments: [],
    },
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });

  const categories = [
    "Business Listing",
    "Service Request",
    "Partnership Inquiry",
    "Content Update",
    "Technical Support",
    "Other",
  ];

  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Retail",
    "Manufacturing",
    "Services",
    "Other",
  ];

  const urgencyLevels = [
    { value: "low", label: "Low Priority" },
    { value: "normal", label: "Normal Priority" },
    { value: "high", label: "High Priority" },
    { value: "urgent", label: "Urgent" },
  ];

  const onSubmit = (data) => {
    try {
      // Handle form submission
      console.log("Form submitted:", data);
      showAlertMessage("Form submitted successfully", "success");
    } catch (error) {
      showAlertMessage("Error submitting form", "destructive");
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(
      (file) => file.size <= 5 * 1024 * 1024 // 5MB limit
    );
    if (validFiles.length > 0) {
      setValue("supportingDocuments", [
        ...watch("supportingDocuments"),
        ...validFiles,
      ]);
    } else {
      showAlertMessage("File size must be less than 5MB", "warning");
    }
  };

  const removeFile = (index) => {
    const currentFiles = watch("supportingDocuments");
    setValue(
      "supportingDocuments",
      currentFiles.filter((_, i) => i !== index)
    );
  };

  const showAlertMessage = (message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Submit a Request</h1>
        <p className="text-gray-600">
          Please fill out the form below with your request details
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-[2rem]">
        {/* Requestor Information Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center mb-4">
            <Info className="w-5 h-5 mr-2 text-blue-500" />
            <h2 className="text-xl font-semibold">Requestor Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Full Name *</label>
              <input
                type="text"
                {...register("fullName")}
                className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${
                  errors.fullName ? "border-red-500" : ""
                }`}
              />
              {errors.fullName && (
                <p className="text-sm text-red-500">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Email Address *
              </label>
              <input
                type="email"
                {...register("email")}
                className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? "border-red-500" : ""
                }`}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Supporting Documents Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center mb-4">
            <Upload className="w-5 h-5 mr-2 text-blue-500" />
            <h2 className="text-xl font-semibold">Supporting Documents</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Upload Supporting Documents (PDF, DOC, PNG, JPG - Max 5MB)
              </label>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Display Uploaded Files */}
            {watch("supportingDocuments").length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Uploaded Files:</p>
                <div className="space-y-2">
                  {watch("supportingDocuments").map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="p-1 text-red-500 hover:text-red-700">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Request Type Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center mb-4">
            <FileText className="w-5 h-5 mr-2 text-blue-500" />
            <h2 className="text-xl font-semibold">Type of Request</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Category *</label>
              <select
                {...register("category")}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500">
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-sm text-red-500">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Request Details *
              </label>
              <textarea
                {...register("requestDetails")}
                rows={4}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
              {errors.requestDetails && (
                <p className="text-sm text-red-500">
                  {errors.requestDetails.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Business Details Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center mb-4">
            <Building2 className="w-5 h-5 mr-2 text-blue-500" />
            <h2 className="text-xl font-semibold">
              Business or Individual Details
            </h2>
          </div>

          {/* Business Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-700">
              Business Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Business Name
                </label>
                <input
                  type="text"
                  {...register("businessName")}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Business Email Address
                </label>
                <input
                  type="email"
                  {...register("businessEmail")}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
                {errors.businessEmail && (
                  <p className="text-sm text-red-500">
                    {errors.businessEmail.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Business Phone Number
                </label>
                <input
                  type="tel"
                  {...register("businessPhone")}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
                {errors.businessPhone && (
                  <p className="text-sm text-red-500">
                    {errors.businessPhone.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Website URL</label>
                <input
                  type="url"
                  {...register("website")}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="https://"
                />
                {errors.website && (
                  <p className="text-sm text-red-500">
                    {errors.website.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium">
                  Business Address
                </label>
                <textarea
                  {...register("businessAddress")}
                  rows={2}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Industry/Sector
                </label>
                <select
                  {...register("industry")}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500">
                  <option value="">Select an industry</option>
                  {industries.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Individual Information */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                Individual Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Individual Name
                  </label>
                  <input
                    type="text"
                    {...register("individualName")}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Job Title</label>
                  <input
                    type="text"
                    {...register("jobTitle")}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium">
                    Individual Contact Information
                  </label>
                  <textarea
                    {...register("individualContactInfo")}
                    rows={2}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="Additional contact details or preferred contact method"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center mb-4">
            <MessageSquare className="w-5 h-5 mr-2 text-blue-500" />
            <h2 className="text-xl font-semibold">Additional Information</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Urgency Level</label>
              <select
                {...register("urgencyLevel")}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500">
                {urgencyLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
              {errors.urgencyLevel && (
                <p className="text-sm text-red-500">
                  {errors.urgencyLevel.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Special Instructions
              </label>
              <textarea
                {...register("specialInstructions")}
                rows={3}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Verification Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="agreesToTerms"
                {...register("agreesToTerms")}
                className="w-4 h-4 text-blue-600"
              />
              <label htmlFor="agreesToTerms" className="text-sm">
                I confirm that the information provided is accurate and I agree
                to the terms and conditions.
              </label>
            </div>
            {errors.agreesToTerms && (
              <p className="text-sm text-red-500">
                {errors.agreesToTerms.message}
              </p>
            )}
          </div>
        </div>

        <button className="relative flex items-center justify-center rounded-full bg-[#FF4400] text-white hover:text-white px-3 py-2 overflow-hidden transition-all duration-300 hover:rotate-1 hover:bg-red-700 hover:ring-2 hover:ring-white ring-2 ring-red-400">
          Submit Request
          <IoArrowForwardCircleOutline className="ml-2" />
        </button>
      </form>

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

export default RequestFormPage;

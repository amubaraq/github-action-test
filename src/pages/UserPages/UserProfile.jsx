import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Save,
  Menu,
  X,
  Edit,
} from "lucide-react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import FacialVerification from "../../components/tools/FacialVerification";
import { useDispatch, useSelector } from "react-redux";
import statesAndLGAs from "../../assets/json/statesAndLGAs.json";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import backendURL from "../../config";
import LoadingSpinner from "../../components/tools/LoaddingSpinner";

// Progress Ring Component
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

// Update the PersonalInfo component to ensure date inputs are handled correctly
const PersonalInfo = ({ formik }) => (
  <section className="space-y-5">
    <h5 className="text-sm text-gray-700">
      Enter accurate information to the best of your knowledge.
    </h5>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {[
        { name: "first_name", label: "First Name", required: true },
        { name: "middle_name", label: "Middle Name" },
        { name: "last_name", label: "Last Name", required: true },
        { name: "date_of_birth", label: "Date of Birth", type: "date" },
        {
          name: "gender",
          label: "Gender",
          type: "select",
          options: ["", "male", "female", "other"],
          optionLabels: ["Select Gender", "Male", "Female", "Other"],
        },
        {
          name: "marital_status",
          label: "Marital Status",
          type: "select",
          options: ["", "single", "married", "divorced", "widowed"],
          optionLabels: [
            "Select Status",
            "Single",
            "Married",
            "Divorced",
            "Widowed",
          ],
        },
        {
          name: "religion",
          label: "Religion",
          type: "select",
          options: [
            "",
            "christianity",
            "islam",
            "judaism",
            "hinduism",
            "other",
          ],
          optionLabels: [
            "Select Religion",
            "Christianity",
            "Islam",
            "Judaism",
            "Hinduism",
            "Other",
          ],
        },
        {
          name: "number_of_children",
          label: "Number of Children",
          type: "number",
          min: 0,
        },
        { name: "family_size", label: "Family Size", type: "number", min: 0 },
        {
          name: "last_medical_check",
          label: "Last Medical Check",
          type: "date",
        },
        { name: "name_of_mosque_or_church", label: "Name of Mosque/Church" },
        { name: "referee", label: "Referee" },
      ].map((field) => (
        <div key={field.name} className="group">
          <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
            {field.label}{" "}
            {field.required && <span className="text-red-500">*</span>}
          </label>
          {field.type === "select" ? (
            <select
              name={field.name}
              value={formik.values[field.name]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 ${
                formik.touched[field.name] && formik.errors[field.name]
                  ? "border-red-400"
                  : "border-gray-200"
              }`}>
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
              value={
                field.type === "date"
                  ? formik.values[field.name]?.split("T")[0] || ""
                  : formik.values[field.name]
              }
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              min={field.min}
              className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 ${
                formik.touched[field.name] && formik.errors[field.name]
                  ? "border-red-400"
                  : "border-gray-200"
              }`}
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

// PersonalInfo Component
// const PersonalInfo = ({ formik }) => (
//   <section className="space-y-5">
//     <h5 className="text-sm text-gray-700">
//       Enter accurate information to the best of your knowledge.
//     </h5>
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//       {[
//         { name: "first_name", label: "First Name", required: true },
//         { name: "middle_name", label: "Middle Name" },
//         { name: "last_name", label: "Last Name", required: true },
//         { name: "date_of_birth", label: "Date of Birth", type: "date" },
//         {
//           name: "gender",
//           label: "Gender",
//           type: "select",
//           options: ["", "male", "female", "other"],
//           optionLabels: ["Select Gender", "Male", "Female", "Other"],
//         },
//         {
//           name: "marital_status",
//           label: "Marital Status",
//           type: "select",
//           options: ["", "single", "married", "divorced", "widowed"],
//           optionLabels: [
//             "Select Status",
//             "Single",
//             "Married",
//             "Divorced",
//             "Widowed",
//           ],
//         },
//         {
//           name: "religion",
//           label: "Religion",
//           type: "select",
//           options: [
//             "",
//             "christianity",
//             "islam",
//             "judaism",
//             "hinduism",
//             "other",
//           ],
//           optionLabels: [
//             "Select Religion",
//             "Christianity",
//             "Islam",
//             "Judaism",
//             "Hinduism",
//             "Other",
//           ],
//         },
//         {
//           name: "number_of_children",
//           label: "Number of Children",
//           type: "number",
//           min: 0,
//         },
//         { name: "family_size", label: "Family Size", type: "number", min: 0 },
//         {
//           name: "last_medical_check",
//           label: "Last Medical Check",
//           type: "date",
//         },
//         { name: "name_of_mosque_or_church", label: "Name of Mosque/Church" },
//         { name: "referee", label: "Referee" },
//       ].map((field) => (
//         <div key={field.name} className="group">
//           <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
//             {field.label}{" "}
//             {field.required && <span className="text-red-500">*</span>}
//           </label>
//           {field.type === "select" ? (
//             <select
//               name={field.name}
//               value={formik.values[field.name]}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 ${
//                 formik.touched[field.name] && formik.errors[field.name]
//                   ? "border-red-400"
//                   : "border-gray-200"
//               }`}>
//               {field.options.map((option, idx) => (
//                 <option key={option} value={option}>
//                   {field.optionLabels[idx]}
//                 </option>
//               ))}
//             </select>
//           ) : (
//             <input
//               type={field.type || "text"}
//               name={field.name}
//               value={formik.values[field.name]}
//               onChange={formik.handleChange}
//               onBlur={formik.handleBlur}
//               min={field.min}
//               className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 ${
//                 formik.touched[field.name] && formik.errors[field.name]
//                   ? "border-red-400"
//                   : "border-gray-200"
//               }`}
//               required={field.required}
//             />
//           )}
//           {formik.touched[field.name] && formik.errors[field.name] && (
//             <p className="mt-1 text-xs text-red-500">
//               {formik.errors[field.name]}
//             </p>
//           )}
//         </div>
//       ))}
//     </div>
//   </section>
// );

// NextOfKinInfo Component (New Section)
const NextOfKinInfo = ({ formik }) => (
  <section className="space-y-5">
    <h2 className="text-lg font-semibold text-gray-800">
      Next of Kin & Emergency Contact
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {[
        { name: "next_of_kin_name", label: "Next of Kin Name" },
        { name: "next_of_kin_phone", label: "Next of Kin Phone", type: "tel" },
        {
          name: "next_of_kin_email",
          label: "Next of Kin Email",
          type: "email",
        },
        { name: "emergency_contact_name", label: "Emergency Contact Name" },
        {
          name: "emergency_contact_phone",
          label: "Emergency Contact Phone",
          type: "tel",
        },
        {
          name: "emergency_contact_email",
          label: "Emergency Contact Email",
          type: "email",
        },
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
            className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 ${
              formik.touched[field.name] && formik.errors[field.name]
                ? "border-red-400"
                : "border-gray-200"
            }`}
          />
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

// ContactInfo Component
const ContactInfo = React.memo(
  ({
    formik,
    handleSocialMediaChange,
    addSocialMediaField,
    removeSocialMediaField,
  }) => {
    const states = useMemo(
      () =>
        statesAndLGAs.statesAndLGAs.map((state) => ({
          id: state.id,
          name: state.name,
        })),
      []
    );
    const selectedState = useMemo(
      () =>
        statesAndLGAs.statesAndLGAs.find(
          (state) => state.name === formik.values.state
        ),
      [formik.values.state]
    );
    const lgas = useMemo(
      () => (selectedState ? selectedState.local_governments : []),
      [selectedState]
    );

    const handleStateChange = (e) => {
      formik.handleChange(e);
      formik.setFieldValue("city", "");
    };

    return (
      <section className="space-y-5">
        <h2 className="text-lg font-semibold text-gray-800">
          Contact Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="group">
            <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 ${
                formik.touched.phone && formik.errors.phone
                  ? "border-red-400"
                  : "border-gray-200"
              }`}
              required
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="mt-1 text-xs text-red-500">{formik.errors.phone}</p>
            )}
          </div>
          <div className="group">
            <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
              Area <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="area"
              value={formik.values.area}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 ${
                formik.touched.area && formik.errors.area
                  ? "border-red-400"
                  : "border-gray-200"
              }`}
              required
            />
            {formik.touched.area && formik.errors.area && (
              <p className="mt-1 text-xs text-red-500">{formik.errors.area}</p>
            )}
          </div>
          <div className="group">
            <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
              State
            </label>
            <select
              name="state"
              value={formik.values.state}
              onChange={handleStateChange}
              onBlur={formik.handleBlur}
              className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 ${
                formik.touched.state && formik.errors.state
                  ? "border-red-400"
                  : "border-gray-200"
              }`}>
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
              City (LGA)
            </label>
            <select
              name="city"
              value={formik.values.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 ${
                formik.touched.city && formik.errors.city
                  ? "border-red-400"
                  : "border-gray-200"
              }`}
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
          <div className="group md:col-span-2">
            <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
              Current Address
            </label>
            <textarea
              name="address"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 ${
                formik.touched.address && formik.errors.address
                  ? "border-red-400"
                  : "border-gray-200"
              }`}
              rows="3"
            />
            {formik.touched.address && formik.errors.address && (
              <p className="mt-1 text-xs text-red-500">
                {formik.errors.address}
              </p>
            )}
          </div>
          <div className="group md:col-span-2">
            <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
              Permanent Address
            </label>
            <textarea
              name="permanent_address"
              value={formik.values.permanent_address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 ${
                formik.touched.permanent_address &&
                formik.errors.permanent_address
                  ? "border-red-400"
                  : "border-gray-200"
              }`}
              rows="3"
            />
            {formik.touched.permanent_address &&
              formik.errors.permanent_address && (
                <p className="mt-1 text-xs text-red-500">
                  {formik.errors.permanent_address}
                </p>
              )}
          </div>
        </div>
        <div className="space-y-3">
          <label className="block text-xs font-medium text-gray-600">
            Social Media Links <br></br>
            <span className="text-xs italic"> start with https://</span>
          </label>
          {formik.values.social_media_links.map((link, index) => (
            <div key={index} className="flex items-center gap-2 group">
              <input
                type="url"
                value={link}
                onChange={(e) => handleSocialMediaChange(index, e.target.value)}
                onBlur={formik.handleBlur}
                className={`flex-1 p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 ${
                  formik.touched.social_media_links?.[index] &&
                  formik.errors.social_media_links?.[index]
                    ? "border-red-400"
                    : "border-gray-200"
                }`}
                placeholder="https://example.com"
              />
              <button
                type="button"
                onClick={() => removeSocialMediaField(index)}
                className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200 disabled:opacity-50"
                disabled={formik.values.social_media_links.length <= 1}>
                <X size={14} />
              </button>
            </div>
          ))}
          {formik.errors.social_media_links && (
            <p className="text-xs text-red-500">
              Please enter valid URLs or leave empty
            </p>
          )}
          <button
            type="button"
            onClick={addSocialMediaField}
            className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors duration-200">
            Add Social Media
          </button>
        </div>
      </section>
    );
  }
);

// ProfessionalInfo Component
const ProfessionalInfo = ({ formik }) => (
  <section className="space-y-5">
    <h2 className="text-lg font-semibold text-gray-800">
      Professional Details
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {[
        { name: "current_place_of_work", label: "Current Place of Work" },
        { name: "last_place_of_work", label: "Last Place of Work" },
        {
          name: "qualification",
          label: "Qualification",
          type: "select",
          options: [
            "",
            "high_school",
            "undergraduate",
            "postgraduate",
            "other",
          ],
          optionLabels: [
            "Select Qualification",
            "High School",
            "Undergraduate",
            "Postgraduate",
            "Other",
          ],
        },
        {
          name: "profession",
          label: "Profession",
          type: "select",
          options: [
            "",
            "Engineer",
            "Doctor",
            "Teacher",
            "Software Developer",
            "Accountant",
            "Other",
          ],
          optionLabels: [
            "Select Profession",
            "Engineer",
            "Doctor",
            "Teacher",
            "Software Developer",
            "Accountant",
            "Other",
          ],
        },
        { name: "monthly_rent", label: "Monthly Rent", type: "number", min: 0 },
        {
          name: "house_hold_income",
          label: "Household Income",
          type: "number",
          min: 0,
        },
        { name: "net_worth", label: "Net Worth", type: "number" },
        {
          name: "current_monthly_income",
          label: "Current Monthly Income",
          type: "number",
          min: 0,
        },
      ].map((field) => (
        <div key={field.name} className="group">
          <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
            {field.label}
          </label>
          {field.type === "select" ? (
            <select
              name={field.name}
              value={formik.values[field.name]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 ${
                formik.touched[field.name] && formik.errors[field.name]
                  ? "border-red-400"
                  : "border-gray-200"
              }`}>
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
              value={formik.values[field.name]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              min={field.min}
              className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 ${
                formik.touched[field.name] && formik.errors[field.name]
                  ? "border-red-400"
                  : "border-gray-200"
              }`}
            />
          )}
          {formik.touched[field.name] && formik.errors[field.name] && (
            <p className="mt-1 text-xs text-red-500">
              {formik.errors[field.name]}
            </p>
          )}
        </div>
      ))}
      {formik.values.profession === "Other" && (
        <div className="group">
          <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
            Custom Profession
          </label>
          <input
            type="text"
            name="custom_profession"
            value={formik.values.custom_profession}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 border-gray-200"
            placeholder="Enter your profession"
          />
        </div>
      )}
      <div className="md:col-span-2 group">
        <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
          Bio
        </label>
        <ReactQuill
          theme="snow"
          value={formik.values.bio}
          onChange={(value) => formik.setFieldValue("bio", value)}
          placeholder="Tell us about yourself..."
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
    </div>
  </section>
);

// FacialVerificationStep Component
const FacialVerificationStep = ({ onComplete, formik }) => (
  <section className="space-y-5">
    <h2 className="text-lg font-semibold text-gray-800">Facial Verification</h2>
    <p className="text-sm text-gray-600">
      Please complete the facial verification process to verify your identity.
    </p>
    <FacialVerification
      onComplete={(image) => {
        formik.setFieldValue("UserImage", image);
        onComplete();
      }}
    />
  </section>
);

// ReviewSubmit Component
const ReviewSubmit = ({ formik }) => (
  <section className="space-y-5">
    <h2 className="text-lg font-semibold text-gray-800">Review & Submit</h2>
    <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <h3 className="text-base font-semibold text-gray-700 mb-3">
        Your Profile Summary
      </h3>
      <div className="mb-5">
        {formik.values.UserImage ? (
          <div className="mt-3">
            <span className="text-sm font-semibold text-blue-600">
              Verification Photo:
            </span>
            <img
              src={formik.values.UserImage}
              alt="User Verification"
              className="mt-2 w-32 h-32 object-cover rounded-md border border-gray-300"
            />
          </div>
        ) : (
          <p className="mt-3">Verification Photo: Not provided</p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
        <div>
          <h4 className="font-semibold text-blue-600 mb-2">
            Personal Information
          </h4>
          <p>
            Full Name:{" "}
            {`${formik.values.first_name} ${formik.values.middle_name} ${formik.values.last_name}`}
          </p>
          <p>Date of Birth: {formik.values.date_of_birth || "Not provided"}</p>
          <p>Gender: {formik.values.gender || "Not provided"}</p>
          <p>
            Marital Status: {formik.values.marital_status || "Not provided"}
          </p>
          <p>Religion: {formik.values.religion || "Not provided"}</p>
          <p>Number of Children: {formik.values.number_of_children || "0"}</p>
          <p>Family Size: {formik.values.family_size || "Not provided"}</p>
          <p>
            Last Medical Check:{" "}
            {formik.values.last_medical_check || "Not provided"}
          </p>
          <p>
            Name of Mosque/Church:{" "}
            {formik.values.name_of_mosque_or_church || "Not provided"}
          </p>
          <p>Referee: {formik.values.referee || "Not provided"}</p>
        </div>
        <div>
          <h4 className="font-semibold text-blue-600 mb-2">
            Next of Kin & Emergency Contact
          </h4>
          <p>
            Next of Kin Name: {formik.values.next_of_kin_name || "Not provided"}
          </p>
          <p>
            Next of Kin Phone:{" "}
            {formik.values.next_of_kin_phone || "Not provided"}
          </p>
          <p>
            Next of Kin Email:{" "}
            {formik.values.next_of_kin_email || "Not provided"}
          </p>
          <p>
            Emergency Contact Name:{" "}
            {formik.values.emergency_contact_name || "Not provided"}
          </p>
          <p>
            Emergency Contact Phone:{" "}
            {formik.values.emergency_contact_phone || "Not provided"}
          </p>
          <p>
            Emergency Contact Email:{" "}
            {formik.values.emergency_contact_email || "Not provided"}
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-blue-600 mb-2">
            Contact Information
          </h4>
          <p>Phone: {formik.values.phone}</p>
          <p>Area: {formik.values.area}</p>
          <p>
            Location:{" "}
            {`${formik.values.city || "Not provided"}, ${formik.values.state || "Not provided"}`}
          </p>
          <p>Address: {formik.values.address || "Not provided"}</p>
          <p>
            Permanent Address:{" "}
            {formik.values.permanent_address || "Not provided"}
          </p>
          <div>
            <span>Social Media:</span>
            <ul className="list-disc pl-4 mt-1">
              {formik.values.social_media_links.filter((link) => link).length >
              0 ? (
                formik.values.social_media_links.map((link, index) =>
                  link ? (
                    <li
                      key={index}
                      className="hover:text-blue-500 transition-colors">
                      {link}
                    </li>
                  ) : null
                )
              ) : (
                <li>No links provided</li>
              )}
            </ul>
          </div>
        </div>
        <div className="md:col-span-2 mt-4">
          <h4 className="font-semibold text-blue-600 mb-2">
            Professional & Income Details
          </h4>
          <p>
            Profession:{" "}
            {formik.values.profession === "Other"
              ? formik.values.custom_profession || "Not provided"
              : formik.values.profession || "Not provided"}
          </p>
          <p>
            Current Workplace:{" "}
            {formik.values.current_place_of_work || "Not provided"}
          </p>
          <p>
            Previous Workplace:{" "}
            {formik.values.last_place_of_work || "Not provided"}
          </p>
          <p>Qualification: {formik.values.qualification || "Not provided"}</p>
          <p>Monthly Rent: {formik.values.monthly_rent || "Not provided"}</p>
          <p>
            Household Income:{" "}
            {formik.values.house_hold_income || "Not provided"}
          </p>
          <p>Net Worth: {formik.values.net_worth || "Not provided"}</p>
          <p>
            Current Monthly Income:{" "}
            {formik.values.current_monthly_income || "Not provided"}
          </p>
          <div>
            <span>Bio:</span>
            <div
              className="mt-1 text-gray-600 ql-editor"
              dangerouslySetInnerHTML={{
                __html: formik.values.bio || "Not provided",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Main UserProfile Component
const UserProfile = () => {
  const { userInfo, token } = useSelector((state) => state.auth);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });
  const [formStatus, setFormStatus] = useState({
    loading: false,
    error: null,
    success: null,
    isDraft: false,
  });
  const [completionData, setCompletionData] = useState({
    personal: 0,
    nextOfKin: 0,
    contact: 0,
    professional: 0,
    verification: 0,
    overall: 0,
  });
  const [isVerificationComplete, setIsVerificationComplete] = useState(false);
  const initialFetchDone = useRef(false);

  // Add this utility function at the top of UserProfile
  const formatDateForServer = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const validationSchema = Yup.object({
    first_name: Yup.string().required("First name is required").max(255),
    last_name: Yup.string().required("Last name is required").max(255),
    phone: Yup.string()
      .matches(/^\+?[1-9]\d{1,14}$/, "Invalid phone")
      .required("Phone is required"),
    area: Yup.string().required("Area is required").max(255),
  });

  const formik = useFormik({
    initialValues: {
      first_name: "",
      middle_name: "",
      last_name: "",
      date_of_birth: "",
      gender: "",
      marital_status: "",
      religion: "",
      number_of_children: "",
      family_size: "",
      last_medical_check: "",
      name_of_mosque_or_church: "",
      referee: "",
      next_of_kin_name: "",
      next_of_kin_phone: "",
      next_of_kin_email: "",
      emergency_contact_name: "",
      emergency_contact_phone: "",
      emergency_contact_email: "",
      phone: "+234",
      area: "",
      state: "",
      city: "",
      address: "",
      permanent_address: "",
      social_media_links: ["https://www.media.com"],
      monthly_rent: "",
      house_hold_income: "",
      net_worth: "",
      current_monthly_income: "",
      current_place_of_work: "",
      last_place_of_work: "",
      qualification: "",
      profession: "",
      custom_profession: "",
      bio: "",
      UserImage: null,
    },
    validationSchema,
    onSubmit: (values) => handleSubmit(values),
  });

  const steps = [
    { id: 1, title: "Personal", component: PersonalInfo, weight: 30 },
    { id: 2, title: "Next of Kin", component: NextOfKinInfo, weight: 20 },
    {
      id: 3,
      title: "Contact",
      component: (props) => (
        <ContactInfo
          {...props}
          handleSocialMediaChange={handleSocialMediaChange}
          addSocialMediaField={addSocialMediaField}
          removeSocialMediaField={removeSocialMediaField}
        />
      ),
      weight: 30,
    },
    { id: 4, title: "Professional", component: ProfessionalInfo, weight: 10 },
    {
      id: 5,
      title: "Verification",
      component: (props) => (
        <FacialVerificationStep
          {...props}
          onComplete={handleVerificationComplete}
        />
      ),
      weight: 10,
    },
    { id: 6, title: "Review", component: ReviewSubmit, weight: 0 },
  ];

  const showAlertMessage = (message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  const handleApiCall = async (url, data, isDraft = false) => {
    setFormStatus({ loading: true, error: null, success: null, isDraft });
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok)
        throw new Error((await response.json()).message || "Request failed");
      await response.json();
      showAlertMessage(isDraft ? "Draft saved" : "Profile updated", "success");
      setFormStatus({ loading: false, error: null, success: true, isDraft });
    } catch (error) {
      showAlertMessage(error.message, "destructive");
      setFormStatus({
        loading: false,
        error: error.message,
        success: null,
        isDraft,
      });
    }
  };

  // const handleSubmit = async (values) => {
  //   const cleanedData = {
  //     ...values,
  //     social_media_links: values.social_media_links.filter((link) =>
  //       link?.trim()
  //     ),
  //   };
  //   await handleApiCall(
  //     `${backendURL}/api/create/user/profile`,
  //     cleanedData,
  //     false
  //   );
  //   setIsEditMode(false);
  //   setCurrentStep(1);
  // };
  // Update the handleSubmit function in UserProfile
  const handleSubmit = async (values) => {
    const formattedValues = {
      ...values,
      date_of_birth: formatDateForServer(values.date_of_birth),
      last_medical_check: formatDateForServer(values.last_medical_check),
      social_media_links: values.social_media_links.filter((link) =>
        link?.trim()
      ),
    };
    await handleApiCall(
      `${backendURL}/api/create/user/profile`,
      formattedValues,
      false
    );
    setIsEditMode(false);
    setCurrentStep(1);
  };
  const fetchProfileData = async () => {
    if (initialFetchDone.current || !userInfo?.slug) return;
    const controller = new AbortController();
    setFormStatus({
      loading: true,
      error: null,
      success: null,
      isDraft: false,
    });
    try {
      const slugResponse = await fetch(
        `${backendURL}/api/user/${userInfo.slug}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        }
      );
      if (!slugResponse.ok)
        throw new Error(
          (await slugResponse.json()).message || "Slug fetch failed"
        );
      const slugData = await slugResponse.json();
      const slug = slugData?.data?.user?.contact?.slug;
      console.log(slug);

      if (!slug) {
        setIsEditMode(true);
        setFormStatus({
          loading: false,
          error: null,
          success: null,
          isDraft: false,
        });
        return;
      }

      const profileResponse = await fetch(`${backendURL}/api/profile/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      });
      if (!profileResponse.ok) {
        const errorData = await profileResponse.json();
        if (errorData.message === "Profile not found") {
          setIsEditMode(true);
          setFormStatus({
            loading: false,
            error: null,
            success: null,
            isDraft: false,
          });
          return;
        }
        throw new Error(errorData.message || "Profile fetch failed");
      }

      const data = await profileResponse.json();
      if (data.contact) {
        const socialMediaArray = data.contact.social_media_links
          ? Object.values(data.contact.social_media_links).filter((link) =>
              link?.trim()
            )
          : [""];
        const newValues = {
          ...formik.initialValues,
          ...data.contact,
          social_media_links: socialMediaArray.length ? socialMediaArray : [""],
          UserImage: data.userPhoto,
          custom_profession:
            !["Engineer", "Doctor"].includes(data.contact.profession) &&
            data.contact.profession
              ? data.contact.profession
              : "",
          profession: ["Engineer", "Doctor"].includes(data.contact.profession)
            ? data.contact.profession
            : data.contact.profession
              ? "Other"
              : "",
        };
        formik.setValues(newValues);
        setIsEditMode(false);
        if (data.userPhoto) setIsVerificationComplete(true);
      }
    } catch (error) {
      if (!error.message.includes("not found") && error.name !== "AbortError")
        showAlertMessage(error.message, "destructive");
      setIsEditMode(true);
    } finally {
      setFormStatus({
        loading: false,
        error: null,
        success: null,
        isDraft: false,
      });
      initialFetchDone.current = true;
    }
    return () => controller.abort();
  };

  useEffect(() => {
    fetchProfileData();
  }, [userInfo?.slug, token]);

  useEffect(() => {
    const personal =
      (["first_name", "last_name"].filter((f) => formik.values[f]).length / 2) *
      100;
    const nextOfKin =
      ["next_of_kin_name"].filter((f) => formik.values[f]).length * 100;
    const contact =
      (["phone", "area"].filter((f) => formik.values[f]).length / 2) * 100;
    const professional =
      ["profession"].filter((f) => formik.values[f]).length * 100;
    const verification =
      isVerificationComplete || formik.values.UserImage ? 100 : 0;
    const overall = Math.round(
      personal * 0.3 +
        nextOfKin * 0.2 +
        contact * 0.3 +
        professional * 0.1 +
        verification * 0.1
    );
    setCompletionData({
      personal,
      nextOfKin,
      contact,
      professional,
      verification,
      overall,
    });
  }, [formik.values, isVerificationComplete]);

  const handleVerificationComplete = () => {
    setIsVerificationComplete(true);
    setCurrentStep(6);
  };

  const handleNext = () => {
    formik.validateForm().then((errors) => {
      const stepFields = {
        1: ["first_name", "last_name"],
        2: ["next_of_kin_name"],
        3: ["phone", "area"],
        4: [],
        5: [],
        6: [],
      };
      const relevantErrors = Object.keys(errors).filter((key) =>
        stepFields[currentStep].includes(key)
      );
      if (relevantErrors.length === 0)
        setCurrentStep((prev) => Math.min(prev + 1, steps.length));
      else {
        formik.setTouched(
          relevantErrors.reduce((acc, key) => ({ ...acc, [key]: true }), {})
        );
        showAlertMessage("Fix errors", "destructive");
      }
    });
  };

  const handleSocialMediaChange = (index, value) => {
    const updatedLinks = [...formik.values.social_media_links];
    updatedLinks[index] = value;
    formik.setFieldValue("social_media_links", updatedLinks);
  };

  const addSocialMediaField = () =>
    formik.setFieldValue("social_media_links", [
      ...formik.values.social_media_links,
      "",
    ]);
  const removeSocialMediaField = (index) =>
    formik.setFieldValue(
      "social_media_links",
      formik.values.social_media_links.filter((_, i) => i !== index)
    );

  const saveDraft = () =>
    handleApiCall(
      `${backendURL}/api/create/user/profile`,
      {
        ...formik.values,
        social_media_links: formik.values.social_media_links.filter((link) =>
          link?.trim()
        ),
      },
      true
    );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row p-3 md:p-5 mid:mt-20">
      <aside className="hidden lg:block w-64 bg-white shadow-md rounded-lg p-5 sticky top-5 h-[calc(100vh-2.5rem)]">
        <h2 className="text-xl font-bold text-gray-800 mb-5">Profile Setup</h2>
        <div className="flex justify-center mb-5">
          <ProgressRing progress={completionData.overall} />
        </div>
        <nav className="space-y-2">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              className={`w-full flex items-center p-2 rounded-md text-sm transition-all duration-200 ${
                currentStep === step.id
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              }`}
              disabled={!isEditMode}>
              <span
                className={`w-5 h-5 mr-2 flex items-center justify-center rounded-full text-xs ${
                  currentStep > step.id
                    ? "bg-green-500 text-white"
                    : currentStep === step.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                }`}>
                {currentStep > step.id ? <Check size={12} /> : step.id}
              </span>
              {step.title}
              <span className="ml-auto text-xs font-medium">
                {step.id === 1
                  ? `${completionData.personal}%`
                  : step.id === 2
                    ? `${completionData.nextOfKin}%`
                    : step.id === 3
                      ? `${completionData.contact}%`
                      : step.id === 4
                        ? `${completionData.professional}%`
                        : step.id === 5
                          ? `${completionData.verification}%`
                          : ""}
              </span>
            </button>
          ))}
        </nav>
      </aside>

      <div
        className={`fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white shadow-md p-5 transition-transform duration-300 z-50 lg:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-bold text-gray-800">Profile Setup</h2>
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
              className={`w-full flex items-center p-2 rounded-md text-sm transition-all duration-200 ${
                currentStep === step.id
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              }`}
              disabled={!isEditMode}>
              <span
                className={`w-5 h-5 mr-2 flex items-center justify-center rounded-full text-xs ${
                  currentStep > step.id
                    ? "bg-green-500 text-white"
                    : currentStep === step.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                }`}>
                {currentStep > step.id ? <Check size={12} /> : step.id}
              </span>
              {step.title}
              <span className="ml-auto text-xs font-medium">
                {step.id === 1
                  ? `${completionData.personal}%`
                  : step.id === 2
                    ? `${completionData.nextOfKin}%`
                    : step.id === 3
                      ? `${completionData.contact}%`
                      : step.id === 4
                        ? `${completionData.professional}%`
                        : step.id === 5
                          ? `${completionData.verification}%`
                          : ""}
              </span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 bg-white shadow-md rounded-lg p-2 md:p-2 lg:ml-5 mt-4 lg:mt-0">
        <div className="flex justify-between items-center mb-5">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <Menu size={24} />
          </button>
          <h1 className="text-xl mid:text-sm font-bold text-gray-800">
            {isEditMode
              ? currentStep <= steps.length
                ? `Step ${currentStep}: ${steps[currentStep - 1].title}`
                : "Profile Complete"
              : "Profile Summary"}
          </h1>
        </div>

        {formStatus.loading ? (
          <LoadingSpinner />
        ) : !isEditMode ? (
          <div className="space-y-6">
            <div className="flex justify-center mb-6">
              {formik.values.UserImage ? (
                <div className="relative">
                  <img
                    src={formik.values.UserImage}
                    alt="User Verification"
                    className="w-24 h-24 rounded-full object-cover border-2 border-blue-200 shadow-md"
                  />
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    Verified
                  </span>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-medium shadow-md">
                  No Photo
                </div>
              )}
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wide mb-3">
                    Personal Information
                  </h3>
                  <div className="space-y-2 text-xs text-gray-700">
                    <p>
                      <span className="font-medium">Full Name:</span>{" "}
                      {`${formik.values.first_name} ${formik.values.middle_name} ${formik.values.last_name}`.trim() ||
                        "Not provided"}
                    </p>
                    <p>
                      <span className="font-medium">Date of Birth:</span>{" "}
                      {formik.values.date_of_birth || "Not provided"}
                    </p>
                    <p>
                      <span className="font-medium">Gender:</span>{" "}
                      {formik.values.gender || "Not provided"}
                    </p>
                    <p>
                      <span className="font-medium">Marital Status:</span>{" "}
                      {formik.values.marital_status || "Not provided"}
                    </p>
                    <p>
                      <span className="font-medium">Religion:</span>{" "}
                      {formik.values.religion || "Not provided"}
                    </p>
                    <p>
                      <span className="font-medium">Number of Children:</span>{" "}
                      {formik.values.number_of_children || "0"}
                    </p>
                    <p>
                      <span className="font-medium">Family Size:</span>{" "}
                      {formik.values.family_size || "Not provided"}
                    </p>
                    <p>
                      <span className="font-medium">Last Medical Check:</span>{" "}
                      {formik.values.last_medical_check || "Not provided"}
                    </p>
                    <p>
                      <span className="font-medium">
                        Name of Mosque/Church:
                      </span>{" "}
                      {formik.values.name_of_mosque_or_church || "Not provided"}
                    </p>
                    <p>
                      <span className="font-medium">Referee:</span>{" "}
                      {formik.values.referee || "Not provided"}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wide mb-3">
                    Next of Kin & Emergency Contact
                  </h3>
                  <div className="space-y-2 text-xs text-gray-700">
                    <p>
                      <span className="font-medium">Next of Kin Name:</span>{" "}
                      {formik.values.next_of_kin_name || "Not provided"}
                    </p>
                    <p>
                      <span className="font-medium">Next of Kin Phone:</span>{" "}
                      {formik.values.next_of_kin_phone || "Not provided"}
                    </p>
                    <p>
                      <span className="font-medium">Next of Kin Email:</span>{" "}
                      {formik.values.next_of_kin_email || "Not provided"}
                    </p>
                    <p>
                      <span className="font-medium">
                        Emergency Contact Name:
                      </span>{" "}
                      {formik.values.emergency_contact_name || "Not provided"}
                    </p>
                    <p>
                      <span className="font-medium">
                        Emergency Contact Phone:
                      </span>{" "}
                      {formik.values.emergency_contact_phone || "Not provided"}
                    </p>
                    <p>
                      <span className="font-medium">
                        Emergency Contact Email:
                      </span>{" "}
                      {formik.values.emergency_contact_email || "Not provided"}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wide mb-3">
                    Contact Information
                  </h3>
                  <div className="space-y-2 text-xs text-gray-700">
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {formik.values.phone || "Not provided"}
                    </p>
                    <p>
                      <span className="font-medium">Area:</span>{" "}
                      {formik.values.area || "Not provided"}
                    </p>
                    <p>
                      <span className="font-medium">Location:</span>{" "}
                      {`${formik.values.city || "Not provided"}, ${formik.values.state || "Not provided"}`}
                    </p>
                    <p>
                      <span className="font-medium">Address:</span>{" "}
                      {formik.values.address || "Not provided"}
                    </p>
                    <p>
                      <span className="font-medium">Permanent Address:</span>{" "}
                      {formik.values.permanent_address || "Not provided"}
                    </p>
                    <div>
                      <span className="font-medium">Social Media:</span>
                      <ul className="list-disc pl-4 mt-1 text-xs">
                        {formik.values.social_media_links.filter((link) => link)
                          .length > 0 ? (
                          formik.values.social_media_links.map((link, index) =>
                            link ? (
                              <li
                                key={index}
                                className="hover:text-blue-500 transition-colors">
                                {link}
                              </li>
                            ) : null
                          )
                        ) : (
                          <li>No links provided</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <h3 className="text-sm font-bold text-blue-700 uppercase tracking-wide mb-3 mt-4">
                    Professional & Income Details
                  </h3>
                  <div className="space-y-2 text-xs text-gray-700">
                    <p>
                      <span className="font-medium">Profession:</span>{" "}
                      {formik.values.profession === "Other"
                        ? formik.values.custom_profession || "Not provided"
                        : formik.values.profession || "Not provided"}
                    </p>
                    <p>
                      <span className="font-medium">Current Workplace:</span>{" "}
                      {formik.values.current_place_of_work || "Not provided"}
                    </p>
                    <p>
                      <span className="font-medium">Previous Workplace:</span>{" "}
                      {formik.values.last_place_of_work || "Not provided"}
                    </p>
                    <p>
                      <span className="font-medium">Qualification:</span>{" "}
                      {formik.values.qualification || "Not provided"}
                    </p>
                    <p>
                      <span className="font-medium">Monthly Rent:</span>{" "}
                      {formik.values.monthly_rent || "Not provided"}
                    </p>
                    <p>
                      <span className="font-medium">Household Income:</span>{" "}
                      {formik.values.house_hold_income || "Not provided"}
                    </p>
                    <p>
                      <span className="font-medium">Net Worth:</span>{" "}
                      {formik.values.net_worth || "Not provided"}
                    </p>
                    <p>
                      <span className="font-medium">
                        Current Monthly Income:
                      </span>{" "}
                      {formik.values.current_monthly_income || "Not provided"}
                    </p>
                    <div>
                      <span className="font-medium">Bio:</span>
                      <div
                        className="mt-1 text-gray-600 ql-editor text-xs"
                        dangerouslySetInnerHTML={{
                          __html: formik.values.bio || "Not provided",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsEditMode(true)}
              className="mt-6 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center">
              <Edit size={16} className="mr-2" /> Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            {currentStep <= steps.length ? (
              steps[currentStep - 1].component({ formik })
            ) : (
              <div className="text-center space-y-5 py-12 bg-gray-50 rounded-lg border border-green-200 shadow-sm max-w-xl mx-auto">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500 text-white mb-5 ring-2 ring-green-300">
                  <Check size={32} strokeWidth={2.5} />
                </div>
                <h2 className="text-lg font-bold text-green-600">
                  Profile Submitted Successfully
                </h2>
                <p className="text-sm text-gray-600 max-w-md mx-auto">
                  Your profile is now complete! Explore the platform and manage
                  your details from your dashboard.
                </p>
                <button
                  type="button"
                  className="mt-6 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={() => (window.location.href = "/user/MyDashBoad")}>
                  Go to Dashboard
                </button>
              </div>
            )}
            {currentStep <= steps.length &&
              currentStep !== 5 &&
              !formStatus.loading && (
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
                      className="flex-1 sm:flex-initial px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50">
                      <Save size={18} className="inline mr-1" /> Save Draft
                    </button>
                    <button
                      type={currentStep === steps.length ? "submit" : "button"}
                      onClick={
                        currentStep === steps.length ? undefined : handleNext
                      }
                      disabled={formStatus.loading}
                      className="flex-1 sm:flex-initial px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50">
                      {currentStep === steps.length ? "Submit" : "Next"}
                      <ChevronRight size={18} className="inline ml-1" />
                    </button>
                  </div>
                </div>
              )}
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
      </main>
    </div>
  );
};

export default UserProfile;

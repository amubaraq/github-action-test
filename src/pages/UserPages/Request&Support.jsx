import React, { useState, useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import backendURL from "../../config";
import { Send, X } from "lucide-react";

// Modal Component for Missing Documents
const DocumentModal = ({ show, onClose, missingDocs }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">Missing Documents</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Please upload the following required documents before submitting your
          request:
        </p>
        <ul className="list-disc pl-5 mb-4 text-sm text-gray-700">
          {missingDocs.map((doc, index) => (
            <li key={index}>
              {doc.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </li>
          ))}
        </ul>
        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Close
        </button>
      </div>
    </div>
  );
};

const RequestSupport = () => {
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
  const [userSlug, setUserSlug] = useState(null);
  const [showDocModal, setShowDocModal] = useState(false);
  const [missingDocs, setMissingDocs] = useState([]);

  const showAlertMessage = useCallback((message, variant = "default") => {
    setAlertConfig({ message, variant });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  }, []);

  const fetchUserSlug = useCallback(async () => {
    try {
      const response = await fetch(`${backendURL}/api/user/${userInfo?.slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to fetch user data");
      const data = await response.json();
      const newSlug = data?.data?.user?.contact?.slug;
      setUserSlug(newSlug || null);
      return newSlug;
    } catch (error) {
      if (!error.message.includes("not found"))
        showAlertMessage(error.message, "destructive");
      return null;
    }
  }, [userInfo?.slug, token, showAlertMessage]);

  const fetchProfile = useCallback(
    async (slugToUse) => {
      const slug = slugToUse || userSlug;
      if (!slug) return setFormStatus((prev) => ({ ...prev, loading: false }));
      try {
        setFormStatus((prev) => ({ ...prev, loading: true, error: null }));
        const response = await fetch(`${backendURL}/api/profile/${slug}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Profile check failed");
        setFormStatus((prev) => ({ ...prev, loading: false }));
      } catch (error) {
        showAlertMessage(error.message, "destructive");
        setFormStatus((prev) => ({
          ...prev,
          loading: false,
          error: error.message,
        }));
      }
    },
    [token, showAlertMessage, userSlug]
  );

  const handleApiCall = useCallback(
    async (url, data) => {
      try {
        setFormStatus((prev) => ({
          ...prev,
          loading: true,
          error: null,
          success: null,
        }));
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        if (!response.ok) {
          if (response.status === 400 && result.missing_documents) {
            setMissingDocs(result.missing_documents);
            setShowDocModal(true);
            setFormStatus((prev) => ({ ...prev, loading: false }));
            return;
          }
          const statusErrors = {
            400: `Missing documents: ${result.missing_documents?.join(", ") || "Unknown"}`,
            401: "Unauthorized. Please log in.",
            422: `Validation failed: ${Object.values(result.errors || {})
              .flat()
              .join(", ")}`,
            500: "Server error occurred.",
          };
          throw new Error(
            result.message || statusErrors[response.status] || "Request failed"
          );
        }
        showAlertMessage("Support request submitted successfully!", "success");
        setFormStatus((prev) => ({ ...prev, loading: false, success: true }));
        return result;
      } catch (error) {
        showAlertMessage(error.message, "destructive");
        setFormStatus((prev) => ({
          ...prev,
          loading: false,
          error: error.message,
          success: null,
        }));
        throw error;
      }
    },
    [token, showAlertMessage]
  );

  const validate = (values) => {
    const errors = {};
    if (!values.support_type) errors.support_type = "Support type is required";
    else {
      switch (values.support_type) {
        case "job_seeker":
          if (!values.employment_status)
            errors.employment_status = "Employment status is required";
          if (!values.skills?.filter((skill) => skill.trim()).length)
            errors.skills = "At least one skill is required";
          break;
        case "widower":
          if (!values.date_of_loss)
            errors.date_of_loss = "Date of loss is required";
          if (!values.dependents_count)
            errors.dependents_count = "Number of dependents is required";
          break;
        case "senior_citizen":
          if (!values.age) errors.age = "Age is required";
          else if (values.age < 60) errors.age = "Must be 60 or older";
          break;
        case "single_parent":
          if (!values.children_count)
            errors.children_count = "Number of children is required";
          else if (values.children_count < 1 || values.children_count > 3)
            errors.children_count = "Must have 1 to 3 children";
          if (!values.child_ages?.filter((age) => age.trim()).length)
            errors.child_ages = "Child ages are required";
          break;
        case "child_benefit":
          if (!values.number_of_children)
            errors.number_of_children = "Number of children is required";
          if (!values.child_age?.length)
            errors.child_age = "Child ages are required";
          if (!values.family_income)
            errors.family_income = "Family income is required";
          if (!values.guardian_status)
            errors.guardian_status = "School status is required";
          break;
        case "empowerment":
          if (!values.program_interest)
            errors.program_interest = "Program interest is required";
          if (!values.current_skills?.filter((skill) => skill.trim()).length)
            errors.current_skills = "At least one skill is required";
          break;
        default:
          break;
      }
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      support_type: "",
      employment_status: "",
      skills: [""],
      previous_experience: "",
      desired_position: "",
      availability: "",
      date_of_loss: "",
      dependents_count: "",
      support_needed: "",
      income_management: "",
      age: "",
      disability_status: "",
      medical_conditions: "",
      living_arrangement: "",
      financial_assistance_needed: "",
      caregiver_needs: "",
      children_count: "",
      child_ages: [""],
      child_support_status: "",
      childcare_assistance: "",
      number_of_children: "",
      child_age: [""],
      family_income: "",
      guardian_status: "",
      disability_status_of_child: "",
      program_interest: "",
      current_skills: [""],
      goals: "",
      barriers_to_achievement: "",
      desired_outcome: "",
    },
    validate,
    onSubmit: async (values) => {
      try {
        const payload = { support_type: values.support_type };
        switch (values.support_type) {
          case "job_seeker":
            payload.employment_status = values.employment_status;
            payload.skills = values.skills
              .filter((skill) => skill.trim())
              .join(", ");
            payload.previous_experience = values.previous_experience || null;
            payload.desired_position = values.desired_position || null;
            payload.availability = values.availability || null;
            break;
          case "widower":
            payload.date_of_loss = values.date_of_loss;
            payload.dependents_count = values.dependents_count;
            payload.support_needed = values.support_needed || null;
            payload.income_management = values.income_management || null;
            break;
          case "senior_citizen":
            payload.age = values.age;
            payload.disability_status = values.disability_status || null;
            payload.medical_conditions = values.medical_conditions || null;
            payload.living_arrangement = values.living_arrangement || null;
            payload.financial_assistance_needed =
              values.financial_assistance_needed || null;
            payload.caregiver_needs = values.caregiver_needs || null;
            break;
          case "single_parent":
            payload.children_count = values.children_count;
            payload.child_ages = values.child_ages
              .map((age) => parseInt(age, 10))
              .filter((age) => !isNaN(age));
            payload.child_support_status = values.child_support_status || null;
            payload.employment_status = values.employment_status || null;
            payload.childcare_assistance = values.childcare_assistance || null;
            break;
          case "child_benefit":
            payload.number_of_children = values.number_of_children;
            payload.child_age = values.child_age
              .map((age) => parseInt(age, 10))
              .filter((age) => !isNaN(age));
            payload.family_income = values.family_income;
            payload.guardian_status = values.guardian_status;
            payload.disability_status_of_child =
              values.disability_status_of_child || null;
            break;
          case "empowerment":
            payload.program_interest = values.program_interest;
            payload.current_skills = values.current_skills
              .filter((skill) => skill.trim())
              .join(", ");
            payload.goals = values.goals || null;
            payload.barriers_to_achievement =
              values.barriers_to_achievement || null;
            payload.desired_outcome = values.desired_outcome || null;
            payload.support_needed = values.support_needed || null;
            break;
          default:
            throw new Error("Invalid support type selected.");
        }
        await handleApiCall(`${backendURL}/api/request/support`, payload);
        formik.resetForm();
      } catch (error) {
        console.error("Submission failed:", error);
      }
    },
  });

  const handleListChange = (fieldName, index, value) => {
    const newList = [...formik.values[fieldName]];
    newList[index] = value;
    formik.setFieldValue(fieldName, newList);
  };

  const addListItem = (fieldName) => {
    formik.setFieldValue(fieldName, [...formik.values[fieldName], ""]);
  };

  const removeListItem = (fieldName, index) => {
    const newList = formik.values[fieldName].filter((_, i) => i !== index);
    formik.setFieldValue(fieldName, newList);
  };

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

  const renderTextarea = (name, label, placeholder, props = {}) => (
    <div className="group">
      <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800">
        {label} {props.required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        name={name}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 ${
          formik.touched[name] && formik.errors[name]
            ? "border-red-400"
            : "border-gray-200"
        }`}
        rows="3"
        placeholder={placeholder}
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
        onChange={formik.handleChange}
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

  const renderSkillList = (fieldName, label) => (
    <div className="space-y-3">
      <label className="block text-xs font-medium text-gray-600">
        {label} <span className="text-red-500">*</span>
      </label>
      {formik.values[fieldName].map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => handleListChange(fieldName, index, e.target.value)}
            onBlur={formik.handleBlur}
            className={`flex-1 p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 ${
              formik.touched[fieldName] && formik.errors[fieldName]
                ? "border-red-400"
                : "border-gray-200"
            }`}
            placeholder={`${label.slice(0, -1)} ${index + 1}`}
          />
          <button
            type="button"
            onClick={() => removeListItem(fieldName, index)}
            className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
            disabled={formik.values[fieldName].length <= 1}>
            <X size={14} />
          </button>
        </div>
      ))}
      {formik.touched[fieldName] && formik.errors[fieldName] && (
        <p className="text-xs text-red-500">{formik.errors[fieldName]}</p>
      )}
      <button
        type="button"
        onClick={() => addListItem(fieldName)}
        className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700">
        Add {label.slice(0, -1)}
      </button>
    </div>
  );

  const renderAdditionalFields = () => {
    const { support_type } = formik.values;
    switch (support_type) {
      case "job_seeker":
        return (
          <>
            {renderSelect(
              "employment_status",
              "Employment Status",
              [
                { value: "", label: "Select Status" },
                { value: "employed", label: "Employed" },
                { value: "unemployed", label: "Unemployed" },
                { value: "self-employed", label: "Self-Employed" },
              ],
              { required: true }
            )}
            {renderSkillList("skills", "Skills")}
            {renderTextarea(
              "previous_experience",
              "Previous Experience",
              "Describe your previous experience..."
            )}
            {renderInput("desired_position", "Desired Position", "text", {
              placeholder: "e.g., Software Engineer",
            })}
            {renderInput("availability", "Availability", "text", {
              placeholder: "e.g., Immediate, 2 weeks notice",
            })}
          </>
        );
      case "widower":
        return (
          <>
            {renderInput("date_of_loss", "Date of Loss", "date", {
              required: true,
            })}
            {renderInput("dependents_count", "Number of Dependents", "number", {
              min: "0",
              required: true,
            })}
            {renderTextarea(
              "support_needed",
              "Support Needed",
              "Describe the support you need..."
            )}
            {renderTextarea(
              "income_management",
              "Income Management",
              "Describe how you manage your income..."
            )}
          </>
        );
      case "senior_citizen":
        return (
          <>
            {renderInput("age", "Age", "number", { min: "60", required: true })}
            {renderSelect("disability_status", "Disability Status", [
              { value: "", label: "Select Status" },
              { value: "yes", label: "Yes" },
              { value: "no", label: "No" },
            ])}
            {renderTextarea(
              "medical_conditions",
              "Medical Conditions",
              "Describe any medical conditions..."
            )}
            {renderSelect("living_arrangement", "Living Arrangement", [
              { value: "", label: "Select Arrangement" },
              { value: "alone", label: "Alone" },
              { value: "with_family", label: "With Family" },
              { value: "assisted_living", label: "Assisted Living" },
            ])}
            {renderTextarea(
              "financial_assistance_needed",
              "Financial Assistance Needed",
              "Describe financial assistance needed..."
            )}
            {renderTextarea(
              "caregiver_needs",
              "Caregiver Needs",
              "Describe caregiver needs..."
            )}
          </>
        );
      case "single_parent":
        return (
          <>
            {renderInput("children_count", "Number of Children", "number", {
              min: "1",
              max: "3",
              required: true,
            })}
            {renderSkillList("child_ages", "Child Ages")}
            {renderSelect("child_support_status", "Child Support Status", [
              { value: "", label: "Select Status" },
              { value: "receiving", label: "Receiving" },
              { value: "not_receiving", label: "Not Receiving" },
              { value: "pending", label: "Pending" },
            ])}
            {renderSelect("employment_status", "Employment Status", [
              { value: "", label: "Select Status" },
              { value: "employed", label: "Employed" },
              { value: "unemployed", label: "Unemployed" },
              { value: "self-employed", label: "Self-Employed" },
            ])}
            {renderTextarea(
              "childcare_assistance",
              "Childcare Assistance",
              "Describe childcare assistance needed..."
            )}
          </>
        );
      case "child_benefit":
        return (
          <>
            {renderInput("number_of_children", "Number of Children", "number", {
              min: "1",
              max: "3",
              required: true,
            })}
            {renderSkillList("child_age", "Child Ages")}
            {renderInput("family_income", "Family Income", "number", {
              min: "0",
              required: true,
            })}
            {renderSelect(
              "guardian_status",
              "Child School Status",
              [
                { value: "", label: "Select Status" },
                { value: "enrolled", label: "Enrolled" },
                { value: "not_enrolled", label: "Not Enrolled" },
              ],
              { required: true }
            )}
            {renderSelect(
              "disability_status_of_child",
              "Disability Status of Child",
              [
                { value: "", label: "Select Status" },
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ]
            )}
          </>
        );
      case "empowerment":
        return (
          <>
            {renderInput("program_interest", "Program Interest", "text", {
              required: true,
            })}
            {renderSkillList("current_skills", "Current Skills")}
            {renderTextarea("goals", "Goals", "Describe your goals...")}
            {renderTextarea(
              "barriers_to_achievement",
              "Barriers to Achievement",
              "Describe barriers..."
            )}
            {renderTextarea(
              "desired_outcome",
              "Desired Outcome",
              "Describe your desired outcome..."
            )}
            {renderTextarea(
              "support_needed",
              "Support Needed",
              "Describe the support you need..."
            )}
          </>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    const checkProfileCompletion = async () => {
      if (!userInfo?.slug || !token) {
        setFormStatus((prev) => ({
          ...prev,
          loading: false,
          error: "User information or token missing. Please log in.",
        }));
        return;
      }
      const fetchedSlug = await fetchUserSlug();
      if (fetchedSlug) await fetchProfile(fetchedSlug);
      else
        setFormStatus((prev) => ({
          ...prev,
          loading: false,
          error: "User profile not found. Please create a profile first.",
        }));
    };
    checkProfileCompletion();
  }, [userInfo?.slug, token, fetchUserSlug, fetchProfile]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-3 md:p-5 mid:mt-14">
      <main className="flex-1 bg-white shadow-md rounded-lg p-2 md:p-5">
        <h1 className="text-xl font-bold text-gray-800 mb-5">
          Request Support
        </h1>
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
          <form onSubmit={formik.handleSubmit}>
            <div className="space-y-5">
              {renderSelect(
                "support_type",
                "Support Type",
                [
                  { value: "", label: "Select Support Type" },
                  { value: "job_seeker", label: "Job Seeker" },
                  { value: "widower", label: "Widower" },
                  { value: "senior_citizen", label: "Senior Citizen" },
                  { value: "single_parent", label: "Single Parent" },
                  { value: "child_benefit", label: "Child Benefit" },
                  { value: "empowerment", label: "Empowerment" },
                ],
                {
                  required: true,
                  onChange: (e) => {
                    formik.handleChange(e);
                    formik.setValues({
                      support_type: e.target.value,
                      employment_status: "",
                      skills: [""],
                      previous_experience: "",
                      desired_position: "",
                      availability: "",
                      date_of_loss: "",
                      dependents_count: "",
                      support_needed: "",
                      income_management: "",
                      age: "",
                      disability_status: "",
                      medical_conditions: "",
                      living_arrangement: "",
                      financial_assistance_needed: "",
                      caregiver_needs: "",
                      children_count: "",
                      child_ages: [""],
                      child_support_status: "",
                      childcare_assistance: "",
                      number_of_children: "",
                      child_age: [""],
                      family_income: "",
                      guardian_status: "",
                      disability_status_of_child: "",
                      program_interest: "",
                      current_skills: [""],
                      goals: "",
                      barriers_to_achievement: "",
                      desired_outcome: "",
                    });
                  },
                }
              )}
              {formik.values.support_type && (
                <div className="space-y-5">
                  <h2 className="text-base font-semibold text-gray-700">
                    Additional Information for{" "}
                    {formik.values.support_type.replace("_", " ").toUpperCase()}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {renderAdditionalFields()}
                  </div>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={formStatus.loading || !formik.values.support_type}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center">
                {formStatus.loading ? "Submitting..." : "Submit Request"}
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
        <DocumentModal
          show={showDocModal}
          onClose={() => setShowDocModal(false)}
          missingDocs={missingDocs}
        />
      </main>
    </div>
  );
};

export default RequestSupport;

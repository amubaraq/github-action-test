import React, { useState, useEffect, useRef, useCallback } from "react";
import { useFormik } from "formik";
import statesAndLGAs from "../../assets/json/statesAndLGAs.json";
import * as Yup from "yup";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import { useSelector } from "react-redux";
import { Check, Edit } from "lucide-react";
import backendURL from "../../config";
import LoadingSpinner from "../../components/tools/LoaddingSpinner";

const UserFinanceForm = React.memo(() => {
  const { userInfo, token } = useSelector((state) => state.auth);
  const [formState, setFormState] = useState({
    loading: true,
    submitLoading: false,
    error: null,
    success: false,
    submitted: false,
    isEditing: false,
  });
  const [alert, setAlert] = useState({
    show: false,
    variant: "default",
    message: "",
  });

  // Track if the initial fetch has been done
  const initialFetchDone = useRef(false);

  // Validation schema - defined outside component to prevent recreation
  const validationSchema = Yup.object({
    account_name: Yup.string()
      .max(255, "Account name must be 255 characters or less")
      .required("Account name is required"),
    account_number: Yup.string()
      .matches(/^\d{10}$/, "Account number must be exactly 10 digits")
      .required("Account number is required"),
    bank: Yup.string().required("Bank name is required"),
    account_type: Yup.string()
      .oneOf(
        ["checking", "savings", "business", "credit", "current"],
        "Invalid account type"
      )
      .required("Account type is required"),
    routing_number: Yup.string()
      .max(255, "Routing number must be 255 characters or less")
      .nullable(),
    iban: Yup.string().max(34, "IBAN must be 34 characters or less").nullable(),
    swift_code: Yup.string()
      .max(11, "SWIFT code must be 11 characters or less")
      .nullable(),
    currency: Yup.string()
      .matches(
        /^[A-Z]{3}$/,
        "Currency must be a valid 3-letter code (e.g., USD)"
      )
      .required("Currency is required"), // Make required
    account_status: Yup.string()
      .oneOf(["active", "suspended", "closed"], "Invalid account status")
      .required("Account status is required"), // Make required
    beneficiary_name: Yup.string()
      .max(255, "Beneficiary name must be 255 characters or less")
      .nullable(),
  });

  // Memoized functions
  const showAlertMessage = useCallback((message, variant = "default") => {
    setAlert({
      show: true,
      message,
      variant,
    });
    setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 5000);
  }, []);
  showAlertMessage;

  const handleSubmitForm = useCallback(
    async (values) => {
      try {
        setFormState((prev) => ({
          ...prev,
          submitLoading: true,
          error: null,
          success: false,
        }));

        const response = await fetch(`${backendURL}/api/create/user/finance`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...values,
            account_balance: values.account_balance || null,
            interest_rate: values.interest_rate || null,
            date_opened: values.date_opened || null,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to submit finance data");
        }

        const result = await response.json();
        showAlertMessage(
          result.message || "Finance information updated successfully",
          "success"
        );

        setFormState((prev) => ({
          ...prev,
          submitLoading: false,
          success: true,
          submitted: true,
          isEditing: false,
        }));

        formik.setValues({
          ...formik.initialValues,
          ...result.finance,
          account_balance: result.finance.account_balance || "",
          interest_rate: result.finance.interest_rate || "",
          date_opened: result.finance.date_opened
            ? result.finance.date_opened.split("T")[0]
            : "",
        });
      } catch (error) {
        showAlertMessage(error.message, "destructive");
        setFormState((prev) => ({
          ...prev,
          submitLoading: false,
          error: error.message,
          success: false,
        }));
      }
    },
    [token, showAlertMessage]
  );

  const formik = useFormik({
    initialValues: {
      account_name: "",
      account_number: "",
      bank: "",
      account_type: "",
      routing_number: "",
      iban: "",
      swift_code: "",
      currency: "",
      account_status: "",
      beneficiary_name: "",
    },
    validationSchema,
    onSubmit: useCallback(handleSubmitForm, [token]), // Memoize onSubmit
  });

  const toggleEditMode = useCallback(() => {
    setFormState((prev) => ({ ...prev, isEditing: true }));
  }, []);

  const cancelEdit = useCallback(() => {
    setFormState((prev) => ({ ...prev, isEditing: false }));
  }, []);

  // Optimized useEffect with minimal dependencies
  useEffect(() => {
    if (initialFetchDone.current) return;

    const fetchData = async () => {
      if (!userInfo?.slug) {
        showAlertMessage("User slug not found in userInfo", "destructive");
        setFormState((prev) => ({ ...prev, loading: false }));
        initialFetchDone.current = true;
        return;
      }

      try {
        const userResponse = await fetch(
          `${backendURL}/api/user/${userInfo.slug}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!userResponse.ok) {
          const errorData = await userResponse.json();
          throw new Error(errorData.message || "Failed to fetch user data");
        }

        const userData = await userResponse.json();
        const contactSlug = userData?.data?.user?.contact?.slug;

        if (!contactSlug) {
          throw new Error("Contact slug not found in response");
        }

        const financeResponse = await fetch(
          `${backendURL}/api/profile/${contactSlug}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!financeResponse.ok) {
          const errorData = await financeResponse.json();
          throw new Error(errorData.message || "Failed to fetch finance data");
        }

        const financeData = await financeResponse.json();

        if (
          financeData.userFinance &&
          Object.keys(financeData.userFinance).length > 0
        ) {
          const formattedData = {
            ...formik.initialValues,
            ...financeData.userFinance,
            account_balance: financeData.userFinance.account_balance || "",
            interest_rate: financeData.userFinance.interest_rate || "",
            date_opened: financeData.userFinance.date_opened
              ? financeData.userFinance.date_opened.split("T")[0]
              : "",
          };

          formik.setValues(formattedData);
          setFormState((prev) => ({
            ...prev,
            submitted: true,
            success: true,
            loading: false,
          }));
        } else {
          setFormState((prev) => ({ ...prev, loading: false }));
        }
      } catch (error) {
        showAlertMessage(error.message, "destructive");
        setFormState((prev) => ({
          ...prev,
          error: error.message,
          loading: false,
        }));
      }

      initialFetchDone.current = true;
    };

    fetchData();
  }, [userInfo?.slug, token, showAlertMessage]);

  // Extract state variables for cleaner JSX
  const { loading, submitted, isEditing, submitLoading } = formState;

  return (
    <div className="max-w-screen-xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 mid:mt-14">
      <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
        <h1 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">
          Finance Details
        </h1>

        {loading ? (
          <LoadingSpinner />
        ) : submitted && !isEditing ? (
          <div className="text-center space-y-4 sm:space-y-6 py-6">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-green-100 text-green-600 mb-4 ring-2 ring-green">
              <Check className="text-green" size={24} strokeWidth={2.5} />
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-800">
              Finance Details Submitted
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
              Your finance information has been successfully saved.
            </p>
            <button
              onClick={toggleEditMode}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center mx-auto shadow-sm">
              <Edit size={16} className="mr-2" />
              Edit Finance Details
            </button>
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <div className="space-y-6">
              {/* Required Fields */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">
                  Required Information
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
                  {[
                    {
                      name: "account_name",
                      label: "Account Name",
                      required: true,
                    },
                    {
                      name: "account_number",
                      label: "Account Number",
                      required: true,
                    },
                    { name: "bank", label: "Bank Name", required: true },
                    {
                      name: "account_type",
                      label: "Account Type",
                      type: "select",
                      required: true,
                      options: [
                        "",
                        "checking",
                        "savings",
                        "business",
                        "credit",
                        "current",
                      ],
                      optionLabels: [
                        "Select Account Type",
                        "Checking",
                        "Savings",
                        "Business",
                        "Credit",
                        "Current",
                      ],
                    },
                    {
                      name: "currency",
                      label: "Currency (e.g., NGN) for naira",
                      required: true,
                    },
                    {
                      name: "account_status",
                      label: "Account Status",
                      type: "select",
                      required: true,
                      options: ["", "active", "suspended", "closed"],
                      optionLabels: [
                        "Select Status",
                        "Active",
                        "Suspended",
                        "Closed",
                      ],
                    },
                  ].map((field) => (
                    <div key={field.name} className="group">
                      <label className="block mb-1 text-xs font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
                        {field.label}{" "}
                        {field.required && (
                          <span className="text-red-500">*</span>
                        )}
                      </label>
                      {field.type === "select" ? (
                        <select
                          name={field.name}
                          value={formik.values[field.name]}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          disabled={loading}
                          className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                            formik.touched[field.name] &&
                            formik.errors[field.name]
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
                          type="text"
                          name={field.name}
                          value={formik.values[field.name]}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          disabled={loading}
                          className={`w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                            formik.touched[field.name] &&
                            formik.errors[field.name]
                              ? "border-red-400"
                              : "border-gray-200"
                          }`}
                          required={field.required}
                        />
                      )}
                      {formik.touched[field.name] &&
                        formik.errors[field.name] && (
                          <p className="mt-1 text-xs text-red-500">
                            {formik.errors[field.name]}
                          </p>
                        )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Optional Fields */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">
                  Optional Information
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
                  {[
                    { name: "routing_number", label: "Routing Number" },
                    { name: "iban", label: "IBAN" },
                    { name: "swift_code", label: "SWIFT Code" },
                    { name: "beneficiary_name", label: "Beneficiary Name" },
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
                        disabled={loading}
                        className="w-full p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 disabled:bg-gray-100 disabled:cursor-not-allowed border-gray-200"
                      />
                      {formik.touched[field.name] &&
                        formik.errors[field.name] && (
                          <p className="mt-1 text-xs text-red-500">
                            {formik.errors[field.name]}
                          </p>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
              {isEditing && submitted && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  disabled={loading}
                  className="w-full sm:w-auto px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50">
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={loading || submitLoading}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 flex items-center justify-center shadow-sm">
                {submitLoading ? (
                  "Submitting..."
                ) : isEditing ? (
                  <>
                    Update Finance Details
                    <Check size={16} className="ml-2" />
                  </>
                ) : (
                  <>
                    Submit Finance Details
                    <Check size={16} className="ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Alert */}
        {alert.show && (
          <Alert
            variant={alert.variant}
            show={alert.show}
            onClose={() => setAlert((prev) => ({ ...prev, show: false }))}
            autoClose={true}
            autoCloseTime={5000}
            className="fixed top-4 right-4 w-72 sm:w-80 z-50 shadow-lg">
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
});

export default UserFinanceForm;

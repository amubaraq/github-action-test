import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { VscLoading } from "react-icons/vsc";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import { useLocation } from "react-router-dom";
import backendURL from "../../config";

// Validation Schema
const resetPasswordSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  token: yup.string().required("Reset token is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must include uppercase, lowercase, number, and special character"
    ),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    type: "",
    message: "",
    variant: "default",
  });
  const location = useLocation();

  const handleAlertShow = (status) => {
    setSubmitStatus(status);
    setShowAlert(true);
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
  });

  useEffect(() => {
    // Extract token and email from URL query parameters
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (token) setValue("token", token);
    if (email) setValue("email", email);
  }, [location, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await fetch(`${backendURL}/api/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        handleAlertShow({
          type: "success",
          message: result.message || "Password reset successfully",
          variant: "success",
        });
        reset();
        // Redirect to login after successful reset
        setTimeout(() => {
          window.location.href = "/login";
        }, 3000);
      } else {
        handleAlertShow({
          type: "error",
          message: result.message || "Failed to reset password",
          variant: "destructive",
        });
      }
    } catch (err) {
      handleAlertShow({
        type: "error",
        message: "Network error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
          Reset Password
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Create a new password for your account
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="hidden"
            {...register("token")}
            placeholder="Reset Token"
          />

          <div>
            <label className="block text-gray-700 mb-2">New Password</label>
            <input
              {...register("password")}
              type="password"
              placeholder="Enter new password"
              className={`w-full p-2 border rounded ${errors.password ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Confirm Password</label>
            <input
              {...register("password_confirmation")}
              type="password"
              placeholder="Confirm new password"
              className={`w-full p-2 border rounded ${errors.password_confirmation ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.password_confirmation && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password_confirmation.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-hoverBtn text-white py-2 rounded hover:bg-btColour transition flex items-center justify-center">
            {loading ? (
              <VscLoading className="animate-spin" />
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-gray-600">
            Remember your password?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Back to Login
            </a>
          </p>
        </div>
      </div>

      {/* Alert info */}
      {showAlert && (
        <Alert
          variant={submitStatus.variant}
          show={showAlert}
          onClose={handleAlertClose}
          autoClose={true}
          autoCloseTime={5000}>
          <AlertDescription>{submitStatus.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ResetPassword;

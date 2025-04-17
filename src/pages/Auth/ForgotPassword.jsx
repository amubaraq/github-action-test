import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { VscLoading } from "react-icons/vsc";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import backendURL from "../../config";

// Validation Schema
const forgotPasswordSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
});

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    type: "",
    message: "",
    variant: "default",
  });

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
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await fetch(`${backendURL}/api/forgot-password`, {
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
          message: result.message || "Password reset link sent successfully",
          variant: "success",
        });
        reset();
      } else {
        handleAlertShow({
          type: "error",
          message: result.message || "Failed to send password reset link",
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
          Forgot Password
        </h2>
        <p className="text-gray-600 text-center mb-6">
          Enter your email to reset your password
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              {...register("email")}
              type="email"
              placeholder="Enter your email"
              className={`w-full p-2 border rounded ${errors.email ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
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
              "Send Reset Link"
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

export default ForgotPassword;

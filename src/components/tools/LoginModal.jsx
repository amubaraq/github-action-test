import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearMessage } from "../../features/Auth/authSlice";
import { useNavigate } from "react-router-dom";
import { X, Eye, EyeOff, AlertCircle } from "lucide-react";

// Validation Schema
const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const LoginModal = ({ onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, userInfo, message } = useSelector(
    (state) => state.auth
  );

  const [showPassword, setShowPassword] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error"); // error, success, info

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  useEffect(() => {
    // Show alert when there's an error
    if (error) {
      setAlertMessage(error);
      setAlertType("error");
      setShowAlert(true);
    }

    // Redirect if login successful
    if (userInfo) {
      reset();
      onClose();
      navigate("/");
    }

    // Show success message if provided
    if (message) {
      setAlertMessage(message);
      setAlertType("success");
      setShowAlert(true);
    }
  }, [error, userInfo, message, navigate, onClose, reset]);

  const onSubmit = async (data) => {
    try {
      await dispatch(loginUser(data)).unwrap();
    } catch (err) {
      setAlertMessage(err || "Login failed");
      setAlertType("error");
      setShowAlert(true);
      console.error("Login failed:", err);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleAlertClose = () => {
    setShowAlert(false);
    dispatch(clearMessage());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Login Required</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {showAlert && (
          <div
            className={`mb-4 p-3 rounded-md flex items-start justify-between ${
              alertType === "error"
                ? "bg-red-100 text-red-700"
                : alertType === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-blue-100 text-blue-700"
            }`}>
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
              <p className="text-sm">{alertMessage}</p>
            </div>
            <button onClick={handleAlertClose} className="ml-2 flex-shrink-0">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="Email"
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all ${
                errors.password ? "border-red-500" : ""
              }`}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none">
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="flex justify-end">
            <a
              href="/forgot-password"
              className="text-sm text-red-600 hover:text-red-700 font-medium">
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors duration-300 flex items-center justify-center">
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <div className="mt-6 space-y-4">
          <div className="flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-sm text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="text-red-600 hover:text-red-700 font-semibold">
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;

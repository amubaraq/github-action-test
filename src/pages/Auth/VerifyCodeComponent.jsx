import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { VscLoading } from "react-icons/vsc";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import { useDispatch } from "react-redux";
import { verifyAuthCode } from "../../features/Auth/authSlice"; // New action for verification
import backendURL from "../../config";

// Validation Schema for the auth code
const verifySchema = yup.object().shape({
  auth_code: yup
    .string()
    .length(5, "Authentication code must be exactly 5 characters")
    .required("Authentication code is required"),
});

const VerifyCode = ({ email, onClose }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    type: "",
    message: "",
    variant: "default",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(verifySchema),
  });

  const handleAlertShow = (status) => {
    setSubmitStatus(status);
    setShowAlert(true);
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = { email, auth_code: data.auth_code };
      await dispatch(verifyAuthCode(payload)).unwrap();
      handleAlertShow({
        type: "success",
        message: "Code verified successfully. You are now logged in!",
        variant: "success",
      });
      setTimeout(() => {
        onClose(); // Close the modal after success
      }, 2000);
    } catch (err) {
      handleAlertShow({
        type: "error",
        message: err || "Invalid authentication code",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Verify Authentication Code
        </h2>
        <p className="text-gray-600 mb-4">
          An authentication code has been sent to {email}. Please enter the
          5-character code below.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">
              Authentication Code
            </label>
            <input
              {...register("auth_code")}
              type="text"
              placeholder="Enter 5-character code"
              className={`w-full p-2 border rounded ${errors.auth_code ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.auth_code && (
              <p className="text-red-500 text-sm mt-1">
                {errors.auth_code.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition">
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition flex items-center">
              {loading ? (
                <VscLoading className="animate-spin mr-2" />
              ) : (
                "Verify"
              )}
            </button>
          </div>
        </form>

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
    </div>
  );
};

export default VerifyCode;

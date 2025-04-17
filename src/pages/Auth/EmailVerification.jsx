import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle, MailCheck } from "lucide-react";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import backendURL from "../../config";

const EmailVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState("verifying");
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    variant: "default",
    message: "",
  });
  const [isResending, setIsResending] = useState(false);

  const showAlertMessage = (message, variant = "default") => {
    setShowAlert(false); // Reset alert to avoid overlap
    setAlertConfig({ message, variant });
    setShowAlert(true);
  };

  const params = new URLSearchParams(location.search);
  const token = params.get("token");
  const email = params.get("email");

  const handleResendVerification = async () => {
    if (!email) {
      showAlertMessage(
        "No email found. Please request a new verification link.",
        "destructive"
      );
      return;
    }

    setIsResending(true);
    try {
      const response = await fetch(
        `${backendURL}/api/resend-verification-link`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        showAlertMessage("Verification email resent successfully", "success");
      } else {
        showAlertMessage(
          data.message || "Failed to resend verification email",
          "destructive"
        );
      }
    } catch (error) {
      showAlertMessage(
        "Network error. Please check your connection and try again.",
        "destructive"
      );
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    const verifyEmail = async () => {
      // Check for token and email first
      if (!token || !email) {
        setVerificationStatus("error");
        setMessage("Invalid verification link. Please try again.");
        showAlertMessage("Invalid verification link.", "destructive");
        return;
      }

      try {
        const response = await fetch(`${backendURL}/api/verify-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, email }),
        });
        const data = await response.json();
        console.log("Backend response:", { status: response.status, data }); // Debug log

        if (response.ok && data.status === "success") {
          setVerificationStatus("success");
          setMessage(data.message || "Email verified successfully!");
          showAlertMessage(
            data.message || "Email verified successfully",
            "success"
          );
          setTimeout(() => navigate("/login"), 3000);
        } else {
          setVerificationStatus("error");
          setMessage(data.message || "Failed to verify email.");
          showAlertMessage(
            data.message || "Failed to verify email. Please try again.",
            "destructive"
          );
        }
      } catch (error) {
        console.error("Verification error:", error); // Debug log
        setVerificationStatus("error");
        setMessage("Network error. Unable to verify email.");
        showAlertMessage(
          "Network error. Unable to verify email. Please try again.",
          "destructive"
        );
      }
    };

    verifyEmail();
  }, [token, email, navigate]);

  const renderContent = () => {
    switch (verificationStatus) {
      case "verifying":
        return (
          <div className="text-center space-y-4 p-8">
            <Loader2 className="w-16 h-16 animate-spin mx-auto text-blue-600" />
            <p className="text-lg text-gray-600">
              Verifying your email address...
            </p>
          </div>
        );
      case "success":
        return (
          <div className="text-center space-y-4 p-8">
            <CheckCircle2 className="w-16 h-16 mx-auto text-green-600" />
            <div className="space-y-2">
              <p className="text-lg text-gray-600">{message}</p>
              <p className="text-sm text-gray-500">
                Redirecting to login page...
              </p>
            </div>
          </div>
        );
      case "error":
        return (
          <div className="text-center space-y-4 p-8">
            <XCircle className="w-16 h-16 mx-auto text-red-600" />
            <p className="text-lg text-gray-600">{message}</p>
            <div className="space-y-2">
              <button
                onClick={() => navigate("/login")}
                className="w-full max-w-xs bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                Go to Login
              </button>
              <button
                onClick={handleResendVerification}
                disabled={isResending || !email}
                className="w-full max-w-xs border border-blue-600 text-blue-600 py-2 px-4 rounded-md hover:bg-blue-50 transition-colors disabled:opacity-50">
                {isResending ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  "Resend Verification Email"
                )}
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6">
        <div className="hidden md:block relative h-[600px] overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-blue-400">
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <MailCheck className="w-24 h-24 mx-auto text-white/90" />
              <h1 className="text-4xl font-bold text-white">
                Email Verification
              </h1>
              <p className="text-xl text-white/80 mt-4">
                {verificationStatus === "success"
                  ? "Your email has been successfully verified!"
                  : "Please verify your email address to continue"}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="border-b p-4">
            <h2 className="text-2xl font-semibold text-center text-gray-800">
              Email Verification
            </h2>
          </div>
          {renderContent()}
        </div>
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

export default EmailVerification;

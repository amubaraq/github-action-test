// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
// import { VscLoading } from "react-icons/vsc";
// import { Alert, AlertDescription } from "../../components/tools/Alert";
// import { useDispatch, useSelector } from "react-redux";
// import { loginUser, clearMessage } from "../../features/Auth/authSlice";
// import { useNavigate } from "react-router-dom";
// import backendURL from "../../config";
// import VerifyCode from "./VerifyCodeComponent";

// const loginSchema = yup.object().shape({
//   email: yup.string().email("Invalid email").required("Email is required"),
//   password: yup.string().required("Password is required"),
// });

// const Login = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { loading, error, userInfo, requiresVerification, message, role } =
//     useSelector((state) => state.auth);

//   const [showAlert, setShowAlert] = useState(false);
//   const [submitStatus, setSubmitStatus] = useState({
//     type: "",
//     message: "",
//     variant: "default",
//   });
//   const [showVerifyModal, setShowVerifyModal] = useState(false);
//   const [loginEmail, setLoginEmail] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const handleAlertShow = (status) => {
//     setSubmitStatus(status);
//     setShowAlert(true);
//   };

//   const handleAlertClose = () => {
//     setShowAlert(false);
//     dispatch(clearMessage());
//   };

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm({
//     resolver: yupResolver(loginSchema),
//   });

//   useEffect(() => {
//     if (userInfo && !showVerifyModal) {
//       navigate("/");
//     }
//     if (requiresVerification && !showVerifyModal && role && message) {
//       setShowVerifyModal(true);
//       handleAlertShow({
//         type: "info",
//         message: message,
//         variant: "default",
//       });
//     }
//   }, [
//     userInfo,
//     navigate,
//     showVerifyModal,
//     requiresVerification,
//     role,
//     message,
//   ]);

//   const onSubmit = async (data) => {
//     try {
//       setLoginEmail(data.email);
//       await dispatch(loginUser(data)).unwrap();
//       console.log("Login Result:", { role, requiresVerification, message });
//     } catch (err) {
//       handleAlertShow({
//         type: "error",
//         message: err || "Login failed",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleGoogleLogin = (e) => {
//     e.preventDefault();
//     window.location = `${backendURL}/api/auth/google`;
//   };

//   const handleVerifyModalClose = () => {
//     setShowVerifyModal(false);
//     setLoginEmail("");
//     reset();
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
//       <div className="w-full max-w-4xl grid md:grid-cols-2 shadow-lg rounded-xl overflow-hidden">
//         <div
//           className="hidden md:block bg-cover bg-center"
//           style={{
//             backgroundImage:
//               "url(https://images.unsplash.com/photo-1581291518857-4e27b48ff24e)",
//             backgroundSize: "cover",
//           }}
//         />
//         <div className="bg-white p-8 flex flex-col justify-center">
//           <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
//             Welcome Back
//           </h2>
//           <p className="text-gray-600 text-center mb-6">
//             Log in to your account
//           </p>
//           <button
//             onClick={handleGoogleLogin}
//             className="w-full mb-4 py-2 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition">
//             <FaGoogle className="mr-2 text-red-500" />
//             Log in with Google
//           </button>
//           <div className="flex items-center my-4">
//             <div className="flex-grow border-t border-gray-300"></div>
//             <span className="mx-4 text-gray-500">OR</span>
//             <div className="flex-grow border-t border-gray-300"></div>
//           </div>
//           {error && (
//             <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//               {error}
//             </div>
//           )}
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             <div>
//               <label className="block text-gray-700 mb-2">Email</label>
//               <input
//                 {...register("email")}
//                 type="email"
//                 placeholder="Enter your email"
//                 className={`w-full p-2 border rounded ${errors.email ? "border-red-500" : "border-gray-300"}`}
//               />
//               {errors.email && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.email.message}
//                 </p>
//               )}
//             </div>
//             <div>
//               <label className="block text-gray-700 mb-2">Password</label>
//               <div className="relative">
//                 <input
//                   {...register("password")}
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Enter your password"
//                   className={`w-full p-2 border rounded ${errors.password ? "border-red-500" : "border-gray-300"}`}
//                 />
//                 <button
//                   type="button"
//                   onClick={togglePasswordVisibility}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none">
//                   {showPassword ? <FaEyeSlash /> : <FaEye />}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.password.message}
//                 </p>
//               )}
//             </div>
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-hoverBtn text-white py-2 rounded hover:bg-btColour transition flex items-center justify-center">
//               {loading ? <VscLoading className="animate-spin" /> : "Log In"}
//             </button>
//           </form>
//           <div className="text-start mt-4">
//             <p className="text-gray-600">
//               <a
//                 href="/forgotPassword"
//                 className="text-blue-500 hover:underline">
//                 Forgot password?
//               </a>
//             </p>
//           </div>
//           <div className="text-center mt-4">
//             <p className="text-gray-600">
//               Don't have an account?{" "}
//               <a href="/signup" className="text-blue-500 hover:underline">
//                 Sign up
//               </a>
//             </p>
//           </div>
//         </div>
//       </div>
//       {showAlert && (
//         <Alert
//           variant={submitStatus.variant}
//           show={showAlert}
//           onClose={handleAlertClose}
//           autoClose={true}
//           autoCloseTime={5000}>
//           <AlertDescription>{submitStatus.message}</AlertDescription>
//         </Alert>
//       )}
//       {showVerifyModal && (
//         <VerifyCode email={loginEmail} onClose={handleVerifyModalClose} />
//       )}
//     </div>
//   );
// };

// export default Login;
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaGoogle,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";
import { VscLoading } from "react-icons/vsc";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, clearMessage } from "../../features/Auth/authSlice";
import { useNavigate } from "react-router-dom";
import backendURL from "../../config";
import VerifyCode from "./VerifyCodeComponent";

// Updated Validation Schemas
const emailLoginSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const phoneLoginSchema = yup.object().shape({
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(
      /^\+\d{10,15}$/,
      "Phone number must be in E.164 format (e.g., +2348067890...)"
    ),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, userInfo, requiresVerification, message, role } =
    useSelector((state) => state.auth);

  const [showAlert, setShowAlert] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    type: "",
    message: "",
    variant: "default",
  });
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [loginCredential, setLoginCredential] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("email");

  // Email Form
  const emailForm = useForm({
    resolver: yupResolver(emailLoginSchema),
  });

  // Phone Form
  const phoneForm = useForm({
    resolver: yupResolver(phoneLoginSchema),
  });

  const handleAlertShow = (status) => {
    setSubmitStatus(status);
    setShowAlert(true);
  };

  const handleAlertClose = () => {
    setShowAlert(false);
    dispatch(clearMessage());
  };

  useEffect(() => {
    if (userInfo && !showVerifyModal) {
      navigate("/");
    }
    if (requiresVerification && !showVerifyModal && role && message) {
      setShowVerifyModal(true);
      handleAlertShow({
        type: "info",
        message: message,
        variant: "default",
      });
    }
  }, [
    userInfo,
    navigate,
    showVerifyModal,
    requiresVerification,
    role,
    message,
  ]);

  const onSubmit = async (data) => {
    try {
      const loginData =
        activeTab === "email"
          ? { email: data.email, password: data.password }
          : { phone: data.phone, password: data.password };

      setLoginCredential(loginData.email || loginData.phone);
      await dispatch(loginUser(loginData)).unwrap();
    } catch (err) {
      handleAlertShow({
        type: "error",
        message: err || "Login failed",
        variant: "destructive",
      });
    }
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    // Reset forms when switching tabs
    emailForm.reset();
    phoneForm.reset();
  };

  const handleGoogleLogin = (e) => {
    e.preventDefault();
    window.location = `${backendURL}/api/auth/google`;
  };

  const handleVerifyModalClose = () => {
    setShowVerifyModal(false);
    setLoginCredential("");
    emailForm.reset();
    phoneForm.reset();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 shadow-lg rounded-xl overflow-hidden">
        <div
          className="hidden md:block bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1581291518857-4e27b48ff24e)",
            backgroundSize: "cover",
          }}
        />
        <div className="bg-white p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
            Welcome Back
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Log in to your account
          </p>

          {/* Tab Switch */}
          <div className="relative mb-4">
            <div className="flex justify-center space-x-2 bg-gray-100 p-1 rounded-lg">
              <button
                type="button"
                onClick={() => handleTabSwitch("email")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                  activeTab === "email"
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-gray-600 hover:bg-gray-200"
                }`}>
                <FaEnvelope /> Email
              </button>
              <button
                type="button"
                onClick={() => handleTabSwitch("phone")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                  activeTab === "phone"
                    ? "bg-white text-blue-600 shadow-md"
                    : "text-gray-600 hover:bg-gray-200"
                }`}>
                <FaPhone /> Phone
              </button>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full mb-4 py-2 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition">
            <FaGoogle className="mr-2 text-red-500" />
            Log in with Google
          </button>
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait">
            {activeTab === "email" ? (
              <motion.form
                key="email"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                onSubmit={emailForm.handleSubmit(onSubmit)}
                className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    {...emailForm.register("email")}
                    type="email"
                    placeholder="Enter your email"
                    className={`w-full p-2 border rounded ${
                      emailForm.formState.errors.email
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {emailForm.formState.errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {emailForm.formState.errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <input
                      {...emailForm.register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className={`w-full p-2 border rounded ${
                        emailForm.formState.errors.password
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none">
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {emailForm.formState.errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {emailForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-hoverBtn text-white py-2 rounded hover:bg-btColour transition flex items-center justify-center">
                  {loading ? <VscLoading className="animate-spin" /> : "Log In"}
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="phone"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                onSubmit={phoneForm.handleSubmit(onSubmit)}
                className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    {...phoneForm.register("phone")}
                    type="text"
                    placeholder="Enter your phone number (e.g., +1234567890)"
                    className={`w-full p-2 border rounded ${
                      phoneForm.formState.errors.phone
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  />
                  {phoneForm.formState.errors.phone && (
                    <p className="text-red-500 text-sm mt-1">
                      {phoneForm.formState.errors.phone.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <input
                      {...phoneForm.register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className={`w-full p-2 border rounded ${
                        phoneForm.formState.errors.password
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none">
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {phoneForm.formState.errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {phoneForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-hoverBtn text-white py-2 rounded hover:bg-btColour transition flex items-center justify-center">
                  {loading ? <VscLoading className="animate-spin" /> : "Log In"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="text-start mt-4">
            <p className="text-gray-600">
              <a
                href="/forgotPassword"
                className="text-blue-500 hover:underline">
                Forgot password?
              </a>
            </p>
          </div>
          <div className="text-center mt-4">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <a href="/signup" className="text-blue-500 hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
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
      {showVerifyModal && (
        <VerifyCode email={loginCredential} onClose={handleVerifyModalClose} />
      )}
    </div>
  );
};

export default Login;

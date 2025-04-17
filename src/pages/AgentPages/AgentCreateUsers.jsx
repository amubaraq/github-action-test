// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { FaEye, FaEyeSlash, FaEnvelope, FaPhone } from "react-icons/fa";
// import { VscLoading } from "react-icons/vsc";
// import { Alert, AlertDescription } from "../../components/tools/Alert";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import backendURL from "../../config";

// // Validation Schemas
// const emailSchema = yup.object().shape({
//   name: yup.string().required("Full Name is required"),
//   email: yup.string().email("Invalid email").required("Email is required"),
//   phone: yup.string().nullable(),
//   password: yup
//     .string()
//     .required("Password is required")
//     .min(8, "Password must be at least 8 characters")
//     .matches(
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
//       "Password must include uppercase, lowercase, number, and special character"
//     ),
//   role: yup
//     .string()
//     .oneOf(["user"], "Role must be user")
//     .required("Role is required"),
//   platform: yup
//     .string()
//     .oneOf(["web", "iOS", "Android"], "Please select a valid platform")
//     .nullable(),
// });

// const phoneSchema = yup.object().shape({
//   name: yup.string().required("Full Name is required"),
//   phone: yup
//     .string()
//     .required("Phone number is required")
//     .matches(
//       /^\+\d{10,15}$/,
//       "Phone number must be in E.164 format (e.g., +2348067890...)"
//     ),
//   email: yup.string().nullable(),
//   password: yup
//     .string()
//     .required("Password is required")
//     .min(8, "Password must be at least 8 characters")
//     .matches(
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
//       "Password must include uppercase, lowercase, number, and special character"
//     ),
//   role: yup
//     .string()
//     .oneOf(["user"], "Role must be user")
//     .required("Role is required"),
//   platform: yup
//     .string()
//     .oneOf(["web", "iOS", "Android"], "Please select a valid platform")
//     .nullable(),
// });

// const AgentCreateUsers = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [loading, setLoading] = useState(false);
//   const [showAlert, setShowAlert] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [activeTab, setActiveTab] = useState("email"); // Default to email tab
//   const { userInfo, token } = useSelector((state) => state.auth);
//   const [submitStatus, setSubmitStatus] = useState({
//     type: "",
//     message: "",
//     variant: "default",
//   });

//   // Separate useForm instances for email and phone
//   const emailForm = useForm({
//     resolver: yupResolver(emailSchema),
//     defaultValues: {
//       role: "user",
//       platform: null,
//       email: "",
//       phone: null,
//     },
//   });

//   const phoneForm = useForm({
//     resolver: yupResolver(phoneSchema),
//     defaultValues: {
//       role: "user",
//       platform: null,
//       phone: "",
//       email: null,
//     },
//   });

//   useEffect(() => {
//     if (!userInfo || userInfo.role !== "agent") {
//       navigate("/login"); // Redirect if not agent
//     }
//   }, [userInfo, navigate]);

//   const handleAlertShow = (status) => {
//     setSubmitStatus(status);
//     setShowAlert(true);
//   };

//   const handleAlertClose = () => {
//     setShowAlert(false);
//   };

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const handleTabSwitch = (tab) => {
//     setActiveTab(tab);
//     emailForm.reset();
//     phoneForm.reset();
//   };

//   const onSubmit = async (data, isPhone = false) => {
//     setLoading(true);

//     try {
//       const response = await fetch(`${backendURL}/api/agent/create/user`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           name: data.name,
//           email: isPhone ? data.email || null : data.email,
//           phone: isPhone ? data.phone : data.phone || null,
//           password: data.password,
//           role: data.role,
//           platform: data.platform || null,
//         }),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         handleAlertShow({
//           type: "success",
//           message:
//             result.message || "User created successfully. Verification sent.",
//           variant: "success",
//         });
//         isPhone ? phoneForm.reset() : emailForm.reset();
//       } else {
//         let errorMessage = result.message || "Failed to create user";
//         if (result.errors) {
//           errorMessage = Object.values(result.errors)[0][0];
//         }
//         handleAlertShow({
//           type: "error",
//           message: errorMessage,
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       handleAlertShow({
//         type: "error",
//         message: "Network error. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
//       <div className="w-full max-w-2xl  shadow-lg rounded-xl overflow-hidden">
//         {/* Image Section */}
//         <div
//           className="hidden md:block bg-cover bg-center"
//           style={{
//             backgroundImage:
//               "url(https://images.unsplash.com/photo-1581291518857-4e27b48ff24e)",
//             backgroundSize: "cover",
//           }}
//         />

//         {/* Form Section */}
//         <div className="bg-white p-8 flex flex-col justify-center">
//           <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
//             Create New User
//           </h2>
//           <p className="text-gray-600 text-center mb-6">
//             Create a new user under your referral
//           </p>

//           {/* Tab Switch */}
//           <div className="relative mb-4">
//             <div className="flex justify-center space-x-2 bg-gray-100 p-1 rounded-lg">
//               <button
//                 type="button"
//                 onClick={() => handleTabSwitch("email")}
//                 className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
//                   activeTab === "email"
//                     ? "bg-white text-blue-600 shadow-md"
//                     : "text-gray-600 hover:bg-gray-200"
//                 }`}>
//                 <FaEnvelope /> Email
//               </button>
//               <button
//                 type="button"
//                 onClick={() => handleTabSwitch("phone")}
//                 className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
//                   activeTab === "phone"
//                     ? "bg-white text-blue-600 shadow-md"
//                     : "text-gray-600 hover:bg-gray-200"
//                 }`}>
//                 <FaPhone /> Phone
//               </button>
//             </div>
//           </div>

//           {/* Tab Content */}
//           <AnimatePresence mode="wait">
//             {activeTab === "email" ? (
//               <motion.div
//                 key="email"
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 transition={{ duration: 0.3 }}>
//                 <form
//                   onSubmit={emailForm.handleSubmit((data) => onSubmit(data))}
//                   className="space-y-4">
//                   <div>
//                     <label className="block text-gray-700 mb-2">
//                       Full Name
//                     </label>
//                     <input
//                       {...emailForm.register("name")}
//                       placeholder="Enter user's full name"
//                       className={`w-full p-2 border rounded ${
//                         emailForm.formState.errors.name
//                           ? "border-red-500"
//                           : "border-gray-300"
//                       }`}
//                     />
//                     {emailForm.formState.errors.name && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {emailForm.formState.errors.name.message}
//                       </p>
//                     )}
//                   </div>

//                   <div>
//                     <label className="block text-gray-700 mb-2">Email</label>
//                     <input
//                       {...emailForm.register("email")}
//                       type="email"
//                       placeholder="Enter user's email"
//                       className={`w-full p-2 border rounded ${
//                         emailForm.formState.errors.email
//                           ? "border-red-500"
//                           : "border-gray-300"
//                       }`}
//                     />
//                     {emailForm.formState.errors.email && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {emailForm.formState.errors.email.message}
//                       </p>
//                     )}
//                   </div>

//                   <div>
//                     <label className="block text-gray-700 mb-2">
//                       Phone (Optional)
//                     </label>
//                     <input
//                       {...emailForm.register("phone")}
//                       type="text"
//                       placeholder="Enter phone number (e.g., +1234567890)"
//                       className={`w-full p-2 border rounded ${
//                         emailForm.formState.errors.phone
//                           ? "border-red-500"
//                           : "border-gray-300"
//                       }`}
//                     />
//                     {emailForm.formState.errors.phone && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {emailForm.formState.errors.phone.message}
//                       </p>
//                     )}
//                   </div>

//                   <div>
//                     <label className="block text-gray-700 mb-2">Password</label>
//                     <div className="relative">
//                       <input
//                         {...emailForm.register("password")}
//                         type={showPassword ? "text" : "password"}
//                         placeholder="Create a strong password"
//                         className={`w-full p-2 border rounded ${
//                           emailForm.formState.errors.password
//                             ? "border-red-500"
//                             : "border-gray-300"
//                         }`}
//                       />
//                       <button
//                         type="button"
//                         onClick={togglePasswordVisibility}
//                         className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
//                         {showPassword ? <FaEyeSlash /> : <FaEye />}
//                       </button>
//                     </div>
//                     {emailForm.formState.errors.password && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {emailForm.formState.errors.password.message}
//                       </p>
//                     )}
//                   </div>

//                   <input
//                     type="hidden"
//                     {...emailForm.register("role")}
//                     value="user"
//                   />

//                   <div>
//                     <label className="block text-gray-700 mb-2">
//                       Platform (Optional)
//                     </label>
//                     <select
//                       {...emailForm.register("platform")}
//                       className={`w-full p-2 border rounded ${
//                         emailForm.formState.errors.platform
//                           ? "border-red-500"
//                           : "border-gray-300"
//                       }`}>
//                       <option value="">Select Platform</option>
//                       <option value="web">Web</option>
//                       <option value="iOS">iOS</option>
//                       <option value="Android">Android</option>
//                     </select>
//                     {emailForm.formState.errors.platform && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {emailForm.formState.errors.platform.message}
//                       </p>
//                     )}
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition flex items-center justify-center">
//                     {loading ? (
//                       <VscLoading className="animate-spin" />
//                     ) : (
//                       "Create User"
//                     )}
//                   </button>
//                 </form>
//               </motion.div>
//             ) : (
//               <motion.div
//                 key="phone"
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 transition={{ duration: 0.3 }}>
//                 <form
//                   onSubmit={phoneForm.handleSubmit((data) =>
//                     onSubmit(data, true)
//                   )}
//                   className="space-y-4">
//                   <div>
//                     <label className="block text-gray-700 mb-2">
//                       Full Name
//                     </label>
//                     <input
//                       {...phoneForm.register("name")}
//                       placeholder="Enter user's full name"
//                       className={`w-full p-2 border rounded ${
//                         phoneForm.formState.errors.name
//                           ? "border-red-500"
//                           : "border-gray-300"
//                       }`}
//                     />
//                     {phoneForm.formState.errors.name && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {phoneForm.formState.errors.name.message}
//                       </p>
//                     )}
//                   </div>

//                   <div>
//                     <label className="block text-gray-700 mb-2">
//                       Phone Number
//                     </label>
//                     <input
//                       {...phoneForm.register("phone")}
//                       type="text"
//                       placeholder="Enter phone number (e.g., +1234567890)"
//                       className={`w-full p-2 border rounded ${
//                         phoneForm.formState.errors.phone
//                           ? "border-red-500"
//                           : "border-gray-300"
//                       }`}
//                     />
//                     {phoneForm.formState.errors.phone && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {phoneForm.formState.errors.phone.message}
//                       </p>
//                     )}
//                   </div>

//                   <div>
//                     <label className="block text-gray-700 mb-2">
//                       Email (Optional)
//                     </label>
//                     <input
//                       {...phoneForm.register("email")}
//                       type="email"
//                       placeholder="Enter user's email"
//                       className={`w-full p-2 border rounded ${
//                         phoneForm.formState.errors.email
//                           ? "border-red-500"
//                           : "border-gray-300"
//                       }`}
//                     />
//                     {phoneForm.formState.errors.email && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {phoneForm.formState.errors.email.message}
//                       </p>
//                     )}
//                   </div>

//                   <div>
//                     <label className="block text-gray-700 mb-2">Password</label>
//                     <div className="relative">
//                       <input
//                         {...phoneForm.register("password")}
//                         type={showPassword ? "text" : "password"}
//                         placeholder="Create a strong password"
//                         className={`w-full p-2 border rounded ${
//                           phoneForm.formState.errors.password
//                             ? "border-red-500"
//                             : "border-gray-300"
//                         }`}
//                       />
//                       <button
//                         type="button"
//                         onClick={togglePasswordVisibility}
//                         className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
//                         {showPassword ? <FaEyeSlash /> : <FaEye />}
//                       </button>
//                     </div>
//                     {phoneForm.formState.errors.password && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {phoneForm.formState.errors.password.message}
//                       </p>
//                     )}
//                   </div>

//                   <input
//                     type="hidden"
//                     {...phoneForm.register("role")}
//                     value="user"
//                   />

//                   <div>
//                     <label className="block text-gray-700 mb-2">
//                       Platform (Optional)
//                     </label>
//                     <select
//                       {...phoneForm.register("platform")}
//                       className={`w-full p-2 border rounded ${
//                         phoneForm.formState.errors.platform
//                           ? "border-red-500"
//                           : "border-gray-300"
//                       }`}>
//                       <option value="">Select Platform</option>
//                       <option value="web">Web</option>
//                       <option value="iOS">iOS</option>
//                       <option value="Android">Android</option>
//                     </select>
//                     {phoneForm.formState.errors.platform && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {phoneForm.formState.errors.platform.message}
//                       </p>
//                     )}
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition flex items-center justify-center">
//                     {loading ? (
//                       <VscLoading className="animate-spin" />
//                     ) : (
//                       "Create User"
//                     )}
//                   </button>
//                 </form>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           <div className="text-center mt-4">
//             <p className="text-gray-600">
//               Back to{" "}
//               <a
//                 href="/agent/dashboard"
//                 className="text-blue-500 hover:underline">
//                 Dashboard
//               </a>
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Alert Component */}
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
//     </div>
//   );
// };

// export default AgentCreateUsers;

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaEye, FaEyeSlash, FaEnvelope, FaPhone } from "react-icons/fa";
import { VscLoading } from "react-icons/vsc";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import backendURL from "../../config";

// Validation Schemas
const emailSchema = yup.object().shape({
  name: yup.string().required("Full Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().nullable(),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must include uppercase, lowercase, number, and special character"
    ),
  role: yup
    .string()
    .oneOf(["user"], "Role must be user")
    .required("Role is required"),
  platform: yup
    .string()
    .oneOf(["web", "iOS", "Android"], "Please select a valid platform")
    .nullable(),
});

const phoneSchema = yup.object().shape({
  name: yup.string().required("Full Name is required"),
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(
      /^\+\d{10,15}$/,
      "Phone number must be in E.164 format (e.g., +2348067890...)"
    ),
  email: yup.string().nullable(),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must include uppercase, lowercase, number, and special character"
    ),
  role: yup
    .string()
    .oneOf(["user"], "Role must be user")
    .required("Role is required"),
  platform: yup
    .string()
    .oneOf(["web", "iOS", "Android"], "Please select a valid platform")
    .nullable(),
});

const otpSchema = yup.object().shape({
  otp: yup
    .string()
    .required("OTP is required")
    .length(6, "OTP must be 6 digits"),
});

const AgentCreateUsers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("email"); // Default to email tab
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);
  const { userInfo, token } = useSelector((state) => state.auth);
  const [submitStatus, setSubmitStatus] = useState({
    type: "",
    message: "",
    variant: "default",
  });

  // Separate useForm instances for email, phone, and OTP
  const emailForm = useForm({
    resolver: yupResolver(emailSchema),
    defaultValues: {
      role: "user",
      platform: null,
      email: "",
      phone: null,
    },
  });

  const phoneForm = useForm({
    resolver: yupResolver(phoneSchema),
    defaultValues: {
      role: "user",
      platform: null,
      phone: "",
      email: null,
    },
  });

  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
    reset: resetOtp,
  } = useForm({
    resolver: yupResolver(otpSchema),
  });

  useEffect(() => {
    if (!userInfo || userInfo.role !== "agent") {
      navigate("/login"); // Redirect if not agent
    }
  }, [userInfo, navigate]);

  const handleAlertShow = (status) => {
    setSubmitStatus(status);
    setShowAlert(true);
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    emailForm.reset();
    phoneForm.reset();
  };

  const onSubmit = async (data, isPhone = false) => {
    setLoading(true);

    try {
      const response = await fetch(`${backendURL}/api/agent/create/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: data.name,
          email: isPhone ? data.email || null : data.email,
          phone: isPhone ? data.phone : data.phone || null,
          password: data.password,
          role: data.role,
          platform: data.platform || null,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        if (isPhone) {
          setRegisteredUser({
            email: data.email || null,
            phone: data.phone,
          });
          setShowOtpModal(true);
          handleAlertShow({
            type: "success",
            message:
              "User created successfully. Please verify the phone number with the OTP sent.",
            variant: "success",
          });
        } else {
          handleAlertShow({
            type: "success",
            message: "User created successfully. Verification email sent.",
            variant: "success",
          });
          emailForm.reset();
        }
      } else {
        let errorMessage = result.message || "Failed to create user";
        if (result.errors) {
          errorMessage = Object.values(result.errors)[0][0];
        }
        handleAlertShow({
          type: "error",
          message: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      handleAlertShow({
        type: "error",
        message: "Network error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onOtpSubmit = async (data) => {
    setOtpLoading(true);

    try {
      const response = await fetch(`${backendURL}/api/verify-email-or-phone`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: registeredUser.email || null,
          phone: registeredUser.phone,
          otp: data.otp,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        handleAlertShow({
          type: "success",
          message: "Phone verified successfully. User creation complete.",
          variant: "success",
        });
        setShowOtpModal(false);
        phoneForm.reset();
        resetOtp();
      } else {
        handleAlertShow({
          type: "error",
          message: result.message || "Invalid OTP. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      handleAlertShow({
        type: "error",
        message: "Network error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);

    try {
      const response = await fetch(
        `${backendURL}/api/resend/verification/link`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: registeredUser.email || null,
            phone: registeredUser.phone,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        handleAlertShow({
          type: "success",
          message: "A new OTP has been sent to the user's phone.",
          variant: "success",
        });
      } else {
        handleAlertShow({
          type: "error",
          message: result.message || "Failed to resend OTP.",
          variant: "destructive",
        });
      }
    } catch (error) {
      handleAlertShow({
        type: "error",
        message: "Network error. Please try again.",
        variant: "destructive",
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 sm:p-4 mid:mt-16 mid:mb-20">
      <div className="w-full max-w-2xl shadow-lg rounded-xl overflow-hidden">
        {/* Form Section */}
        <div className="bg-white p-6 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
            Create New User
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Create a new user under your referral
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

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === "email" ? (
              <motion.div
                key="email"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}>
                <form
                  onSubmit={emailForm.handleSubmit((data) => onSubmit(data))}
                  className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      {...emailForm.register("name")}
                      placeholder="Enter user's full name"
                      className={`w-full p-2 border rounded ${
                        emailForm.formState.errors.name
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {emailForm.formState.errors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {emailForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Email</label>
                    <input
                      {...emailForm.register("email")}
                      type="email"
                      placeholder="Enter user's email"
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
                    <label className="block text-gray-700 mb-2">
                      Phone (Optional)
                    </label>
                    <input
                      {...emailForm.register("phone")}
                      type="text"
                      placeholder="Enter phone number (e.g., +1234567890)"
                      className={`w-full p-2 border rounded ${
                        emailForm.formState.errors.phone
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {emailForm.formState.errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {emailForm.formState.errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <input
                        {...emailForm.register("password")}
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        className={`w-full p-2 border rounded ${
                          emailForm.formState.errors.password
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {emailForm.formState.errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {emailForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <input
                    type="hidden"
                    {...emailForm.register("role")}
                    value="user"
                  />

                  <div>
                    <label className="block text-gray-700 mb-2">
                      Platform (Optional)
                    </label>
                    <select
                      {...emailForm.register("platform")}
                      className={`w-full p-2 border rounded ${
                        emailForm.formState.errors.platform
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}>
                      <option value="">Select Platform</option>
                      <option value="web">Web</option>
                      <option value="iOS">iOS</option>
                      <option value="Android">Android</option>
                    </select>
                    {emailForm.formState.errors.platform && (
                      <p className="text-red-500 text-sm mt-1">
                        {emailForm.formState.errors.platform.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition flex items-center justify-center">
                    {loading ? (
                      <VscLoading className="animate-spin" />
                    ) : (
                      "Create User"
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="phone"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}>
                <form
                  onSubmit={phoneForm.handleSubmit((data) =>
                    onSubmit(data, true)
                  )}
                  className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      {...phoneForm.register("name")}
                      placeholder="Enter user's full name"
                      className={`w-full p-2 border rounded ${
                        phoneForm.formState.errors.name
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {phoneForm.formState.errors.name && (
                      <p className="text-red-500 text-sm mt-1">
                        {phoneForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      {...phoneForm.register("phone")}
                      type="text"
                      placeholder="Enter phone number (e.g., +1234567890)"
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
                    <label className="block text-gray-700 mb-2">
                      Email (Optional)
                    </label>
                    <input
                      {...phoneForm.register("email")}
                      type="email"
                      placeholder="Enter user's email"
                      className={`w-full p-2 border rounded ${
                        phoneForm.formState.errors.email
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {phoneForm.formState.errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {phoneForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <input
                        {...phoneForm.register("password")}
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        className={`w-full p-2 border rounded ${
                          phoneForm.formState.errors.password
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {phoneForm.formState.errors.password && (
                      <p className="text-red-500 text-sm mt-1">
                        {phoneForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <input
                    type="hidden"
                    {...phoneForm.register("role")}
                    value="user"
                  />

                  <div>
                    <label className="block text-gray-700 mb-2">
                      Platform (Optional)
                    </label>
                    <select
                      {...phoneForm.register("platform")}
                      className={`w-full p-2 border rounded ${
                        phoneForm.formState.errors.platform
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}>
                      <option value="">Select Platform</option>
                      <option value="web">Web</option>
                      <option value="iOS">iOS</option>
                      <option value="Android">Android</option>
                    </select>
                    {phoneForm.formState.errors.platform && (
                      <p className="text-red-500 text-sm mt-1">
                        {phoneForm.formState.errors.platform.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition flex items-center justify-center">
                    {loading ? (
                      <VscLoading className="animate-spin" />
                    ) : (
                      "Create User"
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="text-center mt-4">
            <p className="text-gray-600">
              Back to{" "}
              <a
                href="/agent/dashboard"
                className="text-blue-500 hover:underline">
                Dashboard
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4 text-center">
              Verify User Phone
            </h2>
            <p className="text-gray-600 text-center mb-4">
              An OTP has been sent to {registeredUser.phone}. Please enter it
              below to verify.
            </p>
            <form onSubmit={handleOtpSubmit(onOtpSubmit)} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">OTP</label>
                <input
                  {...registerOtp("otp")}
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  className={`w-full p-2 border rounded ${
                    otpErrors.otp ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {otpErrors.otp && (
                  <p className="text-red-500 text-sm mt-1">
                    {otpErrors.otp.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={otpLoading}
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition flex items-center justify-center">
                {otpLoading ? (
                  <VscLoading className="animate-spin" />
                ) : (
                  "Verify OTP"
                )}
              </button>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendLoading}
                className="w-full text-blue-500 hover:underline mt-2 flex items-center justify-center">
                {resendLoading ? (
                  <VscLoading className="animate-spin" />
                ) : (
                  "Resend OTP"
                )}
              </button>
            </form>
            <button
              onClick={() => setShowOtpModal(false)}
              className="mt-4 w-full text-gray-600 hover:text-gray-800">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Alert Component */}
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

export default AgentCreateUsers;

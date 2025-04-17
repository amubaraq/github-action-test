// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
// import { VscLoading } from "react-icons/vsc";
// import { Alert, AlertDescription } from "../../components/tools/Alert";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import backendURL from "../../config";

// // Updated Validation Schema
// const signupSchema = yup.object().shape({
//   name: yup.string().required("Full Name is required"),
//   email: yup.string().email("Invalid email").required("Email is required"),
//   password: yup
//     .string()
//     .required("Password is required")
//     .min(8, "Password must be at least 8 characters")
//     .matches(
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
//       "Password must include uppercase, lowercase, number, and special character"
//     ),
//   password_confirmation: yup
//     .string()
//     .oneOf([yup.ref("password"), null], "Passwords must match")
//     .required("Confirm Password is required"),
//   role: yup
//     .string()
//     .oneOf(["user", "agent"], "Please select a valid role")
//     .required("Role selection is required"),
// });

// const Signup = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [showAlert, setShowAlert] = useState(false);
//   const { error, userInfo } = useSelector((state) => state.auth);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   const [submitStatus, setSubmitStatus] = useState({
//     type: "",
//     message: "",
//     variant: "default",
//   });

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm({
//     resolver: yupResolver(signupSchema),
//     defaultValues: {
//       role: "user", // Default role
//     },
//   });

//   useEffect(() => {
//     if (userInfo) {
//       navigate("/");
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

//   const toggleConfirmPasswordVisibility = () => {
//     setShowConfirmPassword(!showConfirmPassword);
//   };

//   const onSubmit = async (data) => {
//     setLoading(true);

//     try {
//       const response = await fetch(`${backendURL}/api/register`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name: data.name,
//           email: data.email,
//           password: data.password,
//           password_confirmation: data.password_confirmation,
//           role: data.role,
//         }),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         handleAlertShow({
//           type: "success",
//           message: "Registration Successful! Check your email for verification",
//           variant: "success",
//         });
//         reset();
//       } else {
//         handleAlertShow({
//           type: "error",
//           message: result.errors.email[0] || "Failed to complete registration",
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
//       <div className="w-full max-w-4xl grid md:grid-cols-2 shadow-lg rounded-xl overflow-hidden">
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
//             Create Account
//           </h2>
//           <p className="text-gray-600 text-center mb-6">
//             Join our platform today
//           </p>

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//             <div>
//               <label className="block text-gray-700 mb-2">Full Name</label>
//               <input
//                 {...register("name")}
//                 placeholder="Enter your full name"
//                 className={`w-full p-2 border rounded ${errors.name ? "border-red-500" : "border-gray-300"}`}
//               />
//               {errors.name && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.name.message}
//                 </p>
//               )}
//             </div>

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
//                   placeholder="Create a strong password"
//                   className={`w-full p-2 border rounded ${errors.password ? "border-red-500" : "border-gray-300"}`}
//                 />
//                 <button
//                   type="button"
//                   onClick={togglePasswordVisibility}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
//                   {showPassword ? <FaEyeSlash /> : <FaEye />}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.password.message}
//                 </p>
//               )}
//             </div>

//             <div>
//               <label className="block text-gray-700 mb-2">
//                 Confirm Password
//               </label>
//               <div className="relative">
//                 <input
//                   {...register("password_confirmation")}
//                   type={showConfirmPassword ? "text" : "password"}
//                   placeholder="Confirm your password"
//                   className={`w-full p-2 border rounded ${errors.password_confirmation ? "border-red-500" : "border-gray-300"}`}
//                 />
//                 <button
//                   type="button"
//                   onClick={toggleConfirmPasswordVisibility}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
//                   {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
//                 </button>
//               </div>
//               {errors.password_confirmation && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.password_confirmation.message}
//                 </p>
//               )}
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-hoverBtn text-white py-2 rounded hover:bg-btColour transition flex items-center justify-center">
//               {loading ? (
//                 <VscLoading className="animate-spin" />
//               ) : (
//                 "Create Account"
//               )}
//             </button>
//           </form>

//           <div className="text-center mt-4">
//             <p className="text-gray-600">
//               Already have an account?{" "}
//               <a href="/login" className="text-blue-500 hover:underline">
//                 Log in
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

// export default Signup;

// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { useSearchParams } from "react-router-dom";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as yup from "yup";
// import { FaEye, FaEyeSlash, FaEnvelope, FaPhone } from "react-icons/fa";
// import { VscLoading } from "react-icons/vsc";
// import { Alert, AlertDescription } from "../../components/tools/Alert";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import backendURL from "../../config";

// // Validation Schemas for Email and Phone
// const emailSchema = yup.object().shape({
//   name: yup.string().required("Full Name is required"),
//   email: yup.string().email("Invalid email").required("Email is required"),
//   password: yup
//     .string()
//     .required("Password is required")
//     .min(8, "Password must be at least 8 characters")
//     .matches(
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
//       "Password must include uppercase, lowercase, number, and special character"
//     ),
//   password_confirmation: yup
//     .string()
//     .oneOf([yup.ref("password"), null], "Passwords must match")
//     .required("Confirm Password is required"),
//   role: yup
//     .string()
//     .oneOf(
//       ["user", "agent", "admin", "business", "super_admin"],
//       "Please select a valid role"
//     )
//     .required("Role selection is required"),
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
//   password: yup
//     .string()
//     .required("Password is required")
//     .min(8, "Password must be at least 8 characters")
//     .matches(
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
//       "Password must include uppercase, lowercase, number, and special character"
//     ),
//   password_confirmation: yup
//     .string()
//     .oneOf([yup.ref("password"), null], "Passwords must match")
//     .required("Confirm Password is required"),
//   role: yup
//     .string()
//     .oneOf(
//       ["user", "agent", "admin", "business", "super_admin"],
//       "Please select a valid role"
//     )
//     .required("Role selection is required"),
// });

// const otpSchema = yup.object().shape({
//   otp: yup
//     .string()
//     .required("OTP is required")
//     .length(6, "OTP must be 6 digits"),
// });

// const Signup = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [loading, setLoading] = useState(false);
//   const [showAlert, setShowAlert] = useState(false);
//   const { error, userInfo } = useSelector((state) => state.auth);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [showOtpModal, setShowOtpModal] = useState(false);
//   const [otpLoading, setOtpLoading] = useState(false);
//   const [resendLoading, setResendLoading] = useState(false);
//   const [registeredUser, setRegisteredUser] = useState(null);
//   const [activeTab, setActiveTab] = useState("email");
//   const [searchParams] = useSearchParams;
//   const agent_code = searchParams.get("agent_code");
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
//       email: "",
//     },
//   });

//   const phoneForm = useForm({
//     resolver: yupResolver(phoneSchema),
//     defaultValues: {
//       role: "user",
//       phone: "",
//     },
//   });

//   const {
//     register: registerOtp,
//     handleSubmit: handleOtpSubmit,
//     formState: { errors: otpErrors },
//     reset: resetOtp,
//   } = useForm({
//     resolver: yupResolver(otpSchema),
//   });

//   useEffect(() => {
//     if (userInfo) {
//       navigate("/");
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

//   const toggleConfirmPasswordVisibility = () => {
//     setShowConfirmPassword(!showConfirmPassword);
//   };

//   const handleTabSwitch = (tab) => {
//     setActiveTab(tab);
//     // Reset the forms when switching tabs
//     emailForm.reset();
//     phoneForm.reset();
//   };

//   const onSubmit = async (data, isPhone = false) => {
//     setLoading(true);

//     try {
//       const response = await fetch(`${backendURL}/api/register`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name: data.name,
//           email: isPhone ? null : data.email,
//           phone: isPhone ? data.phone : null,
//           password: data.password,
//           password_confirmation: data.password_confirmation,
//           role: data.role,
//           agent_code: data.agent_code,
//         }),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         setRegisteredUser({
//           email: isPhone ? null : data.email,
//           phone: isPhone ? data.phone : null,
//           otp: result.user?.otp, // Store OTP for testing purposes (remove in production)
//         });

//         if (isPhone) {
//           setShowOtpModal(true);
//           handleAlertShow({
//             type: "success",
//             message: "Please check your phone for the OTP.",
//             variant: "success",
//           });
//         } else {
//           handleAlertShow({
//             type: "success",
//             message: "Please check your email for the verification link.",
//             variant: "success",
//           });
//           emailForm.reset();
//         }
//       } else {
//         // Optimized error handling
//         let errorMessage = "Failed to complete registration";

//         if (result.errors) {
//           // Check for email errors first if this is email registration
//           if (!isPhone && result.errors.email) {
//             errorMessage = result.errors.email[0];
//           }
//           // Check for phone errors if this is phone registration
//           else if (isPhone && result.errors.phone) {
//             errorMessage = result.errors.phone[0];
//           }
//           // Fallback to any available error message
//           else if (result.errors.email) {
//             errorMessage = result.errors.email[0];
//           } else if (result.errors.phone) {
//             errorMessage = result.errors.phone[0];
//           } else if (result.message) {
//             errorMessage = result.message;
//           }
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

//   const onOtpSubmit = async (data) => {
//     setOtpLoading(true);

//     try {
//       const response = await fetch(`${backendURL}/api/verify-email-or-phone`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: registeredUser.email || null,
//           phone: registeredUser.phone || null,
//           otp: data.otp,
//         }),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         handleAlertShow({
//           type: "success",
//           message: "Phone verified successfully. You can now log in.",
//           variant: "success",
//         });
//         setShowOtpModal(false);
//         phoneForm.reset();
//         resetOtp();
//         navigate("/login");
//       } else {
//         handleAlertShow({
//           type: "error",
//           message: result.message || "Invalid OTP. Please try again.",
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
//       setOtpLoading(false);
//     }
//   };

//   const handleResendOtp = async () => {
//     setResendLoading(true);

//     try {
//       const response = await fetch(
//         `${backendURL}/api/resend/verification/link`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             email: registeredUser.email || null,
//             phone: registeredUser.phone || null,
//           }),
//         }
//       );

//       const result = await response.json();

//       if (response.ok) {
//         handleAlertShow({
//           type: "success",
//           message: "A new OTP has been sent to your phone.",
//           variant: "success",
//         });
//       } else {
//         handleAlertShow({
//           type: "error",
//           message: result.message || "Failed to resend OTP.",
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
//       setResendLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
//       <div className="w-full max-w-4xl grid md:grid-cols-2 shadow-lg rounded-xl overflow-hidden">
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
//             Create Account
//           </h2>
//           <p className="text-gray-600 text-center mb-6">
//             Join our platform today
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
//                       placeholder="Enter your full name"
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
//                       placeholder="Enter your email"
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

//                   <div>
//                     <label className="block text-gray-700 mb-2">
//                       Confirm Password
//                     </label>
//                     <div className="relative">
//                       <input
//                         {...emailForm.register("password_confirmation")}
//                         type={showConfirmPassword ? "text" : "password"}
//                         placeholder="Confirm your password"
//                         className={`w-full p-2 border rounded ${
//                           emailForm.formState.errors.password_confirmation
//                             ? "border-red-500"
//                             : "border-gray-300"
//                         }`}
//                       />
//                       <button
//                         type="button"
//                         onClick={toggleConfirmPasswordVisibility}
//                         className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
//                         {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
//                       </button>
//                     </div>
//                     {emailForm.formState.errors.password_confirmation && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {
//                           emailForm.formState.errors.password_confirmation
//                             .message
//                         }
//                       </p>
//                     )}
//                   </div>

//                   {/* <div>
//                     <label className="block text-gray-700 mb-2">Role</label>
//                     <select
//                       {...emailForm.register("role")}
//                       className={`w-full p-2 border rounded ${
//                         emailForm.formState.errors.role
//                           ? "border-red-500"
//                           : "border-gray-300"
//                       }`}>
//                       <option value="user">User</option>
//                       <option value="agent">Agent</option>
//                       <option value="admin">Admin</option>
//                       <option value="business">Business</option>
//                       <option value="super_admin">Super Admin</option>
//                     </select>
//                     {emailForm.formState.errors.role && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {emailForm.formState.errors.role.message}
//                       </p>
//                     )}
//                   </div> */}

//                   <div>
//                     <label className="block text-gray-700 mb-2">
//                       Referal Code(if any)
//                     </label>
//                     <input
//                       {...emailForm.register("agent_code")}
//                       placeholder="Enter Referal code (if any)"
//                       className={`w-full p-2 border rounded ${
//                         emailForm.formState.errors.agent_code
//                           ? "border-red-500"
//                           : "border-gray-300"
//                       }`}
//                     />
//                     {emailForm.formState.errors.agent_code && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {emailForm.formState.errors.agent_code.message}
//                       </p>
//                     )}
//                   </div>

//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full bg-hoverBtn text-white py-2 rounded hover:bg-btColour transition flex items-center justify-center">
//                     {loading ? (
//                       <VscLoading className="animate-spin" />
//                     ) : (
//                       "Create Account"
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
//                       placeholder="Enter your full name"
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
//                       placeholder="Enter your phone number (e.g., +1234567890)"
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

//                   <div>
//                     <label className="block text-gray-700 mb-2">
//                       Confirm Password
//                     </label>
//                     <div className="relative">
//                       <input
//                         {...phoneForm.register("password_confirmation")}
//                         type={showConfirmPassword ? "text" : "password"}
//                         placeholder="Confirm your password"
//                         className={`w-full p-2 border rounded ${
//                           phoneForm.formState.errors.password_confirmation
//                             ? "border-red-500"
//                             : "border-gray-300"
//                         }`}
//                       />
//                       <button
//                         type="button"
//                         onClick={toggleConfirmPasswordVisibility}
//                         className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
//                         {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
//                       </button>
//                     </div>
//                     {phoneForm.formState.errors.password_confirmation && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {
//                           phoneForm.formState.errors.password_confirmation
//                             .message
//                         }
//                       </p>
//                     )}
//                   </div>

//                   {/* <div>
//                     <label className="block text-gray-700 mb-2">Role</label>
//                     <select
//                       {...phoneForm.register("role")}
//                       className={`w-full p-2 border rounded ${
//                         phoneForm.formState.errors.role
//                           ? "border-red-500"
//                           : "border-gray-300"
//                       }`}>
//                       <option value="user">User</option>
//                       <option value="agent">Agent</option>
//                       <option value="admin">Admin</option>
//                       <option value="business">Business</option>
//                       <option value="super_admin">Super Admin</option>
//                     </select>
//                     {phoneForm.formState.errors.role && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {phoneForm.formState.errors.role.message}
//                       </p>
//                     )}
//                   </div> */}

//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full bg-hoverBtn text-white py-2 rounded hover:bg-btColour transition flex items-center justify-center">
//                     {loading ? (
//                       <VscLoading className="animate-spin" />
//                     ) : (
//                       "Create Account"
//                     )}
//                   </button>
//                 </form>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           <div className="text-center mt-4">
//             <p className="text-gray-600">
//               Already have an account?{" "}
//               <a href="/login" className="text-blue-500 hover:underline">
//                 Log in
//               </a>
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* OTP Modal */}
//       {showOtpModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
//             <h2 className="text-xl font-bold mb-4 text-center">
//               Verify Your Phone
//             </h2>
//             <p className="text-gray-600 text-center mb-4">
//               An OTP has been sent to {registeredUser.phone}. Please enter it
//               below.
//             </p>
//             <form onSubmit={handleOtpSubmit(onOtpSubmit)} className="space-y-4">
//               <div>
//                 <label className="block text-gray-700 mb-2">OTP</label>
//                 <input
//                   {...registerOtp("otp")}
//                   type="text"
//                   placeholder="Enter 6-digit OTP"
//                   className={`w-full p-2 border rounded ${
//                     otpErrors.otp ? "border-red-500" : "border-gray-300"
//                   }`}
//                 />
//                 {otpErrors.otp && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {otpErrors.otp.message}
//                   </p>
//                 )}
//               </div>
//               <button
//                 type="submit"
//                 disabled={otpLoading}
//                 className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition flex items-center justify-center">
//                 {otpLoading ? (
//                   <VscLoading className="animate-spin" />
//                 ) : (
//                   "Verify OTP"
//                 )}
//               </button>
//               <button
//                 type="button"
//                 onClick={handleResendOtp}
//                 disabled={resendLoading}
//                 className="w-full text-blue-500 hover:underline mt-2 flex items-center justify-center">
//                 {resendLoading ? (
//                   <VscLoading className="animate-spin" />
//                 ) : (
//                   "Resend OTP"
//                 )}
//               </button>
//             </form>
//             <button
//               onClick={() => setShowOtpModal(false)}
//               className="mt-4 w-full text-gray-600 hover:text-gray-800">
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}

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

// export default Signup;
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FaEye, FaEyeSlash, FaEnvelope, FaPhone } from "react-icons/fa";
import { VscLoading } from "react-icons/vsc";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import backendURL from "../../config";

// Validation Schemas for Email and Phone
const emailSchema = yup.object().shape({
  name: yup.string().required("Full Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
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
    .required("Confirm Password is required"),
  role: yup
    .string()
    .oneOf(
      ["user", "agent", "admin", "business", "super_admin"],
      "Please select a valid role"
    )
    .required("Role selection is required"),
  agent_code: yup.string().optional(), // Make agent_code optional
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
    .required("Confirm Password is required"),
  role: yup
    .string()
    .oneOf(
      ["user", "agent", "admin", "business", "super_admin"],
      "Please select a valid role"
    )
    .required("Role selection is required"),
  agent_code: yup.string().optional(), // Make agent_code optional
});

const otpSchema = yup.object().shape({
  otp: yup
    .string()
    .required("OTP is required")
    .length(6, "OTP must be 6 digits"),
});

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { error, userInfo } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);
  const [activeTab, setActiveTab] = useState("email");
  const [searchParams] = useSearchParams();
  const agentCodeFromParams = searchParams.get("agent_code"); // Renamed for clarity
  const [submitStatus, setSubmitStatus] = useState({
    type: "",
    message: "",
    variant: "default",
  });

  // Separate useForm instances for email and phone
  const emailForm = useForm({
    resolver: yupResolver(emailSchema),
    defaultValues: {
      role: "user",
      email: "",
      agent_code: agentCodeFromParams || "", // Pre-fill if present
    },
  });

  const phoneForm = useForm({
    resolver: yupResolver(phoneSchema),
    defaultValues: {
      role: "user",
      phone: "",
      agent_code: agentCodeFromParams || "", // Pre-fill if present
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
    if (userInfo) {
      navigate("/");
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

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    emailForm.reset({
      role: "user",
      email: "",
      agent_code: agentCodeFromParams || "",
    });
    phoneForm.reset({
      role: "user",
      phone: "",
      agent_code: agentCodeFromParams || "",
    });
  };

  const onSubmit = async (data, isPhone = false) => {
    setLoading(true);

    try {
      const response = await fetch(`${backendURL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: isPhone ? null : data.email,
          phone: isPhone ? data.phone : null,
          password: data.password,
          password_confirmation: data.password_confirmation,
          role: data.role,
          agent_code: agentCodeFromParams || data.agent_code || null, // Use params if available, else form input
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setRegisteredUser({
          email: isPhone ? null : data.email,
          phone: isPhone ? data.phone : null,
          otp: result.user?.otp, // Store OTP for testing (remove in production)
        });

        if (isPhone) {
          setShowOtpModal(true);
          handleAlertShow({
            type: "success",
            message: "Please check your phone for the OTP.",
            variant: "success",
          });
        } else {
          handleAlertShow({
            type: "success",
            message: "Please check your email for the verification link.",
            variant: "success",
          });
          emailForm.reset({
            role: "user",
            email: "",
            agent_code: agentCodeFromParams || "",
          });
        }
      } else {
        let errorMessage = "Failed to complete registration";
        if (result.errors) {
          if (!isPhone && result.errors.email) {
            errorMessage = result.errors.email[0];
          } else if (isPhone && result.errors.phone) {
            errorMessage = result.errors.phone[0];
          } else if (result.errors.email) {
            errorMessage = result.errors.email[0];
          } else if (result.errors.phone) {
            errorMessage = result.errors.phone[0];
          } else if (result.message) {
            errorMessage = result.message;
          }
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
        },
        body: JSON.stringify({
          email: registeredUser.email || null,
          phone: registeredUser.phone || null,
          otp: data.otp,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        handleAlertShow({
          type: "success",
          message: "Phone verified successfully. You can now log in.",
          variant: "success",
        });
        setShowOtpModal(false);
        phoneForm.reset({
          role: "user",
          phone: "",
          agent_code: agentCodeFromParams || "",
        });
        resetOtp();
        navigate("/login");
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
          },
          body: JSON.stringify({
            email: registeredUser.email || null,
            phone: registeredUser.phone || null,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        handleAlertShow({
          type: "success",
          message: "A new OTP has been sent to your phone.",
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 shadow-lg rounded-xl overflow-hidden">
        {/* Image Section */}
        <div
          className="hidden md:block bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1581291518857-4e27b48ff24e)",
            backgroundSize: "cover",
          }}
        />

        {/* Form Section */}
        <div className="bg-white p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
            Create Account
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Join our platform today
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
                      placeholder="Enter your full name"
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

                  <div>
                    <label className="block text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        {...emailForm.register("password_confirmation")}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className={`w-full p-2 border rounded ${
                          emailForm.formState.errors.password_confirmation
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {emailForm.formState.errors.password_confirmation && (
                      <p className="text-red-500 text-sm mt-1">
                        {
                          emailForm.formState.errors.password_confirmation
                            .message
                        }
                      </p>
                    )}
                  </div>

                  {/* Conditionally render agent_code field */}
                  {!agentCodeFromParams && (
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Referral Code (if any)
                      </label>
                      <input
                        {...emailForm.register("agent_code")}
                        placeholder="Enter Referral code (if any)"
                        className={`w-full p-2 border rounded ${
                          emailForm.formState.errors.agent_code
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {emailForm.formState.errors.agent_code && (
                        <p className="text-red-500 text-sm mt-1">
                          {emailForm.formState.errors.agent_code.message}
                        </p>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-hoverBtn text-white py-2 rounded hover:bg-btColour transition flex items-center justify-center">
                    {loading ? (
                      <VscLoading className="animate-spin" />
                    ) : (
                      "Create Account"
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
                      placeholder="Enter your full name"
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

                  <div>
                    <label className="block text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        {...phoneForm.register("password_confirmation")}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className={`w-full p-2 border rounded ${
                          phoneForm.formState.errors.password_confirmation
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700">
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {phoneForm.formState.errors.password_confirmation && (
                      <p className="text-red-500 text-sm mt-1">
                        {
                          phoneForm.formState.errors.password_confirmation
                            .message
                        }
                      </p>
                    )}
                  </div>

                  {/* Conditionally render agent_code field */}
                  {!agentCodeFromParams && (
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Referral Code (if any)
                      </label>
                      <input
                        {...phoneForm.register("agent_code")}
                        placeholder="Enter Referral code (if any)"
                        className={`w-full p-2 border rounded ${
                          phoneForm.formState.errors.agent_code
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {phoneForm.formState.errors.agent_code && (
                        <p className="text-red-500 text-sm mt-1">
                          {phoneForm.formState.errors.agent_code.message}
                        </p>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-hoverBtn text-white py-2 rounded hover:bg-btColour transition flex items-center justify-center">
                    {loading ? (
                      <VscLoading className="animate-spin" />
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="text-center mt-4">
            <p className="text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="text-blue-500 hover:underline">
                Log in
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
              Verify Your Phone
            </h2>
            <p className="text-gray-600 text-center mb-4">
              An OTP has been sent to {registeredUser.phone}. Please enter it
              below.
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

export default Signup;

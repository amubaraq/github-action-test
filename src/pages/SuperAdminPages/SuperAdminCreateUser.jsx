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
//     .oneOf(["admin", "agent", "user", "business"], "Please select a valid role")
//     .required("Role selection is required"),
//   platform: yup
//     .string()
//     .oneOf(["web", "iOS", "Android"], "Please select a valid platform")
//     .nullable(),
//   agent_code: yup.string().when("role", {
//     is: "agent",
//     then: (schema) => schema.required("Agent code is required for agents"),
//     otherwise: (schema) => schema.nullable(),
//   }),
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
//   role: yup
//     .string()
//     .oneOf(["admin", "agent", "user", "business"], "Please select a valid role")
//     .required("Role selection is required"),
//   platform: yup
//     .string()
//     .oneOf(["web", "iOS", "Android"], "Please select a valid platform")
//     .nullable(),
//   agent_code: yup.string().when("role", {
//     is: "agent",
//     then: (schema) => schema.required("Agent code is required for agents"),
//     otherwise: (schema) => schema.nullable(),
//   }),
// });

// const SuperAdminCreateUser = () => {
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
//       agent_code: "",
//       email: "",
//     },
//   });

//   const phoneForm = useForm({
//     resolver: yupResolver(phoneSchema),
//     defaultValues: {
//       role: "user",
//       platform: null,
//       agent_code: "",
//       phone: "",
//     },
//   });

//   const selectedRole =
//     activeTab === "email" ? emailForm.watch("role") : phoneForm.watch("role");

//   useEffect(() => {
//     if (!userInfo || userInfo.role !== "super_admin") {
//       navigate("/login"); // Redirect if not super admin
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
//       const response = await fetch(`${backendURL}/api/create/user`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           name: data.name,
//           email: isPhone ? null : data.email,
//           phone: isPhone ? data.phone : null,
//           password: data.password,
//           role: data.role,
//           platform: data.platform || null,
//           agent_code: data.role === "agent" ? data.agent_code : null,
//         }),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         handleAlertShow({
//           type: "success",
//           message:
//             result.message ||
//             `User created successfully. Verification ${isPhone ? "OTP" : "email"} sent.`,
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
//       <div className="w-full max-w-2xl shadow-lg rounded-xl overflow-hidden">
//         {/* Form Section */}
//         <div className="bg-white p-8 flex flex-col justify-center">
//           <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
//             Create New User
//           </h2>
//           <p className="text-gray-600 text-center mb-6">
//             Create a new user with specific role and platform{" "}
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
//                     </select>
//                     {emailForm.formState.errors.role && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {emailForm.formState.errors.role.message}
//                       </p>
//                     )}
//                   </div>

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
//                     className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition flex items-center justify-center">
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
//                     </select>
//                     {phoneForm.formState.errors.role && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {phoneForm.formState.errors.role.message}
//                       </p>
//                     )}
//                   </div>

//                   {selectedRole === "agent" && (
//                     <div>
//                       <label className="block text-gray-700 mb-2">
//                         Agent Code
//                       </label>
//                       <input
//                         {...phoneForm.register("agent_code")}
//                         placeholder="Enter agent code (e.g., ENig-JohnDoe)"
//                         className={`w-full p-2 border rounded ${
//                           phoneForm.formState.errors.agent_code
//                             ? "border-red-500"
//                             : "border-gray-300"
//                         }`}
//                       />
//                       {phoneForm.formState.errors.agent_code && (
//                         <p className="text-red-500 text-sm mt-1">
//                           {phoneForm.formState.errors.agent_code.message}
//                         </p>
//                       )}
//                     </div>
//                   )}

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
//                 href="/SuperAdmin/Dashboard"
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

// export default SuperAdminCreateUser;

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
//     .oneOf(["admin", "agent", "user", "business"], "Please select a valid role")
//     .required("Role selection is required"),
//   platform: yup
//     .string()
//     .oneOf(["web", "iOS", "Android"], "Please select a valid platform")
//     .nullable(),
//   agent_code: yup.string().when("role", {
//     is: "agent",
//     then: (schema) => schema.required("Agent code is required for agents"),
//     otherwise: (schema) => schema.nullable(),
//   }),
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
//   role: yup
//     .string()
//     .oneOf(["admin", "agent", "user", "business"], "Please select a valid role")
//     .required("Role selection is required"),
// });

// const SuperAdminCreateUser = () => {
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

//   const selectedRole =
//     activeTab === "email" ? emailForm.watch("role") : phoneForm.watch("role");

//   useEffect(() => {
//     if (!userInfo || userInfo.role !== "super_admin") {
//       navigate("/login"); // Redirect if not super admin
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
//       const response = await fetch(`${backendURL}/api/create/user`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           name: data.name,
//           email: isPhone ? null : data.email,
//           phone: isPhone ? data.phone : null,
//           password: data.password,
//           role: data.role,
//         }),
//       });

//       const result = await response.json();

//       if (response.ok) {
//         handleAlertShow({
//           type: "success",
//           message:
//             result.message ||
//             `User created successfully. Verification ${isPhone ? "OTP" : "email"} sent.`,
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
//         {/* Form Section */}
//         <div className="bg-white p-8 flex flex-col justify-center">
//           <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
//             Create New User
//           </h2>
//           <p className="text-gray-600 text-center mb-6">
//             Create a new user with specific role and platform
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
//                     </select>
//                     {emailForm.formState.errors.role && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {emailForm.formState.errors.role.message}
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
//                     </select>
//                     {phoneForm.formState.errors.role && (
//                       <p className="text-red-500 text-sm mt-1">
//                         {phoneForm.formState.errors.role.message}
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
//                 href="/SuperAdmin/Dashboard"
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

// export default SuperAdminCreateUser;
import React, { useState, useEffect, useCallback } from "react";
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
    .oneOf(["admin", "agent", "user", "business"], "Please select a valid role")
    .required("Role selection is required"),
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
  role: yup
    .string()
    .oneOf(["admin", "agent", "user", "business"], "Please select a valid role")
    .required("Role selection is required"),
});

const SuperAdminCreateUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("email");
  const { userInfo, token } = useSelector((state) => state.auth);
  const [submitStatus, setSubmitStatus] = useState({
    type: "",
    message: "",
    variant: "default",
  });

  // Form instances
  const emailForm = useForm({
    resolver: yupResolver(emailSchema),
    defaultValues: { role: "user", email: "" },
  });

  const phoneForm = useForm({
    resolver: yupResolver(phoneSchema),
    defaultValues: { role: "user", phone: "" },
  });

  // Check auth
  useEffect(() => {
    if (!userInfo || userInfo.role !== "super_admin") {
      navigate("/login");
    }
  }, [userInfo, navigate]);

  // Memoized handlers
  const handleAlertShow = useCallback((status) => {
    setSubmitStatus(status);
    setShowAlert(true);
  }, []);

  const handleAlertClose = useCallback(() => {
    setShowAlert(false);
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleTabSwitch = useCallback(
    (tab) => {
      setActiveTab(tab);
      emailForm.reset({ role: "user", email: "" });
      phoneForm.reset({ role: "user", phone: "" });
    },
    [emailForm, phoneForm]
  );

  const onSubmit = useCallback(
    async (data, isPhone = false) => {
      setLoading(true);
      try {
        const response = await fetch(`${backendURL}/api/create/user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: data.name,
            email: isPhone ? null : data.email,
            phone: isPhone ? data.phone : null,
            password: data.password,
            role: data.role,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          handleAlertShow({
            type: "success",
            message:
              result.message ||
              `User created successfully. Verification ${isPhone ? "OTP" : "email"} sent.`,
            variant: "success",
          });
          isPhone
            ? phoneForm.reset({ role: "user", phone: "" })
            : emailForm.reset({ role: "user", email: "" });
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
    },
    [token, handleAlertShow, emailForm, phoneForm]
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl shadow-lg rounded-xl overflow-hidden">
        <div className="bg-white p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
            Create New User
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Create a new user with specific role
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
                    <label className="block text-gray-700 mb-2">Role</label>
                    <select
                      {...emailForm.register("role")}
                      className={`w-full p-2 border rounded ${
                        emailForm.formState.errors.role
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}>
                      <option value="user">User</option>
                      <option value="agent">Agent</option>
                      <option value="admin">Admin</option>
                      <option value="business">Business</option>
                    </select>
                    {emailForm.formState.errors.role && (
                      <p className="text-red-500 text-sm mt-1">
                        {emailForm.formState.errors.role.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition flex items-center justify-center disabled:opacity-50">
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
                    <label className="block text-gray-700 mb-2">Role</label>
                    <select
                      {...phoneForm.register("role")}
                      className={`w-full p-2 border rounded ${
                        phoneForm.formState.errors.role
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}>
                      <option value="user">User</option>
                      <option value="agent">Agent</option>
                      <option value="admin">Admin</option>
                      <option value="business">Business</option>
                    </select>
                    {phoneForm.formState.errors.role && (
                      <p className="text-red-500 text-sm mt-1">
                        {phoneForm.formState.errors.role.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition flex items-center justify-center disabled:opacity-50">
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
                href="/SuperAdmin/Dashboard"
                className="text-blue-500 hover:underline">
                Dashboard
              </a>
            </p>
          </div>
        </div>
      </div>

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

export default SuperAdminCreateUser;

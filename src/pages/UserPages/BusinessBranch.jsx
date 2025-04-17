// import React, { useState, useEffect, useCallback } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useForm, FormProvider } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import * as Yup from "yup";
// import { Alert, AlertDescription } from "../../components/tools/Alert";
// import { ChevronRight, Trash2, Save, ArrowLeft } from "lucide-react";
// import backendURL from "../../config";
// import statesAndLGAs from "../../assets/json/statesAndLGAs.json";
// import LoadingSpinner2 from "../../components/tools/loadingSpinner2";
// import { useSelector } from "react-redux";

// const BACKEND_URL = backendURL;

// const BusinessBranch = () => {
//   const { token } = useSelector((state) => state.auth);

//   const { slug } = useParams();
//   const navigate = useNavigate();
//   const [branches, setBranches] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
//   const [businessId, setBusinessId] = useState(null);
//   const [showAlert, setShowAlert] = useState(false);

//   // Validation schema
//   const validationSchema = Yup.object().shape({
//     branch_name: Yup.string().required("Branch name is required"),
//     state: Yup.string().required("State is required"),
//     city: Yup.string().required("City is required"),
//     branch_address: Yup.string().required("Address is required"),
//     contact_person: Yup.string().required("Contact person is required"),
//     contact_number: Yup.string().required("Contact number is required"),
//     contact_email: Yup.string()
//       .email("Invalid email")
//       .required("Email is required"),
//     operation_hours: Yup.string().required("Operation hours are required"),
//     number_of_staff: Yup.number()
//       .typeError("Must be a number")
//       .min(0)
//       .required("Number of staff is required"),
//     property_status: Yup.string().required("Property status is required"),
//     date_established: Yup.date()
//       .typeError("Must be a valid date")
//       .required("Date established is required"),
//     years_of_operation: Yup.number()
//       .typeError("Must be a number")
//       .min(0)
//       .required("Years of operation is required"),
//     nearest_bus_stop: Yup.string().optional(),
//     landmark: Yup.string().optional(),

//     expected_daily_income: Yup.number()
//       .typeError("Must be a number")
//       .min(0)
//       .required("expected daily income is required"),
//   });

//   const methods = useForm({
//     resolver: yupResolver(validationSchema),
//     defaultValues: {
//       branch_name: "",
//       state: "",
//       city: "",
//       branch_address: "",
//       contact_person: "",
//       contact_number: "",
//       contact_email: "",
//       operation_hours: "",
//       number_of_staff: "",
//       property_status: "",
//       date_established: "",
//       years_of_operation: "",
//       nearest_bus_stop: "",
//       landmark: "",
//       expected_daily_income: "",
//     },
//   });

//   const {
//     handleSubmit,
//     register,
//     formState: { errors },
//     reset,
//   } = methods;

//   const states = statesAndLGAs.statesAndLGAs.map((state) => ({
//     id: state.id,
//     name: state.name,
//   }));
//   const selectedState = statesAndLGAs.statesAndLGAs.find(
//     (state) => state.name === methods.watch("state")
//   );
//   const lgas = selectedState ? selectedState.local_governments : [];

//   const fetchBranches = useCallback(async () => {
//     if (!token) {
//       setError("Authentication token is missing. Please log in again.");
//       setShowAlert(true);
//       navigate("/login"); // Redirect to login page
//       return;
//     }

//     setLoading(true);
//     try {
//       const response = await fetch(`${BACKEND_URL}/api/business/${slug}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Failed to fetch branches");
//       }
//       const data = await response.json();
//       setBusinessId(data.business.id);
//       setBranches(data.branches || []);
//     } catch (err) {
//       setError(err.message);
//       setShowAlert(true);
//       if (err.message.includes("Wrong number of segments")) {
//         navigate("/login"); // Redirect to login if token is invalid
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [slug, token, navigate]);

//   useEffect(() => {
//     fetchBranches();
//   }, [fetchBranches]);

//   const handleCreateBranch = useCallback(
//     async (data) => {
//       if (!businessId) {
//         setError("Business ID not available. Please try again.");
//         setShowAlert(true);
//         return;
//       }

//       if (!token) {
//         setError("Authentication token is missing. Please log in again.");
//         setShowAlert(true);
//         navigate("/login");
//         return;
//       }

//       setLoading(true);
//       try {
//         const payload = {
//           business_id: parseInt(businessId),
//           branch_name: data.branch_name,
//           state: data.state,
//           city: data.city,
//           branch_address: data.branch_address,
//           contact_person: data.contact_person,
//           contact_number: data.contact_number,
//           contact_email: data.contact_email,
//           operation_hours: data.operation_hours,
//           number_of_staff: parseInt(data.number_of_staff),
//           property_status: data.property_status,
//           date_established: data.date_established,
//           years_of_operation: Number(data.years_of_operation),
//           nearest_bus_stop: data.nearest_bus_stop || "",
//           landmark: data.landmark || "",
//           expected_daily_income: parseInt(data.expected_daily_income),
//         };

//         console.log("Payload being sent:", payload);

//         const response = await fetch(
//           `${BACKEND_URL}/api/create/business/branch`,
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token.trim()}`, // Ensure no extra spaces
//             },
//             body: JSON.stringify(payload),
//           }
//         );

//         if (!response.ok) {
//           const errorData = await response.json();
//           console.log("Error response:", errorData);
//           throw new Error(errorData.message || "Failed to create branch");
//         }

//         await response.json();
//         setSuccess("Branch created successfully!");
//         setShowAlert(true);
//         reset();
//         fetchBranches();
//       } catch (err) {
//         setError(err.message);
//         setShowAlert(true);
//         if (err.message.includes("Wrong number of segments")) {
//           navigate("/login");
//         }
//       } finally {
//         setLoading(false);
//       }
//     },
//     [businessId, token, reset, fetchBranches, navigate]
//   );

//   const handleUpdateBranch = useCallback(
//     async (branchId, updatedBranch) => {
//       if (!token) {
//         setError("Authentication token is missing. Please log in again.");
//         setShowAlert(true);
//         navigate("/login");
//         return;
//       }

//       setLoading(true);
//       try {
//         const response = await fetch(
//           `${BACKEND_URL}/api/update/business/branch/${branchId}`,
//           {
//             method: "PUT",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//             body: JSON.stringify({
//               business_id: businessId,
//               ...updatedBranch,
//               number_of_staff: parseInt(updatedBranch.number_of_staff),
//               years_of_operation: Number(updatedBranch.years_of_operation),
//               nearest_bus_stop: updatedBranch.nearest_bus_stop || "",
//               landmark: updatedBranch.landmark || "",
//             }),
//           }
//         );
//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.message || "Failed to update branch");
//         }
//         setSuccess("Branch updated successfully!");
//         setShowAlert(true);
//         fetchBranches();
//       } catch (err) {
//         setError(err.message);
//         setShowAlert(true);
//         if (err.message.includes("Wrong number of segments")) {
//           navigate("/login");
//         }
//       } finally {
//         setLoading(false);
//       }
//     },
//     [businessId, token, fetchBranches, navigate]
//   );

//   const handleRemoveBranch = useCallback(
//     async (branchId) => {
//       if (!token) {
//         setError("Authentication token is missing. Please log in again.");
//         setShowAlert(true);
//         navigate("/login");
//         return;
//       }

//       setLoading(true);
//       try {
//         const response = await fetch(
//           `${BACKEND_URL}/delete/business/branch/${branchId}`,
//           {
//             method: "DELETE",
//             headers: { Authorization: `Bearer ${token.trim()}` },
//           }
//         );
//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.message || "Failed to delete branch");
//         }
//         setSuccess("Branch deleted successfully!");
//         setShowAlert(true);
//         fetchBranches();
//       } catch (err) {
//         setError(err.message);
//         setShowAlert(true);
//         if (err.message.includes("Wrong number of segments")) {
//           navigate("/login");
//         }
//       } finally {
//         setLoading(false);
//       }
//     },
//     [token, fetchBranches, navigate]
//   );

//   const LoadingSpinner = () => <LoadingSpinner2 />;

//   return (
//     <div className="sm:p-6 max-w-4xl mx-auto mid:mt-16">
//       <div className="my-4 flex justify-between items-center">
//         <button
//           onClick={() => navigate(`/user/business/${slug}`)}
//           className="flex items-center text-blue-600 hover:text-blue-800">
//           <ArrowLeft size={18} className="mr-1" /> Return
//         </button>
//         <h2 className="text-2xl font-bold text-[#262980]">
//           Manage Business Branches
//         </h2>
//       </div>
//       {loading && <LoadingSpinner />}
//       {showAlert && (
//         <Alert
//           variant={error ? "destructive" : "success"}
//           show={showAlert}
//           onClose={() => setShowAlert(false)}
//           autoClose={true}
//           autoCloseTime={5000}>
//           <AlertDescription>{error || success}</AlertDescription>
//         </Alert>
//       )}

//       {/* Add New Branch Form */}
//       <FormProvider {...methods}>
//         <form
//           onSubmit={handleSubmit(handleCreateBranch)}
//           className="bg-white p-6 rounded-lg shadow-lg mb-8">
//           <h3 className="text-xl font-semibold text-[#191b65] mb-6">
//             Add New Branch
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {[
//               {
//                 name: "branch_name",
//                 label: "Branch Name",
//                 placeholder: "e.g., North Branch",
//                 required: true,
//               },
//               {
//                 name: "state",
//                 label: "State",
//                 type: "select",
//                 placeholder: "Select State",
//                 required: true,
//               },
//               {
//                 name: "city",
//                 label: "City",
//                 type: "select",
//                 placeholder: "Select City",
//                 disabled: !methods.watch("state"),
//                 required: true,
//               },
//               {
//                 name: "branch_address",
//                 label: "Address",
//                 placeholder: "e.g., 123 Main St, Lagos",
//                 required: true,
//               },
//               {
//                 name: "contact_person",
//                 label: "Contact Person",
//                 placeholder: "e.g., John Doe",
//                 required: true,
//               },
//               {
//                 name: "contact_number",
//                 label: "Contact Number",
//                 placeholder: "e.g., +234 801 234 5678",
//                 required: true,
//               },
//               {
//                 name: "contact_email",
//                 label: "Contact Email",
//                 type: "email",
//                 placeholder: "e.g., branch@business.com",
//                 required: true,
//               },
//               {
//                 name: "operation_hours",
//                 label: "Operation Hours",
//                 placeholder: "e.g., Mon-Fri 9AM-5PM",
//                 required: true,
//               },
//               {
//                 name: "number_of_staff",
//                 label: "Number of Staff",
//                 type: "number",
//                 placeholder: "e.g., 10",
//                 required: true,
//               },
//               {
//                 name: "property_status",
//                 label: "Property Status",
//                 type: "select",
//                 options: ["", "leased", "owned"],
//                 placeholder: "Select Status",
//                 required: true,
//               },
//               {
//                 name: "date_established",
//                 label: "Date Established",
//                 type: "date",
//                 placeholder: "e.g., 2023-01-01",
//                 required: true,
//               },
//               {
//                 name: "years_of_operation",
//                 label: "Years of Operation",
//                 type: "number",
//                 placeholder: "e.g., 2",
//                 required: true,
//               },
//               {
//                 name: "expected_daily_income",
//                 label: "Expected daily income",
//                 type: "number",
//                 placeholder: "e.g., 5000",
//                 required: true,
//               },
//               {
//                 name: "nearest_bus_stop",
//                 label: "Nearest Bus Stop",
//                 placeholder: "e.g., Ikeja Bus Stop",
//                 required: false,
//               },
//               {
//                 name: "landmark",
//                 label: "Landmark",
//                 placeholder: "e.g., Opposite City Mall",
//                 required: false,
//               },
//             ].map((field) => (
//               <div key={field.name} className="space-y-1">
//                 <label className="block text-sm font-medium text-gray-700">
//                   {field.label}
//                   {field.required && <span className="text-red-500"> *</span>}
//                 </label>
//                 {field.type === "select" ? (
//                   <select
//                     {...register(field.name)}
//                     className={`w-full p-2 border rounded-md ${errors[field.name] ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500`}
//                     disabled={field.disabled}>
//                     <option value="">{field.placeholder}</option>
//                     {field.name === "state"
//                       ? states.map((state) => (
//                           <option key={state.id} value={state.name}>
//                             {state.name}
//                           </option>
//                         ))
//                       : field.name === "city"
//                         ? lgas.map((lga) => (
//                             <option key={lga.id} value={lga.name}>
//                               {lga.name}
//                             </option>
//                           ))
//                         : field.options.map((opt, i) => (
//                             <option key={i} value={opt}>
//                               {opt.charAt(0).toUpperCase() + opt.slice(1)}
//                             </option>
//                           ))}
//                   </select>
//                 ) : (
//                   <input
//                     type={field.type || "text"}
//                     {...register(field.name)}
//                     className={`w-full p-2 border rounded-md ${errors[field.name] ? "border-red-500" : "border-gray-300"} focus:ring-2 focus:ring-blue-500`}
//                     placeholder={field.placeholder}
//                   />
//                 )}
//                 {errors[field.name] && (
//                   <p className="text-xs text-red-500">
//                     {errors[field.name].message}
//                   </p>
//                 )}
//               </div>
//             ))}
//           </div>
//           <button
//             type="submit"
//             disabled={loading || !businessId}
//             className="mt-6 w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center">
//             <ChevronRight size={18} className="mr-2" /> Add Branch
//           </button>
//         </form>
//       </FormProvider>

//       {/* Branch List */}
//       <div className="space-y-6">
//         <h3 className="text-xl font-semibold text-[#191b65]">
//           Existing Branches
//         </h3>
//         {branches.length === 0 ? (
//           <p className="text-gray-500 text-lg">No branches added yet.</p>
//         ) : (
//           branches.map((branch) => (
//             <div
//               key={branch.id}
//               className="bg-white p-5 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <h4 className="text-lg font-semibold text-gray-800">
//                     {branch.branch_name}
//                   </h4>
//                   <p className="text-gray-600">{branch.branch_address}</p>
//                   <p className="text-gray-600">
//                     {branch.city}, {branch.state}
//                   </p>
//                   <p className="text-sm text-gray-500">
//                     Staff: {branch.number_of_staff}
//                   </p>
//                   <p className="text-sm text-gray-500">
//                     Nearest Bus Stop: {branch.nearest_bus_stop || "N/A"}
//                   </p>
//                   <p className="text-sm text-gray-500">
//                     Landmark: {branch.landmark || "N/A"}
//                   </p>
//                 </div>
//                 <div className="space-x-3">
//                   <button
//                     onClick={() =>
//                       handleUpdateBranch(branch.id, {
//                         ...branch,
//                         branch_name:
//                           prompt("New branch name", branch.branch_name) ||
//                           branch.branch_name,
//                       })
//                     }
//                     className="text-blue-600 hover:text-blue-800 transition-colors">
//                     <Save size={18} />
//                   </button>
//                   <button
//                     onClick={() => handleRemoveBranch(branch.id)}
//                     className="text-red-600 hover:text-red-800 transition-colors">
//                     <Trash2 size={18} />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default BusinessBranch;
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { Alert, AlertDescription } from "../../components/tools/Alert";
import { ChevronRight, Trash2, ArrowLeft, Edit2 } from "lucide-react";
import backendURL from "../../config";
import statesAndLGAs from "../../assets/json/statesAndLGAs.json";
import LoadingSpinner2 from "../../components/tools/loadingSpinner2";
import { useSelector } from "react-redux";

const BACKEND_URL = backendURL;

const BusinessBranch = () => {
  const { token } = useSelector((state) => state.auth);
  const { slug } = useParams();
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [businessId, setBusinessId] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);

  // Validation schema
  const validationSchema = Yup.object().shape({
    branch_name: Yup.string().required("Branch name is required"),
    state: Yup.string().required("State is required"),
    city: Yup.string().required("City is required"),
    branch_address: Yup.string().required("Address is required"),
    contact_person: Yup.string().required("Contact person is required"),
    contact_number: Yup.string().required("Contact number is required"),
    contact_email: Yup.string()
      .email("Invalid email")
      .required("Email is required"),
    operation_hours: Yup.string().required("Operation hours are required"),
    number_of_staff: Yup.number()
      .typeError("Must be a number")
      .min(0)
      .required("Number of staff is required"),
    property_status: Yup.string().required("Property status is required"),
    date_established: Yup.date()
      .typeError("Must be a valid date")
      .required("Date established is required"),
    years_of_operation: Yup.number()
      .typeError("Must be a number")
      .min(0)
      .required("Years of operation is required"),
    nearest_bus_stop: Yup.string().optional(),
    landmark: Yup.string().optional(),
    expected_daily_income: Yup.number()
      .typeError("Must be a number")
      .min(0)
      .required("Expected daily income is required"),
  });

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      branch_name: "",
      state: "",
      city: "",
      branch_address: "",
      contact_person: "",
      contact_number: "",
      contact_email: "",
      operation_hours: "",
      number_of_staff: "",
      property_status: "",
      date_established: "",
      years_of_operation: "",
      nearest_bus_stop: "",
      landmark: "",
      expected_daily_income: "",
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setValue,
  } = methods;

  const states = statesAndLGAs.statesAndLGAs.map((state) => ({
    id: state.id,
    name: state.name,
  }));
  const selectedState = statesAndLGAs.statesAndLGAs.find(
    (state) => state.name === methods.watch("state")
  );
  const lgas = selectedState ? selectedState.local_governments : [];

  const fetchBranches = useCallback(async () => {
    if (!token) {
      setError("Authentication token is missing. Please log in again.");
      setShowAlert(true);
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/business/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch branches");
      }
      const data = await response.json();
      setBusinessId(data.business.id);
      setBranches(data.branches || []);
    } catch (err) {
      setError(err.message);
      setShowAlert(true);
      if (err.message.includes("Wrong number of segments")) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [slug, token, navigate]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const handleCreateBranch = useCallback(
    async (data) => {
      if (!businessId) {
        setError("Business ID not available. Please try again.");
        setShowAlert(true);
        return;
      }

      if (!token) {
        setError("Authentication token is missing. Please log in again.");
        setShowAlert(true);
        navigate("/login");
        return;
      }

      setLoading(true);
      try {
        const payload = {
          business_id: parseInt(businessId),
          branch_name: data.branch_name,
          state: data.state,
          city: data.city,
          branch_address: data.branch_address,
          contact_person: data.contact_person,
          contact_number: data.contact_number,
          contact_email: data.contact_email,
          operation_hours: data.operation_hours,
          number_of_staff: parseInt(data.number_of_staff),
          property_status: data.property_status,
          date_established: data.date_established,
          years_of_operation: Number(data.years_of_operation),
          nearest_bus_stop: data.nearest_bus_stop || "",
          landmark: data.landmark || "",
          expected_daily_income: parseInt(data.expected_daily_income),
        };

        const response = await fetch(
          `${BACKEND_URL}/api/create/business/branch`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token.trim()}`,
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to create branch");
        }

        await response.json();
        setSuccess("Branch created successfully!");
        setShowAlert(true);
        reset();
        fetchBranches();
        setShowModal(false);
      } catch (err) {
        setError(err.message);
        setShowAlert(true);
        if (err.message.includes("Wrong number of segments")) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    },
    [businessId, token, reset, fetchBranches, navigate]
  );

  const handleUpdateBranch = useCallback(
    async (data) => {
      if (!editingBranch) return;

      setLoading(true);
      try {
        const response = await fetch(
          `${BACKEND_URL}/api/update/business/branch/${editingBranch.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              business_id: businessId,
              ...data,
              number_of_staff: parseInt(data.number_of_staff),
              years_of_operation: Number(data.years_of_operation),
              nearest_bus_stop: data.nearest_bus_stop || "",
              landmark: data.landmark || "",
              expected_daily_income: parseInt(data.expected_daily_income),
            }),
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to update branch");
        }
        setSuccess("Branch updated successfully!");
        setShowAlert(true);
        fetchBranches();
        setShowModal(false);
        setEditingBranch(null);
        reset();
      } catch (err) {
        setError(err.message);
        setShowAlert(true);
        if (err.message.includes("Wrong number of segments")) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    },
    [businessId, token, fetchBranches, editingBranch, navigate, reset]
  );

  const handleRemoveBranch = useCallback(
    async (branchId) => {
      if (!token) {
        setError("Authentication token is missing. Please log in again.");
        setShowAlert(true);
        navigate("/login");
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `${BACKEND_URL}/delete/business/branch/${branchId}`,
          {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token.trim()}` },
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to delete branch");
        }
        setSuccess("Branch deleted successfully!");
        setShowAlert(true);
        fetchBranches();
        setShowDeleteModal(null);
      } catch (err) {
        setError(err.message);
        setShowAlert(true);
        if (err.message.includes("Wrong number of segments")) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    },
    [token, fetchBranches, navigate]
  );

  const openEditModal = (branch) => {
    setEditingBranch(branch);
    Object.keys(branch).forEach((key) => setValue(key, branch[key]));
    setShowModal(true);
  };

  const BranchFormModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(
              editingBranch ? handleUpdateBranch : handleCreateBranch
            )}
            className="space-y-6">
            <h3 className="text-xl font-semibold text-[#191b65] mb-6">
              {editingBranch ? "Edit Branch" : "Add New Branch"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  name: "branch_name",
                  label: "Branch Name",
                  placeholder: "e.g., North Branch",
                  required: true,
                },
                {
                  name: "state",
                  label: "State",
                  type: "select",
                  placeholder: "Select State",
                  required: true,
                },
                {
                  name: "city",
                  label: "City",
                  type: "select",
                  placeholder: "Select City",
                  disabled: !methods.watch("state"),
                  required: true,
                },
                {
                  name: "branch_address",
                  label: "Address",
                  placeholder: "e.g., 123 Main St, Lagos",
                  required: true,
                },
                {
                  name: "contact_person",
                  label: "Contact Person",
                  placeholder: "e.g., John Doe",
                  required: true,
                },
                {
                  name: "contact_number",
                  label: "Contact Number",
                  placeholder: "e.g., +234 801 234 5678",
                  required: true,
                },
                {
                  name: "contact_email",
                  label: "Contact Email",
                  type: "email",
                  placeholder: "e.g., branch@business.com",
                  required: true,
                },
                {
                  name: "operation_hours",
                  label: "Operation Hours",
                  placeholder: "e.g., Mon-Fri 9AM-5PM",
                  required: true,
                },
                {
                  name: "number_of_staff",
                  label: "Number of Staff",
                  type: "number",
                  placeholder: "e.g., 10",
                  required: true,
                },
                {
                  name: "property_status",
                  label: "Property Status",
                  type: "select",
                  options: ["", "leased", "owned"],
                  placeholder: "Select Status",
                  required: true,
                },
                {
                  name: "date_established",
                  label: "Date Established",
                  type: "date",
                  placeholder: "e.g., 2023-01-01",
                  required: true,
                },
                {
                  name: "years_of_operation",
                  label: "Years of Operation",
                  type: "number",
                  placeholder: "e.g., 2",
                  required: true,
                },
                {
                  name: "expected_daily_income",
                  label: "Expected Daily Income",
                  type: "number",
                  placeholder: "e.g., 5000",
                  required: true,
                },
                {
                  name: "nearest_bus_stop",
                  label: "Nearest Bus Stop",
                  placeholder: "e.g., Ikeja Bus Stop",
                  required: false,
                },
                {
                  name: "landmark",
                  label: "Landmark",
                  placeholder: "e.g., Opposite City Mall",
                  required: false,
                },
              ].map((field) => (
                <div key={field.name} className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label}
                    {field.required && <span className="text-red-500"> *</span>}
                  </label>
                  {field.type === "select" ? (
                    <select
                      {...register(field.name)}
                      className={`w-full p-2 border rounded-md ${
                        errors[field.name]
                          ? "border-red-500"
                          : "border-gray-300"
                      } focus:ring-2 focus:ring-blue-500`}
                      disabled={field.disabled}>
                      <option value="">{field.placeholder}</option>
                      {field.name === "state"
                        ? states.map((state) => (
                            <option key={state.id} value={state.name}>
                              {state.name}
                            </option>
                          ))
                        : field.name === "city"
                          ? lgas.map((lga) => (
                              <option key={lga.id} value={lga.name}>
                                {lga.name}
                              </option>
                            ))
                          : field.options.map((opt, i) => (
                              <option key={i} value={opt}>
                                {opt.charAt(0).toUpperCase() + opt.slice(1)}
                              </option>
                            ))}
                    </select>
                  ) : (
                    <input
                      type={field.type || "text"}
                      {...register(field.name)}
                      className={`w-full p-2 border rounded-md ${
                        errors[field.name]
                          ? "border-red-500"
                          : "border-gray-300"
                      } focus:ring-2 focus:ring-blue-500`}
                      placeholder={field.placeholder}
                    />
                  )}
                  {errors[field.name] && (
                    <p className="text-xs text-red-500">
                      {errors[field.name].message}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setEditingBranch(null);
                  reset();
                }}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !businessId}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center">
                {editingBranch ? "Update Branch" : "Add Branch"}
                {loading && <span className="ml-2 animate-spin">⌛</span>}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );

  const DeleteConfirmModal = ({ branchId }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h3 className="text-xl font-semibold text-[#191b65] mb-4">
          Confirm Deletion
        </h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this branch? This action cannot be
          undone.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowDeleteModal(null)}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => handleRemoveBranch(branchId)}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center">
            Delete
            {loading && <span className="ml-2 animate-spin">⌛</span>}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="sm:p-6 max-w-4xl mx-auto mid:mt-16">
      <div className="my-4 flex justify-between items-center">
        <button
          onClick={() => navigate(`/user/business/${slug}`)}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
          <ArrowLeft size={18} className="mr-1" /> Return
        </button>
        <h2 className="text-2xl font-bold text-[#262980]">
          Manage Business Branches
        </h2>
      </div>

      {loading && <LoadingSpinner2 />}
      {showAlert && (
        <Alert
          variant={error ? "destructive" : "success"}
          show={showAlert}
          onClose={() => setShowAlert(false)}
          autoClose={true}
          autoCloseTime={5000}>
          <AlertDescription>{error || success}</AlertDescription>
        </Alert>
      )}

      <button
        onClick={() => {
          reset();
          setEditingBranch(null);
          setShowModal(true);
        }}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center">
        <ChevronRight size={18} className="mr-2" /> Add New Branch
      </button>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-[#191b65]">
          Existing Branches
        </h3>
        {branches.length === 0 ? (
          <p className="text-gray-500 text-lg">No branches added yet.</p>
        ) : (
          branches.map((branch) => (
            <div
              key={branch.id}
              className="bg-white p-5 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">
                    {branch.branch_name}
                  </h4>
                  <p className="text-gray-600">{branch.branch_address}</p>
                  <p className="text-gray-600">
                    {branch.city}, {branch.state}
                  </p>
                  <p className="text-sm text-gray-500">
                    Staff: {branch.number_of_staff}
                  </p>
                  <p className="text-sm text-gray-500">
                    Nearest Bus Stop: {branch.nearest_bus_stop || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Landmark: {branch.landmark || "N/A"}
                  </p>
                </div>
                <div className="space-x-3">
                  <button
                    onClick={() => openEditModal(branch)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    title="Edit Branch">
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => setShowDeleteModal(branch.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                    title="Delete Branch">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && <BranchFormModal />}
      {showDeleteModal && <DeleteConfirmModal branchId={showDeleteModal} />}
    </div>
  );
};

export default BusinessBranch;

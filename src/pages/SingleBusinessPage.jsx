// import React, { useState, useEffect, useCallback } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   Building2,
//   MapPin,
//   Mail,
//   Phone,
//   Share2,
//   Flag,
//   Calendar,
//   Users,
//   Briefcase,
//   Clock,
//   Globe,
//   ChevronLeft,
//   Eye,
//   EyeOff,
//   Star,
//   DollarSign,
//   User,
//   ImageIcon,
//   IdCard,
//   X,
//   ChevronRight,
// } from "lucide-react";
// import { motion } from "framer-motion";
// import LoadingSpinner from "../components/tools/LoaddingSpinner";
// import BranchDetails from "../components/BranchDetails"; // Import the new component
// import backendURL from "../config";
// import BusinessReview from "../components/BusinessReview";

// // Default business logo
// const defaultBusinessLogo =
//   "https://res.cloudinary.com/digzrkdoe/image/upload/v1740847778/edirect_business_photos/business_67c33aa215e8f.png";

// // Framer Motion animation variants
// const fadeInUp = {
//   hidden: { opacity: 0, y: 20 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
// };

// const fadeInRight = {
//   hidden: { opacity: 0, x: -20 },
//   visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
// };

// const SingleBusinessPage = () => {
//   const { slug } = useParams();
//   const [profile, setProfile] = useState(null);
//   const [founder, setFounder] = useState(null); // New state for founder data
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isContactVisible, setIsContactVisible] = useState(true);
//   const [activeTab, setActiveTab] = useState("overview");
//   const [branches, setBranches] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const navigate = useNavigate();

//   const fetchBusinessProfile = useCallback(async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${backendURL}/api/business/${slug}`);
//       console.log(response.data, "response for business data");
//       if (response.data.status === "success" && response.data.business) {
//         const businessData = response.data.business;
//         const parsedData = {
//           ...businessData,
//           staff: businessData.staff
//             ? typeof businessData.staff === "string"
//               ? JSON.parse(businessData.staff)
//               : Array.isArray(businessData.staff)
//                 ? businessData.staff
//                 : []
//             : [],
//           social_media: businessData.social_media
//             ? typeof businessData.social_media === "string"
//               ? JSON.parse(businessData.social_media)
//               : businessData.social_media
//             : {},
//           business_photos: businessData.business_photos || [],
//           product_photos:
//             businessData.product_photos &&
//             businessData.product_photos.length > 0
//               ? [
//                   {
//                     photo_paths: JSON.parse(
//                       businessData.product_photos[0].photo_paths.replace(
//                         /\\\//g,
//                         "/"
//                       )
//                     ),
//                   },
//                 ]
//               : [],
//         };
//         setProfile(parsedData);
//         setBranches(response.data.branches || []);
//         // Assuming founder data is included or fetched separately
//         setFounder(response.data.founder || null); // Adjust based on API response
//       } else {
//         setError("Business profile not found");
//       }
//     } catch (err) {
//       setError("Error fetching business profile data");
//       console.error("API fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, [slug]);

//   useEffect(() => {
//     fetchBusinessProfile();
//   }, [fetchBusinessProfile]);

//   const initiateCall = useCallback(() => {
//     window.location.href = `tel:${profile?.contact_person_number}`;
//   }, [profile?.contact_person_number]);

//   const visitWebSite = useCallback(() => {
//     if (profile?.business_website) {
//       window.open(profile.business_website, "_blank");
//     }
//   }, [profile?.business_website]);

//   const handleReportClick = useCallback(() => {
//     if (profile?.id) {
//       navigate(`/reportsBusiness?businessId=${profile.id}`);
//     }
//   }, [profile?.id, navigate]);

//   const handleShare = async () => {
//     try {
//       if (navigator.share) {
//         await navigator.share({
//           title: profile?.business_name,
//           text: `Check out ${profile?.business_name}'s profile`,
//           url: window.location.href,
//         });
//       } else {
//         navigator.clipboard.writeText(window.location.href);
//         alert("Business profile link copied to clipboard!");
//       }
//     } catch (error) {
//       console.error("Error sharing:", error);
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return isNaN(date)
//       ? "Invalid"
//       : date.toLocaleDateString("en-US", {
//           month: "short",
//           day: "numeric",
//           year: "numeric",
//         });
//   };

//   const toggleContactVisibility = () => setIsContactVisible(!isContactVisible);

//   if (loading)
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-100">
//         <LoadingSpinner />
//       </div>
//     );

//   if (error || !profile)
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
//         <motion.div
//           className="bg-white rounded-lg shadow p-6 max-w-md w-full text-center"
//           initial="hidden"
//           animate="visible"
//           variants={fadeInUp}>
//           <div className="text-red-500 mb-4">
//             <svg
//               width="48"
//               height="48"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               className="mx-auto animate-pulse">
//               <circle cx="12" cy="12" r="10" />
//               <line x1="12" y1="8" x2="12" y2="12" />
//               <line x1="12" y1="16" x2="12" y2="16" />
//             </svg>
//           </div>
//           <h2 className="text-xl font-semibold text-gray-800 mb-2">
//             {error || "Business Not Found"}
//           </h2>
//           <p className="text-gray-600 mb-4">
//             The business profile doesn't exist or has been removed.
//           </p>
//           <Link
//             to="/searchPage/businesses"
//             className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
//             <ChevronLeft size={16} /> Back to Search
//           </Link>
//         </motion.div>
//       </div>
//     );

//   const socialMedia = profile.social_media || {};
//   const staff = profile.staff || [];
//   const tabs = ["overview", "gallery", "reviews", "branches", "founder"];

//   return (
//     <div className="max-w-6xl mx-auto bg-gray-100 min-h-screen p-4">
//       {/* Header Section */}
//       <motion.div
//         className="bg-white rounded-lg shadow overflow-hidden bg-gradient-to-r from-[#341f1f] to-[#803d3d] opacity-80"
//         initial="hidden"
//         animate="visible"
//         variants={fadeInUp}>
//         <div className="relative h-32">
//           <Link
//             to="/business"
//             className="absolute top-2 left-2 p-1 bg-white/20 rounded-full text-white hover:bg-white/30 transition">
//             <ChevronLeft size={20} />
//           </Link>
//         </div>
//         <div className="relative -mt-16 px-4 pb-4">
//           <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
//             <img
//               src={
//                 profile.business_photos.length > 0
//                   ? profile.business_photos[0].photo_path
//                   : defaultBusinessLogo
//               }
//               alt={profile.business_name}
//               className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
//               onError={(e) => (e.target.src = defaultBusinessLogo)}
//             />
//             <div className="flex-1 text-center sm:text-left text-white">
//               <h1 className="text-2xl font-bold">{profile.business_name}</h1>
//               <p className="text-sm">{profile.business_line}</p>
//               <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-1 text-xs">
//                 <span className="flex items-center gap-1">
//                   <MapPin size={12} /> {profile.business_address}
//                 </span>
//                 <span className="flex items-center gap-1">
//                   <Users size={12} /> {profile.staff.length}
//                   {profile.staff.length > 1 ? "staffs" : "staff"}
//                 </span>
//               </div>
//               <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-1 text-xs">
//                 <span className="flex items-center gap-1">
//                   <IdCard size={12} /> Business ID: {profile.id}
//                 </span>
//               </div>
//             </div>
//             <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
//               <ActionButton
//                 onClick={handleShare}
//                 icon={<Share2 size={14} />}
//                 label="Share"
//                 bgColor="bg-blue-500"
//                 hoverColor="hover:bg-blue-600"
//               />
//               <ActionButton
//                 onClick={visitWebSite}
//                 icon={<Globe size={14} />}
//                 label="Website"
//                 bgColor="bg-gray-500"
//                 hoverColor="hover:bg-gray-600"
//               />
//               <ActionButton
//                 onClick={initiateCall}
//                 icon={<Phone size={14} />}
//                 label="Call"
//                 bgColor="bg-lime-600"
//                 hoverColor="hover:bg-lime-800"
//               />
//               <ActionButton
//                 onClick={handleReportClick}
//                 icon={<Flag size={14} />}
//                 label="Report"
//                 bgColor="bg-red-500"
//                 hoverColor="hover:bg-red-600"
//               />
//             </div>
//           </div>
//         </div>
//       </motion.div>

//       {/* Main Content */}
//       <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
//         {/* Left Column: Tabs */}
//         <div className="lg:col-span-2 space-y-4">
//           <motion.div
//             className="bg-white rounded-lg shadow overflow-hidden"
//             initial="hidden"
//             animate="visible"
//             variants={fadeInUp}>
//             <TabBar
//               tabs={tabs}
//               activeTab={activeTab}
//               setActiveTab={setActiveTab}
//             />
//             <div className="p-4">
//               {activeTab === "overview" && (
//                 <div className="space-y-8">
//                   {profile.business_description && (
//                     <Section
//                       title="About"
//                       icon={<Building2 size={18} className="text-blue-500" />}>
//                       <div
//                         className="text-gray-700 text-sm"
//                         dangerouslySetInnerHTML={{
//                           __html: profile.business_description,
//                         }}
//                       />
//                     </Section>
//                   )}
//                   <hr className="my-4" />
//                   <Section title="Quick Details">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <ProfileDetail
//                         icon={
//                           <Calendar size={16} className="text-orange-500" />
//                         }
//                         label="Established"
//                         value={formatDate(profile.date_of_establishment)}
//                       />
//                       <ProfileDetail
//                         icon={<Clock size={16} className="text-blue-500" />}
//                         label="Working Hours"
//                         value={profile.operation_hours}
//                       />
//                       <ProfileDetail
//                         icon={<Users size={16} className="text-green-500" />}
//                         label="Total Staff"
//                         value={profile.number_of_staff}
//                       />
//                       <ProfileDetail
//                         icon={
//                           <Briefcase size={16} className="text-purple-500" />
//                         }
//                         label="Our Services"
//                         value={profile.services_rendered}
//                       />
//                       <ProfileDetail
//                         icon={<Calendar size={16} className="text-teal-500" />}
//                         label="Joined Business"
//                         value={formatDate(profile.created_at)}
//                       />
//                       <ProfileDetail
//                         icon={<Clock size={16} className="text-indigo-500" />}
//                         label="Last Updated"
//                         value={formatDate(profile.updated_at)}
//                       />
//                       <ProfileDetail
//                         icon={<Building2 size={16} className="text-red-500" />}
//                         label="Business Status"
//                         value={profile.status}
//                       />
//                     </div>
//                   </Section>
//                   <hr className="my-4" />
//                   <Section
//                     title={`Current Staffs (${staff.length})`}
//                     icon={<Users size={18} className="text-green-500" />}>
//                     <div className="space-y-2">
//                       {Array.isArray(staff) && staff.length > 0 ? (
//                         staff.map((member, index) => (
//                           <div key={index} className="text-gray-700 text-sm">
//                             {member.name} - {member.role} ({member.position})
//                           </div>
//                         ))
//                       ) : (
//                         <p className="text-gray-500 text-sm italic">
//                           Staff details currently unavailable
//                         </p>
//                       )}
//                     </div>
//                   </Section>
//                   <hr className="my-4" />
//                   <Section
//                     title="Gallery"
//                     icon={<ImageIcon size={18} className="text-blue-500" />}>
//                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
//                       {profile.product_photos.length > 0 &&
//                       profile.product_photos[0]?.photo_paths?.length > 0 ? (
//                         profile.product_photos[0].photo_paths.map(
//                           (photoUrl, index) => (
//                             <img
//                               key={index}
//                               src={photoUrl}
//                               alt={`Product Photo ${index + 1}`}
//                               className="w-full h-32 object-cover rounded-md border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer"
//                               onClick={() => {
//                                 setCurrentImageIndex(index);
//                                 setIsModalOpen(true);
//                               }}
//                               onError={(e) =>
//                                 (e.target.src = defaultBusinessLogo)
//                               }
//                             />
//                           )
//                         )
//                       ) : (
//                         <p className="text-gray-500 text-sm col-span-full">
//                           No photos available yet.
//                         </p>
//                       )}
//                     </div>
//                   </Section>
//                   <hr className="my-4" />
//                   <Section
//                     title="Reviews"
//                     icon={<Star size={18} className="text-yellow-500" />}>
//                     <BusinessReview businessSlug={slug} />
//                   </Section>
//                 </div>
//               )}
//               {activeTab === "gallery" && (
//                 <Section
//                   title="Gallery"
//                   icon={<ImageIcon size={18} className="text-blue-500" />}>
//                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
//                     {profile.product_photos.length > 0 &&
//                     profile.product_photos[0]?.photo_paths?.length > 0 ? (
//                       profile.product_photos[0].photo_paths.map(
//                         (photoUrl, index) => (
//                           <img
//                             key={index}
//                             src={photoUrl}
//                             alt={`Product Photo ${index + 1}`}
//                             className="w-full h-32 object-cover rounded-md border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer"
//                             onClick={() => {
//                               setCurrentImageIndex(index);
//                               setIsModalOpen(true);
//                             }}
//                             onError={(e) =>
//                               (e.target.src = defaultBusinessLogo)
//                             }
//                           />
//                         )
//                       )
//                     ) : (
//                       <p className="text-gray-500 text-sm col-span-full">
//                         No photos available yet.
//                       </p>
//                     )}
//                   </div>
//                 </Section>
//               )}
//               {activeTab === "reviews" && (
//                 <div className="space-y-4">
//                   <Section
//                     title="Reviews"
//                     icon={<Star size={18} className="text-yellow-500" />}>
//                     <BusinessReview businessSlug={slug} />
//                   </Section>
//                 </div>
//               )}
//               {activeTab === "branches" && (
//                 <BranchDetails branches={branches} />
//               )}
//               {activeTab === "founder" && (
//                 <Section
//                   title="Founder"
//                   icon={<User size={18} className="text-purple-500" />}>
//                   {founder ? (
//                     <div className="space-y-4">
//                       <div className="flex items-center gap-4">
//                         <img
//                           src={founder.photo || defaultBusinessLogo}
//                           alt={founder.name}
//                           className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
//                           onError={(e) => (e.target.src = defaultBusinessLogo)}
//                         />
//                         <div>
//                           <p className="text-lg font-semibold text-gray-800">
//                             {founder.first_name} {founder.last_name}
//                           </p>
//                           <p className="text-sm text-gray-600">
//                             {founder.profession || "N/A"}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <ProfileDetail
//                           icon={<MapPin size={16} className="text-red-500" />}
//                           label="Location"
//                           value={`${founder.city || "N/A"}, ${founder.state || "N/A"}`}
//                         />
//                         <ProfileDetail
//                           icon={<Mail size={16} className="text-blue-500" />}
//                           label="Email"
//                           value={founder.email || "N/A"}
//                         />
//                         <ProfileDetail
//                           icon={
//                             <Calendar size={16} className="text-orange-500" />
//                           }
//                           label="Joined"
//                           value={formatDate(founder.created_at)}
//                         />
//                       </div>
//                       <Link
//                         to={`/people/${founder.slug}`}
//                         className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
//                         View Full Profile{" "}
//                         <ChevronRight size={16} className="ml-2" />
//                       </Link>
//                     </div>
//                   ) : (
//                     <p className="text-gray-500 text-sm">
//                       Founder information not available.
//                     </p>
//                   )}
//                 </Section>
//               )}
//             </div>
//           </motion.div>
//         </div>

//         {/* Right Column: Sidebar */}
//         <div className="space-y-4">
//           <SidebarSection
//             title="Contact"
//             icon={<Mail size={16} className="text-blue-500" />}
//             toggleVisibility={toggleContactVisibility}
//             isVisible={isContactVisible}>
//             <ContactDetail
//               icon={<Phone size={14} className="text-green-500" />}
//               value={
//                 isContactVisible
//                   ? profile.contact_person_number
//                   : "************"
//               }
//             />
//             <ContactDetail
//               icon={<Mail size={14} className="text-blue-500" />}
//               value={
//                 isContactVisible
//                   ? profile.contact_person_email
//                   : "****@*****.com"
//               }
//             />
//             <ContactDetail
//               icon={<MapPin size={14} className="text-red-500" />}
//               value={`${profile.business_address}, ${profile.nearest_bus_stop}`}
//             />
//             {profile?.state && (
//               <ContactDetail
//                 icon={<MapPin size={14} className="text-gray-500" />}
//                 value={`State: ${profile.state}`}
//               />
//             )}
//             {profile?.city && (
//               <ContactDetail
//                 icon={<MapPin size={14} className="text-gray-500" />}
//                 value={`LGA: ${profile.city}`}
//               />
//             )}
//             {profile?.area && (
//               <ContactDetail
//                 icon={<MapPin size={14} className="text-gray-500" />}
//                 value={`Area: ${profile.area}`}
//               />
//             )}
//             {profile.business_website && (
//               <ContactDetail
//                 icon={<Globe size={14} className="text-purple-500" />}
//                 value={
//                   <a
//                     href={profile.business_website}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-500 hover:underline">
//                     {profile.business_website}
//                   </a>
//                 }
//               />
//             )}
//           </SidebarSection>

//           <SidebarSection
//             title="Financials"
//             icon={<DollarSign size={16} className="text-green-500" />}>
//             <ProfileDetail
//               icon={<DollarSign size={14} className="text-green-500" />}
//               label="Daily"
//               value={`₦${Number(profile.expected_daily_income).toLocaleString()}`}
//             />
//             <ProfileDetail
//               icon={<DollarSign size={14} className="text-blue-500" />}
//               label="Monthly"
//               value={`₦${Number(profile.monthly_income).toLocaleString()}`}
//             />
//             <ProfileDetail
//               icon={<DollarSign size={14} className="text-purple-500" />}
//               label="Yearly"
//               value={`₦${Number(profile.yearly_income).toLocaleString()}`}
//             />
//             <ProfileDetail
//               icon={<DollarSign size={14} className="text-orange-500" />}
//               label="Net Worth"
//               value={
//                 profile.net_worth
//                   ? `₦${Number(profile.net_worth).toLocaleString()}`
//                   : "N/A"
//               }
//             />
//           </SidebarSection>

//           <SidebarSection
//             title="Registration"
//             icon={<Briefcase size={16} className="text-gray-500" />}>
//             <ProfileDetail
//               icon={<Briefcase size={14} className="text-blue-500" />}
//               label="Reg No"
//               value={profile.business_reg_number}
//             />
//             <ProfileDetail
//               icon={<Briefcase size={14} className="text-purple-500" />}
//               label="TIN"
//               value={profile.tin_number}
//             />
//             <ProfileDetail
//               icon={<Briefcase size={14} className="text-teal-500" />}
//               label="NAFDAC No"
//               value={profile.nafdac_number || "N/A"}
//             />
//           </SidebarSection>

//           <SidebarSection
//             title="Social"
//             icon={<Globe size={16} className="text-purple-500" />}>
//             {Object.entries(socialMedia).map(([platform, url], index) =>
//               url ? (
//                 <ContactDetail
//                   key={index}
//                   icon={<Globe size={14} className="text-blue-500" />}
//                   value={
//                     <a
//                       href={url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-500 hover:underline truncate">
//                       {url}
//                     </a>
//                   }
//                 />
//               ) : null
//             )}
//           </SidebarSection>
//         </div>
//       </div>

//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
//           <motion.div
//             className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col"
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.9 }}
//             transition={{ duration: 0.3 }}>
//             <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center z-10">
//               <h2 className="text-lg font-semibold text-gray-800">Gallery</h2>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="text-gray-600 hover:text-red-500 transition">
//                 <X size={24} />
//               </button>
//             </div>
//             <div className="flex-1 overflow-y-auto p-4">
//               {profile.product_photos.length > 0 &&
//               profile.product_photos[0]?.photo_paths?.length > 0 ? (
//                 <div className="space-y-4">
//                   {profile.product_photos[0].photo_paths.map(
//                     (photoUrl, index) => (
//                       <div key={index} className="flex justify-center">
//                         <img
//                           src={photoUrl}
//                           alt={`Product Photo ${index + 1}`}
//                           className="w-full max-w-lg h-auto object-contain rounded-md"
//                           onError={(e) => (e.target.src = defaultBusinessLogo)}
//                         />
//                       </div>
//                     )
//                   )}
//                 </div>
//               ) : (
//                 <p className="text-gray-500 text-center p-4">
//                   No photos available yet.
//                 </p>
//               )}
//             </div>
//           </motion.div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Reusable Components
// const TabBar = ({ tabs, activeTab, setActiveTab }) => (
//   <div className="flex border-b">
//     {tabs.map((tab) => (
//       <button
//         key={tab}
//         onClick={() => setActiveTab(tab)}
//         className={`flex-1 py-2 px-4 text-sm font-medium capitalize ${
//           activeTab === tab
//             ? "bg-red-500 text-white"
//             : "text-gray-600 hover:bg-gray-200"
//         } transition`}>
//         {tab}
//       </button>
//     ))}
//   </div>
// );

// const Section = ({ title, icon, children }) => (
//   <div>
//     {title && (
//       <h2 className="text-lg font-semibold flex items-center gap-2 mb-2">
//         {icon} {title}
//       </h2>
//     )}
//     {children}
//   </div>
// );

// const SidebarSection = ({
//   title,
//   icon,
//   children,
//   toggleVisibility,
//   isVisible,
// }) => (
//   <motion.div
//     className="bg-white rounded-lg shadow p-4"
//     initial="hidden"
//     animate="visible"
//     variants={fadeInRight}>
//     <div className="flex items-center justify-between mb-3">
//       <h2 className="text-base font-semibold flex items-center gap-2">
//         {icon} {title}
//       </h2>
//       {toggleVisibility && (
//         <button
//           onClick={toggleVisibility}
//           className="text-blue-500 hover:text-blue-700 text-xs flex items-center gap-1">
//           {isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
//         </button>
//       )}
//     </div>
//     <div className="space-y-2 text-sm">{children}</div>
//   </motion.div>
// );

// const ActionButton = ({ onClick, icon, label, bgColor, hoverColor }) => (
//   <button
//     onClick={onClick}
//     className={`flex items-center gap-1 px-3 py-2 mid:py-1 mid:px-3 ${bgColor} text-white rounded-xl ${hoverColor} transition`}
//     title={label}>
//     {icon}
//     <span className="text-sm mid:text-xs">{label}</span>
//   </button>
// );

// const ProfileDetail = ({ icon, label, value }) => (
//   <div className="flex items-center gap-2 text-gray-700">
//     {icon} <span className="text-xs text-gray-500">{label}:</span>{" "}
//     <span className="font-medium">{value || "N/A"}</span>
//   </div>
// );

// const ContactDetail = ({ icon, value }) => (
//   <div className="flex items-center gap-2 text-gray-700">
//     {icon} <span className="text-sm truncate">{value || "N/A"}</span>
//   </div>
// );

// export default SingleBusinessPage;

// import React, { useState, useEffect, useCallback } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   Building2,
//   MapPin,
//   Mail,
//   Phone,
//   Share2,
//   Flag,
//   Calendar,
//   Users,
//   Briefcase,
//   Clock,
//   Globe,
//   ChevronLeft,
//   Eye,
//   EyeOff,
//   Star,
//   DollarSign,
//   User,
//   ImageIcon,
//   IdCard,
//   X,
//   ChevronRight,
// } from "lucide-react";
// import { motion } from "framer-motion";
// import LoadingSpinner from "../components/tools/LoaddingSpinner";
// import BranchDetails from "../components/BranchDetails"; // Import the new component
// import backendURL from "../config";
// import BusinessReview from "../components/BusinessReview";

// // Default business logo
// const defaultBusinessLogo =
//   "https://res.cloudinary.com/digzrkdoe/image/upload/v1740847778/edirect_business_photos/business_67c33aa215e8f.png";

// // Framer Motion animation variants
// const fadeInUp = {
//   hidden: { opacity: 0, y: 20 },
//   visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
// };

// const fadeInRight = {
//   hidden: { opacity: 0, x: -20 },
//   visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
// };

// const SingleBusinessPage = () => {
//   const { slug } = useParams();
//   const [profile, setProfile] = useState(null);
//   const [founder, setFounder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isContactVisible, setIsContactVisible] = useState(true);
//   const [activeTab, setActiveTab] = useState("overview");
//   const [branches, setBranches] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const navigate = useNavigate();

//   const fetchBusinessProfile = useCallback(async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${backendURL}/api/business/${slug}`);
//       console.log(response);
//       if (response.data.status === "success" && response.data.business) {
//         const businessData = response.data.business;
//         const parsedData = {
//           ...businessData,
//           staff: businessData.staff
//             ? typeof businessData.staff === "string"
//               ? JSON.parse(businessData.staff)
//               : Array.isArray(businessData.staff)
//                 ? businessData.staff
//                 : []
//             : [],
//           social_media: businessData.social_media
//             ? typeof businessData.social_media === "string"
//               ? JSON.parse(businessData.social_media)
//               : businessData.social_media
//             : {},
//           business_photos: businessData.business_photos || [],
//           product_photos:
//             businessData.product_photos &&
//             businessData.product_photos.length > 0
//               ? [
//                   {
//                     photo_paths: JSON.parse(
//                       businessData.product_photos[0].photo_paths.replace(
//                         /\\\//g,
//                         "/"
//                       )
//                     ),
//                   },
//                 ]
//               : [],
//         };
//         setProfile(parsedData);
//         setBranches(response.data.branches || []);
//         setFounder(response.data.founder || null);
//       } else {
//         setError("Business profile not found");
//       }
//     } catch (err) {
//       setError("Error fetching business profile data");
//       console.error("API fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   }, [slug]);

//   useEffect(() => {
//     fetchBusinessProfile();
//   }, [fetchBusinessProfile]);

//   const initiateCall = useCallback(() => {
//     window.location.href = `tel:${profile?.contact_person_number}`;
//   }, [profile?.contact_person_number]);

//   const visitWebSite = useCallback(() => {
//     if (profile?.business_website) {
//       window.open(profile.business_website, "_blank");
//     }
//   }, [profile?.business_website]);

//   const handleReportClick = useCallback(() => {
//     if (profile?.id) {
//       navigate(`/reportsBusiness?businessId=${profile.id}`);
//     }
//   }, [profile?.id, navigate]);

//   const handleShare = async () => {
//     try {
//       if (navigator.share) {
//         await navigator.share({
//           title: profile?.business_name,
//           text: `Check out ${profile?.business_name}'s profile`,
//           url: window.location.href,
//         });
//       } else {
//         navigator.clipboard.writeText(window.location.href);
//         alert("Business profile link copied to clipboard!");
//       }
//     } catch (error) {
//       console.error("Error sharing:", error);
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const date = new Date(dateString);
//     return isNaN(date)
//       ? "Invalid"
//       : date.toLocaleDateString("en-US", {
//           month: "short",
//           day: "numeric",
//           year: "numeric",
//         });
//   };

//   const toggleContactVisibility = () => setIsContactVisible(!isContactVisible);

//   if (loading)
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-100">
//         <LoadingSpinner />
//       </div>
//     );

//   if (error || !profile)
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
//         <motion.div
//           className="bg-white rounded-lg shadow p-6 max-w-md w-full text-center"
//           initial="hidden"
//           animate="visible"
//           variants={fadeInUp}>
//           <div className="text-red-500 mb-4">
//             <svg
//               width="48"
//               height="48"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               className="mx-auto animate-pulse">
//               <circle cx="12" cy="12" r="10" />
//               <line x1="12" y1="8" x2="12" y2="12" />
//               <line x1="12" y1="16" x2="12" y2="16" />
//             </svg>
//           </div>
//           <h2 className="text-xl font-semibold text-gray-800 mb-2">
//             {error || "Business Not Found"}
//           </h2>
//           <p className="text-gray-600 mb-4">
//             The business profile doesn't exist or has been removed.
//           </p>
//           <Link
//             to="/searchPage/businesses"
//             className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
//             <ChevronLeft size={16} /> Back to Search
//           </Link>
//         </motion.div>
//       </div>
//     );

//   const socialMedia = profile.social_media || {};
//   const staff = profile.staff || [];
//   const tabs = ["overview", "gallery", "reviews", "branches", "founder"];

//   return (
//     <div className="max-w-6xl mx-auto bg-gray-100 min-h-screen p-4">
//       {/* Header Section */}
//       <motion.div
//         className="bg-white rounded-lg shadow overflow-hidden bg-gradient-to-r from-[#341f1f] to-[#803d3d] opacity-80"
//         initial="hidden"
//         animate="visible"
//         variants={fadeInUp}>
//         <div className="relative h-32">
//           <Link
//             to="/business"
//             className="absolute top-2 left-2 p-1 bg-white/20 rounded-full text-white hover:bg-white/30 transition">
//             <ChevronLeft size={20} />
//           </Link>
//         </div>
//         <div className="relative -mt-16 px-4 pb-4">
//           <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
//             <img
//               src={
//                 profile.business_photos.length > 0
//                   ? profile.business_photos[0].photo_path
//                   : defaultBusinessLogo
//               }
//               alt={profile.business_name}
//               className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
//               onError={(e) => (e.target.src = defaultBusinessLogo)}
//             />
//             <div className="flex-1 text-center sm:text-left text-white">
//               <h1 className="text-2xl font-bold">{profile.business_name}</h1>
//               <p className="text-sm">{profile.business_line}</p>
//               <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-1 text-xs">
//                 <span className="flex items-center gap-1">
//                   <MapPin size={12} /> {profile.business_address}
//                 </span>
//                 <span className="flex items-center gap-1">
//                   <Users size={12} /> {profile.staff.length}
//                   {profile.staff.length > 1 ? "staffs" : "staff"}
//                 </span>
//               </div>
//               <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-1 text-xs">
//                 <span className="flex items-center gap-1">
//                   <IdCard size={12} /> Business ID: {profile.id}
//                 </span>
//               </div>
//             </div>
//             <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
//               <ActionButton
//                 onClick={handleShare}
//                 icon={<Share2 size={14} />}
//                 label="Share"
//                 bgColor="bg-blue-500"
//                 hoverColor="hover:bg-blue-600"
//               />
//               <ActionButton
//                 onClick={visitWebSite}
//                 icon={<Globe size={14} />}
//                 label="Website"
//                 bgColor="bg-gray-500"
//                 hoverColor="hover:bg-gray-600"
//               />
//               <ActionButton
//                 onClick={initiateCall}
//                 icon={<Phone size={14} />}
//                 label="Call"
//                 bgColor="bg-lime-600"
//                 hoverColor="hover:bg-lime-800"
//               />
//               <ActionButton
//                 onClick={handleReportClick}
//                 icon={<Flag size={14} />}
//                 label="Report"
//                 bgColor="bg-red-500"
//                 hoverColor="hover:bg-red-600"
//               />
//             </div>
//           </div>
//         </div>
//       </motion.div>

//       {/* Main Content */}
//       <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
//         {/* Left Column: Tabs */}
//         <div className="lg:col-span-2 space-y-4">
//           <motion.div
//             className="bg-white rounded-lg shadow overflow-hidden"
//             initial="hidden"
//             animate="visible"
//             variants={fadeInUp}>
//             <TabBar
//               tabs={tabs}
//               activeTab={activeTab}
//               setActiveTab={setActiveTab}
//             />
//             <div className="p-4">
//               {activeTab === "overview" && (
//                 <div className="space-y-8">
//                   {profile.business_description && (
//                     <Section
//                       title="About"
//                       icon={<Building2 size={18} className="text-blue-500" />}>
//                       <div
//                         className="text-gray-700 text-sm"
//                         dangerouslySetInnerHTML={{
//                           __html: profile.business_description,
//                         }}
//                       />
//                     </Section>
//                   )}
//                   <hr className="my-4" />
//                   <Section title="Quick Details">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <ProfileDetail
//                         icon={
//                           <Calendar size={16} className="text-orange-500" />
//                         }
//                         label="Established"
//                         value={formatDate(profile.date_of_establishment)}
//                       />
//                       <ProfileDetail
//                         icon={<Clock size={16} className="text-blue-500" />}
//                         label="Working Hours"
//                         value={profile.operation_hours}
//                       />
//                       <ProfileDetail
//                         icon={<Users size={16} className="text-green-500" />}
//                         label="Total Staff"
//                         value={profile.number_of_staff}
//                       />
//                       <ProfileDetail
//                         icon={
//                           <Briefcase size={16} className="text-purple-500" />
//                         }
//                         label="Our Services"
//                         value={profile.services_rendered}
//                       />
//                       <ProfileDetail
//                         icon={<Calendar size={16} className="text-teal-500" />}
//                         label="Joined Business"
//                         value={formatDate(profile.created_at)}
//                       />
//                       <ProfileDetail
//                         icon={<Clock size={16} className="text-indigo-500" />}
//                         label="Last Updated"
//                         value={formatDate(profile.updated_at)}
//                       />
//                       <ProfileDetail
//                         icon={<Building2 size={16} className="text-red-500" />}
//                         label="Business Status"
//                         value={profile.status}
//                       />
//                     </div>
//                   </Section>
//                   <hr className="my-4" />
//                   <Section
//                     title={`Current Staffs (${staff.length})`}
//                     icon={<Users size={18} className="text-green-500" />}>
//                     <div className="space-y-2">
//                       {Array.isArray(staff) && staff.length > 0 ? (
//                         staff.map((member, index) => (
//                           <div key={index} className="text-gray-700 text-sm">
//                             {member.name} - {member.role} ({member.position})
//                           </div>
//                         ))
//                       ) : (
//                         <p className="text-gray-500 text-sm italic">
//                           Staff details currently unavailable
//                         </p>
//                       )}
//                     </div>
//                   </Section>
//                   <hr className="my-4" />
//                   <Section
//                     title="Gallery"
//                     icon={<ImageIcon size={18} className="text-blue-500" />}>
//                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
//                       {profile.product_photos.length > 0 &&
//                       profile.product_photos[0]?.photo_paths?.length > 0 ? (
//                         profile.product_photos[0].photo_paths.map(
//                           (photoUrl, index) => (
//                             <img
//                               key={index}
//                               src={photoUrl}
//                               alt={`Product Photo ${index + 1}`}
//                               className="w-full h-32 object-cover rounded-md border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer"
//                               onClick={() => {
//                                 setCurrentImageIndex(index);
//                                 setIsModalOpen(true);
//                               }}
//                               onError={(e) =>
//                                 (e.target.src = defaultBusinessLogo)
//                               }
//                             />
//                           )
//                         )
//                       ) : (
//                         <p className="text-gray-500 text-sm col-span-full">
//                           No photos available yet.
//                         </p>
//                       )}
//                     </div>
//                   </Section>
//                   <hr className="my-4" />
//                   <Section
//                     title="Reviews"
//                     icon={<Star size={18} className="text-yellow-500" />}>
//                     <BusinessReview businessSlug={slug} />
//                   </Section>
//                 </div>
//               )}
//               {activeTab === "gallery" && (
//                 <Section
//                   title="Gallery"
//                   icon={<ImageIcon size={18} className="text-blue-500" />}>
//                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
//                     {profile.product_photos.length > 0 &&
//                     profile.product_photos[0]?.photo_paths?.length > 0 ? (
//                       profile.product_photos[0].photo_paths.map(
//                         (photoUrl, index) => (
//                           <img
//                             key={index}
//                             src={photoUrl}
//                             alt={`Product Photo ${index + 1}`}
//                             className="w-full h-32 object-cover rounded-md border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer"
//                             onClick={() => {
//                               setCurrentImageIndex(index);
//                               setIsModalOpen(true);
//                             }}
//                             onError={(e) =>
//                               (e.target.src = defaultBusinessLogo)
//                             }
//                           />
//                         )
//                       )
//                     ) : (
//                       <p className="text-gray-500 text-sm col-span-full">
//                         No photos available yet.
//                       </p>
//                     )}
//                   </div>
//                 </Section>
//               )}
//               {activeTab === "reviews" && (
//                 <div className="space-y-4">
//                   <Section
//                     title="Reviews"
//                     icon={<Star size={18} className="text-yellow-500" />}>
//                     <BusinessReview businessSlug={slug} />
//                   </Section>
//                 </div>
//               )}
//               {activeTab === "branches" && (
//                 <BranchDetails branches={branches} />
//               )}
//               {activeTab === "founder" && (
//                 <Section
//                   title="Founder"
//                   icon={<User size={18} className="text-purple-500" />}>
//                   {founder ? (
//                     <div className="space-y-4">
//                       <div className="flex items-center gap-4">
//                         <img
//                           src={founder.photo || defaultBusinessLogo}
//                           alt={founder.name}
//                           className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
//                           onError={(e) => (e.target.src = defaultBusinessLogo)}
//                         />
//                         <div>
//                           <p className="text-lg font-semibold text-gray-800">
//                             {founder.first_name} {founder.last_name}
//                           </p>
//                           <p className="text-sm text-gray-600">
//                             {founder.profession || "N/A"}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <ProfileDetail
//                           icon={<MapPin size={16} className="text-red-500" />}
//                           label="Location"
//                           value={`${founder.city || "N/A"}, ${founder.state || "N/A"}`}
//                         />
//                         <ProfileDetail
//                           icon={<Mail size={16} className="text-blue-500" />}
//                           label="Email"
//                           value={founder.email || "N/A"}
//                         />
//                         <ProfileDetail
//                           icon={
//                             <Calendar size={16} className="text-orange-500" />
//                           }
//                           label="Joined"
//                           value={formatDate(founder.created_at)}
//                         />
//                       </div>
//                       <Link
//                         to={`/people/${founder.slug}`}
//                         className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
//                         View Full Profile{" "}
//                         <ChevronRight size={16} className="ml-2" />
//                       </Link>
//                     </div>
//                   ) : (
//                     <p className="text-gray-500 text-sm">
//                       Founder information not available.
//                     </p>
//                   )}
//                 </Section>
//               )}
//             </div>
//           </motion.div>
//         </div>

//         {/* Right Column: Sidebar */}
//         <div className="space-y-4">
//           <SidebarSection
//             title="Contact"
//             icon={<Mail size={16} className="text-blue-500" />}
//             toggleVisibility={toggleContactVisibility}
//             isVisible={isContactVisible}>
//             <ContactDetail
//               icon={<Phone size={14} className="text-green-500" />}
//               value={
//                 isContactVisible
//                   ? profile.contact_person_number
//                   : "************"
//               }
//             />
//             <ContactDetail
//               icon={<Mail size={14} className="text-blue-500" />}
//               value={
//                 isContactVisible
//                   ? profile.contact_person_email
//                   : "****@*****.com"
//               }
//             />
//             <ContactDetail
//               icon={<MapPin size={14} className="text-red-500" />}
//               value={`${profile.business_address}, ${profile.nearest_bus_stop}`}
//             />
//             {profile?.state && (
//               <ContactDetail
//                 icon={<MapPin size={14} className="text-gray-500" />}
//                 value={`State: ${profile.state}`}
//               />
//             )}
//             {profile?.city && (
//               <ContactDetail
//                 icon={<MapPin size={14} className="text-gray-500" />}
//                 value={`LGA: ${profile.city}`}
//               />
//             )}
//             {profile?.area && (
//               <ContactDetail
//                 icon={<MapPin size={14} className="text-gray-500" />}
//                 value={`Area: ${profile.area}`}
//               />
//             )}
//             {profile.business_website && (
//               <ContactDetail
//                 icon={<Globe size={14} className="text-purple-500" />}
//                 value={
//                   <a
//                     href={profile.business_website}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-500 hover:underline">
//                     {profile.business_website}
//                   </a>
//                 }
//               />
//             )}
//           </SidebarSection>

//           <SidebarSection
//             title="Financials"
//             icon={<DollarSign size={16} className="text-green-500" />}>
//             <ProfileDetail
//               icon={<DollarSign size={14} className="text-green-500" />}
//               label="Daily"
//               value={`₦${Number(profile.expected_daily_income).toLocaleString()}`}
//             />
//             <ProfileDetail
//               icon={<DollarSign size={14} className="text-blue-500" />}
//               label="Monthly"
//               value={`₦${Number(profile.monthly_income).toLocaleString()}`}
//             />
//             <ProfileDetail
//               icon={<DollarSign size={14} className="text-purple-500" />}
//               label="Yearly"
//               value={`₦${Number(profile.yearly_income).toLocaleString()}`}
//             />
//             <ProfileDetail
//               icon={<DollarSign size={14} className="text-orange-500" />}
//               label="Net Worth"
//               value={
//                 profile.net_worth
//                   ? `₦${Number(profile.net_worth).toLocaleString()}`
//                   : "N/A"
//               }
//             />
//           </SidebarSection>

//           <SidebarSection
//             title="Registration"
//             icon={<Briefcase size={16} className="text-gray-500" />}>
//             <ProfileDetail
//               icon={<Briefcase size={14} className="text-blue-500" />}
//               label="Reg No"
//               value={profile.business_reg_number}
//             />
//             <ProfileDetail
//               icon={<Briefcase size={14} className="text-purple-500" />}
//               label="TIN"
//               value={profile.tin_number}
//             />
//             <ProfileDetail
//               icon={<Briefcase size={14} className="text-teal-500" />}
//               label="NAFDAC No"
//               value={profile.nafdac_number || "N/A"}
//             />
//           </SidebarSection>

//           <SidebarSection
//             title="Social"
//             icon={<Globe size={16} className="text-purple-500" />}>
//             {Object.entries(socialMedia).map(([platform, url], index) =>
//               url ? (
//                 <ContactDetail
//                   key={index}
//                   icon={<Globe size={14} className="text-blue-500" />}
//                   value={
//                     <a
//                       href={url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-500 hover:underline truncate">
//                       {url}
//                     </a>
//                   }
//                 />
//               ) : null
//             )}
//           </SidebarSection>
//         </div>
//       </div>

//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
//           <motion.div
//             className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col"
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.9 }}
//             transition={{ duration: 0.3 }}>
//             <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center z-10">
//               <h2 className="text-lg font-semibold text-gray-800">Gallery</h2>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="text-gray-600 hover:text-red-500 transition">
//                 <X size={24} />
//               </button>
//             </div>
//             <div className="flex-1 overflow-y-auto p-4">
//               {profile.product_photos.length > 0 &&
//               profile.product_photos[0]?.photo_paths?.length > 0 ? (
//                 <div className="space-y-4">
//                   {profile.product_photos[0].photo_paths.map(
//                     (photoUrl, index) => (
//                       <div key={index} className="flex justify-center">
//                         <img
//                           src={photoUrl}
//                           alt={`Product Photo ${index + 1}`}
//                           className="w-full max-w-lg h-auto object-contain rounded-md"
//                           onError={(e) => (e.target.src = defaultBusinessLogo)}
//                         />
//                       </div>
//                     )
//                   )}
//                 </div>
//               ) : (
//                 <p className="text-gray-500 text-center p-4">
//                   No photos available yet.
//                 </p>
//               )}
//             </div>
//           </motion.div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Reusable Components
// const TabBar = ({ tabs, activeTab, setActiveTab }) => (
//   <div className="border-b overflow-x-auto whitespace-nowrap">
//     <div className="flex">
//       {tabs.map((tab) => (
//         <button
//           key={tab}
//           onClick={() => setActiveTab(tab)}
//           className={`inline-block py-2 px-4 text-sm font-medium capitalize min-w-[100px] ${
//             activeTab === tab
//               ? "bg-red-500 text-white"
//               : "text-gray-600 hover:bg-gray-200"
//           } transition`}>
//           {tab}
//         </button>
//       ))}
//     </div>
//   </div>
// );

// const Section = ({ title, icon, children }) => (
//   <div>
//     {title && (
//       <h2 className="text-lg font-semibold flex items-center gap-2 mb-2">
//         {icon} {title}
//       </h2>
//     )}
//     {children}
//   </div>
// );

// const SidebarSection = ({
//   title,
//   icon,
//   children,
//   toggleVisibility,
//   isVisible,
// }) => (
//   <motion.div
//     className="bg-white rounded-lg shadow p-4"
//     initial="hidden"
//     animate="visible"
//     variants={fadeInRight}>
//     <div className="flex items-center justify-between mb-3">
//       <h2 className="text-base font-semibold flex items-center gap-2">
//         {icon} {title}
//       </h2>
//       {toggleVisibility && (
//         <button
//           onClick={toggleVisibility}
//           className="text-blue-500 hover:text-blue-700 text-xs flex items-center gap-1">
//           {isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
//         </button>
//       )}
//     </div>
//     <div className="space-y-2 text-sm">{children}</div>
//   </motion.div>
// );

// const ActionButton = ({ onClick, icon, label, bgColor, hoverColor }) => (
//   <button
//     onClick={onClick}
//     className={`flex items-center gap-1 px-3 py-2 mid:py-1 mid:px-3 ${bgColor} text-white rounded-xl ${hoverColor} transition`}
//     title={label}>
//     {icon}
//     <span className="text-sm mid:text-xs">{label}</span>
//   </button>
// );

// const ProfileDetail = ({ icon, label, value }) => (
//   <div className="flex items-center gap-2 text-gray-700">
//     {icon} <span className="text-xs text-gray-500">{label}:</span>{" "}
//     <span className="font-medium">{value || "N/A"}</span>
//   </div>
// );

// const ContactDetail = ({ icon, value }) => (
//   <div className="flex items-center gap-2 text-gray-700">
//     {icon} <span className="text-sm truncate">{value || "N/A"}</span>
//   </div>
// );

// export default SingleBusinessPage;

import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Building2,
  MapPin,
  Mail,
  Phone,
  Share2,
  Flag,
  Calendar,
  Users,
  Briefcase,
  Clock,
  Globe,
  ChevronLeft,
  Eye,
  EyeOff,
  Star,
  DollarSign,
  User,
  ImageIcon,
  IdCard,
  X,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import LoadingSpinner from "../components/tools/LoaddingSpinner";
import BranchDetails from "../components/BranchDetails";
import backendURL from "../config";
import BusinessReview from "../components/BusinessReview";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const fadeInRight = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

const SingleBusinessPage = () => {
  const { slug } = useParams();
  const [businessData, setBusinessData] = useState(null);
  const [founder, setFounder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isContactVisible, setIsContactVisible] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [branches, setBranches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  // Format API response to unified structure
  const formatBusinessData = (apiResponse) => {
    const { business } = apiResponse.data;
    const { details, ...metadata } = business;
    console.log(business);

    // Parse JSON string fields
    const parseField = (field) => {
      try {
        return typeof field === "string" ? JSON.parse(field) : field || {};
      } catch {
        return {};
      }
    };

    return {
      // Core business info
      id: details?.id,
      slug: details?.slug,
      business_name: details?.business_name,
      business_line: details?.business_line,
      category_slug: details?.category_slug,
      business_description: details?.business_description,

      // Contact info
      contact_person: details.contact_person,
      contact_person_number: details.contact_person_number,
      contact_person_email: details.contact_person_email,
      business_email: details.business_email,
      business_website: details.business_website,

      // Location info
      business_address: details.business_address,
      state: details.state,
      city: details.city,
      area: details.area,
      nearest_bus_stop: details.nearest_bus_stop,
      landmark: details.landmark,

      // Business details
      date_of_establishment: details.date_of_establishment,
      number_of_staff: details.number_of_staff,
      services_rendered: details.services_rendered,
      operation_hours: details.operation_hours,
      status: details.status,
      property_status: details.property_status,

      // Financials
      expected_daily_income: details.expected_daily_income,
      monthly_income: details.monthly_income,
      yearly_income: details.yearly_income,
      net_worth: details.net_worth,

      // Registration
      business_reg_number: details.business_reg_number,
      tax_reg_no: details.tax_reg_no,
      tin_number: details.tin_number,

      // Media
      business_photos: Array.isArray(business?.business_photos)
        ? business.business_photos[0]
        : [],

      product_photos:
        details.product_photos && details.product_photos.length > 0
          ? [
              {
                photo_paths: JSON.parse(
                  details.product_photos[0].photo_paths.replace(/\\\//g, "/")
                ),
              },
            ]
          : [],

      // Social and staff
      social_media: parseField(details.social_media),
      staff: parseField(details.staff),

      // Metadata
      average_rating: metadata.average_rating || 0,
      total_reviews: metadata.total_reviews || 0,
      total_branches: metadata.total_branches || 0,
      views: metadata.views || 0,
      verification_percentage: details.verification_percentage || 0,
      created_at: details.created_at,
      updated_at: details.updated_at,
    };
  };

  // Fetch business profile
  const fetchBusinessProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendURL}/api/business/${slug}`);

      if (response.data.status === "success" && response.data.business) {
        const formattedData = formatBusinessData(response);
        setBusinessData(formattedData);
        setBranches(response.data.business.branches || []);
        setFounder(response.data.founder || null);
      } else {
        setError("Business profile not found");
      }
    } catch (err) {
      setError("Error fetching business profile");
      console.error("API error:", err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchBusinessProfile();
  }, [fetchBusinessProfile]);

  // Action handlers
  const initiateCall = useCallback(() => {
    if (businessData?.contact_person_number) {
      window.location.href = `tel:${businessData.contact_person_number}`;
    }
  }, [businessData?.contact_person_number]);

  const visitWebsite = useCallback(() => {
    if (businessData?.business_website) {
      const url = businessData.business_website.startsWith("http")
        ? businessData.business_website
        : `https://${businessData.business_website}`;
      window.open(url, "_blank");
    }
  }, [businessData?.business_website]);

  const handleReportClick = useCallback(() => {
    if (businessData?.id) {
      navigate(`/reportsBusiness?slug=${businessData.slug}`);
    }
  }, [businessData?.id, navigate]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: businessData?.business_name,
          text: `Check out ${businessData?.business_name}'s business profile`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Business profile link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date)
      ? "N/A"
      : date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
  };

  // Default business/fallback logo

  const getRandomGradient = () => {
    const gradients = [
      "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
      "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)",
      "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)",
    ];
    return gradients[businessData.id % gradients.length];
  };

  const getFallbackInitials = () => {
    if (!businessData?.business_name) return "NA";
    const words = businessData?.business_name.trim().split(" ");
    const initials = words
      .slice(0, 2)
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
    return initials || "NA";
  };

  const formatCurrency = (amount) => {
    if (!amount) return "N/A";
    return `₦${parseFloat(amount).toLocaleString()}`;
  };

  const toggleContactVisibility = () => setIsContactVisible(!isContactVisible);

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <LoadingSpinner />
      </div>
    );
  }

  // Error state
  if (error || !businessData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <motion.div
          className="bg-white rounded-lg shadow p-6 max-w-md w-full text-center"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}>
          <div className="text-red-500 mb-4">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="mx-auto animate-pulse">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12" y2="16" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {error || "Business Not Found"}
          </h2>
          <p className="text-gray-600 mb-4">
            The business profile doesn't exist or has been removed.
          </p>
          <Link
            to="/business"
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
            <ChevronLeft size={16} /> Back to Businesses
          </Link>
        </motion.div>
      </div>
    );
  }

  // Extract data for easier access
  const {
    business_name,
    business_line,
    category_slug,
    business_description,
    contact_person,
    contact_person_number,
    contact_person_email,
    business_email,
    business_website,
    business_address,
    state,
    city,
    area,
    nearest_bus_stop,
    landmark,
    date_of_establishment,
    number_of_staff,
    services_rendered,
    operation_hours,
    status,
    property_status,
    expected_daily_income,
    monthly_income,
    yearly_income,
    net_worth,
    business_reg_number,
    tax_reg_no,
    tin_number,
    business_photos,
    product_photos,
    social_media,
    staff,
    average_rating,
    total_reviews,
    total_branches,
    views,
    verification_percentage,
    created_at,
    updated_at,
  } = businessData;

  const tabs = ["overview", "gallery", "reviews", "branches", "founder"];

  return (
    <div className="max-w-6xl mx-auto bg-gray-100 min-h-screen p-4">
      {/* Header Section */}
      <motion.div
        className="bg-white rounded-lg shadow overflow-hidden bg-gradient-to-r from-[#341f1f] to-[#803d3d] opacity-80"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}>
        <div className="relative h-32">
          <Link
            to="/business"
            className="absolute top-2 left-2 p-1 bg-white/20 rounded-full text-white hover:bg-white/30 transition">
            <ChevronLeft size={20} />
          </Link>
        </div>
        <div className="relative -mt-16 px-4 pb-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            {/* <img
              src={
                business_photos?.length > 0
                  ? business_photos
                  : defaultBusinessLogo
              }
              alt={business_name}
              className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
              onError={(e) => (e.target.src = defaultBusinessLogo)}
            /> */}
            <div
              style={{
                background: business_photos ? "none" : getRandomGradient(),
                width: "80px",
                height: "80px",
              }}
              className="rounded-full flex items-center justify-center overflow-hidden border border-gray-300 mx-auto sm:mx-0">
              {business_photos ? (
                <img
                  src={business_photos}
                  alt={business_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl font-semibold text-gray-600">
                  {getFallbackInitials()}
                </span>
              )}
            </div>
            <div className="flex-1 text-center sm:text-left text-white">
              <h1 className="text-2xl font-bold">{business_name}</h1>
              <p className="text-sm">
                {business_line} {category_slug && `(${category_slug})`}
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-1 text-xs">
                <span className="flex items-center gap-1">
                  <MapPin size={12} /> {business_address}
                </span>
                {number_of_staff && (
                  <span className="flex items-center gap-1">
                    <Users size={12} /> {staff.length} staff
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Eye size={12} /> {views} views
                </span>
                {average_rating > 0 && (
                  <span className="flex items-center gap-1">
                    <Star size={12} /> {average_rating.toFixed(1)} (
                    {total_reviews})
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
              <ActionButton
                onClick={handleShare}
                icon={<Share2 size={14} />}
                label="Share"
                bgColor="bg-blue-500"
                hoverColor="hover:bg-blue-600"
              />
              {business_website && (
                <ActionButton
                  onClick={visitWebsite}
                  icon={<Globe size={14} />}
                  label="Website"
                  bgColor="bg-gray-500"
                  hoverColor="hover:bg-gray-600"
                />
              )}
              {contact_person_number && (
                <ActionButton
                  onClick={initiateCall}
                  icon={<Phone size={14} />}
                  label="Call"
                  bgColor="bg-lime-600"
                  hoverColor="hover:bg-lime-800"
                />
              )}
              <ActionButton
                onClick={handleReportClick}
                icon={<Flag size={14} />}
                label="Report"
                bgColor="bg-red-500"
                hoverColor="hover:bg-red-600"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column: Tabs */}
        <div className="lg:col-span-2 space-y-4">
          <motion.div
            className="bg-white rounded-lg shadow overflow-hidden"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}>
            <TabBar
              tabs={tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
            <div className="p-4">
              {activeTab === "overview" && (
                <div className="space-y-8">
                  {business_description && (
                    <Section
                      title="About"
                      icon={<Building2 size={18} className="text-blue-500" />}>
                      <div
                        className="text-gray-700 text-sm"
                        dangerouslySetInnerHTML={{
                          __html: business_description,
                        }}
                      />
                    </Section>
                  )}
                  <hr className="my-4" />
                  <Section title="Quick Details">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ProfileDetail
                        icon={
                          <Calendar size={16} className="text-orange-500" />
                        }
                        label="Established"
                        value={formatDate(date_of_establishment)}
                      />
                      {operation_hours && (
                        <ProfileDetail
                          icon={<Clock size={16} className="text-blue-500" />}
                          label="Working Hours"
                          value={operation_hours}
                        />
                      )}
                      {number_of_staff && (
                        <ProfileDetail
                          icon={<Users size={16} className="text-green-500" />}
                          label="Total Staff"
                          value={staff.length}
                        />
                      )}
                      {services_rendered && (
                        <ProfileDetail
                          icon={
                            <Briefcase size={16} className="text-purple-500" />
                          }
                          label="Our Services"
                          value={services_rendered}
                        />
                      )}
                      <ProfileDetail
                        icon={<Calendar size={16} className="text-teal-500" />}
                        label="Joined Business"
                        value={formatDate(created_at)}
                      />
                      <ProfileDetail
                        icon={<Clock size={16} className="text-indigo-500" />}
                        label="Last Updated"
                        value={formatDate(updated_at)}
                      />
                      <ProfileDetail
                        icon={<Building2 size={16} className="text-red-500" />}
                        label="Business Status"
                        value={status}
                      />
                    </div>
                  </Section>
                  <hr className="my-4" />
                  <Section
                    title={`Current Staffs (${staff.length})`}
                    icon={<Users size={18} className="text-green-500" />}>
                    <div className="space-y-2">
                      {staff.length > 0 ? (
                        staff.map((member, index) => (
                          <div key={index} className="text-gray-700 text-sm">
                            {member.name} - {member.role} ({member.position})
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm italic">
                          Staff details currently unavailable
                        </p>
                      )}
                    </div>
                  </Section>
                  <hr className="my-4" />
                  <Section
                    title="Gallery"
                    icon={<ImageIcon size={18} className="text-blue-500" />}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {product_photos.length > 0 &&
                      product_photos[0]?.photo_paths?.length > 0 ? (
                        product_photos[0].photo_paths.map((photoUrl, index) => (
                          <img
                            key={index}
                            src={photoUrl}
                            alt={`Product Photo ${index + 1}`}
                            className="w-full h-32 object-cover rounded-md border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                            onClick={() => {
                              setCurrentImageIndex(index);
                              setIsModalOpen(true);
                            }}
                            onError={(e) =>
                              (e.target.src = defaultBusinessLogo)
                            }
                          />
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm col-span-full">
                          No photos available yet.
                        </p>
                      )}
                    </div>
                  </Section>
                  <hr className="my-4" />
                  <Section
                    title="Reviews"
                    icon={<Star size={18} className="text-yellow-500" />}>
                    <BusinessReview businessSlug={slug} />
                  </Section>
                </div>
              )}
              {activeTab === "gallery" && (
                <Section
                  title="Gallery"
                  icon={<ImageIcon size={18} className="text-blue-500" />}>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {product_photos.length > 0 &&
                    product_photos[0]?.photo_paths?.length > 0 ? (
                      product_photos[0].photo_paths.map((photoUrl, index) => (
                        <img
                          key={index}
                          src={photoUrl}
                          alt={`Product Photo ${index + 1}`}
                          className="w-full h-32 object-cover rounded-md border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                          onClick={() => {
                            setCurrentImageIndex(index);
                            setIsModalOpen(true);
                          }}
                          onError={(e) => (e.target.src = defaultBusinessLogo)}
                        />
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm col-span-full">
                        No photos available yet.
                      </p>
                    )}
                  </div>
                </Section>
              )}
              {activeTab === "reviews" && (
                <div className="space-y-4">
                  <Section
                    title="Reviews"
                    icon={<Star size={18} className="text-yellow-500" />}>
                    <BusinessReview businessSlug={slug} />
                  </Section>
                </div>
              )}
              {activeTab === "branches" && (
                <BranchDetails branches={branches} />
              )}
              {activeTab === "founder" && (
                <Section
                  title="Founder"
                  icon={<User size={18} className="text-purple-500" />}>
                  {founder ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={founder.photo || defaultBusinessLogo}
                          alt={founder.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                          onError={(e) => (e.target.src = defaultBusinessLogo)}
                        />
                        <div>
                          <p className="text-lg font-semibold text-gray-800">
                            {founder.first_name} {founder.last_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {founder.profession || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ProfileDetail
                          icon={<MapPin size={16} className="text-red-500" />}
                          label="Location"
                          value={`${founder.city || "N/A"}, ${founder.state || "N/A"}`}
                        />
                        <ProfileDetail
                          icon={<Mail size={16} className="text-blue-500" />}
                          label="Email"
                          value={founder.email || "N/A"}
                        />
                        <ProfileDetail
                          icon={
                            <Calendar size={16} className="text-orange-500" />
                          }
                          label="Joined"
                          value={formatDate(founder.created_at)}
                        />
                      </div>
                      <Link
                        to={`/people/${founder.slug}`}
                        className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                        View Full Profile{" "}
                        <ChevronRight size={16} className="ml-2" />
                      </Link>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      Founder information not available.
                    </p>
                  )}
                </Section>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-4">
          <SidebarSection
            title="Contact"
            icon={<Mail size={16} className="text-blue-500" />}
            toggleVisibility={toggleContactVisibility}
            isVisible={isContactVisible}>
            {contact_person_number && (
              <ContactDetail
                icon={<Phone size={14} className="text-green-500" />}
                value={
                  isContactVisible ? contact_person_number : "************"
                }
              />
            )}
            {contact_person_email && (
              <ContactDetail
                icon={<Mail size={14} className="text-blue-500" />}
                value={
                  isContactVisible ? contact_person_email : "****@*****.com"
                }
              />
            )}
            {business_address && (
              <ContactDetail
                icon={<MapPin size={14} className="text-red-500" />}
                value={`${business_address}${nearest_bus_stop ? `, ${nearest_bus_stop}` : ""}`}
              />
            )}
            {state && (
              <ContactDetail
                icon={<MapPin size={14} className="text-gray-500" />}
                value={`State: ${state}`}
              />
            )}
            {city && (
              <ContactDetail
                icon={<MapPin size={14} className="text-gray-500" />}
                value={`LGA: ${city}`}
              />
            )}
            {area && (
              <ContactDetail
                icon={<MapPin size={14} className="text-gray-500" />}
                value={`Area: ${area}`}
              />
            )}
            {landmark && (
              <ContactDetail
                icon={<MapPin size={14} className="text-gray-500" />}
                value={`Landmark: ${landmark}`}
              />
            )}
            {business_website && (
              <ContactDetail
                icon={<Globe size={14} className="text-purple-500" />}
                value={
                  <a
                    href={
                      business_website.startsWith("http")
                        ? business_website
                        : `https://${business_website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline">
                    {business_website}
                  </a>
                }
              />
            )}
          </SidebarSection>

          <SidebarSection
            title="Financials"
            icon={<DollarSign size={16} className="text-green-500" />}>
            <ProfileDetail
              icon={<DollarSign size={14} className="text-green-500" />}
              label="Daily"
              value={formatCurrency(expected_daily_income)}
            />
            <ProfileDetail
              icon={<DollarSign size={14} className="text-blue-500" />}
              label="Monthly"
              value={formatCurrency(monthly_income)}
            />
            <ProfileDetail
              icon={<DollarSign size={14} className="text-purple-500" />}
              label="Yearly"
              value={formatCurrency(yearly_income)}
            />
            <ProfileDetail
              icon={<DollarSign size={14} className="text-orange-500" />}
              label="Net Worth"
              value={formatCurrency(net_worth)}
            />
          </SidebarSection>

          <SidebarSection
            title="Registration"
            icon={<Briefcase size={16} className="text-gray-500" />}>
            <ProfileDetail
              icon={<Briefcase size={14} className="text-blue-500" />}
              label="Reg No"
              value={business_reg_number || "N/A"}
            />
            <ProfileDetail
              icon={<Briefcase size={14} className="text-purple-500" />}
              label="TIN"
              value={tin_number || "N/A"}
            />
            <ProfileDetail
              icon={<Briefcase size={14} className="text-teal-500" />}
              label="Tax Reg No"
              value={tax_reg_no || "N/A"}
            />
          </SidebarSection>

          <SidebarSection
            title="Social"
            icon={<Globe size={16} className="text-purple-500" />}>
            {Object.entries(social_media).map(([platform, url], index) =>
              url ? (
                <ContactDetail
                  key={index}
                  icon={<Globe size={14} className="text-blue-500" />}
                  value={
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline truncate">
                      {platform}: {url}
                    </a>
                  }
                />
              ) : null
            )}
          </SidebarSection>
        </div>
      </div>

      {/* Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <motion.div
            className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] flex flex-col"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}>
            <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center z-10">
              <h2 className="text-lg font-semibold text-gray-800">Gallery</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-600 hover:text-red-500 transition">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {product_photos.length > 0 &&
              product_photos[0]?.photo_paths?.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <img
                      src={product_photos[0].photo_paths[currentImageIndex]}
                      alt={`Product Photo ${currentImageIndex + 1}`}
                      className="w-full max-w-lg h-auto object-contain rounded-md"
                      onError={(e) => (e.target.src = defaultBusinessLogo)}
                    />
                  </div>
                  <div className="flex justify-center gap-2">
                    {product_photos[0].photo_paths.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full ${currentImageIndex === index ? "bg-blue-500" : "bg-gray-300"}`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center p-4">
                  No photos available yet.
                </p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// Reusable Components
const TabBar = ({ tabs, activeTab, setActiveTab }) => (
  <div className="border-b overflow-x-auto whitespace-nowrap">
    <div className="flex">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`inline-block py-2 px-4 text-sm font-medium capitalize min-w-[100px] ${
            activeTab === tab
              ? "bg-red-500 text-white"
              : "text-gray-600 hover:bg-gray-200"
          } transition`}>
          {tab}
        </button>
      ))}
    </div>
  </div>
);

const Section = ({ title, icon, children }) => (
  <div>
    {title && (
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-2">
        {icon} {title}
      </h2>
    )}
    {children}
  </div>
);

const SidebarSection = ({
  title,
  icon,
  children,
  toggleVisibility,
  isVisible = true,
}) => (
  <motion.div
    className="bg-white rounded-lg shadow p-4"
    initial="hidden"
    animate="visible"
    variants={fadeInRight}>
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-base font-semibold flex items-center gap-2">
        {icon} {title}
      </h2>
      {toggleVisibility && (
        <button
          onClick={toggleVisibility}
          className="text-blue-500 hover:text-blue-700 text-xs flex items-center gap-1">
          {isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      )}
    </div>
    <div className="space-y-2 text-sm">{children}</div>
  </motion.div>
);

const ActionButton = ({ onClick, icon, label, bgColor, hoverColor }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1 px-3 py-2 ${bgColor} text-white rounded-xl ${hoverColor} transition`}
    title={label}>
    {icon}
    <span className="text-sm">{label}</span>
  </button>
);

const ProfileDetail = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 text-gray-700">
    {icon} <span className="text-xs text-gray-500">{label}:</span>{" "}
    <span className="font-medium">{value || "N/A"}</span>
  </div>
);

const ContactDetail = ({ icon, value }) => (
  <div className="flex items-center gap-2 text-gray-700">
    {icon} <span className="text-sm truncate">{value || "N/A"}</span>
  </div>
);

export default SingleBusinessPage;

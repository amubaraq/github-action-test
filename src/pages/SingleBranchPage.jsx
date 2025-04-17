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
  Clock,
  ChevronLeft,
  Eye,
  EyeOff,
  Star,
  User,
  DollarSign,
  Home,
  Bus,
  Award,
  TrendingUp,
  CheckCircle,
  Info,
  RefreshCw,
  Link as LinkIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import LoaddingSpinner from "../components/tools/LoaddingSpinner";
import BranchReview from "../components/BranchReview";
import backendURL from "../config";

const defaultBranchLogo =
  "https://res.cloudinary.com/digzrkdoe/image/upload/v1740847778/edirect_business_photos/business_67c33aa215e8f.png";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const fadeInRight = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

const SingleBranchPage = () => {
  const { branchSlug } = useParams();
  const [branch, setBranch] = useState(null);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isContactVisible, setIsContactVisible] = useState(true);
  const [isFinancialVisible, setIsFinancialVisible] = useState(false);
  const navigate = useNavigate();

  const CURRENT_YEAR = new Date("2025-04-01").getFullYear(); // Current year as of April 01, 2025

  const fetchBranchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${backendURL}/api/branch/${branchSlug}`
      );

      if (response.data.status === "success") {
        const branchData =
          response.data.branch?.details || response.data.branch;
        const businessData =
          response.data.branch?.business || response.data.business;

        if (branchData) {
          // Calculate years of operation if date_established exists
          if (branchData.date_established) {
            const establishedYear = new Date(
              branchData.date_established
            ).getFullYear();
            branchData.years_of_operation = isNaN(establishedYear)
              ? "N/A"
              : CURRENT_YEAR - establishedYear;
          } else {
            branchData.years_of_operation = "N/A";
          }

          setBranch(branchData);
          setBusiness(businessData);
        } else {
          setError("Branch data not found");
        }
      } else {
        setError(response.data.message || "Branch not found");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching branch data");
      console.error("API fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [branchSlug]);

  useEffect(() => {
    fetchBranchProfile();
  }, [fetchBranchProfile]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: branch?.branch_name,
          text: `Check out ${branch?.branch_name}'s profile`,
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert("Branch profile link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const initiateCall = useCallback(() => {
    if (branch?.contact_number) {
      window.location.href = `tel:${branch.contact_number}`;
    }
  }, [branch?.contact_number]);

  const handleReportClick = useCallback(() => {
    if (branch?.id) {
      navigate(`/reportBranch?branchId=${branch.id}`);
    }
  }, [branch?.id, navigate]);

  const toggleContactVisibility = () => setIsContactVisible(!isContactVisible);
  const toggleFinancialVisibility = () =>
    setIsFinancialVisible(!isFinancialVisible);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date)
      ? "Invalid"
      : date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
  };

  const formatCurrency = (amount) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <LoaddingSpinner />
      </div>
    );
  }

  if (error || !branch) {
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
            {error || "Branch Not Found"}
          </h2>
          <p className="text-gray-600 mb-4">
            The branch profile doesn't exist or has been removed.
          </p>
          {business?.slug && (
            <Link
              to={`/SingleBusinessPage/${business.slug}`}
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
              <ChevronLeft size={16} /> Back to Business
            </Link>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto bg-gray-100 min-h-screen p-4">
      {/* Header Section */}
      <motion.div
        className="bg-white rounded-lg shadow overflow-hidden bg-gradient-to-r from-[#341f1f] to-[#803d3d] opacity-80"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}>
        <div className="relative h-32">
          {business?.slug && (
            <Link
              to={`/SingleBusinessPage/${business.slug}`}
              className="absolute top-2 left-2 p-1 bg-white/20 rounded-full text-white hover:bg-white/30 transition">
              <ChevronLeft size={20} />
            </Link>
          )}
        </div>
        <div className="relative -mt-16 px-4 pb-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <img
              src={defaultBranchLogo}
              alt={branch.branch_name}
              className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
              onError={(e) => (e.target.src = defaultBranchLogo)}
            />
            <div className="flex-1 text-center sm:text-left text-white">
              <h1 className="text-2xl font-bold">{branch.branch_name}</h1>
              {business?.business_name && (
                <p className="text-sm">Branch of {business.business_name}</p>
              )}
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-1 text-xs">
                {branch.branch_address && branch.city && (
                  <span className="flex items-center gap-1">
                    <MapPin size={12} /> {branch.branch_address}, {branch.city}
                  </span>
                )}
                {branch.number_of_staff && (
                  <span className="flex items-center gap-1">
                    <Users size={12} /> {branch.number_of_staff}{" "}
                    {branch.number_of_staff > 1 ? "staffs" : "staff"}
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
              {branch.contact_number && (
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
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-4">
          <motion.div
            className="bg-white rounded-lg shadow overflow-hidden"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}>
            <div className="p-4 space-y-8">
              {/* Overview Section */}
              <Section
                title="Branch Overview"
                icon={<Building2 size={18} className="text-blue-500" />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ProfileDetail
                    icon={<Building2 size={16} className="text-blue-500" />}
                    label="Branch Name"
                    value={branch.branch_name}
                  />

                  {branch.date_established && (
                    <ProfileDetail
                      icon={<Calendar size={16} className="text-orange-500" />}
                      label="Established"
                      value={formatDate(branch.date_established)}
                    />
                  )}

                  {branch.operation_hours && (
                    <ProfileDetail
                      icon={<Clock size={16} className="text-blue-500" />}
                      label="Operation Hours"
                      value={branch.operation_hours}
                    />
                  )}

                  {branch.number_of_staff && (
                    <ProfileDetail
                      icon={<Users size={16} className="text-green-500" />}
                      label="Staff Count"
                      value={branch.number_of_staff}
                    />
                  )}

                  {branch.branch_address && branch.city && branch.state && (
                    <ProfileDetail
                      icon={<MapPin size={16} className="text-red-500" />}
                      label="Address"
                      value={`${branch.branch_address}, ${branch.city}, ${branch.state}`}
                    />
                  )}

                  {branch.landmark && (
                    <ProfileDetail
                      icon={<Home size={16} className="text-purple-500" />}
                      label="Landmark"
                      value={branch.landmark}
                    />
                  )}

                  {branch.nearest_bus_stop && (
                    <ProfileDetail
                      icon={<Bus size={16} className="text-yellow-500" />}
                      label="Nearest Bus Stop"
                      value={branch.nearest_bus_stop}
                    />
                  )}
                </div>
              </Section>
              <hr />

              {/* Financial Information Section */}
              <Section
                title="Financial Information"
                icon={<DollarSign size={18} className="text-green-500" />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {branch.expected_daily_income && (
                    <ProfileDetail
                      icon={<TrendingUp size={16} className="text-green-500" />}
                      label="Expected Daily Income"
                      value={formatCurrency(branch.expected_daily_income)}
                    />
                  )}

                  {branch.monthly_income && (
                    <ProfileDetail
                      icon={<TrendingUp size={16} className="text-blue-500" />}
                      label="Monthly Income"
                      value={formatCurrency(branch.monthly_income)}
                    />
                  )}

                  {branch.yearly_income && (
                    <ProfileDetail
                      icon={
                        <TrendingUp size={16} className="text-purple-500" />
                      }
                      label="Yearly Income"
                      value={formatCurrency(branch.yearly_income)}
                    />
                  )}

                  {branch.years_of_operation !== "N/A" && (
                    <ProfileDetail
                      icon={<Calendar size={16} className="text-orange-500" />}
                      label="Years of Operation"
                      value={`${branch.years_of_operation} ${
                        branch.years_of_operation === 1 ? "year" : "years"
                      }`}
                    />
                  )}
                </div>
              </Section>
              <hr />

              {/* Reviews Section */}
              <Section
                title="Reviews"
                icon={<Star size={18} className="text-yellow-500" />}>
                <BranchReview branchSlug={branchSlug} />
              </Section>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Sidebar */}
        <div className="space-y-4">
          {/* Contact Info */}
          <SidebarSection
            title="Contact"
            icon={<Mail size={16} className="text-blue-500" />}
            toggleVisibility={toggleContactVisibility}
            isVisible={isContactVisible}>
            {branch.contact_person && (
              <ContactDetail
                icon={<User size={14} className="text-purple-500" />}
                value={branch.contact_person}
              />
            )}

            {branch.contact_number && (
              <ContactDetail
                icon={<Phone size={14} className="text-green-500" />}
                value={
                  isContactVisible ? branch.contact_number : "************"
                }
              />
            )}

            {branch.contact_email && (
              <ContactDetail
                icon={<Mail size={14} className="text-blue-500" />}
                value={
                  isContactVisible ? branch.contact_email : "****@*****.com"
                }
              />
            )}
          </SidebarSection>

          {/* Business Details */}
          <SidebarSection
            title="Business Details"
            icon={<Building2 size={16} className="text-green-500" />}>
            {business?.business_name && (
              <ProfileDetail
                icon={<Building2 size={14} className="text-blue-500" />}
                label="Business Name"
                value={business.business_name}
              />
            )}

            {business?.slug && (
              <ProfileDetail
                icon={<LinkIcon size={14} className="text-blue-500" />}
                label="Business Profile"
                value={
                  <Link
                    to={`/SingleBusinessPage/${business.slug}`}
                    className="text-blue-500 hover:underline">
                    View Business
                  </Link>
                }
              />
            )}

            {branch.property_status && (
              <ProfileDetail
                icon={<Home size={14} className="text-orange-500" />}
                label="Property Status"
                value={branch.property_status}
              />
            )}
          </SidebarSection>

          {/* Metadata */}
          <SidebarSection
            title="Metadata"
            icon={<Info size={16} className="text-gray-500" />}>
            {branch.created_at && (
              <ProfileDetail
                icon={<Calendar size={14} className="text-gray-500" />}
                label="Created"
                value={formatDate(branch.created_at)}
              />
            )}

            {branch.updated_at && (
              <ProfileDetail
                icon={<RefreshCw size={14} className="text-gray-500" />}
                label="Last Updated"
                value={formatDate(branch.updated_at)}
              />
            )}

            {branch.views && (
              <ProfileDetail
                icon={<Eye size={14} className="text-gray-500" />}
                label="Views"
                value={branch.views}
              />
            )}
          </SidebarSection>
        </div>
      </div>
    </div>
  );
};

// Reusable Components
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
  isVisible,
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

export default SingleBranchPage;

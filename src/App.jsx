import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ScrollToTop from "./components/tools/ScrollToTop";
import ProtectedRoute from "./components/routes/protectedRoutes";
import AdminLayout from "./components/AdminDashboard/AdminLayout";
import SuperAdminLayout from "./components/SuperAdminDashboard/SuperAdminLayout";
import UserLayout from "./components/UserDashboard/UserLayout";
import AgentLayout from "./components/AgentDashboard/AgentLayout";
import { Home } from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import FoundersPage from "./pages/FoundersPage";
import ContactUs from "./pages/ContactUs";
import AllCategories from "./pages/AllCategories";
import UnifiedSearchPage from "./pages/UnifiedSearchPage";
import PeopleSearchPage from "./pages/PeopleSearchPage";
import BlacklistPage from "./pages/BlacklistPage";
import AllBusinessesPage from "./pages/AllBusinessPage";
import SingleBusinessPage from "./pages/SingleBusinessPage";
import SinglePeoplesPage from "./pages/SinglePeoplesPage";
import SingleBranchPage from "./pages/SingleBranchPage";
import AccessRequestPage from "./pages/AccessRequestPage";
import PeoplePage from "./pages/PeoplesPage";
import RequestFormPage from "./pages/RequestFormPage";
import HireDriverFormPage from "./pages/HireDriverFormPage";
import ReporBusiness from "./pages/ReporBusiness";
import ReportUser from "./pages/ReportUser";
import ProminentPeopleList from "./pages/ProminentPeopleList";
import SingleProminentPage from "./pages/SingleProminentPage";
// Subscription
import PackagesPage from "./pages/Subscriptions/PackagesPage";
import VerifySubscription from "./pages/Subscriptions/VerifySubscription";
import PaymentSuccess from "./pages/Subscriptions/PaymentSuccess";
import PaymentError from "./pages/Subscriptions/PaymentError";
import PaymentPage from "./pages/PaymentPage ";
import BusinessADs from "./pages/BusinessADs";
// Egroup
import GroupPage from "./pages/Groups/GroupPage";
import DiscussionPage from "./pages/Groups/Discussion";
// Auth
import Signup from "./pages/Auth/Register";
import EmailVerification from "./pages/Auth/EmailVerification";
import Login from "./pages/Auth/Login";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";

// SuperAdminDashBoard
import SuperAdminAdminDashboard from "./pages/SuperAdminPages/SuperAdminAdminDashboard";
import SuperAdminAdminProfile from "./pages/SuperAdminPages/SuperAdminAdminProfile";
import SuperAdminALlUsers from "./pages/SuperAdminPages/SuperAdminALlUsers";
import SuperAdminDocumentVerifications from "./pages/SuperAdminPages/SuperAdminDocumentVerifications";
import SuperAdminAllRunningAds from "./pages/SuperAdminPages/SuperAdminAllRunningAds";
import SuperAdminListBusinessesBranches from "./pages/SuperAdminPages/SuperAdminListBusinessesBranches";
import SuperAdminSubscriptionsData from "./pages/SuperAdminPages/SuperAdminSubscriptionsData";
import SuperAdminCreateUser from "./pages/SuperAdminPages/SuperAdminCreateUser";

// AdminDashBoard
import AdminDashboard from "./pages/AdminPages/AdminDashboard";
import AllUsers from "./pages/AdminPages/AdminALlUsers";
import DocumentVerifications from "./pages/AdminPages/DocumentVerifications";
import AllRunningAds from "./pages/AdminPages/AllRunningAds";
import ListBusinessesBranches from "./pages/AdminPages/ListBusinessesBranches";
import ProminentPeopleRequest from "./pages/AdminPages/ProminentPeopleRequest";

// AgentDashboard
import AgentDashboard from "./pages/AgentPages/AgentDashboard";
import AgentProfile from "./pages/AgentPages/AgentProfile";
import AgentRegisters from "./pages/AgentPages/AgentRegisters";
import AgentNotification from "./pages/AgentPages/AgentNotification";
import AgentCreateUsers from "./pages/AgentPages/AgentCreateUsers";
import AgentCommissions from "./pages/AgentPages/AgentCommissions";
import AgentSubscriptions from "./pages/AgentPages/AgentSubscriptions";

// UserDashboard
import UserProfile from "./pages/UserPages/UserProfile";
import BusinessProfile from "./pages/UserPages/UserBusinessProfile";
import UserBusinesses from "./pages/UserPages/UserBusinesses";
import UserFinanceForm from "./pages/UserPages/UserFinanceForm";
import BusinessBranch from "./pages/UserPages/BusinessBranch";
import UserDashboard from "./pages/UserPages/UserDashboard";
import VerifyDocuments from "./pages/UserPages/VerifyDocuments";
import RequestSupport from "./pages/UserPages/Request&Support";
import TopListing from "./pages/UserPages/TopListing";
import VerifyPayment from "./pages/UserPages/VerifyPayment";
import AddProminentPeople from "./pages/UserPages/AddProminentPeople";

// Others
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const StartFromTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppContent = () => {
  const location = useLocation();
  // const isDashboardRoute = location.pathname.startsWith("/User", "/Admin");
  const isDashboardRoute =
    location.pathname.startsWith("/User") ||
    location.pathname.startsWith("/user") ||
    location.pathname.startsWith("/Admin") ||
    location.pathname.startsWith("/SuperAdmin") ||
    location.pathname.startsWith("/Agent") ||
    location.pathname.startsWith("/agent") ||
    location.pathname.startsWith("/ads");

  return (
    <>
      <ScrollToTop />
      {!isDashboardRoute && <Navbar />}
      <Routes>
        {/* general */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/searchPage" element={<UnifiedSearchPage />} />
        <Route path="/searchPage/people" element={<PeopleSearchPage />} />
        <Route path="/All-Category" element={<AllCategories />} />
        <Route path="/business" element={<AllBusinessesPage />} />
        <Route path="/founders" element={<FoundersPage />} />
        {/* prominent? */}

        <Route path="/Prominent-People" element={<ProminentPeopleList />} />
        <Route
          path="/Prominent-person/:slug?"
          element={<SingleProminentPage />}
        />
        <Route
          path="/SingleBusinessPage/:slug?"
          element={<SingleBusinessPage />}
        />
        <Route
          path="/businessBranch/:branchSlug?"
          element={<SingleBranchPage />}
        />

        <Route path="/profile/:slug?" element={<SinglePeoplesPage />} />
        <Route path="/profile-access-request" element={<AccessRequestPage />} />
        <Route path="/people" element={<PeoplePage />} />
        <Route path="/blacklist" element={<BlacklistPage />} />
        <Route path="/requests" element={<RequestFormPage />} />
        <Route path="/reportsBusiness/:slug?" element={<ReporBusiness />} />
        <Route path="/ReportUser" element={<ReportUser />} />
        {/* Subscription */}
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/callback" element={<VerifySubscription />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-error" element={<PaymentError />} />
        {/* sub ends */}
        <Route path="/payment/:packageId?" element={<PaymentPage />} />
        <Route path="/hire-driver" element={<HireDriverFormPage />} />
        <Route path="/Business-ads" element={<BusinessADs />} />
        {/* E-Groups */}
        <Route path="/Group/:slug?" element={<GroupPage />} />
        <Route path="/discussion/:slug?" element={<DiscussionPage />} />

        {/* Auth */}
        <Route path="/signUp" element={<Signup />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* SuperAdmin dashborad  */}
        <Route element={<ProtectedRoute requiredRole="super_admin" />}>
          <Route element={<SuperAdminLayout />}>
            <Route
              path="/SuperAdmin/Dashboard"
              element={<SuperAdminAdminDashboard />}
            />
            <Route
              path="/SuperAdmin/profile"
              element={<SuperAdminAdminProfile />}
            />
            <Route
              path="/SuperAdmin/All_Users"
              element={<SuperAdminALlUsers />}
            />
            <Route
              path="/SuperAdmin/DocumentVerifications"
              element={<SuperAdminDocumentVerifications />}
            />
            <Route
              path="/SuperAdmin/AllRunningAds"
              element={<SuperAdminAllRunningAds />}
            />
            <Route
              path="/SuperAdmin/ListBusinessesBranches"
              element={<SuperAdminListBusinessesBranches />}
            />
            <Route
              path="/SuperAdmin/SubscriptionsData"
              element={<SuperAdminSubscriptionsData />}
            />
            <Route
              path="/SuperAdmin/CreateUser"
              element={<SuperAdminCreateUser />}
            />
          </Route>
        </Route>

        {/* Admin dashborad  */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route element={<AdminLayout />}>
            <Route path="/Admin/Dashboard" element={<AdminDashboard />} />
            <Route path="/Admin/All_Users" element={<AllUsers />} />
            <Route
              path="/Admin/DocumentVerifications"
              element={<DocumentVerifications />}
            />
            <Route path="/Admin/AllRunningAds" element={<AllRunningAds />} />
            <Route
              path="/Admin/ListBusinessesBranches"
              element={<ListBusinessesBranches />}
            />
            <Route
              path="/Admin/ProminentPeopleRequest"
              element={<ProminentPeopleRequest />}
            />
          </Route>
        </Route>

        {/* User dashborad  */}
        <Route element={<ProtectedRoute requiredRole="user" />}>
          <Route element={<UserLayout />}>
            <Route path="/user/profile" element={<UserProfile />} />
            <Route path="/user/business/:slug?" element={<BusinessProfile />} />
            <Route path="/user/Allbusiness" element={<UserBusinesses />} />
            <Route path="/user/finance" element={<UserFinanceForm />} />
            <Route path="/user/MyDashBoad" element={<UserDashboard />} />
            <Route path="/user/VerifyDocuments" element={<VerifyDocuments />} />
            <Route path="/user/Request-Support" element={<RequestSupport />} />
            <Route path="/user/topListing" element={<TopListing />} />
            <Route
              path="/user/AddProminentPeople"
              element={<AddProminentPeople />}
            />
            {/* <Route path="user/ads/payment/verify" element={<VerifyPayment />} /> */}
            <Route
              path="/ads/payment/verify/:businessSlug?/:branchSlug?"
              element={<VerifyPayment />}
            />

            <Route
              path="/user/business/:slug/branches"
              element={<BusinessBranch />}
            />
          </Route>
        </Route>

        {/* Agent dashborad*/}
        <Route element={<ProtectedRoute requiredRole="agent" />}>
          <Route element={<AgentLayout />}>
            <Route path="/Agent/Dashboard" element={<AgentDashboard />} />
            <Route path="/Agent/profile" element={<AgentProfile />} />
            <Route path="/Agent/My_Reg_Users" element={<AgentRegisters />} />
            <Route path="/Agent/CreateUsers" element={<AgentCreateUsers />} />
            <Route
              path="/Agent/subscriptions"
              element={<AgentSubscriptions />}
            />
            <Route path="/Agent/commissions" element={<AgentCommissions />} />
            <Route
              path="/Agent/Notifications"
              element={<AgentNotification />}
            />
          </Route>
        </Route>
      </Routes>
      <ScrollToTop />
      <StartFromTop />
      {!isDashboardRoute && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;

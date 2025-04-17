import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaTimes, FaBars, FaUserCircle } from "react-icons/fa";
import { HiOutlineLogout, HiOutlineCog, HiOutlineHome } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/Auth/authSlice";
import CurrencyChecker from "./CurrencyChecker";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo, token } = useSelector((state) => state.auth);
  console.log(userInfo);
  const navLinks = [
    { name: "Packages", url: "/packages" },
    { name: "People", url: "/people" },
    { name: "Founders", url: "/founders" },
    { name: "Business", url: "/business" },
    { name: "Blacklist", url: "/blacklist" },
    { name: "who's who", url: "/Prominent-People" },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
    localStorage.removeItem("userInfo");
    setIsProfileOpen(false);
    setIsMenuOpen(false);
  };

  const handleDashboardClick = () => {
    let dashboardPath = "/user/MyDashBoad"; // Default to user profile

    if (userInfo?.role === "agent") {
      dashboardPath = "/Agent/Dashboard";
    } else if (userInfo?.role === "super_admin") {
      dashboardPath = "/SuperAdmin/Dashboard";
    } else if (userInfo?.role === "admin") {
      dashboardPath = "/Admin/Dashboard";
    }

    navigate(dashboardPath);
    setIsProfileOpen(false);
    setIsMenuOpen(false); // Close mobile menu after clicking
  };

  return (
    <nav className="sticky top-[-0.1rem] left-0 right-0 z-50 bg-[#0A0B2E] py-2 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <Link to="/" className="flex flex-col text-white">
            <span className="text-md font-bold italic">essential</span>
            <div className="flex flex-col text-xs text-gray-300">
              <span>+234 7000 555 666</span>
              <span>+234 90 5555 6666</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.url}
                to={link.url}
                className={({ isActive }) =>
                  `text-sm font-medium transition-all duration-200 transform hover:scale-125 ${
                    isActive ? "text-white" : "text-gray-300 hover:text-white"
                  }`
                }>
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Auth and Browse Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {!userInfo ? (
              <>
                <Link to="/login">
                  <button className="px-4 py-1.5 text-sm text-white hover:text-gray-300 transition-all duration-200 transform hover:scale-105">
                    Login
                  </button>
                </Link>
                <Link to="/signup">
                  <button className="px-4 py-1.5 text-sm text-white hover:text-gray-300 transition-all duration-200 transform hover:scale-105">
                    Register
                  </button>
                </Link>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 text-sm text-white hover:text-gray-300 transition-all duration-200 transform hover:scale-105 focus:outline-none">
                  <FaUserCircle className="w-5 h-5" />
                  <span>My Account</span>
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-100">
                    <div className="flex flex-col">
                      <button
                        onClick={handleDashboardClick}
                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors duration-150 text-left">
                        <HiOutlineHome className="w-4 h-4" />
                        <span>Dashboard</span>
                      </button>
                      <a
                        href="/settings"
                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors duration-150">
                        <HiOutlineCog className="w-4 h-4" />
                        <span>Settings</span>
                      </a>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors duration-150 text-left">
                        <HiOutlineLogout className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                    <hr className="my-2 border-gray-200" />
                    <div className="px-4 py-1 text-xs text-gray-500 truncate">
                      <span className="text-sm font-medium text-black first-letter:uppercase">
                        {userInfo.email ? userInfo.email : userInfo.name}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
            <Link to="/All-Category">
              <button className="px-4 py-1.5 text-sm bg-[#FF4400] text-white rounded-md hover:bg-[#ff5500] transition-all duration-200 transform hover:scale-105">
                Browse By Category
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsMenuOpen(false)}>
        {/* Mobile Menu Slide-out */}
        <div
          className={`fixed top-0 right-0 w-72 h-full bg-[#0A0B2E] shadow-lg transform transition-transform duration-300 ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}>
          <div className="flex flex-col h-full">
            {/* Mobile Menu Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              {userInfo && (
                <div className="flex items-center gap-3">
                  <FaUserCircle className="w-8 h-8 text-white" />
                  <span className="text-sm font-medium text-white">
                    {userInfo.email ? userInfo.email : userInfo.name}
                  </span>
                </div>
              )}

              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-white hover:text-gray-300">
                <FaTimes size={24} />
              </button>
            </div>

            {/* Mobile Menu Links */}
            <div className="flex flex-col py-4">
              {userInfo && (
                <>
                  <button
                    onClick={handleDashboardClick}
                    className="px-4 py-3 text-sm font-medium text-gray-300 hover:bg-[#FF4400]/10 hover:text-white flex items-center gap-2">
                    <HiOutlineHome className="w-4 h-4" />
                    <span>Dashboard</span>
                  </button>
                  <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                      `px-4 py-3 text-sm font-medium flex items-center gap-2 ${
                        isActive
                          ? "text-white bg-[#FF4400]/20"
                          : "text-gray-300 hover:bg-[#FF4400]/10 hover:text-white"
                      }`
                    }
                    onClick={() => setIsMenuOpen(false)}>
                    <HiOutlineCog className="w-4 h-4" />
                    <span>Settings</span>
                  </NavLink>
                </>
              )}
              {navLinks.map((link) => (
                <NavLink
                  key={link.url}
                  to={link.url}
                  className={({ isActive }) =>
                    `px-4 py-3 text-sm font-medium ${
                      isActive
                        ? "text-white bg-[#FF4400]/20"
                        : "text-gray-300 hover:bg-[#FF4400]/10 hover:text-white"
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}>
                  {link.name}
                </NavLink>
              ))}
            </div>

            {/* Mobile Menu Footer */}
            <div className="mt-auto p-4 border-t border-gray-700">
              {userInfo ? (
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-[#FF4400] rounded-lg hover:bg-[#ff5500] transition-colors duration-200 flex items-center justify-center gap-2">
                  <HiOutlineLogout className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    className="w-full px-4 py-2 text-sm font-medium text-white border border-white rounded-lg hover:bg-white hover:text-[#0A0B2E] text-center transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-[#FF4400] rounded-lg hover:bg-[#ff5500] text-center transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}>
                    Register
                  </Link>
                </div>
              )}
              <Link to="/All-Category" className="block mt-2">
                <button className="w-full px-4 py-2 text-sm font-medium text-white bg-[#FF4400] rounded-lg hover:bg-[#ff5500] transition-colors duration-200">
                  Browse By Category
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div>
        <CurrencyChecker />
      </div>
    </nav>
  );
};

export default Navbar;

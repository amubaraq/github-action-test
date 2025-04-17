import React, { useState, useEffect } from "react";
import Ebusiness from "../assets/images/E-business.png";
import TopNotchBusinesses from "../components/Cards/TopNotchBusinesses";
import TopBusinessCatCard from "../components/Cards/TopBusinessCards";
import { FilterBusiness } from "../components/Cards/BrowseComponent";
import RecommendedBusinesses from "../components/Cards/RecommendedBusiness";
import ShortVideosSection from "../components/Cards/ShortVideos";
import { Box, Typography, Paper, Grid, Button, styled } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Globe, Palette, MessageCircle, X } from "lucide-react";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { MdPersonAddAlt1 } from "react-icons/md";
import LoginModal from "../components/tools/LoginModal";
import GroupsYouMayLike from "../components/Cards/GroupsYouMayLike";
import EDirectNumbers from "../components/homeComponents/EdirectInNumbers";
import AllEssentialgroupSection from "../components/AllEssentialgroupSection";
import {
  BreakingNewsCarousel,
  TopTopicCarousel,
} from "../components/EnewsCarousel/BreakingNewsCarousel";
import EDriversBanner from "../components/Banners/EDriversBanner";
import { CommunityStats } from "../components/Cards/CommunityStatsCard";
import EdirectBanner from "../components/homeComponents/EdirectBanner";
import HeroSection from "../pages/pagesections/homeHero";
import resportBusiness from "/src/assets/images/businessCard2.png";
import requestBusiness from "/src/assets/images/businessCard2.png";
import { useLocation, Link, useNavigate } from "react-router-dom";
import MagazineBanner from "../components/Banners/AutographBanner";
import TopNotchPeople from "../components/Cards/TopNotchPeople";
import ProminentPeopleBanner from "../components/Banners/ProminentPeopleBanner";
export function Home() {
  return (
    <>
      <HeroSection />
      <EdirectBanner />
      <Ebusinesses />
    </>
  );
}

const AuthenticatedActionCard = ({
  title,
  description,
  buttonText,
  imageSrc,
  Url,
}) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);

  const handleAction = (e) => {
    console.log(userInfo, "userInfo");
    e.preventDefault();
    if (!userInfo) {
      setShowLoginModal(true);
    }
  };

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="rounded-lg shadow-md overflow-hidden h-auto transition-transform duration-300 hover:scale-105 ">
        <div className="p-4">
          <h3 className="text-xl text-white font-bold mb-2 underline">
            {title}
          </h3>
          <p className="text-white mb-4 max-w-[25 rem]">{description}</p>
          {userInfo ? (
            <Link to={Url}>
              <button className="relative flex rounded-full bg-red-50 text-red-600 hover:text-white px-3 py-1 overflow-hidden transition-all duration-300 hover:rotate-2 hover:bg-red-700 hover:ring-2 hover:ring-white ring-2 ring-red-600">
                {buttonText}
                <span className="mt-1 ml-1">
                  <IoArrowForwardCircleOutline />
                </span>
              </button>
            </Link>
          ) : (
            <button
              onClick={handleAction}
              className="relative flex rounded-full bg-red-50 text-red-600 hover:text-white px-3 py-1 overflow-hidden transition-all duration-300 hover:rotate-2 hover:bg-red-700 hover:ring-2 hover:ring-white ring-2 ring-red-600 ">
              {buttonText}
              <span className="mt-1 ml-1">
                <IoArrowForwardCircleOutline />
              </span>
            </button>
          )}
        </div>
      </div>

      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
    </>
  );
};
export const Ebusinesses = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleRegisterNow = () => {
    console.log("Register Now clicked", userInfo);
    if (!userInfo) {
      setShowLoginModal(true);
    } else {
      navigate("/user/profile");
    }
  };

  return (
    <div>
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}
      <div className="container mx-auto px-4   max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
          <AuthenticatedActionCard
            title="Make a Request"
            description="Describe your request here. We're here to assist you with any inquiries or services you need."
            buttonText="Submit Request"
            imageSrc={resportBusiness}
            Url="/user/Request-Support"
            userInfo={userInfo} // Pass the userInfo from your Redux store
          />

          <AuthenticatedActionCard
            title="Report a Business Scam"
            description="Help keep our community safe. If you've encountered a suspicious business or potential scam, let us know here."
            buttonText="Report Now"
            imageSrc={requestBusiness}
            Url="/reportsBusiness"
            userInfo={userInfo} // Pass the userInfo from your Redux store
          />
        </div>
      </div>
      {/* E-business */}
      <section className="py-8 px-4 md:py-12 lg:py-16 max-w-6xl mx-auto">
        <div className="w-full bg-gradient-to-r from-[#341f1f] to-[#803d3d] shadow-lg rounded-xl overflow-hidden">
          <h1 className="text-xl md:text-2xl font-bold p-4 border-b border-opacity-20 border-white text-white">
            E- Business
          </h1>
          <div className="flex flex-col md:flex-row items-center p-4 md:p-6 lg:p-8 gap-6">
            <div className="w-full md:w-1/2">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 text-white">
                Register Now to get your Business Listed On Essential Direct
              </h2>
              <p className="text-white font-light mb-6 opacity-90">
                Lorem ipsum dolor sit amet consectetur. Vestibulum massa turpis
                varius et eros at.
              </p>
              <button
                onClick={handleRegisterNow}
                className="flex items-center justify-center bg-red-600 text-white px-4 py-2 rounded overflow-hidden transition-all duration-300 hover:bg-red-700 hover:ring-2 hover:ring-white">
                <span className="mr-2">Register Now</span>
                <MdPersonAddAlt1 />
              </button>
            </div>
            <div className="w-full md:w-1/2 h-full flex items-center justify-center">
              <img
                src={Ebusiness}
                alt="E-Business"
                className="w-full h-auto rounded-lg shadow-lg object-cover max-h-80 md:max-h-96"
              />
            </div>
          </div>
        </div>
      </section>
      {/* E-business */}
      {/* Tractions */}
      <EDirectNumbers />
      {/* Tractions */}
      {/* LastSection */}
      <div className="mt-12 max-w-6xl mx-auto">
        <CommunityStats />
      </div>
      {/* LastSection */}
      {/* TopBusinessCard */}
      <div className="px-2 md:px-12">
        <TopNotchBusinesses />
      </div>
      <div className="md:px-12 px-2">
        <TopBusinessCatCard />
      </div>
      <div className="md:px-12 px-2">
        <FilterBusiness />
      </div>
      <div className="px-6 pt-12">
        <ShortVideosSection />
      </div>
      <div className="px-6 pt-12">
        <RecommendedBusinesses />
      </div>
      <div className="px-6 pt-12">
        <BreakingNewsCarousel />
      </div>

      <div className="px-6 pt-12">
        <TopTopicCarousel />
      </div>
      <div className="px-6 pt-12">
        <TopNotchPeople />
      </div>
      <div className="sm:px-6 pt-12">
        <ProminentPeopleBanner />
      </div>
      <section className="lg:px-12 pt-12">
        <AllEssentialgroupSection />
      </section>
      <section className="lg:px-12 pt-12">
        <EDriversBanner />
      </section>
      <section className="lg:px-6 pt-12">
        <GroupsYouMayLike />
      </section>
      <section className="lg:px-6 py-12">{/* <MagazineBanner /> */}</section>
    </div>
  );
};

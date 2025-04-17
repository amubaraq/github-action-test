// import React, { useState, useEffect } from "react";
// import { Box, Typography, Paper, Grid, Button, styled } from "@mui/material";
// import { useDispatch, useSelector } from "react-redux";
// import { Globe, Palette, MessageCircle, X } from "lucide-react";
// import { Link } from "react-router-dom";
// import { IoArrowForwardCircleOutline } from "react-icons/io5";
// import { MdPersonAddAlt1 } from "react-icons/md";

// export const CommunityStats = () => {
//   // ... (keeping all state and useEffect logic the same)
//   const [totalApproved, setTotalApproved] = useState("");
//   const [totalCaveat, setTotalCaveat] = useState("");
//   const [totalRemembrance, setTotalRemembrance] = useState("");
//   const [totalPublicNotices, setTotalPublicNotices] = useState("");
//   const [totalLostandFound, setTotalLostandFound] = useState("");
//   const [totalObituaries, setTotalObituaries] = useState("");
//   const [totalMissingPersons, setTotalMissingPersons] = useState("");
//   const [totalStolenVehicle, setTotalStolenVehicle] = useState("");
//   const [totalChangeofName, setTotalChangeofName] = useState("");
//   const [totalBirthday, setTotalBirthday] = useState("");
//   const [totalDedication, setTotalDedication] = useState("");
//   const [totalWedding, setTotalWedding] = useState("");

//   useEffect(() => {
//     const fetchAllStats = async () => {
//       const endpoints = [
//         "https://backend.essentialnews.ng/api/posts/published",
//         "https://backend.essentialnews.ng/api/posts/caveat",
//         "https://backend.essentialnews.ng/api/posts/remembrance",
//         "https://backend.essentialnews.ng/api/public-notice",
//         "https://backend.essentialnews.ng/api/posts/lost-and-found",
//         "https://backend.essentialnews.ng/api/posts/obituary",
//         "https://backend.essentialnews.ng/api/posts/missing-or-wanted",
//         "https://backend.essentialnews.ng/api/posts/stolen-vehicle",
//         "https://backend.essentialnews.ng/api/posts/change-of-name",
//         "https://backend.essentialnews.ng/api/posts/birthday",
//         "https://backend.essentialnews.ng/api/posts/dedication",
//         "https://backend.essentialnews.ng/api/posts/wedding",
//       ];

//       try {
//         const results = await Promise.allSettled(
//           endpoints.map(async (endpoint) => {
//             try {
//               const response = await fetch(endpoint, {
//                 credentials: "include",
//                 headers: {
//                   Accept: "application/json",
//                 },
//               });

//               if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//               }

//               const data = await response.json();
//               return data?.data?.pagination?.total || data?.posts?.total || 0;
//             } catch (error) {
//               console.error(`Error fetching ${endpoint}:`, error);
//               return 0;
//             }
//           })
//         );

//         const [
//           totalApproved,
//           totalCaveat,
//           totalRemembrance,
//           totalPublicNotices,
//           totalLostandFound,
//           totalObituaries,
//           totalMissingPersons,
//           totalStolenVehicle,
//           totalChangeofName,
//           totalBirthday,
//           totalDedication,
//           totalWedding,
//         ] = results.map((result) =>
//           result.status === "fulfilled" ? result.value : 0
//         );

//         setTotalApproved(totalApproved);
//         setTotalCaveat(totalCaveat);
//         setTotalRemembrance(totalRemembrance);
//         setTotalPublicNotices(totalPublicNotices);
//         setTotalLostandFound(totalLostandFound);
//         setTotalObituaries(totalObituaries);
//         setTotalMissingPersons(totalMissingPersons);
//         setTotalStolenVehicle(totalStolenVehicle);
//         setTotalChangeofName(totalChangeofName);
//         setTotalBirthday(totalBirthday);
//         setTotalDedication(totalDedication);
//         setTotalWedding(totalWedding);
//       } catch (error) {
//         console.error("Error in fetchAllStats:", error);
//       }
//     };
//     fetchAllStats();
//   }, []);

//   const stats = [
//     {
//       number: totalApproved,
//       label: "Total Posts",
//       bgColor: "bg-blue-50",
//       textColor: "text-blue-600",
//       borderColor: "border-blue-500",
//       Url: "https://essentialnews.ng/news",
//     },
//     {
//       number: totalCaveat,
//       label: "Caveat Posts",
//       bgColor: "bg-green-50",
//       textColor: "text-green",
//       borderColor: "border-green-800",
//       Url: "https://essentialnews.ng/posts/caveat",
//     },
//     {
//       number: totalRemembrance,
//       label: "Remembrance Posts",
//       bgColor: "bg-pink-50",
//       textColor: "text-pink-500",
//       borderColor: "border-pink-500",
//       Url: "https://essentialnews.ng/posts/remembrance",
//     },
//     {
//       number: totalPublicNotices,
//       label: "Public Notices",
//       bgColor: "bg-red-50",
//       textColor: "text-red-600",
//       borderColor: "border-red-400",
//       Url: "https://essentialnews.ng/lists/public-notice",
//     },
//     {
//       number: totalLostandFound,
//       label: "Lost and Found",
//       bgColor: "bg-white",
//       textColor: "text-gray-900",
//       borderColor: "border-gray-600",
//       Url: "https://essentialnews.ng/lists/lost-and-found/posts",
//     },
//     {
//       number: totalObituaries,
//       label: "Obituaries",
//       bgColor: "bg-yellow-50",
//       textColor: "text-yellow-600",
//       borderColor: "border-yellow-600",
//       Url: "https://essentialnews.ng/list/obituary/posts",
//     },
//     {
//       number: totalMissingPersons,
//       label: "Missing/wanted Persons",
//       bgColor: "bg-cyan-50",
//       textColor: "text-cyan-600",
//       borderColor: "border-cyan-600",
//       Url: "https://essentialnews.ng/lists/missing",
//     },
//     {
//       number: totalStolenVehicle,
//       label: "Stolen-vehicle",
//       bgColor: "bg-white",
//       textColor: "text-gray-900",
//       borderColor: "border-gray-400",
//       Url: "https://essentialnews.ng/lists/stolen-vehicle",
//     },
//     {
//       number: totalChangeofName,
//       label: "Change of Name",
//       bgColor: "bg-cyan-50",
//       textColor: "text-cyan-600",
//       borderColor: "border-cyan-600",
//       Url: "https://essentialnews.ng/lists/change-of-name",
//     },
//     {
//       number: totalBirthday,
//       label: "Birthday Posts",
//       bgColor: "bg-purple-500",
//       textColor: "text-green",
//       borderColor: "border-gray-800",
//       Url: "https://essentialnews.ng/posts/birthday/lists",
//     },
//     {
//       number: totalDedication,
//       label: "Dedication Posts",
//       bgColor: "bg-indigo-50",
//       textColor: "text-indigo-600",
//       borderColor: "border-indigo-600",
//       Url: "https://essentialnews.ng/lists/dedication",
//     },
//     {
//       number: totalWedding,
//       label: "Wedding Posts",
//       bgColor: "bg-rose-50",
//       textColor: "text-rose-600",
//       borderColor: "border-rose-600",
//       Url: "https://essentialnews.ng/lists/wedding/posts",
//     },
//   ];

//   return (
//     <div className="max-w-7xl mx-auto sm:px-4 py-8">
//       {/* Header Section */}
//       <div className="bg-[#8B2323] text-white p-8 rounded-none mb-0 flex justify-center">
//         <h1 className="text-3xl font-bold text-start ml-[0rem] mb-4">
//           Why you should list your <br /> business on Essential Nigeria
//         </h1>
//       </div>
//       <div className="text-black px-8 pt-4 rounded-lg mb-8">
//         <p className="text-center">
//           Over 1 million people use Edirect to discover great businesses and
//           services and also find or locate missed or lost contacts and loved
//           ones. Join the fastest growing force of over 7 hundred thousand
//           businesses who have taken advantage of this online platform to reach
//           more customers and service consumers helping them enhance the reach of
//           their business. <br></br>{" "}
//           <span className="font-semibold animate-pulse">
//             EDIRECT CONNECTING THE WORLD OF SERVICE AND PERSONS.
//           </span>
//         </p>
//       </div>
//       {/* ReasonCards */}
//       <EssentialNigeriaBenefits />

//       {/* Statistics Section */}
//       <div className="mb-8">
//         <h2 className="text-2xl font-bold text-center mb-6">
//           Community Post Statistics
//         </h2>
//         <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 mx-4 auto-rows-fr">
//           {stats.map((stat, index) => (
//             <StatsCard
//               key={index}
//               number={stat.number}
//               label={stat.label}
//               bgColor={stat.bgColor}
//               textColor={stat.textColor}
//               borderColor={stat.borderColor}
//               Url={stat.Url}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// const EssentialNigeriaBenefits = () => {
//   // ... (keeping this component unchanged)
//   const features = [
//     {
//       title: "Maximize Your Online Presence",
//       description:
//         "Boost your social media presence, get reviews, and grow your business reputation online.",
//       color: "#ff0000",
//       icon: Globe,
//     },
//     {
//       title: "Create Your Website in Minutes",
//       description:
//         "Build a professional website quickly and easily to showcase your business.",
//       color: "#4e4e4e",
//       icon: Palette,
//     },
//     {
//       title: "Stay Connected with Ease",
//       description:
//         "Engage with customers and stay connected with your audience effortlessly.",
//       color: "#4e4e4e",
//       icon: MessageCircle,
//     },
//   ];

//   return (
//     <div className="pb-20 px-4 sm:px-6 md:px-8">
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {features.map((feature, index) => (
//           <FeatureCard
//             key={index}
//             title={feature.title}
//             description={feature.description}
//             color={feature.color}
//             icon={feature.icon}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// const StatsCard = ({
//   number,
//   label,
//   bgColor = "bg-white",
//   textColor = "text-black",
//   borderColor = "border-gray-200",
//   Url,
// }) => (
//   <Link target="_blank" to={Url}>
//     <div
//       className={`${bgColor} rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center border ${borderColor} transition-all duration-300 hover:shadow-lg h-full`}>
//       <div className={`text-3xl sm:text-4xl font-bold mb-2 ${textColor}`}>
//         {number}
//       </div>
//       <div
//         className={`text-xs sm:text-sm font-medium text-center uppercase mod:lowercase ${textColor}`}>
//         {label}
//       </div>
//     </div>
//   </Link>
// );

// const FeatureCard = ({ title, description, color, icon: Icon }) => (
//   // ... (keeping this component unchanged)
//   <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md h-full transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border border-x-1">
//     <div className="mb-6">
//       <Icon
//         size={36}
//         className={`${color === "#ff0000" ? "text-red-600" : "text-gray-700"}`}
//       />
//     </div>
//     <button
//       className={`w-full py-3 px-6 rounded-lg text-white font-semibold text-sm mb-6 transition-transform duration-300 hover:scale-105 ${
//         color === "#ff0000"
//           ? "bg-red-600 hover:bg-red-700 border-red-700"
//           : "bg-gray-700 hover:bg-gray-800"
//       }`}>
//       {title}
//     </button>
//     <p className="text-gray-600 text-base text-center flex-grow">
//       {description}
//     </p>
//   </div>
// );
import React, { useState, useEffect, memo } from "react";
import { Box, Typography, Paper, Grid, Button, styled } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { Globe, Palette, MessageCircle, X } from "lucide-react";
import { Link } from "react-router-dom";
import { IoArrowForwardCircleOutline } from "react-icons/io5";
import { MdPersonAddAlt1 } from "react-icons/md";

// Memoize StatsCard to prevent unnecessary re-renders
const StatsCard = memo(
  ({
    number,
    label,
    bgColor = "bg-white",
    textColor = "text-black",
    borderColor = "border-gray-200",
    Url,
  }) => (
    <Link target="_blank" to={Url}>
      <div
        className={`${bgColor} rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center border ${borderColor} transition-all duration-300 hover:shadow-lg h-full`}>
        <div className={`text-3xl sm:text-4xl font-bold mb-2 ${textColor}`}>
          {number}
        </div>
        <div
          className={`text-xs sm:text-sm font-medium text-center uppercase mod:lowercase ${textColor}`}>
          {label}
        </div>
      </div>
    </Link>
  )
);

// Memoize FeatureCard
const FeatureCard = memo(({ title, description, color, icon: Icon }) => (
  <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md h-full transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border border-x-1">
    <div className="mb-6">
      <Icon
        size={36}
        className={`${color === "#ff0000" ? "text-red-600" : "text-gray-700"}`}
      />
    </div>
    <button
      className={`w-full py-3 px-6 rounded-lg text-white font-semibold text-sm mb-6 transition-transform duration-300 hover:scale-105 ${
        color === "#ff0000"
          ? "bg-red-600 hover:bg-red-700 border-red-700"
          : "bg-gray-700 hover:bg-gray-800"
      }`}>
      {title}
    </button>
    <p className="text-gray-600 text-base text-center flex-grow">
      {description}
    </p>
  </div>
));

// Memoize EssentialNigeriaBenefits
const EssentialNigeriaBenefits = memo(() => {
  const features = [
    {
      title: "Maximize Your Online Presence",
      description:
        "Boost your social media presence, get reviews, and grow your business reputation online.",
      color: "#ff0000",
      icon: Globe,
    },
    {
      title: "Create Your Website in Minutes",
      description:
        "Build a professional website quickly and easily to showcase your business.",
      color: "#4e4e4e",
      icon: Palette,
    },
    {
      title: "Stay Connected with Ease",
      description:
        "Engage with customers and stay connected with your audience effortlessly.",
      color: "#4e4e4e",
      icon: MessageCircle,
    },
  ];

  return (
    <div className="pb-20 px-4 sm:px-6 md:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
            color={feature.color}
            icon={feature.icon}
          />
        ))}
      </div>
    </div>
  );
});

export const CommunityStats = () => {
  // Consolidate state into a single object
  const [statsData, setStatsData] = useState({
    totalApproved: "",
    totalCaveat: "",
    totalRemembrance: "",
    totalPublicNotices: "",
    totalLostandFound: "",
    totalObituaries: "",
    totalMissingPersons: "",
    totalStolenVehicle: "",
    totalChangeofName: "",
    totalBirthday: "",
    totalDedication: "",
    totalWedding: "",
  });

  useEffect(() => {
    const fetchAllStats = async () => {
      const endpoints = [
        "https://backend.essentialnews.ng/api/posts/published",
        "https://backend.essentialnews.ng/api/posts/caveat",
        "https://backend.essentialnews.ng/api/posts/remembrance",
        "https://backend.essentialnews.ng/api/public-notice",
        "https://backend.essentialnews.ng/api/posts/lost-and-found",
        "https://backend.essentialnews.ng/api/posts/obituary",
        "https://backend.essentialnews.ng/api/posts/missing-or-wanted",
        "https://backend.essentialnews.ng/api/posts/stolen-vehicle",
        "https://backend.essentialnews.ng/api/posts/change-of-name",
        "https://backend.essentialnews.ng/api/posts/birthday",
        "https://backend.essentialnews.ng/api/posts/dedication",
        "https://backend.essentialnews.ng/api/posts/wedding",
      ];

      try {
        const results = await Promise.allSettled(
          endpoints.map(async (endpoint) => {
            try {
              const response = await fetch(endpoint, {
                credentials: "include",
                headers: {
                  Accept: "application/json",
                },
              });

              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }

              const data = await response.json();
              return data?.data?.pagination?.total || data?.posts?.total || 0;
            } catch (error) {
              console.error(`Error fetching ${endpoint}:`, error);
              return 0;
            }
          })
        );

        // Update state once with all values
        setStatsData({
          totalApproved:
            results[0].status === "fulfilled" ? results[0].value : 0,
          totalCaveat: results[1].status === "fulfilled" ? results[1].value : 0,
          totalRemembrance:
            results[2].status === "fulfilled" ? results[2].value : 0,
          totalPublicNotices:
            results[3].status === "fulfilled" ? results[3].value : 0,
          totalLostandFound:
            results[4].status === "fulfilled" ? results[4].value : 0,
          totalObituaries:
            results[5].status === "fulfilled" ? results[5].value : 0,
          totalMissingPersons:
            results[6].status === "fulfilled" ? results[6].value : 0,
          totalStolenVehicle:
            results[7].status === "fulfilled" ? results[7].value : 0,
          totalChangeofName:
            results[8].status === "fulfilled" ? results[8].value : 0,
          totalBirthday:
            results[9].status === "fulfilled" ? results[9].value : 0,
          totalDedication:
            results[10].status === "fulfilled" ? results[10].value : 0,
          totalWedding:
            results[11].status === "fulfilled" ? results[11].value : 0,
        });
      } catch (error) {
        console.error("Error in fetchAllStats:", error);
      }
    };
    fetchAllStats();
  }, []);

  // Memoize the stats array to prevent recreation on every render
  const stats = React.useMemo(
    () => [
      {
        number: statsData.totalApproved,
        label: "Total Posts",
        bgColor: "bg-blue-50",
        textColor: "text-blue-600",
        borderColor: "border-blue-500",
        Url: "https://essentialnews.ng/news",
      },
      {
        number: statsData.totalCaveat,
        label: "Caveat Posts",
        bgColor: "bg-green-50",
        textColor: "text-green",
        borderColor: "border-green-800",
        Url: "https://essentialnews.ng/posts/caveat",
      },
      {
        number: statsData.totalRemembrance,
        label: "Remembrance Posts",
        bgColor: "bg-pink-50",
        textColor: "text-pink-500",
        borderColor: "border-pink-500",
        Url: "https://essentialnews.ng/posts/remembrance",
      },
      {
        number: statsData.totalPublicNotices,
        label: "Public Notices",
        bgColor: "bg-red-50",
        textColor: "text-red-600",
        borderColor: "border-red-400",
        Url: "https://essentialnews.ng/lists/public-notice",
      },
      {
        number: statsData.totalLostandFound,
        label: "Lost and Found",
        bgColor: "bg-white",
        textColor: "text-gray-900",
        borderColor: "border-gray-600",
        Url: "https://essentialnews.ng/lists/lost-and-found/posts",
      },
      {
        number: statsData.totalObituaries,
        label: "Obituaries",
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-600",
        borderColor: "border-yellow-600",
        Url: "https://essentialnews.ng/list/obituary/posts",
      },
      {
        number: statsData.totalMissingPersons,
        label: "Missing/wanted Persons",
        bgColor: "bg-cyan-50",
        textColor: "text-cyan-600",
        borderColor: "border-cyan-600",
        Url: "https://essentialnews.ng/lists/missing",
      },
      {
        number: statsData.totalStolenVehicle,
        label: "Stolen-vehicle",
        bgColor: "bg-white",
        textColor: "text-gray-900",
        borderColor: "border-gray-400",
        Url: "https://essentialnews.ng/lists/stolen-vehicle",
      },
      {
        number: statsData.totalChangeofName,
        label: "Change of Name",
        bgColor: "bg-cyan-50",
        textColor: "text-cyan-600",
        borderColor: "border-cyan-600",
        Url: "https://essentialnews.ng/lists/change-of-name",
      },
      {
        number: statsData.totalBirthday,
        label: "Birthday Posts",
        bgColor: "bg-purple-500",
        textColor: "text-green",
        borderColor: "border-gray-800",
        Url: "https://essentialnews.ng/posts/birthday/lists",
      },
      {
        number: statsData.totalDedication,
        label: "Dedication Posts",
        bgColor: "bg-indigo-50",
        textColor: "text-indigo-600",
        borderColor: "border-indigo-600",
        Url: "https://essentialnews.ng/lists/dedication",
      },
      {
        number: statsData.totalWedding,
        label: "Wedding Posts",
        bgColor: "bg-rose-50",
        textColor: "text-rose-600",
        borderColor: "border-rose-600",
        Url: "https://essentialnews.ng/lists/wedding/posts",
      },
    ],
    [statsData]
  );

  return (
    <div className="max-w-7xl mx-auto sm:px-4 py-8">
      {/* Header Section */}
      <div className="bg-[#8B2323] text-white p-8 rounded-none mb-0 flex justify-center">
        <h1 className="text-3xl font-bold text-start ml-[0rem] mb-4">
          Why you should list your <br /> business on Essential Nigeria
        </h1>
      </div>
      <div className="text-black px-8 pt-4 rounded-lg mb-8">
        <p className="text-center">
          Over 1 million people use Edirect to discover great businesses and
          services and also find or locate missed or lost contacts and loved
          ones. Join the fastest growing force of over 7 hundred thousand
          businesses who have taken advantage of this online platform to reach
          more customers and service consumers helping them enhance the reach of
          their business. <br />
          <span className="font-semibold animate-pulse">
            EDIRECT CONNECTING THE WORLD OF SERVICE AND PERSONS.
          </span>
        </p>
      </div>
      {/* ReasonCards */}
      <EssentialNigeriaBenefits />

      {/* Statistics Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          Community Post Statistics
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 mx-4 auto-rows-fr">
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              number={stat.number}
              label={stat.label}
              bgColor={stat.bgColor}
              textColor={stat.textColor}
              borderColor={stat.borderColor}
              Url={stat.Url}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

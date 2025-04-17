// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Card } from "@mui/material";
// import { Search, X } from "lucide-react";
// import heroImage from "../../assets/images/heroImage.jpg";

// export const SearchBar = ({
//   initialSearchOption = "Business",
//   initialQuery = "",
// }) => {
//   const [searchOption, setSearchOption] = useState(initialSearchOption);
//   const [searchQuery, setSearchQuery] = useState(initialQuery);
//   const navigate = useNavigate();

//   const handleSearch = () => {
//     if (!searchQuery.trim()) return;
//     const searchPath =
//       searchOption === "People" ? "/searchPage/people" : "/searchPage";
//     navigate(`${searchPath}?query=${encodeURIComponent(searchQuery)}`);
//   };

//   return (
//     <Card className="flex flex-col sm:flex-row items-center overflow-hidden">
//       <select
//         value={searchOption}
//         onChange={(e) => setSearchOption(e.target.value)}
//         className="border-b sm:border-r border-gray-200 px-4 py-3 text-gray-600 focus:outline-none w-full sm:w-auto bg-white">
//         <option value="Business">Business</option>
//         <option value="People">People</option>
//       </select>
//       <div className="flex-1 relative w-full">
//         <input
//           type="text"
//           placeholder="Search for people and businesses..."
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//           className="w-full px-4 py-3 text-gray-600 focus:outline-none"
//         />
//         {searchQuery && (
//           <button
//             onClick={() => setSearchQuery("")}
//             className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
//             <X size={20} />
//           </button>
//         )}
//       </div>
//       <button
//         onClick={handleSearch}
//         className="bg-red-600 text-white px-6 py-3 hover:bg-red-700 w-full sm:w-auto flex items-center justify-center gap-2 mid:rounded-lg">
//         <Search size={20} />
//         Search
//       </button>
//     </Card>
//   );
// };

// const HeroSection = () => {
//   const [searchOption, setSearchOption] = useState("Business");
//   const [searchQuery, setSearchQuery] = useState("");
//   const navigate = useNavigate();

//   const handleSearch = () => {
//     if (!searchQuery.trim()) return;

//     // Navigate to /searchPage with search parameters
//     navigate(
//       `/searchPage?query=${encodeURIComponent(searchQuery)}&type=${searchOption}`
//     );
//   };

//   return (
//     <>
//       <div className="relative h-[500px] overflow-hidden">
//         {/* Background Image */}
//         <img
//           src={heroImage}
//           alt="Hero Background"
//           className="w-full h-full object-cover"
//         />

//         {/* Overlay Content */}
//         <div className="absolute inset-0 bg-black/60 flex items-center justify-center px-4">
//           <div className="text-center text-white max-w-2xl">
//             <div className="space-y-4">
//               <h1 className="text-4xl md:text-5xl font-bold animate-fade-in">
//                 Find Out About People, Businesses, and Places in Nigeria
//               </h1>
//               <p className="text-lg md:text-xl">
//                 Explore Nigeria's Largest Business and People Directory
//               </p>
//               <p className="text-lg md:text-xl">
//                 Search for Businesses, Jobs, Hotels, and More
//               </p>
//             </div>
//             <div className="mt-8">
//               <SearchBar />
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default HeroSection;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@mui/material";
import { Search, X } from "lucide-react";
import heroImage from "../../assets/images/heroImage.jpg";

export const SearchBar = ({ initialQuery = "" }) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    navigate(`/searchPage?query=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <Card className="flex flex-col sm:flex-row items-center overflow-hidden rounded-lg shadow-md">
      <div className="flex-1 relative w-full">
        <input
          type="text"
          placeholder="Search for people, businesses, and more..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="w-full px-4 py-3 text-gray-600 focus:outline-none"
          aria-label="Search for people and businesses"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label="Clear search query">
            <X size={20} />
          </button>
        )}
      </div>
      <button
        onClick={handleSearch}
        className="bg-red-600 text-white px-6 py-3 hover:bg-red-700 w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg sm:rounded-l-none">
        <Search size={20} />
        Search
      </button>
    </Card>
  );
};

const HeroSection = () => {
  return (
    <div className="relative h-[500px] overflow-hidden">
      {/* Background Image */}
      <img
        src={heroImage}
        alt="Hero Background"
        className="w-full h-full object-cover"
      />

      {/* Overlay Content */}
      <div className="absolute inset-0 bg-black/60 flex items-center justify-center px-4">
        <div className="text-center text-white max-w-2xl">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold animate-fade-in">
              Find Out About People, Businesses, and Places in Nigeria
            </h1>
            <p className="text-lg md:text-xl">
              Explore Nigeria's Largest Business and People Directory
            </p>
            <p className="text-lg md:text-xl">
              Search for Businesses, Jobs, Hotels, and More
            </p>
          </div>
          <div className="mt-8">
            <SearchBar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

// import React, { useState, useEffect, useMemo } from "react";
// import { Link } from "react-router-dom";
// import { Search, MapPin, Briefcase, Loader, User } from "lucide-react";
// import backendURL from "../config";

// const ProminentPeopleList = () => {
//   const [people, setPeople] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedNationality, setSelectedNationality] =
//     useState("All Nationalities");
//   const [selectedOccupation, setSelectedOccupation] =
//     useState("All Occupations");
//   const [sortBy, setSortBy] = useState("name");
//   const [sortOrder, setSortOrder] = useState("asc");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(8);

//   useEffect(() => {
//     const fetchProminentPeople = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(`${backendURL}/api/prominent-people`);
//         if (!response.ok)
//           throw new Error(`HTTP error! status: ${response.status}`);
//         const data = await response.json();
//         console.log(data);
//         setPeople(data.data);
//       } catch (err) {
//         setError(err.message || "Failed to fetch prominent people");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProminentPeople();
//   }, []);

//   // Memoized unique values for filters
//   const nationalities = useMemo(() => {
//     const unique = [
//       ...new Set(people.map((p) => p.nationality).filter(Boolean)),
//     ];
//     return ["All Nationalities", ...unique];
//   }, [people]);

//   const occupations = useMemo(() => {
//     const unique = [
//       ...new Set(people.map((p) => p.occupation).filter(Boolean)),
//     ];
//     return ["All Occupations", ...unique];
//   }, [people]);

//   // Memoized filtered and sorted people
//   const filteredPeople = useMemo(() => {
//     return people
//       .filter((person) => {
//         const matchesSearch =
//           person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           (person.occupation || "")
//             .toLowerCase()
//             .includes(searchTerm.toLowerCase()) ||
//           (person.nationality || "")
//             .toLowerCase()
//             .includes(searchTerm.toLowerCase());
//         const matchesNationality =
//           selectedNationality === "All Nationalities" ||
//           person.nationality === selectedNationality;
//         const matchesOccupation =
//           selectedOccupation === "All Occupations" ||
//           person.occupation === selectedOccupation;
//         return matchesSearch && matchesNationality && matchesOccupation;
//       })
//       .sort((a, b) => {
//         const multiplier = sortOrder === "asc" ? 1 : -1;
//         switch (sortBy) {
//           case "name":
//             return a.name.localeCompare(b.name) * multiplier;
//           case "birth":
//             return (
//               (new Date(a.birth_date || 0) - new Date(b.birth_date || 0)) *
//               multiplier
//             );
//           default:
//             return 0;
//         }
//       });
//   }, [
//     people,
//     searchTerm,
//     selectedNationality,
//     selectedOccupation,
//     sortBy,
//     sortOrder,
//   ]);

//   // Pagination
//   const totalPages = Math.ceil(filteredPeople.length / itemsPerPage);
//   const paginatedPeople = filteredPeople.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const getPageNumbers = () => {
//     const pageNumbers = [];
//     const maxPagesToShow = 5;
//     let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
//     let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

//     if (endPage - startPage + 1 < maxPagesToShow) {
//       startPage = Math.max(1, endPage - maxPagesToShow + 1);
//     }

//     for (let i = startPage; i <= endPage; i++) {
//       pageNumbers.push(i);
//     }
//     return pageNumbers;
//   };

//   const handlePageChange = (page) => {
//     if (page < 1 || page > totalPages) return;
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   useEffect(() => {
//     setCurrentPage(1); // Reset to page 1 when filters change
//   }, [searchTerm, selectedNationality, selectedOccupation, sortBy, sortOrder]);

//   // Enhanced Pagination Component
//   const PaginationControls = () => (
//     <div className="flex justify-center items-center space-x-2 mt-8 flex-wrap">
//       <button
//         onClick={() => handlePageChange(1)}
//         disabled={currentPage === 1}
//         className="px-3 py-1 rounded-md text-sm bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors">
//         First
//       </button>

//       <button
//         onClick={() => handlePageChange(currentPage - 1)}
//         disabled={currentPage === 1}
//         className="px-3 py-1 rounded-md text-sm bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors">
//         Previous
//       </button>

//       <div className="flex items-center space-x-1">
//         {getPageNumbers().map((pageNum) => (
//           <button
//             key={pageNum}
//             onClick={() => handlePageChange(pageNum)}
//             className={`px-3 py-1 rounded-md text-sm transition-colors ${
//               currentPage === pageNum
//                 ? "bg-[#00c469] text-white"
//                 : "bg-white border border-gray-300 hover:bg-gray-50"
//             }`}>
//             {pageNum}
//           </button>
//         ))}
//       </div>

//       <button
//         onClick={() => handlePageChange(currentPage + 1)}
//         disabled={currentPage === totalPages}
//         className="px-3 py-1 rounded-md text-sm bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors">
//         Next
//       </button>

//       <button
//         onClick={() => handlePageChange(totalPages)}
//         disabled={currentPage === totalPages}
//         className="px-3 py-1 rounded-md text-sm bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors">
//         Last
//       </button>
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Loader className="animate-spin h-12 w-12 text-blue-500" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center">
//         {error}
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* Hero Section */}
//       <div className="relative h-[50vh] bg-gradient-to-b from-gray-800 to-gray-600 text-white flex items-center justify-center">
//         <div className="absolute inset-0 bg-black/40" />
//         <div className="relative z-10 text-center px-4">
//           <h1 className="text-3xl md:text-4xl font-bold mb-4">
//             Prominent People Directory
//           </h1>
//           <p className="text-lg md:text-xl max-w-2xl mx-auto">
//             Discover notable individuals recognized for their achievements and
//             contributions.
//           </p>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Filters and Search */}
//         <div className="mb-8 space-y-4">
//           <div className="relative max-w-xl">
//             <input
//               type="text"
//               placeholder="Search by name, occupation, or nationality..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <Search
//               className="absolute left-3 top-2.5 text-gray-400"
//               size={18}
//             />
//           </div>

//           <div className="flex flex-wrap gap-4 items-center">
//             <div className="relative w-full sm:w-48">
//               <select
//                 value={selectedNationality}
//                 onChange={(e) => setSelectedNationality(e.target.value)}
//                 className="appearance-none w-full bg-white border rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500">
//                 {nationalities.map((nat) => (
//                   <option key={nat} value={nat}>
//                     {nat}
//                   </option>
//                 ))}
//               </select>
//               <MapPin
//                 className="absolute right-3 top-2.5 text-gray-400"
//                 size={16}
//               />
//             </div>

//             <div className="relative w-full sm:w-48">
//               <select
//                 value={selectedOccupation}
//                 onChange={(e) => setSelectedOccupation(e.target.value)}
//                 className="appearance-none w-full bg-white border rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500">
//                 {occupations.map((occ) => (
//                   <option key={occ} value={occ}>
//                     {occ}
//                   </option>
//                 ))}
//               </select>
//               <Briefcase
//                 className="absolute right-3 top-2.5 text-gray-400"
//                 size={16}
//               />
//             </div>

//             <div className="flex items-center space-x-2 ml-auto">
//               <label className="text-sm text-gray-600">Sort by:</label>
//               <select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//                 className="bg-white border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
//                 <option value="name">Name</option>
//                 <option value="birth">Birth Year</option>
//               </select>
//               <button
//                 onClick={() =>
//                   setSortOrder(sortOrder === "asc" ? "desc" : "asc")
//                 }
//                 className="p-2 hover:bg-gray-100 rounded-lg">
//                 {sortOrder === "asc" ? "↑" : "↓"}
//               </button>
//             </div>
//           </div>

//           <div className="text-sm text-gray-600">
//             Showing {filteredPeople.length} prominent individuals
//           </div>
//         </div>

//         {/* People Grid */}
//         {filteredPeople.length === 0 ? (
//           <div className="text-center py-12 bg-gray-50 rounded-lg">
//             <h3 className="text-lg font-medium text-gray-900 mb-2">
//               No prominent people found
//             </h3>
//             <p className="text-gray-500">
//               Try adjusting your filters or search terms.
//             </p>
//           </div>
//         ) : (
//           <>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//               {paginatedPeople.map((person) => (
//                 <Link
//                   key={person.slug}
//                   to={`/Prominent-person/${person.slug}`}
//                   className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
//                   <div className="h-48 bg-gray-100 overflow-hidden relative">
//                     {person.image_url ? (
//                       <img
//                         src={person.image_url}
//                         alt={person.name}
//                         className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
//                         loading="lazy"
//                         onError={(e) => {
//                           e.target.style.display = "none";
//                           e.target.nextElementSibling.style.display = "flex";
//                         }}
//                       />
//                     ) : null}
//                     <div
//                       className={`absolute inset-0 flex items-center justify-center bg-gray-200 ${person.image_url ? "hidden" : "flex"}`}>
//                       <User className="h-16 w-16 text-gray-400" />
//                     </div>
//                   </div>
//                   <div className="p-5">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
//                       {person.name}
//                     </h3>
//                     <p className="text-gray-600 text-sm mb-2 font-semibold">
//                       {person.occupation || "N/A"}
//                     </p>
//                     <div className="flex justify-between text-sm text-gray-500 mb-3">
//                       <span className="inline-flex items-center">
//                         <MapPin className="mr-1 h-3 w-3" />
//                         {person.nationality || "N/A"}
//                       </span>
//                       <span>
//                         {person.birth_date &&
//                           new Date(person.birth_date).getFullYear()}
//                         {person.death_date &&
//                           ` - ${new Date(person.death_date).getFullYear()}`}
//                       </span>
//                     </div>
//                     {person.biography && (
//                       <p className="text-gray-600 text-sm line-clamp-3">
//                         {person.biography.replace(/<[^>]+>/g, "")}
//                       </p>
//                     )}
//                   </div>
//                 </Link>
//               ))}
//             </div>
//             {/* Pagination */}
//             {totalPages > 1 && <PaginationControls />}
//           </>
//         )}
//       </div>
//     </>
//   );
// };

// export default ProminentPeopleList;
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Briefcase, Loader, User } from "lucide-react";
import backendURL from "../config";
import prominentImage from "../assets/images/FamousPeople-2.png";

const ProminentPeopleList = () => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNationality, setSelectedNationality] =
    useState("All Nationalities");
  const [selectedOccupation, setSelectedOccupation] =
    useState("All Occupations");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  useEffect(() => {
    const fetchProminentPeople = async () => {
      try {
        setLoading(true);
        // Fetch data with a status filter (if the backend supports it)
        const response = await fetch(
          `${backendURL}/api/prominent-people?status=approved`
        );
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log("API Response:", data);

        // Client-side filter to ensure only approved people are included
        const approvedPeople = data.data.filter(
          (person) => person.status === "approved"
        );
        setPeople(approvedPeople);
      } catch (err) {
        setError(err.message || "Failed to fetch prominent people");
      } finally {
        setLoading(false);
      }
    };

    fetchProminentPeople();
  }, []);

  // Memoized unique values for filters
  const nationalities = useMemo(() => {
    const unique = [
      ...new Set(people.map((p) => p.nationality).filter(Boolean)),
    ];
    return ["All Nationalities", ...unique];
  }, [people]);

  const occupations = useMemo(() => {
    const unique = [
      ...new Set(people.map((p) => p.occupation).filter(Boolean)),
    ];
    return ["All Occupations", ...unique];
  }, [people]);

  // Memoized filtered and sorted people
  const filteredPeople = useMemo(() => {
    return people
      .filter((person) => {
        const matchesSearch =
          person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (person.occupation || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (person.nationality || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesNationality =
          selectedNationality === "All Nationalities" ||
          person.nationality === selectedNationality;
        const matchesOccupation =
          selectedOccupation === "All Occupations" ||
          person.occupation === selectedOccupation;
        return matchesSearch && matchesNationality && matchesOccupation;
      })
      .sort((a, b) => {
        const multiplier = sortOrder === "asc" ? 1 : -1;
        switch (sortBy) {
          case "name":
            return a.name.localeCompare(b.name) * multiplier;
          case "birth":
            return (
              (new Date(a.birth_date || 0) - new Date(b.birth_date || 0)) *
              multiplier
            );
          default:
            return 0;
        }
      });
  }, [
    people,
    searchTerm,
    selectedNationality,
    selectedOccupation,
    sortBy,
    sortOrder,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredPeople.length / itemsPerPage);
  const paginatedPeople = filteredPeople.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 when filters change
  }, [searchTerm, selectedNationality, selectedOccupation, sortBy, sortOrder]);

  // Enhanced Pagination Component
  const PaginationControls = () => (
    <div className="flex justify-center items-center space-x-2 mt-8 flex-wrap">
      <button
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md text-sm bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors">
        First
      </button>

      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md text-sm bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors">
        Previous
      </button>

      <div className="flex items-center space-x-1">
        {getPageNumbers().map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              currentPage === pageNum
                ? "bg-[#00c469] text-white"
                : "bg-white border border-gray-300 hover:bg-gray-50"
            }`}>
            {pageNum}
          </button>
        ))}
      </div>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md text-sm bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors">
        Next
      </button>

      <button
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md text-sm bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors">
        Last
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin h-12 w-12 text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center">
        {error}
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}

      {/* Enhanced Hero Section */}
      <div className="relative h-[60vh] bg-gradient-to-b from-gray-900 to-gray-700 flex items-center justify-center text-center px-4 sm:px-6 lg:px-8">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${prominentImage})` }}
        />
        <div className="absolute inset-0 bg-black/50" /> {/* Dark overlay */}
        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="relative h-[50vh] text-white flex items-center justify-center">
            <div className="absolute inset-0 " />
            <div className="relative z-10 text-center px-4">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Prominent People Directory
              </h1>
              <p className="text-lg md:text-xl max-w-2xl mx-auto">
                Discover notable individuals recognized for their achievements
                and contributions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-xl">
            <input
              type="text"
              placeholder="Search by name, occupation, or nationality..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={18}
            />
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative w-full sm:w-48">
              <select
                value={selectedNationality}
                onChange={(e) => setSelectedNationality(e.target.value)}
                className="appearance-none w-full bg-white border rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500">
                {nationalities.map((nat) => (
                  <option key={nat} value={nat}>
                    {nat}
                  </option>
                ))}
              </select>
              <MapPin
                className="absolute right-3 top-2.5 text-gray-400"
                size={16}
              />
            </div>

            <div className="relative w-full sm:w-48">
              <select
                value={selectedOccupation}
                onChange={(e) => setSelectedOccupation(e.target.value)}
                className="appearance-none w-full bg-white border rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500">
                {occupations.map((occ) => (
                  <option key={occ} value={occ}>
                    {occ}
                  </option>
                ))}
              </select>
              <Briefcase
                className="absolute right-3 top-2.5 text-gray-400"
                size={16}
              />
            </div>

            <div className="flex items-center space-x-2 ml-auto">
              <label className="text-sm text-gray-600">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="name">Name</option>
                <option value="birth">Birth Year</option>
              </select>
              <button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="p-2 hover:bg-gray-100 rounded-lg">
                {sortOrder === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Showing {filteredPeople.length} prominent individuals
          </div>
        </div>

        {/* People Grid */}
        {filteredPeople.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No prominent people found
            </h3>
            <p className="text-gray-500">
              Try adjusting your filters or search terms.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {paginatedPeople.map((person) => (
                <Link
                  key={person.slug}
                  to={`/Prominent-person/${person.slug}`}
                  className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="h-48 bg-gray-100 overflow-hidden relative">
                    {person.image_url ? (
                      <img
                        src={person.image_url}
                        alt={person.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextElementSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className={`absolute inset-0 flex items-center justify-center bg-gray-200 ${
                        person.image_url ? "hidden" : "flex"
                      }`}>
                      <User className="h-16 w-16 text-gray-400" />
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                      {person.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2 font-semibold">
                      {person.occupation || "N/A"}
                    </p>
                    <div className="flex justify-between text-sm text-gray-500 mb-3">
                      <span className="inline-flex items-center">
                        <MapPin className="mr-1 h-3 w-3" />
                        {person.nationality || "N/A"}
                      </span>
                      <span>
                        {person.birth_date &&
                          new Date(person.birth_date).getFullYear()}
                        {person.death_date &&
                          ` - ${new Date(person.death_date).getFullYear()}`}
                      </span>
                    </div>
                    {person.biography && (
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {person.biography.replace(/<[^>]+>/g, "")}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
            {/* Pagination */}
            {totalPages > 1 && <PaginationControls />}
          </>
        )}
      </div>
    </>
  );
};

export default ProminentPeopleList;

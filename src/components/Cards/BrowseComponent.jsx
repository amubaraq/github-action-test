// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import { Search, MapPin, Grid } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { SearchBar } from "../../pages/pagesections/homeHero";
// import backendURL from "../../config";

// // Utility to format category slugs for display
// const formatCategoryName = (slug) => {
//   if (!slug || typeof slug !== "string") return "Uncategorized";
//   return slug
//     .split("-")
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
//     .join(" ");
// };

// // Memoized tag components
// const LocationTag = React.memo(({ name, count, onClick }) => (
//   <div
//     className="inline-block bg-white rounded-full px-3 py-1 text-xs mr-2 mb-2 hover:bg-blue-50 transition-colors cursor-pointer border"
//     onClick={onClick}>
//     {name} ({count})
//   </div>
// ));

// const CategoryTag = React.memo(({ name, count, onClick }) => (
//   <div
//     className="inline-block bg-white rounded-full px-3 py-1 text-xs mr-2 mb-2 hover:bg-gray-100 transition-colors cursor-pointer border"
//     onClick={onClick}>
//     {name} ({count})
//   </div>
// ));

// export const FilterBusiness = React.memo(() => {
//   const [visibleLocations, setVisibleLocations] = useState(6);
//   const [visibleCategories, setVisibleCategories] = useState(6);
//   const [locations, setLocations] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const MAX_ITEMS = 30;
//   const ITEMS_PER_BATCH = 6;

//   const fetchData = useCallback(async () => {
//     try {
//       // Fetch business data to derive both locations and categories
//       const profileResponse = await fetch(`${backendURL}/api/lists/business`, {
//         headers: { Accept: "application/json" },
//       });
//       console.log(profileResponse, "profileResponse...");
//       if (!profileResponse.ok) {
//         throw new Error(`Profile fetch error: ${profileResponse.status}`);
//       }
//       const profileData = await profileResponse.json();
//       console.log(profileData.data, "profileData");

//       if (
//         profileData.status !== "success" ||
//         !Array.isArray(profileData.data)
//       ) {
//         throw new Error("Invalid data format or failed to fetch business data");
//       }

//       // Process locations (using state field)
//       const locationMap = new Map();
//       profileData.data.forEach((contact) => {
//         const state = contact.state || "Not Available";
//         if (state) {
//           const count = locationMap.get(state) || 0;
//           locationMap.set(state, count + 1);
//         }
//       });

//       const locationArray = Array.from(locationMap.entries())
//         .map(([name, count]) => ({ name, count }))
//         .sort((a, b) => b.count - a.count)
//         .slice(0, MAX_ITEMS);
//       setLocations(locationArray);

//       // Process categories (using category_slug field)
//       const categoryMap = new Map();
//       profileData.data.forEach((contact) => {
//         const categorySlug = contact.category_slug || "uncategorized";
//         const categoryName = formatCategoryName(categorySlug);
//         const key = categorySlug; // Use the raw slug as the key for filtering
//         const count = categoryMap.get(key) || 0;
//         categoryMap.set(key, { name: categoryName, count: count + 1 });
//       });

//       const categoryArray = Array.from(categoryMap.entries())
//         .map(([slug, { name, count }]) => ({
//           name,
//           slug, // Store the raw slug for navigation
//           count,
//         }))
//         .filter((cat) => cat.count > 0)
//         .sort((a, b) => b.count - a.count)
//         .slice(0, MAX_ITEMS);
//       setCategories(categoryArray);

//       setLoading(false);
//     } catch (err) {
//       setError(err.message);
//       setLoading(false);
//       console.error("Error fetching data:", err);
//     }
//   }, []);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   const handleLocationClick = useCallback(
//     (locationItem) => {
//       const searchParams = new URLSearchParams();
//       searchParams.set("location", locationItem.name);
//       searchParams.set("category", "All");
//       searchParams.set("query", "");
//       navigate(`/searchPage?${searchParams.toString()}`);
//     },
//     [navigate]
//   );

//   const handleCategoryClick = useCallback(
//     (categoryItem) => {
//       const searchParams = new URLSearchParams();
//       searchParams.set("category", categoryItem.slug); // Use the raw slug for filtering
//       searchParams.set("location", "All");
//       searchParams.set("query", "");
//       navigate(`/searchPage?${searchParams.toString()}`);
//     },
//     [navigate]
//   );

//   const handleShowMoreLocations = useCallback(() => {
//     setVisibleLocations((prev) => Math.min(prev + ITEMS_PER_BATCH, MAX_ITEMS));
//   }, []);

//   const handleShowMoreCategories = useCallback(() => {
//     setVisibleCategories((prev) => Math.min(prev + ITEMS_PER_BATCH, MAX_ITEMS));
//   }, []);

//   const handleShowLessLocations = useCallback(() => {
//     setVisibleLocations(ITEMS_PER_BATCH);
//   }, []);

//   const handleShowLessCategories = useCallback(() => {
//     setVisibleCategories(ITEMS_PER_BATCH);
//   }, []);

//   const visibleLocationItems = useMemo(
//     () => locations.slice(0, visibleLocations),
//     [locations, visibleLocations]
//   );
//   const visibleCategoryItems = useMemo(
//     () => categories.slice(0, visibleCategories),
//     [categories, visibleCategories]
//   );

//   if (loading) {
//     return (
//       <div className="max-w-6xl mx-auto px-4 py-8 text-center text-gray-600 animate-pulse">
//         Loading filters...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="max-w-6xl mx-auto px-4 py-8 text-center text-red-600">
//         Error: {error}
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-8">
//       <span className="mx-3">
//         <SearchBar />
//       </span>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//         <div className="bg-blue-500 rounded-lg p-4">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-semibold text-white flex items-center gap-2">
//               <MapPin size={18} />
//               Browse by Location
//             </h2>
//           </div>
//           <div className="mb-4">
//             {visibleLocationItems.map((location) => (
//               <LocationTag
//                 key={location.name}
//                 name={location.name}
//                 count={location.count}
//                 onClick={() => handleLocationClick(location)}
//               />
//             ))}
//           </div>
//           {locations.length > visibleLocations && (
//             <button
//               className="text-white text-sm hover:rotate-2 border hover:border-2 transition-all ease-in-out duration-300 p-1 rounded-xl mr-2"
//               onClick={handleShowMoreLocations}>
//               Show More
//             </button>
//           )}
//           {visibleLocations > ITEMS_PER_BATCH && (
//             <button
//               className="text-white text-sm hover:rotate-2 border hover:border-2 transition-all ease-in-out duration-300 p-1 rounded-xl"
//               onClick={handleShowLessLocations}>
//               Show Less
//             </button>
//           )}
//         </div>
//         <div className="bg-gray-600 rounded-lg p-4">
//           <div className="flex items-center justify-between mb-4">
//             <h2 className="text-lg font-semibold text-white flex items-center gap-2">
//               <Grid size={18} />
//               Browse By Categories
//             </h2>
//           </div>
//           <div className="mb-4">
//             {visibleCategoryItems.map((category) => (
//               <CategoryTag
//                 key={category.slug}
//                 name={category.name}
//                 count={category.count}
//                 onClick={() => handleCategoryClick(category)}
//               />
//             ))}
//           </div>
//           {categories.length > visibleCategories && (
//             <button
//               className="text-white text-sm hover:rotate-2 border hover:border-2 transition-all ease-in-out duration-300 p-1 rounded-xl mr-2"
//               onClick={handleShowMoreCategories}>
//               Show More
//             </button>
//           )}
//           {visibleCategories > ITEMS_PER_BATCH && (
//             <button
//               className="text-white text-sm hover:rotate-2 border hover:border-2 transition-all ease-in-out duration-300 p-1 rounded-xl"
//               onClick={handleShowLessCategories}>
//               Show Less
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// });

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Search, MapPin, Grid } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SearchBar } from "../../pages/pagesections/homeHero";
import backendURL from "../../config";

// Utility to format category slugs for display
const formatCategoryName = (slug) => {
  if (!slug || typeof slug !== "string") return "Uncategorized";
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// Memoized tag components
const LocationTag = React.memo(({ name, count, onClick }) => (
  <div
    className="inline-block bg-white rounded-full px-3 py-1 text-xs mr-2 mb-2 hover:bg-blue-50 transition-colors cursor-pointer border"
    onClick={onClick}>
    {name} ({count})
  </div>
));

const CategoryTag = React.memo(({ name, count, onClick }) => (
  <div
    className="inline-block bg-white rounded-full px-3 py-1 text-xs mr-2 mb-2 hover:bg-gray-100 transition-colors cursor-pointer border"
    onClick={onClick}>
    {name} ({count})
  </div>
));

export const FilterBusiness = React.memo(() => {
  const [visibleLocations, setVisibleLocations] = useState(6);
  const [visibleCategories, setVisibleCategories] = useState(6);
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const MAX_ITEMS = 30;
  const ITEMS_PER_BATCH = 6;

  // const fetchData = useCallback(async () => {
  //   try {
  //     // Fetch business data to derive both locations and categories
  //     const profileResponse = await fetch(`${backendURL}/api/lists/business`, {
  //       headers: { Accept: "application/json" },
  //     });

  //     if (!profileResponse.ok) {
  //       throw new Error(`Profile fetch error: ${profileResponse.status}`);
  //     }

  //     const profileData = await profileResponse.json();
  //     const allProfileData = profileData.data;

  //     if (profileData.status !== "success" || !Array.isArray(allProfileData)) {
  //       throw new Error("Invalid data format or failed to fetch business data");
  //     }

  //     // Process locations (using state field from business object)
  //     const locationMap = new Map();
  //     allProfileData.forEach((business) => {
  //       // Check both business.state and business.details.state
  //       const state =
  //         business.state || business.details?.state || "Not Specified";
  //       if (state) {
  //         const count = locationMap.get(state) || 0;
  //         locationMap.set(state, count + 1);
  //       }
  //     });

  //     const locationArray = Array.from(locationMap.entries())
  //       .map(([name, count]) => ({ name, count }))
  //       .sort((a, b) => b.count - a.count)
  //       .slice(0, MAX_ITEMS);
  //     setLocations(locationArray);

  //     // Process categories (using category_slug field from business object)
  //     const categoryMap = new Map();
  //     allProfileData.forEach((business) => {
  //       // Check both business.category_slug and business.details.category_slug
  //       const categorySlug =
  //         business.category_slug ||
  //         business.details?.category_slug ||
  //         "uncategorized";
  //       const categoryName = formatCategoryName(categorySlug);
  //       const key = categorySlug; // Use the raw slug as the key for filtering
  //       const count = categoryMap.get(key) || 0;
  //       categoryMap.set(key, { name: categoryName, count: count + 1 });
  //     });

  //     const categoryArray = Array.from(categoryMap.entries())
  //       .map(([slug, { name, count }]) => ({
  //         name,
  //         slug, // Store the raw slug for navigation
  //         count,
  //       }))
  //       .filter((cat) => cat.count > 0)
  //       .sort((a, b) => b.count - a.count)
  //       .slice(0, MAX_ITEMS);
  //     setCategories(categoryArray);

  //     setLoading(false);
  //   } catch (err) {
  //     setError(err.message);
  //     setLoading(false);
  //     console.error("Error fetching data:", err);
  //   }
  // }, []);

  const fetchData = useCallback(async () => {
    try {
      const profileResponse = await fetch(`${backendURL}/api/lists/business`, {
        headers: { Accept: "application/json" },
      });

      if (!profileResponse.ok) {
        throw new Error(`Profile fetch error: ${profileResponse.status}`);
      }

      const profileData = await profileResponse.json();
      console.log("Raw API Response:", profileData);

      const allProfileData = profileData.data;

      if (profileData.status !== "success" || !Array.isArray(allProfileData)) {
        throw new Error("Invalid data format or failed to fetch business data");
      }

      if (!allProfileData || allProfileData.length === 0) {
        setLocations([]);
        setCategories([]);
        setLoading(false);
        return;
      }

      // Process locations
      const locationMap = new Map();
      allProfileData.forEach((item) => {
        const state = item.business?.state || "Not Specified";
        if (state && state !== "Not Specified") {
          const count = locationMap.get(state) || 0;
          locationMap.set(state, count + 1);
        }
      });

      const locationArray = Array.from(locationMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, MAX_ITEMS);
      setLocations(locationArray);

      // Process categories
      const categoryMap = new Map();
      allProfileData.forEach((item) => {
        const categorySlug = item.business?.category_slug || "uncategorized";
        if (categorySlug && categorySlug !== "uncategorized") {
          const categoryName = formatCategoryName(categorySlug);
          const key = categorySlug;
          const count = categoryMap.get(key) || 0;
          categoryMap.set(key, { name: categoryName, count: count + 1 });
        }
      });

      const categoryArray = Array.from(categoryMap.entries())
        .map(([slug, { name, count }]) => ({
          name,
          slug,
          count,
        }))
        .filter((cat) => cat.count > 0)
        .sort((a, b) => b.count - a.count)
        .slice(0, MAX_ITEMS);
      setCategories(categoryArray);

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error("Error fetching data:", err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLocationClick = useCallback(
    (locationItem) => {
      const searchParams = new URLSearchParams();
      searchParams.set("location", locationItem.name);
      searchParams.set("category", "All");
      searchParams.set("query", "");
      navigate(`/searchPage?${searchParams.toString()}`);
    },
    [navigate]
  );

  const handleCategoryClick = useCallback(
    (categoryItem) => {
      const searchParams = new URLSearchParams();
      searchParams.set("category", categoryItem.slug); // Use the raw slug for filtering
      searchParams.set("location", "All");
      searchParams.set("query", "");
      navigate(`/searchPage?${searchParams.toString()}`);
    },
    [navigate]
  );

  const handleShowMoreLocations = useCallback(() => {
    setVisibleLocations((prev) => Math.min(prev + ITEMS_PER_BATCH, MAX_ITEMS));
  }, []);

  const handleShowMoreCategories = useCallback(() => {
    setVisibleCategories((prev) => Math.min(prev + ITEMS_PER_BATCH, MAX_ITEMS));
  }, []);

  const handleShowLessLocations = useCallback(() => {
    setVisibleLocations(ITEMS_PER_BATCH);
  }, []);

  const handleShowLessCategories = useCallback(() => {
    setVisibleCategories(ITEMS_PER_BATCH);
  }, []);

  const visibleLocationItems = useMemo(
    () => locations.slice(0, visibleLocations),
    [locations, visibleLocations]
  );
  const visibleCategoryItems = useMemo(
    () => categories.slice(0, visibleCategories),
    [categories, visibleCategories]
  );

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-center text-gray-600 animate-pulse">
        Loading filters...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 text-center text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <span className="mx-3">
        <SearchBar />
      </span>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-blue-500 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <MapPin size={18} />
              Browse by Location
            </h2>
          </div>
          <div className="mb-4">
            {visibleLocationItems.length > 0 ? (
              visibleLocationItems.map((location) => (
                <LocationTag
                  key={location.name}
                  name={location.name}
                  count={location.count}
                  onClick={() => handleLocationClick(location)}
                />
              ))
            ) : (
              <p className="text-white text-sm">No locations available</p>
            )}
          </div>
          {locations.length > ITEMS_PER_BATCH && (
            <div className="flex gap-2">
              {locations.length > visibleLocations && (
                <button
                  className="text-white text-sm hover:rotate-2 border hover:border-2 transition-all ease-in-out duration-300 p-1 rounded-xl"
                  onClick={handleShowMoreLocations}>
                  Show More
                </button>
              )}
              {visibleLocations > ITEMS_PER_BATCH && (
                <button
                  className="text-white text-sm hover:rotate-2 border hover:border-2 transition-all ease-in-out duration-300 p-1 rounded-xl"
                  onClick={handleShowLessLocations}>
                  Show Less
                </button>
              )}
            </div>
          )}
        </div>
        <div className="bg-gray-600 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Grid size={18} />
              Browse By Categories
            </h2>
          </div>
          <div className="mb-4">
            {visibleCategoryItems.length > 0 ? (
              visibleCategoryItems.map((category) => (
                <CategoryTag
                  key={category.slug}
                  name={category.name}
                  count={category.count}
                  onClick={() => handleCategoryClick(category)}
                />
              ))
            ) : (
              <p className="text-white text-sm">No categories available</p>
            )}
          </div>
          {categories.length > ITEMS_PER_BATCH && (
            <div className="flex gap-2">
              {categories.length > visibleCategories && (
                <button
                  className="text-white text-sm hover:rotate-2 border hover:border-2 transition-all ease-in-out duration-300 p-1 rounded-xl"
                  onClick={handleShowMoreCategories}>
                  Show More
                </button>
              )}
              {visibleCategories > ITEMS_PER_BATCH && (
                <button
                  className="text-white text-sm hover:rotate-2 border hover:border-2 transition-all ease-in-out duration-300 p-1 rounded-xl"
                  onClick={handleShowLessCategories}>
                  Show Less
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import {
  FaCalculator,
  FaTractor,
  FaRobot,
  FaPlane,
  FaBuilding,
  FaPaintBrush,
  FaCar,
  FaCocktail,
  FaSpa,
  FaBeer,
  FaBroadcastTower,
  FaTools,
  FaBriefcase,
  FaCoffee,
  FaUtensils,
  FaHammer,
  FaFlask,
  FaChild,
  FaWrench,
  FaTruck,
  FaHandsHelping,
  FaPalette,
  FaMapMarkedAlt,
  FaGlobe,
  FaBullhorn,
  FaShoppingCart,
  FaSchool,
  FaUserNurse,
  FaPlug,
  FaTshirt,
  FaMoneyBillWave,
  FaFish,
  FaUtensilSpoon,
  FaCamera,
  FaHeartbeat,
  FaHotel,
  FaIndustry,
  FaLaptopCode,
  FaGem,
  FaGavel,
  FaLeaf,
  FaBox,
  FaMicrophone,
  FaStethoscope,
  FaShieldAlt,
  FaChartLine,
  FaRecycle,
  FaWater,
  FaWind,
  FaHome,
  FaUserPlus,
  FaPrint,
  FaGamepad,
  FaStore,
  FaFastForward,
  FaShippingFast,
  FaFileAlt,
  FaUsers,
  FaOilCan,
  FaPills,
  FaExchangeAlt,
  FaCut,
  FaRing,
  FaMountain,
  FaClipboard,
  FaUmbrella,
  FaIndustry as FaQuarrying,
  FaTaxi,
  FaPowerOff,
  FaTree,
  FaBed,
} from "react-icons/fa";
import backendURL from "../../config";

const formatCategoryName = (slug) => {
  if (!slug || typeof slug !== "string") return "Uncategorized";
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// Memoized component to prevent unnecessary re-renders
const TopBusinessCards = React.memo(() => {
  const [topCategories, setTopCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchCategories = useCallback(async (signal) => {
    try {
      const response = await fetch(`${backendURL}/api/list/business/category`, {
        headers: { Accept: "application/json" },
        signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status !== "success" || !Array.isArray(data.data.categories)) {
        throw new Error("Invalid data format or failed to fetch categories");
      }

      setTopCategories(data.data.categories.slice(0, 30));
      setLoading(false);
    } catch (err) {
      if (err.name !== "AbortError") {
        setError(err.message);
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    fetchCategories(signal);

    return () => abortController.abort();
  }, [fetchCategories]);

  const categoryIcons = useMemo(
    () => ({
      accounting: <FaCalculator />,
      "agricultural-services": <FaTractor />,
      agritech: <FaRobot />,
      "air-transportation": <FaPlane />,
      "architectural-services": <FaBuilding />,
      "arts-antiquities": <FaPaintBrush />,
      "automotive-parts": <FaCar />,
      "automotive-sales": <FaCar />,
      "bars-nightclubs": <FaCocktail />,
      "beauty-cosmetics": <FaSpa />,
      "breweries-beverages": <FaBeer />,
      broadcasting: <FaBroadcastTower />,
      "building-maintenance": <FaTools />,
      "business-consulting": <FaBriefcase />,
      "cafes-bakeries": <FaCoffee />,
      "catering-services": <FaUtensils />,
      "cement-construction-materials": <FaHammer />,
      "chemical-manufacturing": <FaFlask />,
      "childcare-services": <FaChild />,
      "civil-engineering": <FaWrench />,
      "cleaning-services": <FaTools />,
      "commercial-construction": <FaHammer />,
      "community-development": <FaHandsHelping />,
      "courier-delivery-services": <FaTruck />,
      "crafts-artisanal-products": <FaPalette />,
      "cultural-tourism": <FaMapMarkedAlt />,
      "customs-brokerage": <FaGlobe />,
      "digital-marketing": <FaBullhorn />,
      "e-commerce": <FaShoppingCart />,
      edtech: <FaSchool />,
      "educational-resources": <FaSchool />,
      "elder-care-services": <FaUserNurse />,
      "electronics-gadgets": <FaPlug />,
      "electronics-manufacturing": <FaPlug />,
      "energy-services": <FaUmbrella />,
      "engineering-services": <FaWrench />,
      "events-management": <FaBed />,
      "export-business": <FaExchangeAlt />,
      "fashion-clothing": <FaTshirt />,
      "fashion-design": <FaTshirt />,
      "fast-food": <FaFastForward />,
      "film-video-production": <FaMicrophone />,
      "financial-services": <FaMoneyBillWave />,
      fintech: <FaMoneyBillWave />,
      fisheries: <FaFish />,
      "fitness-wellness-centers": <FaHeartbeat />,
      "food-processing": <FaUtensilSpoon />,
      forestry: <FaTree />,
      "furniture-home-goods": <FaHome />,
      "furniture-woodwork": <FaHome />,
      "gaming-entertainment-centers": <FaGamepad />,
      "gemstone-mining": <FaGem />,
      "general-retail": <FaStore />,
      "graphic-design": <FaPalette />,
      "hair-salons-barber-shops": <FaCut />,
      "hardware-building-supplies": <FaHammer />,
      healthtech: <FaHeartbeat />,
      "higher-education": <FaSchool />,
      "hospitals-clinics": <FaHeartbeat />,
      "hotels-accommodation": <FaHotel />,
      "human-resources": <FaUserPlus />,
      "import-business": <FaExchangeAlt />,
      "industrial-equipment": <FaIndustry />,
      "industrial-manufacturing": <FaIndustry />,
      insurance: <FaMoneyBillWave />,
      "interior-design": <FaBuilding />,
      "internet-service-providers": <FaGlobe />,
      "it-services-support": <FaLaptopCode />,
      "jewelry-accessories": <FaGem />,
      "legal-services": <FaGavel />,
      "livestock-poultry": <FaLeaf />,
      "logistics-supply-chain": <FaBox />,
      "market-research": <FaChartLine />,
      "market-trading": <FaClipboard />,
      "marketing-advertising": <FaBullhorn />,
      "medical-equipment": <FaStethoscope />,
      "medical-laboratories": <FaHeartbeat />,
      "mental-health-services": <FaHeartbeat />,
      "metal-fabrication": <FaIndustry />,
      "mining-services": <FaMountain />,
      "music-production": <FaMicrophone />,
      "ngos-foundations": <FaUsers />,
      "oil-gas-exploration": <FaOilCan />,
      "performing-arts": <FaMicrophone />,
      "petroleum-distribution": <FaOilCan />,
      "pharmaceutical-production": <FaPills />,
      "pharmaceutical-retail": <FaPills />,
      "photography-videography": <FaCamera />,
      "plastics-rubber-products": <FaIndustry />,
      "power-generation": <FaPowerOff />,
      "primary-education": <FaSchool />,
      "printing-publishing": <FaPrint />,
      "property-development": <FaHome />,
      quarrying: <FaQuarrying />,
      "rail-transportation": <FaTruck />,
      "real-estate": <FaHome />,
      "real-estate-brokerage": <FaHome />,
      "religious-organizations": <FaUsers />,
      "renewable-energy": <FaWind />,
      "repair-maintenance": <FaTools />,
      "research-development": <FaFlask />,
      "residential-construction": <FaHammer />,
      "resorts-recreation": <FaHotel />,
      restaurants: <FaFastForward />,
      "ride-hailing-taxi-services": <FaTaxi />,
      "road-transportation": <FaTruck />,
      "secondary-education": <FaSchool />,
      "security-services": <FaShieldAlt />,
      "shipping-maritime": <FaShippingFast />,
      "social-enterprises": <FaUsers />,
      "software-development": <FaLaptopCode />,
      "solid-minerals-mining": <FaMountain />,
      "spa-massage": <FaCut />,
      "specialty-stores": <FaStore />,
      "sports-recreation": <FaGamepad />,
      "street-food-vending": <FaFastForward />,
      "supermarkets-grocery": <FaStore />,
      "tailoring-fashion-design": <FaTshirt />,
      telecommunications: <FaGlobe />,
      "textile-apparel": <FaTshirt />,
      "tour-operators": <FaMapMarkedAlt />,
      "trade-facilitation": <FaExchangeAlt />,
      "traditional-medicine": <FaHeartbeat />,
      "translation-interpretation": <FaFileAlt />,
      "travel-agencies": <FaMapMarkedAlt />,
      "tutoring-test-preparation": <FaSchool />,
      "vocational-training": <FaSchool />,
      warehousing: <FaBox />,
      "waste-management": <FaRecycle />,
      "water-management": <FaWater />,
      "wedding-event-planning": <FaRing />,
      uncategorized: <FaBriefcase />,
    }),
    []
  );

  const handleCategoryClick = useCallback(
    (categorySlug) => {
      const searchParams = new URLSearchParams();
      searchParams.set("category", categorySlug);
      searchParams.set("location", "All");
      searchParams.set("query", "");
      navigate(`/searchPage?${searchParams.toString()}`);
    },
    [navigate]
  );

  if (loading) {
    return (
      <div className="text-center py-4 text-gray-600">
        <div className="animate-pulse space-y-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-20 bg-gray-200 rounded-md w-full max-w-xs mx-auto"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-600">
        Error: {error}.{" "}
        <button
          onClick={() => window.location.reload()}
          className="text-blue-600 underline ml-2">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-center text-xl sm:text-2xl font-bold text-gray-900 mb-3">
        Top Business Categories
      </h2>

      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {topCategories.map((category) => (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category.slug)}
            className="cursor-pointer">
            <div className="bg-white p-2 rounded-md shadow-sm border border-gray-300 hover:border-gray-500 hover:scale-105 flex flex-col items-center text-center h-full transition-all duration-200 hover:shadow-md">
              {React.cloneElement(
                categoryIcons[category.slug] || <FaBriefcase />,
                {
                  size: "1.5rem",
                  color: "#2563eb",
                  className: "mb-1",
                }
              )}
              <p className="text-sm font-semibold text-gray-800 leading-tight">
                {formatCategoryName(category.name)}
              </p>
              <span className="text-xs text-gray-500">
                {category.business_count}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end my-3 group cursor-pointer hover:opacity-80 transition-all duration-300 ease-in-out">
        <Link to={"/All-Category"}>
          <div className="flex items-center text-sm text-gray-600 group-hover:text-red-400">
            <span className="mr-1">View All</span>
            <ChevronRight
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              strokeWidth={2}
            />
          </div>
        </Link>
      </div>
    </div>
  );
});

TopBusinessCards.displayName = "TopBusinessCards";
export default TopBusinessCards;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { Search as SearchIcon } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";

// Import your images here
import eRegistryIcon from "../assets/images2/herocardImage.png";
import eCertifyIcon from "../assets/images2/herocardImage2.png";
import eMailIcon from "../assets/images2/herocardImage3.png";
import ePollsIcon from "../assets/images2/herocardImage4.png";
import eJobs from "../assets/images2/Ejobs.jpg";
import eDriveIcon from "../assets/images2/Edrive.jpg";
import eNews from "../assets/images2/Enews.jpg";
import eSchools from "../assets/images2/Eschools.jpg";
import edirect from "../assets/images2/Edrive.jpg";
import eroot from "../assets/images2/Eroot.png";
import ebnb from "../assets/images2/ebnb.jpg";
import companion from "../assets/images2/ecompanion.png";
import autograph from "../assets/images2/autograph2.png";
import etech from "../assets/images2/etech.png";
import estores from "../assets/images2/estores.png";
import eproperties from "../assets/images2/eproperties.png";
import pride from "../assets/images2/pride.png";
import eVenue from "../assets/images2/Evenue.png";

// icons
import { LuMails } from "react-icons/lu";

const FilterButton = ({ text, count, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-full text-sm font-medium hover:scale-105 transition-all duration-200 ${
      isActive
        ? "bg-blue-100 text-red-600"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    } flex items-center gap-2 m-1`}>
    <span>{text}</span>
    <span className="text-xs bg-white px-2 py-0.5 rounded-full">{count}</span>
  </button>
);

const CompanyNamesButton = ({ title, url }) => (
  <Link target="_blank" to={url}>
    <button
      className="px-4 py-1 rounded-full text-sm font-medium transition-all duration-200 bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105
     flex items-center gap-2 m-1">
      <span>{title}</span>
    </button>
  </Link>
);

const HeroCard = ({ title, description, iconSrc, url }) => (
  <Card
    data-aos="fade-up"
    className="h-full border rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg border-red-300  hover:border-red-500 flex flex-col">
    <div className="flex p-4 items-start border-b border-gray-100">
      <img
        src={iconSrc}
        alt={title}
        className="w-12 h-12 object-cover rounded-md mr-4 flex-shrink-0"
      />
      <Typography
        // variant="h5"
        component="div"
        className="font-black text-gray-800 break-words">
        {title}
      </Typography>
    </div>
    <CardContent className="bg-white flex-grow flex flex-col justify-between ">
      <Typography variant="body2" className="text-gray-600 mb-4">
        <p className="text-gray-600 text-xs line-clamp-4 mb-3">
          {description.replace(/<[^>]*>/g, "")}
        </p>
      </Typography>
      <Link target="_blank" to={url} className="no-underline">
        <div className="mt-2">
          <button className="px-0  text-red-600 font-bold rounded-md hover:scale-110 transition-all duration-200 flex items-center gap-2">
            <span>Explore</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </Link>
    </CardContent>
  </Card>
);

const AllEssentialgroupSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All companies");
  const [visibleCards, setVisibleCards] = useState(5);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const services = [
    {
      title: "E-Jobs",
      description:
        "E-Jobs is a comprehensive job portal that links job seekers with employers across various industries. Whether you're looking for full-time employment, remote work, or freelance gigs, E-Jobs provides thousands of job listings tailored to your skills and experience. Employers can post vacancies, review applications, and connect with top talents through the platform. Job seekers can upload their resumes, receive interview tips, and access career development resources to enhance their employability.",
      iconSrc: eJobs,
      url: "http://ejobs.com.ng",
      category: "Technology",
    },
    {
      title: "E-Drive",
      description:
        "E-Drivers is a dedicated job-matching platform for professional drivers seeking employment opportunities. Whether you specialize in ride-hailing, logistics, corporate driving, or chauffeur services, E-Drivers connects you with companies and individuals in need of skilled drivers. Employers can post job openings, review applications, and find the right fit for their needs. The platform also provides resources such as driving tips, licensing updates, and professional training courses to enhance career growth in the transportation industry.",
      iconSrc: eDriveIcon,
      url: "http://edrive.ng",
      category: "Technology",
    },
    {
      title: "E-News",
      description:
        "E-News is a cutting-edge digital news platform that delivers real-time updates on politics, business, entertainment, sports, and global events. Whether you’re looking for breaking news, in-depth analysis, or exclusive interviews, E-News ensures that you stay ahead with credible and well-researched journalism. Readers can customize their news feed, watch live broadcasts, and engage in discussions on trending topics.",
      iconSrc: eNews,
      url: "http://essentialnews.ng",
      category: "Entertainment",
    },
    {
      title: "E-Direct",
      description:
        "Over 1 million people use Edirect to discover great businesses and services and also find or locate missed or lost contacts and loved ones. Join the fastest growing force of over 7 hundred thousand businesses who have taken advantage of this online platform to reach more customers and service consumers helping them enhance the reach of their business.",
      iconSrc: edirect,
      url: "http://edirect.ng",
      category: "People",
    },
    {
      title: "E-schools",
      description: "Lorem ipsum dolor sit amet consectetur.",
      iconSrc: eSchools,
      url: "http://eschoolconnect.ng",
      category: "Academics",
    },

    {
      title: "E-Legal",
      description: "Description for E-Legal",
      iconSrc: eRegistryIcon,
      category: "Health & Wellness",
      url: "http://elegal.ng",
    },
    {
      title: "E-Root",
      description:
        "Your Trusted Repair & Maintenance Hub. E-Fix is an all-in-one platform connecting users with skilled repair and maintenance professionals. Whether you need a plumber, electrician, handyman, car mechanic, or appliance technician, E-Fix ensures you find reliable service providers at the best rates. The platform allows users to book services, compare prices, and read customer reviews to make informed decisions. Professionals can also showcase their expertise and grow their businesses by reaching a wider audience.",
      iconSrc: eroot,
      category: "People",
      url: "http://eroot.ng/",
    },
    {
      title: "OOSHMAIL",
      description: "Lorem ipsum dolor sit amet consectetur.",
      iconSrc: eMailIcon,
      category: "Technology",
      url: "http://ooshmail.com",
    },
    {
      title: "E-BNB",
      description:
        "E-BNB is an innovative platform designed to make hotel bookings effortless and stress-free. Whether you’re planning a luxurious vacation, a business trip, or a weekend getaway, E-Hotels provides access to a wide range of accommodations, from budget-friendly hotels to premium resorts and serviced apartments. Our intuitive search filters allow users to find accommodations that match their preferences—location, price, amenities, and guest ratings. Hotel owners and property managers can list their establishments, manage bookings seamlessly, and attract a global audience looking for short stays or long-term lodging..",
      iconSrc: ebnb,
      category: "People",
      url: "http://ebnbhotel.com",
    },
    {
      title: "Companion",
      description: "Lorem ipsum dolor sit amet consectetur.",
      iconSrc: companion,
      category: "Health & Wellness",
      url: "http://ecompanionng.com",
    },
    {
      title: "E-Polls",
      description: "Lorem ipsum dolor sit amet consectetur.",
      iconSrc: ePollsIcon,
      category: "People",
      url: "/services/companion",
    },
    {
      title: "TheAutograph",
      description: "Lorem ipsum dolor sit amet consectetur.",
      iconSrc: autograph,
      category: "Entertainment",
      url: "http://theautographcollections.ng",
    },
    {
      title: "Etech",
      description:
        "Lorem ipsum dolor sit amet consecteturLorem ipsum dolor sit amet consecteturLorem ipsum dolor sit amet consectetur.",
      iconSrc: etech,
      category: "Technology",
      url: "http://etechology.ng",
    },
    {
      title: "Estores",
      description: "Lorem ipsum dolor sit amet consectetur.",
      iconSrc: estores,
      category: "People",
      url: "http://estores.ng",
    },
    {
      title: "Eproperties",
      description:
        "E-Properties is a cutting-edge real estate marketplace that connects property buyers, sellers, and renters in one easy-to-navigate platform. Whether you’re searching for your dream home, a commercial space, or a rental apartment, E-Properties offers thousands of listings to choose from. The platform enables property owners, realtors, and agents to list properties with detailed descriptions, high-quality images, and virtual tours to attract potential buyers or tenants. Users can also access mortgage calculators, legal guides, and expert property advice to make informed decisions.",
      iconSrc: eproperties,
      category: "People",
      url: "http://eproperties.ng",
    },
    {
      title: "ThePrideOfNigeria",
      description: "Lorem ipsum dolor sit amet consectetur.",
      iconSrc: pride,
      category: "People",
      url: "http://theprideofnigeria.ng",
    },
    {
      title: "E-venue",
      description:
        "Lorem ipsum dolor sit amet consectetur.Lorem ipsum dolor sit amet consectetur.Lorem ipsum dolor sit amet consectetur.Lorem ipsum dolor sit amet consectetur.Lorem ipsum dolor sit amet consectetur.Lorem ipsum dolor sit amet consectetur.Lorem ipsum dolor sit amet consectetur.Lorem ipsum dolor sit amet consectetur.Lorem ipsum dolor sit amet consectetur.Lorem ipsum dolor sit amet consectetur.",
      iconSrc: edirect,
      category: "People",
      url: "http://evenue.ng",
    },
  ];

  // Create filter categories with counts
  const filterCategories = [
    { name: "All companies", count: services.length },
    {
      name: "Entertainment",
      count: services.filter((s) => s.category === "Entertainment").length,
    },
    {
      name: "Health & Wellness",
      count: services.filter((s) => s.category === "Health & Wellness").length,
    },
    {
      name: "Money",
      count: services.filter((s) => s.category === "Money").length,
    },
    {
      name: "People",
      count: services.filter((s) => s.category === "People").length,
    },
    {
      name: "Technology",
      count: services.filter((s) => s.category === "Technology").length,
    },
    {
      name: "Countries",
      count: services.filter((s) => s.category === "Countries").length,
    },
    {
      name: "Academics",
      count: services.filter((s) => s.category === "Academics").length,
    },
  ];

  const filteredServices = services.filter(
    (service) =>
      (activeFilter === "All companies" || service.category === activeFilter) &&
      service.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const loadMoreCards = () => {
    setVisibleCards((prevVisibleCards) => prevVisibleCards + 5);
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl text-center font-semibold mb-3">
        The world is going <span className="text-NavClr italic">e</span> so are
        we{" "}
      </h1>
      <div className="mb-8 flex justify-center">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div
        style={{
          background: "linear-gradient(to right, #082044, #8b2323, #bc0202)",
        }}
        className="flex flex-wrap justify-center mx-auto gap-2 mb-8 rounded-md lg:p-5 lg:max-w-3xl Nlg:p-2">
        <div className="w-full text-xl text-white font-semibold text-center mt-2 mb-4">
          List of all essential group brands
        </div>
        <div className="w-full flex flex-wrap justify-center">
          {services.map((service) => (
            <CompanyNamesButton
              key={service.title}
              title={service.title}
              url={service.url}
            />
          ))}
        </div>
      </div>

      <div
        style={{
          background: "linear-gradient(to right, #287baf, #8a2be2, #53d2b5)",
        }}
        className="flex flex-wrap justify-center mx-auto gap-2 mb-8 rounded-md lg:p-5 lg:max-w-3xl Nlg:p-2">
        <div className="w-full text-xl text-white font-semibold text-center mt-2 mb-4">
          Browse by category
        </div>
        <div className="w-full flex flex-wrap justify-center">
          {filterCategories.map((category) => (
            <FilterButton
              key={category.name}
              text={category.name}
              count={category.count}
              isActive={category.name === activeFilter}
              onClick={() => setActiveFilter(category.name)}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {filteredServices.slice(0, visibleCards).map((service, index) => (
          <HeroCard key={index} {...service} />
        ))}
      </div>

      {visibleCards < filteredServices.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMoreCards}
            className="px-6 py-2 bg-[#df6133] text-white rounded-full hover:bg-[#8b2323] transition-all duration-200">
            See More
          </button>
        </div>
      )}
    </div>
  );
};

export default AllEssentialgroupSection;

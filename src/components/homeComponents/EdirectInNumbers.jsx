import { useEffect, useState, useMemo } from "react";
import backendURL from "../../config";

const StatCard = ({ title, number, description, className = "" }) => (
  <div
    className={`p-3 sm:p-4 md:p-6 rounded-lg shadow-sm flex-shrink-0 w-[150px] sm:w-[180px] md:w-[280px] ${className}`}>
    <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-1 sm:mb-2 md:mb-3">
      {title}
    </h1>
    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-1 sm:mb-2 md:mb-3">
      {number.toLocaleString()}
    </h3>
    <p className="text-xs sm:text-sm md:text-base text-gray-600 text-center">
      {description}
    </p>
  </div>
);

const EDirectNumbers = () => {
  const [stats, setStats] = useState({
    registeredBusinesses: 0,
    registeredUsers: 0,
    blacklistedTotal: 0,
    blacklistedUsers: 0,
    blacklistedCompanies: 0,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          usersResponse,
          businessResponse,
          blacklistUsersResponse,
          blacklistBusinessResponse,
        ] = await Promise.all([
          fetch(`${backendURL}/api/count/users`),
          fetch(`${backendURL}/api/lists/business`),
          fetch(`${backendURL}/api/profiles`),
          fetch(`${backendURL}/api/lists/business`),
        ]);

        if (
          !usersResponse.ok ||
          !businessResponse.ok ||
          !blacklistUsersResponse.ok ||
          !blacklistBusinessResponse.ok
        ) {
          throw new Error("One or more API requests failed");
        }

        const usersData = await usersResponse.json();
        const businessData = await businessResponse.json();
        const blacklistUsersData = await blacklistUsersResponse.json();
        const blacklistBusinessData = await blacklistBusinessResponse.json();

        const registeredUsers = usersData?.user_count || 0;
        const registeredBusinesses = businessData?.data?.length || 0;
        const blacklistedUsers =
          blacklistUsersData.contacts?.filter(
            (c) => c.contact.status === "blacklisted"
          ).length || 0;
        const blacklistedCompanies =
          blacklistBusinessData.data?.filter((b) => b.status === "blacklisted")
            .length || 0;

        setStats({
          registeredBusinesses,
          registeredUsers,
          blacklistedTotal: blacklistedUsers + blacklistedCompanies,
          blacklistedUsers,
          blacklistedCompanies,
        });
      } catch (err) {
        setError(err.message);
      }
    };

    fetchStats();
  }, []);

  const statCards = useMemo(
    () => [
      {
        title: "Registered Businesses",
        number: stats.registeredBusinesses,
        description: "Total registered businesses",
        className: "bg-blue-50 hover:shadow-lg",
      },
      {
        title: "Registered Users",
        number: stats.registeredUsers,
        description: "Total registered users",
        className: "bg-[#f6fef8] hover:shadow-lg",
      },
      {
        title: "Blacklisted Total",
        number: stats.blacklistedTotal,
        description: `Users: ${stats.blacklistedUsers}, Companies: ${stats.blacklistedCompanies}`,
        className: "bg-red-50 hover:shadow-lg",
      },
    ],
    [stats]
  );

  return (
    <div className="max-w-6xl mx-auto py-4 px-2 sm:px-4">
      <h2 className="text-3xl sm:text-4xl font-semibold text-center text-blue-500 mb-3 sm:mb-4">
        E-direct in Numbers
      </h2>
      <p className="text-sm sm:text-base text-center text-gray-600 mb-6 sm:mb-8">
        Key statistics at a glance
      </p>
      {error && <p className="text-center text-red-500 mb-4">{error}</p>}
      <div className="md:grid md:grid-cols-3 md:gap-6 flex overflow-x-auto snap-x snap-mandatory gap-3 sm:gap-4 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {statCards.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            number={stat.number}
            description={stat.description}
            className={stat.className}
          />
        ))}
      </div>
    </div>
  );
};

export default EDirectNumbers;

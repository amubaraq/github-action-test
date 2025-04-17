// import React, { useState, useEffect } from "react";

// const CurrencyChecker = () => {
//   const [rates, setRates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchRates = async () => {
//       try {
//         // Using ExchangeRate-API's free endpoint - in production, use your own API key
//         const response = await fetch("https://open.er-api.com/v6/latest/USD");
//         const data = await response.json();

//         if (data && data.rates) {
//           // Format the rates for display
//           const formattedRates = [
//             { base: "USD", target: "EUR", value: data.rates.EUR },
//             { base: "USD", target: "GBP", value: data.rates.GBP },
//             { base: "USD", target: "JPY", value: data.rates.JPY },
//             { base: "USD", target: "CAD", value: data.rates.CAD },
//             { base: "USD", target: "AUD", value: data.rates.AUD },
//             { base: "USD", target: "CHF", value: data.rates.CHF },
//             { base: "USD", target: "CNY", value: data.rates.CNY },
//             { base: "USD", target: "INR", value: data.rates.INR },
//             { base: "USD", target: "NGN", value: data.rates.NGN },
//           ];
//           setRates(formattedRates);
//         } else {
//           throw new Error("Invalid data format");
//         }
//       } catch (err) {
//         setError("Failed to fetch currency rates");
//         console.error(err);

//         // Fallback to static data if API fails
//         setRates([
//           { base: "USD", target: "EUR", value: 0.92 },
//           { base: "USD", target: "GBP", value: 0.79 },
//           { base: "USD", target: "JPY", value: 134.56 },
//           { base: "USD", target: "CAD", value: 1.35 },
//           { base: "USD", target: "AUD", value: 1.48 },
//           { base: "USD", target: "CHF", value: 0.88 },
//           { base: "USD", target: "CNY", value: 7.24 },
//           { base: "USD", target: "INR", value: 83.45 },
//           { base: "USD", target: "NGN", value: 1625.3 },
//         ]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRates();

//     // Refresh rates every 5 minutes (300000ms)
//     const intervalId = setInterval(fetchRates, 300000);

//     return () => clearInterval(intervalId);
//   }, []);

//   // Get flag emoji for currency
//   const getFlagEmoji = (currencyCode) => {
//     const flagMap = {
//       EUR: "🇪🇺",
//       GBP: "🇬🇧",
//       JPY: "🇯🇵",
//       CAD: "🇨🇦",
//       AUD: "🇦🇺",
//       CHF: "🇨🇭",
//       CNY: "🇨🇳",
//       INR: "🇮🇳",
//       USD: "🇺🇸",
//       NGN: "🇳🇬",
//     };

//     return flagMap[currencyCode] || "";
//   };

//   const formatRate = (rate) => {
//     // Format with appropriate decimal places based on currency
//     if (
//       rate.target === "JPY" ||
//       rate.target === "INR" ||
//       rate.target === "NGN"
//     ) {
//       return rate.value.toFixed(2);
//     }
//     return rate.value.toFixed(4);
//   };

//   if (loading) {
//     return (
//       <div className="bg-[#0A0B2E] text-white text-xs py-1 overflow-hidden">
//         <div className="flex justify-center">
//           <span>Loading currency rates...</span>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-[#0A0B2E] text-white text-xs py-1 overflow-hidden">
//         <div className="flex justify-center">
//           <span>{error}</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-[#0A0B2E] text-white text-xs py-1 overflow-hidden border-t border-gray-800 relative">
//       <div className="sm:absolute left-[0px]  text-red-50 top-1/2 transform -translate-y-1/2 z-10 bg-[#0A0B2E] pr-2 font-medium">
//         Exchange Rate:
//       </div>
//       <div className="relative flex overflow-x-hidden pl-24">
//         <div className="animate-marquee whitespace-nowrap py-1 flex">
//           {rates.map((rate, index) => (
//             <div key={index} className="flex items-center mx-4">
//               <span className="mr-1 font-medium">
//                 {getFlagEmoji(rate.base)} {rate.base}/
//               </span>
//               <span className="font-medium">
//                 {getFlagEmoji(rate.target)} {rate.target} :{" "}
//               </span>
//               <span className="ml-1 font-medium">{formatRate(rate)}</span>
//             </div>
//           ))}
//         </div>

//         <div className="absolute top-0 animate-marquee2 whitespace-nowrap py-1 flex">
//           {rates.map((rate, index) => (
//             <div key={`dup-${index}`} className="flex items-center mx-4">
//               <span className="mr-1 font-medium">
//                 {getFlagEmoji(rate.base)} {rate.base}/
//               </span>
//               <span className="font-medium">
//                 {getFlagEmoji(rate.target)} {rate.target} :{" "}
//               </span>
//               <span className="ml-1 font-medium">{formatRate(rate)}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CurrencyChecker;

import React, { useState, useEffect } from "react";

const CountryFlagCurrencyChecker = () => {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        // Using ExchangeRate-API's free endpoint - in production, use your own API key
        const response = await fetch("https://open.er-api.com/v6/latest/USD");
        const data = await response.json();

        if (data && data.rates) {
          // Format the rates for display
          const formattedRates = [
            { base: "USD", target: "EUR", value: data.rates.EUR },
            { base: "USD", target: "GBP", value: data.rates.GBP },
            { base: "USD", target: "JPY", value: data.rates.JPY },
            { base: "USD", target: "CAD", value: data.rates.CAD },
            { base: "USD", target: "AUD", value: data.rates.AUD },
            { base: "USD", target: "CHF", value: data.rates.CHF },
            { base: "USD", target: "CNY", value: data.rates.CNY },
            { base: "USD", target: "INR", value: data.rates.INR },
            { base: "USD", target: "NGN", value: data.rates.NGN },
          ];
          setRates(formattedRates);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (err) {
        setError("Failed to fetch currency rates");
        console.error(err);

        // Fallback to static data if API fails
        setRates([
          { base: "USD", target: "EUR", value: 0.92 },
          { base: "USD", target: "GBP", value: 0.79 },
          { base: "USD", target: "JPY", value: 134.56 },
          { base: "USD", target: "CAD", value: 1.35 },
          { base: "USD", target: "AUD", value: 1.48 },
          { base: "USD", target: "CHF", value: 0.88 },
          { base: "USD", target: "CNY", value: 7.24 },
          { base: "USD", target: "INR", value: 83.45 },
          { base: "USD", target: "NGN", value: 1625.3 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();

    // Refresh rates every 5 minutes (300000ms)
    const intervalId = setInterval(fetchRates, 300000);

    return () => clearInterval(intervalId);
  }, []);

  // Map currencies to country codes
  const currencyToCountry = {
    USD: "us",
    EUR: "eu",
    GBP: "gb",
    JPY: "jp",
    CAD: "ca",
    AUD: "au",
    CHF: "ch",
    CNY: "cn",
    INR: "in",
    NGN: "ng",
  };

  const formatRate = (rate) => {
    // Format with appropriate decimal places based on currency
    if (
      rate.target === "JPY" ||
      rate.target === "INR" ||
      rate.target === "NGN"
    ) {
      return rate.value.toFixed(2);
    }
    return rate.value.toFixed(4);
  };

  // Flag display with text fallback
  const FlagDisplay = ({ currencyCode }) => {
    const countryCode = currencyToCountry[currencyCode] || "";

    return (
      <div className="flex items-center">
        <span className={`fi fi-${countryCode.toLowerCase()} mr-1`}></span>
        <span className="font-medium">{currencyCode}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-[#0A0B2E] text-white text-xs py-1 overflow-hidden">
        <div className="flex justify-center">
          <span>Loading currency rates...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#0A0B2E] text-white text-xs py-1 overflow-hidden">
        <div className="flex justify-center">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0B2E] text-white text-xs py-0 overflow-hidden border-t border-gray-800 relative">
      <div className="absolute left-0 text-red-50 top-1/2 transform -translate-y-1/2 z-10 bg-[#0A0B2E] pr-2 font-medium pl-2">
        Exchange Rate:
      </div>
      <div className="relative flex overflow-x-hidden pl-24">
        <div className="animate-marquee whitespace-nowrap py-1 flex">
          {rates.map((rate, index) => (
            <div key={index} className="flex items-center mx-4">
              <FlagDisplay currencyCode={rate.base} />
              <span className="mx-1">/</span>
              <FlagDisplay currencyCode={rate.target} />
              <span className="mx-1">:</span>
              <span className="font-medium">{formatRate(rate)}</span>
            </div>
          ))}
        </div>

        <div className="absolute top-0 animate-marquee2 whitespace-nowrap py-1 flex">
          {rates.map((rate, index) => (
            <div key={`dup-${index}`} className="flex items-center mx-4">
              <FlagDisplay currencyCode={rate.base} />
              <span className="mx-1">/</span>
              <FlagDisplay currencyCode={rate.target} />
              <span className="mx-1">:</span>
              <span className="font-medium">{formatRate(rate)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Define the CSS animations for the marquee effect
const cssForMarquee = `
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}

@keyframes marquee2 {
  0% { transform: translateX(100%); }
  100% { transform: translateX(0); }
}

.animate-marquee {
  animation: marquee 30s linear infinite;
}

.animate-marquee2 {
  animation: marquee2 30s linear infinite;
}

/* Base flag styling */
.fi {
  display: inline-block;
  width: 1.33em;
  height: 1em;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: 50%;
  position: relative;
}

/* Flag SVG backgrounds */
.fi-us {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 7'%3E%3Crect width='10' height='7' fill='%23fff'/%3E%3Crect width='10' height='1' y='0' fill='%23b22234'/%3E%3Crect width='10' height='1' y='2' fill='%23b22234'/%3E%3Crect width='10' height='1' y='4' fill='%23b22234'/%3E%3Crect width='10' height='1' y='6' fill='%23b22234'/%3E%3Crect width='4' height='4' fill='%233c3b6e'/%3E%3C/svg%3E");
}
.fi-eu {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 810 540'%3E%3Crect fill='%23039' width='810' height='540'/%3E%3Cg fill='%23fc0'%3E%3Cpath d='M396.8 276.7l12.6-38.7-32.9-23.9h40.7l12.6-38.7 12.6 38.7h40.7l-32.9 23.9 12.6 38.7-32.9-23.9z'/%3E%3C/g%3E%3C/svg%3E");
}
.fi-gb {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 30'%3E%3Cdefs%3E%3CclipPath id='a'%3E%3Cpath d='M30 15h30v15zv15H0zH0V0zV0h30z'/%3E%3C/clipPath%3E%3C/defs%3E%3Cpath d='M0 0v30h60V0z' fill='%23012169'/%3E%3Cpath d='M0 0l60 30m0-30L0 30' stroke='%23fff' stroke-width='6'/%3E%3Cpath d='M0 0l60 30m0-30L0 30' clip-path='url(%23a)' stroke='%23C8102E' stroke-width='4'/%3E%3Cpath d='M30 0v30M0 15h60' stroke='%23fff' stroke-width='10'/%3E%3Cpath d='M30 0v30M0 15h60' stroke='%23C8102E' stroke-width='6'/%3E%3C/svg%3E");
}
.fi-jp {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 900 600'%3E%3Crect fill='%23fff' height='600' width='900'/%3E%3Ccircle fill='%23bc002d' cx='450' cy='300' r='180'/%3E%3C/svg%3E");
}
.fi-ca {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 9600 4800'%3E%3Cpath fill='%23f00' d='M0 0h9600v4800H0z'/%3E%3Cpath fill='%23fff' d='M2400 0h4800v4800H2400z'/%3E%3C/svg%3E");
}
.fi-au {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10080 5040'%3E%3Cpath fill='%23012169' d='M0 0h10080v5040H0z'/%3E%3C/svg%3E");
}
.fi-ch {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath fill='%23FF0000' d='M0 0h32v32H0z'/%3E%3Cpath fill='%23FFF' d='M13 6h6v20h-6zM6 13h20v6H6z'/%3E%3C/svg%3E");
}
.fi-cn {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 900 600'%3E%3Cpath fill='%23EE1C25' d='M0 0h900v600H0z'/%3E%3C/svg%3E");
}
.fi-in {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 900 600'%3E%3Cpath fill='%23f93' d='M0 0h900v200H0z'/%3E%3Cpath fill='%23fff' d='M0 200h900v200H0z'/%3E%3Cpath fill='%23128807' d='M0 400h900v200H0z'/%3E%3C/svg%3E");
}
.fi-ng {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 6 3'%3E%3Cpath fill='%23008751' d='M0 0h6v3H0z'/%3E%3Cpath fill='%23fff' d='M2 0h2v3H2z'/%3E%3C/svg%3E");
}
`;

// Add the CSS to the document head
const addCssToHead = () => {
  if (typeof document !== "undefined") {
    const style = document.createElement("style");
    style.type = "text/css";
    style.appendChild(document.createTextNode(cssForMarquee));
    document.head.appendChild(style);
  }
};

// Implementation of the component with CSS added when mounted
const CurrencyChecker = () => {
  useEffect(() => {
    addCssToHead();
  }, []);

  return <CountryFlagCurrencyChecker />;
};

export default CurrencyChecker;

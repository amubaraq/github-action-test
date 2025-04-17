// import React, { useState, useEffect } from "react";
// import { ChevronUp } from "lucide-react";

// const ScrollToTop = () => {
//   const [isVisible, setIsVisible] = useState(false);

//   // Show button when user scrolls down 300px
//   const toggleVisibility = () => {
//     if (window.scrollY > 900) {
//       setIsVisible(true);
//     } else {
//       setIsVisible(false);
//     }
//   };

//   // Scroll to top smoothly
//   const scrollToTop = () => {
//     window.scrollTo({
//       top: 0,
//       behavior: "smooth",
//     });
//   };

//   useEffect(() => {
//     window.addEventListener("scroll", toggleVisibility);
//     return () => {
//       window.removeEventListener("scroll", toggleVisibility);
//     };
//   }, []);

//   return (
//     <>
//       {isVisible && (
//         <button
//           onClick={scrollToTop}
//           className="fixed bottom-6 right-6 bg-[#E63946] text-white p-1 rounded-full shadow-md hover:bg-[#D62828] transition-all duration-300 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:ring-opacity-50"
//           aria-label="Scroll to top">
//           <ChevronUp size={16} />
//         </button>
//       )}
//     </>
//   );
// };

// export default ScrollToTop;
import React, { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Adjustable scroll threshold (in pixels)
  const SCROLL_THRESHOLD = 1500; // Change this value to control when button appears

  // Show button when user scrolls down beyond the threshold
  const toggleVisibility = () => {
    if (window.scrollY > SCROLL_THRESHOLD) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-[#E63946] text-white p-1 rounded-full shadow-md hover:bg-[#D62828] transition-all duration-300 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#E63946] focus:ring-opacity-50"
          aria-label="Scroll to top">
          <ChevronUp size={16} />
        </button>
      )}
    </>
  );
};

export default ScrollToTop;

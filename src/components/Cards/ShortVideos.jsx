// import React, { useState, useRef, useEffect } from "react";
// import { ChevronLeft, ChevronRight, Play } from "lucide-react";

// const ShortVideosSection = () => {
//   // Sample video data - replace with your actual YouTube video IDs and titles
//   const videos = [
//     {
//       id: "dJQn4DqzMVQ",
//       title: "7 Strategies to Grow Your Business",
//       duration: "4:39",
//     },
//     {
//       id: "lJUzh7INCZg",
//       title: "8 undeniable skills to keep customers for life",
//       duration: "7:27",
//     },
//     {
//       id: "QQQe1aDy4fE",
//       title: "The 3 Most Important Skills In Sales",
//       duration: "9:33",
//     },
//     {
//       id: "jNQXAC9IVRw",
//       title: "Your First Impression in a Job Interview",
//       duration: "2:30",
//     },

//     // ...other videos
//   ];

//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [activeVideo, setActiveVideo] = useState(null);
//   const carouselRef = useRef(null);
//   const [touchStartX, setTouchStartX] = useState(null);
//   const [isMobile, setIsMobile] = useState(false);

//   // Check if we're on a mobile device
//   useEffect(() => {
//     const checkIfMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     checkIfMobile();
//     window.addEventListener("resize", checkIfMobile);

//     return () => {
//       window.removeEventListener("resize", checkIfMobile);
//     };
//   }, []);

//   // Handle scroll for mobile devices
//   const handleTouchStart = (e) => {
//     setTouchStartX(e.touches[0].clientX);
//   };

//   const handleTouchEnd = (e) => {
//     if (!touchStartX) return;

//     const touchEndX = e.changedTouches[0].clientX;
//     const diff = touchStartX - touchEndX;

//     if (diff > 50) {
//       handleNext();
//     } else if (diff < -50) {
//       handlePrev();
//     }

//     setTouchStartX(null);
//   };

//   const handlePrev = () => {
//     setCurrentIndex((prevIndex) => {
//       const newIndex = Math.max(0, prevIndex - (isMobile ? 1 : 2));
//       scrollToIndex(newIndex);
//       return newIndex;
//     });
//   };

//   const handleNext = () => {
//     setCurrentIndex((prevIndex) => {
//       const newIndex = Math.min(
//         videos.length - (isMobile ? 1 : 4),
//         prevIndex + (isMobile ? 1 : 2)
//       );
//       scrollToIndex(newIndex);
//       return newIndex;
//     });
//   };

//   const scrollToIndex = (index) => {
//     if (carouselRef.current) {
//       const itemWidth = carouselRef.current.children[0].offsetWidth;
//       const scrollPosition = index * itemWidth;
//       carouselRef.current.scrollTo({
//         left: scrollPosition,
//         behavior: "smooth",
//       });
//     }
//   };

//   const playVideo = (video) => {
//     setActiveVideo(video);
//   };

//   const closeVideo = () => {
//     setActiveVideo(null);
//   };

//   return (
//     <section className="py-8 sm:px-4 md:py-12 max-w-6xl mx-auto">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
//           Short Videos
//         </h2>
//         <div className="flex gap-2">
//           <button
//             onClick={handlePrev}
//             disabled={currentIndex === 0}
//             className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
//             <ChevronLeft size={20} />
//           </button>
//           <button
//             onClick={handleNext}
//             disabled={currentIndex >= videos.length - (isMobile ? 1 : 4)}
//             className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
//             <ChevronRight size={20} />
//           </button>
//         </div>
//       </div>

//       <div
//         className="relative overflow-hidden"
//         onTouchStart={handleTouchStart}
//         onTouchEnd={handleTouchEnd}>
//         <div
//           ref={carouselRef}
//           className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
//           style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
//           {videos.map((video, index) => (
//             <div
//               key={video.id}
//               className="min-w-[280px] md:min-w-[320px] snap-start flex-shrink-0 cursor-pointer"
//               onClick={() => playVideo(video)}>
//               <div className="relative group rounded-lg overflow-hidden">
//                 <img
//                   src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
//                   alt={video.title}
//                   className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
//                 />
//                 <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                   <div className="bg-red-600 text-white p-3 rounded-full">
//                     <Play size={20} />
//                   </div>
//                 </div>
//                 <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
//                   {video.duration}
//                 </div>
//               </div>
//               <h3 className="mt-2 font-medium text-gray-800 line-clamp-2">
//                 {video.title}
//               </h3>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* YouTube Modal */}
//       {activeVideo && (
//         <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
//           <div className="relative bg-white rounded-lg w-full max-w-4xl">
//             <button
//               onClick={closeVideo}
//               className="absolute -top-10 right-0 text-white hover:text-gray-300">
//               <svg
//                 className="w-6 h-6"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg">
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M6 18L18 6M6 6l12 12"></path>
//               </svg>
//             </button>
//             <div className="aspect-video w-full">
//               <iframe
//                 className="w-full h-full"
//                 src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1`}
//                 title={activeVideo.title}
//                 frameBorder="0"
//                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                 allowFullScreen></iframe>
//             </div>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// };

// export default ShortVideosSection;
import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Loader2 } from "lucide-react";

const ShortVideosSection = () => {
  const videos = [
    {
      id: "dJQn4DqzMVQ",
      title: "7 Strategies to Grow Your Business",
      duration: "4:39",
    },
    {
      id: "lJUzh7INCZg",
      title: "8 undeniable skills to keep customers for life",
      duration: "7:27",
    },
    {
      id: "QQQe1aDy4fE",
      title: "The 3 Most Important Skills In Sales",
      duration: "9:33",
    },
    {
      id: "jNQXAC9IVRw",
      title: "Your First Impression in a Job Interview",
      duration: "2:30",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeVideo, setActiveVideo] = useState(null);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const carouselRef = useRef(null);
  const [touchStartX, setTouchStartX] = useState(null);
  const [mouseStartX, setMouseStartX] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on a mobile device
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  // Handle touch and mouse drag for scrolling
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!touchStartX) return;
    const touchMoveX = e.touches[0].clientX;
    const diff = touchStartX - touchMoveX;
    if (carouselRef.current) {
      carouselRef.current.scrollLeft += diff;
      setTouchStartX(touchMoveX);
    }
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }

    setTouchStartX(null);
  };

  const handleMouseDown = (e) => {
    setMouseStartX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !mouseStartX) return;
    const mouseMoveX = e.clientX;
    const diff = mouseStartX - mouseMoveX;
    if (carouselRef.current) {
      carouselRef.current.scrollLeft += diff;
      setMouseStartX(mouseMoveX);
    }
  };

  const handleMouseUp = (e) => {
    if (!mouseStartX) return;
    const mouseEndX = e.clientX;
    const diff = mouseStartX - mouseEndX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }

    setMouseStartX(null);
    setIsDragging(false);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = Math.max(0, prevIndex - (isMobile ? 1 : 2));
      scrollToIndex(newIndex);
      return newIndex;
    });
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = Math.min(
        videos.length - (isMobile ? 1 : 4),
        prevIndex + (isMobile ? 1 : 2)
      );
      scrollToIndex(newIndex);
      return newIndex;
    });
  };

  const scrollToIndex = (index) => {
    if (carouselRef.current) {
      const itemWidth =
        carouselRef.current.children[0].offsetWidth +
        parseInt(getComputedStyle(carouselRef.current.children[0]).marginRight);
      const scrollPosition = index * itemWidth;
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  const playVideo = (video) => {
    setIsLoadingVideo(true);
    setActiveVideo(video);
  };

  const closeVideo = () => {
    setActiveVideo(null);
    setIsLoadingVideo(false);
  };

  const handleVideoLoad = () => {
    setIsLoadingVideo(false);
  };

  return (
    <section className="py-8 sm:px-4 md:py-12 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Short Videos
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex >= videos.length - (isMobile ? 1 : 4)}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div
        className="relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => setIsDragging(false)}>
        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {videos.map((video, index) => (
            <div
              key={video.id}
              className="min-w-[280px] md:min-w-[320px] snap-start flex-shrink-0 cursor-pointer"
              onClick={() => playVideo(video)}>
              <div className="relative group rounded-lg overflow-hidden">
                <img
                  src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                  alt={video.title}
                  className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-red-600 text-white p-3 rounded-full">
                    <Play size={20} />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
              </div>
              <h3 className="mt-2 font-medium text-gray-800 line-clamp-2">
                {video.title}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* YouTube Modal */}
      {activeVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg w-full max-w-4xl">
            <button
              onClick={closeVideo}
              className="absolute -top-10 right-0 text-white hover:text-gray-300">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="aspect-video w-full relative">
              {isLoadingVideo && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
              )}
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1&enablejsapi=1`}
                title={activeVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                onLoad={handleVideoLoad}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ShortVideosSection;

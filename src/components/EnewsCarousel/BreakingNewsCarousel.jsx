import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns"; // For date formatting
import { Avatar } from "@mui/material"; // For author avatar
import AccessTimeIcon from "@mui/icons-material/AccessTime"; // Clock icon

export const BreakingNewsCarousel = () => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const [showControls, setShowControls] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          "https://backend.essentialnews.ng/api/posts/breaking"
        );
        const data = await response.json();
        setNews(data.data.posts.slice(0, 7));
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, []);

  const handleCardClick = (slug) => {
    window.location.href = `https://essentialnews.ng/post/${slug}`;
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === "next" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-36 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div
      className="relative w-full max-w-6xl mx-auto "
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}>
      <div className="p-3 bg-primary text-primary-foreground">
        <h2 className="text-xl font-bold">Breaking News</h2>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-5 overflow-x-auto py-3 px-4 snap-x snap-mandatory hide-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {news.map((item) => (
          <Card
            key={item.id}
            onClick={() => handleCardClick(item.slug)}
            className="flex-shrink-0 w-[280px] snap-start overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            {/* Image Section */}
            <div className="h-36 relative">
              <img
                src={item.featured_image || "/api/placeholder/280/144"}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* Content Section */}
            <div className="p-4">
              <h3 className="font-semibold text-sm line-clamp-2 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-xs line-clamp-2 mb-3">
                {item.content.replace(/<[^>]*>/g, "")}
              </p>

              {/* Author and Date Section */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar
                    src={item.author_avatar || "/default-avatar.png"} // Fallback for missing avatar
                    alt={item.created_by}
                    sx={{ width: 24, height: 24 }}
                  />
                  <span className="text-xs text-gray-600 truncate max-w-[100px]">
                    {item.created_by}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <AccessTimeIcon sx={{ fontSize: 14 }} />
                  <time dateTime={item.created_at}>
                    {format(new Date(item.created_at), "MMM dd, yyyy")}
                  </time>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Navigation Controls */}
      <div
        className={`absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 pointer-events-none transition-opacity duration-200 ${showControls ? "opacity-100" : "opacity-0"}`}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            scroll("prev");
          }}
          className="pointer-events-auto p-2 rounded-full bg-white/90 shadow-lg hover:bg-white transition-colors"
          aria-label="Previous news">
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            scroll("next");
          }}
          className="pointer-events-auto p-2 rounded-full bg-white/90 shadow-lg hover:bg-white transition-colors"
          aria-label="Next news">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const TopTopicCarousel = () => {
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const [showControls, setShowControls] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch(
          "https://backend.essentialnews.ng/api/posts/top-topic"
        );
        const data = await response.json();
        // Assuming each post has a 'createdAt' field that contains the date
        const sortedPosts = data.data.posts
          .slice(0, 10)
          .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)); // Sort by date descending
        setTopics(sortedPosts);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTopics();
  }, []);

  const handleCardClick = (slug) => {
    window.location.href = `https://essentialnews.ng/post/${slug}`;
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === "next" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-36 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div
      className="relative w-full max-w-6xl mx-auto"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}>
      <div className="p-3 bg-primary text-primary-foreground">
        <h2 className="text-xl font-bold">Trending Topics</h2>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-5 overflow-x-auto py-3 px-4 snap-x snap-mandatory hide-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {topics.map((item) => (
          <Card
            key={item.id}
            onClick={() => handleCardClick(item.slug)}
            className="flex-shrink-0 w-[280px] snap-start overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            {/* Image Section */}
            <div className="h-36 relative">
              <img
                src={item.featured_image || "/api/placeholder/280/144"}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            {/* Content Section */}
            <div className="p-4">
              <h3 className="font-semibold text-sm line-clamp-2 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-xs line-clamp-2 mb-3">
                {item.content.replace(/<[^>]*>/g, "")}
              </p>

              {/* Author and Date Section */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar
                    src={item.author_avatar || "/default-avatar.png"} // Fallback for missing avatar
                    alt={item.created_by}
                    sx={{ width: 24, height: 24 }}
                  />
                  <span className="text-xs text-gray-600 truncate max-w-[100px]">
                    {item.created_by}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <AccessTimeIcon sx={{ fontSize: 14 }} />
                  <time dateTime={item.created_at}>
                    {format(new Date(item.created_at), "MMM dd, yyyy")}
                  </time>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Navigation Controls */}
      <div
        className={`absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 pointer-events-none transition-opacity duration-200 ${showControls ? "opacity-100" : "opacity-0"}`}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            scroll("prev");
          }}
          className="pointer-events-auto p-2 rounded-full bg-white/90 shadow-lg hover:bg-white transition-colors"
          aria-label="Previous topic">
          <ChevronLeft className="w-4 h-4" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            scroll("next");
          }}
          className="pointer-events-auto p-2 rounded-full bg-white/90 shadow-lg hover:bg-white transition-colors"
          aria-label="Next topic">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, Avatar, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export const AutographMagazineCarousel = () => {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const [showControls, setShowControls] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(
          "https://autoapi.theautographcollections.ng/api/getAllFashion?startIndex=0&limit=30"
        );
        const data = await response.json();

        // Get 10 random articles from the fetched posts
        const shuffled = [...data.posts].sort(() => 0.5 - Math.random());
        setArticles(shuffled.slice(0, 10));
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleCardClick = (slug) => {
    navigate(`/magazine/${slug}`);
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

  const stripHtml = (html) => {
    return html.replace(/<[^>]*>/g, "").substring(0, 100) + "...";
  };

  if (isLoading) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-600" />
      </div>
    );
  }

  return (
    <div
      className="relative w-full max-w-6xl mx-auto my-8 "
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}>
      <div className="p-4 bg-gradient-to-r from-purple-900 to-purple-700 text-white rounded-t-lg">
        <h2 className="text-2xl font-bold flex items-center">
          <span className="mr-2">✨</span> Autograph Magazine Features
          <span className="ml-2">✨</span>
        </h2>
        <p className="text-purple-200">
          Discover our curated selection of fashion, culture, and lifestyle
          articles
        </p>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto py-6 px-4 snap-x snap-mandatory hide-scrollbar bg-gradient-to-b from-purple-50 to-white rounded-b-lg"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {articles.map((article) => (
          <Card
            key={article._id}
            onClick={() => handleCardClick(article.slug)}
            className="flex-shrink-0 w-80 snap-start overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1">
            {/* Image Section with Category Badge */}
            <div className="h-48 relative">
              <img
                src={article.image1 || "/placeholder-magazine.jpg"}
                alt={article.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/placeholder-magazine.jpg";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <Chip
                label={article.category}
                size="small"
                className="absolute top-2 left-2 bg-purple-600 text-white font-medium"
              />
            </div>

            {/* Content Section */}
            <div className="p-4">
              <h3 className="font-bold text-lg line-clamp-2 mb-2 text-gray-800">
                {article.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {stripHtml(article.content)}
              </p>

              {/* Author and Date Section */}
              <div className="flex items-center justify-between border-t pt-3">
                <div className="flex items-center gap-2">
                  <Avatar
                    src={article.authorId?.image || "/default-avatar.png"}
                    alt={article.authorId?.name}
                    sx={{ width: 28, height: 28 }}
                  />
                  <span className="text-xs font-medium text-gray-700 truncate max-w-[100px]">
                    {article.authorId?.name || "Unknown Author"}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <AccessTimeIcon sx={{ fontSize: 14 }} />
                  <time dateTime={article.createdAt}>
                    {format(new Date(article.createdAt), "MMM d, yyyy")}
                  </time>
                </div>
              </div>

              {/* Post Type Badge */}
              <div className="mt-2">
                <Chip
                  label={article.postType}
                  size="small"
                  variant="outlined"
                  className="border-purple-300 text-purple-600"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Navigation Controls */}
      {articles.length > 0 && (
        <div
          className={`absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 pointer-events-none transition-opacity duration-200 ${showControls ? "opacity-100" : "opacity-0"}`}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              scroll("prev");
            }}
            className="pointer-events-auto p-2 rounded-full bg-white/90 shadow-lg hover:bg-white transition-colors"
            aria-label="Previous article">
            <ChevronLeft className="w-5 h-5 text-purple-800" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              scroll("next");
            }}
            className="pointer-events-auto p-2 rounded-full bg-white/90 shadow-lg hover:bg-white transition-colors"
            aria-label="Next article">
            <ChevronRight className="w-5 h-5 text-purple-800" />
          </button>
        </div>
      )}

      {/* View All Button */}
      <div className="text-center mt-6">
        <button
          onClick={() => navigate("/magazine")}
          className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors shadow-md flex items-center mx-auto">
          View All Articles
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

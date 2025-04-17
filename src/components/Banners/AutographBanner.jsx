import React from "react";
import { ArrowRight } from "lucide-react";
import autographImage from "../../assets/images/Autograph.png";

const MagazineBanner = () => {
  return (
    <div className="relative bg-gray-100 min-h-[400px] flex items-center">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 blur-sm"
        style={{ backgroundImage: `url(${autographImage})` }}
      />

      <div className="relative max-w-6xl mx-auto px-4 py-8 w-full">
        <div className="text-center md:text-left">
          {/* Simplified Header */}
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Explore Nigeria's
            <br />
            <span className="text-red-600">Premium Lifestyle Digest</span>
          </h2>

          {/* Straightforward CTA */}
          <div className="mb-8">
            <a
              href="https://theautographcollections.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-red-600 text-white px-8 py-4 rounded-lg
                       hover:bg-red-700 transition-colors text-lg font-semibold">
              Visit Our Magazine
              <ArrowRight className="ml-3" size={20} />
            </a>
          </div>

          {/* Simplified Trending Tags */}
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            {["Fashion", "Celebrities", "Business", "Events"].map(
              (topic, index) => (
                <span
                  key={index}
                  className="bg-white/90 px-4 py-2 rounded-md text-sm shadow-sm">
                  #{topic}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MagazineBanner;

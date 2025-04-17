import React from "react";
import { Link } from "react-router-dom";

const ProminentPeopleBanner = () => {
  // Sample data - replace with your actual prominent people data
  const prominentPeople = [
    {
      id: 1,
      name: "Nelson Mandela",
      imageUrl:
        "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      occupation: "Anti-Apartheid Revolutionary",
    },
    {
      id: 2,
      name: "Marie Curie",
      imageUrl:
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      occupation: "Physicist & Chemist",
    },
    {
      id: 3,
      name: "Martin Luther King Jr.",
      imageUrl:
        "https://images.unsplash.com/photo-1545231027-637d2f6210f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      occupation: "Civil Rights Leader",
    },
    {
      id: 4,
      name: "Ada Lovelace",
      imageUrl:
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      occupation: "Mathematician",
    },
    {
      id: 5,
      name: "Albert Einstein",
      imageUrl:
        "https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      occupation: "Theoretical Physicist",
    },
    {
      id: 6,
      name: "Rosa Parks",
      imageUrl:
        "https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      occupation: "Civil Rights Activist",
    },
  ];

  return (
    <section className="relative bg-gradient-to-r from-blue-900 to-red-200 py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Floating shapes background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Celebrating <span className="text-yellow-300">Remarkable</span>{" "}
            Individuals
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Discover, honor, and contribute to the legacy of the world's most
            influential figures across history and culture.
          </p>
          {/* <span className="text-xs text-white italic">
            who can also write about yourself or a family member or relative
            whom you think deserved to be known
          </span> */}
        </div>

        {/* Creative image gallery */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {prominentPeople.map((person, index) => (
            <div
              key={person.id}
              className={`relative group overflow-hidden rounded-lg ${index % 3 === 0 ? "h-48 md:h-64" : "h-40 md:h-56"} ${index === 2 || index === 5 ? "transform rotate-3" : index === 1 || index === 4 ? "transform -rotate-3" : ""} shadow-xl transition-all duration-300 hover:scale-105 hover:z-10 hover:shadow-2xl`}>
              <img
                src={person.imageUrl}
                alt={person.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div>
                  <h3 className="text-white font-bold">{person.name}</h3>
                  <p className="text-blue-200 text-sm">{person.occupation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Link
            to="/Prominent-People"
            className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-full shadow-sm text-white bg-yellow-500 hover:bg-yellow-600 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">
            Explore Prominent Figures
            <svg
              className="ml-3 -mr-1 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor">
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};

export default ProminentPeopleBanner;

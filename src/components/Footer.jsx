import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const [email, setEmail] = React.useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle subscribe logic here
    console.log("Subscribed:", email);
    setEmail("");
  };

  return (
    <footer className="bg-[#8B2323] text-white py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Subscribe Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-400/90 p-2 rounded-lg">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-semibold">Subscribe</h3>
            </div>
            <p className="text-white/90">
              Don't miss out on the latest updates and information.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
              <button
                type="submit"
                className="w-32 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-colors duration-200">
                Subscribe
              </button>
            </form>
          </div>

          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">About</h3>
            <p className="text-white/90">
              Your customers are your most important source of feedback.
              Essential Direct allows you to monitor and respond to reviews
              across platforms quickly from one place.
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="hover:underline">
                  About
                </a>
              </li>
              <li>
                <a href="/people" className="hover:underline">
                  People
                </a>
              </li>
              <li>
                <a href="/business" className="hover:underline">
                  Businesses
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:underline">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/Business-ads" className="hover:underline">
                  Business ADs
                </a>
              </li>
            </ul>
          </div>

          {/* Services Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold"> Other Services</h3>
            <ul className="space-y-2">
              <li>
                <a href="/e-jobs" className="hover:underline">
                  E-Jobs
                </a>
              </li>
              <li>
                <a href="/e-budget-hotel" className="hover:underline">
                  E-budget Hotel
                </a>
              </li>
              <li>
                <a href="/e-bnb-hotel" className="hover:underline">
                  E-bnb Hotel
                </a>
              </li>
              <li>
                <a href="/e-short-stay" className="hover:underline">
                  E-short stay
                </a>
              </li>
              <li>
                <a href="/e-venue" className="hover:underline">
                  E-venue
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Row - Now using flex for better organization */}
        <div className="flex flex-col md:flex-row  items-center gap-6 pt-8 border-t border-white/20">
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            <a href="tel:07000555666" className="hover:underline text-lg">
              Tel: 07000555666
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            <a
              href="mailto:info@edirect.ng"
              className="hover:underline text-lg">
              info@edirect.ng
            </a>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            <span className="text-lg">Oosh Sowa</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

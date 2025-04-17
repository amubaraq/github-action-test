import React from "react";
import { CheckCircle, Users, Shield, Globe, TrendingUp } from "lucide-react";

import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const About = () => {
  const { userInfo } = useSelector((state) => state.auth);
  console.log(userInfo);
  return (
    <div className="min-h-screen bg-[#F1FAEE] flex flex-col p-3 md:p-5">
      <main className="flex-1 bg-white shadow-md rounded-lg p-2 md:p-5">
        {/* Header Section */}
        <div className="mb-12 rounded-lg bg-white shadow-lg p-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1D3557] mb-4">
            About Edirect
          </h1>
          <p className="text-[#457B9D] max-w-3xl mx-auto text-lg">
            Connecting Africa, One Trusted Listing at a Time
          </p>
          <p className="text-[#6B7280] max-w-2xl mx-auto mt-2">
            Edirect is Africa’s go-to digital platform, helping 22 million
            people each month find and connect with verified businesses and
            individuals across Nigeria and beyond. We’re all about trust,
            simplicity, and opening doors to opportunity!
          </p>
        </div>

        {/* Who We Are Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#1D3557] mb-6 text-center">
            Your Trusted Partner in Digital Connectivity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md w-auto">
              <Shield className="h-10 w-10 text-[#E63946] mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-[#1D3557] mb-2">
                Built on Trust
              </h3>
              <p className="text-sm text-[#6B7280] max-w-sm">
                Our team checks every listing by hand to make sure it’s real and
                up-to-date. Whether it’s a small shop or a big company, you can
                count on us for reliable info.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <Globe className="h-10 w-10 text-[#E63946] mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-[#1D3557] mb-2">
                Reaching Millions
              </h3>
              <p className="text-sm text-[#6B7280]">
                With 22 million users every month, we’re the bridge that
                connects businesses to customers all over Africa—giving everyone
                a chance to grow.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <TrendingUp className="h-10 w-10 text-[#E63946] mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-[#1D3557] mb-2">
                Growth Assurance
              </h3>
              <p className="text-sm text-[#6B7280]">
                With 22 million users every month, we’re the bridge that
                connects businesses to customers all over Africa—giving everyone
                a chance to grow.
              </p>
            </div>
          </div>
        </section>

        {/* Our Mission Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#1D3557] mb-6 text-center">
            Our Mission
          </h2>
          <div className="bg-white rounded-lg p-6 shadow-md text-center max-w-3xl mx-auto">
            <p className="text-[#6B7280] text-sm md:text-base">
              We’re here to make finding information easy and trustworthy for
              everyone in Africa. Our goal? Build a platform where businesses
              grow, people reconnect, and communities get stronger—using simple
              digital tools that work for all.
            </p>
          </div>
        </section>
        {/* What Sets Us Apart Section */}
        <section className="mb-12 bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-[#1D3557] mb-6 text-center">
            What Makes Edirect Special
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center hover:shadow-sm ">
              <CheckCircle className="h-8 w-8 text-[#E63946] mb-2 mx-auto" />
              <h3 className="text-lg font-semibold text-[#1D3557] mb-2">
                Unrivaled Reach
              </h3>
              <p className="text-sm text-[#6B7280]">
                22 million people use us monthly—your business gets seen far and
                wide!
              </p>
            </div>
            <div className="text-center">
              <CheckCircle className="h-8 w-8 text-[#E63946] mb-2 mx-auto" />
              <h3 className="text-lg font-semibold text-[#1D3557] mb-2">
                Two-in-One Directory
              </h3>
              <p className="text-sm text-[#6B7280]">
                Find businesses like restaurants or shops, or reconnect with
                people—all in one place.
              </p>
            </div>
            <div className="text-center">
              <CheckCircle className="h-8 w-8 text-[#E63946] mb-2 mx-auto" />
              <h3 className="text-lg font-semibold text-[#1D3557] mb-2">
                Hand-Checked Listings
              </h3>
              <p className="text-sm text-[#6B7280]">
                Every profile is carefully checked by our team for 100% real
                info.
              </p>
            </div>
            <div className="text-center">
              <CheckCircle className="h-8 w-8 text-[#E63946] mb-2 mx-auto" />
              <h3 className="text-lg font-semibold text-[#1D3557] mb-2">
                Easy Transactions
              </h3>
              <p className="text-sm text-[#6B7280]">
                Skip the legwork—businesses can show off their stuff and close
                deals online.
              </p>
            </div>
          </div>
        </section>

        {/* Why Edirect Section */}
        <section className="mb-12 bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-[#1D3557] mb-6 text-center">
            Why Choose Edirect?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-[#3c7dd7] mb-2">
                Trust You Can Rely On
              </h3>
              <p className="text-sm text-[#6B7280]">
                We double-check every listing so you only deal with real,
                credible businesses and people.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#3c7dd7] mb-2">
                Grow Your Visibility
              </h3>
              <p className="text-sm text-[#6B7280]">
                Get your business in front of millions, boost your online
                presence, and attract new customers easily.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#3c7dd7] mb-2">
                Fast and Simple
              </h3>
              <p className="text-sm text-[#6B7280]">
                Find services, check contacts, or locate someone in seconds with
                our smart search tools.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#3c7dd7] mb-2">
                Looking Ahead
              </h3>
              <p className="text-sm text-[#6B7280]">
                We’re creating Africa’s most dependable info network—where data
                helps everyone move forward.
              </p>
            </div>
          </div>
        </section>

        {/* Join Us Section */}
        <section className="mb-12 text-center">
          <h2 className="text-2xl font-bold text-[#1D3557] mb-6">
            Join Africa’s Most Trusted Network
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <Users className="h-10 w-10 text-[#E63946] mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-[#1D3557] mb-2">
                For Business Owners
              </h3>
              <p className="text-sm text-[#6B7280]">
                List your business to reach millions, build trust, and grow your
                customer base—fast and hassle-free.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <Users className="h-10 w-10 text-[#E63946] mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-[#1D3557] mb-2">
                For Users
              </h3>
              <p className="text-sm text-[#6B7280]">
                Search with confidence—every result is verified, whether you’re
                finding a service or reconnecting with someone.
              </p>
            </div>
          </div>
          <p className="text-[#6B7280] mt-6">
            Edirect—Where Authenticity Meets Opportunity. Start your journey
            with us today!
          </p>
          <Link to={"/signup"}>
            <button
              type="button"
              disabled={userInfo}
              className="mt-4 inline-block p-2 px-4 hover:scale-105 transition-all duration-300 bg-[#E63946] text-white rounded-full hover:bg-[#D62828] ">
              Join Now
            </button>
          </Link>
        </section>

        {/* About Our Content Section */}
        <section className="mb-12 bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-[#1D3557] mb-6 text-center">
            About Our Content
          </h2>
          <div className="space-y-6 max-w-3xl mx-auto text-[#6B7280] text-sm">
            <p>
              At Edirect, we’re all about being open, accurate, and honest. Our
              platform mixes public records, stuff you share with us, and
              licensed data to help you make smart choices.
            </p>
            <div>
              <h3 className="text-lg font-semibold text-[#3c7dd7]  mb-2">
                Transparency & Accuracy
              </h3>
              <p>
                We use public info like business names and addresses, keep
                private details safe, and update our records regularly with help
                from official sources.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#3c7dd7]  mb-2">
                You Help Us Grow
              </h3>
              <p>
                Photos, videos, and business details come from users like you.
                Some stuff is borrowed from others, but it’s all about building
                a community we can trust.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#3c7dd7]  mb-2">
                Your Part
              </h3>
              <p>
                Use our info wisely and legally. Double-check important stuff
                yourself, and feel free to link to us—just give us a shoutout!
              </p>
            </div>
            <p>
              Questions? Reach out to us at{" "}
              <a
                href="mailto:support@edirect.com"
                className="text-[#457B9D] hover:underline">
                support@edirect.com
              </a>
              .
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;

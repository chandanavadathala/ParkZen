import React from "react";
import { Search, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="font-sans text-gray-800 bg-[#f8fafc]">

      {/* Navbar */}
      <header className="flex items-center justify-between px-8 py-4 bg-white shadow-sm">
        <h1 className="text-2xl font-semibold text-emerald-600">ParkZen</h1>

        <nav className="flex items-center gap-6 text-sm font-medium">
          <a href="#dashboard" className="hover:text-emerald-600">Dashboard</a>
          <a href="#help" className="hover:text-emerald-600 transition">Help</a>
          <a href="#search" className="hover:text-emerald-600">Search</a>

          <Link
            to="/login"
            className="flex items-center gap-2 px-4 py-2 text-white bg-emerald-500 rounded-full hover:bg-emerald-600 transition"
          >
            <User size={16} />
            Login / Signup
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="px-8 py-16 text-center bg-gradient-to-b from-emerald-50 to-white">
        <h2 className="mb-4 text-4xl font-bold">Find Parking Easily & Quickly</h2>
        <p className="mb-10 text-gray-600">
          Search, reserve, and park without confusion
        </p>

        <div className="flex flex-col items-center justify-center gap-4 p-6 bg-white shadow-md rounded-2xl md:flex-row">
          <input
            type="text"
            placeholder="Place"
            className="w-full px-4 py-3 border rounded-xl md:w-48 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <input
            type="date"
            className="w-full px-4 py-3 border rounded-xl md:w-48 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <button className="flex items-center justify-center gap-2 px-6 py-3 text-white bg-emerald-500 rounded-xl hover:bg-emerald-600">
            <Search size={18} />
            Search
          </button>
        </div>
      </section>

      {/* Why Choose ParkZen */}
      <section className="px-8 py-16">
        <h3 className="mb-8 text-3xl font-semibold text-center">
          Why Choose ParkZen?
        </h3>

        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Real-time Availability",
              desc: "Live parking slot updates reduce waiting time and confusion."
            },
            {
              title: "Smart Search",
              desc: "AI-powered recommendations for best nearby parking."
            },
            {
              title: "Secure & Easy",
              desc: "OTP login, QR entry, and seamless payments."
            }
          ].map((item, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <h4 className="mb-2 text-xl font-semibold">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="px-8 py-16 bg-emerald-50">
        <h3 className="mb-4 text-3xl font-semibold">About ParkZen</h3>
        <p className="max-w-3xl text-gray-700">
          ParkZen is a smart parking management platform that helps users find
          and reserve parking spaces in real time. It eliminates unnecessary
          searching, reduces traffic congestion, and saves valuable time.
        </p>
      </section>

      {/* How It Works */}
      <section className="px-8 py-20 bg-gradient-to-b from-emerald-50 to-white">
        <h3 className="mb-12 text-3xl font-semibold text-center text-emerald-700">
          How It Works
        </h3>

        <div className="grid gap-8 md:grid-cols-4 text-center max-w-6xl mx-auto">
          {[
            { step: 1, title: "Search", desc: "Enter destination & date" },
            { step: 2, title: "Select", desc: "Choose best parking" },
            { step: 3, title: "Reserve", desc: "Book instantly" },
            { step: 4, title: "Park", desc: "Scan & park easily" },
          ].map((item) => (
            <div
              key={item.step}
              className="group p-6 bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-bold text-lg group-hover:bg-emerald-500 group-hover:text-white transition">
                {item.step}
              </div>
              <h4 className="mb-2 font-semibold text-lg">{item.title}</h4>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* UPDATED FAQ SECTION */}
      <section className="px-8 py-20 bg-gradient-to-b from-white to-emerald-50">
        <h3 className="mb-12 text-3xl font-semibold text-center text-emerald-700">
          Frequently Asked Questions
        </h3>

        <div className="max-w-4xl mx-auto grid gap-6">
          {[
            {
              q: "Is ParkZen free to use?",
              a: "Yes, searching for parking spaces on ParkZen is completely free."
            },
            {
              q: "Can I reserve a parking slot in advance?",
              a: "Yes, advance reservations are available, especially during peak hours."
            },
            {
              q: "Is ParkZen safe and secure?",
              a: "Yes, ParkZen uses secure authentication and trusted payment gateways."
            },
            {
              q: "Can I cancel my parking booking?",
              a: "Yes, bookings can be cancelled from the My Bookings section."
            },
            {
              q: "What payment methods are supported?",
              a: "Credit/Debit cards, UPI, and popular mobile wallets are supported."
            }
          ].map((faq, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg transition"
            >
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                {faq.q}
              </h4>
              <p className="text-sm text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer id="help" className="bg-gray-100 px-8 py-10 text-gray-600">
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">

          <div>
            <h4 className="mb-3 text-lg font-semibold text-gray-800">ParkZen</h4>
            <p className="text-sm">
              Smart parking platform to find, reserve, and manage parking spaces efficiently.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-lg font-semibold text-gray-800">Admin Office</h4>
            <p className="text-sm">
              ParkZen Technologies Pvt. Ltd.<br />
              Madhapur, Hyderabad,<br />
              Telangana – 500081
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-lg font-semibold text-gray-800">Contact Admin</h4>
            <p className="text-sm mb-2">📞 +91 98765 43210</p>
            <p className="text-sm mb-3">
              📧
              <a href="mailto:admin@parkzen.com" className="ml-1 text-emerald-600 hover:underline">
                admin@parkzen.com
              </a>
            </p>
            <a
              href="mailto:admin@parkzen.com?subject=ParkZen%20Support%20Query"
              className="inline-block px-4 py-2 text-sm text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition"
            >
              Send Mail to Admin
            </a>
          </div>
        </div>

        <div className="mt-10 text-center text-sm text-gray-500 border-t pt-4">
          © 2026 ParkZen. All rights reserved.
        </div>
      </footer>

    </div>
  );
}
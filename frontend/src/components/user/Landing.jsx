import React, { useState } from "react";
import { Link } from "react-router-dom"; // Use React Router Link for navigation
import { motion } from "framer-motion";

export default function AnimatedLandingPage() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a2e]">
      {/* Header Section */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-4"
      >
        <nav className="flex justify-end space-x-8">
        
          <Link to="/login" className="text-white hover:text-gray-300">
            Login
          </Link>
          <Link to="/register" className="text-white hover:text-gray-300">
            Register
          </Link>
        </nav>
      </motion.header>

      {/* Main Section */}
      <main className="flex-grow flex items-center">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row-reverse items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:w-1/2 mb-8 lg:mb-0 lg:pl-12" // Adding padding to separate text and animation
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4">
              Welcome to <br />
              <span className="text-[#f0f0f0]">StartX</span>
            </h1>
            <p className="text-lg text-gray-300 mb-6 max-w-md">
            Comprehensive Startup Progress Dashboard: Track Financial Performance, Revenue, and Expenses with Real-Time Charts and Milestone Updates for Strategic Growth Insights.            </p>
            <motion.button
              className={`px-6 py-2 text-lg font-semibold rounded-md transition-colors duration-300 ${
                isHovered
                  ? "bg-white text-[#0a0a2e]"
                  : "bg-transparent text-white border-2 border-white"
              }`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to= {"/home"} >Get Started</Link>
            </motion.button>
          </motion.div>

          {/* Animated Video Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="lg:w-1/2 relative mb-8 lg:mb-0"
          >
            <div className="w-full h-[400px] relative overflow-hidden rounded-3xl">
              <motion.div
                animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
                transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
                className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-500 rounded-3xl"
              ></motion.div>
              <motion.div
                animate={{ rotate: [0, -360], scale: [1, 1.2, 1] }}
                transition={{ duration: 25, repeat: Infinity, repeatType: "reverse" }}
                className="absolute inset-0 bg-gradient-to-tr from-pink-500 to-orange-400 rounded-3xl"
              ></motion.div>
              <div className="absolute inset-0 flex items-center justify-center">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-3/4 h-3/4 object-cover rounded-2xl"
                >
                  <source src="/startx-logo-animation.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer Section */}
      <motion.footer
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-[#080820] text-white py-8"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h2 className="text-2xl font-bold mb-4">StartX</h2>
              <p className="text-gray-400">Empowering innovation, one startup at a time.</p>
            </div>
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
             
                <li>
                  <Link to="/register" className="hover:text-gray-300">
                    Register
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="hover:text-gray-300">
                    Login
                  </Link>
                </li>
              </ul>
            </div>
            <div className="w-full md:w-1/3">
              <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                {/* Social Media Links */}
                <a href="#" className="text-white hover:text-gray-300">
                  <span className="sr-only">Facebook</span>
                  {/* Facebook Icon SVG */}
                </a>
                <a href="#" className="text-white hover:text-gray-300">
                  <span className="sr-only">Twitter</span>
                  {/* Twitter Icon SVG */}
                </a>
                <a href="#" className="text-white hover:text-gray-300">
                  <span className="sr-only">GitHub</span>
                  {/* GitHub Icon SVG */}
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
'use client'

import React from 'react'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom' // Import useNavigate from react-router-dom
import { motion } from 'framer-motion'

export default function Navbar({ setActiveComponent }) {
  const navigate = useNavigate() // Use useNavigate instead of useRouter

  const Logout = () => {
    Cookies.remove('user')
    Cookies.remove('startup')
    navigate('/') // Use navigate for redirection
  }

  const navItems = [
    { name: 'Startup Details', action: () => setActiveComponent('details') },
    { name: 'EIR Application', action: () => setActiveComponent('eir') },
    { name: 'Grants Application', action: () => setActiveComponent('grant') },
    { name: 'Messages', action: () => setActiveComponent('messages') },
    { name: 'Monthly Progress', action: () => setActiveComponent('monthly') },
  ]

  return (
    <motion.header
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-900 text-white"
    >
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <motion.h1
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-red-600"
          >
            StartX
          </motion.h1>
          <div className="flex items-center space-x-4 ml-auto"> {/* Added ml-auto for right alignment */}
            {navItems.map((item) => (
              <motion.button
                key={item.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-white/10 transition-colors duration-200"
                onClick={item.action}
              >
                {item.name}
              </motion.button>
            ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-3 py-2 rounded-md text-sm font-medium bg-red-600 hover:bg-red-700 transition-colors duration-200"
              onClick={Logout}
            >
              Log Out
            </motion.button>
          </div>
        </nav>
      </div>
    </motion.header>
  )
}

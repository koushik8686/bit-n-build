'use client';

import Cookie from 'js-cookie';
import React from 'react';
import { motion } from 'framer-motion';
import { Home, Users, FileText, Mail, ChevronRight, LogOut, Megaphone, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { name: 'EIR Requests', icon: Users },
  { name: 'grantrequests', icon: FileText },
  { name: 'Logout', icon: LogOut }, 
];

export default function Navbar({ selectedTab, setSelectedTab, isExpanded, setIsExpanded }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookie.remove('reviewer');
    navigate('/'); // Redirect after logout
  };

  return (
    <motion.div
      initial={{ width: 250 }}
      animate={{ width: isExpanded ? 250 : 80 }}
      transition={{ duration: 0.3 }}
      className="h-screen bg-gradient-to-b from-teal-600 via-teal-500 to-green-500 text-white shadow-lg"
      >
      <div className="p-6">
        <motion.h1
          initial={{ opacity: 1 }}
          animate={{ opacity: isExpanded ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-2xl font-bold"
        >
          {isExpanded ? 'Reviewer Dashboard' : ''}
        </motion.h1>
      </div>
      <div className="flex justify-between p-4">
        <motion.button
          onClick={() => setIsExpanded(!isExpanded)} // Close/expand nav on click
          className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight size={24} className={!isExpanded ? '' : 'rotate-180'} />
        </motion.button>
      </div>
      <nav className="mt-8 flex-1">
        {navItems.map((item) => (
          <motion.button
            key={item.name}
            onClick={() => {
              if (item.name === 'Logout') {
                handleLogout(); // Call handleLogout for Logout button
              } else {
                setSelectedTab(item.name.toLowerCase().replace(' ', ''));
              }
            }}
            className={`w-full text-left p-4 flex items-center space-x-4 hover:bg-white/10 transition-colors ${
              selectedTab === item.name.toLowerCase().replace(' ', '') ? 'bg-white/20' : ''
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <item.icon size={24} />
            <motion.span
              initial={{ opacity: 1 }}
              animate={{ opacity: isExpanded ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isExpanded ? item.name : ''}
            </motion.span>
          </motion.button>
        ))}
      </nav>
    </motion.div>
  );
}

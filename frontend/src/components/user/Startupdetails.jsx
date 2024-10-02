"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function StartupDetails({ kyc, progress }) {
  // Limit the progress to 4 items
  const limitedProgress = progress.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row gap-8 p-8 bg-gradient-to-b from-gray-200 to-gray-300 h-screen" // Light theme gradient
    >
      {/* Left column: Startup Details */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-lg overflow-auto" // Light background for the details
      >
        <h2 className="text-5xl font-extrabold text-gray-800 mb-4">Startup Details</h2>
        <div className="space-y-4 text-gray-700 text-xl">
          <p><strong>Company Name:</strong> {kyc.company_name}</p>
          <p><strong>Address:</strong> {kyc.address}</p>
          <p><strong>Contact Person:</strong> {kyc.contact_person.name}</p>
          <p><strong>Email:</strong> {kyc.contact_person.email}</p>
          <p><strong>Phone:</strong> {kyc.contact_person.phone}</p>
          <p><strong>Industry:</strong> {kyc.company_details.industry}</p>
          <p>
            <strong>Website:</strong>{" "}
            <a 
              href={kyc.company_details.website} 
              target="_blank" 
              rel="noreferrer" 
              className="text-teal-600 hover:text-teal-800 transition-colors duration-300" // Teal link color
            >
              {kyc.company_details.website}
            </a>
          </p>
        </div>
      </motion.div>

      {/* Right column: Progress List */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="w-full md:w-1/2 overflow-auto h-full"
      >
        <h3 className="text-2xl font-bold mb-4 text-gray-800">Latest Progress</h3>
        <div className="space-y-4 max-h-96 overflow-y-auto bg-white p-4 rounded-lg shadow-md"> {/* White background for clarity */}
          {limitedProgress.map((monthData, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 * (index + 1), duration: 0.5 }}
              className="p-4 rounded-lg bg-gradient-to-r from-teal-100 to-teal-100 shadow-md" // Teal gradient for progress items
            >
              <h4 className="text-lg font-semibold text-gray-800">{monthData.month}</h4>
              <div className="text-gray-700 space-y-2">
                <p><strong>Milestone:</strong> {monthData.milestones}</p>
                <p><strong>Issues:</strong> {monthData.issues_faced}</p>
                <div className="flex justify-between">
                  <p><strong>Revenue:</strong> ${monthData.financials.revenue}</p>
                  <p><strong>Expenses:</strong> ${monthData.financials.expenses}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

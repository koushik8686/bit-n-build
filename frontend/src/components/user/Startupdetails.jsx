'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import Cookie from 'js-cookie'

export default function StartupDetails({ kyc, progress }) {
  const limitedProgress = progress.slice(0, 4)
  const [ad, setAds] = useState([])

  const startup = Cookie.get('startup')
  // Fetch ads data
  async function fetchAd() {
    try {
      const response = await axios.get('http://localhost:4000/ads/get/ad')
      setAds(response.data)
    } catch (error) {
      console.error("Error fetching ads:", error)
    }
  }


  // Handle ad click
  async function handleAdClick(adId, link) {
    try {
      // Send POST request on ad click
      await axios.post(`http://localhost:4000/ads/click/${adId}` , {startup})
      window.open(link, '_blank')
    } catch (error) {
      console.error("Error handling ad click:", error)
    }
  }
  useEffect(() => {
    fetchAd()
    const adInterval = setInterval(() => {
      fetchAd()
    }, 5000)

    // Clear interval on component unmount
    return () => clearInterval(adInterval)
  }, [])

  return (
    <div className="container mx-auto p-4 space-y-6 bg-gray-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Left column: Startup Details */}
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-md overflow-hidden">
          <div className="p-4 md:p-5">
            <div className="flex items-center space-x-3 pb-3">
              <div className="w-20 h-20 rounded-full overflow-hidden shadow-sm">
                <img 
                  src={`http://localhost:4000/uploads/profiles/${kyc.profile_picture}`} 
                  alt={kyc.company_name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">{kyc.company_name}</h2>
                <p className="text-gray-500 text-sm">{kyc.company_details.industry}</p>
              </div>
            </div>
            <div className="space-y-3 text-gray-600 text-sm">
              <p><strong>Address:</strong> {kyc.address}</p>
              <p><strong>Contact Person:</strong> {kyc.contact_person.name}</p>
              <p><strong>Email:</strong> {kyc.contact_person.email}</p>
              <p><strong>Phone:</strong> {kyc.contact_person.phone}</p>
              <p>
                <strong>Website:</strong>{" "}
                <a 
                  href={kyc.company_details.website} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-teal-500 hover:text-teal-700 transition-colors duration-300"
                >
                  {kyc.company_details.website}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Right column: Progress List */}
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-md overflow-hidden">
          <div className="p-4 md:p-5">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">Latest Progress</h3>
            <div className="space-y-3 max-h-72 overflow-y-auto">
              {limitedProgress.map((monthData, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  className="p-3 rounded-lg bg-teal-100 shadow-sm"
                >
                  <h4 className="text-base font-medium text-gray-800">{monthData.month}</h4>
                  <div className="space-y-1 text-gray-600 text-sm">
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
          </div>
        </div>
      </motion.div>

      {/* Ads Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg overflow-hidden p-4 md:p-5"
      >
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Sponsored Ads</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => handleAdClick(ad._id, ad.companyLink)}
              className="relative cursor-pointer aspect-video rounded-lg overflow-hidden shadow-md transition-transform duration-300 hover:shadow-lg"
            >
              <img
                src={`http://localhost:4000/uploads/ads/${ad.AdImgUrl}`}
                className="object-cover w-full h-full"
                alt={ad.adverCompanyName}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gray-900 bg-opacity-50 p-2 text-white text-sm text-center">
                {ad.description}
              </div>
            </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

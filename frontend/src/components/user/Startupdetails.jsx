'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import Cookie from 'js-cookie'

export default function StartupDetails({ kyc, progress }) {
  const limitedProgress = progress.slice(0, 4)
  const [ad, setAds] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    company_name: kyc.company_name || '',
    industry: kyc.company_details.industry || '',
    address: kyc.address || '',
    contact_name: kyc.contact_person.name || '',
    contact_email: kyc.contact_person.email || '',
    contact_phone: kyc.contact_person.phone || '',
    website: kyc.company_details.website || '',
    incorporation_date: kyc.company_details.incorporation_date || '',
    pan_number: kyc.company_details.pan_number || '',
    about: kyc.company_details.about || ''
  })

  const [updatedKYC, setUpdatedKYC] = useState(kyc)

  const startup = Cookie.get('startup')

  // Fetch ads data
  async function fetchAd() {
    try {
      const response = await axios.get('http://localhost:4000/ads/get/ad')
      setAds(response.data)
    } catch (error) {
      console.error('Error fetching ads:', error)
    }
  }

  // Handle ad click
  async function handleAdClick(adId, link) {
    try {
      await axios.post(`http://localhost:4000/ads/click/${adId}`, { startup })
      window.open(link, '_blank')
    } catch (error) {
      console.error('Error handling ad click:', error)
    }
  }

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle form submission
  const handleSubmit = () => {
  // Update the state with the new form data
  setUpdatedKYC({
    ...updatedKYC,
    company_name: formData.company_name,
    address: formData.address,
    company_details: {
      ...updatedKYC.company_details,
      industry: formData.industry,
      website: formData.website,
      incorporation_date: formData.incorporation_date,
      pan_number: formData.pan_number,
      about: formData.about
    },
    contact_person: {
      name: formData.contact_name,
      email: formData.contact_email,
      phone: formData.contact_phone
    }
  });

  setIsEditing(false);

  // Send POST request to the backend with updated details
  fetch(`http://localhost:4000/user/home/${formData.company_name}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      company_name: formData.company_name,
      address: formData.address,
      company_details: {
        industry: formData.industry,
        website: formData.website,
        incorporation_date: formData.incorporation_date,
        pan_number: formData.pan_number,
        about: formData.about
      },
      contact_person: {
        name: formData.contact_name,
        email: formData.contact_email,
        phone: formData.contact_phone
      }
    })
  })
    .then(response => response.json())
    .then(data => {
      // Handle successful response
      console.log('Data updated successfully:', data);
    })
    .catch(error => {
      // Handle error
      console.error('Error updating data:', error);
    });
};


  useEffect(() => {
    fetchAd()
    const adInterval = setInterval(() => {
      fetchAd()
    }, 5000)

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
            {isEditing ? (
  <form className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700">Company Name</label>
      <input
        type="text"
        name="company_name"
        value={formData.company_name}
        onChange={handleInputChange}
        disabled // This makes the field visible but not editable
        className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Industry</label>
      <input
        type="text"
        name="industry"
        value={formData.industry}
        onChange={handleInputChange}
        disabled // This makes the field visible but not editable
        className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Address</label>
      <input
        type="text"
        name="address"
        value={formData.address}
        onChange={handleInputChange}
        className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Contact Name</label>
      <input
        type="text"
        name="contact_name"
        value={formData.contact_name}
        onChange={handleInputChange}
        className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Email</label>
      <input
        type="email"
        name="contact_email"
        value={formData.contact_email}
        onChange={handleInputChange}
        disabled // This makes the field visible but not editable
        className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Phone</label>
      <input
        type="text"
        name="contact_phone"
        value={formData.contact_phone}
        onChange={handleInputChange}
        className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Website</label>
      <input
        type="text"
        name="website"
        value={formData.website}
        onChange={handleInputChange}
        className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Incorporation Date</label>
      <input
        type="date"
        name="incorporation_date"
        value={formData.incorporation_date}
        onChange={handleInputChange}
        className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">PAN Number</label>
      <input
        type="text"
        name="pan_number"
        value={formData.pan_number}
        onChange={handleInputChange}
        className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">About</label>
      <textarea
        name="about"
        value={formData.about}
        onChange={handleInputChange}
        className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm"
      ></textarea>
    </div>
    <button
      type="button"
      className="px-4 py-2 bg-teal-500 text-white rounded-md shadow hover:bg-teal-600 transition duration-300"
      onClick={handleSubmit}
    >
      Save
    </button>
  </form>
) : (
  <div>
    <div className="flex items-center justify-between pb-3">
      <div className="flex items-center space-x-3">
        <div className="w-20 h-20 rounded-full overflow-hidden shadow-sm">
          <img
            src={`http://localhost:4000/uploads/profiles/${updatedKYC.profile_picture}`}
            alt={updatedKYC.company_name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">{updatedKYC.company_name}</h2>
          <p className="text-gray-500 text-sm">{updatedKYC.company_details.industry}</p>
        </div>
      </div>
      <button
        className="px-4 py-2 bg-teal-500 text-white rounded-md shadow hover:bg-teal-600 transition duration-300"
        onClick={() => setIsEditing(true)}
      >
        Edit
      </button>
    </div>
    <div className="space-y-3 text-gray-600 text-sm">
      <p><strong>Address:</strong> {updatedKYC.address}</p>
      <p><strong>Contact Person:</strong> {updatedKYC.contact_person.name} ({updatedKYC.contact_person.email}, {updatedKYC.contact_person.phone})</p>
      <p><strong>Website:</strong> {updatedKYC.company_details.website}</p>
      <p><strong>Incorporation Date:</strong> {new Date(updatedKYC.company_details.incorporation_date).toLocaleDateString()}</p>
      <p><strong>PAN Number:</strong> {updatedKYC.company_details.pan_number}</p>
      <p><strong>About:</strong> {updatedKYC.company_details.about}</p>
    </div>
  </div>
)}

          </div>
        </div>

        {/* Right Column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
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

        {/* Ad Section */}
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
      </motion.div>
    </div>
  )
}

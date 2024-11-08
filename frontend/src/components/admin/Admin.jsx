'use client'

import Cookie from 'js-cookie'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import AdminNavbar from './AdminNavbar'
import EIRRequests from './EirRequests'
import GrantApplicationComponent from './GrantRequests'
import StartupMessages from './Messages'
import AdsComponent from './Ads'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import Reviewrs from './Reviewrs'
import Reviewers from './Reviewrs'


export default function Admin() {
  const [selectedTab, setSelectedTab] = useState('startups')
  const [isExpanded, setIsExpanded] = useState(true)
  const [startups, setStartups] = useState([])
  const [eirRequests, setEirRequests] = useState([])
  const [grantRequests, setGrantRequests] = useState([])
  const [visibleDetails, setVisibleDetails] = useState(null)

  useEffect(() => {
    fetch('admin/startups')
      .then((response) => response.json())
      .then((data) => setStartups(data))
      .catch((error) => console.error('Error fetching startups:', error))
  }, [])
  const navigate = useNavigate()
  useEffect(() => {
    fetch('admin/eir-requests')
      .then((response) => response.json())
      .then((data) => setEirRequests(data))
      .catch((error) => console.error('Error fetching EIR requests:', error))
  }, [])

  useEffect(() => {
    fetch('admin/grant-requests')
      .then((response) => response.json())
      .then((data) => setGrantRequests(data.reverse()))
      .catch((error) => console.error('Error fetching grant requests:', error))
  }, [])
  useEffect(() => {
   const admin= Cookie.get('admin')
   if (!admin){
    navigate('/admin/login')
   }
  }, [])
  const toggleDetails = (startupId) => {
    setVisibleDetails((prevId) => (prevId === startupId ? null : startupId))
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminNavbar
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />

      <div className="flex-1 p-8 overflow-auto">
        {selectedTab === 'startups' && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-purple-800">Startups</h2>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                    <th className="py-3 px-4 text-left">Company Name</th>
                    <th className="py-3 px-4 text-left">Industry</th>
                    <th className="py-3 px-4 text-left">Created At</th>
                    <th className="py-3 px-4 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {startups.map((startup) => (
                    <React.Fragment key={startup._id}>
                      <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">{startup.kyc?.company_name || 'N/A'}</td>
                        <td className="py-3 px-4">{startup.kyc?.company_details?.industry || 'N/A'}</td>
                        <td className="py-3 px-4">
                          {startup.kyc.created_at
                            ? new Date(startup.kyc.created_at).toLocaleDateString()
                            : 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          <motion.button
                            onClick={() => toggleDetails(startup._id)}
                            className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-md hover:from-purple-700 hover:to-indigo-700 transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            {visibleDetails === startup._id ? (
                              <>
                                Hide Details
                                <ChevronUp className="ml-2" size={16} />
                              </>
                            ) : (
                              <>
                                View Details
                                <ChevronDown className="ml-2" size={16} />
                              </>
                            )}
                          </motion.button>
                        </td>
                      </tr>
                      <AnimatePresence>
                        {visibleDetails === startup._id && (
                          <motion.tr
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <td colSpan={4}>
                              <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50">
                                <h3 className="text-xl font-semibold mb-4 text-purple-800">
                                  {startup.kyc?.company_name || 'N/A'} Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <DetailItem label="Industry" value={startup.kyc?.company_details?.industry} />
                                  <DetailItem label="Website" value={startup.kyc?.company_details?.website} />
                                  <DetailItem label="Contact Person" value={startup.kyc?.contact_person?.name} />
                                  <DetailItem label="Contact Email" value={startup.kyc?.contact_person?.email} />
                                  <DetailItem label="Contact Phone" value={startup.kyc?.contact_person?.phone} /> 
                                  <Link  className="  font-semibold text-purple-700"  to={`/progress/${startup._id}`}>Progress</Link>
                                </div>
                              </div>
                            </td>
                          </motion.tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedTab === 'eirrequests' && <EIRRequests eirRequests={eirRequests} />}

        {selectedTab === 'grantsrequests' && <GrantApplicationComponent grantSchemes={grantRequests} />}
       
        {selectedTab === 'reviewers' && <Reviewers />}

        {selectedTab === 'messages' && <StartupMessages />}

        {selectedTab === 'ads' && <AdsComponent />}
      </div>
    </div>
  )
}

function DetailItem({ label, value }) {
  return (
    <div className="mb-2">
      <span className="font-semibold text-purple-700">{label}:</span>{' '}
      <span className="text-gray-800">{value || 'N/A'}</span>
    </div>
  )
}


// Admin.jsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookie from 'js-cookie'
import EIRRequests from './Eir'
import GrantRequests from './Grants'
import Navbar from './Navbar'
import axios from 'axios'

export default function ReviewerHome() {
  const [selectedTab, setSelectedTab] = useState('eirrequests')
  const [eirRequests, setEirRequests] = useState([])
  const [grantRequests, setGrantRequests] = useState([])
  const [isExpanded, setIsExpanded] = useState(true)
  const reviewer = Cookie.get('reviewer')


  const navigate = useNavigate()

  useEffect(() => {
    if (!reviewer) {
      navigate('/reviewer/login')
    }
  }, [navigate])

  return (
    <div className="flex h-screen bg-gray-100">
      <Navbar
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />

      <div className="flex-1 p-8 overflow-auto">
        {selectedTab === 'eirrequests' && <EIRRequests eirRequests={eirRequests} />}
        {selectedTab === 'grantrequests' && <GrantRequests grantRequests={grantRequests} />}
      </div>
    </div>
  )
}

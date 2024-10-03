import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import Cookies from 'js-cookie'
import { Navigate, useNavigate } from 'react-router-dom'

export default function Component() {
  const [isLoading, setIsLoading] = useState(false)
  const [showKYCForm, setShowKYCForm] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const navigate = useNavigate()
  const [kycDetails, setKycDetails] = useState({
    company_name: '',
    address: '',
    contact_person_name: '',
    contact_person_email: '',
    contact_person_phone: '',
    incorporation_date: '',
    industry: '',
    website: '',
    user: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const { data } = await axios.post(`/auth/register`, { username, password, email })
      alert(data.message)
      if (data.message === "Registration successful!") {
        Cookies.set('user', data.userId)
        setKycDetails({ ...kycDetails, user: data.userId })
        setShowKYCForm(true)
      }
    } catch (error) {
      alert('An error occurred during registration.')
    }
    setIsLoading(false)
  }

  const handleKYCSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const { data } = await axios.post(`/auth/kyc`, kycDetails)
      alert('KYC submitted successfully!')
      Cookies.set('startup', data.startup)
      navigate('/home')
    } catch (error) {
      alert('An error occurred during KYC submission.')
    }
    setIsLoading(false)
  }

  useEffect(() => {
    const canvas = document.getElementById('bgCanvas')
    const ctx = canvas.getContext('2d')

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles = []
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        vx: Math.random() * 2 - 1,
        vy: Math.random() * 2 - 1
      })
    }

    let animationFrameId

    function animate() {
      animationFrameId = requestAnimationFrame(animate)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(particle => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(0, 112, 192, 0.5)' // Dark bluish color
        ctx.fill()
      })
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a192f] p-4 relative"> {/* Dark bluish background */}
      <canvas id="bgCanvas" className="absolute top-0 left-0 w-full h-full" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="rounded-lg overflow-hidden shadow-2xl bg-white bg-opacity-90">
          <div className="bg-gradient-to-r from-[#0f4c75] to-[#1b262c] p-8 text-white"> {/* Dark bluish gradient */}
            <h2 className="text-3xl font-bold text-center mb-2">Welcome</h2>
            <p className="text-center text-blue-100">Sign up to continue</p>
          </div>
          <div className="p-8">
            {!showKYCForm ? (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                    <input 
                      id="username" 
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input 
                      id="email" 
                      type="email" 
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input 
                      id="password" 
                      type="password" 
                      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                    />
                  </div>
                  <button 
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0f4c75] hover:bg-[#1b262c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    type="submit" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Loading...' : 'Register'}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-2xl font-bold mb-4">Complete KYC</h3>
                <form onSubmit={handleKYCSubmit} className="space-y-4">
                  {Object.entries(kycDetails).map(([key, value]) => (
                    key !== 'user' && (
                      <div key={key} className="space-y-2">
                        <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                          {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </label>
                        <input 
                          id={key}
                          type={key.includes('date') ? 'date' : key.includes('email') ? 'email' : 'text'}
                          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          value={value}
                          onChange={(e) => setKycDetails({ ...kycDetails, [key]: e.target.value })}
                          required 
                        />
                      </div>
                    )
                  ))}
                  <button 
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0f4c75] hover:bg-[#1b262c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    type="submit" 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Submitting...' : 'Submit KYC'}
                  </button>
                </form>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

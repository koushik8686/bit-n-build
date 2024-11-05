import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import Cookies from 'js-cookie'
import { Link, useNavigate } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import { FcGoogle } from 'react-icons/fc'
import Loader from '../Loader'

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
  })
 const user = Cookies.get('user')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      console.log(username);
      const { data } = await axios.post(`http://localhost:4000/auth/register`, { username, password, email })
      alert(data.message)
      if (data.message === "Registration successful!") {
        Cookies.set('user', data.userId)
        setKycDetails({ ...kycDetails, user: data.userId })
        setShowKYCForm(true)
      }
    } catch (error) {
      console.log(error);
      alert('An error occurred during registration.')
    }
    setIsLoading(false)
  }

  const handleKYCSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    // Append all fields from kycDetails to the FormData
    Object.entries(kycDetails).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Append the user ID stored in cookies  
    try {
      const response = await fetch('http://localhost:4000/auth/kyc', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        console.log('KYC submitted successfully!', result);
        navigate('/home');
      } else {
        console.log('Error submitting KYC:', result.message);
      }
    } catch (error) {
      console.error('Failed to submit KYC:', error);
    }
  };
  
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
        ctx.fillStyle = 'rgba(72, 207, 203, 0.5)' // #48CFCB with opacity
        ctx.fill()
      })
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])
  const responsegoogle = async (authtesult) => {
    try {
      console.log(authtesult);
      if (authtesult) {
        const response = await axios.get(`http://localhost:4000/auth/google`, { params: { tokens: authtesult } });
        if (response.data.message) {
          if (response.data.message === 'Email Already Exists') {
            Cookies.set('user', response.data.userId);
            setKycDetails({ ...kycDetails, user: response.data.userId })
            console.log(kycDetails);
            Cookies.set('startup', response.data.startup);
             navigate('/home')
          }
          Cookies.set('user', response.data.userId);
          setKycDetails({ ...kycDetails, user: response.data.userId })
          console.log('Registration successful:', response.data);
          setShowKYCForm(!showKYCForm)
        }
      }
    } catch (error) {
      console.log("error is ", error);
    }
  }

  const googlelogin = useGoogleLogin({
    onSuccess: responsegoogle,
    onError: responsegoogle,
  });
  
  
  return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] p-4 relative">
        <canvas id="bgCanvas" className="absolute top-0 left-0 w-full h-full" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="rounded-2xl overflow-hidden shadow-2xl bg-white">
            <div className="bg-[#229799] p-8 text-white">
              <h6 className="text-2xl font-bold text-center mb-2">Please Provide Us With Start Up Details</h6>
            </div>
            <div className="p-8 space-y-6">
              {!showKYCForm ? (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="username" className="block text-sm font-medium text-[#424242]">Username</label>
                      <input 
                        id="username" 
                        className="mt-1 block w-full px-4 py-3 bg-[#F5F5F5] border border-[#48CFCB] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#229799] focus:border-transparent text-[#424242] placeholder-[#424242]"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required 
                        placeholder="Enter your username"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium text-[#424242]">Email</label>
                      <input 
                        id="email" 
                        type="email" 
                        className="mt-1 block w-full px-4 py-3 bg-[#F5F5F5] border border-[#48CFCB] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#229799] focus:border-transparent text-[#424242] placeholder-[#424242]"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="password" className="block text-sm font-medium text-[#424242]">Password</label>
                      <input 
                        id="password" 
                        type="password" 
                        className="mt-1 block w-full px-4 py-3 bg-[#F5F5F5] border border-[#48CFCB] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#229799] focus:border-transparent text-[#424242] placeholder-[#424242]"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                        placeholder="Enter your password"
                      />
                    </div>
                    <button 
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#229799] hover:bg-[#48CFCB] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#48CFCB] transition-colors duration-200"
                      type="submit" 
                      disabled={isLoading}
                    >
                      {isLoading ? <Loader/> : 'Register'}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <form onSubmit={handleKYCSubmit} className="space-y-6">
                  <div className="space-y-2">
                  {Object.entries(kycDetails).map(([key, value]) => (
                    (key !== 'user' && key!='profile_pic') && (
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
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="profile_pic" className="block text-sm font-medium text-[#424242]">Profile Picture</label>
                    <input
                      id="profile_pic"
                      type="file"
                      className="mt-1 block w-full px-4 py-3 bg-[#F5F5F5] border border-[#48CFCB] rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#229799] focus:border-transparent text-[#424242] placeholder-[#424242]"
                      onChange={(e) => setKycDetails({ ...kycDetails, profile_pic: e.target.files[0] })}
                      required
                    />
                  </div>
                  <button
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#229799] hover:bg-[#48CFCB] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#48CFCB] transition-colors duration-200"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Submitting KYC...' : 'Submit KYC'}
                  </button>
                </form>
              </motion.div>
              
              )}
              <div className="relative flex items-center justify-center mt-8">
                <span className="absolute inset-x-0 h-px bg-[#48CFCB]"></span>
                <span className="relative px-4 text-sm text-[#424242] bg-white">or</span>
              </div>
            
             
                  <button
                    onClick={googlelogin}
                    className="mt-4 flex items-center justify-center w-full py-3 px-4 border border-[#48CFCB] rounded-lg shadow-sm text-sm font-medium text-[#424242] bg-white hover:bg-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#48CFCB] transition-colors duration-200"
                  >
                    <FcGoogle className="mr-2" /> Sign in with Google
                  </button>

              <Link to={'/login'}>Login</Link>
            </div>
          </div>
        </motion.div>
      </div>
  )
}
'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, ChevronRight, ArrowLeft, MessageCircle } from 'lucide-react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import io from 'socket.io-client'

const socket = io("http://localhost:4000")

export default function StartupMessages() {
  const [startups, setStartups] = useState([])
  const [selectedStartup, setSelectedStartup] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [unreadMessages, setUnreadMessages] = useState({})
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const response = await axios.get('/admin/startups')
        setStartups(response.data)
      } catch (error) {
        console.error('Error fetching startups:', error)
      }
    }

    fetchStartups()

    socket.on('receiveMessage', (messageData) => {
      console.log("Message received: ", messageData)
      setMessages((prevMessages) => (prevMessages ? [...prevMessages, messageData] : [messageData]))
      setUnreadMessages((prev) => ({
        ...prev,
        [messageData.roomId]: (prev[messageData.roomId] || 0) + 1
      }))
    })

    socket.on('connect', () => {
      console.log('Connected to the server with ID:', socket.id)
    })

    return () => {
      socket.off('receiveMessage')
      socket.off('connect')
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleStartupClick = async (startupId) => {
    setSelectedStartup(startupId)
    socket.emit('joinRoom', startupId)
    
    try {
      const response = await axios.get(`/admin/messages/${startupId}`)
      setMessages(response.data.messsages || [])
      setUnreadMessages((prev) => ({ ...prev, [startupId]: 0 }))
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const handleBackToStartups = () => {
    setSelectedStartup(null)
  }

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return
    const newMessage = {
      message: inputMessage,
      sender: 'admin',
      roomId: selectedStartup,
    }
    socket.emit('sendMessage', {
      roomId: selectedStartup,
      messageData: newMessage,
    })
    // setMessages((prevMessages) => [...prevMessages, newMessage])
    setInputMessage('')
  }

  const handleBroadcastMessage = () => {
    if (inputMessage.trim() === '') return
    console.log("broadcasting message", inputMessage)
    const newMessage = {
      message: inputMessage,
      sender: 'admin',
    }
    socket.emit('BroadcastMessage', {
      messageData: newMessage,
    })
    setInputMessage('')
  }

  return (
    <div className="flex flex-col h-screen bg-purple-50">
      <AnimatePresence mode="wait">
        {selectedStartup ? (
          <motion.div
            key="chat"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col h-full"
          >
            <div id='hi' className=" p-4 flex items-center text-bla">
              <button
                onClick={handleBackToStartups}
                className="mr-4 hover:text-purple-200 focus:outline-none transition-colors duration-200"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h2 className="text-xl font-bold">
                {startups.find((s) => s._id === selectedStartup)?.kyc.company_name}
              </h2>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
                >
                  <span
                    className={`inline-block p-3 rounded-lg ${
                      message.sender === 'admin'
                        ? 'bg-purple-500 text-white'
                        : 'bg-white text-purple-800 shadow'
                    }`}
                  >
                    {message.message}
                  </span>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-white shadow-inner">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                >
                  <Send className="h-5 w-5" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="startups"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col h-full"
          >
            <div className="bg-purple-400 p-4 text-white">
              <h1 className="text-2xl font-bold">Startups</h1>
            </div>
            <div className="p-4 bg-white text-black shadow">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Broadcast message..."
                  className="flex-1 p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBroadcastMessage}
                  className="bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                >
                  <Send className="h-5 w-5" />
                </motion.button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ul>
                {startups.map((startup) => (
                  <motion.li
                    key={startup._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-b last:border-b-0"
                  >
                    <button
                      className="w-full p-4 text-left hover:bg-purple-100 flex justify-between items-center focus:outline-none focus:bg-purple-100 transition-colors duration-200"
                      onClick={() => handleStartupClick(startup._id)}
                    >
                      <div>
                        <h2 className="font-semibold text-blue-800">{startup.kyc.company_name}</h2>
                      </div>
                      <div className="flex items-center">
                        {unreadMessages[startup._id] > 0 && (
                          <span className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full mr-2">
                            {unreadMessages[startup._id]}
                          </span>
                        )}
                        <ChevronRight className="h-5 w-5 text-purple-400" />
                      </div>
                    </button>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
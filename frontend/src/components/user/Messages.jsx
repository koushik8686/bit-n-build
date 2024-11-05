'use client'

import React, { useState, useEffect, useRef } from 'react'
import Cookies from 'js-cookie'
import axios from 'axios'
import { io } from 'socket.io-client'
import { Send, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const socket = io("http://localhost:4000")

export default function ImprovedChat({ initialMessages = [] }) {
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const startup = Cookies.get('startup')
    if (startup) {
      socket.emit('joinRoom', startup)
      console.log(`User joined room: ${startup}`)
    } else {
      console.error('User ID not found in cookies.')
    }

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/admin/messages/${startup}`)
        setMessages(response.data.messsages || [])
      } catch (error) {
        console.error('Error fetching messages:', error)
        setMessages([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchMessages()

    const receiveMessageListener = (message) => {
      setMessages((prevMessages) => [...prevMessages, message])
      scrollToBottom()
    }

    socket.on('receiveMessage', receiveMessageListener)

    return () => {
      socket.off('receiveMessage', receiveMessageListener)
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const messageData = {
        message: newMessage,
        sender: 'User',
        receiver: 'admin',
        date_sent: new Date(),
      }

      const startup = Cookies.get('startup')
      if (startup) {
        socket.emit('sendMessage', { roomId: startup, messageData })
        setNewMessage('')
        scrollToBottom()
        inputRef.current?.focus()
      } else {
        console.error('User ID not found in cookies.')
      }
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-[90vh] w-full max-w-4xl mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg shadow-lg overflow-hidden">
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ maxHeight: '75vh' }}>
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.sender === 'User' ? 'justify-end' : 'justify-start'}`}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 rounded-lg max-w-xs lg:max-w-lg ${
                    msg.sender === 'admin'
                      ? 'bg-blue-500 text-white'
                      : 'bg-green-500 text-white'
                  }`}
                >
                  <p className="text-sm font-semibold">{msg.sender === 'User' ? 'You' : msg.sender}</p>
                  <p className="mt-1 text-sm lg:text-base">{msg.message}</p>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      )}

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-4 bg-white shadow-lg"
      >
        <div className="flex items-center space-x-2">
          <textarea
            ref={inputRef}
            className="flex-1 p-3 border border-gray-300 bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out resize-none"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={1}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
            onClick={handleSendMessage}
          >
            <Send size={20} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
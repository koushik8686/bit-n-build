'use client'

import { useState } from 'react'
import { Send, ChevronRight, ArrowLeft } from 'lucide-react'

// Mock data for startups
const startups = [
  { id: 1, name: 'TechNova' },
  { id: 2, name: 'GreenEnergy' },
  { id: 3, name: 'HealthAI' },
  { id: 4, name: 'SpaceX' },
  { id: 5, name: 'FinTech Solutions' },
]

// Mock data for messages
const initialMessages = {
  1: [
    { id: 1, text: 'Hello TechNova!', sender: 'user' },
    { id: 2, text: 'Hi there! How can we help?', sender: 'startup' },
  ],
  2: [
    { id: 1, text: 'Interested in your green solutions', sender: 'user' },
  ],
  3: [
    { id: 1, text: 'Can you tell me more about your AI in healthcare?', sender: 'user' },
  ],
  4: [
    { id: 1, text: 'When is the next rocket launch?', sender: 'user' },
  ],
  5: [
    { id: 1, text: 'I\'d like to know about your financial products', sender: 'user' },
  ],
}

export default function StartupMessages() {
  const [selectedStartup, setSelectedStartup] = useState(null)
  const [messages, setMessages] = useState(initialMessages)
  const [inputMessage, setInputMessage] = useState('')
  const [broadcastMessage, setBroadcastMessage] = useState('')
  const [unreadMessages, setUnreadMessages] = useState({})

  const handleStartupClick = (startupId) => {
    setSelectedStartup(startupId)
    // Mark messages as read when the startup is selected
    setUnreadMessages(prev => ({ ...prev, [startupId]: 0 }))
  }

  const handleBackToStartups = () => {
    setSelectedStartup(null)
  }

  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return

    setMessages(prevMessages => ({
      ...prevMessages,
      [selectedStartup]: [
        ...(prevMessages[selectedStartup] || []),
        { id: Date.now(), text: inputMessage, sender: 'user' }
      ]
    }))
    
    // Update unread messages count
    setUnreadMessages(prev => ({
      ...prev,
      [selectedStartup]: (prev[selectedStartup] || 0) + 1
    }))
    
    setInputMessage('')
  }

  const handleBroadcastMessage = () => {
    if (broadcastMessage.trim() === '') return

    const newMessages = { ...messages }
    startups.forEach(startup => {
      newMessages[startup.id] = [
        ...(newMessages[startup.id] || []),
        { id: Date.now(), text: broadcastMessage, sender: 'user' }
      ]
      // Increment unread messages count for each startup
      setUnreadMessages(prev => ({
        ...prev,
        [startup.id]: (prev[startup.id] || 0) + 1
      }))
    })
    setMessages(newMessages)
    setBroadcastMessage('')
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {selectedStartup ? (
        // Chat view
        <div className="flex flex-col h-full">
          <div className="bg-white p-4 flex items-center border-b">
            <button
              onClick={handleBackToStartups}
              className="mr-4 text-blue-500 hover:text-blue-600 focus:outline-none"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-bold">
              {startups.find(s => s.id === selectedStartup)?.name}
            </h2>
            {unreadMessages[selectedStartup] > 0 && (
              <span className="ml-2 bg-red-500 text-white px-2 rounded-full text-sm">
                {unreadMessages[selectedStartup]} Unread
              </span>
            )}
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            {messages[selectedStartup]?.map(message => (
              <div
                key={message.id}
                className={`mb-4 ${
                  message.sender === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <span
                  className={`inline-block p-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-300'
                  }`}
                >
                  {message.text}
                </span>
              </div>
            ))}
          </div>
          <div className="p-4 border-t flex">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : (
        // Startups list view
        <div className="flex flex-col h-full">
          <div className="p-4 bg-white border-b">
            <h2 className="text-xl font-bold mb-4">Broadcast Message</h2>
            <textarea
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="Type a message to send to all startups..."
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              rows={4}
            />
            <button
              onClick={handleBroadcastMessage}
              className="w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Send to All Startups
            </button>
          </div>
          <h1 className="text-2xl font-bold p-4 bg-white border-b">Startups</h1>
          <div className="flex-1 overflow-y-auto">
            <ul>
              {startups.map(startup => (
                <li
                  key={startup.id}
                  className="border-b last:border-b-0"
                >
                  <button
                    className="w-full p-4 text-left hover:bg-gray-100 flex justify-between items-center focus:outline-none focus:bg-gray-100"
                    onClick={() => handleStartupClick(startup.id)}
                  >
                    <span>{startup.name}</span>
                    {unreadMessages[startup.id] > 0 && (
                      <span className="bg-red-500 text-white px-2 rounded-full text-sm">
                        {unreadMessages[startup.id]} Unread
                      </span>
                    )}
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

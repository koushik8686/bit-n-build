'use client';

import { useState, useEffect } from 'react';
import { Send, ChevronRight, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { io } from 'socket.io-client';

export default function StartupMessages() {
  const [startups, setStartups] = useState([]);
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [unreadMessages, setUnreadMessages] = useState({});
  const socket = io.connect("http://localhost:4000");

  // Fetch startups on component mount
  useEffect(() => {
    const fetchStartups = async () => {
      try {
        const response = await axios.get('/admin/startups');
        setStartups(response.data);
      } catch (error) {
        console.error('Error fetching startups:', error);
      }
    };

    fetchStartups();

    // Socket event listener for receiving messages
    socket.on('receiveMessage', (messageData) => {
      console.log("Message received: ", messageData);
      // Add the new message to the messages array
      setMessages((prevMessages) => [...prevMessages, messageData]);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
      socket.off('receiveMessage');
    };
  }, []);

  // Handle startup selection and message fetching
  const handleStartupClick = (startupId) => {
    setSelectedStartup(startupId);
    socket.emit('joinRoom', startupId);
    
    // Fetch messages for the selected startup
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/admin/messages/${startupId}`);
        setMessages(response.data.messsages); // Ensure this matches the API response structure
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
    setUnreadMessages((prev) => ({ ...prev, [startupId]: 0 }));
  };

  // Handle back button click
  const handleBackToStartups = () => {
    setSelectedStartup(null);
  };

  // Handle sending a single message
  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;

    // Send message through socket
    socket.emit('sendMessage', {
      roomId: selectedStartup, // Use roomId as your event structure
      messageData: {
        message: inputMessage,
        sender: 'user',
      },
    });

    // Update unread messages count
    setUnreadMessages((prev) => ({
      ...prev,
      [selectedStartup]: (prev[selectedStartup] || 0) + 1,
    }));

    setInputMessage('');
  };

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
              {startups.find((s) => s._id === selectedStartup)?.kyc.company_name}
            </h2>
            {unreadMessages[selectedStartup] > 0 && (
              <span className="ml-2 bg-red-500 text-white px-2 rounded-full text-sm">
                {unreadMessages[selectedStartup]} Unread
              </span>
            )}
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
              >
                <span
                  className={`inline-block p-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-300'
                  }`}
                >
                  {message.message} {/* Update to access message correctly */}
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
          <h1 className="text-2xl font-bold p-4 bg-white border-b">Startups</h1>

          <div className="flex-1 overflow-y-auto">
            <ul>
              {startups.map((startup) => (
                <li key={startup._id} className="border-b last:border-b-0">
                  <button
                    className="w-full p-4 text-left hover:bg-gray-100 flex justify-between items-center focus:outline-none focus:bg-gray-100"
                    onClick={() => handleStartupClick(startup._id)}
                  >
                    <h2>{startup._id}</h2>
                    <span>{startup.kyc.company_name}</span>
                    {unreadMessages[startup._id] > 0 && (
                      <span className="bg-red-500 text-white px-2 rounded-full text-sm">
                        {unreadMessages[startup._id]} Unread
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
  );
}

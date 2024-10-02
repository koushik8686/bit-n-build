
import { useState, useEffect } from 'react';
import { Send, ChevronRight, ArrowLeft } from 'lucide-react';
import axios from 'axios';
const io = require('socket.io-client');
const socket = io.connect("http://localhost:4000");

export default function StartupMessages() {
  const [startups, setStartups] = useState([]);
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [unreadMessages, setUnreadMessages] = useState({});

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
      setMessages((prevMessages) => (prevMessages ? [...prevMessages, messageData] : [messageData]));
    });
    
  
    socket.on('connect', () => {
      console.log('Connected to the server with ID:', socket.id);
    });
  
    // Cleanup the socket on unmount to avoid memory leaks
    return () => {
      socket.off('receiveMessage');
      socket.off('connect');
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
  };

  // Handle back button click
  const handleBackToStartups = () => {
    setSelectedStartup(null);
  };

  // Handle sending a single message
  const handleSendMessage = () => {
    if (inputMessage.trim() === '') return;
    const newMessage = {
      message: inputMessage,
      sender: 'admin',
    };
    // Send message through socket
    socket.emit('sendMessage', {
      roomId: selectedStartup, // Use roomId as your event structure
      messageData: newMessage,  // Send the constructed message
    });
    // Add the new message to the messages array locally

    setInputMessage('');
  };
  const BroadcastMessage = () => {
    if (inputMessage.trim() === '') return;
    console.log("broadcasting message" , inputMessage);
    const newMessage = {
      message: inputMessage,
      sender: 'admin',
    };
    // Send message through socket
    socket.emit('BroadcastMessage', {
      roomId: selectedStartup, // Use roomId as your event structure
      messageData: newMessage,  // Send the constructed message
    });
    // Add the new message to the messages array locally
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
            
          </div>
          <div className="flex-1 p-4 overflow-y-auto">
            { messages&& messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
              >
                <span
                  className={`inline-block p-2 rounded-lg ${
                    message.sender === 'admin'
                      ? 'bg-blue-500 text-white text-right'
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
          <input onChange={(e)=>setInputMessage(e.target.value)} type='text' />
          <button onClick={BroadcastMessage}>Send to all</button>
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

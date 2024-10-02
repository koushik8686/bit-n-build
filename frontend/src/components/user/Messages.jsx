import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie'; // Import the js-cookie library
const io = require('socket.io-client');
const socket = io.connect("http://localhost:4000");

export default function Messages({ initialMessages }) {
  const [messages, setMessages] = useState(initialMessages || []);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Check for the user's ID from cookies
    const startup = Cookies.get('startup'); // Get the user ID from cookies
 
    // Join the room based on the user's ID
    if (startup) {
      socket.emit('joinRoom', startup);
      console.log(`User joined room: ${startup}`);
    } else {
      console.error('User ID not found in cookies.');
    }

    // Listen for incoming messages
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Listen for 'connect' event to confirm connection
    socket.on('connect', () => {
      console.log('Connected to the server with ID:', socket.id);
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.off('receiveMessage');
      socket.off('connect');
    };
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const messageData = {
        message: newMessage,
        sender: 'User',
        receiver: 'admin', // Indicate the message is for the admin
        date_sent: new Date(),
      };

      // Get the user's ID from cookies
      const startup = Cookies.get('startup'); // Assuming this is the same as startup
      if (startup) {
        // Emit 'sendMessage' event to server with the user's ID and message data
        socket.emit('sendMessage', { roomId: startup, messageData });
        // Optionally update UI immediately before confirmation from the server
        setNewMessage(''); // Clear the input field
      } else {
        console.error('User ID not found in cookies.');
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Messages</h2>
      <div className="messages-box max-h-64 overflow-y-auto mb-4">
        {messages.map((msg, index) => (
          <div key={index} className="mt-4">
            <p><strong>{msg.sender}:</strong> {msg.message}</p>
            <p><strong>Date Sent:</strong> {new Date(msg.date_sent).toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center mt-4">
        <input
          type="text"
          className="flex-1 p-2 border border-gray-300 rounded-md mr-2"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}

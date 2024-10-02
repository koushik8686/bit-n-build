import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Send } from 'lucide-react';

const socket = io("http://localhost:4000");

export default function ImprovedChat({ initialMessages = [] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);  // Reference to scroll to bottom

  useEffect(() => {
    const startup = Cookies.get('startup');
    if (startup) {
      socket.emit('joinRoom', startup);
      console.log(`User joined room: ${startup}`);
    } else {
      console.error('User ID not found in cookies.');
    }

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/admin/messages/${startup}`);
        setMessages(response.data.messsages); 
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    const receiveMessageListener = (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      scrollToBottom();  // Scroll to bottom after receiving a new message
    };

    socket.on('receiveMessage', receiveMessageListener);

    return () => {
      socket.off('receiveMessage', receiveMessageListener);
    };
  }, []);

  // Scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();  // Ensure to scroll after mounting messages
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const messageData = {
        message: newMessage,
        sender: 'User',
        receiver: 'admin',
        date_sent: new Date(),
      };

      const startup = Cookies.get('startup');
      if (startup) {
        socket.emit('sendMessage', { roomId: startup, messageData });
        setNewMessage('');
        scrollToBottom();  // Scroll after sending the message
      } else {
        console.error('User ID not found in cookies.');
      }
    }
  };

  return (
    <div className="flex flex-col h-[90vh] w-full max-w-4xl mx-auto bg-gray-100 rounded-lg shadow-lg overflow-hidden">
      {/* Message Box with Fixed Height and Overflow Scroll */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ maxHeight: '75vh', overflowY: 'scroll' }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'User' ? 'justify-end' : 'justify-start'} transition-all duration-300 ease-in-out`}
          >
            <div
              className={`p-4 rounded-lg max-w-xs lg:max-w-lg ${
                msg.sender === 'admin'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              } `}
            >
              <p className="text-sm font-semibold">{msg.sender === 'User' ? 'You' : msg.sender}</p>
              <p className="mt-1 text-sm lg:text-base">{msg.message}</p>
              <p className="text-xs opacity-70 mt-2">{new Date(msg.date_sent).toLocaleString()}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} /> {/* Scroll target */}
      </div>

      {/* Input Box */}
      <div className="p-4 bg-background">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            className="flex-1 p-3 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-300 ease-in-out"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            className="bg-primary text-primary-foreground p-3 rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring transition-all duration-300 ease-in-out"
            onClick={handleSendMessage}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

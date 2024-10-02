import React, { useState, useEffect } from 'react';
import { socket } from '../../socket'; // Ensure this path is correct

export default function Messages({ initialMessages }) {
  const [messages, setMessages] = useState(initialMessages || []);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Listen for 'connect' event to confirm connection
    socket.on('connect', () => {
      console.log('Connected to the server with ID:', socket.id);
    });

    // Listen for incoming messages
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.off('connect');
      socket.off('receiveMessage');
      socket.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const messageData = {
        message: newMessage,
        date_sent: new Date(),
      };

      // Emit 'sendMessage' event to server
      socket.emit('sendMessage', messageData);

      // Optionally update UI immediately before confirmation from the server
      setMessages([...messages, messageData]);

      setNewMessage(''); // Clear the input field
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
            <p><strong>Message:</strong> {msg.message}</p>
            <p><strong>Date Sent:</strong> {new Date(msg.date_sent).toDateString()}</p>
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

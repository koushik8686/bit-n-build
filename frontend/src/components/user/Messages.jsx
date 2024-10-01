import React from 'react';

export default function Messages({ messages }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Messages</h2>
      {messages.map((msg, index) => (
        <div key={index} className="mt-4">
          <p><strong>Message:</strong> {msg.message}</p>
          <p><strong>Date Sent:</strong> {new Date(msg.date_sent).toDateString()}</p>
        </div>
      ))}
    </div>
  );
}

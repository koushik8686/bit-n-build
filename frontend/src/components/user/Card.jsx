// Card.js
import React from 'react';

export function Card({ children, className }) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children }) {
  return (
    <div className="border-b border-gray-200 mb-2 pb-2">
      {children}
    </div>
  );
}

export function CardContent({ children }) {
  return <div>{children}</div>;
}

export function CardTitle({ children, className }) {
  return (
    <h2 className={`text-xl font-semibold ${className}`}>
      {children}
    </h2>
  );
}

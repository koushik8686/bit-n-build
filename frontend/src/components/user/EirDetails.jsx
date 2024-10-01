import React from 'react';

export default function EIRDetails({ eir }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">EIR Application</h2>
      <p><strong>Status:</strong> {eir.status}</p>
      {eir.interview_date && <p><strong>Interview Date:</strong> {new Date(eir.interview_date).toDateString()}</p>}
    </div>
  );
}

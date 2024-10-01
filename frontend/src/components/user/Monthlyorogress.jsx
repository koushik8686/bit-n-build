import React from 'react';

export default function MonthlyProgress({ progress }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Monthly Progress</h2>
      {progress.map((monthData, index) => (
        <div key={index} className="mt-4">
          <h4 className="text-lg font-semibold">{monthData.month}</h4>
          <p><strong>Milestone:</strong> {monthData.milestones[0].title} - {monthData.milestones[0].description}</p>
          <p><strong>Issues:</strong> {monthData.issues_faced[0]?.description || 'No issues reported'}</p>
          <p><strong>Revenue:</strong> ${monthData.financials.revenue}</p>
          <p><strong>Expenses:</strong> ${monthData.financials.expenses}</p>
        </div>
      ))}
    </div>
  );
}

import React, { useState } from 'react';

const MonthlyForm = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [month, setMonth] = useState('');
  const [milestones, setMilestones] = useState('');
  const [issues, setIssues] = useState('');
  const [financials, setFinancials] = useState({ revenue: '', expenses: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your submit logic here
    setMonthlyData([
      ...monthlyData,
      {
        month,
        milestones,
        issues,
        financials: { ...financials },
      },
    ]);
    setMonth('');
    setMilestones('');
    setIssues('');
    setFinancials({ revenue: '', expenses: '' });
    setFormVisible(false);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Monthly Progress Report</h2>
      <button
        onClick={() => setFormVisible(!formVisible)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        {formVisible ? 'Cancel' : 'New Monthly Form'}
      </button>
      {formVisible && (
        <form onSubmit={handleSubmit} className="mb-4">
          <input
            type="text"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            placeholder="Month"
            required
            className="border border-gray-300 rounded px-4 py-2 mr-2"
          />
          <textarea
            value={milestones}
            onChange={(e) => setMilestones(e.target.value)}
            placeholder="Milestones Achieved"
            required
            className="border border-gray-300 rounded px-4 py-2 mr-2"
          />
          <textarea
            value={issues}
            onChange={(e) => setIssues(e.target.value)}
            placeholder="Issues Faced"
            required
            className="border border-gray-300 rounded px-4 py-2 mr-2"
          />
          <input
            type="number"
            value={financials.revenue}
            onChange={(e) => setFinancials({ ...financials, revenue: e.target.value })}
            placeholder="Revenue"
            className="border border-gray-300 rounded px-4 py-2 mr-2"
          />
          <input
            type="number"
            value={financials.expenses}
            onChange={(e) => setFinancials({ ...financials, expenses: e.target.value })}
            placeholder="Expenses"
            className="border border-gray-300 rounded px-4 py-2 mr-2"
          />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
            Submit
          </button>
        </form>
      )}
      <h3 className="text-lg font-semibold">Submitted Monthly Reports:</h3>
      <ul className="list-disc pl-5">
        {monthlyData.map((data, index) => (
          <li key={index}>
            <strong>{data.month}:</strong> {data.milestones} | {data.issues}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MonthlyForm;

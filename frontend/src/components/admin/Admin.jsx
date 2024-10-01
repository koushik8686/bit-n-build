import { useState } from 'react';

const startups = [
  { id: 1, name: "TechInnovate", industry: "AI", status: "Active" },
  { id: 2, name: "GreenEnergy", industry: "Renewable Energy", status: "Pending" },
  { id: 3, name: "HealthTech", industry: "Healthcare", status: "Active" },
];

const dummyEirRequests = [
    {
        _id: '1',
        entrepreneur: {
          name: 'John Doe',
          background: '10 years in the tech industry.',
          previous_ventures: ['TechHub', 'InnoVenture'],
          industry_experience: 'Technology and AI',
        },
        objectives: {
          mentorship_startups: ['StartupA', 'StartupB'],
          personal_goals: 'Grow mentorship network and launch a new product.',
        },
        startup_progress: [
          {
            startup_name: 'InnoVenture',
            milestones: [
              { title: 'Prototype Launched', achieved_date: '2023-05-15' },
              { title: 'Secured Seed Funding', achieved_date: '2023-08-20' },
            ],
          },
        ],
        created_at: '2023-04-10',
      },
 
    // You can add more dummy data objects here...
  ];
  
  // Placeholder function to handle accept/reject actions
  const handleAction = (id, action) => {
    console.log(`Request ID: ${id} - Action: ${action}`);
    // Make your API call here (e.g., POST/PUT request to update status in MongoDB)
  };

const grantRequests = [
  { id: 1, startup: "HealthTech", amountRequested: 50000, status: "Approved" },
  { id: 2, startup: "TechInnovate", amountRequested: 75000, status: "Applied" },
];

const messages = [
  { id: 1, startup: "GreenEnergy", message: "Monthly report submitted", date: "2024-01-28" },
  { id: 2, startup: "TechInnovate", message: "EIR interview scheduled", date: "2024-01-30" },
];

export default function Admin() {
  const [selectedTab, setSelectedTab] = useState('startups');
  const [selectedStartup, setSelectedStartup] = useState(null);

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f3f4f6' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', backgroundColor: '#fff', boxShadow: '2px 0 5px rgba(0,0,0,0.1)' }}>
        <div style={{ padding: '20px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>Admin Dashboard</h1>
        </div>
        <nav style={{ marginTop: '20px' }}>
          <button style={navButtonStyle} onClick={() => setSelectedTab('startups')}>Startups</button>
          <button style={navButtonStyle} onClick={() => setSelectedTab('eir')}>EIR Requests</button>
          <button style={navButtonStyle} onClick={() => setSelectedTab('grants')}>Grant Requests</button>
          <button style={navButtonStyle} onClick={() => setSelectedTab('messages')}>Messages</button>
        </nav>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, padding: '20px', overflow: 'auto' }}>
        {selectedTab === 'startups' && (
          <div>
            <h2>Startups</h2>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Industry</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {startups.map((startup) => (
                  <tr key={startup.id}>
                    <td>{startup.name}</td>
                    <td>{startup.industry}</td>
                    <td>{startup.status}</td>
                    <td>
                      <button onClick={() => setSelectedStartup(startup)}>View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {selectedStartup && (
              <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
                <h3>{selectedStartup.name} Details</h3>
                <p><strong>Industry:</strong> {selectedStartup.industry}</p>
                <p><strong>Status:</strong> {selectedStartup.status}</p>
              </div>
            )}
          </div>
        )}

{selectedTab === 'eir' && (
  <div>
    {dummyEirRequests.map((request) => (
      <div key={request._id} style={bigBoxStyle}>
        <h2 style={headerStyle}>{request.entrepreneur.name}'s Request</h2>

        {/* Entrepreneur Details */}
        <h3>Entrepreneur Details</h3>
        <p><strong>Name:</strong> {request.entrepreneur.name}</p>
        <p><strong>Background:</strong> {request.entrepreneur.background}</p>
        <p><strong>Previous Ventures:</strong> {request.entrepreneur.previous_ventures.join(', ') || 'None'}</p>
        <p><strong>Industry Experience:</strong> {request.entrepreneur.industry_experience || 'N/A'}</p>

        {/* Objectives */}
        <h3>Objectives</h3>
        <p><strong>Mentorship Startups:</strong> {request.objectives.mentorship_startups.join(', ')}</p>
        <p><strong>Personal Goals:</strong> {request.objectives.personal_goals}</p>

        {/* Startup Progress */}
        <h3>Startup Progress</h3>
        {request.startup_progress.map((progress, index) => (
          <div key={index}>
            <p><strong>Startup Name:</strong> {progress.startup_name}</p>
            <p><strong>Current Stage:</strong> {progress.current_stage}</p>
          </div>
        ))}

        {/* Accept/Reject Buttons */}
        <div style={buttonContainerStyle}>
          <button style={buttonStyle}>Accept</button>
          <button style={{ ...buttonStyle, backgroundColor: 'red' }}>Reject</button>
        </div>
      </div>
    ))}
  </div>
)}

{selectedTab === 'grants' && (
  <div>
    <h2>Grant Requests</h2>
    <table style={tableStyle}>
      <thead>
        <tr>
          <th>Startup</th>
          <th>Amount Requested</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {grantRequests.map((request) => (
          <tr key={request.id}>
            <td>{request.startup}</td>
            <td>${request.amountRequested}</td>
            <td>{request.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

{selectedTab === 'messages' && (
  <div>
    <h2>Messages</h2>
    <table style={tableStyle}>
      <thead>
        <tr>
          <th>Startup</th>
          <th>Message</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {messages.map((message) => (
          <tr key={message.id}>
            <td>{message.startup}</td>
            <td>{message.message}</td>
            <td>{message.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
      </div>
    </div>
  );
}

// Simple styling for the table

const bigBoxStyle = {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    marginTop: '20px',
  };
  const headerStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  };
  
  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
  };
  const buttonContainerStyle = {
    marginTop: '20px',
  };
  
  const buttonStyle = {
    padding: '10px 20px',
    marginRight: '10px',
    backgroundColor: 'green',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  };
  
    
const navButtonStyle = {
  display: 'block',
  width: '100%',
  padding: '10px 20px',
  backgroundColor: '#f3f4f6',
  border: 'none',
  textAlign: 'left',
  cursor: 'pointer',
  fontSize: '16px',
  margin: '2px 0',
  borderLeft: '3px solid transparent',
};

navButtonStyle.hover = {
  backgroundColor: '#e2e3e5',
};


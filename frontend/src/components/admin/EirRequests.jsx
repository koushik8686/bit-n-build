// EIRRequests.js
import React from 'react';

const EIRRequests = ({ dummyEirRequests }) => {
  const renderRequestItem = (request) => {
    return (
      <div style={bigBoxStyle}>
        <h2 style={headerStyle}>{request.entrepreneur?.name}'s Request</h2>

        {/* Entrepreneur Details */}
        <h3>Entrepreneur Details</h3>
        <p><strong>Name:</strong> {request.entrepreneur?.name}</p>
        <p><strong>Background:</strong> {request.entrepreneur?.background}</p>
        <p><strong>Previous Ventures:</strong> {request.entrepreneur?.previous_ventures?.join(', ') || 'None'}</p>
        <p><strong>Industry Experience:</strong> {request.entrepreneur?.industry_experience || 'N/A'}</p>

        {/* Objectives */}
        <h3>Objectives</h3>
        <p><strong>Mentorship Startups:</strong> {request.objectives?.mentorship_startups?.join(', ') || 'None'}</p>
        <p><strong>Personal Goals:</strong> {request.objectives?.personal_goals || 'N/A'}</p>

        {/* Startup Progress */}
        <h3>Startup Progress</h3>
        {request.startup_progress?.map((progress, index) => (
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
    );
  };

  return (
    <div>
      {dummyEirRequests.map(renderRequestItem)}
    </div>
  );
};

// Simple styling for the EIRRequests component
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

export default EIRRequests;

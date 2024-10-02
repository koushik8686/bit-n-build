import React, { useEffect, useState } from 'react';

const EIRRequests = ({ eirRequests }) => {
  const [loading, setLoading] = useState(false); // Loading state if needed
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    // No need to fetch data again, as it's passed down as props
  }, []); // No dependencies needed since we're getting data from props

  const handleAccept = (requestId) => {
    // Add your logic for accepting the request
    console.log(`Accepted request with ID: ${requestId}`);
  };

  const handleReject = (requestId) => {
    // Add your logic for rejecting the request
    console.log(`Rejected request with ID: ${requestId}`);
  };

  const renderRequestItem = (request) => {
    return (
      <div style={bigBoxStyle} key={request._id}>
        <h2 style={headerStyle}>{request.entrepreneur?.name}'s Request</h2>
        <p><strong>Entrepreneur:</strong> {request.entrepreneur?.name || 'N/A'}</p>
        <p><strong>Business Idea:</strong> {request.business_idea || 'N/A'}</p>
        <p><strong>Summary:</strong> {request.summary || 'N/A'}</p>
        <div style={buttonContainerStyle}>
          <button style={acceptButtonStyle} onClick={() => handleAccept(request._id)}>Accept</button>
          <button style={rejectButtonStyle} onClick={() => handleReject(request._id)}>Reject</button>
        </div>
      </div>
    );
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      <h2 style={{ color: '#333', marginBottom: '15px' }}>EIR Requests</h2>
      {eirRequests.length > 0 ? (
        eirRequests.map(renderRequestItem)
      ) : (
        <p>No EIR requests available.</p>
      )}
    </div>
  );
};

// Example styling
const bigBoxStyle = {
  border: '1px solid #ccc',
  borderRadius: '5px',
  padding: '15px',
  marginBottom: '20px',
  backgroundColor: '#f9f9f9',
};

const headerStyle = {
  marginBottom: '10px',
  color: '#007bff',
};

const buttonContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '10px',
};

const acceptButtonStyle = {
  backgroundColor: '#28a745',
  color: '#fff',
  padding: '10px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const rejectButtonStyle = {
  backgroundColor: '#dc3545',
  color: '#fff',
  padding: '10px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

export default EIRRequests;

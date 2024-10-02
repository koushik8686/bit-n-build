import { useEffect, useState } from 'react';
import EIRRequests from './EirRequests';
import GrantApplicationComponent from './GrantRequests';
import StartupMessages from './Messages';

export default function Admin() {
  const [selectedTab, setSelectedTab] = useState('startups');
  const [startups, setStartups] = useState([]);
  const [eirRequests, setEirRequests] = useState([]);
  const [grantRequests, setGrantRequests] = useState([]);
  const [visibleDetails, setVisibleDetails] = useState(null);

  // Fetch startup data when the component mounts
  useEffect(() => {
    fetch('admin/startups')
      .then((response) => response.json())
      .then((data) => setStartups(data))
      .catch((error) => console.error('Error fetching startups:', error));
  }, []);

  // Fetch EIR requests data
  useEffect(() => {
    fetch('admin/eir-requests')
      .then((response) => response.json())
      .then((data) => setEirRequests(data))
      .catch((error) => console.error('Error fetching EIR requests:', error));
  }, []);

  // Fetch Grant requests data
  useEffect(() => {
    fetch('admin/grant-requests')
      .then((response) => response.json())
      .then((data) => setGrantRequests(data))
      .catch((error) => console.error('Error fetching grant requests:', error));
  }, []);

  // Toggle the visibility of startup details
  const toggleDetails = (startupId) => {
    setVisibleDetails((prevId) => (prevId === startupId ? null : startupId));
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f3f4f6' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', backgroundColor: '#4a90e2', boxShadow: '2px 0 5px rgba(0,0,0,0.1)', color: '#fff' }}>
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
            <h2 style={{ color: '#333', marginBottom: '15px' }}>Startups</h2>
            <table style={tableStyle}>
              <thead>
                <tr style={{ backgroundColor: '#007bff', color: '#fff' }}>
                  <th>Company Name</th>
                  <th>Industry</th>
                  <th>Grant Created At</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {startups.map((startup) => (
                  <tr key={startup._id}>
                    <td>{startup.kyc?.company_name || 'N/A'}</td>
                    <td>{startup.kyc?.company_details?.industry || 'N/A'}</td>
                    <td>{startup.grants?.[0]?.created_at ? new Date(startup.grants[0].created_at).toLocaleDateString() : 'N/A'}</td>
                    <td>
                      <button
                        style={detailsButtonStyle}
                        onClick={() => toggleDetails(startup._id)}
                      >
                        {visibleDetails === startup._id ? 'Hide Details' : 'View Details'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Toggle startup details */}
            {startups.map(
              (startup) =>
                visibleDetails === startup._id && (
                  <div
                    key={startup._id}
                    style={{
                      marginTop: '20px',
                      border: '1px solid #007bff',
                      padding: '10px',
                      borderRadius: '5px',
                      backgroundColor: '#e9f5ff',
                    }}
                  >
                    <h3 style={{ color: '#007bff' }}>{startup.kyc?.company_name || 'N/A'} Details</h3>
                    <p><strong>Industry:</strong> {startup.kyc?.company_details?.industry || 'N/A'}</p>
                    <p><strong>Incorporation Date:</strong> {startup.kyc?.company_details?.incorporation_date ? new Date(startup.kyc.company_details.incorporation_date).toLocaleDateString() : 'N/A'}</p>
                    <p><strong>Website:</strong> {startup.kyc?.company_details?.website || 'N/A'}</p>
                    <p><strong>Contact Person:</strong> {startup.kyc?.contact_person?.name || 'N/A'}</p>
                    <p><strong>Contact Email:</strong> {startup.kyc?.contact_person?.email || 'N/A'}</p>
                    <p><strong>Contact Phone:</strong> {startup.kyc?.contact_person?.phone || 'N/A'}</p>
                    <p><strong>Grant Created At:</strong> {startup.grants?.[0]?.created_at ? new Date(startup.grants[0].created_at).toLocaleDateString() : 'N/A'}</p>
                    <p><strong>Other Field 1:</strong> {startup.otherField1 || 'N/A'}</p>
                    <p><strong>Other Field 2:</strong> {startup.otherField2 || 'N/A'}</p>
                    {/* You can keep adding other fields from the startup object */}
                  </div>
                )
            )}
          </div>
        )}

        {selectedTab === 'eir' && (
          <EIRRequests eirRequests={eirRequests} />
        )}

        {selectedTab === 'grants' && (
          <GrantApplicationComponent grantSchemes={grantRequests} />
        )}

        {selectedTab === 'messages' && (
          <StartupMessages />
        )}
      </div>
    </div>
  );
}

// Simple styling for the table
const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginBottom: '20px',
};

const navButtonStyle = {
  display: 'block',
  width: '100%',
  padding: '10px 20px',
  backgroundColor: '#6c757d',
  border: 'none',
  textAlign: 'left',
  cursor: 'pointer',
  fontSize: '16px',
  margin: '2px 0',
  color: '#fff',
  transition: 'background-color 0.2s',
};

const detailsButtonStyle = {
  padding: '8px 16px',
  backgroundColor: '#28a745',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '14px',
};

// Add hover effect for buttons
navButtonStyle[':hover'] = {
  backgroundColor: '#5a6268',
};

detailsButtonStyle[':hover'] = {
  backgroundColor: '#218838',
};

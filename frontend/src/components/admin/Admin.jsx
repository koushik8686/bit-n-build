import { useState } from 'react';
import EIRRequests from './EirRequests';
import GrantApplicationComponent from './GrantRequests';
import StartupMessages from './Messages';

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

  const grantSchemes=[
    // Sample data - replace this with actual data fetched from your backend
    {
      _id: '1',
      applicant: {
        name: 'John Doe',
        organization: 'Tech Innovators',
        contact_details: {
          email: 'john@techinnovators.com',
          phone: '123-456-7890',
          address: '123 Tech St, Innovation City, IN 12345'
        }
      },
      project_proposal: {
        project_title: 'AI for Good',
        description: 'Developing AI solutions to address social issues',
        objectives: ['Improve education access', 'Enhance healthcare delivery', 'Reduce carbon footprint'],
        budget: {
          total_funding_required: 500000,
          funding_breakdown: [
            { item: 'Research and Development', amount: 300000 },
            { item: 'Equipment', amount: 150000 },
            { item: 'Marketing', amount: 50000 }
          ]
        }
      },
      grant_status: {
        status: 'Applied',
        decision_date: new Date('2024-06-01')
      },
      created_at: new Date('2024-01-15')
    },
    {
      _id: '1',
      applicant: {
        name: 'John Doe',
        organization: 'Tech Innovators',
        contact_details: {
          email: 'john@techinnovators.com',
          phone: '123-456-7890',
          address: '123 Tech St, Innovation City, IN 12345'
        }
      },
      project_proposal: {
        project_title: 'AI for Good',
        description: 'Developing AI solutions to address social issues',
        objectives: ['Improve education access', 'Enhance healthcare delivery', 'Reduce carbon footprint'],
        budget: {
          total_funding_required: 500000,
          funding_breakdown: [
            { item: 'Research and Development', amount: 300000 },
            { item: 'Equipment', amount: 150000 },
            { item: 'Marketing', amount: 50000 }
          ]
        }
      },
      grant_status: {
        status: 'Applied',
        decision_date: new Date('2024-06-01')
      },
      created_at: new Date('2024-01-15')
    },
    {
      _id: '1',
      applicant: {
        name: 'John Doe',
        organization: 'Tech Innovators',
        contact_details: {
          email: 'john@techinnovators.com',
          phone: '123-456-7890',
          address: '123 Tech St, Innovation City, IN 12345'
        }
      },
      project_proposal: {
        project_title: 'AI for Good',
        description: 'Developing AI solutions to address social issues',
        objectives: ['Improve education access', 'Enhance healthcare delivery', 'Reduce carbon footprint'],
        budget: {
          total_funding_required: 500000,
          funding_breakdown: [
            { item: 'Research and Development', amount: 300000 },
            { item: 'Equipment', amount: 150000 },
            { item: 'Marketing', amount: 50000 }
          ]
        }
      },
      grant_status: {
        status: 'Applied',
        decision_date: new Date('2024-06-01')
      },
      created_at: new Date('2024-01-15')
    },
    {
      _id: '1',
      applicant: {
        name: 'John Doe',
        organization: 'Tech Innovators',
        contact_details: {
          email: 'john@techinnovators.com',
          phone: '123-456-7890',
          address: '123 Tech St, Innovation City, IN 12345'
        }
      },
      project_proposal: {
        project_title: 'AI for Good',
        description: 'Developing AI solutions to address social issues',
        objectives: ['Improve education access', 'Enhance healthcare delivery', 'Reduce carbon footprint'],
        budget: {
          total_funding_required: 500000,
          funding_breakdown: [
            { item: 'Research and Development', amount: 300000 },
            { item: 'Equipment', amount: 150000 },
            { item: 'Marketing', amount: 50000 }
          ]
        }
      },
      grant_status: {
        status: 'Applied',
        decision_date: new Date('2024-06-01')
      },
      created_at: new Date('2024-01-15')
    },
    {
      _id: '1',
      applicant: {
        name: 'John Doe',
        organization: 'Tech Innovators',
        contact_details: {
          email: 'john@techinnovators.com',
          phone: '123-456-7890',
          address: '123 Tech St, Innovation City, IN 12345'
        }
      },
      project_proposal: {
        project_title: 'AI for Good',
        description: 'Developing AI solutions to address social issues',
        objectives: ['Improve education access', 'Enhance healthcare delivery', 'Reduce carbon footprint'],
        budget: {
          total_funding_required: 500000,
          funding_breakdown: [
            { item: 'Research and Development', amount: 300000 },
            { item: 'Equipment', amount: 150000 },
            { item: 'Marketing', amount: 50000 }
          ]
        }
      },
      grant_status: {
        status: 'Applied',
        decision_date: new Date('2024-06-01')
      },
      created_at: new Date('2024-01-15')
    },
    // Add more sample grant schemes here if needed
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
    <EIRRequests dummyEirRequests={dummyEirRequests} />
)}


{selectedTab === 'grants' && (
  <GrantApplicationComponent 
  grantSchemes={grantSchemes} 
  />
)}

{selectedTab === 'messages' && (
  <StartupMessages/>
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


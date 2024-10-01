
import { useState } from 'react';

export default function GrantApplicationComponent({ grantSchemes }) {
  const [openApplicant, setOpenApplicant] = useState(null);
  const [openProject, setOpenProject] = useState(null);

  const toggleApplicantDropdown = (id) => {
    setOpenApplicant(openApplicant === id ? null : id);
  };

  const toggleProjectDropdown = (id) => {
    setOpenProject(openProject === id ? null : id);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Grant Scheme Applications</h1>
      {grantSchemes.map((scheme) => (
        <div key={scheme._id} className="border rounded-lg shadow-lg mb-4 p-4 bg-white">
          <h2 className="text-xl font-semibold cursor-pointer" onClick={() => toggleProjectDropdown(scheme._id)}>
            {scheme.project_proposal.project_title}
            <span className="ml-2">{openProject === scheme._id ? '▲' : '▼'}</span>
          </h2>
          <p className="text-gray-500">Submitted by {scheme.applicant.name} on {new Date(scheme.created_at).toLocaleDateString()}</p>
          
          {openProject === scheme._id && (
            <div className="mt-4 bg-gray-100 p-4 rounded-lg">
              <h3 className="font-medium">Project Proposal</h3>
              <p><strong>Description:</strong> {scheme.project_proposal.description}</p>
              <p><strong>Objectives:</strong></p>
              <ul className="list-disc list-inside ml-4">
                {scheme.project_proposal.objectives.map((objective, index) => (
                  <li key={index}>{objective}</li>
                ))}
              </ul>
              <p><strong>Total Funding Required:</strong> ${scheme.project_proposal.budget.total_funding_required.toLocaleString()}</p>
              <p><strong>Funding Breakdown:</strong></p>
              <ul className="list-disc list-inside ml-4">
                {scheme.project_proposal.budget.funding_breakdown.map((item, index) => (
                  <li key={index}>{item.item}: ${item.amount.toLocaleString()}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mt-4 border-t pt-4">
            <button className="text-xl font-semibold w-full text-left" onClick={() => toggleApplicantDropdown(scheme._id)}>
              Applicant Details
              <span className="ml-2">{openApplicant === scheme._id ? '▲' : '▼'}</span>
            </button>
            {openApplicant === scheme._id && (
              <div className="mt-2 bg-gray-100 p-4 rounded-lg">
                <h3 className="font-medium">Applicant Details</h3>
                <p><strong>Name:</strong> {scheme.applicant.name}</p>
                {scheme.applicant.organization && <p><strong>Organization:</strong> {scheme.applicant.organization}</p>}
                <p><strong>Email:</strong> {scheme.applicant.contact_details.email}</p>
                {scheme.applicant.contact_details.phone && <p><strong>Phone:</strong> {scheme.applicant.contact_details.phone}</p>}
                {scheme.applicant.contact_details.address && <p><strong>Address:</strong> {scheme.applicant.contact_details.address}</p>}
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-between items-center">
            <span className={`badge ${scheme.grant_status.status === 'Approved' ? 'bg-green-200' : 'bg-yellow-200'} px-2 py-1 rounded`}>
              {scheme.grant_status.status}
            </span>
            <div className="space-x-2">
              <button className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
              <button 
                className={`bg-blue-500 text-white px-3 py-1 rounded ${scheme.grant_status.status === 'Approved' ? 'opacity-50 cursor-not-allowed' : ''}`} 
                disabled={scheme.grant_status.status === 'Approved'}
              >
                {scheme.grant_status.status === 'Approved' ? 'Accepted' : 'Accept'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

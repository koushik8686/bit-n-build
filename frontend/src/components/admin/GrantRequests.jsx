import { useEffect, useState } from 'react';

export default function GrantApplicationComponent({ grantSchemes }) {
  const [openApplicant, setOpenApplicant] = useState(null);
  const [openProject, setOpenProject] = useState(null);
  const [updatedSchemes, setUpdatedSchemes] = useState(grantSchemes);

  const toggleProjectDropdown = (id) => {
    setOpenProject(openProject === id ? null : id);
  };

  const toggleApplicantDropdown = (id) => {
    setOpenApplicant(openApplicant === id ? null : id);
  };

  const updateGrantStatus = async (id, status, apiEndpoint) => {
    const isConfirmed = window.confirm(`Are you sure you want to mark this grant as ${status}?`);

    if (isConfirmed) {
      try {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ grantId: id, status }),
        });

        if (response.ok) {
          console.log(`Grant request ${status} successfully`);

          setUpdatedSchemes(prevSchemes =>
            prevSchemes.map(scheme =>
              scheme._id === id ? { ...scheme, grant_status: { status } } : scheme
            )
          );
        } else {
          console.error(`Failed to ${status.toLowerCase()} the grant request`);
        }
      } catch (error) {
        console.error(`An error occurred while ${status.toLowerCase()} the grant request:`, error);
      }
    }
  };

  const handleReject = (id) => updateGrantStatus(id, 'Rejected', 'admin/grant/reject');
  const handleAccept = (id) => updateGrantStatus(id, 'Approved', 'admin/grant/accept');
  const handleInProgress = (id) => updateGrantStatus(id, 'In Progress', 'admin/grant/progress');

  // Custom sorting function
  const sortSchemes = (schemes) => {
    const order = ['Applied', 'In Progress', 'Approved', 'Rejected'];
    return [...schemes].sort((a, b) => {
      return order.indexOf(a.grant_status.status) - order.indexOf(b.grant_status.status);
    });
  };

  // Effect to sort schemes whenever updatedSchemes changes
  useEffect(() => {
    setUpdatedSchemes(sortSchemes(grantSchemes));
  }, [grantSchemes]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Grant Scheme Applications</h1>

      {sortSchemes(updatedSchemes).map((scheme) => (
        <div key={scheme._id} className="border rounded-lg shadow-md mb-6 p-5 bg-white">
          <div className="flex justify-between items-center">
            <h2
              className="text-xl font-semibold cursor-pointer"
              onClick={() => toggleProjectDropdown(scheme._id)}
            >
              {scheme.project_proposal.project_title}
              <span className="ml-2">{openProject === scheme._id ? '▲' : '▼'}</span>
            </h2>
            <p className="text-gray-500">
              Submitted by {scheme.applicant.name} on{' '}
              {new Date(scheme.created_at).toLocaleDateString()}
            </p>
          </div>

          {openProject === scheme._id && (
            <div className="mt-4 bg-gray-100 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Project Proposal</h3>
              <p>
                <strong>Description:</strong> {scheme.project_proposal.description}
              </p>
              <p>
                <strong>Objectives:</strong>
              </p>
              <ul className="list-disc list-inside ml-4">
                {scheme.project_proposal.objectives.map((objective, index) => (
                  <li key={index}>{objective}</li>
                ))}
              </ul>
              <p className="mt-4">
                <strong>Total Funding Required:</strong> ${scheme.project_proposal.budget.total_funding_required.toLocaleString()}
              </p>
              <p>
                <strong>Funding Breakdown:</strong>
              </p>
              <ul className="list-disc list-inside ml-4">
                {scheme.project_proposal.budget.funding_breakdown.map((item, index) => (
                  <li key={index}>
                    {item.item}: ${item.amount.toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-4 border-t pt-4">
            <button
              className="text-xl font-semibold w-full text-left"
              onClick={() => toggleApplicantDropdown(scheme._id)}
            >
              Applicant Details
              <span className="ml-2">{openApplicant === scheme._id ? '▲' : '▼'}</span>
            </button>

            {openApplicant === scheme._id && (
              <div className="mt-2 bg-gray-100 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Applicant Details</h3>
                <p>
                  <strong>Name:</strong> {scheme.applicant.name}
                </p>
                {scheme.applicant.organization && (
                  <p>
                    <strong>Organization:</strong> {scheme.applicant.organization}
                  </p>
                )}
                <p>
                  <strong>Email:</strong> {scheme.applicant.contact_details.email}
                </p>
                {scheme.applicant.contact_details.phone && (
                  <p>
                    <strong>Phone:</strong> {scheme.applicant.contact_details.phone}
                  </p>
                )}
                {scheme.applicant.contact_details.address && (
                  <p>
                    <strong>Address:</strong> {scheme.applicant.contact_details.address}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center">
            <div className="flex-1">
              <span
                className={`px-3 py-1 rounded font-semibold ${
                  scheme.grant_status.status === 'Approved'
                    ? 'bg-green-200 text-green-800'
                    : scheme.grant_status.status === 'Rejected'
                    ? 'bg-red-200 text-red-800'
                    : 'bg-yellow-200 text-yellow-800'
                }`}
              >
                {scheme.grant_status.status}
              </span>
            </div>

            <div className="flex space-x-2">
              <button
                className={`bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded shadow-md transition-colors ${
                  scheme.grant_status.status === 'Rejected' || scheme.grant_status.status === 'Approved'
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
                onClick={() => handleReject(scheme._id)}
                disabled={scheme.grant_status.status === 'Rejected' || scheme.grant_status.status === 'Approved'}
              >
                Reject
              </button>

              <button
                className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded shadow-md transition-colors ${
                  scheme.grant_status.status === 'Approved' || scheme.grant_status.status === 'Rejected'
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
                onClick={() => handleAccept(scheme._id)}
                disabled={scheme.grant_status.status === 'Approved' || scheme.grant_status.status === 'Rejected'}
              >
                Accept
              </button>

              <button
                className={`bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-1 rounded shadow-md transition-colors ${
                  scheme.grant_status.status === 'In Progress' || scheme.grant_status.status === 'Approved' || scheme.grant_status.status === 'Rejected'
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
                onClick={() => handleInProgress(scheme._id)}
                disabled={scheme.grant_status.status === 'In Progress' || scheme.grant_status.status === 'Approved' || scheme.grant_status.status === 'Rejected'}
              >
                Mark as In Progress
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

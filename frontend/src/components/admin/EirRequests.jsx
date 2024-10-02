import React, { useEffect, useState } from 'react';

const EIRRequests = ({ eirRequests }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatedRequests, setUpdatedRequests] = useState(eirRequests);
  const [openRequest, setOpenRequest] = useState(null);
  const [disabledButtons, setDisabledButtons] = useState({});

  // Sync requests on prop update
  useEffect(() => {
    setUpdatedRequests(eirRequests.reverse());
  }, [eirRequests]);

  // Toggle details for a specific request
  const toggleRequestDetails = (id) => {
    setOpenRequest(openRequest === id ? null : id);
  };

  // Unified request handler for actions (accept, reject, in-progress)
  const handleRequestUpdate = async (actionType, requestId) => {
    setLoading(true);
    try {
      const apiEndpoint = `admin/eir/${actionType}`;
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId }),
      });

      if (!response.ok) throw new Error(`Failed to ${actionType} request`);

      const updatedRequest = await response.json();

      setUpdatedRequests((prev) =>
        prev.map((req) =>
          req._id === updatedRequest.updatedRequest._id ? updatedRequest.updatedRequest : req
        )
      );

      const disableConfig =
        actionType === 'in-progress'
          ? { inProgress: true }
          : { accept: true, reject: true, inProgress: true };

      setDisabledButtons((prev) => ({ ...prev, [requestId]: disableConfig }));
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Render request items
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">EIR Requests</h1>
      {error && <p className="text-red-500">{error}</p>}
      {loading && <p>Loading...</p>}

      {updatedRequests.map((request) => {
        const isDisabled = disabledButtons[request._id] || {};

        return (
          <div key={request._id} className="border rounded-lg shadow-md mb-6 p-5 bg-white">
            <div className="flex justify-between items-center">
              <h2
                className="text-xl font-semibold cursor-pointer"
                onClick={() => toggleRequestDetails(request._id)}
              >
                {request.entrepreneur?.name}'s Request
                <span className="ml-2">{openRequest === request._id ? '▲' : '▼'}</span>
              </h2>
              <p className="text-gray-500">
                Created on {new Date(request.created_at).toLocaleDateString()}
              </p>
            </div>

            {openRequest === request._id && (
              <div className="mt-4 bg-gray-100 p-4 rounded-lg">
                <p>
                  <strong>Entrepreneur:</strong> {request.entrepreneur?.name || 'N/A'}
                </p>
                <p>
                  <strong>Business Idea:</strong> {request.business_idea || 'N/A'}
                </p>
                <p>
                  <strong>Summary:</strong> {request.summary || 'N/A'}
                </p>
                <p>
                  <strong>Mentorship Startups:</strong>{' '}
                  {request.objectives?.mentorship_startups?.join(', ') || 'N/A'}
                </p>
                <p>
                  <strong>Personal Goals:</strong> {request.objectives?.personal_goals || 'N/A'}
                </p>
              </div>
            )}

            <div className="mt-4 flex items-center">
              <div className="flex-1">
                <span
                  className={`px-3 py-1 rounded font-semibold ${
                    request.status?.status === 'Accepted'
                      ? 'bg-green-200 text-green-800'
                      : request.status?.status === 'Rejected'
                      ? 'bg-red-200 text-red-800'
                      : 'bg-yellow-200 text-yellow-800'
                  }`}
                >
                  {request.status?.status || 'N/A'}
                </span>
              </div>

              <div className="flex space-x-2">
                <button
                  className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded shadow-md transition-colors ${
                    isDisabled.accept || isDisabled.reject || isDisabled.inProgress
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                  onClick={() => handleRequestUpdate('accept', request._id)}
                  disabled={isDisabled.accept || isDisabled.reject || isDisabled.inProgress}
                >
                  Accept
                </button>

                <button
                  className={`bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded shadow-md transition-colors ${
                    isDisabled.accept || isDisabled.reject || isDisabled.inProgress
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                  onClick={() => handleRequestUpdate('reject', request._id)}
                  disabled={isDisabled.accept || isDisabled.reject || isDisabled.inProgress}
                >
                  Reject
                </button>

                <button
                  className={`bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-1 rounded shadow-md transition-colors ${
                    isDisabled.inProgress ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => handleRequestUpdate('in-progress', request._id)}
                  disabled={isDisabled.inProgress}
                >
                  Mark as In Progress
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EIRRequests;

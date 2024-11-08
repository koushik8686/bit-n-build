import React, { useEffect, useState } from 'react';
import Loader from '../Loader';
import Toast from '../Toast';
import { AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Star } from 'lucide-react';
import ReviewsPopup from './ReviewsPopup'

const EIRRequests = ({ eirRequests }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [updatedRequests, setUpdatedRequests] = useState(eirRequests);
  const [openRequest, setOpenRequest] = useState(null);
  const [disabledButtons, setDisabledButtons] = useState({});
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (requestId) => {
    setOpenSections((prev) => ({
      ...prev,
      [requestId]: !prev[requestId],
    }));
  };

  useEffect(() => {
    setUpdatedRequests(eirRequests.reverse());
  }, [eirRequests]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const toggleRequestDetails = (id) => {
    setOpenRequest(openRequest === id ? null : id);
  };

  const handleRequestUpdate = async (actionType, requestId) => {
    setLoading(true);
    try {
      const apiEndpoint = `/admin/eir/update-status`;
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionType, requestId }),
      });

      if (!response.ok) throw new Error(`Failed to ${actionType} request`);

      const updatedRequest = await response.json();

      setUpdatedRequests((prev) =>
        prev.map((req) =>
          req._id === updatedRequest.updatedRequest._id ? updatedRequest.updatedRequest : req
        )
      );

      setDisabledButtons((prev) => ({
        ...prev,
        [requestId]: { ...prev[requestId], [actionType]: true },
      }));
      setToast({ type: 'success', message: `${actionType.charAt(0).toUpperCase() + actionType.slice(1)}d successfully!` });
      setError(null);
    } catch (err) {
      setToast({
        type: 'error',
        message: err.message || 'An unknown error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };
  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-green-200 text-green-800';
      case 'Rejected': return 'bg-red-200 text-red-800';
      case 'In Progress': return 'bg-yellow-200 text-yellow-800';
      case 'Short Listed': return 'bg-blue-200 text-blue-800';
      case 'Under Review': return 'bg-purple-200 text-purple-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {loading && <Loader />}
      <h1 className="text-3xl font-bold mb-6">EIR Requests</h1>

      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} />}
      </AnimatePresence>

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
                <p><strong>Entrepreneur:</strong> {request.entrepreneur?.name || 'N/A'}</p>
                <p><strong>Business Idea:</strong> {request.business_idea || 'N/A'}</p>
                <p><strong>Summary:</strong> {request.summary || 'N/A'}</p>
                <p><strong>Mentorship Startups:</strong> {request.objectives?.mentorship_startups?.join(', ') || 'N/A'}</p>
                <p><strong>Personal Goals:</strong> {request.objectives?.personal_goals || 'N/A'}</p>
              </div>
            )}

            <div className="mt-4 flex items-center">
              <div className="flex-1">
                <span
                  className={`px-3 py-1 rounded font-semibold ${getStatusColor(request.status?.status)}`}
                >
                  {request.status?.status || 'N/A'}
                </span>
                <button
                  className="text-lg font-semibold cursor-pointer flex items-center mt-4"
                  onClick={() => toggleSection(request._id)}
                >
                  Reviews
                  <span className="ml-2">
                    {openSections[request._id] ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </span>
                </button>
                {openSections[request._id] && (
                 <ReviewsPopup request ={request} toggle={toggleSection} reviews={request.reviews}/>
                )}
              </div>

              <div className="flex space-x-2">
                <button
                  className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded shadow-md transition-colors ${
                    isDisabled.approve ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => handleRequestUpdate('approve', request._id)}
                  disabled={isDisabled.approve}
                >
                  Accept
                </button>

                <button
                  className={`bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded shadow-md transition-colors ${
                    isDisabled.reject ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => handleRequestUpdate('reject', request._id)}
                  disabled={isDisabled.reject}
                >
                  Reject
                </button>

                <button
                  className={`bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded shadow-md transition-colors ${
                    isDisabled.shortlist ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => handleRequestUpdate('shortlist', request._id)}
                  disabled={isDisabled.shortlist}
                >
                  Mark Shortlisted
                </button>
                <a href={`/selectreviewers/${request._id}`}>
                  <button
                    className={`bg-gray-600 hover:bg-gray-700 text-white px-4 py-1 rounded shadow-md transition-colors ${
                      isDisabled.underReview ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    disabled={isDisabled.underReview}
                  >
                    Select Reviewers
                  </button>
                </a>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EIRRequests;

import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Toast from '../Toast';
import Loader from '../Loader';

const EIRApplications = () => {
  const [expandedApp, setExpandedApp] = useState(null);
  const reviewer = Cookies.get('reviewer');
  const [applications, setApplications] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [toast, setToast] = useState({ message: '', type: '' }); // Toast state

  const fetchEIRs = async () => {
    setIsLoading(true); // Show loader
    try {
      const response = await axios.get(`http://localhost:4000/review/${reviewer}/reviews`);
      const sortedApplications = response.data.sort((a, b) => {
        if (a.status.status === 'pending' && b.status.status !== 'pending') return -1;
        if (a.status.status !== 'pending' && b.status.status === 'pending') return 1;
        return 0;
      });
      setApplications(sortedApplications);
    } catch (error) {
      console.error(error);
      setToast({ message: 'Failed to load applications.', type: 'error' }); // Show error toast
    } finally {
      setIsLoading(false); // Hide loader
    }
  };

  useEffect(() => {
    fetchEIRs();
  }, []);

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmitReview = async (appId) => {
    setIsLoading(true); // Show loader while submitting review
    try {
      await axios.post(`http://localhost:4000/review/eir/${appId}/${reviewer}`, {
        rating,
        comment
      });
      setToast({ message: 'Review submitted successfully!', type: 'success' }); // Success toast
      setRating(0);
      setComment('');
      fetchEIRs(); // Refresh data
    } catch (error) {
      console.error('Error submitting review:', error);
      setToast({ message: 'Failed to submit review. Please try again.', type: 'error' }); // Error toast
    } finally {
      setIsLoading(false); // Hide loader
    }
  };

  const getStatusStyle = (status) => {
    return status === 'pending'
      ? 'bg-yellow-200 text-yellow-800'
      : 'bg-green-200 text-green-800';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-screen-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-purple-800">EIR Applications</h1>
      {isLoading && <Loader />} {/* Show loader while loading */}
      {toast.message && <Toast message={toast.message} type={toast.type} />} {/* Show toast */}

      {applications.map((app) => {
        const reviewStatus = app.reviews?.find(r => r.reviewer_id === reviewer)?.status || 'N/A';
        const isPending = reviewStatus === 'pending';

        return (
          <div key={app._id} className="bg-white shadow-lg rounded-lg mb-6">
            <div
              className="bg-gray-100 p-4 cursor-pointer flex justify-between items-center"
              onClick={() => setExpandedApp(expandedApp === app._id ? null : app._id)}
            >
              <span className="text-xl font-semibold">{app.startup_name}</span>
              <span className={`py-1 px-3 rounded-full text-sm ${getStatusStyle(reviewStatus)}`}>
                {reviewStatus}
              </span>
            </div>
            {expandedApp === app._id && (
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-purple-700 mt-4">Entrepreneur Details</h2>
                    <p><strong>Name:</strong> {app.entrepreneur.name}</p>
                    <p><strong>Email:</strong> {app.entrepreneur.email}</p>
                    <p><strong>Background:</strong> {app.entrepreneur.background}</p>
                    <p><strong>Industry Experience:</strong> {app.entrepreneur.industry_experience}</p>
                    <p><strong>Previous Ventures:</strong> {app.entrepreneur.previous_ventures.join(', ')}</p>

                    <h2 className="text-lg font-semibold text-purple-700 mt-4">Objectives</h2>
                    <p><strong>Mentorship Startups:</strong> {app.objectives.mentorship_startups.join(', ')}</p>
                    <p><strong>Personal Goals:</strong> {app.objectives.personal_goals}</p>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-purple-700 mt-4">Application Details</h2>
                    <p><strong>Startup ID:</strong> {app.startup_id}</p>
                    <p><strong>Created At:</strong> {formatDate(app.created_at)}</p>
                    {app.status.decision_date && (
                      <p><strong>Decision Date:</strong> {formatDate(app.status.decision_date)}</p>
                    )}
                  </div>
                </div>

                <div className="mt-8 border-t border-gray-200 pt-4">
                  <h2 className="text-lg font-semibold text-purple-700 mb-4">Submit Your Review</h2>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <div className="flex items-center">
                      <input
                        type="range"
                        min="0"
                        max="5"
                        step="0.5"
                        value={rating}
                        onChange={(e) => handleRatingChange(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        disabled={!isPending}
                      />
                      <span className="ml-2 text-lg font-semibold">{rating}</span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                    <textarea
                      id="comment"
                      rows="4"
                      className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
                      placeholder="Enter your review here..."
                      value={comment}
                      onChange={handleCommentChange}
                      disabled={!isPending}
                    ></textarea>
                  </div>
                  {isPending && (
                    <button
                      onClick={() => handleSubmitReview(app._id)}
                      className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition duration-300"
                    >
                      Submit Review
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default EIRApplications;

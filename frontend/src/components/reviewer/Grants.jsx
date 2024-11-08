import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const Grants = () => {
  const [expandedApp, setExpandedApp] = useState(null);
  const reviewer = Cookies.get('reviewer');
  const [applications, setApplications] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const fetchGrants = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/review/${reviewer}/grantreviews`);
      const sortedApplications = response.data.sort((a, b) => {
        if (a.grant_status.status === 'Under Review' && b.grant_status.status !== 'Under Review') return -1;
        if (a.grant_status.status !== 'Under Review' && b.grant_status.status === 'Under Review') return 1;
        return 0;
      });
      setApplications(sortedApplications);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchGrants();
  }, []);

  const getStatusStyle = (status) => {
    return status === 'Under Review'
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

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmitReview = async (appId) => {
    try {
      await axios.post(`http://localhost:4000/review/grants /${appId}/${reviewer}`, {
        rating,
        comment
      });
      alert('Review submitted successfully!');
      setRating(0);
      setComment('');
      fetchGrants(); // Refresh the data
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-purple-800">Grants Applications</h1>
      {applications.map((app) => {
        const isPending = app.grant_status.status === 'Under Review';
        return (
          <div key={app._id} className="bg-white shadow-lg rounded-lg mb-6">
            <div
              className="bg-gray-100 p-4 cursor-pointer flex justify-between items-center"
              onClick={() => setExpandedApp(expandedApp === app._id ? null : app._id)}
            >
              <span className="text-xl font-semibold">{app.project_proposal.project_title}</span>
              <span className={`py-1 px-3 rounded-full text-sm ${getStatusStyle(app.grant_status.status)}`}>
                {app.grant_status.status}
              </span>
            </div>
            {expandedApp === app._id && (
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-purple-700 mt-4">Applicant Details</h2>
                    <p><strong>Name:</strong> {app.applicant.name}</p>
                    <p><strong>Email:</strong> {app.applicant.contact_details.email}</p>
                    <p><strong>Phone:</strong> {app.applicant.contact_details.phone}</p>
                    <p><strong>Address:</strong> {app.applicant.contact_details.address}</p>
                    <p><strong>Organization:</strong> {app.applicant.organization}</p>
                    <p><strong>PAN:</strong> {app.applicant.pan}</p>
                    <p><strong>Aadhar Number:</strong> {app.applicant.aadhar_num}</p>

                    <h2 className="text-lg font-semibold text-purple-700 mt-4">Project Proposal</h2>
                    <p><strong>Title:</strong> {app.project_proposal.project_title}</p>
                    <p><strong>Description:</strong> {app.project_proposal.description}</p>
                    <p><strong>Objectives:</strong> {app.project_proposal.objectives.join(', ') || 'N/A'}</p>
                    <p><strong>Total Funding Required:</strong> ₹{app.project_proposal.budget.total_funding_required}</p>
                    <h3 className="text-md font-semibold text-purple-700 mt-2">Funding Breakdown</h3>
                    {app.project_proposal.budget.funding_breakdown.map((item) => (
                      <p key={item._id}>
                        <strong>{item.item}:</strong> ₹{item.amount}
                      </p>
                    ))}
                  </div>
                </div>

                {isPending && (
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
                      ></textarea>
                    </div>
                    <button
                      onClick={() => handleSubmitReview(app._id)}
                      className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition duration-300"
                    >
                      Submit Review
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Grants;

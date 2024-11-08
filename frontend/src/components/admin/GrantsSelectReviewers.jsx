'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Briefcase, Star, Check, X, Search } from 'lucide-react';
import Toast from '../Toast';
import Loader from '../Loader';
import { useParams } from 'react-router-dom';

export default function GrantsReviewerSelection({ params }) {
  const [GrantData, SetGrantData] = useState(null);
  const [reviewers, setReviewers] = useState([]);
  const [selectedReviewers, setSelectedReviewers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSelecting, setIsSelecting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const { id } = useParams();

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: '', type: '' });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const fetchGrantdata = async () => {
    try {
      const response = await fetch(`http://localhost:4000/admin/grant/${id}`);
      if (!response.ok) throw new Error('Failed to fetch EIR data');
      const data = await response.json();
      SetGrantData(data);
      setSelectedReviewers(data.reviews.map((r) => r.reviewer_id));
    } catch (error) {
      setToast({ show: true, message: error.message, type: 'error' });
    }
  };

  const fetchReviewers = async () => {
    try {
      const response = await fetch('http://localhost:4000/review/reviewers');
      if (!response.ok) throw new Error('Failed to fetch reviewers');
      const data = await response.json();
      setReviewers(data);
    } catch (error) {
      setToast({ show: true, message: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const submitReviewerData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/admin/grant/selectreviewer/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedReviewers),
      });
      setLoading(false);
      if (!response.ok) throw new Error('Failed to select reviewer');
      setToast({ type: 'success', message: 'Reviewer selected successfully!' });
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'An unknown error occurred.' });
    }
  };

  useEffect(() => {
    fetchGrantdata();
    fetchReviewers();
  }, []);

  const toggleReviewer = (reviewerId) => {
    setSelectedReviewers((prevSelected) =>
      prevSelected.includes(reviewerId)
        ? prevSelected.filter((id) => id !== reviewerId)
        : [...prevSelected, reviewerId]
    );
  };

  const toggleAllReviewers = () => {
    setSelectedReviewers(
      selectedReviewers.length === reviewers.length ? [] : reviewers.map((r) => r._id)
    );
  };

  const filteredReviewers = reviewers.filter((reviewer) =>
    reviewer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reviewer.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reviewer.about.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <nav className="bg-indigo-600 text-white py-4 px-6 shadow-md flex items-center justify-between">
        <h1 className="text-2xl font-bold">Grants Reviewer Selection</h1>
        <a href="/admin" className="text-teal-200 hover:underline">Back to Admin</a>
      </nav>

      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden mt-4">
        {loading ? (
          <Loader />
        ) : (
          <div className="flex flex-col md:flex-row">
            {/* Grant Data - Left Column */}
            <div className="md:w-1/3 p-6 border-r border-gray-200 space-y-4">
              <h2 className="text-2xl font-semibold text-indigo-700">Applicant Information</h2>
              {GrantData && (
                <div>
                  <p><strong>Name:</strong> {GrantData.applicant.name}</p>
                  <p><strong>Organization:</strong> {GrantData.applicant.organization}</p>
                  <p><strong>Contact:</strong> {GrantData.applicant.contact_details.phone}</p>
                  <p><strong>Email:</strong> {GrantData.applicant.contact_details.email}</p>
                  <p><strong>Address:</strong> {GrantData.applicant.contact_details.address}</p>
                  <p><strong>PAN:</strong> {GrantData.applicant.pan}</p>
                  <p><strong>Aadhar:</strong> {GrantData.applicant.aadhar_num}</p>
                </div>
              )}

              <h2 className="text-2xl font-semibold text-indigo-700 mt-6">Project Proposal Details</h2>
              {GrantData && (
                <div>
                  <p><strong>Title:</strong> {GrantData.project_proposal.project_title}</p>
                  <p><strong>Description:</strong> {GrantData.project_proposal.description}</p>
                  <p><strong>Funding Required:</strong> ₹{GrantData.project_proposal.budget.total_funding_required}</p>
                  <ul>
                    {GrantData.project_proposal.budget.funding_breakdown.map((item) => (
                      <li key={item._id}><strong>{item.item}:</strong> ₹{item.amount}</li>
                    ))}
                  </ul>
                  <p><strong>Status:</strong> {GrantData.grant_status.status}</p>
                </div>
              )}
            </div>

            {/* Reviewer Selection - Right Column */}
            <div className="md:w-2/3 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-indigo-700">Select Reviewers</h2>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Search reviewers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500"
                  />
                  <button
                    className="bg-teal-500 text-white px-4 py-2 rounded-lg"
                    onClick={toggleAllReviewers}
                  >
                    {selectedReviewers.length === reviewers.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
              </div>

              <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                {filteredReviewers.map((reviewer) => (
                  <div
                    key={reviewer._id}
                    className="flex items-center p-4 bg-gray-50 rounded-lg cursor-pointer"
                    onClick={() => toggleReviewer(reviewer._id)}
                  >
                    <div
                      className={`w-6 h-6 border-2 rounded-md ${
                        selectedReviewers.includes(reviewer._id) ? 'bg-purple-600' : 'border-gray-300'
                      } flex items-center justify-center`}
                    >
                      {selectedReviewers.includes(reviewer._id) && <Check className="text-white" size={16} />}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold">{reviewer.name}</h3>
                      <p className="text-sm">{reviewer.email}</p>
                      <p className="text-sm">{reviewer.organization}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="p-6 bg-gray-50 border-t">
          <motion.button
            className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={submitReviewerData}
          >
            Assign Selected Reviewers
          </motion.button>
        </div>
      </div>

      {toast.show && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

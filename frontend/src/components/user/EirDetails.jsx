import React, { useState } from 'react';
import './eirapplication.css';
import axios from 'axios';
import Cookie from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export default function EIRDetails({ eirList }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const startup = Cookie.get('startup');

  // Individual states for each form field
  const [startup_id] = useState(startup || '');
  const [entrepreneurName, setEntrepreneurName] = useState('');
  const [entrepreneurBackground, setEntrepreneurBackground] = useState('');
  const [entrepreneurIndustryExperience, setEntrepreneurIndustryExperience] = useState('');
  const [previousVentures, setPreviousVentures] = useState(['']);
  const [startupName, setStartupName] = useState('');
  const [mentorshipStartups, setMentorshipStartups] = useState(['']);
  const [personalGoals, setPersonalGoals] = useState('');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handlePreviousVenturesChange = (index, value) => {
    const updatedVentures = [...previousVentures];
    updatedVentures[index] = value;
    setPreviousVentures(updatedVentures);
  };

  const handleMentorshipStartupsChange = (index, value) => {
    const updatedMentorshipStartups = [...mentorshipStartups];
    updatedMentorshipStartups[index] = value;
    setMentorshipStartups(updatedMentorshipStartups);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create the structured formData
    const formData = {
      startup_id,
      entrepreneur: {
        name: entrepreneurName,
        background: entrepreneurBackground,
        industry_experience: entrepreneurIndustryExperience,
        previous_ventures: previousVentures,
      },
      startup_name: startupName,
      objectives: {
        mentorship_startups: mentorshipStartups,
        personal_goals: personalGoals,
      },
    };

    try {
      const response = await axios.post(`/submit/eir/${startup}`, formData);
      console.log('Form Data Submitted:', formData);
      closeModal();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while submitting the form. Please try again.');
    }
  };
  const getStatusClass = (status) => {
    switch (status) {
      case 'Applied':
        return 'text-yellow-500 font-bold'; // Highlight with yellow
      case 'Approved':
        return 'text-green-500 font-bold'; // Highlight with green
      case 'Rejected':
        return 'text-red-500 font-bold'; // Highlight with red
      case 'In Progress':
        return 'text-blue-500 font-bold'; // Highlight with blue
      case 'Completed':
        return 'text-purple-500 font-bold'; // Highlight with purple
      default:
        return 'text-gray-500';
    }
  };
  return (
    <>
      <div className="apply-button-container">
        <button
          className="apply-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={openModal}
        >
          Apply for EIR
        </button>
      </div>

      <div className="eir-container bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">EIR Application</h2>
        {eirList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eirList.map((eir, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-lg font-semibold mb-2">EIR Application #{index + 1}</h3>
              <p><strong>Startup Name:</strong> {eir.startup_name}</p>
              <h4 className="text-md font-semibold mt-4">Entrepreneur Information</h4>
              <p><strong>Name:</strong> {eir.entrepreneur.name}</p>
              <p><strong>Background:</strong> {eir.entrepreneur.background}</p>
              <p><strong>Industry Experience:</strong> {eir.entrepreneur.industry_experience || 'No industry experience.'}</p>
              <h4 className="text-md font-semibold mt-4">Previous Ventures</h4>
              {eir.entrepreneur.previous_ventures.length > 0 ? (
                <ul className="list-disc list-inside">
                  {eir.entrepreneur.previous_ventures.map((venture, index) => (
                    <li key={index}>{venture}</li>
                  ))}
                </ul>
              ) : (
                <p>No previous ventures.</p>
              )}

              {/* Objectives */}
              <h4 className="text-md font-semibold mt-4">Objectives</h4>
              <p><strong>Personal Goals:</strong> {eir.objectives.personal_goals || 'No goals provided.'}</p>

              {/* Mentorship Startups */}
              <h4 className="text-md font-semibold mt-4">Mentorship Startups</h4>
              {eir.objectives.mentorship_startups.length > 0 ? (
                <ul className="list-disc list-inside">
                  {eir.objectives.mentorship_startups.map((startup, index) => (
                    <li key={index}>{startup}</li>
                  ))}
                </ul>
              ) : (
                <p>No mentorship startups.</p>
              )}
              {/* Status */}
              <p className={`mt-4 ${getStatusClass(eir.status.status)}`}>
                <strong>Status:</strong> {eir.status.status}
              </p>

              {/* Interview Date if exists */}
              {eir.interview_date && (
                <p><strong>Interview Date:</strong> {new Date(eir.interview_date).toDateString()}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No EIR applications available.</p>
      )}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <h2 className="text-xl font-bold mb-4">EIR Application Form</h2>
              <div className="form-scroll">
                <form onSubmit={handleSubmit}>
                  <h3 className="font-bold mb-2">Entrepreneur Information</h3>

                  <div className="mb-4">
                    <label className="block text-gray-700">Name</label>
                    <input
                      type="text"
                      value={entrepreneurName}
                      onChange={(e) => setEntrepreneurName(e.target.value)}
                      className="border border-gray-300 p-2 w-full rounded"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700">Background</label>
                    <textarea
                      value={entrepreneurBackground}
                      onChange={(e) => setEntrepreneurBackground(e.target.value)}
                      className="border border-gray-300 p-2 w-full rounded"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700">Industry Experience</label>
                    <input
                      type="text"
                      value={entrepreneurIndustryExperience}
                      onChange={(e) => setEntrepreneurIndustryExperience(e.target.value)}
                      className="border border-gray-300 p-2 w-full rounded"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700">Previous Ventures</label>
                    {previousVentures.map((venture, index) => (
                      <input
                        key={index}
                        type="text"
                        value={venture}
                        onChange={(e) => handlePreviousVenturesChange(index, e.target.value)}
                        className="border border-gray-300 p-2 w-full rounded"
                      />
                    ))}
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700">Startup Name</label>
                    <input
                      type="text"
                      value={startupName}
                      onChange={(e) => setStartupName(e.target.value)}
                      className="border border-gray-300 p-2 w-full rounded"
                      required
                    />
                  </div>

                  <h3 className="font-bold mb-2">Objectives</h3>

                  <div className="mb-4">
                    <label className="block text-gray-700">Mentorship Startups</label>
                    {mentorshipStartups.map((startup, index) => (
                      <input
                        key={index}
                        type="text"
                        value={startup}
                        onChange={(e) => handleMentorshipStartupsChange(index, e.target.value)}
                        className="border border-gray-300 p-2 w-full rounded"
                      />
                    ))}
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700">Personal Goals</label>
                    <textarea
                      value={personalGoals}
                      onChange={(e) => setPersonalGoals(e.target.value)}
                      className="border border-gray-300 p-2 w-full rounded"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

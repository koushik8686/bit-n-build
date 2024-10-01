import React, { useState } from 'react';
import './eirapplication.css';


export default function EIRDetails({ eir }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    startup_id: eir.startup_id || '', 
    entrepreneur: {
      name: '',
      background: '',
      previous_ventures: [''], 
      industry_experience: '',
    },
    startup_name: '',
    objectives: {
      mentorship_startups: [''], 
      personal_goals: '',
    },
  });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e, section, field, index = null) => {
    const { name, value } = e.target;

    if (index !== null) {
      const updatedArray = [...formData[section][field]];
      updatedArray[index] = value;
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: updatedArray,
        },
      });
    } else {
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: value,
        },
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
    closeModal();

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
        <p><strong>Status:</strong> {eir.status}</p>
        {eir.interview_date && <p><strong>Interview Date:</strong> {new Date(eir.interview_date).toDateString()}</p>}

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
                      name="name"
                      value={formData.entrepreneur.name}
                      onChange={(e) => handleChange(e, 'entrepreneur', 'name')}
                      className="border border-gray-300 p-2 w-full rounded"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700">Background</label>
                    <textarea
                      name="background"
                      value={formData.entrepreneur.background}
                      onChange={(e) => handleChange(e, 'entrepreneur', 'background')}
                      className="border border-gray-300 p-2 w-full rounded"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700">Industry Experience</label>
                    <input
                      type="text"
                      name="industry_experience"
                      value={formData.entrepreneur.industry_experience}
                      onChange={(e) => handleChange(e, 'entrepreneur', 'industry_experience')}
                      className="border border-gray-300 p-2 w-full rounded"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700">Previous Ventures</label>
                    {formData.entrepreneur.previous_ventures.map((venture, index) => (
                      <input
                        key={index}
                        type="text"
                        value={venture}
                        onChange={(e) => handleChange(e, 'entrepreneur', 'previous_ventures', index)}
                        className="border border-gray-300 p-2 w-full rounded"
                      />
                    ))}
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Startup Name</label>
                    <input
                      type="text"
                      name="startup_name"
                      value={formData.startup_name}
                      onChange={(e) => handleChange(e, '', 'startup_name')}
                      className="border border-gray-300 p-2 w-full rounded"
                      required
                    />
                  </div>

                 
                  <h3 className="font-bold mb-2">Objectives</h3>
                  <div className="mb-4">
                    <label className="block text-gray-700">Mentorship Startups</label>
                    {formData.objectives.mentorship_startups.map((startup, index) => (
                      <input
                        key={index}
                        type="text"
                        value={startup}
                        onChange={(e) => handleChange(e, 'objectives', 'mentorship_startups', index)}
                        className="border border-gray-300 p-2 w-full rounded"
                      />
                    ))}
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700">Personal Goals</label>
                    <textarea
                      name="personal_goals"
                      value={formData.objectives.personal_goals}
                      onChange={(e) => handleChange(e, 'objectives', 'personal_goals')}
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

import React, { useState } from 'react';
import './grantschema.css'; // Import the CSS file

export default function GrantDetails({ grant }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    email: '',
    phone: '',
    address: '',
    project_title: '',
    description: '',
    total_funding_required: '',
    funding_breakdown: [{ item: '', amount: '' }],
  });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFundingChange = (index, e) => {
    const { name, value } = e.target;
    const updatedFundingBreakdown = [...formData.funding_breakdown];
    updatedFundingBreakdown[index][name] = value;
    setFormData({
      ...formData,
      funding_breakdown: updatedFundingBreakdown,
    });
  };

  const addFundingRow = () => {
    setFormData({
      ...formData,
      funding_breakdown: [...formData.funding_breakdown, { item: '', amount: '' }],
    });
  };

  const removeFundingRow = (index) => {
    const updatedFundingBreakdown = formData.funding_breakdown.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      funding_breakdown: updatedFundingBreakdown,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data Submitted:', formData);
    closeModal(); // Close the modal after form submission
  };

  return (
    <>
      {/* Navbar Placeholder */}
      <nav className="navbar">
        <h1>Grant Application Portal</h1>
      </nav>

      {/* Apply Button Positioned Below Navbar */}
      <div className="apply-button-container">
        <button
          className="apply-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={openModal}
        >
          Apply for Grant
        </button>
      </div>

      {/* Grant Application Details Div */}
      <div className="grant-container bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Grant Application</h2>
        <p><strong>Status:</strong> {grant.status}</p>
        <p><strong>Amount Requested:</strong> ${grant.amount_requested}</p>
        {grant.amount_approved && <p><strong>Amount Approved:</strong> ${grant.amount_approved}</p>}
        {grant.disbursal_date && <p><strong>Disbursal Date:</strong> {new Date(grant.disbursal_date).toDateString()}</p>}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 className="text-xl font-bold mb-4">Grant Application Form</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Applicant Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Organization</label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Project Title</label>
                <input
                  type="text"
                  name="project_title"
                  value={formData.project_title}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Project Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Total Funding Required</label>
                <input
                  type="number"
                  name="total_funding_required"
                  value={formData.total_funding_required}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 w-full rounded"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Funding Breakdown</label>
                {formData.funding_breakdown.map((fund, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      name="item"
                      value={fund.item}
                      onChange={(e) => handleFundingChange(index, e)}
                      className="border border-gray-300 p-2 w-1/2 rounded mr-2"
                      placeholder="Item"
                      required
                    />
                    <input
                      type="number"
                      name="amount"
                      value={fund.amount}
                      onChange={(e) => handleFundingChange(index, e)}
                      className="border border-gray-300 p-2 w-1/4 rounded mr-2"
                      placeholder="Amount"
                      required
                    />
                    <button
                      type="button"
                      className="bg-red-500 hover:bg-red-700 text-white p-2 rounded"
                      onClick={() => removeFundingRow(index)}
                    >
                      -
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="bg-green-500 hover:bg-green-700 text-white p-2 rounded"
                  onClick={addFundingRow}
                >
                  + Add Item
                </button>
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
      )}
    </>
  );
}

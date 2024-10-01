import React, { useState } from 'react';

export default function GrantDetails({ grant }) {
  const [formData, setFormData] = useState({}); // {{ edit_1 }}

  const handleSubmit = (e) => { // {{ edit_2 }}
    e.preventDefault();
    // Handle form submission logic here
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Grant Application</h2>
      <p><strong>Status:</strong> {grant.status}</p>
      <p><strong>Amount Requested:</strong> ${grant.amount_requested}</p>
      {grant.amount_approved && <p><strong>Amount Approved:</strong> ${grant.amount_approved}</p>}
      {grant.disbursal_date && <p><strong>Disbursal Date:</strong> {new Date(grant.disbursal_date).toDateString()}</p>}
      
      <form onSubmit={handleSubmit}> {/* {{ edit_3 }} */}
        {/* Add form fields here as needed */}
        <input type='text' name='' />
        <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded">Submit</button> {/* {{ edit_4 }} */}
      </form>
    </div>
  );
}

import React from 'react';

export default function StartupDetails({ kyc, progress }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Startup Details</h2>
      <p><strong>Company Name:</strong> {kyc.company_name}</p>
      <p><strong>Address:</strong> {kyc.address}</p>
      <p><strong>Contact Person:</strong> {kyc.contact_person.name}</p>
      <p><strong>Email:</strong> {kyc.contact_person.email}</p>
      <p><strong>Phone:</strong> {kyc.contact_person.phone}</p>
      <p><strong>Industry:</strong> {kyc.company_details.industry}</p>
      <p><strong>Website:</strong> <a href={kyc.company_details.website} target="_blank" rel="noreferrer">{kyc.company_details.website}</a></p>

      {/* <h3 className="text-xl font-bold mt-6">Latest Progress</h3> */}
      {/* {progress.map((monthData, index) => (
        <div key={index} className="mt-4">
          <h4 className="text-lg font-semibold">{monthData.month}</h4>
          <p><strong>Milestone:</strong> {monthData.milestones[0].title} - {monthData.milestones[0].description}</p>
          <p><strong>Issues:</strong> {monthData.issues_faced[0]?.description || 'No issues reported'}</p>
          <p><strong>Revenue:</strong> ${monthData.financials.revenue}</p>
          <p><strong>Expenses:</strong> ${monthData.financials.expenses}</p>
        </div>
      ))} */}
    </div>
  );
}

import React, { useState } from 'react';
import Navbar from './Navbar';
import StartupDetails from './Startupdetails';
import EIRDetails from './EirDetails';
import GrantDetails from './GrantDetails';
import Messages from './Messages';
import MonthlyProgress from './Monthlyorogress';

// Mock data for demonstration
const startupData = {
  kyc: {
    company_name: "TechInnovate",
    address: "123 Innovation Way",
    contact_person: {
      name: "John Doe",
      email: "johndoe@techinnovate.com",
      phone: "123-456-7890",
    },
    company_details: {
      incorporation_date: new Date("2020-01-01"),
      industry: "Technology",
      website: "https://techinnovate.com",
    },
  },
  progress: [
    {
      month: "September",
      milestones: [
        { title: "Launched Product", description: "We successfully launched the MVP", achieved_date: new Date("2023-09-01") },
      ],
      issues_faced: [
        { description: "Server outages" },
      ],
      financials: {
        revenue: 100000,
        expenses: 75000,
      },
    },
  ],
  messages: [
    {
      message: "Your grant application has been approved!",
      date_sent: new Date("2023-09-28"),
    },
  ],
  grants: {
    eir_application: {
      status: "Shortlisted",
      interview_date: new Date("2023-11-15"),
    },
    grant_application: {
      amount_requested: 50000,
      amount_approved: 40000,
      status: "Approved",
      disbursal_date: new Date("2023-12-01"),
    },
  },
};

export default function StartupHomepage() {
  const [activeComponent, setActiveComponent] = useState('details');

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar setActiveComponent={setActiveComponent} />

      <main className="container mx-auto px-4 py-8 flex-grow">
        {activeComponent === 'details' && <StartupDetails kyc={startupData.kyc} progress={startupData.progress} />}
        {activeComponent === 'eir' && <EIRDetails eir={startupData.grants.eir_application} />}
        {activeComponent === 'grant' && <GrantDetails grant={startupData.grants.grant_application} />}
        {activeComponent === 'messages' && <Messages messages={startupData.messages} />}
        {activeComponent === 'monthly' && <MonthlyProgress progress={startupData.progress} />}
      </main>

      <footer className="bg-gray-900 text-white py-4 text-center">
        © 2023 StartupHub. All rights reserved.
      </footer>
    </div>
  );
}

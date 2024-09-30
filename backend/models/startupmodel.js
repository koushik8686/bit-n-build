const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// KYC Schema for Startups
const StartupKYCSchema = new Schema({
  company_name: { type: String, required: true },
  address: { type: String, required: true },
  contact_person: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  company_details: {
    incorporation_date: { type: Date },
    industry: { type: String },
    website: { type: String }
  },
  created_at: { type: Date, default: Date.now }
});

// Progress Tracking Schema
const ProgressSchema = new Schema({
  month: { type: String, required: true },
  milestones: [{
    title: { type: String, required: true },
    description: { type: String },
    achieved_date: { type: Date }
  }],
  issues_faced: [{
    description: { type: String }
  }],
  financials: {
    revenue: { type: Number },
    expenses: { type: Number }
  },
  updated_at: { type: Date, default: Date.now }
});


// Report Collection Schema (monthly)
const ReportSchema = new Schema({
  report_date: { type: Date, default: Date.now },
  summary: { type: String },
  detailed_report: { type: String },
});

// Messaging/Notification Schema
const MessageSchema = new Schema({
  message: { type: String, required: true },
  date_sent: { type: Date, default: Date.now },
  recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Startup' }]
});

// EIR & Grant Scheme Management Schema
const GrantSchema = new Schema({
  eir_application: {
    status: { type: String, enum: ['Applied', 'Shortlisted', 'Selected', 'Rejected'], default: 'Applied' },
    interview_date: { type: Date },
  },
  grant_application: {
    amount_requested: { type: Number },
    amount_approved: { type: Number },
    status: { type: String, enum: ['Applied', 'Approved', 'Rejected'], default: 'Applied' },
    disbursal_date: { type: Date }
  },
  created_at: { type: Date, default: Date.now }
});

// Main Startup Schema
const StartupSchema = new Schema({
  kyc: StartupKYCSchema,
  progress: [ProgressSchema],
  reports: [ReportSchema],
  messages: [MessageSchema],
  grants: [GrantSchema]
});

module.exports = mongoose.model('Startup', StartupSchema);
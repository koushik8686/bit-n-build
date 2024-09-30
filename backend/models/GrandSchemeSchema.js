const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GrantSchemeSchema = new Schema({
  applicant: {
    name: { type: String, required: true },                      // Name of the applicant or organization
    organization: { type: String },                              // Name of the organization (if applicable)
    contact_details: {                                           
      email: { type: String, required: true },                   // Applicant's email
      phone: { type: String },                                   // Applicant's phone number
      address: { type: String }                                  // Applicant's address
    }
  },
  project_proposal: {
    project_title: { type: String, required: true },             // Title of the project
    description: { type: String, required: true },               // Detailed description of the project
    objectives: [{ type: String }],                              // List of objectives
    timeline: {
      start_date: { type: Date, required: true },                // Project start date
      end_date: { type: Date, required: true }                   // Project end date
    },
    budget: {
      total_funding_required: { type: Number, required: true },  // Total amount of funding needed
      funding_breakdown: [{                                      // Breakdown of how the funding will be used
        item: { type: String },
        amount: { type: Number }
      }]
    }
  },
  financial_information: {
    projected_revenue: { type: Number },                         // Expected revenue from the project (if applicable)
    current_funding: { type: Number },                           // Current funding received from other sources
  },
  progress_reporting: [{
    report_title: { type: String },                              // Title of the progress report
    report_date: { type: Date, default: Date.now },              // Date of report submission
    milestones_achieved: [{                                      // List of milestones achieved during the project
      milestone: { type: String },
      achieved_date: { type: Date }
    }],
    financial_report: {                                          // Detailed financial report
      amount_spent: { type: Number },
      remaining_funds: { type: Number }
    }
  }],
  grant_status: {
    status: { type: String, enum: ['Applied', 'Approved', 'Rejected', 'In Progress', 'Completed'], default: 'Applied' }, // Status of the grant
    decision_date: { type: Date }                                // Date of the grant decision
  },
  created_at: { type: Date, default: Date.now }                  // Date when the grant application was created
});

module.exports = mongoose.model('GrantScheme', GrantSchemeSchema);
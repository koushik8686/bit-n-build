const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GrantSchemeSchema = new Schema({
  startup_id: String,          // Startup ID for identification
  applicant: {
    name: { type: String, required: true },                      // Name of the applicant or organization
    organization: { type: String },
    pan:String, 
    aadhar_num:String,                             // Name of the organization (if applicable)
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
    budget: {
      total_funding_required: { type: Number, required: true },  // Total amount of funding needed
      funding_breakdown: [{                                      // Breakdown of how the funding will be used
        item: { type: String },
        amount: { type: Number }
      }]
    }
  },
  grant_status: {
    status: { type: String, enum: ['Submitted', 'Approved', 'Rejected', 'Short Listed', 'Under Review'], default: 'Submitted' }, // Status of the grant
    decision_date: { type: Date }                                // Date of the grant decision
  },
  reviews:[{
    reviewer_id: { type: String},
    reviewer_name: { type: String },
    reviewer_email: { type: String },
    status:String,
    reviewer_organization: { type: String},
    review_date: { type: Date },
    rating: { type: Number },
    comments: [{ type: String }]    
  }],
  created_at: { type: Date, default: Date.now }                  // Date when the grant application was created
});

module.exports = mongoose.model('GrantScheme', GrantSchemeSchema);
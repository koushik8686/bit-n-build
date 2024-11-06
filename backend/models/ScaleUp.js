const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GrantSchemeSchema = new Schema({
  startup_id: String,          // Startup ID for identification
  applicant: {
    name: { type: String, required: true },                      // Name of the applicant or organization
    organization: { type: String },                              // Name of the organization (if applicable)
    contact_details: {                                           
      email: { type: String, required: true },                   // Applicant's email
      phone: { type: String },                                   // Applicant's phone number
      address: { type: String }                                  // Applicant's address
    }
  },
  description:String,
  grant_status: {
    status: { type: String, enum: ['Submitted', 'Approved', 'Rejected', 'Short Listed', 'Under Review'], default: 'Submitted' }, // Status of the grant
    decision_date: { type: Date }                                // Date of the grant decision
  },
  reviews:[{
    reviewer_id: { type: String},
    reviewer_name: { type: String },
    reviewer_name_type: { type: String},
    review_date: { type: Date },
    rating: { type: Number },
    comments: [{ type: String }]    
  }],
  created_at: { type: Date, default: Date.now }                  // Date when the grant application was created
});

module.exports = mongoose.model('GrantScheme', GrantSchemeSchema);
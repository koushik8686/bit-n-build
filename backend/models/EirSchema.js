const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EIRSchema = new Schema({
  startup_id: { type: String },         
  startup_name: { type: String, required: true },            // Name of the startup// Startup ID for identification
  entrepreneur: {
    name: { type: String, required: true },                    // Entrepreneur's name
    background: { type: String, required: true },   
    email:{type:String , required:true},       // Description of experience or expertise
    previous_ventures: [{ type: String }],                     // List of previous ventures or startups
    industry_experience: { type: String },                     // Industry the entrepreneur has experience in
  },
  mentor:{
    mentor_name: { type: String },
    mentor_background: { type: String },
    mentor_experience: { type: String },
    mentor_industry_experience: { type: String },
    mentor_previous_ventures: [{ type: String }]  // List of previous mentorship experiences or startups
  },
  iiits_mentor:{ 
    mentor_name: { type: String },
    mentor_background: { type: String },
    mentor_experience: { type: String },
    mentor_industry_experience: { type: String },
    mentor_previous_ventures: [{ type: String }]  // List of previous mentorship experiences or startups
  },
  objectives: {
    mentorship_startups: [{ type: String }],                   // List of startups they are mentoring
    personal_goals: { type: String },                          // Personal goals during the program
  },
  status: {
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
  created_at: { type: Date, default: Date.now }                // Date when the EIR program was started
});

module.exports = mongoose.model('EIR', EIRSchema);

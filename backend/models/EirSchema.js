const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EIRSchema = new Schema({
  startup_id: { type: String },         
  startup_name: { type: String, required: true },            // Name of the startup// Startup ID for identification
  entrepreneur: {
    name: { type: String, required: true },                    // Entrepreneur's name
    background: { type: String, required: true },              // Description of experience or expertise
    previous_ventures: [{ type: String }],                     // List of previous ventures or startups
    industry_experience: { type: String },                     // Industry the entrepreneur has experience in
  },
  objectives: {
    mentorship_startups: [{ type: String }],                   // List of startups they are mentoring
    personal_goals: { type: String },                          // Personal goals during the program
  },
  status: {
    status: { type: String, enum: ['Applied', 'Approved', 'Rejected', 'In Progress', 'Completed'], default: 'Applied' }, // Status of the grant
    decision_date: { type: Date }                                // Date of the grant decision
  },
  created_at: { type: Date, default: Date.now }                // Date when the EIR program was started
});

module.exports = mongoose.model('EIR', EIRSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EIRSchema = new Schema({
  startup_id: { type: String },                                 // Startup ID for identification
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
  startup_progress: {
    startup_name: { type: String, required: true },            // Name of the startup
    current_stage: { type: String, enum: ['Idea', 'MVP', 'Scaling', 'Revenue Generating'], default: 'Idea' } // Current stage of the startup
  },
  created_at: { type: Date, default: Date.now }                // Date when the EIR program was started
});

module.exports = mongoose.model('EIR', EIRSchema);

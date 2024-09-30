const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EIRSchema = new Schema({
  startup_id:String,
  entrepreneur: {
    name: { type: String, required: true },                    // Entrepreneur's name
    background: { type: String, required: true },               // Description of experience or expertise
    previous_ventures: [{ type: String }],                      // List of previous ventures or startups
    industry_experience: { type: String },                      // Industry the entrepreneur has experience in
  },
  objectives: {
    mentorship_startups: [{ type: String }],                    // List of startups they are mentoring
    personal_goals: { type: String },                           // Goals they aim to achieve during the program
  },
  startup_progress: [{
    startup_name: { type: String, required: true },             // Name of the startup
    milestones: [{                                              // Milestones achieved under EIR’s mentorship
      title: { type: String },
      achieved_date: { type: Date }
    }],
    current_stage: { type: String, enum: ['Idea', 'MVP', 'Scaling', 'Revenue Generating'], default: 'Idea' }
  }],
  impact: {
    success_stories: [{                                         // Success stories from EIR mentorship
      description: { type: String },
      date: { type: Date }
    }],
    outcome_metrics: {
      revenue_growth: { type: Number },                         // Growth in revenue in percentage
      user_growth: { type: Number },                            // Growth in users or customers in percentage
    }
  },
  created_at: { type: Date, default: Date.now }                 // Date when the EIR program was started
});

module.exports = mongoose.model('EIR', EIRSchema);
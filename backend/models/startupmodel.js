const mongoose = require('mongoose');

// Define the schema for startup
const startupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  companyName: { type: String, required: true },
  industry: { type: String, required: true },
  website: { type: String },
  description: { type: String },
  foundedYear: { type: Number },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  profilePicture: { type: String },
  status: { type: String },
  product_development: {
    features_released: [
      {
        feature_name: { type: String },
        description: { type: String },
        release_date: { type: Date }
      }
    ],
    bugs_fixed: { type: Number },
  },
  user_growth_metrics: {
    monthly_active_users: { type: Number },
    new_signups: { type: Number },
    user_retention_rate: { type: String },
  },
  customer_acquisition: {
    website_traffic: {
      total_visits: { type: Number },
      unique_visitors: { type: Number },
      returning_visitors: { type: Number }
    },
    conversion_rate: { type: String },
    customer_acquisition_cost: { type: String },
    acquisition_channels: {
      organic_search: { type: String },
      paid_ads: { type: String },
      referrals: { type: String },
      social_media: { type: String }
    }
  },
  financial_metrics: {
    monthly_recurring_revenue: { type: String },
    annual_recurring_revenue: { type: String },
    customer_lifetime_value: { type: String },
    burn_rate: { type: String },
  },
  marketing_and_sales: {
    email_campaign_performance: {
      open_rate: { type: String },
      click_through_rate: { type: String },
      conversions: { type: Number }
    }
  },
  operational_efficiency: {
    team_size: {
      total_employees: { type: Number },
      new_hires: { type: Number },
      departures: { type: Number }
    },
    tasks_completed: { type: Number },
    backlog_tasks: { type: Number },
    time_to_fix_issues: { type: String },
    customer_support: {
      support_tickets_opened: { type: Number },
      support_tickets_resolved: { type: Number },
      first_response_time: { type: String }
    }
  },
  security_and_compliance: {
    security_incidents: { type: Number },
    compliance_updates: { type: String },
    data_breaches: { type: Number },
    system_vulnerabilities: { type: Number }
  },
  milestones_and_goals: {
    milestones_achieved: [{ type: String }],
  },
  // Monthly progress tracking
  monthprogress: [
    {
      month: { type: String },
      year: { type: Number },
      revenue: { type: Number },
      profit: { type: Number },
      number_of_users: { type: Number },
      growth_rate: { type: Number },
      document: { type: String },
      product_development: {
        features_released: [
          {
            feature_name: { type: String },
            description: { type: String },
            release_date: { type: Date }
          }
        ],
        bugs_fixed: { type: Number },
        performance_improvements: {
          response_time: { type: String },
          page_load_speed: { type: String },
          downtime: { type: String }
        }
      },
      user_metrics: {
        active_users: { monthly: { type: Number } },
        new_signups: { type: Number },
        user_feedback: {
          positive_feedback: { type: Number },
          negative_feedback: { type: Number }
        }
      },
      customer_acquisition: {
        website_traffic: {
          total_visits: { type: Number }
        },
        acquisition_channels: {
          organic_search: { type: String },
          paid_ads: { type: String },
          referrals: { type: String },
          social_media: { type: String }
        }
      },
      financial_metrics: {
        monthly_recurring_revenue: { type: String },
        average_revenue_per_user: { type: String },
        customer_lifetime_value: { type: String },
        burn_rate: { type: String }
      },
      marketing_and_growth: {
        social_media_growth: {
          facebook: {
            followers: { type: Number },
            engagement_rate: { type: String }
          },
          twitter: {
            followers: { type: Number },
            engagement_rate: { type: String }
          }
        },
        email_campaign_performance: {
          open_rate: { type: String },
          click_through_rate: { type: String },
          conversions: { type: Number }
        },
        referral_traffic: { type: String }
      },
      sales: {
        new_paid_customers: { type: Number },
        conversion_rate: { type: String },
        sales_pipeline: {
          leads_generated: { type: Number },
          leads_converted: { type: Number }
        }
      },
      customer_support: {
        support_tickets: {
          opened: { type: Number },
          resolved: { type: Number }
        },
        first_response_time: { type: String },
        customer_satisfaction_score: { type: String },
        knowledge_base_utilization: { type: String }
      },
      security_and_compliance: {
        security_incidents: { type: Number },
        compliance_updates: { type: String }
      },
      milestones_and_future_plans: {
        milestones_achieved: [{ type: String }],
        next_month_goals: [{ type: String }]
      }
    }
  ]
},
{ timestamps: true });

const StartupModel = mongoose.model('Startup', startupSchema);

module.exports = { startupSchema, StartupModel };
